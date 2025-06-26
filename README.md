## 🌍 Tripfolio Backend

📌 這是一個旅遊網站，包含地圖搜尋景點、景點加入行程規劃表中進行編輯與分享、社群建立旅遊貼文並可以按讚、留言等功能。
📌 搭配**前端專案**請參考 → [link](https://github.com/Tripfolio/TripfolioFrontEnd)
📌 網站連結 → [link](https://tripfolioo.netlify.app/)

## 技術架構
Node.js + Express + PostgreSQL
圖片上傳 AWS S3

## 安裝步驟

1. 下載這個專案：
   ```bash
   git clone https://github.com/Tripfolio/TripfolioBackEnd.git
   ```
2. 安裝：
   ```bash
   npm install
   ```
3. 本地開發：
   ```bash
   npm run dev
   ```
4. 設定 `.env` 檔案（環境變數）
請在專案根目錄建立 .env 檔案，並依照 .env.template 的格式填寫對應的環境變數。

## 組員與分工：

| 組員 | GitHub | 地圖 | 行程 | 社群 |會員 |其他|
| --- | ---    | --- | --- |  --- |--- |--- |
| 陳品均 |[LeoChen517](https://github.com/LeoChen517)  | | 行程共享<br>權限設定 |社群主頁 |郵件通知<br>設定 ||
| 張哲豪 |[kiwiisfish](https://github.com/kiwiisfish)  | 類別篩選<br>定位 | 時間與排序 |按讚、留言 ||設計規劃|
| 蘇怡瑄 |[mmaysu](https://github.com/mmaysu)  | 關鍵字搜尋 | 加入景點 | 建立貼文||部署|
| 林芳綺 |[yanamint](https://github.com/yanamint)  || 加入 google calender|||切版|
| 周子筠 |[yumi-chou](https://github.com/yumi-chou) | 地區篩選 | 交通方式與通勤時間 || |切版、設計規劃|
| 許家瑜 |[Ninahsuuuuu](https://github.com/Ninahsuuuuu)|| 行程總覽 |個人頁| 資料變更 ||
| 劉暄  | [pearl-liu-1203](https://github.com/pearl-liu-1203)|  | 行程頁面編輯 || 登入、註冊  | LINE Pay|


