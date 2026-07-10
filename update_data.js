const fs = require('fs');
// ライブラリを丸ごとインポートします
const HoyoAPI = require('@vermaysha/hoyolab-api');

async function updateStarRailData() {
  const ltoken = process.env.HOYO_LTOKEN;
  const ltuid = process.env.HOYO_LTUID;

  if (!ltoken || !ltuid) {
    console.error("Cookieが設定されていません。");
    return;
  }

  try {
    // 1. スターレイルモジュールを初期化
    // ライブラリの構造に応じて安全にインスタンスを作成します
    const StarRailClass = HoyoAPI.StarRail || HoyoAPI.StarRailModule;
    if (!StarRailClass) {
      throw new Error("ライブラリからStarRailモジュールが見つかりませんでした。");
    }
    
    const srr = new StarRailClass();
    
    // Cookieを設定
    srr.cookie.setCookie({
      ltoken_v2: ltoken,
      ltuid_v2: ltuid
    });
    
    // 言語を日本語に設定
    // LanguageEnumが取れない場合は文字列で 'ja-jp' を指定
    const lang = HoyoAPI.LanguageEnum?.JAPANESE || 'ja-jp';
    srr.setLanguage(lang);

    // 2. リアルタイム戦績と基本情報を取得
    const record = await srr.getRecordCard();
    const fullData = await srr.getRealtimeNote();

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