# Frontendアーキテクチャ概要

## この資料の目的
この資料は、React + Vite + TanStack Router/Query を前提に、現在の実装構成と配置ルールを明確化するためのものです。

目的は「どこに何を置くか」で迷わない状態を維持し、ルーティング・機能実装・共通基盤の責務分離を説明可能にすることです。

## 現在のディレクトリ構造（frontend）
```text
react-vite-sample-app/
├── backend/
├── e2e/
└── frontend/
    ├── src/
    │   ├── main.tsx                      # エントリーポイント（RouterProvider接続）
    │   ├── router.tsx                    # routerインスタンス作成・makeRouter(テスト互換)
    │   ├── routeTree.gen.ts              # TanStack Router 自動生成ファイル（手編集禁止）
    │   ├── routes/                       # ルーティング定義専用（薄いエントリ）
    │   │   ├── __root.tsx
    │   │   ├── index.tsx
    │   │   ├── todos.tsx
    │   │   ├── todos/
    │   │   │   ├── index.tsx
    │   │   │   ├── new.tsx
    │   │   │   └── $todoId.tsx
    │   │   ├── account.tsx
    │   │   └── account/edit.tsx
    │   ├── features/                     # 機能実装（ページと対応hookの近接配置）
    │   │   ├── todos/
    │   │   │   ├── page.tsx
    │   │   │   ├── useTodoListPage.ts
    │   │   │   ├── page.integration.test.tsx
    │   │   │   ├── new/
    │   │   │   │   ├── page.tsx
    │   │   │   │   └── useTodoNewPage.ts
    │   │   │   ├── $todoId/
    │   │   │   │   ├── page.tsx
    │   │   │   │   └── useTodoDetailPage.ts
    │   │   │   ├── components/
    │   │   │   └── todoFiltersSchema.ts
    │   │   └── account/
    │   │       └── edit/
    │   │           ├── page.tsx
    │   │           ├── useAccountEditPage.ts
    │   │           └── page.integration.test.tsx
    │   ├── api/                          # 通信レイヤー（domain単位）
    │   │   ├── httpClient.ts
    │   │   ├── todoApi/
    │   │   └── accountApi/
    │   ├── ui/                           # 横断利用するUI部品
    │   ├── utils/                        # 横断利用するユーティリティ
    │   └── test/                         # MSW・テスト共通セットアップ
    └── vite.config.ts                    # tanstackRouter plugin + build/dev/test設定
```

## 主要ディレクトリの責務
- `routes`: URLに対応するルート定義のみを置く層。`createFileRoute(...)` とページ呼び出しに限定する。
- `features`: 各画面の実装を置く層。`page.tsx` と対応する `use*Page.ts` を近接配置する。
- `api`: バックエンド通信とサーバー状態管理のインターフェースをドメイン別に管理する層。
- `ui`: 全体で利用可能な共通UIコンポーネント層。
- `utils`: 全体で利用可能な共通ユーティリティ層。
- `test`: テスト共通セットアップとMSWを管理する層。

## 設計上の重要ポイント
### 1. `routes` は薄く保つ
- `routes` は「ルーティング定義専用」に限定する。
- 実装ロジックを持たせず、画面本体は `features` に寄せる。
- これにより route generator の挙動が読みやすく、ルート変更の影響範囲を最小化できる。

### 2. `features` はルート単位でコロケーションする
- `page.tsx` と `use*Page.ts` を同じディレクトリに置く。
- 例: `frontend/src/features/todos/page.tsx` と `frontend/src/features/todos/useTodoListPage.ts`
- 例: `frontend/src/features/account/edit/page.tsx` と `frontend/src/features/account/edit/useAccountEditPage.ts`
- これにより、1画面改修時の探索コストを下げる。

### 3. `shared` は廃止し、`ui`/`utils` を `src` 直下に置く
- 理由: `shared` は何でも入りやすく、責務が肥大化しやすい（いわゆる「なんでも屋」化）。
- `ui` と `utils` は用途が明確で、配置判断をシンプルにできる。
- `api` も同様に全体参照を許容する基盤層として `src` 直下に置く。

### 4. TanStack Router の file-based + 自動生成を採用
- `vite.config.ts` で `@tanstack/router-plugin` を有効化。
- `routeTree.gen.ts` は自動生成物として扱い、手編集しない。
- `router.tsx` で `routeTree` を使って router を作成し、`makeRouter` をテスト互換APIとして維持する。

### 5. テストは実装近接 + E2E集約
- integration test は feature 配下で実装近接配置。
- リポジトリ横断のユーザーフローは `e2e/` に集約。
- フロント共通モック・セットアップは `frontend/src/test/` に集約。

## 期待できる効果
- ルート定義と画面実装の境界が明確になり、変更影響を把握しやすい。
- 画面改修時に `features` 内で完結しやすく、探索コストが低い。
- `shared` 廃止により、配置判断と責務の曖昧さを減らせる。
- 自動生成ルーティングにより、手書きルート管理の負荷と不整合リスクを下げられる。

## 運用ルール（追加・変更時）
- 新規ルートは `src/routes` に薄い定義のみ追加する。
- 新規画面実装は `src/features/<domain>/<segment>/page.tsx` と `use*Page.ts` を同居させる。
- 複数機能で使う見た目部品は `src/ui`、汎用関数は `src/utils` に置く。
- APIドメイン追加時は `src/api/<domain>Api` に `client/queries/mutations/keys/schema/types` をそろえる。
- `routeTree.gen.ts` は手編集しない。

## 関連資料
- リポジトリ: [https://github.com/masayaO/react-vite-sample-app](https://github.com/masayaO/react-vite-sample-app)
