# SHAREVOX

[![releases](https://img.shields.io/github/v/release/SHAREVOX/sharevox?label=Release)](https://github.com/SHAREVOX/sharevox/releases)
[![build](https://github.com/SHAREVOX/sharevox/actions/workflows/build.yml/badge.svg)](https://github.com/SHAREVOX/sharevox/actions/workflows/build.yml)
[![test](https://github.com/SHAREVOX/sharevox/actions/workflows/test.yml/badge.svg)](https://github.com/SHAREVOX/sharevox/actions/workflows/test.yml)
[![Discord](https://img.shields.io/discord/879570910208733277?color=5865f2&label=&logo=discord&logoColor=ffffff)](https://discord.gg/WMwWetrzuh)

[SHAREVOX](https://sharevox.app/) のエディターです。

（エンジンは [SHAREVOX ENGINE](https://github.com/SHAREVOX/sharevox_engine/) 、
コアは [SHAREVOX CORE](https://github.com/SHAREVOX/sharevox_core/) 、
全体構成は [こちら](./docs/全体構成.md) に詳細があります。）

## ユーザーの方へ

こちらは開発用のページになります。利用方法に関しては[SHAREVOX 公式サイト](https://sharevox.app/) をご覧ください。

## 貢献者の方へ

SHAREVOX のエディタは Electron・TypeScript・Vue・Vuex などが活用されており、全体構成がわかりにくくなっています。  
[コードの歩き方](./docs/コードの歩き方.md)で構成を紹介しているので、開発の一助になれば幸いです。

Issue を解決するプルリクエストを作成される際は、別の方と同じ Issue に取り組むことを避けるため、
Issue 側で取り組み始めたことを伝えるか、最初に Draft プルリクエストを作成してください。

[SHAREVOX Community Discord サーバー](https://discord.sharevox.app)にて、開発の議論や雑談を行っています。気軽にご参加ください。

### デザインガイドライン

[UX・UI デザインの方針](./docs/UX・UIデザインの方針.md)をご参照ください。

## 環境構築

[.node-version](.node-version) に記載されているバージョンの Node.js をインストールしてください。  
Node.js の管理ツール ([nvs](https://github.com/jasongin/nvs)や[Volta](https://volta.sh)など)を利用すると簡単にインストールでき、Node.js の自動切り替えもできます。

Node.js をインストール後、[このリポジトリ](https://github.com/SHAREVOX/sharevox.git) を
Fork して `git clone` し、次のコマンドを実行してください。

```bash
yarn install
```

## 実行

`.env.production`をコピーして`.env`を作成し、`VITE_DEFAULT_ENGINE_INFOS`内の`executionFilePath`に`sharevox_engine`のフルパスを指定します。

[製品版 SHAREVOX](https://sharevox.app/) のディレクトリのパスを指定すれば動きます。

Windows の場合でもパスの区切り文字は`\`ではなく`/`なのでご注意ください。

また、macOS 向けの`SHAREVOX.app`を利用している場合は`/path/to/SHAREVOX.app/Contents/MacOS/run`を指定してください。

Linux の場合は、[Releases](https://github.com/SHAREVOX/sharevox/releases/)から入手できる tar.gz 版に含まれる`run`コマンドを指定してください。
AppImage 版の場合は`$ /path/to/SHAREVOX.AppImage --appimage-mount`でファイルシステムをマウントできます。

SHAREVOX エディタの実行とは別にエンジン API のサーバを立てている場合は`executionFilePath`を指定する必要はありません。
これは製品版 SHAREVOX を起動している場合もあてはまります。

また、エンジン API の宛先エンドポイントを変更する場合は`VITE_DEFAULT_ENGINE_INFOS`内の`host`を変更してください。

```bash
yarn electron:serve
```

音声合成エンジンのリポジトリはこちらです <https://github.com/SHAREVOX/sharevox_engine>

<!-- ### ブラウザ版の実行（開発中）

別途音声合成エンジンを起動し、以下を実行して表示された localhost へアクセスします。

```bash
yarn browser:serve
```

また、main ブランチのビルド結果がこちらにデプロイされています <https://voicevox-browser-dev.netlify.app/#/home>  
今はローカル PC 上で音声合成エンジンを起動する必要があります。 -->

## ビルド

```bash
yarn electron:build
```

## テスト

### 単体テスト

```bash
yarn test:unit
yarn test-watch:unit # 監視モード
```

### ブラウザ End to End テスト

Electron の機能が不要な、UI や音声合成などの End to End テストを実行します。

```bash
yarn test:browser-e2e
yarn test-watch:browser-e2e # 監視モード
yarn test-watch:browser-e2e -- --headed # テスト中の UI を表示
```

Playwright を使用しているためテストパターンを生成することもできます。
ブラウザ版を起動している状態で以下のコマンドを実行してください。

```bash
npx playwright codegen http://localhost:5173/#/home  --viewport-size=800,600
```

詳細は [Playwright ドキュメントの Test generator](https://playwright.dev/docs/codegen-intro) を参照してください。

### Electron End to End テスト

Electron の機能が必要な、エンジン起動・終了などを含めた End to End テストを実行します。

```bash
yarn test:electron-e2e
yarn test-watch:electron-e2e # 監視モード
```

## 依存ライブラリのライセンス情報の生成

```bash
# get licenses.json from sharevox_engine as engine_licenses.json

yarn license:generate -- -o sharevox_licenses.json
yarn license:merge -- -o public/licenses.json -i engine_licenses.json -i sharevox_licenses.json
```

## コードフォーマット

コードのフォーマットを整えます。プルリクエストを送る前に実行してください。

```bash
yarn fmt
```

## タイポチェック

[typos](https://github.com/crate-ci/typos) を使ってタイポのチェックを行っています。
[typos をインストール](https://github.com/crate-ci/typos#install) した後

```bash
typos
```

でタイポチェックを行えます。
もし誤判定やチェックから除外すべきファイルがあれば
[設定ファイルの説明](https://github.com/crate-ci/typos#false-positives) に従って`_typos.toml`を編集してください。

## 型チェック

TypeScript の型チェックを行います。
※ 現在チェック方法は 2 種類ありますが、将来的に 1 つになります。

```bash
# .tsのみ型チェック
yarn typecheck

# .vueも含めて型チェック
# ※ 現状、大量にエラーが検出されます。
yarn typecheck:vue-tsc
```

## Markdownlint

Markdown の文法チェックを行います。

```bash
yarn markdownlint
```

## Shellcheck

ShellScript の文法チェックを行います。
インストール方法は [こちら](https://github.com/koalaman/shellcheck#installing) を参照してください。

```bash
shellcheck ./build/*.sh
```

## OpenAPI generator

音声合成エンジンが起動している状態で以下のコマンドを実行してください。  
なお、2023/07/02 現在、openapi-generator の最新版に[パッチ](https://github.com/OpenAPITools/openapi-generator/pull/15943)を当てたものを使わないと更新できない状態になっています。  
詳細は[こちら](https://github.com/SHAREVOX/sharevox/pull/1361)

```bash
curl http://127.0.0.1:50025/openapi.json >openapi.json

npx openapi-generator-cli generate \
    -i openapi.json \
    -g typescript-fetch \
    -o src/openapi/ \
    --additional-properties "modelPropertyNaming=camelCase,supportsES6=true,withInterfaces=true,typescriptThreePlus=true"

yarn fmt
```

## VS Code でのデバッグ実行

npm scripts の `serve` や `electron:serve` などの開発ビルド下では、ビルドに使用している vite で sourcemap を出力するため、ソースコードと出力されたコードの対応付けが行われます。

`.vscode/launch.template.json` をコピーして `.vscode/launch.json` を作成することで、開発ビルドを VS Code から実行し、デバッグを可能にするタスクが有効になります。

## ライセンス

本ソフトウェアは[LGPL v3](LICENSE)でライセンスされています
