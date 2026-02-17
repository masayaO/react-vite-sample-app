# backend

`Hono + TypeScript` で実装した最小CRUD APIです。運用データは `data/todos.json` に保存されます。

## エンドポイント

- `GET /health`
- `GET /api/account`
- `PATCH /api/account`
- `GET /api/todos?search=&status=`
- `GET /api/todos/:id`
- `POST /api/todos`
- `PATCH /api/todos/:id`
- `DELETE /api/todos/:id`

## ローカル起動

```bash
npm install
npm run dev
```

デフォルトURL: [http://localhost:8787](http://localhost:8787)

## テストとチェック

```bash
npm run test
npm run check
npm run build
```

## データ永続化

- 実データ保存先（gitignore）: `data/todos.json`
- 初期データ（管理対象）: `data/todos.seed.json`
- 環境変数:
  - `TODO_DATA_FILE` で実データ保存先を変更可能
  - `TODO_SEED_FILE` で初期seedファイルを変更可能
  - `ACCOUNT_DATA_FILE` でアカウント実データ保存先を変更可能
  - `ACCOUNT_SEED_FILE` でアカウント初期seedファイルを変更可能
