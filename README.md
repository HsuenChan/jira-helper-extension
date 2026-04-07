# Jira Helper - AI 智慧票據整理工具

![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)
![Vue](https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vuedotjs&logoColor=4FC08D)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-v18+-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Chrome Extension](https://img.shields.io/badge/Chrome_Extension-MV3-4285F4?style=for-the-badge&logo=google-chrome&logoColor=white)

這是一套專為 Owlnest 團隊打造的 **Chrome 擴充功能**，旨在自動化從需求到票據生成的繁瑣流程。透過智慧數據採集與多模型 AI 處理，大幅提升 Jira Story 的建立效率與內容品質。

## 開發動機

選擇以 **Chrome Extension** 形式開發的主要原因：
- **解決跨網域 (CORS) 限制**：由於 Redmine 與 Jira 通常位於不同網域或內部網域，傳統 Web App 會遇到嚴格的跨來源資源共享限制。擴充功能具備更高的權限，可以直接在瀏覽器端發送請求。
- **安全性與便利性**：可以直接利用瀏覽器現有的登入憑證（如 Cookie/Session）或直接在本地儲存加密的 API Token，無需架設中繼伺服器（Proxy Server），確保開發資訊不外流。
- **無縫嵌入工作流**：開發者可以直接在 Jira 頁面上開啟工具，不需要頻繁切換視窗。

## 系統環境要求

為了確保專案能順利編譯與運行，請確認你的開發環境符合以下版本要求：
- **Node.js**: `v22.x` 以上 (建議使用 LTS 版本)
- **npm**: `v10.x` 以上
- **瀏覽器**: Google Chrome (支援 Manifest V3)

## 技術棧 (Tech Stack)

### 核心開發框架
- **前端框架**: [Vue 3.5+](https://vuejs.org/) (使用 Composition API & `<script setup>`)
- **建構工具**: [Vite 8.0+](https://vitejs.dev/)
- **擴充開發工具**: [@crxjs/vite-plugin](https://crxjs.dev/) (提供 Manifest V3 支援與 HMR)

### 樣式與排版
- **CSS 框架**: [Tailwind CSS v4](https://tailwindcss.com/)
- **後處理**: PostCSS & Autoprefixer

### 關鍵功能實作
- **AI 整合**: 客製化 API 路由，支援 Gemini (Google)、Claude (Anthropic) 與 GPT-4o-mini (OpenAI)。
- **DOM 操作**: 使用原生 JavaScript 進行跨層級數據採集。

## 核心功能

- **數據採集**: 自動從 Redmine (需求, 留言) 與 Jira (子票) 中讀取原始資訊。
- **AI 智慧處理**:
  - **母票整理**: 自動生成 User Story 與詳細的 Acceptance Criteria (AC)。
  - **前端推論**: 當前端子票內容缺失時，由 AI 智慧推論並具體化前端更動建議。
  - **後端彙整**: 對後端子票僅進行事實摘要，不進行虛構性編撰。

- **診斷面板**: 下方顯示Log處理資訊，紅/黃/綠三色標註 ERROR/WARN/LOG 訊息。

## 專案結構簡述

- `src/App.vue`: 工具主要 UI 面板與 AI 處理邏輯。
- `src/content.js`: 負責與 Jira/Redmine 頁面進行 DOM 交互的核心指令集。
- `manifest.json`: 定義擴充功能權限、腳本注入範圍與資源控制。
- `public/`: 存放 Icon 圖片等靜態資源。

## 安裝與開發

1. **安裝依賴**
   ```bash
   npm install
   ```
2. **啟動開發伺服器** (支援即時重載)
   ```bash
   npm run dev
   ```
3. **編譯生產版本**
   ```bash
   npm run build
   ```
4. **載入擴充功能**
   - 前往 `chrome://extensions/`
   - 開啟「開發者模式」。
   - 點擊「載入解壓縮」，選擇本專案下的 `dist` 資料夾。

## 授權
MIT License.
