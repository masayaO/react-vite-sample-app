# frontend

TODO管理ドメインで、CRUDの実装手触りを検証するフロントエンドサンプルです。

## 実装済み機能

- ルーティング
  - `/todos`: 一覧・検索・ステータス絞り込み
  - `/todos/new`: 作成
  - `/todos/:todoId`: 詳細・更新・削除
  - `/account/edit`: アカウント名編集
- データ取得/更新
  - TanStack Query で query/mutation を管理
- フォーム
  - TanStack Form + zod
- API
  - axios 共通 `apiClient`（`baseURL: /api`）
  - Vite proxy経由で backend に転送

## セットアップ

```bash
npm install
```

## 起動

```bash
npm run dev
```

ブラウザ: [http://localhost:5173](http://localhost:5173)

## 環境変数

- `VITE_API_TARGET`（任意）
  - 既定: `http://localhost:8787`
- `VITE_USE_MSW`（任意）
  - 既定: `false`
  - `true` でブラウザMSWを有効化

## 品質チェック

```bash
npm run check
npm run test
npm run build
```

## ディレクトリ構成（抜粋）

- `src/app`: Router / App Provider
- `src/routes/todos`: TODO画面（ページ、コンポーネント、ページ用hooks、近接integration test）
- `src/api/todoApi`: TODO APIドメイン（client, keys, queries, mutations, types, schema）
- `src/api/accountApi`: Account APIドメイン（client, keys, queries, mutations, types, schema）
- `src/shared`: 共通UIとユーティリティ
- `src/test/msw`: テスト用MSWハンドラ
