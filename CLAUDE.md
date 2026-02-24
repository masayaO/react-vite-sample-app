# react-vite-sample-app

BtoB SaaS フロントエンド技術検証用モノレポ。React/Vite フロントエンドと Hono/Node.js バックエンドで構成される。

## リポジトリ構造

- `frontend/` - React 19, Vite 7, TanStack Router/Query/Form, Tailwind CSS 4, TypeScript
- `backend/` - Hono 4, Node.js, Zod, TypeScript（JSON ファイル永続化）
- `e2e/` - E2E テスト（現在は空）
- `docker-compose.yml` - 両サービスをオーケストレーション

## フルスタック起動

### Docker（推奨）

```bash
docker compose up --build
# Frontend: http://localhost:5173
# Backend:  http://localhost:8787
```

### ローカル開発（ターミナルを分けて実行）

```bash
# Terminal 1 - Backend
cd backend && npm run dev    # tsx watch、ポート 8787

# Terminal 2 - Frontend
cd frontend && npm run dev   # Vite dev server、ポート 5173
```

## 重要な注意事項

- フロントエンドはすべての `/api` リクエストを Vite dev server の proxy 経由でバックエンドへ転送する。
  ターゲットは `VITE_API_TARGET` 環境変数で設定（デフォルト: `http://localhost:8787`）。
- **MSW はテスト専用**。通常のブラウザ開発では無効（`VITE_USE_MSW=false`）。
  ブラウザで有効化するには `VITE_USE_MSW=true` を設定するが、これは通常のワークフローではない。
- バックエンドは `backend/data/` 以下の JSON ファイルにデータを永続化する。初回起動時にシードデータが投入される。
- **Biome を使用**。ESLint・Prettier は使用しない。
- 各コマンドは必ず該当するワークスペースディレクトリ（`frontend/` または `backend/`）内で実行すること。

## リント・フォーマット（両ワークスペース共通）

両ワークスペースとも Biome 2.x を使用。スタイルはシングルクォート、セミコロン必須、末尾カンマ。

```bash
npm run check   # Biome check（lint + format check）
npm run lint    # Biome lint のみ
npm run format  # Biome format（上書き）
```

## テスト

- **Frontend**: Vitest + Testing Library + MSW（jsdom 環境でのインテグレーションテスト）
- **Backend**: Vitest（Node 環境）
- 各ワークスペースディレクトリ内でテストを実行すること。

## サブプロジェクトのドキュメント

- フロントエンドのアーキテクチャとパターン → [frontend/CLAUDE.md](frontend/CLAUDE.md)
- バックエンドのアーキテクチャとパターン → [backend/CLAUDE.md](backend/CLAUDE.md)
