const $ = (id) => document.getElementById(id);

const pages = {
  p1: $("page-1"),
  p2: $("page-2"),
  p4: $("page-4"),
  done: $("page-done"),
};

function showPage(key) {
  Object.values(pages).forEach(el => el.classList.add("hidden"));
  pages[key].classList.remove("hidden");
}

// Your images (make sure these filenames match your /images folder)
const IMAGES = [
  { src: "images/photo1.jpeg", caption: "Us 💗" },
  { src: "images/photo2.jpeg", caption: "My favorite day" },
  { src: "images/photo3.jpeg", caption: "Cuties 😌" },
  { src: "images/photo4.jpeg", caption: "Always you" },
];

function renderGallery() {
  const g = $("gallery");
  g.innerHTML = "";

  IMAGES.forEach((img) => {
    const card = document.createElement("div");
    card.className = "photo";

    const image = document.createElement("img");
    image.src = img.src;
    image.alt = img.caption;

    const cap = document.createElement("div");
    cap.className = "caption";
    cap.textContent = img.caption;

    card.appendChild(image);
    card.appendChild(cap);
    g.appendChild(card);
  });
}

// PAGE 1 logic
let noCount = 0;

$("p1Yes").addEventListener("click", () => {
  noCount = 0;
  $("p1Hint").textContent = "";
  showPage("p2");
});

$("p1No").addEventListener("click", () => {
  noCount += 1;
  const messages = ["Wrong button 😌", "Try again 😏", "Come onnn 🥺", "No is disabled today 💗", "Okay now press YES 😂"];
  $("p1Hint").textContent = messages[Math.min(noCount - 1, messages.length - 1)];
});

// PAGE 2 nav
$("p2Back").addEventListener("click", () => showPage("p1"));

$("p2Next").addEventListener("click", () => {
  renderGallery();
  showPage("p4");
});

// PAGE 4 nav
$("p4Back").addEventListener("click", () => showPage("p2"));

$("p4Done").addEventListener("click", () => {
  // If you want, you can remove this localStorage line completely
  localStorage.setItem("valentineComplete", JSON.stringify({
    savedAt: new Date().toISOString(),
  }));

  $("p4Hint").textContent = "Saved ✅";
  showPage("done");
});

// DONE screen
$("restart").addEventListener("click", () => {
  $("p4Hint").textContent = "";
  showPage("p1");
});
