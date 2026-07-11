const express = require("express");
const axios = require("axios");

const app = express();

// GitHub Pagesからアクセスできるようにする
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    next();
});

// キャラクター一覧取得
app.get("/api/characters", async (req, res) => {
    try {
        const response = await axios.get(
            "https://starrail-api.vercel.app/api/v1/characters"
        );

        res.json(response.data);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "取得失敗"
        });
    }
});

app.listen(3000, () => {
    console.log("サーバー起動！");
});