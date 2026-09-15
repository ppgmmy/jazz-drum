# Soft Ride｜爵士鼓

爵士鼓練習網站：互動鼓組、經典歌曲鼓譜資源庫，與 pocket 練習路徑。

## 本地開發

```bash
npm install
npm run dev
```

開啟 [http://localhost:3000](http://localhost:3000)。

## 頁面

- `/` — 首頁（互動鼓組 + 練習路徑）
- `/resources` — 歌曲鼓譜資源庫
- `/resources/[slug]` — 單曲鼓譜（可下載 SVG／列印）

## 技術

- Next.js App Router
- TypeScript
- Tailwind CSS v4
- Web Audio API（瀏覽器內合成鼓聲）
