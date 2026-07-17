document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const resetBtn = document.getElementById('resetBtn');
    
    // ★変更点1：キャラクター(.character)と光円錐(.card-item)の【両方】を検索対象にする！
    const cards = document.querySelectorAll('.character, .card-item');

    const executeSearch = () => {
        const keyword = searchInput.value.trim();
        console.log("🔍 検索キーワード:", keyword);
        
        let matchCount = 0; // ヒットした数を数える

        cards.forEach(card => {
            // textContentでカード内の文字を全て取得
            const text = card.textContent;
            
            // キーワードが含まれているか判定
            if (text.includes(keyword)) {
                // ★変更点2：'block'ではなく '' (空文字) にして、元のCSSデザインを壊さないようにする
                card.style.display = ''; 
                matchCount++;
            } else {
                card.style.display = 'none'; // 隠す
            }
        });
        
        console.log("✅ ヒットした数:", matchCount, "件");
        
        // もし1件も見つからなかったらアラートを出す（親切機能）
        if (matchCount === 0 && keyword !== "") {
            alert("「" + keyword + "」は見つかりませんでした😢");
        }
    };

    // 検索ボタンをクリックした時
    searchBtn.addEventListener('click', executeSearch);

    // Enterキーを押した時
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            executeSearch();
        }
    });

    // リセットボタンをクリックした時
    resetBtn.addEventListener('click', () => {
        searchInput.value = '';
        cards.forEach(card => {
            card.style.display = ''; // 全て再表示
        });
        console.log("🔄 リセットしました");
    });
});