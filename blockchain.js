/**
 * blockchain.js
 * To'liq JavaScript Blockchain simulyatsiyasi
 * Quyidagi imkoniyatlarni o'z ichiga oladi:
 *   - Block klassi (index, timestamp, data, hash, previousHash)
 *   - SHA-256 hash hisoblash
 *   - Genesis blok yaratish
 *   - Yangi blok qo'shish
 *   - Proof-of-Work (mining)
 *   - Zanjir validatsiyasi
 *   - Ma'lumot buzilishini aniqlash
 */

// =============================================
// 1. SHA-256 Hash hisoblash funksiyasi (Web Crypto API)
// =============================================
async function sha256(message) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// =============================================
// 2. BLOCK KLASSI
// =============================================
class Block {
    constructor(index, timestamp, data, previousHash = '') {
        this.index        = index;        // Blok raqami
        this.timestamp    = timestamp;    // Yaratilgan vaqt
        this.data         = data;         // Blokdagi ma'lumot
        this.previousHash = previousHash; // Oldingi blokning hashi
        this.nonce        = 0;            // Proof-of-Work uchun
        this.hash         = '';           // Bu blokning hashi (keyinchalik to'ldiriladi)
    }

    // Ushbu blok uchun hash hisoblash
    async calculateHash() {
        const content = this.index + this.timestamp + JSON.stringify(this.data) + this.previousHash + this.nonce;
        return await sha256(content);
    }

    // Proof-of-Work: Hash "difficulty" ta nol bilan boshlanguncha mining
    async mineBlock(difficulty) {
        const target = '0'.repeat(difficulty);
        this.hash = await this.calculateHash();

        while (!this.hash.startsWith(target)) {
            this.nonce++;
            this.hash = await this.calculateHash();
        }
        console.log(`⛏ Blok #${this.index} mined! Nonce: ${this.nonce} | Hash: ${this.hash}`);
    }
}

// =============================================
// 3. BLOCKCHAIN KLASSI
// =============================================
class Blockchain {
    constructor(difficulty = 2) {
        this.difficulty = difficulty;   // Mining qiyinligi
        this.chain = [];                // Barcha bloklar shu massivda saqlanadi
    }

    // Genesis blok yaratish
    async createGenesisBlock() {
        const genesis = new Block(0, new Date().toISOString(), 'Genesis Block', '0');
        await genesis.mineBlock(this.difficulty);
        this.chain.push(genesis);
        return genesis;
    }

    // Oxirgi blokni qaytarish
    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    // Yangi blok qo'shish
    async addBlock(data) {
        const previousBlock = this.getLatestBlock();
        const newBlock = new Block(
            this.chain.length,
            new Date().toISOString(),
            data,
            previousBlock.hash
        );
        await newBlock.mineBlock(this.difficulty);
        this.chain.push(newBlock);
        return newBlock;
    }

    // Zanjir validatsiyasi - har bir blokni tekshiradi
    async isChainValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const current  = this.chain[i];
            const previous = this.chain[i - 1];

            // 1. Blokning o'z hashi to'g'rimi?
            const recalculated = await current.calculateHash();
            if (current.hash !== recalculated) {
                console.error(`❌ Blok #${i} hashi buzilgan!`);
                return false;
            }

            // 2. Oldingi blok bilan bog'liqligini tekshirish
            if (current.previousHash !== previous.hash) {
                console.error(`❌ Blok #${i} oldingi blok hashi mos kelmaydi!`);
                return false;
            }
        }
        console.log('✅ Blockchain yaroqli (valid)!');
        return true;
    }

    // Konsolda barcha bloklarni chiroyli chiqarish
    printChain() {
        console.log('\n============================');
        console.log('  📦 BLOCKCHAIN HOLATI     ');
        console.log('============================\n');
        this.chain.forEach(block => {
            console.log(`Block #${block.index}`);
            console.log(`  Timestamp    : ${block.timestamp}`);
            console.log(`  Data         : ${JSON.stringify(block.data)}`);
            console.log(`  Nonce        : ${block.nonce}`);
            console.log(`  Previous Hash: ${block.previousHash}`);
            console.log(`  Hash         : ${block.hash}`);
            console.log('----------------------------');
        });
    }
}

// Export (Node.js va browser ikkisida ham ishlashi uchun)
if (typeof module !== 'undefined') {
    module.exports = { Block, Blockchain, sha256 };
}
