// DOM要素の取得
const inputText = document.getElementById('input-text');
const outputPreview = document.getElementById('output-preview');
const copyBtn = document.getElementById('copy-btn');

// marked.jsの設定
marked.setOptions({
    breaks: true,
    gfm: true,
    headerIds: true,
    mangle: false
});

// マークダウンをHTMLに変換してプレビュー表示
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

// コピー機能
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

// 通知メッセージを表示
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

// イベントリスナーの設定
inputText.addEventListener('input', convertMarkdown);
copyBtn.addEventListener('click', copyToClipboard);

// 初期表示
convertMarkdown();

// キーボードショートカット（Ctrl/Cmd + S でコピー）
document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        copyToClipboard();
    }
});
