const fs = require('fs');
const { HoyoAPIClient } = require('@vermaysha/hoyolab-api');

async function updateStarRailData() {
  const ltoken = process.env.HOYO_LTOKEN;
  const ltuid = process.env.HOYO_LTUID;

  if (!ltoken || !ltuid) {
    console.error("Cookieが設定されていません。");
    return;
  }

  try {
    const client = new HoyoAPIClient({
      cookie: {
        ltoken_v2: ltoken,
        ltuid_v2: ltuid
      },
      lang: 'ja-jp'
    });

    const record = await client.starrail.getRecordCard();
    const fullData = await client.starrail.getRealtimeNote();

    const trailblazeLevel = record.list?.[0]?.level || "取得失敗";
    const currentStamina = `${fullData.current_stamina}/${fullData.max_stamina}`;

    // index.html を読み込む
    let html = fs.readFileSync('index.html', 'utf8');

    // 【修正】IDを目印にして、その中身（Loading...などの部分）だけをピンポイントで書き換えます
    html = html.replace(/id="hsr-level">.*?<\/span>/, `id="hsr-level">${trailblazeLevel}</span>`);
    html = html.replace(/id="hsr-stamina">.*?<\/span>/, `id="hsr-stamina">${currentStamina}</span>`);

    // 上書き保存
    fs.writeFileSync('index.html', html);
    console.log(`HTMLの更新に成功しました！ レベル: ${trailblazeLevel}, スタミナ: ${currentStamina}`);

  } catch (error) {
    console.error("データの取得または更新に失敗しました:", error);
    process.exit(1); 
  }
}

updateStarRailData();