const fs = require('fs');

async function updateStarRailData() {
  const ltoken = process.env.HOYO_LTOKEN;
  const ltuid = process.env.HOYO_LTUID;
  const hoyoUid = process.env.HOYO_UID;

  if (!ltoken || !ltuid || !hoyoUid) {
    console.error("必要な設定（LTOKEN, LTUID, HOYO_UID）が不足しています。");
    return;
  }

  try {
    // 公式APIから基本データを取得
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

    // スターレイル（game_id: 6）のデータを抽出
    const hsrCard = resData.data.list.find(game => game.game_id === 6);
    
    if (!hsrCard) {
      throw new Error("スターレイルの戦績データが見つかりませんでした。");
    }

    // データの抽出
    const trailblazeLevel = hsrCard.level; // 開拓レベル（例: 70）
    const activeDays = hsrCard.data.find(d => d.name === "アクティブ日数" || d.name === "Active Days")?.value || "0"; // アクティブ日数

    // index.html を読み込んで正確に置換
    let html = fs.readFileSync('index.html', 'utf8');

    // IDの中身をピンポイントで書き換え
    html = html.replace(/id="hsr-level">.*?<\/span>/, `id="hsr-level">Lv.${trailblazeLevel}</span>`);
    html = html.replace(/id="hsr-stamina">.*?<\/span>/, `id="hsr-stamina">${activeDays}日</span>`);

    // 上書き保存
    fs.writeFileSync('index.html', html);
    console.log(`HTMLの更新に成功しました！ レベル: ${trailblazeLevel}, アクティブ日数: ${activeDays}`);

  } catch (error) {
    console.error("データの取得または更新に失敗しました:", error);
    process.exit(1); 
  }
}

updateStarRailData();