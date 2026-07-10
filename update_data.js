const fs = require('fs');

async function updateStarRailData() {
  const ltoken = process.env.HOYO_LTOKEN;
  const ltuid = process.env.HOYO_LTUID;
  const hoyoUid = process.env.HOYO_UID; // 新しく追加したUID

  if (!ltoken || !ltuid || !hoyoUid) {
    console.error("必要な設定（LTOKEN, LTUID, HOYO_UID）が不足しています。");
    return;
  }

  try {
    // 1. 開拓レベルなどの基本情報を取得する公式URL
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

    // 2. 戻ってきたデータからスターレイル（ゲームID: 6）のデータを抽出
    const hsrCard = resData.data.list.find(game => game.game_id === 6);
    
    if (!hsrCard) {
      throw new Error("スターレイルの戦績データが見つかりませんでした。HoYoLAB側で戦績の公開設定がONになっているか確認してください。");
    }

    const trailblazeLevel = hsrCard.level; // 開拓レベル
    
    // ※スタミナなどの詳細なリアルタイム戦績は、公式APIの暗号化セキュリティ（DSヘッダー）が必要になるため、
    // まずは確実に取得できる「開拓レベル」と、同じカード内にある「アクティブ日数」を表示させます。
    const activeDays = hsrCard.data.find(d => d.name === "アクティブ日数" || d.name === "Active Days")?.value || "0";

    // 3. index.html を読み込んで書き換え
    let html = fs.readFileSync('index.html', 'utf8');

    // HTML側の記述に合わせて置換（スタミナの項目をアクティブ日数に流用・書き換えます）
    html = html.replace(/<span>開拓レベル:<\/span>\s*<span>.*?<\/span>/, `<span>開拓レベル:</span><span>Level ${trailblazeLevel}</span>`);
    html = html.replace(/<span>現在のスタミナ:<\/span>\s*<span>.*?<\/span>/, `<span>アクティブ日数:</span><span>${activeDays}日</span>`);

    fs.writeFileSync('index.html', html);
    console.log(`HTMLの更新に成功しました！ レベル: ${trailblazeLevel}, アクティブ日数: ${activeDays}`);

  } catch (error) {
    console.error("データの取得または更新に失敗しました:", error);
    process.exit(1); 
  }
}

updateStarRailData();