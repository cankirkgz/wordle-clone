let currentRow = 0;
let currentTile = 0;
const wordLength = 5;
const maxRows = 6;

const targetWord = "SEVGİ";
let isGameOver = false;

// Türkçeye özel büyük harf dönüşümü
function turkishToUpper(char) {
  const map = {
    "i": "İ",
    "ş": "Ş",
    "ğ": "Ğ",
    "ü": "Ü",
    "ö": "Ö",
    "ç": "Ç",
    "ı": "I"
  };
  return map[char] || char.toUpperCase();
}

document.addEventListener("keydown", (e) => {
  if (isGameOver) return;

  const key = e.key;

  if (/^[a-zA-ZğüşıöçĞÜŞİÖÇ]$/.test(key) && currentTile < wordLength) {
    const tile = document.getElementById(`${currentRow}-${currentTile}`);
    tile.textContent = turkishToUpper(key);
    currentTile++;
  }

  else if (key === "Backspace" && currentTile > 0) {
    currentTile--;
    const tile = document.getElementById(`${currentRow}-${currentTile}`);
    tile.textContent = "";
  }

  else if (key === "Enter" && currentTile === wordLength) {
    checkWord();
  }
});

function checkWord() {
  let guess = "";

  for (let i = 0; i < wordLength; i++) {
    const tile = document.getElementById(`${currentRow}-${i}`);
    guess += tile.textContent;
  }

  guess = [...guess].map(turkishToUpper).join("");

  const targetArray = targetWord.split("");
  const guessArray = guess.split("");
  const tileRefs = [];

  const colorPriority = {
    "#3a3a3c": 1,
    "#b59f3b": 2, 
    "#538d4e": 3 
  };

  function updateKeyboardKeyColor(letter, newColor) {
    const keyBtn = Array.from(document.querySelectorAll(".key")).find(
      btn => turkishToUpper(btn.textContent) === letter
    );

    if (!keyBtn) return;

    const currentColor = getComputedStyle(keyBtn).backgroundColor;

    const rgbToHex = {
      "rgb(58, 58, 60)": "#3a3a3c",
      "rgb(181, 159, 59)": "#b59f3b",
      "rgb(83, 141, 78)": "#538d4e"
    };

    const currentHex = rgbToHex[currentColor] || "#000000";
    const currentPriority = colorPriority[currentHex] || 0;
    const newPriority = colorPriority[newColor];

    if (newPriority > currentPriority) {
      keyBtn.style.backgroundColor = newColor;
      keyBtn.style.color = "white";
    }
  }

  // 1. TUR: YEŞİL
  for (let i = 0; i < wordLength; i++) {
    const tile = document.getElementById(`${currentRow}-${i}`);
    const letter = guessArray[i];
    tileRefs.push(tile);

    if (letter === targetArray[i]) {
      tile.style.backgroundColor = "#538d4e";
      updateKeyboardKeyColor(letter, "#538d4e");
      targetArray[i] = null;
      guessArray[i] = null;
    }
  }

  // 2. TUR: SARI ve GRİ
  for (let i = 0; i < wordLength; i++) {
    const letter = guessArray[i];
    const tile = tileRefs[i];

    if (letter && targetArray.includes(letter)) {
      tile.style.backgroundColor = "#b59f3b";
      updateKeyboardKeyColor(letter, "#b59f3b");
      const index = targetArray.indexOf(letter);
      targetArray[index] = null;
    } else if (letter) {
      tile.style.backgroundColor = "#3a3a3c";
      updateKeyboardKeyColor(letter, "#3a3a3c");
    }
  }

  if (guess === targetWord) {
    setTimeout(() => {
      alert("🎉 Tebrikler! Bildin.");
    }, 100);
    isGameOver = true;
    return;
  }

  currentRow++;
  currentTile = 0;

  if (currentRow === maxRows) {
    setTimeout(() => {
      alert(`😢 Kaybettin! Doğru kelime: ${targetWord}`);
    }, 100);
    isGameOver = true;
  }
}


document.querySelectorAll(".key").forEach((button) => {
  button.addEventListener("click", () => {
    const key = button.textContent;

    if (key === "ENTER") {
      const enterEvent = new KeyboardEvent("keydown", { key: "Enter" });
      document.dispatchEvent(enterEvent);
    } else if (button.classList.contains("backspace")) {
      const backspaceEvent = new KeyboardEvent("keydown", { key: "Backspace" });
      document.dispatchEvent(backspaceEvent);
    } else {
      const letterEvent = new KeyboardEvent("keydown", { key });
      document.dispatchEvent(letterEvent);
    }
  });
});
