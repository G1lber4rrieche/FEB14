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

let audioCtx, noiseNode, softNoiseNode;
let tvEncendida = false;

// 1. RUIDO BLANCO (Interferencia pesada de fondo)
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

// 2. RUIDITO BONITO (Fondo analógico suave generado por código para iPhone)
function startSoftNoise() {
    if (softNoiseNode) return;
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    softNoiseNode = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    softNoiseNode.type = 'triangle'; 
    softNoiseNode.frequency.setValueAtTime(150, audioCtx.currentTime); 
    gainNode.gain.setValueAtTime(0.06, audioCtx.currentTime);
    softNoiseNode.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    softNoiseNode.start();
}

function stopSoftNoise() {
    if(softNoiseNode) { try { softNoiseNode.stop(); } catch(e){} softNoiseNode = null; }
}

// TRUCO DE AUDIO PARA IPHONE (Activa los permisos táctiles integrados)
function desbloquearAudioIOS() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
}

// ACCIÓN APAGAR TV (Frena todo en seco al instante)
function apagarTelevisorCompleto() {
    tvEncendida = false;
    tvLed.className = 'tv-led';
    pantalla.className = 'crt-pantalla';
    pantalla.style.background = '#050505';
    tvStatic.style.display = 'none';
    vhsGlitch.style.display = 'none';
    tvSignalAnimation.style.display = 'none';
    tvSignalAnimation.className = "signal-on"; 
    screenText.innerHTML = 'TV APAGADA';
    screenText.style.color = '#a1a1aa';
    screenText.style.display = 'block';
    
    dropZone.style.opacity = '0.5';
    indicador.style.display = 'none';
    floppyDisk.classList.remove('tragado');
    floppyDisk.style.transform = 'translateY(0px)';

    stopWhiteNoise();
    stopSoftNoise();
}

// BOTÓN DE ENCENDIDO MANUAL
powerBtn.addEventListener('click', () => {
    desbloquearAudioIOS();
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
        apagarTelevisorCompleto();
    }
});

/* --- SECCIÓN DRAG & DROP MÓVIL / PC --- */
let isDragging = false;
let startY = 0;
let currentY = 0;

function onDragStart(yPosition) {
    if (!tvEncendida || floppyDisk.classList.contains('tragado')) return;
    desbloquearAudioIOS(); 
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

/* --- SECUENCIA DE CANALES SIMULADA POR CÓDIGO --- */
function ejecutarSecuenciaRetro() {
    floppyDisk.classList.add('tragado');
    indicador.style.display = 'none';

    // Paso 1: Canal 1 (Miku)
    setTimeout(() => {
        if (tvEncendida) {
            stopWhiteNoise(); 
            startSoftNoise(); 
            tvStatic.style.backgroundImage = "url('https://media.tenor.com/images/d739e02aa3e75af0e671dc17403d3ec5/tenor.gif')"; 
            tvStatic.style.display = 'block'; 
            screenText.innerHTML = '[ CANAL 1 ]';
            screenText.style.color = '#ffffff';
        }
    }, 800);

    // Paso 2: Sincronizando Video (Glitch)
    setTimeout(() => {
        if (tvEncendida) {
            stopSoftNoise();  
            startWhiteNoise(); 
            tvStatic.style.display = 'none';
            vhsGlitch.style.backgroundImage = "url('https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExbms1M216Ym0wY3JtcWoxZXN3bWptY3RwaXpxcmh0MHF6ZXN4N3lwayZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/Yqn9tE2E00k4U/giphy.gif')";
            vhsGlitch.style.display = 'block'; 
            screenText.innerHTML = '[ SINCRONIZANDO VIDEO... ]';
            screenText.style.color = '#ffff33';
        }
    }, 3500);

    // Paso 3: Sintonizado (Muestra tu foto local img.png y activa ruido analógico por código)
    setTimeout(() => {
        if (!tvEncendida) return;
        
        stopWhiteNoise(); 
        startSoftNoise(); // Sonará la estática limpia directo en el iPhone
        
        vhsGlitch.style.display = 'none';
        screenText.style.display = 'none';
        
        // Carga tu foto local
        const imgFinal = new Image();
        imgFinal.src = 'img.png';
        imgFinal.onload = function() {
            tvSignalAnimation.style.backgroundImage = "url('img.png')";
        };
        imgFinal.onerror = function() {
            tvSignalAnimation.style.backgroundImage = "url('https://media1.tenor.com/m/4TFhZEyUqyYAAAAC/anime-waifu.gif')";
        };
        
        tvSignalAnimation.style.backgroundSize = "cover";
        tvSignalAnimation.style.backgroundPosition = "center";
        tvSignalAnimation.style.width = "100%";
        tvSignalAnimation.style.height = "100%";
        tvSignalAnimation.style.display = 'block'; 
        
        // Rompe la imagen estática usando la clase del CSS
        tvSignalAnimation.className = "signal-on aberracion-vhs";
        
        tvLed.classList.remove('rojo');
        tvLed.classList.add('verde'); 

        // Deja la imagen rompiéndose por 10 segundos en pantalla y luego apaga la TV
        setTimeout(() => {
            if (tvEncendida) { 
                apagarTelevisorCompleto(); 
            }
        }, 10000); 

    }, 6500);
}
