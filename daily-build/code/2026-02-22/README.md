# Laundry Decision Agent

「今日洗濯すべきか？」を判断し、推奨時間と根拠を示す Vite + React + TypeScript の SPA です。
東京都の天気情報を WeatherAPI から取得し、そのデータを使って判定します。

## 前提

- Node.js
- npm
- Firebase CLI

## セットアップと起動

1. 依存関係をインストール

```bash
npm install
```

2. `.env` に API キーを設定（WeatherAPI の無料プランで取得）

```bash
cp .env.example .env
```

`.env` を開き、`VITE_WEATHER_API_KEY` にキーを設定してください。

3. 開発サーバー起動

```bash
npm run dev
```

4. Firebase にログイン

```bash
firebase login
```

5. Hosting 初期化（未実施の場合）

```bash
firebase init hosting
```

推奨選択肢:
- `What do you want to use as your public directory?` → `dist`
- `Configure as a single-page app (rewrite all urls to /index.html)?` → `Yes`

6. デプロイ

```bash
npm run deploy
```

## Firebase Hosting 補足

SPA はクライアント側ルーティングで画面を表示するため、直接 URL アクセス時にサーバーが該当ファイルを見つけられないことがあります。`firebase.json` の `rewrites` で全パスを `/index.html` に返すことで、この問題を回避します。

## スクリプト

- `npm run dev`: ローカル開発
- `npm run build`: `dist/` を生成
- `npm run preview`: ビルド結果のローカル確認
- `npm run deploy`: ビルド後に Hosting へデプロイ

## 構成

- `src/lib/types.ts`: Weather / Inputs / Decision の型
- `src/lib/weatherService.ts`: 東京都の天気を WeatherAPI から取得し `Weather` 型へ変換
- `src/lib/decision.ts`: 判定ロジック
- `src/App.tsx`: 1画面 UI
