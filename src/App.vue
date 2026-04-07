<template>
  <div class="min-h-screen p-5 space-y-5 bg-gray-900 text-gray-100">
    <h1 class="text-xl font-bold border-b border-gray-700 pb-3 text-white flex items-center gap-2">
      Jira 內容整理工具
    </h1>

    <!-- API Key 設定區塊 -->
    <div class="bg-gray-800 p-4 rounded-lg border border-gray-700 shadow-sm text-sm transition-all">
      <details>
        <summary class="font-bold text-gray-300 cursor-pointer hover:text-blue-400 outline-none select-none">
          ⚙️ 設定 (API Keys)
        </summary>
        <div class="mt-4 flex flex-col gap-4">
          <div>
            <div class="flex justify-between items-center mb-1.5">
              <label class="block text-xs font-bold text-gray-400">Redmine API Key</label>
              <span class="text-[10px] text-blue-400 opacity-80 italic">提示：前往「我的帳號」側邊欄取得</span>
            </div>
            <input v-model="redmineApiKey" type="password" placeholder="若遇 401 錯誤，請從 Redmine > 我的帳號取得" class="w-full p-2 bg-gray-900 border border-gray-600 rounded text-xs text-gray-100 placeholder-gray-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-shadow" />
          </div>

          <div class="border-t border-gray-700 pt-4">
            <label class="block text-xs font-bold text-gray-400 mb-3 uppercase tracking-wider">🤖 選擇 AI 模型</label>

            <div class="grid grid-cols-2 gap-2 mb-4">
              <!-- Gemini -->
              <div class="relative">
                <input type="radio" id="ai-gemini" value="gemini" v-model="selectedAI" class="hidden peer" />
                <label for="ai-gemini" class="flex flex-col items-center justify-center p-3 rounded-xl border-2 border-gray-700 bg-gray-900 cursor-pointer transition-all hover:bg-gray-800 peer-checked:border-blue-500 peer-checked:bg-blue-600/10 peer-checked:text-blue-400">
                  <span class="text-xs font-bold">Gemini</span>
                  <span class="text-[9px] opacity-60">Google</span>
                </label>
              </div>

              <!-- Claude -->
              <div class="relative">
                <input type="radio" id="ai-claude" value="claude" v-model="selectedAI" class="hidden peer" />
                <label for="ai-claude" class="flex flex-col items-center justify-center p-3 rounded-xl border-2 border-gray-700 bg-gray-900 cursor-pointer transition-all hover:bg-gray-800 peer-checked:border-orange-500 peer-checked:bg-orange-600/10 peer-checked:text-orange-400">
                  <span class="text-xs font-bold">Claude</span>
                  <span class="text-[9px] opacity-60">Anthropic</span>
                </label>
              </div>

              <!-- OpenAI -->
              <div class="relative">
                <input type="radio" id="ai-openai" value="openai" v-model="selectedAI" class="hidden peer" />
                <label for="ai-openai" class="flex flex-col items-center justify-center p-3 rounded-xl border-2 border-gray-700 bg-gray-900 cursor-pointer transition-all hover:bg-gray-800 peer-checked:border-green-500 peer-checked:bg-green-600/10 peer-checked:text-green-400">
                  <span class="text-xs font-bold">GPT-4o-mini</span>
                  <span class="text-[9px] opacity-60">OpenAI</span>
                </label>
              </div>

              <!-- None -->
              <div class="relative">
                <input type="radio" id="ai-none" value="none" v-model="selectedAI" class="hidden peer" />
                <label for="ai-none" class="flex flex-col items-center justify-center p-3 rounded-xl border-2 border-gray-700 bg-gray-900 cursor-pointer transition-all hover:bg-gray-800 peer-checked:border-gray-400 peer-checked:bg-gray-700 peer-checked:text-white">
                  <span class="text-xs font-bold">不使用</span>
                  <span class="text-[9px] opacity-60">基礎模板</span>
                </label>
              </div>
            </div>

            <!-- API Key Inputs - 根據選擇顯示對應的 Input -->
            <div class="space-y-3 mb-4">
              <div v-if="selectedAI === 'gemini'" class="animate-in fade-in duration-300">
                <div class="flex justify-between items-center mb-1 ml-1">
                  <label class="block text-[10px] text-blue-400 font-bold uppercase">Gemini API Key</label>
                  <a href="https://aistudio.google.com/app/apikey" target="_blank" class="text-[9px] text-blue-500 hover:underline">取得 Key ↗</a>
                </div>
                <input v-model="geminiApiKey" type="password" placeholder="AIza..." class="w-full p-2 bg-gray-900 border border-blue-500/30 rounded text-xs text-gray-100 placeholder-gray-700 focus:outline-none focus:border-blue-500" />
              </div>
              <div v-if="selectedAI === 'claude'" class="animate-in fade-in duration-300">
                <div class="flex justify-between items-center mb-1 ml-1">
                  <label class="block text-[10px] text-orange-400 font-bold uppercase">Claude API Key</label>
                  <a href="https://console.anthropic.com/settings/keys" target="_blank" class="text-[9px] text-orange-500 hover:underline">取得 Key ↗</a>
                </div>
                <input v-model="claudeApiKey" type="password" placeholder="sk-ant-..." class="w-full p-2 bg-gray-900 border border-orange-500/30 rounded text-xs text-gray-100 placeholder-gray-700 focus:outline-none focus:border-orange-500" />
              </div>
              <div v-if="selectedAI === 'openai'" class="animate-in fade-in duration-300">
                <div class="flex justify-between items-center mb-1 ml-1">
                  <label class="block text-[10px] text-green-400 font-bold uppercase">OpenAI API Key</label>
                  <a href="https://platform.openai.com/api-keys" target="_blank" class="text-[9px] text-green-500 hover:underline">取得 Key ↗</a>
                </div>
                <input v-model="openAiApiKey" type="password" placeholder="sk-..." class="w-full p-2 bg-gray-900 border border-green-500/30 rounded text-xs text-gray-100 placeholder-gray-700 focus:outline-none focus:border-green-500" />
              </div>
            </div>

            <!-- 費用與用量連結 -->
            <div class="mt-6 pt-4 border-t border-gray-700 flex flex-wrap gap-x-4 gap-y-2">
              <span class="w-full text-[10px] uppercase font-bold text-gray-500 tracking-widest mb-1">💰 費用與用量查詢</span>
              <a href="https://console.cloud.google.com/billing" target="_blank" class="text-[11px] text-blue-400 hover:text-blue-300 underline flex items-center gap-1">Gemini</a>
              <a href="https://console.anthropic.com/settings/billing" target="_blank" class="text-[11px] text-blue-400 hover:text-blue-300 underline flex items-center gap-1">Claude</a>
              <a href="https://platform.openai.com/usage" target="_blank" class="text-[11px] text-blue-400 hover:text-blue-300 underline flex items-center gap-1">OpenAI</a>
            </div>
          </div>

          <button @click="saveApiKeys" class="bg-blue-600 cursor-pointer text-white px-3 py-2 rounded font-bold w-full hover:bg-blue-500 active:bg-blue-700 transition-colors">
            儲存所有設定
          </button>
        </div>
      </details>
    </div>

    <!-- 主操作區 -->
    <button
      @click="handleProcess"
      :disabled="loading"
      class="w-full bg-blue-600 text-white py-3 rounded-lg font-bold shadow hover:bg-blue-500 disabled:bg-gray-700 disabled:text-gray-500 transition-colors cursor-pointer"
    >
      {{ loading ? '處理中...' : '🔍 開始自動整理票據' }}
    </button>

    <div v-if="statusMessage" class="text-xs text-blue-400 animate-pulse text-center font-medium">
      {{ statusMessage }}
    </div>

    <div v-if="jiraData" class="bg-gray-800 p-4 rounded-lg border border-gray-700 shadow-sm relative overflow-hidden">
      <div class="absolute left-0 top-0 bottom-0 w-1 bg-blue-500"></div>
      <p class="text-xs text-blue-400 font-bold mb-1">Jira 標題:</p>
      <p class="text-sm text-gray-200 mb-4">{{ jiraData.title || '未找到標題' }}</p>

      <p class="text-xs text-blue-400 font-bold mb-1">Redmine ID:</p>
      <p class="text-sm text-gray-200 font-mono bg-gray-900 py-1 px-2 rounded w-max">{{ jiraData.redmineId || '未提供' }}</p>
    </div>

    <!-- 內容生成區 -->
    <div v-if="generatedContent" class="space-y-2 mt-2">
      <div class="flex justify-between items-center">
        <label class="text-sm font-bold text-gray-300 flex items-center gap-2">📋 生成內容預覽：</label>
        <div class="flex gap-2">
          <button @click="copyToClipboard" class="text-xs text-blue-400 hover:text-blue-300 font-bold px-2 py-1 bg-gray-800 rounded border border-gray-700 hover:bg-gray-700 transition-colors cursor-pointer">
            📋 複製
          </button>
        </div>
      </div>
      <div v-if="injectMessage" :class="injectMessage.ok ? 'text-green-400' : 'text-red-400'" class="text-xs text-center font-medium">
        {{ injectMessage.text }}
      </div>
      <textarea
        v-model="generatedContent"
        class="w-full h-80 p-4 text-xs border border-gray-600 rounded-lg bg-gray-900 text-gray-300 font-mono leading-relaxed focus:outline-none focus:border-blue-500 shadow-inner resize-y custom-scrollbar"
      ></textarea>
    </div>

    <!-- Debug 區塊 -->
    <div v-if="debugLogs.length > 0" class="mt-6 pt-4 border-t border-gray-700">
      <div class="flex justify-between items-center mb-2">
        <label class="text-xs font-bold text-gray-500 uppercase tracking-wider">🐛 Console 診斷日誌</label>
        <button @click="debugLogs = []" class="text-xs text-red-400 hover:text-red-300 px-2 py-1 hover:bg-gray-800 rounded transition-colors cursor-pointer">清除</button>
      </div>
      <div class="h-40 overflow-y-auto bg-black text-xs p-3 rounded-lg border border-gray-800 font-mono whitespace-pre-wrap break-all shadow-inner custom-scrollbar">
        <div v-for="(log, i) in debugLogs" :key="i"
             :class="{
               'text-red-400': log.type === 'error',
               'text-yellow-400': log.type === 'warn',
               'text-green-400': log.type === 'log'
             }"
             class="mb-1.5 pb-1.5 border-b border-gray-800 last:border-0"
        >
          {{ log.text }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const jiraData = ref(null);
const generatedContent = ref('');
const loading = ref(false);
const statusMessage = ref('');
const redmineApiKey = ref('');
const openAiApiKey = ref('');
const geminiApiKey = ref('');
const claudeApiKey = ref('');
const selectedAI = ref('gemini'); // 預設選 Gemini

// --- 生命週期與儲存 API Key ---
onMounted(() => {
  chrome.storage.local.get(['redmineApiKey', 'openAiApiKey', 'geminiApiKey', 'claudeApiKey', 'selectedAI'], (result) => {
    if (result.redmineApiKey) redmineApiKey.value = result.redmineApiKey;
    if (result.openAiApiKey) openAiApiKey.value = result.openAiApiKey;
    if (result.geminiApiKey) geminiApiKey.value = result.geminiApiKey;
    if (result.claudeApiKey) claudeApiKey.value = result.claudeApiKey;
    if (result.selectedAI) selectedAI.value = result.selectedAI;
  });
});

const saveApiKeys = () => {
  chrome.storage.local.set({
    redmineApiKey: redmineApiKey.value,
    openAiApiKey: openAiApiKey.value,
    geminiApiKey: geminiApiKey.value,
    claudeApiKey: claudeApiKey.value,
    selectedAI: selectedAI.value
  }, () => {
    alert('API Keys 已儲存！');
  });
};

// --- 覆寫 Console，將 Log 顯示在畫面上 ---
const debugLogs = ref([]);
const originalLog = console.log;
const originalWarn = console.warn;
const originalError = console.error;

const formatArgs = (args) => {
  return args.map(a => {
    if (a instanceof Error) return a.message;
    return typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a);
  }).join(' ');
};

console.log = (...args) => {
  originalLog(...args);
  debugLogs.value.push({ type: 'log', text: `[LOG] ${formatArgs(args)}` });
};
console.warn = (...args) => {
  originalWarn(...args);
  debugLogs.value.push({ type: 'warn', text: `[WARN] ${formatArgs(args)}` });
};
console.error = (...args) => {
  originalError(...args);
  debugLogs.value.push({ type: 'error', text: `[ERROR] ${formatArgs(args)}` });
};

// --- 核心邏輯：處理流程 ---
const handleProcess = async () => {
  loading.value = true;
  statusMessage.value = '啟動程序...';
  console.log(">>> [Debug] 開始執行 handleProcess");

  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab) throw new Error("找不到活動中的分頁");

    if (!tab.url || !tab.url.includes("atlassian.net")) {
      throw new Error("此擴充功能僅限在 Jira (atlassian.net) 頁面上使用！");
    }

    // 嘗試通訊
    console.log(">>> [Debug] 正在傳送訊息給 Tab:", tab.url);
    const jiraBase = await getJiraDataWithTimeout(tab.id);

    // 強制印出結果，看看抓到了什麼
    console.log(">>> [Debug] Content Script 回傳結果:", JSON.stringify(jiraBase));

    if (!jiraBase) {
      throw new Error("Content Script 回傳為空，請重新整理 Jira 頁面");
    }

    if (jiraBase.error) {
      throw new Error("Content Script 內部錯誤: " + jiraBase.error);
    }

    // 將抓取到的基本資料綁定到畫面上顯示
    jiraData.value = jiraBase;

    // 進行子票與 Redmine 抓取
    if (jiraBase.subtaskKeys && jiraBase.subtaskKeys.length > 0) {
      statusMessage.value = `找到 ${jiraBase.subtaskKeys.length} 張子票，讀取中...`;
      const fullSubtasks = await fetchSubtaskDetails(jiraBase.subtaskKeys);
      console.log(">>> [Debug] 子票細節:", fullSubtasks);

      // 準備 Redmine 資料 (預設先用 Jira 標題)
      let redmineDetails = { id: jiraBase.redmineId, subject: jiraBase.title, description: "" };
      if (jiraBase.redmineId) {
        statusMessage.value = `抓取 Redmine #${jiraBase.redmineId} 資訊中...`;
        const fetchedRedmine = await fetchRedmineDetails(jiraBase.redmineId);
        if (fetchedRedmine) redmineDetails = fetchedRedmine;
      }

      // 生成內容
      statusMessage.value = `正在組合基礎票據內容...`;
      const baseContent = generateAgileContent(redmineDetails, fullSubtasks);

      if (selectedAI.value !== 'none') {
        let aiSummary = null;
        const aiNames = { gemini: 'Gemini', claude: 'Claude', openai: 'OpenAI' };
        statusMessage.value = `🤖 呼叫 ${aiNames[selectedAI.value]} 進行智慧整理中...`;

        try {
          if (selectedAI.value === 'gemini') {
            aiSummary = await rewriteWithGemini(baseContent);
          } else if (selectedAI.value === 'claude') {
            aiSummary = await rewriteWithClaude(baseContent);
          } else if (selectedAI.value === 'openai') {
            aiSummary = await rewriteWithAI(baseContent);
          }
        } catch (err) {
          console.warn(`${aiNames[selectedAI.value]} 處理失敗:`, err.message);
          alert(`${aiNames[selectedAI.value]} 整理失敗，將顯示基礎票據內容：${err.message}`);
        }

        generatedContent.value = aiSummary || baseContent;
      } else {
        generatedContent.value = baseContent;
      }

      statusMessage.value = '✅ 完成';
    } else {
      statusMessage.value = '⚠️ 沒找到子票，請確認面板已展開';
    }

  } catch (error) {
    // 這裡強制印出詳細錯誤，確保 Console 不會是空的
    console.error("🚨 [CRITICAL ERROR]:", error);
    statusMessage.value = `錯誤: ${error.message}`;
  } finally {
    loading.value = false;
  }
};

// --- AI 自動整理 (Claude) ---
const rewriteWithClaude = async (rawText) => {
  const SYSTEM_PROMPT = "你是一個專業 Frontend Lead / Scrum Master。請將原始資訊整理成精簡、不失重點的 Jira 票據內容，並嚴格遵守以下重點指令：\n\n1. 語言：必須使用【繁體中文】。\n2. 結構：將母票 (User Story & AC) 與子票 (Tasks) 區塊分開。\n3. 優雅精簡：使用條列式，移除所有冗言贅字與客套話。\n4. 前端處理：對於前端子票，若內容缺失，請根據標題智慧推論前端更動建議。\n5. 後端處理：後端子票僅做【資訊彙整與摘要】，不需額外推論或編撰其內部實作內容。\n6. 註記：必須標註子票編號如 [OW-123]。\n\n請以 Markdown 格式輸出：\n## 📝 User Story & Acceptance Criteria\n- (精簡的母票描述與驗收標準)\n\n## 🎨 Frontend & Backend Implementation Tasks\n- (條列各子票對應的更動要點，需標註編號如 [OW-123])\n\n直接給出內容，不要標籤包覆。";

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": claudeApiKey.value.trim(),
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
      "anthropic-dangerous-direct-browser-access": "true"
    },
    body: JSON.stringify({
      model: "claude-3-haiku-20240307",
      max_tokens: 8000,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: `以下是從系統爬取的原始標題與細節，請幫我分析並整理：\n\n${rawText}` }]
    })
  });

  if (res.ok) {
    const data = await res.json();
    return data.content[0].text;
  } else {
    const err = await res.json();
    throw new Error(err.error?.message || "Claude API 錯誤");
  }
};

// --- AI 自動整理 (Gemini) ---
const rewriteWithGemini = async (rawText) => {
  const SYSTEM_PROMPT = "你是一個專業 Frontend Lead / Scrum Master。請將原始資訊整理成精簡、不失重點的 Jira 票據內容，並嚴格遵守以下重點指令：\n\n1. 語言：必須使用【繁體中文】。\n2. 結構：將母票 (User Story & AC) 與子票 (Tasks) 區塊分開。\n3. 優雅精簡：使用條列式，移除所有冗言贅字與客套話。\n4. 前端處理：對於前端子票，若內容缺失，請根據標題智慧推論前端更動建議。\n5. 後端處理：後端子票僅做【資訊彙整與摘要】，不需額外推論或編撰其內部實作內容。\n6. 註記：必須標註子票編號如 [OW-123]。\n\n請以 Markdown 格式輸出：\n## 📝 User Story & Acceptance Criteria\n- (精簡的母票描述與驗收標準)\n\n## 🎨 Frontend & Backend Implementation Tasks\n- (條列各子票對應的更動要點，需標註編號如 [OW-123])\n\n直接給出內容，不要標籤包覆。";

  const url = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${geminiApiKey.value.trim()}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{
        role: "user",
        parts: [{ text: `${SYSTEM_PROMPT}\n\n以下是從系統爬取的原始標題與細節，請幫我分析並整理：\n\n${rawText}` }]
      }],
      generationConfig: { temperature: 0.7, maxOutputTokens: 8192 }
    })
  });

  if (res.ok) {
    const data = await res.json();
    console.log(">>> [Debug] Gemini Response Finish Reason:", data.candidates?.[0]?.finishReason);
    return data.candidates?.[0]?.content?.parts?.[0]?.text;
  } else {
    const err = await res.json();
    throw new Error(err.error?.message || "Gemini API 錯誤");
  }
};

// --- AI 自動整理 (OpenAI) ---
const rewriteWithAI = async (rawText) => {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${openAiApiKey.value.trim()}`
    },
    body: JSON.stringify({
      model: "gpt-4o-mini", // 預設使用快速且便宜的模型
      messages: [
        {
          role: "system",
          content: "你是一個專業 Frontend Lead / Scrum Master。請將原始資訊整理成精簡、不失重點的 Jira 票據內容，並嚴格遵守以下重點指令：\n\n1. 語言：必須使用【繁體中文】。\n2. 結構：將母票 (User Story & AC) 與子票 (Tasks) 區塊分開。\n3. 優雅精簡：使用條列式，移除所有冗言贅字與客套話。\n4. 前端處理：對於前端子票，若內容缺失，請根據標題智慧推論前端更動建議。\n5. 後端處理：後端子票僅做【資訊彙整與摘要】，不需額外推論或編撰其內部實作內容。\n6. 註記：必須標註子票編號如 [OW-123]。\n\n請以 Markdown 格式輸出：\n## 📝 User Story & Acceptance Criteria\n- (精簡的母票描述與驗收標準)\n\n## 🎨 Frontend & Backend Implementation Tasks\n- (條列各子票對應的更動要點，需標註編號如 [OW-123])\n\n直接給出內容，不要標籤包覆。"
        },
        {
          role: "user",
          content: `以下是從系統爬取的原始標題與細節，請幫我分析並整理：\n\n${rawText}`
        }
      ],
      temperature: 0.7,
      max_tokens: 8000
    })
  });

  if (res.ok) {
    const data = await res.json();
    return data.choices[0].message.content;
  } else {
    const err = await res.json();
    throw new Error(err.error?.message || "OpenAI API 錯誤");
  }
};

const injectMessage = ref(null);

// --- 資料轉換器 (Transformer) ---
const generateAgileContent = (redmine, subtasks) => {
  const rId = redmine?.id || "未知";
  const rSubject = redmine?.subject || "未命名任務";
  const rDesc = redmine?.description || "";
  const rComments = redmine?.comments || [];
  const rUrl = `https://redmine.owlting.com/issues/${rId}`;

  // 轉換為標準 Markdown，避開舊有 h1. h2. 及 {quote} 格式
  const descBlock = rDesc ? `\n\n> ${rDesc.split('\n').join('\n> ')}` : "";

  const commentsBlock = rComments.length > 0
    ? `\n\n### 📝 相關留言\n` + rComments.map(c => `**${c.author}**:\n> ${c.text.split('\n').join('\n> ')}`).join('\n\n')
    : "";

  const story = `## User Story\n- 身為使用者，我希望「${rSubject}」，以便於達成業務目標。${descBlock}${commentsBlock}`;

  // 處理子票內容
  const techNotes = subtasks.map(s => {
    const desc = typeof s.description === 'object'
      ? "[複雜格式內容已略過]"
      : (s.description || '無內容');
    return `- [ ] **${s.key}**: ${s.title}\n  - 實作細節: ${desc}`;
  }).join('\n');

  return `${story}\n\n## Acceptance Criteria\n1. 需符合 Redmine #${rId} 所列之規格\n\n## Technical Notes\n${techNotes}\n\n---\n*來源: [Redmine #${rId}](${rUrl})*`;
};

const copyToClipboard = () => {
  navigator.clipboard.writeText(generatedContent.value);
  alert('內容已複製！請貼到 Jira Description 欄位。');
};


const fetchRedmineDetails = async (redmineId) => {
  try {
    let url = `https://redmine.owlting.com/issues/${redmineId}.json?include=journals`;
    if (redmineApiKey.value) {
      url += `&key=${redmineApiKey.value.trim()}`;
    }

    // 呼叫 Redmine JSON API
    // 如果有 API key，就不一定要依賴 Cookie；如果沒有 API key，則 fallback 使用 credentials: 'include' 碰碰運氣
    const fetchOptions = redmineApiKey.value ? {} : { credentials: 'include' };
    const res = await fetch(url, fetchOptions);
    if (res.ok) {
      const data = await res.json();

      const comments = (data.issue.journals || [])
        .filter(j => j.notes && j.notes.trim())
        .map(j => ({
          author: j.user ? j.user.name : "未知",
          text: j.notes.trim()
        }));

      return {
        id: redmineId,
        subject: data.issue.subject,
        description: data.issue.description,
        comments
      };
    } else {
      console.warn(`Redmine API 回傳錯誤 (${res.status})，可能是未登入或無權限。`);
    }
  } catch (err) {
    console.error("Redmine Fetch Error:", err);
  }
  return null;
};

const fetchSubtaskDetails = async (keys) => {
  const results = [];
  // 取得當前 Jira 的域名 (例如 https://owlting.atlassian.net)
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  console.log('tab', tab)
  const urlObj = new URL(tab.url);
  const baseUrl = urlObj.origin;

  for (const key of keys) {
    try {
      // 關鍵修正：使用絕對路徑請求 Jira API
      const apiUrl = `${baseUrl}/rest/api/2/issue/${key}`;
      console.log(`[API Request] 正在請求: ${apiUrl}`);

      const res = await fetch(apiUrl);

      if (!res.ok) {
        // 如果 API 回傳 401/403/404，這裡會被捕捉
        const errorText = await res.text();
        throw new Error(`Jira API 報錯 (${res.status}): ${errorText.substring(0, 50)}`);
      }

      const data = await res.json();
      results.push({
        key,
        title: data.fields.summary,
        description: data.fields.description || "子票無內容"
      });
    } catch (err) {
      // 強迫把錯誤印出來，不要讓它靜默消失
      console.error(`[Subtask Error] ${key}:`, err);
      results.push({ key, title: `(無法讀取: ${key})`, description: "" });
    }
  }
  return results;
};

// --- 1. 宣告超時工具函式 ---
const getJiraDataWithTimeout = (tabId) => {
  return new Promise((resolve, reject) => {
    // 設定 5 秒後自動放棄等待，避免 UI 永久卡在「處理中」
    const timeout = setTimeout(() => {
      reject(new Error("Content Script 回應超時，請重新整理 Jira 頁面"));
    }, 5000);

    chrome.tabs.sendMessage(tabId, { action: "FETCH_JIRA_INFO" }, (response) => {
      clearTimeout(timeout);
      if (chrome.runtime.lastError) {
        let errorMsg = chrome.runtime.lastError.message;
        // 如果重新載入擴充功能但尚未重新整理網頁，會拋出這個連線錯誤
        if (errorMsg.includes("Could not establish connection")) {
          errorMsg = "無法連線到網頁。請先「重新整理 (F5) 該 Jira 頁面」，讓擴充功能載入最新的腳本後再重試！";
        }
        reject(new Error(errorMsg));
      } else {
        resolve(response);
      }
    });
  });
};


</script>
