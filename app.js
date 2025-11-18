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
// 2. ファイルのインポート/エクスポート
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

// キーボードショートカット
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + S で保存
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        saveFile();
    }
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
