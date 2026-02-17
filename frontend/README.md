# frontend

TODO管理ドメインで、CRUDの実装手触りを検証するフロントエンドサンプルです。

## 実装済み機能

- ルーティング
  - `/todos`: 一覧・検索・ステータス絞り込み
  - `/todos/new`: 作成
  - `/todos/:todoId`: 詳細・更新・削除
- データ取得/更新
  - TanStack Query で query/mutation を管理
- フォーム
  - TanStack Form + zod
- API
  - axios 共通 `apiClient`（`baseURL: /api`）
- モックAPI
  - MSW で `GET/POST/PATCH/DELETE /api/todos`

## セットアップ

```bash
npm install
```

## 起動

```bash
npm run dev
```

ブラウザ: [http://localhost:5173](http://localhost:5173)

## 品質チェック

```bash
npm run check
npm run test
npm run build
```

## ディレクトリ構成（抜粋）

- `src/app`: Router / App Provider
- `src/features/todos`: TODO機能（API, Hooks, Pages, Form）
- `src/shared`: APIクライアントと共通UI
- `src/mocks`: MSWハンドラ
- `src/test`: 統合テスト

## 白画面になる場合

1. devサーバーを再起動

```bash
npm run dev
```

2. ブラウザをハードリロード（macOS: `Cmd + Shift + R`）
3. まだ表示されない場合は Service Worker を解除
   - Chrome DevTools > Application > Service Workers > `Unregister`

補足: 開発時は `public/mockServiceWorker.js` を使ってMSWを起動します。
