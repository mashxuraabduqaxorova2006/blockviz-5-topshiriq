# BlockViz ⛓ | JavaScript Blockchain Simulyatsiyasi

BlockViz — real SHA-256 hashing, Proof-of-Work mining va zanjir validatsiyasini o'z ichiga olgan to'liq JavaScript blockchain simulyatsiyasi.

## ✨ Imkoniyatlar

| # | Talab | Holati |
|---|-------|--------|
| 1 | Block klassi (index, timestamp, data, hash) | ✅ |
| 2 | SHA-256 hash hisoblash (Web Crypto API) | ✅ |
| 3 | Genesis blok | ✅ |
| 4 | Yangi blok qo'shish | ✅ |
| 5 | Har blok oldingi bilan bog'liq (previousHash) | ✅ |
| 6 | Blockchain massivi | ✅ |
| 7 | Zanjir validatsiyasi | ✅ |
| 8 | Ma'lumot o'zgarganda zanjir buzilishini aniqlash | ✅ |
| 9 | Proof-of-Work (mining, nonce) | ✅ |
| 10 | Konsolda bloklar ro'yxatini chiqarish | ✅ |

## 🛠 Texnologiyalar

- **JavaScript (Vanilla)** — asosiy mantiq
- **Web Crypto API** — SHA-256 hashing
- **HTML5 / CSS3** — Premium glassmorphism UI
- **JetBrains Mono & Space Grotesk** — shriftlar

## 📂 Fayl tuzilmasi

```
blockviz/
├── index.html      → Asosiy UI sahifasi
├── blockchain.js   → Block va Blockchain klasslari (yadro)
├── bc-app.js       → Frontend vizualizatsiya logikasi
├── bc-style.css    → Premium Dark Neon UI
└── README.md       → Hujjat
```

## 🚀 Ishlatish

1. `index.html` ni brauzerda oching
2. **"Blockchain'ni Ishga Tushirish"** tugmasini bosing — Genesis blok yaratiladi
3. Matn kiriting va **"Mine & Qo'sh"** — yangi blok mined bo'ladi
4. **"Zanjirni Tekshirish"** — validatsiyani ko'ring
5. **"Ma'lumotni Buzish (Test)"** — buzilgan zanjirni sinab ko'ring

## 🔬 Qanday ishlaydi

```js
class Block {
    constructor(index, timestamp, data, previousHash = '') { ... }
    async calculateHash() { /* SHA-256 */ }
    async mineBlock(difficulty) { /* Proof-of-Work: nonce++ */ }
}

class Blockchain {
    async createGenesisBlock() { ... }
    async addBlock(data) { ... }
    async isChainValid() { ... }
}
```

---
*4-topshiriq — Blockchain Simulyatsiyasi*
