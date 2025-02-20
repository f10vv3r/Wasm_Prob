const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");

const flag = "CERT{D0_Y0u_kn0vv_W@5m?}";
const app = express();
const port = 8000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 정적 파일 서빙 (public 폴더 및 wasm 모듈)
app.use(express.static(path.join(__dirname, "views")));
app.use("/wasmModule", express.static(path.join(__dirname, "wasmModule")));

// HTML 파일 제공 (sendFile 사용)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

app.get("/choice", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "choice.html"));
});

app.get("/knight", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "knight.html"));
});

app.get("/archer", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "archer.html"));
});

// Knight 관련 JavaScript 동적 제공
app.get("/script/knight.js", (req, res) => {
  res.type("application/javascript");
  res.send(`
    createGameModule().then(function(Module) {
      const knightAttack = Module.cwrap('knightAttack', 'number', ['number', 'number', 'number']);
      const dragonAttack = Module.cwrap('dragonAttack', 'number', ['number', 'number']);
      const dragonHeal   = Module.cwrap('dragonHeal', 'number', ['number']);

      function getMalloc() { return Module._malloc; }
      function getFree() { return Module._free; }

      function sleep(ms) {
        return new Promise((r) => setTimeout(r, ms));
      }

      let dragon_hp = 100, knight_hp = 80;

      function updateStatus() {
        document.getElementById("status").innerText =
          "Dragon HP: " + dragon_hp + ", Knight HP: " + knight_hp;
        if (dragon_hp <= 0) {
          alert("Congratulations! You defeated the dragon!\\nFlag: " + "${flag}");
          location.reload();
        } else if (knight_hp <= 0) {
          alert("You have been defeated by the dragon...");
          location.reload();
        }
      }
      updateStatus();

      async function attackWithKnight(attack_no) {
        const malloc = getMalloc();
        const free = getFree();

        const dragon_ptr = malloc(1);
        const knight_ptr = malloc(1);
        Module.HEAP8[dragon_ptr] = dragon_hp;
        Module.HEAP8[knight_ptr] = knight_hp;
        knightAttack(dragon_ptr, knight_ptr, attack_no);
        dragon_hp = Module.HEAP8[dragon_ptr];
        knight_hp = Module.HEAP8[knight_ptr];
        updateStatus();

        if (dragon_hp > 0 && knight_hp > 0) {
          await sleep(50);  
          dragonHeal(dragon_ptr);
          dragon_hp = Module.HEAP8[dragon_ptr];
          updateStatus();

          await sleep(50);  
          dragonAttack(dragon_ptr, knight_ptr);
          knight_hp = Module.HEAP8[knight_ptr];
          updateStatus();
        }

        free(dragon_ptr);
        free(knight_ptr);
      }

      document.getElementById("knightAttack1").addEventListener("click", () => attackWithKnight(1));
      document.getElementById("knightAttack2").addEventListener("click", () => attackWithKnight(2));
      document.getElementById("knightAttack3").addEventListener("click", () => attackWithKnight(3));
    });
  `);
});

// Archer 관련 JavaScript 동적 제공
app.get("/script/archer.js", (req, res) => {
  res.type("application/javascript");
  res.send(`
    createGameModule().then(function(Module) {
      const archerAttack = Module.cwrap('archerAttack', 'number', ['number', 'number', 'number']);
      const dragonAttack = Module.cwrap('dragonAttack', 'number', ['number', 'number']);
      const dragonHeal   = Module.cwrap('dragonHeal', 'number', ['number']);

      function getMalloc() { return Module._malloc; }
      function getFree() { return Module._free; }

      function sleep(ms) {
        return new Promise((r) => setTimeout(r, ms));
      }

      let dragon_hp = 100, archer_hp = 70;

      function updateStatus() {
        document.getElementById("status").innerText =
          "Dragon HP: " + dragon_hp + ", Archer HP: " + archer_hp;
        if (dragon_hp <= 0) {
          alert("Congratulations! You defeated the dragon! Flag: " + "${flag}");
          location.reload();
        } else if (archer_hp <= 0) {
          alert("You have been defeated by the dragon...");
          location.reload();
        }
      }
      updateStatus();

      async function attackWithArcher(attack_no) {
        const malloc = getMalloc();
        const free = getFree();

        const dragon_ptr = malloc(1);
        const archer_ptr = malloc(1);
        Module.HEAP8[dragon_ptr] = dragon_hp;
        Module.HEAP8[archer_ptr] = archer_hp;
        archerAttack(dragon_ptr, archer_ptr, attack_no);
        dragon_hp = Module.HEAP8[dragon_ptr];
        archer_hp = Module.HEAP8[archer_ptr];
        updateStatus();

        if (dragon_hp > 0 && archer_hp > 0) {
          await sleep(50);  
          dragonHeal(dragon_ptr);
          dragon_hp = Module.HEAP8[dragon_ptr];
          updateStatus();

          await sleep(50);  
          dragonAttack(dragon_ptr, archer_ptr);
          archer_hp = Module.HEAP8[archer_ptr];
          updateStatus();
        }

        free(dragon_ptr);
        free(archer_ptr);
      }

      document.getElementById("archerAttack1").addEventListener("click", () => attackWithArcher(1));
      document.getElementById("archerAttack2").addEventListener("click", () => attackWithArcher(2));
      document.getElementById("archerAttack3").addEventListener("click", () => attackWithArcher(3));
    });
  `);
});

// 에러 핸들링 (404, 500, 403)
app.use((req, res) => {
  res.status(404).send("<h1>404 Not Found</h1>");
});

app.use((err, req, res, next) => {
  console.error("500 Internal Server Error:", err);
  res.status(500).send("<h1>500 Internal Server Error</h1>");
});

app.listen(port, (err) => {
  if (err) return console.error(err);
  console.log(`Server running at http://localhost:${port}`);
});
