document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const resetBtn = document.getElementById('resetBtn');
    const characters = document.querySelectorAll('.character');

    // 検索処理をまとめた関数
    const executeSearch = () => {
        // 入力された文字を取得（全角・半角スペースを取り除く）
        const keyword = searchInput.value.trim();

        characters.forEach(card => {
            // カード内の全テキスト（名前、声優、説明文など）を取得
            const textContent = card.innerText;
            
            // キーワードが含まれているか判定
            if (textContent.includes(keyword)) {
                card.style.display = 'block'; // 一致したら表示
            } else {
                card.style.display = 'none';  // 一致しなければ非表示
            }
        });
    };

    // ①「検索」ボタンをクリックした時に実行
    searchBtn.addEventListener('click', executeSearch);

    // ②入力欄で「Enterキー」を押した時にも実行
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            executeSearch();
        }
    });

    // ③「リセット」ボタンをクリックした時の処理（全表示に戻す）
    resetBtn.addEventListener('click', () => {
        searchInput.value = ''; // 入力欄を空にする
        characters.forEach(card => {
            card.style.display = 'block'; // 全キャラを再表示
        });
    });
});