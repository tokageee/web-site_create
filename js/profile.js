document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const resetBtn = document.getElementById('resetBtn');
    const cards = document.querySelectorAll('.character, .card-item');
    
   
    const secretArea = document.getElementById('secret-area');

    const executeSearch = () => {
        const keyword = searchInput.value.trim();
        console.log("🔍 検索キーワード:", keyword);

        
        if (keyword === "ヘルタ人形" || keyword === "hertadoll") {
            secretArea.classList.add('show-secret'); 
            
           
            cards.forEach(card => card.style.display = 'none');
            
            return; 
        } else {
           
            secretArea.classList.remove('show-secret');
        }
        // ==========================================

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
        
        if (matchCount === 0 && keyword !== "") {
            alert("「" + keyword + "」は見つかりませんでした😢");
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
        secretArea.classList.remove('show-secret'); 
        cards.forEach(card => {
            card.style.display = ''; 
        });
    });
});