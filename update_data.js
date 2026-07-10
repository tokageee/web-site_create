const fs = require('fs');
const { JSDOM } = require('jsdom');

async function updateStarRailData() {
  const ltoken = process.env.HOYO_LTOKEN;
  const ltuid = process.env.HOYO_LTUID;
  const hoyoUid = process.env.HOYO_UID;

  if (!ltoken || !ltuid || !hoyoUid) {
    console.error("必要な設定（LTOKEN, LTUID, HOYO_UID）が不足しています。");
    return;
  }

  try {
    // 公式APIからデータを取得
    const url = `https://bbs-api-os.hoyolab.com/game_record/card/wapi/getGameRecordCard?uid=${hoyoUid}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Cookie': `ltoken_v2=${ltoken}; ltuid_v2=${ltuid};`,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': 'https://www.hoyolab.com/',
        'X-Requested-With': 'com.mihoyo.hoyolab'
      }
    });

    const resData = await response.json();

    if (resData.retcode !== 0) {
      throw new Error(`APIエラー: ${resData.message} (コード: ${resData.retcode})`);
    }

    const hsrCard = resData.data.list.find(game => game.game_id === 6);
    
    if (!hsrCard) {
      throw new Error("スターレイルの戦績データが見つかりませんでした。");
    }

    const trailblazeLevel = hsrCard.level;
    const activeDays = hsrCard.data.find(d => d.name === "アクティブ日数" || d.name === "Active Days")?.value || "0";

    // index.html を安全に構造として読み込む
    const htmlContent = fs.readFileSync('index.html', 'utf8');
    const dom = new JSDOM(htmlContent);
    const document = dom.window.document;

    // IDをピンポイントで指定して安全に書き換え（前後のHTMLは1文字も壊れません）
    const levelElement = document.getElementById('hsr-level');
    const staminaElement = document.getElementById('hsr-stamina');

    if (levelElement) levelElement.textContent = `Lv.${trailblazeLevel}`;
    if (staminaElement) staminaElement.textContent = `${activeDays}日`;

    // 綺麗に書き換わったHTMLを上書き保存
    fs.writeFileSync('index.html', dom.serialize());
    console.log(`HTML構造を安全に更新しました！ レベル: ${trailblazeLevel}, アクティブ日数: ${activeDays}`);

  } catch (error) {
    console.error("データの取得または更新に失敗しました:", error);
    process.exit(1); 
  }
}

updateStarRailData();