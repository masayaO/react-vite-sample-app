# Frontend - React + Vite + TanStack

React 19, Vite 7, TanStack Router/Query/Form, Tailwind CSS 4, TypeScript 5.9, Biome 2。

## コマンド（`frontend/` 内で実行）

```bash
npm run dev          # Vite dev server（ポート 5173）
npm run build        # tsc -b && vite build
npm run test         # Vitest 実行（一回）
npm run test:watch   # Vitest ウォッチモード
npm run check        # Biome check（lint + format）
npm run lint         # Biome lint のみ
npm run format       # Biome format --write
```

## TypeScript パスエイリアス

`@/` は `src/` にマップされる。ディレクトリをまたぐインポートには必ず `@/` を使うこと。

```ts
import { apiClient } from '@/api/httpClient';
```

## ディレクトリ構造

```
src/
  routes/          # TanStack Router ファイルベースルート（薄いラッパーのみ）
  features/        # コロケートされたフィーチャーモジュール（ページロジック・テスト・サブコンポーネント）
  api/             # API レイヤー（HTTP クライアント関数、TanStack Query フック、Zod スキーマ）
  ui/              # 共有 UI コンポーネント（Badge, Button, Card, Input 等）
  utils/           # 共有ユーティリティ関数
  test/            # テスト基盤（MSW ハンドラ・サーバ・データ・setup-tests.ts）
  routeTree.gen.ts # TanStack Router プラグインが自動生成 - 手動編集禁止
  router.tsx       # Router ファクトリ（buildRouter, makeRouter for tests）
  main.tsx         # アプリエントリーポイント
```

## ルーティングアーキテクチャ

TanStack Router のファイルベースルーティングを使用。ルートファイルは `src/routes/` に配置し、Vite プラグイン（@tanstack/router-plugin）が自動検出する。

### ファイル命名規則

| ファイルパス | ルート |
|---|---|
| `src/routes/index.tsx` | `/` |
| `src/routes/todos.tsx` | `/todos`（レイアウトルート） |
| `src/routes/todos/index.tsx` | `/todos/` |
| `src/routes/todos/new.tsx` | `/todos/new` |
| `src/routes/todos/$todoId.tsx` | `/todos/:todoId` |
| `src/routes/account/edit.tsx` | `/account/edit` |

**重要**: `src/routeTree.gen.ts` は `npm run dev` または `npm run build` 実行時に自動生成される。ルートファイルを追加・リネームした後は dev server を再起動してファイルを再生成すること。`routeTree.gen.ts` を直接変更しないこと（上書きされる）。

### ルートファイルのパターン（最小限のラッパー）

```tsx
import { createFileRoute } from '@tanstack/react-router';
import { TodosListPage } from '@/features/todos/page';

export const Route = createFileRoute('/todos/')({ component: TodosListPage });
```

## フィーチャーモジュールパターン

各フィーチャーは `src/features/<feature>/` に配置する。

### 構成ファイル

- `page.tsx` - プレゼンテーション React コンポーネント（ページ UI）
- `use<Page>Page.ts` - 全ページレベルの状態とデータフェッチをカプセル化するカスタムフック
- `components/` - フィーチャーローカルなサブコンポーネント（PascalCase フォルダ + `index.tsx`）
- `page.integration.test.tsx` - フィーチャーとコロケートされたインテグレーションテスト

### 例: `src/features/todos/`

```
features/todos/
  page.tsx                       # TodosListPage コンポーネント
  useTodoListPage.ts             # 状態 + データフェッチフック
  todoFiltersSchema.ts           # フィルターフォーム値の Zod スキーマ
  components/
    TodoFilters/index.tsx
    TodosPageHeader/index.tsx
  page.integration.test.tsx
```

ネストされたルートの場合: `src/features/todos/$todoId/page.tsx` + `useTodoDetailPage.ts`

## API レイヤーパターン

`src/api/` に配置。各 API ドメインは独自のサブディレクトリを持つ。

### ドメインごとの構成（例: `src/api/todoApi/`）

| ファイル | 役割 |
|---|---|
| `client.ts` | `apiClient`（axios）を使う生の非同期関数。型付きデータを返す |
| `queries.ts` | TanStack Query の useQuery フック |
| `mutations.ts` | TanStack Query の useMutation フック |
| `keys.ts` | クエリキーファクトリ（例: `todoKeys.all`, `todoKeys.list(filters)`） |
| `schema.ts` | Zod スキーマ（バックエンドのドメインスキーマと対応することが多い） |
| `types.ts` | TypeScript 型（Zod スキーマから推論） |
| `index.ts` | パブリック API: エクスポート + `use<Domain>Api()` ファサードフック |

### ファサードフックパターン

`useTodoApi()` のようなファサードフックで、全クエリ/ミューテーションフックを一つのインポート先にまとめる。フィーチャーモジュールはこのファサードを使うこと。

HTTP クライアント: `src/api/httpClient.ts` - baseURL が `/api` の axios インスタンス。エラーインターセプターが `error.response.data.message` を抽出する。

## 状態管理

グローバルステートストアなし。データフェッチ状態は TanStack Query で完結。ローカル UI 状態はカスタムフック内の React `useState`/`useReducer` で管理。

## テストアプローチ

Vitest + Testing Library + MSW によるインテグレーションテスト。

### テスト基盤（`src/test/`）

| ファイル | 役割 |
|---|---|
| `msw/handlers.ts` | MSW リクエストハンドラ（バックエンド API と対応） |
| `msw/server.ts` | テスト用 Node MSW サーバ |
| `msw/data.ts` | インメモリテストデータ（`reset*` 関数付き） |
| `setup-tests.ts` | Vitest セットアップ: MSW サーバ起動、各テスト後にデータ/ハンドラをリセット |

### インテグレーションテストのパターン

```tsx
function renderApp(initialPath = '/todos') {
  const queryClient = new QueryClient();
  const router = makeRouter(queryClient, createMemoryHistory({ initialEntries: [initialPath] }));
  render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}
```

テスト用レンダリングには `@/router` から `makeRouter()` を使うこと（`router` 本体ではない）。MSW が応答した後にロードされるデータには `screen.findBy*`（非同期）を使うこと。

## スタイリング

Tailwind CSS 4（`@tailwindcss/vite` プラグイン経由）。`tailwind.config.js` は不要。ユーティリティクラスを JSX に直接記述する。条件付きクラスには `clsx`/`tailwind-merge` を使用。共有 UI プリミティブは `src/ui/` に配置（Badge, Button, Card, Input, Select, Textarea）。

## コードスタイル（Biome）

- シングルクォート、セミコロン必須、末尾カンマ
- `src/routeTree.gen.ts` と `public/mockServiceWorker.js` は Biome チェックから除外
- TypeScript: `tsconfig.app.json` で strict モード有効
