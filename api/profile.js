import { HonkaiStarRail } from "hoyoapi/hsr";

export default async function handler(req, res) {
  try {
    const uid = Number(req.query.uid);

    const cookie = [
      `ltuid=${process.env.HOYO_LTUID}`,
      `ltoken=${process.env.HOYO_LTOKEN}`
    ].join("; ");

    const hsr = new HonkaiStarRail({
      uid,
      cookie
    });

    const profile = await hsr.record.records();
    const characters = await hsr.record.characters();

    return res.status(200).json({
      profile,
      characters
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      error: err.message,
      stack: err.stack
    });
  }
}