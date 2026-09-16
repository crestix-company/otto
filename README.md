# OTTO — Catering & Restaurant

君塚博幸の人物紹介を主役に、レストラン、ケータリング、ご予約・店舗情報を掲載するサイトです。日本語4ページ・英語4ページ。電話予約、Instagram、Googleマップへのリンクを備えています。フォーム・メール受付は設置していません。

ソースの保存先は [crestix-company/otto](https://github.com/crestix-company/otto) の `main` ブランチです。GitHubのリポジトリ画面はHPの公開URLではありません。サイト公開先はCloudflare Pagesを想定しています。

## Cloudflare Pages の設定

「Workers & Pages」から **Pages** のプロジェクトとして設定します。

| 設定 | 値 |
| --- | --- |
| フレームワーク | None |
| ルートディレクトリ | リポジトリのルート（空欄） |
| ビルドコマンド | `npm run build:cloudflare-pages` |
| ビルド出力ディレクトリ | `dist` |
| Node.js | 22以上 |

`dist/index.html` がサイトの入口です。公開ディレクトリに `out`、リポジトリルート、`scripts` を指定しないでください。`wrangler.toml` でも公開先を `./dist` に指定しています。

### GitHub連携で自動更新する場合

1. Cloudflare PagesでGitHubリポジトリ `crestix-company/otto` を選択します。
2. 本番ブランチを `main` にし、上記の設定にします。
3. 初回デプロイ成功後、Pagesの本番URLでトップ・英語ページ・写真を確認します。
4. 以後、本番ブランチへのプッシュが自動デプロイの起点になります。

既存プロジェクトに接続する場合は、管理画面のビルド設定も必ず確認してください。このREADMEだけでは既存の管理画面設定は変更されません。プロジェクト名が異なる場合は `wrangler.toml` の `name` を実際の名前に合わせます。

### ファイルを直接アップロードする場合

`dist` の内容をアップロードします。ローカル納品用の `otto-cloudflare-pages.zip` も利用できます（ZIPはGitHubには含めていません）。ZIPの直下に `index.html` があります。直接アップロードはGitHub連携による自動更新とは別の方式です。将来自動更新したい場合は、最初からGitHub連携をおすすめします。

この納品時点でCloudflareのアカウント設定・GitHub連携・公開操作は実施していません。公開用ファイルと設定の準備、Cloudflareのローカル配信環境での検証まで実施しています。

## ローカル確認

```sh
npm run build
npm run dev
```

`http://127.0.0.1:4214/` で表示されます。ビルドに外部パッケージのインストールは不要です。

```sh
npm run verify
node scripts/verify.mjs http://127.0.0.1:4214/
npm run preview:cloudflare-pages
```

Cloudflareのローカル確認は `http://127.0.0.1:4215/` です。Wranglerを初回にダウンロードする際はネット接続が必要ですが、ローカル確認にCloudflareへのログインは不要です。`deploy:cloudflare-pages` は実際に公開するためのコマンドです。公開先プロジェクトを確認してから使用してください。

## ファイル構成

- `scripts/build.mjs`: 日本語・英語の文章、共通レイアウトとHTML生成。
- `dist/`: 公開ファイル。画像・CSS・JavaScriptもこの中に保持しています。
- `assets.json`: 支給写真との対応と画像寸法。
- `scripts/verify.mjs`: 全ページ、リンク、写真、価格、予約情報、実際の配信内容、404の検証。
- `QUALITY_CHECK.md`: 検証記録。

元の写真、ヒアリング資料、認証情報、個人用ファイルは公開フォルダに含みません。画像は実際に提供された写真を使用し、生成した人物・料理は含みません。サイト内のロゴ表示は文字組みであり、支給ロゴの再現ではありません。

参考: [Cloudflare Pages の静的HTML対応](https://developers.cloudflare.com/pages/framework-guides/deploy-anything/) / [ビルド設定](https://developers.cloudflare.com/pages/configuration/build-configuration/)
