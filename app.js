// DOM要素の取得
const inputText = document.getElementById('input-text');
const outputPreview = document.getElementById('output-preview');
const copyBtn = document.getElementById('copy-btn');
const themeToggle = document.getElementById('theme-toggle');
const newBtn = document.getElementById('new-btn');
const openBtn = document.getElementById('open-btn');
const saveBtn = document.getElementById('save-btn');
const lastSavedText = document.getElementById('last-saved');
const charCount = document.getElementById('char-count');
const wordCount = document.getElementById('word-count');
const lineCount = document.getElementById('line-count');

// marked.jsの設定
marked.setOptions({
    breaks: true,
    gfm: true,
    headerIds: true,
    mangle: false
});

// ===========================
// 1. LocalStorage自動保存機能
// ===========================

let saveTimeout;
const STORAGE_KEY = 'markdown-content';
const LAST_SAVED_KEY = 'markdown-last-saved';

// 自動保存（デバウンス付き）
function autoSave() {
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(() => {
        try {
            localStorage.setItem(STORAGE_KEY, inputText.value);
            const now = new Date();
            localStorage.setItem(LAST_SAVED_KEY, now.toISOString());
            updateLastSavedText(now);
        } catch (error) {
            console.error('自動保存エラー:', error);
        }
    }, 1000); // 1秒後に保存
}

// 最終保存時刻を表示
function updateLastSavedText(date) {
    const timeString = date.toLocaleTimeString('ja-JP', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    lastSavedText.textContent = `最終保存: ${timeString}`;
}

// 保存された内容を復元
function restoreContent() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        const lastSaved = localStorage.getItem(LAST_SAVED_KEY);

        if (saved) {
            inputText.value = saved;
            convertMarkdown();
            updateStats();

            if (lastSaved) {
                const date = new Date(lastSaved);
                updateLastSavedText(date);
                showNotification('前回の内容を復元しました', 'success');
            }
        }
    } catch (error) {
        console.error('復元エラー:', error);
    }
}

// ===========================
// 2. HTMLエクスポート機能
// ===========================

// HTMLファイルとしてエクスポート
function exportAsHTML() {
    const htmlContent = outputPreview.innerHTML;

    // 空のコンテンツチェック
    if (htmlContent.includes('placeholder') || htmlContent.includes('error') || !htmlContent.trim()) {
        showNotification('エクスポートする内容がありません', 'error');
        return;
    }

    try {
        // 埋め込み用CSSスタイル
        const embeddedCSS = `
/* リセット */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
    line-height: 1.6;
    color: #333;
    background: #ffffff;
    padding: 40px 20px;
    max-width: 900px;
    margin: 0 auto;
}

/* 見出し */
h1, h2, h3, h4, h5, h6 {
    margin-top: 24px;
    margin-bottom: 16px;
    font-weight: 600;
    line-height: 1.25;
    color: #1a1a1a;
}

h1 {
    font-size: 2em;
    border-bottom: 2px solid #e0e0e0;
    padding-bottom: 10px;
}

h2 {
    font-size: 1.5em;
    border-bottom: 1px solid #e0e0e0;
    padding-bottom: 8px;
}

h3 {
    font-size: 1.25em;
}

/* 段落 */
p {
    margin-bottom: 16px;
}

/* リンク */
a {
    color: #667eea;
    text-decoration: none;
}

a:hover {
    text-decoration: underline;
}

/* リスト */
ul, ol {
    margin-bottom: 16px;
    padding-left: 2em;
}

li {
    margin-bottom: 8px;
}

/* コード */
code {
    background: #f6f8fa;
    padding: 2px 6px;
    border-radius: 3px;
    font-family: 'Consolas', 'Monaco', monospace;
    font-size: 0.9em;
    color: #e74c3c;
}

pre {
    background: #2d2d2d;
    color: #f8f8f2;
    padding: 16px;
    border-radius: 6px;
    overflow-x: auto;
    margin-bottom: 16px;
}

pre code {
    background: none;
    color: inherit;
    padding: 0;
}

/* 引用 */
blockquote {
    border-left: 4px solid #667eea;
    padding-left: 16px;
    margin: 16px 0;
    color: #666;
    font-style: italic;
}

/* テーブル */
table {
    border-collapse: collapse;
    width: 100%;
    margin-bottom: 16px;
}

table th,
table td {
    border: 1px solid #e0e0e0;
    padding: 12px;
    text-align: left;
}

table th {
    background: #f8f9fa;
    font-weight: 600;
}

/* 画像 */
img {
    max-width: 100%;
    height: auto;
    border-radius: 6px;
}

/* 水平線 */
hr {
    border: none;
    border-top: 2px solid #e0e0e0;
    margin: 24px 0;
}

/* 強調 */
strong {
    font-weight: 700;
    color: #1a1a1a;
}

em {
    font-style: italic;
}

/* レスポンシブ */
@media (max-width: 768px) {
    body {
        padding: 20px 15px;
    }

    h1 {
        font-size: 1.75em;
    }

    h2 {
        font-size: 1.5em;
    }

    table {
        font-size: 14px;
    }

    table th,
    table td {
        padding: 8px;
    }
}

/* 印刷用 */
@media print {
    body {
        max-width: 100%;
        padding: 0;
    }

    a {
        color: #000;
        text-decoration: underline;
    }

    pre {
        border: 1px solid #ccc;
        page-break-inside: avoid;
    }

    h1, h2, h3, h4, h5, h6 {
        page-break-after: avoid;
    }
}
`;

        // 完全なHTMLドキュメントを作成
        const fullHTML = `<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="generator" content="Markdown Converter App v1.3.0">
    <title>Markdown Document</title>
    <style>
${embeddedCSS}
    </style>
</head>
<body>
${htmlContent}
</body>
</html>`;

        // Blobを作成
        const blob = new Blob([fullHTML], { type: 'text/html;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');

        // ファイル名を生成（日時付き）
        const now = new Date();
        const dateString = now.toISOString().slice(0, 10);
        const timeString = now.toTimeString().slice(0, 5).replace(':', '-');
        const filename = `markdown-${dateString}-${timeString}.html`;

        a.href = url;
        a.download = filename;
        a.click();

        URL.revokeObjectURL(url);
        showNotification(`${filename} をHTMLとして保存しました`, 'success');
    } catch (error) {
        showNotification('HTMLエクスポートに失敗しました', 'error');
        console.error('HTMLエクスポートエラー:', error);
    }
}

// ===========================
// 3. ファイルのインポート/エクスポート
// ===========================

// 新規作成
function newDocument() {
    if (inputText.value.trim() !== '') {
        if (!confirm('現在の内容を破棄してもよろしいですか？')) {
            return;
        }
    }

    inputText.value = '';
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(LAST_SAVED_KEY);
    lastSavedText.textContent = '';
    convertMarkdown();
    updateStats();
    showNotification('新規ドキュメントを作成しました', 'success');
}

// ファイルを開く
function openFile() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.md,.markdown,.txt';

    input.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            inputText.value = event.target.result;
            convertMarkdown();
            updateStats();
            autoSave();
            showNotification(`${file.name} を読み込みました`, 'success');
        };
        reader.onerror = () => {
            showNotification('ファイルの読み込みに失敗しました', 'error');
        };
        reader.readAsText(file);
    };

    input.click();
}

// ファイルを保存
function saveFile() {
    try {
        const content = inputText.value;
        const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');

        // ファイル名を生成（日時付き）
        const now = new Date();
        const dateString = now.toISOString().slice(0, 10);
        const timeString = now.toTimeString().slice(0, 5).replace(':', '-');
        const filename = `document-${dateString}-${timeString}.md`;

        a.href = url;
        a.download = filename;
        a.click();

        URL.revokeObjectURL(url);
        showNotification(`${filename} を保存しました`, 'success');
    } catch (error) {
        showNotification('ファイルの保存に失敗しました', 'error');
        console.error('保存エラー:', error);
    }
}

// ===========================
// 3. ダークモード機能
// ===========================

const THEME_KEY = 'markdown-theme';

// テーマを切り替え
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem(THEME_KEY, newTheme);

    // アイコンを切り替え
    const sunIcon = themeToggle.querySelector('.sun-icon');
    const moonIcon = themeToggle.querySelector('.moon-icon');

    if (newTheme === 'dark') {
        sunIcon.style.display = 'none';
        moonIcon.style.display = 'block';
        showNotification('ダークモードに切り替えました', 'success');
    } else {
        sunIcon.style.display = 'block';
        moonIcon.style.display = 'none';
        showNotification('ライトモードに切り替えました', 'success');
    }
}

// テーマを初期化
function initTheme() {
    const savedTheme = localStorage.getItem(THEME_KEY) || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);

    const sunIcon = themeToggle.querySelector('.sun-icon');
    const moonIcon = themeToggle.querySelector('.moon-icon');

    if (savedTheme === 'dark') {
        sunIcon.style.display = 'none';
        moonIcon.style.display = 'block';
    } else {
        sunIcon.style.display = 'block';
        moonIcon.style.display = 'none';
    }
}

// ===========================
// 4. 文字数カウンター機能
// ===========================

function updateStats() {
    const text = inputText.value;

    // 文字数
    const chars = text.length;
    charCount.textContent = chars.toLocaleString();

    // 単語数（スペースまたは改行で区切る）
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    wordCount.textContent = words.toLocaleString();

    // 行数
    const lines = text.split('\n').length;
    lineCount.textContent = lines.toLocaleString();
}

// ===========================
// マークダウン変換機能（既存）
// ===========================

function convertMarkdown() {
    const markdownText = inputText.value;

    if (markdownText.trim() === '') {
        outputPreview.innerHTML = '<p class="placeholder">ここにマークダウンのプレビューが表示されます</p>';
        return;
    }

    try {
        const html = marked.parse(markdownText);
        outputPreview.innerHTML = html;
    } catch (error) {
        outputPreview.innerHTML = '<p class="error">変換エラーが発生しました</p>';
        console.error('マークダウン変換エラー:', error);
    }
}

// ===========================
// コピー機能（既存）
// ===========================

async function copyToClipboard() {
    const htmlContent = outputPreview.innerHTML;

    if (htmlContent.includes('placeholder') || htmlContent.includes('error')) {
        showNotification('コピーする内容がありません', 'error');
        return;
    }

    try {
        // HTMLとプレーンテキストの両方をクリップボードにコピー
        const textContent = outputPreview.innerText;

        await navigator.clipboard.write([
            new ClipboardItem({
                'text/html': new Blob([htmlContent], { type: 'text/html' }),
                'text/plain': new Blob([textContent], { type: 'text/plain' })
            })
        ]);

        showNotification('コピーしました！', 'success');
    } catch (err) {
        // フォールバック: テキストのみコピー
        try {
            await navigator.clipboard.writeText(htmlContent);
            showNotification('HTMLをコピーしました', 'success');
        } catch (error) {
            showNotification('コピーに失敗しました', 'error');
            console.error('コピーエラー:', error);
        }
    }
}

// ===========================
// 通知機能（既存）
// ===========================

function showNotification(message, type = 'success') {
    // 既存の通知を削除
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // 新しい通知を作成
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    // アニメーション用にちょっと待ってからクラスを追加
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);

    // 3秒後に非表示
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// ===========================
// イベントリスナーの設定
// ===========================

// 入力時のイベント
inputText.addEventListener('input', () => {
    convertMarkdown();
    updateStats();
    autoSave();
});

// ボタンのイベント
copyBtn.addEventListener('click', copyToClipboard);
themeToggle.addEventListener('click', toggleTheme);
newBtn.addEventListener('click', newDocument);
openBtn.addEventListener('click', openFile);
saveBtn.addEventListener('click', saveFile);

// HTMLエクスポートボタンの要素を取得
const exportHtmlBtn = document.getElementById('export-html-btn');
if (exportHtmlBtn) {
    exportHtmlBtn.addEventListener('click', exportAsHTML);
}

// キーボードショートカット
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + S で保存
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        saveFile();
    }
});

// ===========================
// Markdownツールバー機能
// ===========================

// テキストを選択範囲または カーソル位置に挿入する共通関数
function insertMarkdown(before, after = '', placeholder = '') {
    const start = inputText.selectionStart;
    const end = inputText.selectionEnd;
    const selectedText = inputText.value.substring(start, end);
    const textToInsert = selectedText || placeholder;

    // 新しいテキストを作成
    const newText = before + textToInsert + after;

    // テキストを挿入
    inputText.value = inputText.value.substring(0, start) + newText + inputText.value.substring(end);

    // カーソル位置を設定
    if (selectedText) {
        // テキストが選択されていた場合、挿入後のテキストを選択
        inputText.selectionStart = start;
        inputText.selectionEnd = start + newText.length;
    } else {
        // テキストが選択されていなかった場合、プレースホルダーを選択
        inputText.selectionStart = start + before.length;
        inputText.selectionEnd = start + before.length + textToInsert.length;
    }

    // フォーカスを戻す
    inputText.focus();

    // 変換を実行
    convertMarkdown();
    updateStats();
    autoSave();
}

// 行頭に記号を挿入する関数（見出し、リスト、引用用）
function insertLinePrefix(prefix) {
    const start = inputText.selectionStart;
    const end = inputText.selectionEnd;
    const value = inputText.value;

    // 現在の行の開始位置を見つける
    let lineStart = start;
    while (lineStart > 0 && value[lineStart - 1] !== '\n') {
        lineStart--;
    }

    // 現在の行の終了位置を見つける
    let lineEnd = end;
    while (lineEnd < value.length && value[lineEnd] !== '\n') {
        lineEnd++;
    }

    // 選択範囲が複数行にまたがるか確認
    const selectedLines = value.substring(lineStart, lineEnd).split('\n');

    // 各行にプレフィックスを追加
    const newLines = selectedLines.map(line => {
        // 既にプレフィックスがある場合は除去（トグル動作）
        if (line.startsWith(prefix)) {
            return line.substring(prefix.length);
        } else {
            return prefix + line;
        }
    });

    const newText = newLines.join('\n');

    // テキストを置換
    inputText.value = value.substring(0, lineStart) + newText + value.substring(lineEnd);

    // カーソル位置を設定
    inputText.selectionStart = lineStart;
    inputText.selectionEnd = lineStart + newText.length;
    inputText.focus();

    convertMarkdown();
    updateStats();
    autoSave();
}

// Markdownアクション定義
const markdownActions = {
    'bold': () => insertMarkdown('**', '**', '太字テキスト'),
    'italic': () => insertMarkdown('*', '*', 'イタリックテキスト'),
    'strikethrough': () => insertMarkdown('~~', '~~', '打ち消し線'),
    'heading1': () => insertLinePrefix('# '),
    'heading2': () => insertLinePrefix('## '),
    'heading3': () => insertLinePrefix('### '),
    'link': () => {
        const start = inputText.selectionStart;
        const end = inputText.selectionEnd;
        const selectedText = inputText.value.substring(start, end);
        const linkText = selectedText || 'リンクテキスト';
        insertMarkdown('[', '](https://example.com)', linkText === selectedText ? linkText : 'リンクテキスト');
    },
    'image': () => {
        insertMarkdown('![', '](https://example.com/image.jpg)', '画像の説明');
    },
    'code-block': () => {
        const start = inputText.selectionStart;
        const value = inputText.value;
        // 行頭に移動
        let lineStart = start;
        while (lineStart > 0 && value[lineStart - 1] !== '\n') {
            lineStart--;
        }
        inputText.selectionStart = lineStart;
        inputText.selectionEnd = lineStart;
        insertMarkdown('```\n', '\n```', 'コード');
    },
    'inline-code': () => insertMarkdown('`', '`', 'code'),
    'ul': () => insertLinePrefix('- '),
    'ol': () => {
        const start = inputText.selectionStart;
        const end = inputText.selectionEnd;
        const value = inputText.value;

        // 現在の行の開始位置を見つける
        let lineStart = start;
        while (lineStart > 0 && value[lineStart - 1] !== '\n') {
            lineStart--;
        }

        // 現在の行の終了位置を見つける
        let lineEnd = end;
        while (lineEnd < value.length && value[lineEnd] !== '\n') {
            lineEnd++;
        }

        const selectedLines = value.substring(lineStart, lineEnd).split('\n');
        const newLines = selectedLines.map((line, index) => {
            // 既に番号がある場合は除去（トグル動作）
            if (/^\d+\.\s/.test(line)) {
                return line.replace(/^\d+\.\s/, '');
            } else {
                return `${index + 1}. ${line}`;
            }
        });

        const newText = newLines.join('\n');
        inputText.value = value.substring(0, lineStart) + newText + value.substring(lineEnd);
        inputText.selectionStart = lineStart;
        inputText.selectionEnd = lineStart + newText.length;
        inputText.focus();

        convertMarkdown();
        updateStats();
        autoSave();
    },
    'quote': () => insertLinePrefix('> '),
    'hr': () => {
        const start = inputText.selectionStart;
        const value = inputText.value;
        // 現在の行の開始位置に移動
        let lineStart = start;
        while (lineStart > 0 && value[lineStart - 1] !== '\n') {
            lineStart--;
        }

        // 行頭に水平線を挿入
        const before = value.substring(0, lineStart);
        const after = value.substring(lineStart);
        const hrText = (before && !before.endsWith('\n') ? '\n' : '') + '---\n\n';

        inputText.value = before + hrText + after;
        inputText.selectionStart = lineStart + hrText.length;
        inputText.selectionEnd = lineStart + hrText.length;
        inputText.focus();

        convertMarkdown();
        updateStats();
        autoSave();
    },
    'table': () => {
        const tableTemplate = '\n| 列1 | 列2 | 列3 |\n| --- | --- | --- |\n| 行1 | データ | データ |\n| 行2 | データ | データ |\n\n';
        const start = inputText.selectionStart;
        const value = inputText.value;

        // 行頭に移動
        let lineStart = start;
        while (lineStart > 0 && value[lineStart - 1] !== '\n') {
            lineStart--;
        }

        inputText.value = value.substring(0, lineStart) + tableTemplate + value.substring(lineStart);
        inputText.selectionStart = lineStart + 1;
        inputText.selectionEnd = lineStart + tableTemplate.length - 2;
        inputText.focus();

        convertMarkdown();
        updateStats();
        autoSave();
    }
};

// ツールバーボタンにイベントリスナーを追加
document.querySelectorAll('.md-tool-btn').forEach(button => {
    button.addEventListener('click', (e) => {
        e.preventDefault();
        const action = button.getAttribute('data-action');
        if (markdownActions[action]) {
            markdownActions[action]();
        }
    });
});

// ===========================
// 初期化
// ===========================

// ページロード時の初期化
function init() {
    initTheme();
    restoreContent();
    convertMarkdown();
    updateStats();
}

// アプリ起動
init();

// ===========================
// UI/UX拡張機能
// ===========================

// モバイル用タブ切り替え
const tabEdit = document.getElementById('tab-edit');
const tabPreview = document.getElementById('tab-preview');
const inputSection = document.querySelector('.input-section');
const outputSection = document.querySelector('.output-section');

if (tabEdit && tabPreview) {
    tabEdit.addEventListener('click', () => {
        tabEdit.classList.add('active');
        tabPreview.classList.remove('active');
        inputSection.classList.remove('hidden');
        outputSection.classList.remove('active');

        // アクセシビリティ: ARIA属性を更新
        tabEdit.setAttribute('aria-selected', 'true');
        tabPreview.setAttribute('aria-selected', 'false');
    });

    tabPreview.addEventListener('click', () => {
        tabPreview.classList.add('active');
        tabEdit.classList.remove('active');
        inputSection.classList.add('hidden');
        outputSection.classList.add('active');

        // アクセシビリティ: ARIA属性を更新
        tabPreview.setAttribute('aria-selected', 'true');
        tabEdit.setAttribute('aria-selected', 'false');
    });
}

// ドラッグ&ドロップでファイル読み込み
inputText.addEventListener('dragover', (e) => {
    e.preventDefault();
    inputText.classList.add('drag-over');
});

inputText.addEventListener('dragleave', () => {
    inputText.classList.remove('drag-over');
});

inputText.addEventListener('drop', (e) => {
    e.preventDefault();
    inputText.classList.remove('drag-over');

    const file = e.dataTransfer.files[0];
    if (file && (file.type === 'text/markdown' || file.type === 'text/plain' || file.name.endsWith('.md'))) {
        const reader = new FileReader();
        reader.onload = (event) => {
            inputText.value = event.target.result;
            convertMarkdown();
            updateStats();
            autoSave();
            showNotification(`${file.name} を読み込みました`, 'success');
        };
        reader.readAsText(file);
    } else {
        showNotification('マークダウンファイル(.md)またはテキストファイルをドロップしてください', 'error');
    }
});

// キーボードナビゲーション強化
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + N で新規作成
    if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        newDocument();
    }

    // Ctrl/Cmd + O で開く
    if ((e.ctrlKey || e.metaKey) && e.key === 'o') {
        e.preventDefault();
        openFile();
    }

    // Ctrl/Cmd + D でダークモード切り替え
    if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        e.preventDefault();
        toggleTheme();
    }

    // Ctrl/Cmd + B で太字
    if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
        e.preventDefault();
        markdownActions['bold']();
    }

    // Ctrl/Cmd + I でイタリック
    if ((e.ctrlKey || e.metaKey) && e.key === 'i') {
        e.preventDefault();
        markdownActions['italic']();
    }

    // Ctrl/Cmd + K でリンク挿入
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        markdownActions['link']();
    }

    // Ctrl/Cmd + E でHTMLエクスポート
    if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
        e.preventDefault();
        exportAsHTML();
    }

    // Esc キーで通知を閉じる
    if (e.key === 'Escape') {
        const notification = document.querySelector('.notification');
        if (notification) {
            notification.remove();
        }
    }
});

// スムーズスクロール
const smoothScroll = () => {
    const inputScrollPercent = inputText.scrollTop / (inputText.scrollHeight - inputText.clientHeight);
    const targetScrollTop = inputScrollPercent * (outputPreview.scrollHeight - outputPreview.clientHeight);

    outputPreview.scrollTo({
        top: targetScrollTop,
        behavior: 'smooth'
    });
};

// スクロール同期（オプショナル - パフォーマンスのため制限）
let scrollTimeout;
inputText.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(smoothScroll, 100);
});

// 保存状態の視覚化
let saveIndicator;
function showSaveStatus(status) {
    // 既存のインジケーターを削除
    if (saveIndicator) {
        saveIndicator.remove();
    }

    // 新しいインジケーターを作成
    saveIndicator = document.createElement('span');
    saveIndicator.className = `save-status ${status}`;

    if (status === 'saving') {
        saveIndicator.innerHTML = '💾 保存中...';
    } else if (status === 'saved') {
        saveIndicator.innerHTML = '✓ 保存済み';
    } else if (status === 'error') {
        saveIndicator.innerHTML = '⚠ 保存失敗';
    }

    const lastSavedElement = document.getElementById('last-saved');
    if (lastSavedElement) {
        lastSavedElement.innerHTML = '';
        lastSavedElement.appendChild(saveIndicator);

        // 3秒後に最終保存時刻表示に戻す
        if (status === 'saved') {
            setTimeout(() => {
                const lastSaved = localStorage.getItem(LAST_SAVED_KEY);
                if (lastSaved) {
                    const date = new Date(lastSaved);
                    updateLastSavedText(date);
                }
            }, 3000);
        }
    }
}

// 自動保存機能を拡張（状態表示付き）
const originalAutoSave = autoSave;
autoSave = function() {
    showSaveStatus('saving');

    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(() => {
        try {
            localStorage.setItem(STORAGE_KEY, inputText.value);
            const now = new Date();
            localStorage.setItem(LAST_SAVED_KEY, now.toISOString());
            showSaveStatus('saved');
        } catch (error) {
            console.error('自動保存エラー:', error);
            showSaveStatus('error');
        }
    }, 1000);
};

// 空の状態チェック
function checkEmptyState() {
    if (inputText.value.trim() === '') {
        outputPreview.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📝</div>
                <div class="empty-state-title">マークダウンを入力してください</div>
                <div class="empty-state-description">
                    左側のエディタにマークダウン形式でテキストを入力すると、
                    ここにリアルタイムでプレビューが表示されます。
                </div>
            </div>
        `;
    }
}

// 初期表示で空の状態をチェック
checkEmptyState();

// ツールチップの追加（データ属性を使用）
const buttonsWithTooltips = [
    { id: 'new-btn', tooltip: '新規作成 (Ctrl+N)' },
    { id: 'open-btn', tooltip: 'ファイルを開く (Ctrl+O)' },
    { id: 'save-btn', tooltip: '保存 (Ctrl+S)' },
    { id: 'theme-toggle', tooltip: 'テーマ切り替え (Ctrl+D)' },
    { id: 'copy-btn', tooltip: 'HTMLをコピー' }
];

buttonsWithTooltips.forEach(btn => {
    const element = document.getElementById(btn.id);
    if (element) {
        element.setAttribute('data-tooltip', btn.tooltip);
        element.classList.add('tooltip');
    }
});

// パフォーマンス監視
const performanceObserver = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
        if (entry.duration > 100) {
            console.warn(`パフォーマンス警告: ${entry.name} took ${entry.duration}ms`);
        }
    }
});

try {
    performanceObserver.observe({ entryTypes: ['measure'] });
} catch (e) {
    // PerformanceObserver not supported
}

// エラーハンドリングの改善
window.addEventListener('error', (e) => {
    console.error('グローバルエラー:', e.error);
    showNotification('予期しないエラーが発生しました', 'error');
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('Promise rejection:', e.reason);
    showNotification('処理中にエラーが発生しました', 'error');
});

// ページ離脱時の確認（未保存の変更がある場合）
let hasUnsavedChanges = false;

inputText.addEventListener('input', () => {
    hasUnsavedChanges = true;
});

document.addEventListener('visibilitychange', () => {
    if (document.hidden && hasUnsavedChanges) {
        // バックグラウンドに移行する際に保存
        localStorage.setItem(STORAGE_KEY, inputText.value);
        localStorage.setItem(LAST_SAVED_KEY, new Date().toISOString());
    }
});

// サービスワーカーの登録準備（PWA対応の準備）
if ('serviceWorker' in navigator) {
    // 将来的にPWA対応する際のための準備
    console.log('Service Worker サポート: 利用可能');
}

// アクセシビリティ: フォーカストラップ
function trapFocus(element) {
    const focusableElements = element.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    element.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            if (e.shiftKey) {
                if (document.activeElement === firstFocusable) {
                    e.preventDefault();
                    lastFocusable.focus();
                }
            } else {
                if (document.activeElement === lastFocusable) {
                    e.preventDefault();
                    firstFocusable.focus();
                }
            }
        }
    });
}

console.log('✨ マークダウン変換アプリ v1.3.0 起動完了');
console.log('💡 ショートカット:');
console.log('  Ctrl/Cmd + N: 新規作成');
console.log('  Ctrl/Cmd + O: ファイルを開く');
console.log('  Ctrl/Cmd + S: 保存');
console.log('  Ctrl/Cmd + E: HTMLエクスポート');
console.log('  Ctrl/Cmd + D: ダークモード切り替え');
console.log('  Ctrl/Cmd + B: 太字');
console.log('  Ctrl/Cmd + I: イタリック');
console.log('  Ctrl/Cmd + K: リンク挿入');
console.log('  Esc: 通知を閉じる');
