# マークダウン変換アプリ

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Made with JavaScript](https://img.shields.io/badge/Made%20with-JavaScript-yellow.svg)](https://www.javascript.com/)

テキストをマークダウン形式でリアルタイムプレビューし、HTMLとしてコピーできるWebアプリケーションです。シンプルで使いやすいインターフェースと、充実した機能を備えています。

![App Screenshot](https://via.placeholder.com/800x400/667eea/ffffff?text=Markdown+Converter+App)

## 📋 目次

- [特徴](#特徴)
- [デモ](#デモ)
- [使い方](#使い方)
- [機能一覧](#機能一覧)
- [サポートしているマークダウン記法](#サポートしているマークダウン記法)
- [技術スタック](#技術スタック)
- [インストール](#インストール)
- [開発](#開発)
- [ブラウザ互換性](#ブラウザ互換性)
- [ロードマップ](#ロードマップ)
- [貢献](#貢献)
- [ライセンス](#ライセンス)
- [謝辞](#謝辞)

## ✨ 特徴

- 🚀 **リアルタイムプレビュー**: 入力と同時にマークダウン形式でプレビュー表示
- 📋 **ワンクリックコピー**: 変換されたHTMLを簡単にクリップボードへコピー
- 📱 **レスポンシブデザイン**: PC、タブレット、スマートフォンで快適に使用可能
- 🎨 **美しいUI**: モダンでクリーンなインターフェース
- ⚡ **高速動作**: 軽量で快適な編集体験
- 🔒 **プライバシー保護**: すべての処理はブラウザ内で完結（サーバー送信なし）
- 🆓 **完全無料**: オープンソースで無料で使用可能

## 🎬 デモ

### 基本的な使い方

1. 左側のエディタにマークダウンテキストを入力
2. 右側にリアルタイムでプレビューが表示されます
3. 「コピー」ボタンでHTMLをコピー

### サンプルテキスト

```markdown
# 見出し1
## 見出し2

**太字**と *斜体* のテキスト

- リスト項目1
- リスト項目2
- リスト項目3

[リンク](https://example.com)

`インラインコード`

\`\`\`javascript
console.log('Hello, World!');
\`\`\`
```

## 📖 使い方

### オンラインで使用

1. `index.html` をブラウザで開きます
2. 左側のテキストエリアにマークダウン記法でテキストを入力します
3. 右側にリアルタイムでプレビューが表示されます
4. 「コピー」ボタンをクリックして、変換されたHTMLをクリップボードにコピー

### キーボードショートカット

| ショートカット | 機能 |
|--------------|------|
| `Ctrl/Cmd + S` | 変換結果をコピー |

将来的に追加予定:
- `Ctrl/Cmd + B` - 太字
- `Ctrl/Cmd + I` - 斜体
- `Ctrl/Cmd + K` - リンク挿入

## 🎯 機能一覧

### 現在実装されている機能

- ✅ リアルタイムマークダウンプレビュー
- ✅ HTMLコピー機能
- ✅ レスポンシブデザイン
- ✅ GitHub Flavored Markdown (GFM) サポート
- ✅ キーボードショートカット（コピー）
- ✅ エラー通知システム
- ✅ 美しいUI/UX

### 近日実装予定（第1フェーズ）

- 🔜 ダークモード切り替え
- 🔜 自動保存（LocalStorage）
- 🔜 .mdファイルのインポート/エクスポート
- 🔜 PDF出力
- 🔜 ツールバー（フォーマットボタン）
- 🔜 文字数・単語数カウンター
- 🔜 キーボードショートカット拡充

詳細な機能拡張計画は [`FEATURE_IDEAS.md`](FEATURE_IDEAS.md) を参照してください（90以上の機能アイデアをリストアップ）。

## 📝 サポートしているマークダウン記法

### 基本記法

| 記法 | 例 | 結果 |
|------|-----|------|
| 見出し | `# H1` `## H2` `### H3` | 見出し1〜6 |
| 太字 | `**太字**` | **太字** |
| 斜体 | `*斜体*` | *斜体* |
| 取り消し線 | `~~取り消し~~` | ~~取り消し~~ |
| リンク | `[テキスト](URL)` | リンク |
| 画像 | `![代替テキスト](URL)` | 画像 |
| インラインコード | `` `code` `` | `code` |

### 拡張記法（GitHub Flavored Markdown）

- リスト（箇条書き・番号付き）
- チェックボックス（タスクリスト）
- コードブロック（シンタックスハイライト）
- 引用ブロック
- 水平線
- テーブル
- 改行（`<br>`自動変換）

### コードブロックの例

````markdown
```javascript
function greet(name) {
    return `Hello, ${name}!`;
}
```
````

### テーブルの例

```markdown
| 列1 | 列2 | 列3 |
|-----|-----|-----|
| A   | B   | C   |
| 1   | 2   | 3   |
```

## 🛠 技術スタック

### フロントエンド

- **HTML5** - セマンティックHTML
- **CSS3** - Grid、Flexbox、カスタムプロパティ
- **JavaScript (ES6+)** - モダンなJavaScript構文

### ライブラリ

- **[marked.js](https://marked.js.org/)** v11.1.1 - 高速で軽量なマークダウンパーサー
  - GitHub Flavored Markdown (GFM) 完全対応
  - 拡張可能なアーキテクチャ

### ブラウザAPI

- **Clipboard API** - HTMLとプレーンテキストのクリップボードコピー
- **DOM API** - 動的なコンテンツ更新
- **LocalStorage** (予定) - 自動保存機能

## 📦 インストール

### 前提条件

- モダンなWebブラウザ（Chrome 90+, Firefox 88+, Safari 14+, Edge 90+）
- インターネット接続（marked.jsのCDN読み込みのため）

### インストール手順

1. **リポジトリをクローン**

```bash
git clone https://github.com/yama2024/md-app.git
cd md-app
```

2. **ブラウザで開く**

```bash
# 直接HTMLファイルを開く
open index.html

# または、ローカルサーバーを起動（推奨）
python -m http.server 8000
# ブラウザで http://localhost:8000 にアクセス
```

### オフラインで使用する場合

marked.jsをローカルにダウンロードしてください:

```bash
# npmを使用する場合
npm install marked

# または手動でダウンロード
wget https://cdn.jsdelivr.net/npm/marked/marked.min.js
```

その後、`index.html` のCDNリンクをローカルパスに変更:

```html
<script src="./marked.min.js"></script>
```

## 💻 開発

### ファイル構成

```
md-app/
├── index.html           # メインHTMLファイル
├── style.css            # スタイルシート
├── app.js               # JavaScript（メインロジック）
├── README.md            # このファイル
├── FEATURE_IDEAS.md     # 機能拡張アイデア（90以上）
└── #CLAUDE.md          # AI開発ガイド
```

### カスタマイズ

#### スタイルのカスタマイズ

`style.css` でカラースキームやレイアウトを変更できます:

```css
/* カラーパレット */
--primary-color: #667eea;
--secondary-color: #764ba2;
--background-color: #ffffff;
--text-color: #333;
```

#### マークダウンパーサーの設定

`app.js` で marked.js の設定を調整できます:

```javascript
marked.setOptions({
    breaks: true,        // 改行を<br>に変換
    gfm: true,          // GitHub Flavored Markdown
    headerIds: true,    // 見出しにIDを自動付与
    mangle: false       // メールアドレスの難読化を無効
});
```

### デバッグ

開発者ツールのコンソールでエラーを確認できます:

```javascript
// マークダウン変換のテスト
console.log(marked.parse('# Test'));
```

## 🌐 ブラウザ互換性

| ブラウザ | 最小バージョン | 備考 |
|---------|---------------|------|
| Chrome | 90+ | ✅ 完全対応 |
| Firefox | 88+ | ✅ 完全対応 |
| Safari | 14+ | ⚠️ Clipboard API一部制限 |
| Edge | 90+ | ✅ 完全対応 |
| Internet Explorer | - | ❌ 非対応 |

### 機能別の互換性

- **Clipboard API**: Safari 13.1+で一部制限あり
- **ES6機能**: IE11非対応
- **CSS Grid**: IE11非対応

## 🗺 ロードマップ

### バージョン 1.1.0（2025年Q1予定）

- [ ] ダークモード実装
- [ ] 自動保存機能
- [ ] ファイルのインポート/エクスポート
- [ ] ツールバー（フォーマットボタン）
- [ ] 文字数カウンター

### バージョン 1.2.0（2025年Q2予定）

- [ ] PDF出力機能
- [ ] 目次（ToC）自動生成
- [ ] 複数のプレビューテーマ
- [ ] 検索・置換機能
- [ ] ドラッグ&ドロップ

### バージョン 2.0.0（2025年Q3-Q4予定）

- [ ] リアルタイム共同編集
- [ ] GitHub連携
- [ ] Mermaid図表サポート
- [ ] 数式（LaTeX）サポート
- [ ] PWA対応

詳細は [`FEATURE_IDEAS.md`](FEATURE_IDEAS.md) を参照してください。

## 🤝 貢献

貢献を歓迎します！以下の方法で貢献できます:

### バグ報告

GitHubのIssuesでバグを報告してください。以下の情報を含めると助かります:

- ブラウザとバージョン
- 再現手順
- 期待される動作
- 実際の動作
- スクリーンショット（あれば）

### 機能リクエスト

新しい機能のアイデアがある場合は、Issuesで提案してください。

### プルリクエスト

1. リポジトリをフォーク
2. 新しいブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

### コーディング規約

- JavaScript: ESLint推奨設定に従う
- CSS: セマンティックなクラス名を使用
- コメント: 日本語または英語
- コミットメッセージ: 日本語で詳細に記述

詳細は [`#CLAUDE.md`](#CLAUDE.md) を参照してください。

## 📄 ライセンス

このプロジェクトは [MIT License](https://opensource.org/licenses/MIT) のもとで公開されています。

```
MIT License

Copyright (c) 2025 yama2024

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## 🙏 謝辞

このプロジェクトは以下のオープンソースプロジェクトを使用しています:

- **[marked.js](https://marked.js.org/)** - マークダウンパーサー
- **[CommonMark](https://commonmark.org/)** - マークダウン仕様
- **[GitHub Flavored Markdown](https://github.github.com/gfm/)** - GFM仕様

インスピレーションを得たプロジェクト:

- **[Typora](https://typora.io/)** - WYSIWYG Markdown Editor
- **[StackEdit](https://stackedit.io/)** - オンラインMarkdown Editor
- **[HackMD](https://hackmd.io/)** - 共同編集対応Markdown Editor
- **[Dillinger](https://dillinger.io/)** - クラウド連携Markdown Editor

## 📞 サポート

質問や問題がある場合:

- 📧 Email: （メールアドレスを追加）
- 🐛 Issues: [GitHub Issues](https://github.com/yama2024/md-app/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/yama2024/md-app/discussions)

## 📊 統計情報

- **プロジェクト作成日**: 2025年11月17日
- **最終更新日**: 2025年11月17日
- **バージョン**: 1.0.0
- **ライセンス**: MIT
- **言語**: JavaScript (100%)

---

<p align="center">
Made with ❤️ by <a href="https://github.com/yama2024">yama2024</a>
</p>

<p align="center">
⭐ このプロジェクトが気に入ったら、スターを付けてください！
</p>
