var tasks = {
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
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function digitCount(n) {
  return Math.abs(n).toString().length;
}

function toDigits(n, totalDigits) {
  return n.toString().padStart(totalDigits, '0').split('').map(Number);
}

function fromDigits(arr) {
  return parseInt(arr.join(''), 10);
}

function generate() {
  const difficulty = document.getElementById("difficulty").value;
  localStorage.setItem("difficulty", difficulty);
  window.location.href = "worksheet.html";
}

function generateTask(numOperands, numDigits) {
  const min = 10 ** (numDigits - 1);
  const max = 10 ** numDigits - 1;

  // 1️⃣ First operand (always positive)
  let operands = [randomInt(min, max)];
  let currentSum = operands[0];

  for (let i = 1; i < numOperands; i++) {
    let attempts = 0;

    while (attempts < 1000) {
      attempts++;

      const sign = Math.random() < 0.5 ? 1 : -1;

      const candidate = generateValidOperand(
        currentSum,
        sign,
        numDigits,
        min,
        max
      );

      if (candidate === null) continue;

      const newSum = currentSum + sign * candidate;

      if (newSum < 0) continue;
      if (digitCount(newSum) > numDigits) continue;

      operands.push(sign * candidate);
      currentSum = newSum;
      break;
    }
  }

  return formatExpression(operands);
}
function generateValidOperand(currentSum, sign, numDigits, min, max) {
  const sumDigits = toDigits(currentSum, numDigits);
  let newDigits = [];

  for (let i = 0; i < numDigits; i++) {
    const sDigit = sumDigits[i];

    let allowedDigits = [];

    if (sign === 1) {
      // ADDITION RULES

      for (let d = 0; d <= 9; d++) {
        if (sDigit + d > 9) continue; // no carry

        if (sDigit <= 4) {
          if (d <= (4 - sDigit) || d >= (5 - sDigit)) {
            allowedDigits.push(d);
          }
        } else {
          if (d === 9 - sDigit) {
            allowedDigits.push(d);
          }
        }
      }
    } else {
      // SUBTRACTION RULES

      for (let d = 0; d <= 9; d++) {
        if (sDigit - d < 0) continue; // no borrow

        if (sDigit <= 4) {
          if (d <= sDigit) allowedDigits.push(d);
        } else {
          if (d <= sDigit - 4) allowedDigits.push(d);
        }
      }
    }

    if (allowedDigits.length === 0) return null;

    const chosen = allowedDigits[randomInt(0, allowedDigits.length - 1)];
    newDigits.push(chosen);
  }

  const operand = fromDigits(newDigits);

  if (operand < min || operand > max) return null;

  return operand;
}

function formatExpression(operands) {
  let expression = operands[0].toString();

  for (let i = 1; i < operands.length; i++) {
    if (operands[i] >= 0) {
      expression += " + " + operands[i];
    } else {
      expression += " - " + Math.abs(operands[i]);
    }
  }

  return expression + " = ____";
}
window.onload = function() {
  const container = document.getElementById("task-container");
  if (!container) return;

  const difficulty = localStorage.getItem("difficulty") || "easy";
  const title = document.getElementById("worksheet-title");

  title.innerText = "Difficulty: " + difficulty.toUpperCase();

  for (var i= 0, i<15, i++) {
    const div = document.createElement("div");
    div.className = "task";
    div.innerText = generateTask(1, 1);
    container.appendChild(div);
  };
  for (var i= 0, i<15, i++) {
    const div = document.createElement("div");
    div.className = "task";
    div.innerText = generateTask(2, 2);
    container.appendChild(div);
  };
};
