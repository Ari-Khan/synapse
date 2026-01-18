// sidebar
const currentPage = window.location.pathname.split("/").pop();
const sidebarLinks = document.querySelectorAll(".sidebar a");

sidebarLinks.forEach(link => {
  const hrefPage = link.getAttribute("href");
  if (hrefPage === currentPage) {
    link.querySelector(".side-btn").classList.add("active");
  }
});

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
const auth = firebase.auth();

auth.onAuthStateChanged(async user => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  // Static self card
  document.getElementById("welcomeText").textContent = `Welcome, ${user.displayName}`;
  document.getElementById("emailText").textContent = user.email;
  document.getElementById("avatar").referrerPolicy = "no-referrer";
  document.getElementById("avatar").src =
    user.photoURL || "assets/default-avatar.png";
  document.getElementById("nameText").textContent = user.displayName;

  try {
    const selfRes = await fetch(`/api/profile?email=${encodeURIComponent(user.email)}`);
    if (selfRes.ok) {
      const selfProfile = await selfRes.json();
      document.getElementById("jobText").textContent =
        selfProfile.job || "No job set";
    } else {
      document.getElementById("jobText").textContent = "Profile not found";
    }
  } catch {
    document.getElementById("jobText").textContent = "Profile not found";
  }

  // ---- LOAD CONTACTS ----
  const container = document.getElementById("cardsContainer");

  try {
    const res = await fetch(`/api/collection?email=${encodeURIComponent(user.email)}`);
    if (!res.ok) return;

    const contacts = await res.json();
    if (!contacts.length) return;

    for (const contact of contacts) {
      const profileRes = await fetch(
        `/api/profile?email=${encodeURIComponent(contact.email)}`
      );

      if (!profileRes.ok) continue;

      const p = await profileRes.json();

      const card = document.createElement("div");
      card.className = "card";

      card.innerHTML = `
        <img src="${p.avatar || "assets/default-avatar.png"}" />
        <div class="card-name clickable">
          ${p.firstName || ""} ${p.lastName || ""}
        </div>
        <div class="card-sub">${p.job || "No job set"}</div>
      `;

      card.onclick = () => {
        window.location.href = `card.html?email=${encodeURIComponent(p.email)}`;
      };

      container.appendChild(card);
    }
  } catch (err) {
    console.error("Failed loading contacts", err);
  }
});

document.getElementById("logoutBtn").onclick = async () => {
  await auth.signOut();
  window.location.href = "login.html";
};

firebase.auth().onAuthStateChanged(async (user) => {
  if (!user) {
      window.location.href = "index.html";
      return;
  }

  if (user) {
    document.getElementById("my-card").onclick = () => {
      window.location.href = `card.html?email=${encodeURIComponent(user.email)}`;
    };
  }
})
