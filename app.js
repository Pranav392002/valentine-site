const $ = (id) => document.getElementById(id);

const pages = {
    p1: $("page-1"),
    p2: $("page-2"),
    p3: $("page-3"),
    p4: $("page-4"),
    done: $("page-done"),
};

function showPage(key) {
    Object.values(pages).forEach(el => el.classList.add("hidden"));
    pages[key].classList.remove("hidden");
}

/* --------------------------
   CONFIG: Questions + Images
--------------------------- */

// Page 2: 2 MCQ + 1 text
const P2 = {
    q1: { id: "p2_q1", mount: "p2q1", text: "date vibe", choices: ["Dinner + walk", "Movie + snacks", "Cafe + photos", "Home date", "Surprise 😈"] },
    q2: { id: "p2_q2", mount: "p2q2", text: "gift", choices: ["Flowers 🌷", "Chocolate 🍫", "Perfume 🧴", "Teddy 🧸", "All 😏"] },
    textId: "p2_q3_text"
};

// Page 3: 5 MCQ
const P3 = [
    { id: "p3_q1", mount: "p3q1", choices: ["When you grab me firmly by the waist / hips", "When you kiss my neck slowly from behind", "When you whisper dirty things in my ear", "When you look at me like you want to devour me right now"] },
    { id: "p3_q2", mount: "p3q2", choices: ["Long lazy morning sex followed by breakfast in bed", "Shower together… and stay there way longer than necessary", "Strip down and just touch/explore each other for hours without rushing", "Role-play something we've never tried before"] },
    { id: "p3_q3", mount: "p3q3", choices: ["Neck / collarbone", "Inner thighs", "Lower back / just above my ass", "Nipples / chest"] },
    { id: "p3_q4", mount: "p3q4", choices: ["Sweet & romantic (slow passionate love-making with lots of eye contact)", "A bit naughty (fingering / oral in a semi-public place)", "Pretty rough (hair-pulling, spanking, being pinned down)", "All modes 😈"] },
    { id: "p3_q5", mount: "p3q5", choices: ["Take your clothes off slowly while I watch", "Get on your knees and kiss my Pussy", "Hands behind your back, don't move until I say", "Lick my Feet"] },
];

// Page 4 images (YOU MUST put these files in /images/)
const IMAGES = [
    { src: "images/photo1.jpeg", caption: "Neeyum Naanum 💗" },
    { src: "images/photo2.jpeg", caption: "My favorite day" },
    { src: "images/photo3.jpeg", caption: "Cuties 😌" },
    { src: "images/photo4.jpeg", caption: "Epomey Neetha enaku" },
];

/* --------------------------
   State (answers)
--------------------------- */
const SHEET_WEBHOOK_URL = "https://script.google.com/macros/s/AKfycbwC0qw9JZ3JeZvoR4aJGmuQA3RjF0z2H84CT_X9kZaqT7mxzHyDkrBLSaTJcL795QiM5Q/exec";

function getSessionId() {
  const key = "valentineSessionId";
  let id = localStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID ? crypto.randomUUID() : String(Date.now()) + "-" + Math.random().toString(16).slice(2);
    localStorage.setItem(key, id);
  }
  return id;
}

// Fire-and-forget (Apps Script often doesn't send CORS headers)
function sendAnswersToGoogleSheet(payload) {
  try {
    fetch(SHEET_WEBHOOK_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch (e) {
    // ignore (we still keep localStorage)
  }
}
let answers = {}; // { [id]: value }

/* --------------------------
   Helpers: MCQ render
--------------------------- */
function renderChoices(mountId, qid, choices) {
    const mount = $(mountId);
    mount.innerHTML = "";

    choices.forEach((label) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "choiceBtn";
        btn.textContent = label;

        if (answers[qid] === label) btn.classList.add("selected");

        btn.addEventListener("click", () => {
            answers[qid] = label;
            [...mount.querySelectorAll(".choiceBtn")].forEach(b => b.classList.remove("selected"));
            btn.classList.add("selected");
        });

        mount.appendChild(btn);
    });
}

function isAnswered(qid) {
    return Boolean(answers[qid] && String(answers[qid]).trim().length);
}

/* --------------------------
   Page 1 logic
--------------------------- */
let noCount = 0;

$("p1Yes").addEventListener("click", () => {
    // reset for fresh run
    answers = {};
    noCount = 0;
    $("p1Hint").textContent = "";

    // render page 2 questions
    renderChoices(P2.q1.mount, P2.q1.id, P2.q1.choices);
    renderChoices(P2.q2.mount, P2.q2.id, P2.q2.choices);
    $("p2q3text").value = "";

    showPage("p2");
});

$("p1No").addEventListener("click", () => {
    noCount += 1;
    const messages = ["Wrong button 😌", "Try again 😏", "Come onnn 🥺", "No is disabled today 💗", "Okay now press YES 😂"];
    $("p1Hint").textContent = messages[Math.min(noCount - 1, messages.length - 1)];
});

/* --------------------------
   Page 2 nav + validation
--------------------------- */
$("p2Back").addEventListener("click", () => showPage("p1"));

$("p2Next").addEventListener("click", () => {
    const hint = $("p2Hint");
    hint.textContent = "";

    const typed = $("p2q3text").value.trim();
    answers[P2.textId] = typed;

    if (!isAnswered(P2.q1.id) || !isAnswered(P2.q2.id) || !isAnswered(P2.textId)) {
        hint.textContent = "Answer all 3 questions 👀";
        return;
    }

    // render page 3
    P3.forEach(q => renderChoices(q.mount, q.id, q.choices));
    showPage("p3");
});

/* --------------------------
   Page 3 nav + validation
--------------------------- */
$("p3Back").addEventListener("click", () => showPage("p2"));

$("p3Next").addEventListener("click", () => {
    const hint = $("p3Hint");
    hint.textContent = "";

    const allOk = P3.every(q => isAnswered(q.id));
    if (!allOk) {
        hint.textContent = "Answer all 5 questions 👀";
        return;
    }

    renderGallery();
    showPage("p4");
});

/* --------------------------
   Page 4: Gallery render
--------------------------- */
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

$("p4Back").addEventListener("click", () => showPage("p3"));

$("p4Done").addEventListener("click", () => {
  const payload = {
    sessionId: getSessionId(),
    answers,
    savedAt: new Date().toISOString(),
    userAgent: navigator.userAgent,
  };

  // Save locally (backup)
  localStorage.setItem("Valentine Answers", JSON.stringify(payload));

  // Send to your Google Sheet
  sendAnswersToGoogleSheet(payload);

  $("p4Hint").textContent = "Saved ✅";
  showPage("done");
});

$("restart").addEventListener("click", () => {
    answers = {};
    showPage("p1");
});
