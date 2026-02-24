# Backend - Hono + Node.js

Hono 4, @hono/node-server, @hono/zod-validator, Zod 4, TypeScript 5.9, Biome 2。

## コマンド（`backend/` 内で実行）

```bash
npm run dev          # tsx watch src/index.ts（ホットリロード、ポート 8787）
npm run build        # tsc -b（出力先: dist/）
npm start            # node dist/index.js（プロダクション）
npm run test         # Vitest 実行（一回）
npm run test:watch   # Vitest ウォッチモード
npm run check        # Biome check（lint + format）
npm run lint         # Biome lint のみ
npm run format       # Biome format --write
```

## API エンドポイント

ベース URL: `http://localhost:8787`

| メソッド | パス | 説明 |
|---|---|---|
| GET | `/health` | ヘルスチェック |
| GET | `/api/account` | アカウントプロフィール取得 |
| PATCH | `/api/account` | アカウントプロフィール更新（body: `{ name: string }`） |
| GET | `/api/todos` | Todo 一覧取得（query: `search?`, `status?`） |
| GET | `/api/todos/:id` | Todo 単件取得 |
| POST | `/api/todos` | Todo 作成（body: TodoInput） |
| PATCH | `/api/todos/:id` | Todo 更新（body: TodoInput） |
| DELETE | `/api/todos/:id` | Todo 削除（204 No Content を返す） |

## ディレクトリ構造

```
src/
  index.ts                       # サーバエントリー: createApp() で app を生成し @hono/node-server で起動
  app.ts                         # App ファクトリ: リポジトリを Hono コンテキストに注入し、ルートをマウント
  domain/
    todo.ts                      # Zod スキーマ（todoSchema, todoInputSchema, todoFiltersSchema）+ 型
    account.ts                   # Zod スキーマ（accountSchema, accountInputSchema）+ 型
  repositories/
    todo-repository.ts           # TodoRepository インターフェース
    account-repository.ts        # AccountRepository インターフェース
    json-todo-repository.ts      # JSON ファイル実装
    json-account-repository.ts   # JSON ファイル実装
  routes/
    todos.ts                     # /api/todos の Hono ルートハンドラ
    account.ts                   # /api/account の Hono ルートハンドラ
  lib/
    default-seed.ts              # デフォルトシードデータビルダー
```

## アーキテクチャ

### Domain レイヤー（`domain/`）

Zod スキーマを定義し TypeScript 型を推論する。データ形状の唯一の真実のソース。ビジネスロジックを含まない純粋なスキーマ定義。

### Repository レイヤー（`repositories/`）

インターフェースファイルでコントラクトを定義（例: `TodoRepository`）。実装ファイルは `Json*Repository` - JSON ファイルをディスクに読み書きする。リポジトリは `app.ts` で一度インスタンス化され、Hono コンテキスト変数を介して注入される。

### Route レイヤー（`routes/`）

Hono ルートファイルは `@hono/zod-validator` でリクエストをバリデーションする。バリデーション失敗時は `{ message, issues }` と 400 を返す。ルートは `c.get('todoRepository')` / `c.get('accountRepository')` でリポジトリにアクセスする。成功レスポンスは型付きステータスコード（200, 201, 204）を使用。Not found は `{ message: 'X not found' }` と 404 を返す。

### Hono コンテキストによる依存性注入

```ts
// app.ts:
app.use('*', async (c, next) => {
  c.set('todoRepository', todoRepository);
  c.set('accountRepository', accountRepository);
  await next();
});
```

各ルートファイルは必要な Variables を含む独自の `*RouteEnv` 型を宣言する。

## データ永続化

`backend/data/` 以下の JSON ファイル:

- `todos.json` - Todo ライブデータ（ランタイムデータは gitignore 対象）
- `todos.seed.json` - 初回起動時に投入するシードデータ
- `account.json` - アカウントライブデータ
- `account.seed.json` - アカウントシードデータ

## 環境変数

| 変数名 | デフォルト | 説明 |
|---|---|---|
| `PORT` | `8787` | サーバポート |
| `TODO_DATA_FILE` | `data/todos.json` | Todo データファイルパス |
| `TODO_SEED_FILE` | `data/todos.seed.json` | Todo シードファイルパス |
| `ACCOUNT_DATA_FILE` | `data/account.json` | アカウントデータファイルパス |
| `ACCOUNT_SEED_FILE` | `data/account.seed.json` | アカウントシードファイルパス |

## 新しいドメインの追加手順

1. `src/domain/<name>.ts` - Zod スキーマと型を定義
2. `src/repositories/<name>-repository.ts` - インターフェースを定義
3. `src/repositories/json-<name>-repository.ts` - JSON ファイル実装を作成
4. `src/routes/<name>.ts` - バリデーター付き Hono ルートを作成
5. `src/app.ts` - リポジトリをインスタンス化、コンテキストミドルウェアに登録、ルートをマウント

## コードスタイル（Biome）

- シングルクォート、セミコロン必須、末尾カンマ
- TypeScript: `tsconfig.json` で `"strict": true`
- **ES Module の注意**: `"module": "NodeNext"` 設定のため、インポートパスには `.js` 拡張子が必要（`.ts` ファイルを書いていても）

  ```ts
  // 正しい
  import { TodoRepository } from './todo-repository.js';
  // 誤り
  import { TodoRepository } from './todo-repository';
  ```
