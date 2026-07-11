fetch("http://localhost:3000/api/profile")
.then(res => res.json())
.then(data => {

    document.getElementById("uid").textContent = data.uid;
    document.getElementById("name").textContent = data.name;
    document.getElementById("level").textContent = data.level;

});