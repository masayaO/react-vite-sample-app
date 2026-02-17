# react-vite-sample-app

フロント先行でBtoB SaaSの技術基盤を検証するためのサンプルリポジトリです。

## 現在の構成

- `frontend/`: React + TypeScript + Vite の実装済みアプリ
- 将来追加予定: `backend/`（同階層に追加し、モノレポ構成へ拡張）

## frontend で採用している主な技術

- React
- TypeScript
- Vite
- TanStack Router
- TanStack Query
- TanStack Form
- Tailwind CSS v4
- shadcn/ui 運用（`cva` / `clsx` / `tailwind-merge`）
- axios
- MSW
- Biome
- Vitest + Testing Library

## まず動かす

```bash
cd frontend
npm install
npm run dev
```

ブラウザ: [http://localhost:5173](http://localhost:5173)

詳細は `frontend/README.md` を参照してください。
