const fs = require('fs');
const { StarRailModule, LanguageEnum } = require('@vermaysha/hoyolab-api');

async function updateStarRailData() {
  const ltoken = process.env.HOYO_LTOKEN;
  const ltuid = process.env.HOYO_LTUID;

  if (!ltoken || !ltuid) {
    console.error("Cookieが設定されていません。");
    return;
  }

  try {
    // 1. ライブラリを初期化
    const srr = new StarRailModule();
    
    // Cookieを設定（v2の形式に合わせてオブジェクトを渡します）
    srr.cookie.setCookie({
      ltoken_v2: ltoken,
      ltuid_v2: ltuid
    });
    
    // 言語を日本語に設定
    srr.setLanguage(LanguageEnum.JAPANESE);

    // 2. リアルタイム戦績（スタミナなど）を取得
    // ※注意：HoYoLABの設定で「戦績を公開」にしておく必要があります
    const record = await srr.getRecordCard();
    const fullData = await srr.getRealtimeNote();

    // データの抽出（お使いの環境やライブラリのバージョンによってプロパティ名が少し異なる場合があります）
    // 通常、以下のような形で開拓レベルや現在のスタミナが取得できます
    const trailblazeLevel = record.list?.[0]?.level || "取得失敗";
    const currentStamina = `${fullData.current_stamina}/${fullData.max_stamina}`;

    // 3. index.html を読み込んで書き換え
    let html = fs.readFileSync('index.html', 'utf8');

    // プレースホルダー（前回のマーク）を実際のデータに置き換える
    // ※ 確実に置換するために、HTML側の空タグ <span></span> の中身に目印を入れておくと安全です
    // 今回は簡易的に、置換対象を明示する形に書き換えています
    html = html.replace(/<span>開拓レベル:<\/span>\s*<span>.*?<\/span>/, `<span>開拓レベル:</span><span>${trailblazeLevel}</span>`);
    html = html.replace(/<span>現在のスタミナ:<\/span>\s*<span>.*?<\/span>/, `<span>現在のスタミナ:</span><span>${currentStamina}</span>`);

    fs.writeFileSync('index.html', html);
    console.log(`HTMLの更新に成功しました！ レベル: ${trailblazeLevel}, スタミナ: ${currentStamina}`);

  } catch (error) {
    console.error("データの取得または更新に失敗しました:", error);
    process.exit(1); // エラー時はGitHub Actions側にも失敗を通知
  }
}

updateStarRailData();