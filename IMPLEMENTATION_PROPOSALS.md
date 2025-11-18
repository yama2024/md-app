# マークダウン変換アプリ - 実装提案書

> 現在のアプリケーションを分析し、具体的な追加機能と改善点を優先度別に提案

**作成日**: 2025-11-17
**対象バージョン**: v1.0.0 → v1.1.0+
**分析対象**: index.html, app.js, style.css

---

## 📊 現状分析

### 現在実装されている機能
- ✅ リアルタイムマークダウンプレビュー
- ✅ HTMLコピー機能（Clipboard API使用）
- ✅ 通知システム
- ✅ キーボードショートカット（Ctrl/Cmd + S）
- ✅ レスポンシブデザイン
- ✅ エラーハンドリング

### 現在の制約・課題
- ❌ データの永続化なし（リロードで消える）
- ❌ ファイルのインポート/エクスポート不可
- ❌ ダークモード未対応
- ❌ ツールバーなし（マークダウン記法を知る必要がある）
- ❌ 文字数カウンターなし
- ❌ 元に戻す/やり直しの多段階履歴なし
- ❌ プレビューテーマが1種類のみ
- ❌ スクロール同期なし

---

## 🎯 提案の全体構成

### カテゴリ分類（10分類）

1. **データ永続化・ファイル管理** - データの保存と読み込み
2. **エディター機能強化** - 入力支援とツールバー
3. **プレビュー機能強化** - 表示の拡張
4. **エクスポート機能** - 様々な形式への出力
5. **UI/UX改善** - 使いやすさの向上
6. **テーマ・デザイン** - 見た目のカスタマイズ
7. **パフォーマンス最適化** - 速度とメモリ使用量
8. **アクセシビリティ** - すべての人が使える
9. **セキュリティ強化** - 安全性の向上
10. **ユーティリティ機能** - 便利な補助機能

---

## 🔥 優先度別提案（即実装すべき機能）

### 【最優先】Priority S: 今すぐ実装すべき

実装難易度が低く、ユーザーインパクトが極めて高い機能

#### S-1. LocalStorage自動保存 ⭐⭐⭐⭐⭐

**カテゴリ**: データ永続化・ファイル管理
**実装難易度**: 🟢 低（2-3時間）
**ユーザーインパクト**: 🔥 極大
**技術**: LocalStorage API

**現在の問題**:
- ブラウザをリロードすると入力内容がすべて消える
- ユーザーが意図せずタブを閉じると作業が失われる

**実装内容**:
```javascript
// 自動保存（入力時にデバウンス付きで保存）
let saveTimeout;
function autoSave() {
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(() => {
        localStorage.setItem('markdown-content', inputText.value);
        localStorage.setItem('last-saved', new Date().toISOString());
    }, 1000); // 1秒後に保存
}

// 復元（ページロード時）
function restoreContent() {
    const saved = localStorage.getItem('markdown-content');
    if (saved) {
        inputText.value = saved;
        convertMarkdown();
        showNotification('前回の内容を復元しました', 'success');
    }
}
```

**追加UI要素**:
- 「最終保存時刻」の表示
- 「新規作成」ボタン（LocalStorageをクリア）
- 自動保存インジケーター

**期待効果**:
- データ損失のリスクが激減
- ユーザーの信頼性向上
- セッションをまたいで作業継続可能

---

#### S-2. ファイルのインポート/エクスポート (.md) ⭐⭐⭐⭐⭐

**カテゴリ**: データ永続化・ファイル管理
**実装難易度**: 🟢 低（3-4時間）
**ユーザーインパクト**: 🔥 極大
**技術**: File API, Blob, FileSaver

**現在の問題**:
- ローカルの.mdファイルを編集できない
- 作業結果を.mdファイルとして保存できない

**実装内容**:

**エクスポート機能**:
```javascript
function exportMarkdown() {
    const content = inputText.value;
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `document-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
    showNotification('ファイルをダウンロードしました', 'success');
}
```

**インポート機能**:
```javascript
function importMarkdown() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.md,.markdown,.txt';
    input.onchange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = (event) => {
            inputText.value = event.target.result;
            convertMarkdown();
            showNotification(`${file.name} を読み込みました`, 'success');
        };
        reader.readAsText(file);
    };
    input.click();
}
```

**UI追加**:
- ヘッダーに「ファイル」メニュー
  - 「新規作成」
  - 「開く...」
  - 「保存」(Ctrl+S)
  - 「名前を付けて保存...」

**期待効果**:
- ローカルファイルとの連携が可能に
- 他のエディタとの互換性
- 実用的なツールとして使用可能

---

#### S-3. ダークモード切り替え ⭐⭐⭐⭐⭐

**カテゴリ**: テーマ・デザイン
**実装難易度**: 🟢 低（2-3時間）
**ユーザーインパクト**: 🔥 極大
**技術**: CSS Variables, LocalStorage

**現在の問題**:
- 長時間使用すると目が疲れる
- 夜間の使用に不向き
- 最も要望が多い機能

**実装内容**:

**CSS変数定義**:
```css
:root {
    --bg-primary: #ffffff;
    --bg-secondary: #f8f9fa;
    --text-primary: #333;
    --text-secondary: #666;
    --border-color: #e0e0e0;
    --accent-color: #667eea;
}

[data-theme="dark"] {
    --bg-primary: #1e1e1e;
    --bg-secondary: #2d2d2d;
    --text-primary: #e0e0e0;
    --text-secondary: #b0b0b0;
    --border-color: #404040;
    --accent-color: #8b9cf6;
}

body {
    background: var(--bg-primary);
    color: var(--text-primary);
}
```

**JavaScript実装**:
```javascript
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    showNotification(`${newTheme === 'dark' ? 'ダーク' : 'ライト'}モードに切り替えました`, 'success');
}

// 初期化時にテーマを復元
const savedTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', savedTheme);
```

**UI追加**:
- ヘッダーに月/太陽アイコンのトグルボタン
- システム設定に従う「自動」オプション

**期待効果**:
- 長時間使用時の目の疲労軽減
- ユーザー満足度向上
- モダンなアプリとしての印象

---

#### S-4. 文字数・単語数カウンター ⭐⭐⭐⭐⭐

**カテゴリ**: ユーティリティ機能
**実装難易度**: 🟢 低（1-2時間）
**ユーザーインパクト**: 🔥 大
**技術**: String操作、正規表現

**現在の問題**:
- テキストの量が把握できない
- ライターや学生にとって必須機能が欠けている

**実装内容**:
```javascript
function updateStats() {
    const text = inputText.value;
    const chars = text.length;
    const charsNoSpaces = text.replace(/\s/g, '').length;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const lines = text.split('\n').length;
    const readingTime = Math.ceil(words / 200); // 1分200語で計算

    document.getElementById('char-count').textContent = chars;
    document.getElementById('word-count').textContent = words;
    document.getElementById('line-count').textContent = lines;
    document.getElementById('reading-time').textContent = readingTime;
}
```

**UI追加**:
```html
<div class="stats-bar">
    <span><strong>文字数:</strong> <span id="char-count">0</span></span>
    <span><strong>単語数:</strong> <span id="word-count">0</span></span>
    <span><strong>行数:</strong> <span id="line-count">0</span></span>
    <span><strong>読了時間:</strong> <span id="reading-time">0</span>分</span>
</div>
```

**期待効果**:
- ライター向け機能
- 文章の量を把握しやすい
- プロフェッショナルなツールとしての価値向上

---

#### S-5. ツールバー（フォーマットボタン） ⭐⭐⭐⭐⭐

**カテゴリ**: エディター機能強化
**実装難易度**: 🟡 中（4-6時間）
**ユーザーインパクト**: 🔥 極大
**技術**: DOM操作、Selection API

**現在の問題**:
- マークダウン記法を知らないと使えない
- 初心者にとってハードルが高い

**実装内容**:
```javascript
function insertMarkdown(before, after = '') {
    const start = inputText.selectionStart;
    const end = inputText.selectionEnd;
    const selectedText = inputText.value.substring(start, end);
    const replacement = before + selectedText + after;

    inputText.setRangeText(replacement, start, end, 'select');
    inputText.focus();
    convertMarkdown();
}

// ボタンアクション
const toolbarActions = {
    bold: () => insertMarkdown('**', '**'),
    italic: () => insertMarkdown('*', '*'),
    heading: () => insertMarkdown('# '),
    link: () => insertMarkdown('[', '](url)'),
    image: () => insertMarkdown('![alt](', ')'),
    code: () => insertMarkdown('`', '`'),
    codeBlock: () => insertMarkdown('```\n', '\n```'),
    ul: () => insertMarkdown('- '),
    ol: () => insertMarkdown('1. '),
    quote: () => insertMarkdown('> '),
    hr: () => insertMarkdown('\n---\n')
};
```

**UI追加**:
```html
<div class="toolbar">
    <button onclick="toolbarActions.bold()" title="太字 (Ctrl+B)">
        <strong>B</strong>
    </button>
    <button onclick="toolbarActions.italic()" title="斜体 (Ctrl+I)">
        <em>I</em>
    </button>
    <button onclick="toolbarActions.heading()" title="見出し">
        H
    </button>
    <!-- その他のボタン -->
</div>
```

**期待効果**:
- 初心者でも簡単に使える
- マークダウン記法を学習しながら使用可能
- UX大幅向上

---

### 【高優先】Priority A: 早期に実装すべき

実装難易度が中程度で、ユーザーインパクトが高い機能

#### A-1. キーボードショートカット拡充 ⭐⭐⭐⭐

**カテゴリ**: エディター機能強化
**実装難易度**: 🟡 中（3-4時間）
**ユーザーインパクト**: 🔥 大

**追加ショートカット**:
- `Ctrl/Cmd + B` - 太字
- `Ctrl/Cmd + I` - 斜体
- `Ctrl/Cmd + K` - リンク挿入
- `Ctrl/Cmd + Z` - 元に戻す
- `Ctrl/Cmd + Shift + Z` - やり直し
- `Ctrl/Cmd + /` - コメント
- `Tab` - インデント
- `Shift + Tab` - インデント解除

**実装**:
```javascript
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey) {
        switch(e.key) {
            case 'b':
                e.preventDefault();
                toolbarActions.bold();
                break;
            case 'i':
                e.preventDefault();
                toolbarActions.italic();
                break;
            case 'k':
                e.preventDefault();
                toolbarActions.link();
                break;
        }
    }
});
```

---

#### A-2. 元に戻す/やり直し（多段階履歴） ⭐⭐⭐⭐

**カテゴリ**: エディター機能強化
**実装難易度**: 🟡 中（4-5時間）
**ユーザーインパクト**: 🔥 大

**実装**:
```javascript
class UndoRedoManager {
    constructor(maxHistory = 50) {
        this.history = [];
        this.currentIndex = -1;
        this.maxHistory = maxHistory;
    }

    saveState(content) {
        // 現在位置より後の履歴を削除
        this.history = this.history.slice(0, this.currentIndex + 1);

        // 新しい状態を追加
        this.history.push(content);

        // 履歴が上限を超えたら古いものを削除
        if (this.history.length > this.maxHistory) {
            this.history.shift();
        } else {
            this.currentIndex++;
        }
    }

    undo() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            return this.history[this.currentIndex];
        }
        return null;
    }

    redo() {
        if (this.currentIndex < this.history.length - 1) {
            this.currentIndex++;
            return this.history[this.currentIndex];
        }
        return null;
    }
}
```

---

#### A-3. スクロール同期 ⭐⭐⭐⭐

**カテゴリ**: プレビュー機能強化
**実装難易度**: 🟡 中（3-4時間）
**ユーザーインパクト**: 🔥 中〜大

**実装**:
```javascript
let isScrolling = false;

inputText.addEventListener('scroll', () => {
    if (isScrolling) return;
    isScrolling = true;

    const scrollPercentage = inputText.scrollTop /
        (inputText.scrollHeight - inputText.clientHeight);

    outputPreview.scrollTop = scrollPercentage *
        (outputPreview.scrollHeight - outputPreview.clientHeight);

    setTimeout(() => { isScrolling = false; }, 100);
});
```

---

#### A-4. コピーオプション拡張 ⭐⭐⭐⭐

**カテゴリ**: エクスポート機能
**実装難易度**: 🟢 低（2-3時間）
**ユーザーインパクト**: 🔥 中

**追加オプション**:
- HTMLをコピー（現在実装済み）
- マークダウンをコピー
- プレーンテキストをコピー
- 選択範囲のみコピー

**UI**:
```html
<div class="copy-dropdown">
    <button id="copy-btn">コピー ▼</button>
    <div class="dropdown-menu">
        <button onclick="copy('html')">HTMLをコピー</button>
        <button onclick="copy('markdown')">マークダウンをコピー</button>
        <button onclick="copy('text')">テキストをコピー</button>
    </div>
</div>
```

---

#### A-5. 検索・置換機能 ⭐⭐⭐⭐

**カテゴリ**: エディター機能強化
**実装難易度**: 🟡 中（5-6時間）
**ユーザーインパクト**: 🔥 大

**実装**:
```javascript
function searchInText(query, options = {}) {
    const { caseSensitive = false, wholeWord = false } = options;
    let flags = 'g';
    if (!caseSensitive) flags += 'i';

    const pattern = wholeWord ? `\\b${query}\\b` : query;
    const regex = new RegExp(pattern, flags);

    const matches = [...inputText.value.matchAll(regex)];
    return matches;
}

function replaceAll(searchQuery, replaceText) {
    const newContent = inputText.value.replace(
        new RegExp(searchQuery, 'g'),
        replaceText
    );
    inputText.value = newContent;
    convertMarkdown();
}
```

**UI**:
- Ctrl+F で検索ボックス表示
- Ctrl+H で置換ボックス表示
- 大文字小文字の区別オプション
- 正規表現オプション

---

#### A-6. 目次（Table of Contents）自動生成 ⭐⭐⭐⭐

**カテゴリ**: プレビュー機能強化
**実装難易度**: 🟡 中（3-4時間）
**ユーザーインパクト**: 🔥 中〜大

**実装**:
```javascript
function generateTOC() {
    const headings = outputPreview.querySelectorAll('h1, h2, h3, h4, h5, h6');
    const toc = document.createElement('nav');
    toc.className = 'table-of-contents';

    const ul = document.createElement('ul');
    headings.forEach((heading, index) => {
        const li = document.createElement('li');
        li.className = `toc-${heading.tagName.toLowerCase()}`;

        const a = document.createElement('a');
        a.href = `#${heading.id || 'heading-' + index}`;
        a.textContent = heading.textContent;
        a.onclick = (e) => {
            e.preventDefault();
            heading.scrollIntoView({ behavior: 'smooth' });
        };

        li.appendChild(a);
        ul.appendChild(li);
    });

    toc.appendChild(ul);
    return toc;
}
```

**UI**:
- プレビューエリア上部に目次を表示
- 折りたたみ可能
- クリックでジャンプ

---

#### A-7. PDF出力 ⭐⭐⭐⭐⭐

**カテゴリ**: エクスポート機能
**実装難易度**: 🟡 中（5-7時間）
**ユーザーインパクト**: 🔥 極大

**使用ライブラリ**: html2pdf.js または jsPDF

**実装**:
```javascript
async function exportToPDF() {
    const element = outputPreview;
    const opt = {
        margin: 1,
        filename: `document-${Date.now()}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    };

    try {
        await html2pdf().set(opt).from(element).save();
        showNotification('PDFをダウンロードしました', 'success');
    } catch (error) {
        showNotification('PDF出力に失敗しました', 'error');
        console.error(error);
    }
}
```

**追加要素**:
- ページサイズ選択（A4、Letter、etc）
- 余白設定
- ヘッダー/フッター設定

---

### 【中優先】Priority B: 検討して実装

実装難易度または優先度が中程度の機能

#### B-1. 複数のプレビューテーマ ⭐⭐⭐

**カテゴリ**: テーマ・デザイン
**実装難易度**: 🟡 中（4-5時間）

**テーマ例**:
- GitHub風
- Medium風
- Read the Docs風
- Minimal（最小限）
- Academic（学術論文風）

---

#### B-2. ドラッグ&ドロップでファイル読み込み ⭐⭐⭐

**カテゴリ**: データ永続化・ファイル管理
**実装難易度**: 🟡 中（3-4時間）

**実装**:
```javascript
inputText.addEventListener('drop', (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.includes('text')) {
        const reader = new FileReader();
        reader.onload = (event) => {
            inputText.value = event.target.result;
            convertMarkdown();
        };
        reader.readAsText(file);
    }
});

inputText.addEventListener('dragover', (e) => {
    e.preventDefault();
    inputText.classList.add('drag-over');
});
```

---

#### B-3. プレビューの印刷最適化 ⭐⭐⭐

**カテゴリ**: エクスポート機能
**実装難易度**: 🟢 低（2-3時間）

**実装**:
```css
@media print {
    .section-header,
    .toolbar,
    .input-section,
    header,
    .info-section {
        display: none;
    }

    .output-section {
        width: 100%;
        border: none;
    }

    .preview-content {
        padding: 0;
    }
}
```

---

#### B-4. テンプレート機能 ⭐⭐⭐

**カテゴリ**: ユーティリティ機能
**実装難易度**: 🟡 中（3-4時間）

**テンプレート例**:
- README.md
- ブログ記事
- 会議議事録
- TODO リスト
- 技術文書

---

#### B-5. 画像のペースト対応 ⭐⭐⭐

**カテゴリ**: エディター機能強化
**実装難易度**: 🟡 中（4-5時間）

**実装**:
```javascript
inputText.addEventListener('paste', async (e) => {
    const items = e.clipboardData.items;
    for (let item of items) {
        if (item.type.indexOf('image') !== -1) {
            e.preventDefault();
            const blob = item.getAsFile();
            const reader = new FileReader();
            reader.onload = (event) => {
                const base64 = event.target.result;
                const markdown = `![image](${base64})`;
                insertAtCursor(markdown);
            };
            reader.readAsDataURL(blob);
        }
    }
});
```

---

#### B-6. マークダウン構文チェッカー ⭐⭐⭐

**カテゴリ**: ユーティリティ機能
**実装難易度**: 🟡 中（5-6時間）

**チェック項目**:
- リンクの閉じ忘れ
- コードブロックの閉じ忘れ
- リスト記法のミス
- 見出しレベルのスキップ警告

---

### 【低優先】Priority C: 余裕があれば実装

実装難易度が高いか、ニッチな機能

#### C-1. リアルタイム共同編集 ⭐⭐

**実装難易度**: 🔴 高（20-30時間+サーバー必要）

WebSocketまたはWebRTCを使用した複数ユーザー同時編集

---

#### C-2. Mermaid図表サポート ⭐⭐⭐

**実装難易度**: 🟡 中（3-4時間）

```javascript
// mermaid.jsを追加
<script src="https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js"></script>

mermaid.initialize({ startOnLoad: true });
```

---

#### C-3. 数式（LaTeX/MathJax）サポート ⭐⭐⭐

**実装難易度**: 🟡 中（4-5時間）

```html
<script src="https://cdn.jsdelivr.net/npm/katex/dist/katex.min.js"></script>
```

---

#### C-4. PWA対応（オフライン使用） ⭐⭐⭐

**実装難易度**: 🟡 中（5-7時間）

Service Workerとmanifest.jsonの実装

---

#### C-5. GitHub連携 ⭐⭐

**実装難易度**: 🔴 高（15-20時間）

GitHub APIを使用したリポジトリ連携

---

## 📊 実装優先度マトリックス

### 緊急度 × 重要度マトリックス

```
高重要 │ S-1,S-2,S-3,S-4,S-5 │ A-7(PDF)
      │ 自動保存、ファイル  │ A-1,A-2,A-3
      │ ダーク、カウンター  │ ショートカット
──────┼─────────────────┼──────────────
低重要 │ B-2,B-3,B-4       │ C-1,C-4,C-5
      │ ドラッグ、印刷    │ 共同編集、PWA
      │ テンプレート      │ GitHub連携
      └──────────────────┴──────────────
        低緊急度              高緊急度
```

---

## 🚀 推奨実装ロードマップ

### Phase 1: 基盤強化（1-2週間）
1. **S-1**: LocalStorage自動保存 ✅
2. **S-2**: ファイルのインポート/エクスポート ✅
3. **S-3**: ダークモード ✅
4. **S-4**: 文字数カウンター ✅

**目標**: データ損失を防ぎ、基本的なファイル操作を可能にする

### Phase 2: UX向上（2-3週間）
5. **S-5**: ツールバー ✅
6. **A-1**: キーボードショートカット拡充 ✅
7. **A-2**: Undo/Redo ✅
8. **A-4**: コピーオプション拡張 ✅

**目標**: 初心者でも使いやすく、パワーユーザーにも対応

### Phase 3: プレビュー強化（1-2週間）
9. **A-3**: スクロール同期 ✅
10. **A-6**: 目次自動生成 ✅
11. **B-1**: 複数プレビューテーマ ✅

**目標**: プレビュー機能を充実させる

### Phase 4: エクスポート拡充（1-2週間）
12. **A-7**: PDF出力 ✅
13. **B-3**: 印刷最適化 ✅

**目標**: 様々な形式で出力可能にする

### Phase 5: 高度な機能（2-4週間）
14. **A-5**: 検索・置換 ✅
15. **B-4**: テンプレート機能 ✅
16. **B-5**: 画像ペースト ✅
17. **B-6**: 構文チェッカー ✅

---

## 💡 即効性のある改善（1日以内に実装可能）

### 超クイック改善リスト

1. **プレースホルダーテキストの改善**（10分）
   - より具体的な使用例を表示
   - チュートリアル的な内容に

2. **フォーカス時の入力エリア背景色**（既に実装済み✅）

3. **エラーメッセージの詳細化**（15分）
   - 何が問題か具体的に表示

4. **通知の位置調整**（10分）
   - モバイルでも見やすい位置に

5. **ローディングインジケーター**（30分）
   - 大きなファイルの変換時に表示

6. **ヘッダーにバージョン番号表示**（5分）
   ```html
   <p>v1.0.0 - テキストを入力すると...</p>
   ```

7. **キーボードショートカットのヘルプ**（1時間）
   - `?`キーでショートカット一覧を表示

8. **コピー成功時のアニメーション強化**（30分）
   - ボタンのチェックマークアニメーション

---

## 🎨 UI/UX具体的改善提案

### 現在のUIの問題点と解決策

#### 問題1: 入力エリアが狭い
**解決策**:
- 分割比率を調整可能に（ドラッグでリサイズ）
- 全画面モード追加

#### 問題2: ツールが見つけにくい
**解決策**:
- ヘッダーにメニューバー追加
- ツールバーを入力エリア上部に配置

#### 問題3: モバイルで使いにくい
**解決策**:
- タブ切り替えで入力/プレビューを切り替え
- スワイプジェスチャー対応

#### 問題4: 初めて使う人に不親切
**解決策**:
- 初回訪問時にチュートリアル表示
- サンプルテキストをデフォルトで表示

---

## 🔧 技術的改善提案

### パフォーマンス最適化

1. **デバウンス処理の追加**（1時間）
```javascript
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

const debouncedConvert = debounce(convertMarkdown, 300);
inputText.addEventListener('input', debouncedConvert);
```

2. **大きなドキュメントの最適化**（2-3時間）
   - 仮想スクロール実装
   - 変換結果のキャッシング

3. **メモリリーク対策**（1時間）
   - イベントリスナーの適切な削除
   - 不要なDOM要素のクリーンアップ

### セキュリティ強化

1. **XSS対策強化**（2-3時間）
```javascript
// DOMPurifyライブラリの導入
import DOMPurify from 'dompurify';

function convertMarkdown() {
    const html = marked.parse(inputText.value);
    const clean = DOMPurify.sanitize(html);
    outputPreview.innerHTML = clean;
}
```

2. **CSP（Content Security Policy）設定**（30分）
```html
<meta http-equiv="Content-Security-Policy"
      content="default-src 'self';
               script-src 'self' https://cdn.jsdelivr.net;
               style-src 'self' 'unsafe-inline';">
```

---

## 📈 期待される効果

### 全機能実装後の状態

**現在（v1.0.0）**:
- 基本的なマークダウンプレビューツール
- データ永続化なし
- 限定的な機能

**Phase 1完了後（v1.1.0）**:
- データ損失なし
- ファイル操作可能
- ダークモード対応
- 実用的なツールとして使用可能

**Phase 2完了後（v1.2.0）**:
- 初心者でも使いやすい
- パワーユーザー向け機能充実
- 快適な編集体験

**Phase 4完了後（v1.4.0）**:
- プロフェッショナルツールとして完成
- PDF/印刷対応
- 様々な用途に対応

**全機能実装後（v2.0.0）**:
- 業界トップクラスのマークダウンエディタ
- リアルタイム共同編集
- 高度な図表・数式対応
- PWA対応でオフライン使用可能

---

## ✅ まとめ: 今すぐ実装すべき5つの機能

優先度と実装難易度を考慮した、最優先で実装すべき機能:

### 1位: LocalStorage自動保存 (S-1)
**理由**: データ損失防止は最優先課題

### 2位: ファイルのインポート/エクスポート (S-2)
**理由**: 実用性が劇的に向上

### 3位: ダークモード (S-3)
**理由**: 実装が簡単で効果絶大

### 4位: 文字数カウンター (S-4)
**理由**: 実装が簡単で需要が高い

### 5位: ツールバー (S-5)
**理由**: 初心者への配慮、UX大幅向上

---

**次のステップ**: Phase 1の4機能を実装することを強く推奨します。これだけで、アプリケーションの実用性とユーザー満足度が大幅に向上します。

**作成者**: Claude
**最終更新**: 2025-11-17
