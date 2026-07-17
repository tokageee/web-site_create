document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const resetBtn = document.getElementById('resetBtn');
    const characters = document.querySelectorAll('.character');

    // ▼ エラーチェック（ここでどれが見つからないかアラートが出ます）
    if (!searchInput) return alert('HTMLに id="searchInput" が見つかりません！');
    if (!searchBtn) return alert('HTMLに id="searchBtn" が見つかりません！');
    if (!resetBtn) return alert('HTMLに id="resetBtn" が見つかりません！');

    const executeSearch = () => {
        const keyword = searchInput.value.trim();
        console.log("検索キーワード:", keyword); // F12のコンソールで確認用

        characters.forEach(card => {
            const textContent = card.textContent || card.innerText;
            if (textContent.includes(keyword)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    };

    searchBtn.addEventListener('click', executeSearch);

    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            executeSearch();
        }
    });

    resetBtn.addEventListener('click', () => {
        searchInput.value = '';
        characters.forEach(card => {
            card.style.display = 'block';
        });
    });
});