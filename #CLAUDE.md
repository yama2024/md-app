# CLAUDE.md - AI開発ガイド

このファイルは、AI（Claude）がこのプロジェクトを理解し、効率的に開発作業を行うための情報を含んでいます。

## プロジェクト概要

**プロジェクト名**: マークダウン変換アプリ
**リポジトリ**: yama2024/md-app
**タイプ**: Webアプリケーション（静的HTML/CSS/JavaScript）
**目的**: テキストをマークダウン形式でリアルタイムプレビューし、HTMLとしてコピーできるツール

## プロジェクト構造

```
md-app/
├── index.html           # メインHTMLファイル - アプリケーションのUI構造
├── style.css            # スタイルシート - デザインとレイアウト
├── app.js               # JavaScript - マークダウン変換とコピー機能
├── README.md            # ユーザー向けドキュメント
├── FEATURE_IDEAS.md     # 機能拡張アイデアリスト（90以上の機能提案）
└── #CLAUDE.md          # このファイル - AI開発ガイド
```

## 技術スタック

### コア技術
- **HTML5**: セマンティックHTML
- **CSS3**: Grid、Flexbox、カスタムプロパティ、グラデーション
- **JavaScript (ES6+)**: モジュールパターン、非同期処理、最新のDOM API

### 外部ライブラリ
- **marked.js** (v11.1.1): マークダウンパーサー
  - CDN経由で読み込み
  - GitHub Flavored Markdown (GFM) サポート
  - 設定: `breaks: true`, `gfm: true`

### ブラウザAPI
- **Clipboard API**: HTMLとプレーンテキストの両方をコピー
- **LocalStorage**: (将来的な実装予定) 自動保存機能
- **File API**: (将来的な実装予定) ファイルのインポート/エクスポート

## アーキテクチャ

### データフロー
```
ユーザー入力 (textarea)
  ↓
イベントリスナー (input)
  ↓
convertMarkdown()
  ↓
marked.parse()
  ↓
DOM更新 (innerHTML)
  ↓
プレビュー表示
```

### コピー機能フロー
```
コピーボタンクリック
  ↓
copyToClipboard()
  ↓
navigator.clipboard.write()
  ↓
ClipboardItem (text/html + text/plain)
  ↓
通知表示
```

## コーディング規約

### JavaScript
- **命名規則**:
  - 変数・関数: キャメルケース (`convertMarkdown`, `inputText`)
  - 定数: アッパーキャメルケースまたはすべて大文字 (`MAX_LENGTH`)
  - DOM要素: 要素の役割を明確に (`inputText`, `outputPreview`)

- **関数設計**:
  - 単一責任の原則を守る
  - 純粋関数を優先（副作用を最小化）
  - エラーハンドリングは必須

- **非同期処理**:
  - `async/await` を使用
  - Promiseチェーンは避ける
  - エラーは適切に `try/catch` で処理

### CSS
- **設計思想**:
  - モバイルファーストではなく、デスクトップファーストで実装済み
  - レスポンシブデザイン: `@media` クエリで768px、600pxのブレークポイント
  - カラーパレット: 紫系グラデーション (`#667eea` → `#764ba2`)

- **命名規則**:
  - BEMは使用していない
  - セマンティックなクラス名 (`.container`, `.section-header`, `.copy-button`)
  - 状態クラス: `.show`, `.error`, `.placeholder`

- **ユーティリティ**:
  - カスタムスクロールバー
  - トランジションは `0.3s ease`
  - ボックスシャドウで奥行き表現

### HTML
- **セマンティック**:
  - `<header>`, `<main>`, `<section>` を適切に使用
  - ARIA属性は現在未実装（将来の改善点）

- **アクセシビリティ**:
  - `title` 属性でツールチップ提供
  - SVGアイコンの使用
  - キーボードナビゲーション対応（部分的）

## 開発ワークフロー

### ブランチ戦略
- **メインブランチ**: （未設定 - 初回コミット後に設定予定）
- **開発ブランチ**: `claude/markdown-converter-app-01PpemJcaFz7GgpyfizHgAPR`
- **命名規則**: `claude/{feature-name}-{session-id}`

### コミットメッセージ
- **フォーマット**: 日本語、複数行
- **例**:
  ```
  機能追加: ダークモード実装

  - ダークモード切り替えボタンを追加
  - LocalStorageで設定を永続化
  - プレビューエリアもダークテーマ対応
  ```

### テスト
- **現状**: 手動テストのみ
- **将来**: Jest、Playwright等の導入を検討

## 重要な実装詳細

### マークダウン変換
```javascript
// marked.jsの設定
marked.setOptions({
    breaks: true,        // 改行を<br>に変換
    gfm: true,          // GitHub Flavored Markdown
    headerIds: true,    // 見出しにIDを自動付与
    mangle: false       // メールアドレスの難読化を無効
});
```

### コピー機能の実装
- HTMLとプレーンテキストの両方をクリップボードに格納
- フォールバック: `writeText()` でHTML文字列のみコピー
- エラーハンドリング: ブラウザ互換性の問題に対処

### 通知システム
- DOMに動的に要素を追加
- CSSトランジションでアニメーション
- 3秒後に自動削除

## 既知の制限事項

### 現在の制限
1. **ファイル保存**: 現在はコピー機能のみ、.mdファイルのエクスポート未実装
2. **自動保存**: LocalStorageへの自動保存未実装
3. **複数ファイル**: 単一ファイルのみ編集可能
4. **オフライン対応**: PWA未実装
5. **アクセシビリティ**: ARIA属性、スクリーンリーダー対応が不完全

### ブラウザ互換性
- **推奨**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Clipboard API**: Safari 13.1+で一部制限あり
- **ES6機能**: IE11は非対応

## 今後の開発計画

### 優先度: 高（第1フェーズ）
詳細は `FEATURE_IDEAS.md` を参照

1. **ダークモード** - ユーザー要望が最も高い
2. **自動保存（LocalStorage）** - データ損失防止
3. **ファイルのインポート/エクスポート** - .mdファイル対応
4. **PDF出力** - jsPDFまたはhtml2pdfを使用
5. **ツールバー** - 太字、斜体等のボタンUI
6. **文字数カウンター** - ライター向け
7. **キーボードショートカット拡充** - Ctrl+B（太字）等

### 優先度: 中（第2フェーズ）
1. 目次（ToC）自動生成
2. スクロール同期
3. 検索・置換機能
4. 複数のプレビューテーマ
5. ドラッグ&ドロップ

### 優先度: 低（第3-4フェーズ）
1. リアルタイム共同編集
2. GitHub連携
3. Mermaid図表サポート
4. 数式（LaTeX）サポート
5. AI支援機能

## トラブルシューティング

### よくある問題

**問題**: コピー機能が動作しない
**原因**: HTTPSでないとClipboard APIが制限される
**解決**: ローカルサーバーを起動するか、HTTPSで配信

**問題**: マークダウンが正しくレンダリングされない
**原因**: marked.jsのバージョンまたは設定の問題
**解決**: CDNのURLを確認、marked.setOptions()の設定を確認

**問題**: CSSが崩れる
**原因**: グリッドレイアウトの非対応ブラウザ
**解決**: ブラウザバージョンを確認、フォールバックCSSを追加

## パフォーマンス最適化

### 現在の最適化
- CDNからのライブラリ読み込み（キャッシュ活用）
- CSSトランジションはGPUアクセラレーション（transform使用）
- 不要な再レンダリングを避ける

### 今後の最適化案
1. **デバウンス**: 入力イベントにデバウンス適用（大量のテキスト入力時）
2. **仮想スクロール**: 大規模ドキュメント対応
3. **Web Workers**: マークダウン変換をバックグラウンドで実行
4. **コード分割**: 必要な機能のみ遅延ロード

## セキュリティ考慮事項

### XSS対策
- **現状**: marked.jsはデフォルトでHTMLタグをエスケープ
- **注意**: `sanitize`オプションは非推奨のため使用していない
- **推奨**: DOMPurifyライブラリの導入を検討

### CSP（Content Security Policy）
- **現状**: 未設定
- **推奨**: インラインスクリプト禁止、CDNのホワイトリスト化

## デバッグ情報

### コンソールログ
- エラーは `console.error()` で出力
- マークダウン変換エラーはプレビューエリアにも表示

### 開発者ツール
```javascript
// デバッグ用: マークダウン変換結果を確認
console.log(marked.parse('# Test'));
```

## 外部リソース

### ドキュメント
- [marked.js Documentation](https://marked.js.org/)
- [MDN: Clipboard API](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API)
- [CommonMark Spec](https://commonmark.org/)
- [GitHub Flavored Markdown Spec](https://github.github.com/gfm/)

### 参考実装
- [Typora](https://typora.io/) - WYSIWYG Markdown Editor
- [StackEdit](https://stackedit.io/) - オンラインMarkdown Editor
- [HackMD](https://hackmd.io/) - 共同編集対応

## AI開発者への注意事項

### コードスタイル
- 既存のコードスタイルに従う
- コメントは日本語で記述
- 変数名・関数名は英語

### 新機能追加時
1. `FEATURE_IDEAS.md` で優先度を確認
2. 既存機能を壊さないよう注意
3. レスポンシブデザインを維持
4. ブラウザ互換性を考慮
5. アクセシビリティを向上

### Git操作
- コミット前に `git status` で確認
- コミットメッセージは詳細に
- プッシュは `claude/` プレフィックスのブランチのみ

### テスト手順
1. ブラウザで `index.html` を開く
2. テキスト入力 → プレビュー確認
3. コピーボタン → クリップボード確認
4. レスポンシブデザイン確認（DevTools）
5. 複数ブラウザで動作確認

## バージョン履歴

### v1.0.0 (2025-11-17)
- 初期リリース
- リアルタイムマークダウンプレビュー
- HTMLコピー機能
- レスポンシブデザイン
- GitHub Flavored Markdown対応

---

**最終更新**: 2025-11-17
**作成者**: Claude (AI Assistant)
**メンテナー**: yama2024
