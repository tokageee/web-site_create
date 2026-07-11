export default async function handler(req, res) {
  const { uid } = req.query;

  if (!uid) {
    return res.status(400).json({
      error: "UIDを入力してください",
    });
  }

  try {
    const response = await fetch(
      `https://api.mihomo.me/sr_info_parsed/${uid}?lang=jp`
    );

    const body = await response.text();

    console.log("Status:", response.status);
    console.log("Body:", body);

    res.status(response.status).send(body);

  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: err.message,
    });
  }
}