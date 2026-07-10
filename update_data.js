const fs = require('fs');

async function updateStarRailData() {
  // GitHubのSecretsからCookieを取得
  const ltoken = process.env.HOYO_LTOKEN;
  const ltuid = process.env.HOYO_LTUID;

  if (!ltoken || !ltuid) {
    console.error("Cookieが設定されていません。");
    return;
  }

  try {
    // 例として、HoYoLABのスターレイル戦績APIを叩く（実際のエンドポイントやヘッダー構成に合わせて調整してください）
    // ※ ここではダミーのデータ取得処理として記載しています
    // 実際にはクッキーをヘッダー（Cookie: ltoken_v2=...; ltuid_v2=...）に含めてリクエストします
    
    // 仮の取得データ
    const playerData = {
      level: 70, 
      stamina: "240/240"
    };

    // index.html を読み込む
    let html = fs.readFileSync('index.html', 'utf8');

    // プレースホルダーを実際のデータに置き換える
    html = html.replace('', playerData.level);
    html = html.replace('', playerData.stamina);

    // 上書き保存
    fs.writeFileSync('index.html', html);
    console.log("HTMLの更新に成功しました！");

  } catch (error) {
    console.error("データの取得または更新に失敗しました:", error);
  }
}

updateStarRailData();