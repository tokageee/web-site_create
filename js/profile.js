document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const resetBtn = document.getElementById('resetBtn');
    const cards = document.querySelectorAll('.character, .card-item');
    const secretArea = document.getElementById('secret-area');
    

    const resultDiv = document.getElementById('result');

    const executeSearch = () => {
        const keyword = searchInput.value.trim();
        
      
        if (keyword === "ヘルタ人形" || keyword === "hertadoll") {
            secretArea.classList.add('show-secret');
            cards.forEach(card => card.style.display = 'none');
            resultDiv.innerHTML = ""; 
            
 
            secretArea.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        } else {
            secretArea.classList.remove('show-secret');
        }

     
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
        secretArea.classList.remove('show-secret');
        resultDiv.innerHTML = ""; 
        
        cards.forEach(card => {
            card.style.display = ''; 
        });
        

        document.getElementById('キャラクター').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});