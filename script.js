const input = document.getElementById("fake-input");
const btn = document.getElementById("fake-btn");
const msg = document.getElementById("fake-msg");

// Cuando intenta enviar
btn.addEventListener("click", () => {
    msg.innerHTML = "JAJAJA no te doxearía, mi rabanito de fresa 💚 <br> <button id='continuar' class='fake-btn continuar'>continuar</button>";
});

// Crear corazones flotando
function createHeart() {
    const heart = document.createElement("div");
    heart.classList.add("heart");
    heart.innerHTML = "❤";

    heart.style.left = Math.random() * 100 + "vw";
    heart.style.animationDuration = (3 + Math.random() * 3) + "s";

    document.getElementById("heart-container").appendChild(heart);

    setTimeout(() => heart.remove(), 6000);
}
// Frases que bajan
const phrases = [
    "Eres especial",
    "Gracias por lo que vivimos",
    "Siempre te voy a desear luz",
    "Este detallito es para ti"
];

let index = 0;

function showPhrase() {
    const container = document.getElementById("phrases-container");
    container.innerHTML = phrases[index];

    index = (index + 1) % phrases.length;
}

// Cuando aparece el botón continuar
document.addEventListener("click", (e) => {
    if (e.target && e.target.id === "continuar") {

        msg.innerHTML = "";
        document.querySelector("#fake-form h2").innerText = "mmmm...";
        document.querySelector("#fake-form p").innerText = "para verificar que eres tú coloca tu nombre plz ☝️🤓"
        input.value = "";
        input.placeholder = "Tu nombre...";
        btn.innerText = "Enviar nombre";

        step = 1;
    }
});

let step = 0;

// BLOQUEO SOLO EN EL PRIMER PASO
input.addEventListener("input", () => {
    if (step === 0) {
        input.value = "";
        input.classList.add("shake");
        setTimeout(() => input.classList.remove("shake"), 300);
    }
});

// Nombres válidos
const validNames = ["dane", "danelly", "daneely", "daneeli", "jk", "kuki", "dan", "jkuki", "kely", "norma", "garcia", "delgado"];

// Nombres bloqueados
const blockedNames = ["mar", "marisol", "mary", "mari"];

// Cuando presiona el botón principal
btn.addEventListener("click", () => {
    const inputValue = input.value.trim().toLowerCase();

    if (step === 1) {
        if (!inputValue) {
            msg.innerHTML = "Pon tu nombre, no seas tímida 💚";
            return;
        }

        if (blockedNames.includes(inputValue)) {
            msg.innerHTML = "Tu que sapa hjoeputa malparia perra eche pasha 🤺";
            return;
        }

        if (validNames.includes(inputValue)) {
            msg.innerHTML = "¡Sí eres tú, mi rabanito! 💚<br><button id='edad-btn' class='continuar fake-btn'>Continuar</button>";
            step = 2;
            return;
        }

        msg.innerHTML = "Mmm… no te reconozco, eche pasha 😳";
        return;
    }
});

// Botón para pasar a pedir edad
document.addEventListener("click", (e) => {
    if (e.target && e.target.id === "edad-btn") {
        msg.innerHTML = "";
        document.querySelector("#fake-form h2").innerText = "Ahora tu edad";
        document.querySelector("#fake-form p").innerText = "diviertete probando, hay ocho respuestas ☝️🤓";
        input.value = "";
        input.placeholder = "Tu edad…";
        btn.innerText = "Enviar edad";
        step = 3;
    }
});

// Validación de edad
btn.addEventListener("click", () => {
    if (step === 3) {
        const age = parseInt(input.value);

        if (isNaN(age)) {
            msg.innerHTML = "Eso no parece una edad 😳";
            return;
        }

        if (age < 18) {
            msg.innerHTML = "NOOOO, no quiero ir a la cárcel 😭 <br><button id='juego-btn' class='continuar fake-btn'>Continuar</button>";
            return;
        }

        if (age >= 18 && age < 21) {
            msg.innerHTML = "OMG soy mayor 😳 <br><button id='juego-btn' class='continuar fake-btn'>Continuar</button>";
            return;
        }

        if (age >= 21 && age < 30) {
            msg.innerHTML = "Siempre lo supe… muejejeje 😎 <br><button id='juego-btn' class='continuar fake-btn'>Continuar</button>";
            return;
        }

        if (age >= 30 && age < 50) {
            msg.innerHTML = "Ay hola, ¿me terminas de criar? 😳 <br><button id='juego-btn' class='continuar fake-btn'>Continuar</button>";
            return;
        }

        if (age >= 50 && age < 70) {
            msg.innerHTML = "Ay hola, ¿me adoptas? 🥺 <br><button id='juego-btn' class='continuar fake-btn'>Continuar</button>";
            return;
        }

        if (age >= 70 && age < 100) {
            msg.innerHTML = "mientras mas arrugada la pasa mas dulse es la fruta 🤤 <br><button id='juego-btn' class='continuar fake-btn'>Continuar</button>";
            return;
        }

        if (age >= 100) {
            msg.innerHTML = "OMG eres una vampiraaaa, tengo sangre para tiii 🧛‍♀️✨ <br><button id='juego-btn' class='continuar fake-btn'>Continuar</button>";
            return;
        }
    }
});

// PASAR A LA FASE DEL MENSAJE RETRO
document.addEventListener("click", (e) => {
    if (e.target && e.target.id === "juego-btn") {

        input.style.display = "none";
        btn.style.display = "none";
        document.querySelector(".botones").style.display = "none";

        document.querySelector("#fake-form h2").innerText = "";
        document.querySelector("#fake-form p").innerText = "";

        msg.innerHTML = `
      <div class="retro">
        Excelente… ahora da click en <b>Iniciar</b> para jugar.<br><br>
        Las reglas son fáciles:<br>
        - Dispara flechas a los corazones 💘<br>
        - Llena la barra con puntos<br>
        - Si aciertas 3 seguidos ganas bonus<br>
        - Llega a 100 puntos y tendrás tu recompensa 💚<br><br>
        <button id="start-game" class="fake-btn">Iniciar</button>
      </div>
    `;
    }
});

// CUENTA REGRESIVA Y LUEGO INICIA EL JUEGO
document.addEventListener("click", (e) => {
  if (e.target && e.target.id === "start-game") {

    msg.innerHTML = "";
    document.getElementById("fake-form").style.display = "none";

    const countdown = document.createElement("div");
    countdown.id = "countdown";
    countdown.style.fontFamily = "'Press Start 2P', monospace";
    countdown.style.fontSize = "40px";
    countdown.style.color = "#00ffea";
    countdown.style.textShadow = "0 0 10px #00ffee";
    countdown.style.position = "absolute";
    countdown.style.top = "40vh";
    countdown.style.left = "50%";
    countdown.style.transform = "translateX(-50%)";
    countdown.style.textAlign = "center";

    document.body.appendChild(countdown);

    let num = 5;
    countdown.innerText = num;

    const interval = setInterval(() => {
      num--;
      countdown.innerText = num;

      if (num === 0) {
        clearInterval(interval);
        countdown.remove();
        startPointGame();
      }
    }, 1000);
  }
});


// ---------------------------
//      SISTEMA DE PUNTOS
// ---------------------------

let score = 0;
let combo = 0;

function startPointGame() {

  // Mostrar barra de puntos
  const bar = document.createElement("div");
  bar.id = "score-bar-game";
  bar.style.position = "absolute";
  bar.style.top = "10px";
  bar.style.left = "50%";
  bar.style.transform = "translateX(-50%)";
  bar.style.width = "80vw";
  bar.style.height = "25px";
  bar.style.background = "rgba(255,255,255,0.2)";
  bar.style.borderRadius = "10px";
  bar.style.overflow = "hidden";
  bar.style.border = "2px solid white";

  const fill = document.createElement("div");
  fill.id = "score-fill-game";
  fill.style.height = "100%";
  fill.style.width = "0%";
  fill.style.background = "#ff4f8b";
  fill.style.transition = "0.2s";

  const text = document.createElement("div");
  text.id = "score-text";
  text.style.position = "absolute";
  text.style.top = "40px";
  text.style.left = "50%";
  text.style.transform = "translateX(-50%)";
  text.style.color = "white";
  text.style.fontFamily = "'Press Start 2P', monospace";
  text.style.fontSize = "18px";
  text.innerText = "0 / 100";

  bar.appendChild(fill);
  document.body.appendChild(bar);
  document.body.appendChild(text);

  // Iniciar corazones decorativos
  setInterval(createHeart, 300);

  // Iniciar varios corazones jugables
  for (let i = 0; i < 4; i++) {
    setTimeout(spawnClickableHeart, i * 400);
  }
}


// EFECTO DE +5 / +10 FLOTANTE
function showFloatingScore(points, x, y) {
  const float = document.createElement("div");
  float.classList.add("float-score");
  float.innerText = "+" + points;

  float.style.left = x + "vw";
  float.style.top = y + "vh";

  document.body.appendChild(float);

  setTimeout(() => float.remove(), 1000);
}


// CORAZONES JUGABLES
function spawnClickableHeart() {
  const heart = document.createElement("div");
  heart.classList.add("target-heart");
  heart.innerHTML = "💗";

  let x = Math.random() * 80;
  let y = Math.random() * 60;

  heart.style.left = x + "vw";
  heart.style.top = y + "vh";
  heart.style.position = "absolute";
  heart.style.fontSize = "40px";
  heart.style.cursor = "pointer";

  document.body.appendChild(heart);

  // Movimiento más rápido
  let dx = (Math.random() * 2 - 1) * 0.3;
  let dy = (Math.random() * 2 - 1) * 0.3;

  const moveInterval = setInterval(() => {
    x += dx;
    y += dy;

    heart.style.left = x + "vw";
    heart.style.top = y + "vh";

    // Si sale de pantalla → perder puntos
    if (x < -10 || x > 110 || y < -10 || y > 110) {
      clearInterval(moveInterval);
      heart.remove();
      combo = 0;
      score = Math.max(0, score - 2.5);
      updateScoreGame();
      spawnClickableHeart();
    }
  }, 20);

  // Click para sumar puntos
  heart.addEventListener("click", () => {
    clearInterval(moveInterval);
    heart.remove();

    combo++;
    let gained = 5;

    if (combo >= 3) {
      gained = 10;
      combo = 0;
    }

    score += gained;
    updateScoreGame();

    // Mostrar +5 o +10 justo donde clickeó
    showFloatingScore(gained, x, y);

    if (score >= 100) {
      winGame();
    } else {
      spawnClickableHeart();
    }
  });
}


// ACTUALIZAR BARRA
function updateScoreGame() {
  document.getElementById("score-fill-game").style.width = score + "%";
  document.getElementById("score-text").innerText = Math.floor(score) + " / 100";
}


function winGame() {
  // Pausar el juego completamente
  heartsActive = false;

  // Crear la carta final
  const carta = document.createElement("div");
  carta.classList.add("carta-final");

  carta.innerHTML = `
    <div class="carta-contenido">
      <img id="gato-final" src="./gato.jpg" alt="">
      <p id="texto-final">
        te quiero mucho, espero te haya gustado el detallito 💚<br>
        quisiera ser tu San Valentín preciosa
      </p>

      <div class="botones-final">
        <button id="btn-si" class="fake-btn">Sí 💚</button>
        <button id="btn-no" class="fake-btn">No 😢</button>
      </div>
    </div>
  `;

  document.body.appendChild(carta);
}


document.addEventListener("click", (e) => {

  // SI
  if (e.target && e.target.id === "btn-si") {
    const img = document.getElementById("gato-final");
    const texto = document.getElementById("texto-final");

    img.src = "./gato-feliz.jpg";
    texto.innerHTML = `
      Awwww sabía que dirías que sí 💚<br>
      eres lo más bonito que me ha pasado, mi rabanito precioso 💚
    `;
  }

  // NO
  if (e.target && e.target.id === "btn-no") {
    const img = document.getElementById("gato-final");
    const texto = document.getElementById("texto-final");

    img.src = "./gato-triste.jpg";
    texto.innerHTML = `
      porfa acepta… 💚<br>
      te quiero mucho preciosa, espero tu respuesta con ansias 😔💚
    `;
  }

});

