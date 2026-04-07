// src/content.js

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "FETCH_JIRA_INFO") {
    // 1. 取得 Jira 主票的標題
    const titleEl = document.querySelector('h1[data-test-id="issue.views.issue-base.foundation.summary.heading"]')
      || document.querySelector('h1');
    const title = titleEl ? titleEl.innerText.trim() : "";

    // 2. 解析 Redmine ID
    let redmineId = null;
    const match = title.match(/#(\d+)/);

    if (match) {
      redmineId = match[1]; // 從標題中找出 #8778
    } else {
      // 嘗試從自定義欄位讀取
      const redmineField = document.querySelector('[data-testid="issue.views.field.single-line-text.read-view.customfield_10124"]');
      if (redmineField) {
        redmineId = redmineField.innerText.trim();
      }
    }

    // 3. 取得所有的子票 key (強化版)
    let subtaskKeys = [];

    // 彙整 Jira 常見的子票面板容器
    const containerSelectors = [
      '[data-test-id*="child-issues-panel"]',
      '[data-testid*="child-issues-panel"]',
      '#issue-tree',
      '.subtask-table-container',
      '[data-component-selector="jira-issue-view-subtasks-tree"]',
      '[data-testid="issue-line-item-base"]'
    ];

    let foundLinks = [];
    for (const selector of containerSelectors) {
      const container = document.querySelector(selector);
      if (container) {
        // 在子票容器內搜尋連往 Jira ticket 的連結
        foundLinks = Array.from(container.querySelectorAll('a[href*="/browse/"]'));
        if (foundLinks.length > 0) break;
      }
    }

    // fallback 暴力搜尋: 若找不到容器，直接找所有帶有 child-issue-item 或類似屬性的 <a>
    if (foundLinks.length === 0) {
      const fallbackQuery = [
        'a[data-test-id*="issue-item"]',
        'a[data-testid*="issue-item"]',
        'a[data-testid*="issue-key-cell"]', // 包含 native-issue-table.common.ui.issue-cells.issue-key...
        'a[data-test-id*="issue-key-cell"]'
      ].join(', ');

      foundLinks = Array.from(document.querySelectorAll(fallbackQuery))
        .filter(a => a.href && a.href.includes('/browse/'));
    }

    subtaskKeys = foundLinks.map(link => {
      const parts = link.href.split('/');
      return parts[parts.length - 1].split('?')[0]; // 取 OW-123，過濾可能的 Query Params
    });

    // 去重複與過濾不標準的票號格式，確保是 "專案代碼-數字" (例如 PROJ-123)
    subtaskKeys = [...new Set(subtaskKeys)].filter(key => /^[A-Z0-9]+-\d+$/.test(key));

    sendResponse({
      title,
      redmineId,
      subtaskKeys
    });
  }

  if (request.action === "INJECT_DESCRIPTION") {
    const content = request.content;
    (async () => {
      try {
        // Step 1: 看看 description 區塊是否已經在編輯中
        let editor = document.querySelector('[data-editor-container-id="issue-description-editor"] [contenteditable="true"]')
          || document.querySelector('[data-testid="issue.views.field.rich-text.description"] [contenteditable="true"]')
          || document.querySelector('[data-test-id="issue.views.field.rich-text.description"] [contenteditable="true"]')
          || document.querySelector('.ProseMirror[contenteditable="true"]');

        // Step 2: 如果編輯器尚未開啟，就模擬點擊來開啟
        if (!editor) {
          const clickTarget = document.querySelector('[data-editor-container-id="issue-description-editor"]')
            || document.querySelector('[data-testid="issue.views.field.rich-text.description"]')
            || document.querySelector('[data-component-selector="jira.issue-view.common.inline-edit.compact-wrapper-control"]')
            || document.querySelector('[data-test-id="issue.views.field.rich-text.description"]')
            || document.querySelector('[data-testid*="description"][role="presentation"]');

          if (clickTarget) {
            clickTarget.click();
            console.log(">>> [Debug] 已點擊 Description 區塊，等待編輯器載入...");
            // 給 Jira 一點時間載入編輯器
            await new Promise(r => setTimeout(r, 1000));
            editor = document.querySelector('[data-editor-container-id="issue-description-editor"] [contenteditable="true"]')
              || document.querySelector('[data-testid="issue.views.field.rich-text.description"] [contenteditable="true"]')
              || document.querySelector('.ProseMirror[contenteditable="true"]')
              || document.querySelector('[contenteditable="true"]');
          }
        }

        if (!editor) {
          sendResponse({ success: false, error: '找不到 Description 編輯器，請先點擊一下 Description 區塊開啟編輯後再試。' });
          return;
        }

        // Step 3: 聚焦並全選現有內容
        editor.focus();
        await new Promise(r => setTimeout(r, 200));
        editor.dispatchEvent(new KeyboardEvent('keydown', { key: 'a', ctrlKey: true, bubbles: true }));
        document.execCommand('selectAll', false, null);
        await new Promise(r => setTimeout(r, 100));

        // Step 4: 模擬貼上 (Jira 的 ProseMirror 對 clipboard paste 事件響應最可靠)
        const clipboardData = new DataTransfer();
        clipboardData.setData('text/plain', content);
        const pasteEvent = new ClipboardEvent('paste', { clipboardData, bubbles: true, cancelable: true });
        editor.dispatchEvent(pasteEvent);
        await new Promise(r => setTimeout(r, 300));

        // Fallback: 若 paste 沒有效果，用 execCommand 直接插入
        if (editor.innerText.trim().length < 5) {
          document.execCommand('insertText', false, content);
        }

        sendResponse({ success: true });
      } catch (e) {
        sendResponse({ success: false, error: e.message });
      }
    })();
    return true; // 保持異步通訊通道開啟
  }

  return true; // 保持異步通訊通道開啟
});

