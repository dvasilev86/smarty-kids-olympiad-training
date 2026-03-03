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

  // Forbidden addition pairs
  const forbiddenAdd = new Set([
    "1+4","2+3","2+4","3+2","3+3","3+4",
    "4+1","4+2","4+3","4+4"
  ]);

  // Forbidden subtraction pairs
  const forbiddenSub = new Set([
    "5-1","5-2","5-3","5-4",
    "6-2","6-3","6-4",
    "7-3","7-4",
    "8-4"
  ]);

  for (let i = 0; i < numDigits; i++) {
    const sDigit = sumDigits[i];
    let allowedDigits = [];

    for (let d = 0; d <= 9; d++) {

      if (sign === 1) {
        // no carry
        if (sDigit + d > 9) continue;

        // reject forbidden addition pair
        if (forbiddenAdd.has(`${sDigit}+${d}`)) continue;

        allowedDigits.push(d);

      } else {
        // no borrow
        if (sDigit - d < 0) continue;

        // reject forbidden subtraction pair
        if (forbiddenSub.has(`${sDigit}-${d}`)) continue;

        allowedDigits.push(d);
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
      expression += "+" + operands[i];
    } else {
      expression += "-" + Math.abs(operands[i]);
    }
  }

  return expression + " = ___";
}
function addDifficultyBlock(numOperands, numDigits, numTasks) {
  const container = document.getElementById("task-container");
  
  // create a grid for this difficulty
  const grid = document.createElement("div");
  grid.className = "task-grid";
  
  for (let i = 0; i < numTasks; i++) {
    const div = document.createElement("div");
    div.className = "task";
    div.innerText = generateTask(numOperands, numDigits);
    grid.appendChild(div);
  }

  container.appendChild(grid);

  const separator = document.createElement("div");
  separator.className = "separator";
  container.appendChild(separator);
}

window.onload = function() {
  const container = document.getElementById("task-container");
  if (!container) return;

  const difficulty = localStorage.getItem("difficulty") || "easy";
  const title = document.getElementById("worksheet-title");

  title.innerText = "Difficulty: " + difficulty.toUpperCase();
  addDifficultyBlock(3, 1, 15)
  addDifficultyBlock(3, 2, 15)
};
