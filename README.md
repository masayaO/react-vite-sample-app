# react-vite-sample-app

BtoB SaaSフロントエンド技術基盤の検証用サンプルです。現在は `frontend + backend` のローカル構成です。

## 構成

- `frontend/`: React + Vite + TanStack で作ったTODO CRUD UI
- `backend/`: Honoで作ったTODO CRUD API（JSONファイル永続化）
- `docker-compose.yml`: frontend/backend 同時起動

## 一括起動（推奨）

```bash
docker compose up --build
```

- Frontend: [http://localhost:5173](http://localhost:5173)
- Backend: [http://localhost:8787](http://localhost:8787)

## 個別起動

### frontend

```bash
cd frontend
npm install
npm run dev
```

### backend

```bash
cd backend
npm install
npm run dev
```

## 補足

- frontend は `/api` を Vite proxy で backend に転送します。
- ブラウザ開発時の MSW は無効です（`VITE_USE_MSW=true` のときのみ有効）。
- MSWは主にテスト用途として維持しています。
