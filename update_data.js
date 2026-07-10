const fs = require('fs');
// クライアントクラスと言語設定を読み込みます
const { HoyoAPIClient, LanguageEnum } = require('@vermaysha/hoyolab-api');

async function updateStarRailData() {
  const ltoken = process.env.HOYO_LTOKEN;
  const ltuid = process.env.HOYO_LTUID;

  if (!ltoken || !ltuid) {
    console.error("Cookieが設定されていません。");
    return;
  }

  try {
    // 1. クライアントを初期化し、Cookieを設定
    const client = new HoyoAPIClient({
      cookie: {
        ltoken_v2: ltoken,
        ltuid_v2: ltuid
      },
      lang: LanguageEnum.JAPANESE
    });

    // 2. スターレイル（starrail）モジュールを使ってデータを取得
    // ※ ここを client.dsr から client.starrail に修正しました！
    const record = await client.starrail.getRecordCard();
    const fullData = await client.starrail.getRealtimeNote();

    // データの抽出
    const trailblazeLevel = record.list?.[0]?.level || "取得失敗";
    const currentStamina = `${fullData.current_stamina}/${fullData.max_stamina}`;

    // 3. index.html を読み込んで書き換え
    let html = fs.readFileSync('index.html', 'utf8');

    // プレースホルダーを実際のデータに置き換える
    html = html.replace(/<span>開拓レベル:<\/span>\s*<span>.*?<\/span>/, `<span>開拓レベル:</span><span>${trailblazeLevel}</span>`);
    html = html.replace(/<span>現在のスタミナ:<\/span>\s*<span>.*?<\/span>/, `<span>現在のスタミナ:</span><span>${currentStamina}</span>`);

    fs.writeFileSync('index.html', html);
    console.log(`HTMLの更新に成功しました！ レベル: ${trailblazeLevel}, スタミナ: ${currentStamina}`);

  } catch (error) {
    console.error("データの取得または更新に失敗しました:", error);
    process.exit(1); 
  }
}

updateStarRailData();