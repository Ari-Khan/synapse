document.querySelector(".card .wrapper").style.display = "none";

const firebaseConfig = {
    apiKey: "AIzaSyDzgzWWinou5yEjLksEJBCOcIIin0lrWA8",
    authDomain: "solnet-f2191.firebaseapp.com",
    projectId: "solnet-f2191",
    storageBucket: "solnet-f2191.firebasestorage.app",
    messagingSenderId: "991886660477",
    appId: "1:991886660477:web:ad882dc4e9cee2086db214",
    measurementId: "G-324DCMV00T"
};

firebase.initializeApp(firebaseConfig);

function fillProfile(profile) {
    document.getElementById("card-title").textContent = profile?.displayName || "John Doe";
    document.getElementById("email").textContent = profile?.email || "john.doe@gmail.com";
    document.getElementById("job").textContent = profile?.job || "Computer Science";
    document.getElementById("country").textContent = profile?.country || "Canada";
    document.getElementById("bio").textContent = profile?.bio || "I love to ski!";
    document.getElementById("skills").textContent = profile?.skills || "HTML, CSS, JS, Python, Ruby, Go, React, AWS, Docker, Terraform";

    const avatar = document.getElementById("avatar");
    avatar.src = profile?.avatar || "assets/default-avatar.png";

    const skillsEl = document.getElementById("skills");
    let skills = profile?.skills || "HTML, CSS, JS, Python, Ruby, Go, React, AWS, Docker, Terraform";
    if (skills) {
        skillsEl.innerHTML = "";
        skills.split(",").forEach(skill => {
            const span = document.createElement("span");
            span.textContent = skill.trim();
            skillsEl.appendChild(span);
        });
    }

}

const params = new URLSearchParams(window.location.search);
const email = params.get("email");


if (!email) {
    console.error("Email missing in URL");
} else {
    fetch(`/api/profile?email=${encodeURIComponent(email)}`)
    .then(async (res) => {
        if (!res.ok) {
            throw new Error(`Request failed: ${res.status}`);
        }
        return res.json();
    })
    .then(profile => {
        console.log(profile);
        document.querySelector("#card-title").textContent = profile.firstName;
        fillProfile(profile);
        document.querySelector(".card .wrapper").style.display = "block";
    })
    .catch(err => {
        console.error(err);
        document.querySelector("#card-title").textContent = "Profile not found";
        document.querySelector(".card .wrapper").style.display = "none";
    });
}