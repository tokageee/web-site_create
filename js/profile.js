document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const resetBtn = document.getElementById('resetBtn');
    
    // 💡本家の図鑑（.card-gridの中）にあるカードだけを検索対象にする
    const cards = document.querySelectorAll('.card-grid .character, .card-grid .card-item');
    
    const resultDiv = document.getElementById('result');
    const allSecretAreas = document.querySelectorAll('.hidden-secret');

    const executeSearch = () => {
        const keyword = searchInput.value.trim();

        // 検索時に一旦すべての隠しエリアを閉じる
        allSecretAreas.forEach(area => area.classList.remove('show-secret'));

        let targetSecretId = null;

        // ▼ 合言葉の判定
        if (keyword === "ヘルタ人形") {
            targetSecretId = "secret-hertadoll";
        } else if (keyword === "野﨑誠" || keyword === "tokage") {
            targetSecretId = "secret-tokage";
        } else if (keyword === "岩崎晴哉" || keyword === "taso") {
            targetSecretId = "secret-taso";
        } else if (keyword === "野間奏羽" || keyword === "kurazu") {
            targetSecretId = "secret-kurazu";
        } else if (keyword === "ピッピ" || keyword === "pippi") {
            targetSecretId = "secret-pippi";
        } else if (keyword === "メロン" || keyword === "melon") {
            targetSecretId = "secret-melon";
        } else if (keyword === "近藤秀樹" || keyword === "Core.exe") {
            targetSecretId = "secret-kondo";
        } else if (keyword === "清田悠輝" || keyword === "スピキヨタ") {
            targetSecretId = "secret-kiyota";
        }

        // ▼ 隠しコマンド発動処理
        if (targetSecretId) {
            const targetElement = document.getElementById(targetSecretId);
            if (targetElement) {
                targetElement.classList.add('show-secret');
                // 本家のカードは非表示にする
                cards.forEach(card => card.style.display = 'none');
                resultDiv.innerHTML = "";
                
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                return; // ここで終了
            }
        }

        // ▼ 通常の検索処理
        let matchCount = 0;

        cards.forEach(card => {
            const text = card.textContent;
            if (text.includes(keyword)) {
                card.style.display = '';
                matchCount++;
            } else {
                card.style.display = 'none';
            }
        });

        // 検索結果の表示とスクロール
        if (keyword === "") {
            resultDiv.innerHTML = "";
            document.getElementById('キャラクター').scrollIntoView({ behavior: 'smooth', block: 'start' });
            
        } else if (matchCount > 0) {
            resultDiv.innerHTML = `<h3 style="text-align:center; color:white; background-color:pink; padding:10px; border-radius:5px;">「${keyword}」の検索結果: ${matchCount}件</h3>`;
            const firstHit = Array.from(cards).find(card => card.style.display !== 'none');
            if (firstHit) {
                firstHit.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            
        } else {
            resultDiv.innerHTML = `<h3 style="text-align:center; color:white; background-color:gray; padding:10px; border-radius:5px;">「${keyword}」は見つかりませんでした😢</h3>`;
        }
    };

    searchBtn.addEventListener('click', executeSearch);

    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            executeSearch();
        }
    });

    resetBtn.addEventListener('click', () => {
        searchInput.value = '';
        allSecretAreas.forEach(area => area.classList.remove('show-secret'));
        resultDiv.innerHTML = "";
        
        cards.forEach(card => {
            card.style.display = '';
        });
        
        document.getElementById('キャラクター').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});