
const powerBtn = document.getElementById('powerBtn');
const tvLed = document.getElementById('tvLed');
const pantalla = document.getElementById('pantalla');
const tvStatic = document.getElementById('tvStatic');
const vhsGlitch = document.getElementById('vhsGlitch');
const screenText = document.getElementById('screenText');
const tvSignalAnimation = document.getElementById('tvSignalAnimation');
const floppyDisk = document.getElementById('floppyDisk');
const dropZone = document.getElementById('dropZone');
const indicador = document.getElementById('indicador');

let audioCtx, noiseNode, softNoiseNode, sintonizadoAudio;
let tvEncendida = false;

// 1. RUIDO BLANCO (Estática pesada/clásica)
function startWhiteNoise() {
    if (noiseNode) return;
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const bufferSize = 2 * audioCtx.sampleRate;
    const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) { output[i] = Math.random() * 2 - 1; }
    
    noiseNode = audioCtx.createBufferSource();
    noiseNode.buffer = noiseBuffer;
    noiseNode.loop = true;
    
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 850; 

    noiseNode.connect(filter);
    filter.connect(audioCtx.destination);
    noiseNode.start();
}

function stopWhiteNoise() {
    if(noiseNode) { try { noiseNode.stop(); } catch(e){} noiseNode = null; }
}

// 2. RUIDITO BONITO (Estática suave para Canal 1)
function startSoftNoise() {
    if (softNoiseNode) return;
    softNoiseNode = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    softNoiseNode.type = 'triangle'; 
    softNoiseNode.frequency.setValueAtTime(150, audioCtx.currentTime); 
    gainNode.gain.setValueAtTime(0.08, audioCtx.currentTime);
    
    softNoiseNode.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    softNoiseNode.start();
}

function stopSoftNoise() {
    if(softNoiseNode) { try { softNoiseNode.stop(); } catch(e){} softNoiseNode = null; }
}

function playSintonizadoAudio() {
    // Apuntamos al archivo .ogg con el ruido de lluvia real
    sintonizadoAudio = new Audio('grabacion.ogg');
    sintonizadoAudio.volume = 0.85; // Súbele un poquito si la lluvia tapa mucho tu voz
    sintonizadoAudio.loop = false;  // Se reproduce una sola vez
    
    // Le damos PLAY
    sintonizadoAudio.play().catch(e => console.log("Error al reproducir el audio .ogg:", e));
}

// BOTÓN POWER
powerBtn.addEventListener('click', () => {
    if (!tvEncendida) {
        tvEncendida = true;
        tvLed.classList.add('rojo');
        pantalla.classList.add('tv-on');
        screenText.innerHTML = '[ SIN SEÑAL ]';
        screenText.style.color = '#ff3333';
        pantalla.style.background = '#111115';
        
        dropZone.style.opacity = '1';
        indicador.style.display = 'block';
        startWhiteNoise(); 
    } else {
        tvEncendida = false;
        tvLed.className = 'tv-led';
        pantalla.className = 'crt-pantalla';
        pantalla.style.background = '#050505';
        tvStatic.style.display = 'none';
        vhsGlitch.style.display = 'none';
        tvSignalAnimation.style.display = 'none';
        screenText.innerHTML = 'TV APAGADA';
        screenText.style.color = '#a1a1aa';
        screenText.style.display = 'block';
        
        dropZone.style.opacity = '0.5';
        indicador.style.display = 'none';
        floppyDisk.classList.remove('tragado');
        floppyDisk.style.transform = 'translateY(0px)';

        // Quitar efectos de glitch al apagar
        pantalla.style.animation = "none";

        stopWhiteNoise();
        stopSoftNoise();
        if(sintonizadoAudio) { try { sintonizadoAudio.stop(); } catch(e){} }
    }
});

/* --- LÓGICA TOUCH MÓVIL Y DRAG MOUSE --- */
let isDragging = false;
let startY = 0;
let currentY = 0;

function onDragStart(yPosition) {
    if (!tvEncendida || floppyDisk.classList.contains('tragado')) return;
    isDragging = true;
    startY = yPosition;
}

function onDragMove(yPosition) {
    if (!isDragging) return;
    let deltaY = yPosition - startY;
    if (deltaY < 0 && deltaY > -90) {
        floppyDisk.style.transform = `translateY(${deltaY}px)`;
        currentY = deltaY;
    }
}

function onDragEnd() {
    if (!isDragging) return;
    isDragging = false;
    if (currentY < -42) {
        ejecutarSecuenciaRetro();
    } else {
        floppyDisk.style.transform = 'translateY(0px)';
    }
}

floppyDisk.addEventListener('mousedown', (e) => onDragStart(e.clientY));
window.addEventListener('mousemove', (e) => onDragMove(e.clientY));
window.addEventListener('mouseup', onDragEnd);

floppyDisk.addEventListener('touchstart', (e) => onDragStart(e.touches[0].clientY));
window.addEventListener('touchmove', (e) => onDragMove(e.touches[0].clientY));
window.addEventListener('touchend', onDragEnd);

/* --- LA SECUENCIA INTERACTIVA CORREGIDA --- */
function ejecutarSecuenciaRetro() {
    floppyDisk.classList.add('tragado');
    indicador.style.display = 'none';

    // PASO 1: CANAL 1 -> Entra Miku con ruidito bonito (A los 0.8s)
    setTimeout(() => {
        if (tvEncendida) {
            stopWhiteNoise(); 
            startSoftNoise(); 
            
            // Aquí pones tu link de Miku cuando lo tengas
            tvStatic.style.backgroundImage = "url('https://media.tenor.com/images/d739e02aa3e75af0e671dc17403d3ec5/tenor.gif')"; 
            tvStatic.style.display = 'block'; 
            
            screenText.innerHTML = '[ CANAL 1 ]';
            screenText.style.color = '#ffffff';
        }
    }, 800);

    // PASO 2: SINCRONIZANDO VIDEO -> Glitch puro de carga y vuelve ruido fuerte (A los 3.5s)
    setTimeout(() => {
        if (tvEncendida) {
            stopSoftNoise();  
            startWhiteNoise(); 

            tvStatic.style.display = 'none';
            
            // GIF de estática de carga horizontal para la sincronización
            vhsGlitch.style.backgroundImage = "url('https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExbms1M216Ym0wY3JtcWoxZXN3bWptY3RwaXpxcmh0MHF6ZXN4N3lwayZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/Yqn9tE2E00k4U/giphy.gif')";
            vhsGlitch.style.display = 'block'; 
            
            screenText.innerHTML = '[ SINCRONIZANDO VIDEO... ]';
            screenText.style.color = '#ffff33';
        }
    }, 3500);

    // PASO 3: SINTONIZADO + TU GIF CON FILTRO DE GLITCH INFINITO (A los 6.5s)
    setTimeout(() => {
        if (tvEncendida) {
            stopWhiteNoise(); // Silencio de estática de fondo
            vhsGlitch.style.display = 'none';
            screenText.style.display = 'none';
            
            // Ponemos el GIF de la Waifu final en el contenedor de sintonía
            tvSignalAnimation.style.backgroundImage = "url('https://media1.tenor.com/m/4TFhZEyUqyYAAAAC/anime-waifu.gif')";
            tvSignalAnimation.style.backgroundSize = "cover";
            tvSignalAnimation.style.backgroundPosition = "center";
            tvSignalAnimation.style.width = "100%";
            tvSignalAnimation.style.height = "100%";
            tvSignalAnimation.innerHTML = ""; // Quitamos el texto viejo de adentro
            tvSignalAnimation.style.display = 'block'; 
            
            // EFECTO DE IMAGEN ROTA / DISCO PEGADO POR CSS CODIFICADO
            // Hace que la pantalla completa vibre y tire glitches analógicos
            pantalla.style.animation = "floatar 0.15s infinite steps(2), parpadeo 4s infinite ease-in-out";
            
            tvLed.classList.remove('rojo');
            tvLed.classList.add('verde'); 

            playSintonizadoAudio(); // Aquí va a sonar tu .mp3 narrado
        }
    }, 6500);
}
