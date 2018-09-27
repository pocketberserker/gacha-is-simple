# Gacha is simple!

## 準備

このプロジェクトには都合によりいくつかのファイルを**同梱していません**。
実行したい場合は各種ファイルを準備してからビルドに進んでください。

### フォント

* `./image/font.png`
* `./text/glyph.json`

ビットマップフォントを利用するために必要です。

#### フォントファイルを生成する。

1. 使いたいファイルをプロジェクト直下にコピー
    * `./font.ttf`
1. [bmpfont-generator](https://github.com/akashic-games/bmpfont-generator)をインストール
1. `npm run font:generate`

#### ビットマップフォントを利用しない

`./src/cowlickConfig.ts` から `font` 変数と `glyph` 変数に関連するコードを削除してください。

## ビルド

```bash
# npm iは基本初回のみ
npm i
npm run build
```

## ローカルでの実行

以下のコマンドを実行し、コンソールに表示されたURLにアクセスしてください。

```bash
npm start
```
