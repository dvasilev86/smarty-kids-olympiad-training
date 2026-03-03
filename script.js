const tasks = {
  easy: [
    "3 + 4 = ____",
    "5 + 2 = ____",
    "8 - 1 = ____",
    "6 + 3 = ____",
    "7 - 2 = ____",
    "9 + 0 = ____",
    "4 + 5 = ____",
    "10 - 3 = ____"
  ],
  medium: [
    "12 + 15 = ____",
    "25 - 9 = ____",
    "18 + 7 = ____",
    "30 - 14 = ____",
    "16 + 23 = ____",
    "40 - 19 = ____",
    "27 + 8 = ____",
    "50 - 25 = ____"
  ],
  hard: [
    "34 × 6 = ____",
    "144 ÷ 12 = ____",
    "56 × 8 = ____",
    "225 ÷ 15 = ____",
    "78 × 9 = ____",
    "320 ÷ 16 = ____",
    "99 × 7 = ____",
    "450 ÷ 25 = ____"
  ]
};

function generate() {
  const difficulty = document.getElementById("difficulty").value;
  localStorage.setItem("difficulty", difficulty);
  window.location.href = "worksheet.html";
}

window.onload = function() {
  const container = document.getElementById("task-container");
  if (!container) return;

  const difficulty = localStorage.getItem("difficulty") || "easy";
  const title = document.getElementById("worksheet-title");

  title.innerText = "Difficulty: " + difficulty.toUpperCase();

  tasks[difficulty].forEach(task => {
    const div = document.createElement("div");
    div.className = "task";
    div.innerText = task;
    container.appendChild(div);
  });
};
