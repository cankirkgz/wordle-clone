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

  // Her karakteri Türkçeye özel büyük harfe çevir
  guess = [...guess].map(turkishToUpper).join("");

  const targetArray = targetWord.split("");
  const guessArray = guess.split("");
  const tileRefs = [];

  // 1. TUR: YEŞİL kontrolü
  for (let i = 0; i < wordLength; i++) {
    const tile = document.getElementById(`${currentRow}-${i}`);
    const letter = guessArray[i];
    tileRefs.push(tile);

    if (letter === targetArray[i]) {
      tile.style.backgroundColor = "#538d4e";
      targetArray[i] = null;
      guessArray[i] = null;
    }
  }

  // 2. TUR: SARI ve GRİ kontrolü
  for (let i = 0; i < wordLength; i++) {
    const letter = guessArray[i];
    const tile = tileRefs[i];

    if (letter && targetArray.includes(letter)) {
      tile.style.backgroundColor = "#b59f3b"; 
      const index = targetArray.indexOf(letter);
      targetArray[index] = null;
    } else if (letter) {
      tile.style.backgroundColor = "#3a3a3c"; 
    }
  }

  // Kazanma kontrolü
  if (guess === targetWord) {
    setTimeout(() => {
      alert("🎉 Tebrikler! Bildin.");
    }, 100);
    isGameOver = true;
    return;
  }

  currentRow++;
  currentTile = 0;

  // Kaybetme kontrolü
  if (currentRow === maxRows) {
    setTimeout(() => {
      alert(`😢 Kaybettin! Doğru kelime: ${targetWord}`);
    }, 100);
    isGameOver = true;
  }
}
