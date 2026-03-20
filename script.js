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
  localStorage.setItem("difficulty", difficulty.value);
  window.location.href = "worksheet.html";
  
}

function generateNFTask(numOperands, numDigits) {
  const min = 10 ** (numDigits - 1);
  const max = 10 ** numDigits - 1;

  // 1️⃣ First operand (always positive)
  let operands = [randomInt(min, max)];
  let currentSum = operands[0];

  for (let i = 1; i < numOperands; i++) {
    let attempts = 0;

    while (attempts < 1000) {
      attempts++;

      const sign = Math.random() < 0.6 ? 1 : -1;

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

  let fullExpression = document.createElement("div");
  fullExpression.className = "problem";
  for (let i=0; i< operands.length; i++) {
    let operand = document.createElement("div");
    operand.innerText = operands[i];
    fullExpression.appendChild(operand);
  }
  let answerLine = document.createElement("div")
  answerLine.innerText = "____";
  fullExpression.appendChild(answerLine);
  return fullExpression;
}
function generate5FTask(numOperands, numDigits) {
  const min = 10 ** (numDigits - 1);
  const max = 10 ** numDigits - 1;

  // 1️⃣ First operand (always positive)
  let operands = [randomInt(min, max)];
  let currentSum = operands[0];

  for (let i = 1; i < numOperands; i++) {
    let attempts = 0;

    while (attempts < 1000) {
      attempts++;

      const sign = Math.random() < 0.65 ? 1 : -1;

      const candidate = generateValid5FOperand(
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

  let fullExpression = document.createElement("div");
  fullExpression.className = "problem";
  for (let i=0; i< operands.length; i++) {
    let operand = document.createElement("div");
    operand.innerText = operands[i];
    fullExpression.appendChild(operand);
  }
  let answerLine = document.createElement("div")
  answerLine.innerText = "____";
  fullExpression.appendChild(answerLine);
  return fullExpression;
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
function generateValid5FOperand(currentSum, sign, numDigits, min, max) {
  const sumDigits = String(currentSum)
    .padStart(numDigits, "0")
    .split("")
    .map(Number);

  const validPlusPairs = new Set([
    "1+4","2+3","2+4","3+2","3+3","3+4",
    "4+1","4+2","4+3","4+4"
  ]);

  const validMinusPairs = new Set([
    "5-1","5-2","5-3","5-4",
    "6-2","6-3","6-4",
    "7-3","7-4",
    "8-4"
  ]);

  function getOptions(sumDigit) {
    const options = [];

    for (let d = 0; d <= 9; d++) {
      if (sign === 1) {
        if (sumDigit + d >= 10) continue;
      } else {
        if (sumDigit < d) continue;
      }
      options.push(d);
    }

    return options;
  }

  function weightedPick(options, position, digitsSoFar) {
    // Assign weights (higher = more likely)
    const weights = options.map(d => {
      let w = 1;

      // 🔽 Penalize zeros slightly (reduces 10, 20, etc.)
      if (d === 0) w *= 0.4;

      // 🔽 Penalize repeated digits (like 11, 22)
      if (digitsSoFar.includes(d)) w *= 0.7;

      // 🔼 Slightly favor mid digits (more "natural")
      if (d >= 2 && d <= 7) w *= 1.2;

      return w;
    });

    // Normalize + pick
    const total = weights.reduce((a, b) => a + b, 0);
    let r = Math.random() * total;

    for (let i = 0; i < options.length; i++) {
      if (r < weights[i]) return options[i];
      r -= weights[i];
    }

    return options[0];
  }

  const digits = [];
  let hasValidPair = false;

  // 🔑 Force at least one valid pair at a random position
  const specialIndex = Math.floor(Math.random() * numDigits);

  for (let i = 0; i < numDigits; i++) {
    const sumDigit =
      sumDigits[sumDigits.length - numDigits + i] ?? 0;

    let options = getOptions(sumDigit);

    // enforce at least one valid pair
    if (i === specialIndex) {
      options = options.filter(d => {
        return sign === 1
          ? validPlusPairs.has(`${sumDigit}+${d}`)
          : validMinusPairs.has(`${sumDigit}-${d}`);
      });
    }

    // fallback (guarantee no dead-end)
    if (options.length === 0) {
      options = getOptions(sumDigit);
    }

    // prevent leading zero
    if (i === 0) {
      options = options.filter(d => d !== 0);
    }

    const chosen = weightedPick(options, i, digits);
    digits.push(chosen);

    // track valid pair
    if (sign === 1) {
      if (validPlusPairs.has(`${sumDigit}+${chosen}`)) {
        hasValidPair = true;
      }
    } else {
      if (validMinusPairs.has(`${sumDigit}-${chosen}`)) {
        hasValidPair = true;
      }
    }
  }

  let result = Number(digits.join(""));

  // 🔒 Enforce bounds + non-negative rule safely
  if (result < min) result = min;
  if (result > max) result = max;

  if (sign === 0 && currentSum - result < 0) {
    result = Math.min(result, currentSum);
  }

  return result;
}
function generate10FTask(numOperands, numDigits) {
  const min = 10 ** (numDigits - 1);
  const max = 10 ** numDigits - 1;

  // 1️⃣ First operand (always positive)
  let operands = [randomInt(min, max)];
  let currentSum = operands[0];
  for (let i = 1; i < numOperands; i++) {
    let attempts = 0;

    while (attempts < 1000) {
      attempts++;

      const sign = Math.random() < 0.65 ? 1 : -1;

      const candidate = generateValid10FOperand(
        currentSum,
        sign,
        numDigits,
        min,
        max
      );

      if (candidate === null) continue;

      const newSum = currentSum + sign * candidate;

      if (newSum < 0) continue;

      operands.push(sign * candidate);
      currentSum = newSum;
      break;
    }
  }

  let fullExpression = document.createElement("div");
  fullExpression.className = "problem";
  for (let i=0; i< operands.length; i++) {
    let operand = document.createElement("div");
    operand.innerText = operands[i];
    fullExpression.appendChild(operand);
  }
  let answerLine = document.createElement("div")
  answerLine.innerText = "____";
  fullExpression.appendChild(answerLine);
  return fullExpression;
}
function generateValid10FOperand(currentSum, sign, numDigits, min, max) {
  const minWithDigits = Math.pow(10, numDigits - 1);
  const maxWithDigits = Math.pow(10, numDigits) - 1;

  // Intersect all constraints
  let lower = Math.max(min, minWithDigits);
  let upper = Math.min(max, maxWithDigits);

  // Prevent negative result when subtracting
  if (sign === 0) {
    upper = Math.min(upper, currentSum);
  }

  // No valid numbers
  if (lower > upper) return null;

  // ✅ Uniform random integer in [lower, upper]
  return Math.floor(Math.random() * (upper - lower + 1)) + lower;
}
function addDifficultyBlock(numOperands, numDigits, numTasks, difficulty) {
  const container = document.getElementById("task-container");
  
  // create a grid for this difficulty
  const grid = document.createElement("div");
  grid.className = "task-grid";
  
  for (let i = 0; i < numTasks; i++) {
    const div = document.createElement("div");
    div.className = "task";
	if (difficulty === "NF") {
      div.appendChild(generateNFTask(numOperands, numDigits));
	}
	if (difficulty === "5F") {
	  div.appendChild(generate5FTask(numOperands, numDigits));
	}
	if (difficulty === "10F") {
	  div.appendChild(generate10FTask(numOperands, numDigits));		
	}
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

  const difficulty = localStorage.getItem("difficulty").valueOf() || "easy";
  const title = document.getElementById("worksheet-title");
  title.innerText = "Difficulty: " + difficulty.toUpperCase();
  
	addDifficultyBlock(3, 1, 15, difficulty)
    addDifficultyBlock(4, 1, 15, difficulty)
	addDifficultyBlock(5, 1, 15, difficulty)
	addDifficultyBlock(3, 2, 15, difficulty)
	addDifficultyBlock(3, 2, 20, difficulty)
	addDifficultyBlock(4, 2, 20, difficulty)
	addDifficultyBlock(5, 2, 20, difficulty)
  
};
