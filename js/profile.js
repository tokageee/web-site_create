console.log("profile.js loaded");

window.addEventListener("DOMContentLoaded", () => {
    const button = document.getElementById("searchBtn");

    console.log("button =", button);

    if (!button) {
        console.error("searchBtn が見つかりません");
        return;
    }

    button.addEventListener("click", async () => {
        const uid = document.getElementById("uid").value;

        if (!uid) {
            alert("UIDを入力してください");
            return;
        }

        try {
            const response = await fetch(`/api/profile?uid=${uid}`);
            const data = await response.json();

            console.log(data);
        } catch (err) {
            console.error(err);
        }
    });
});