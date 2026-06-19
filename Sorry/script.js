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

// 2. RUIDITO BONITO (Fondo analógico suave que acompaña la sintonía)
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

// ACCIÓN APAGAR TV (Resetea todo el entorno visual y frena en seco el audio)
function apagarTelevisorCompleto() {
    tvEncendida = false;
    tvLed.className = 'tv-led';
    pantalla.className = 'crt-pantalla';
    pantalla.style.background = '#050505';
    tvStatic.style.display = 'none';
    vhsGlitch.style.display = 'none';
    tvSignalAnimation.style.display = 'none';
    tvSignalAnimation.classList.remove('aberracion-vhs');
    screenText.innerHTML = 'TV APAGADA';
    screenText.style.color = '#a1a1aa';
    screenText.style.display = 'block';
    
    dropZone.style.opacity = '0.5';
    indicador.style.display = 'none';
    floppyDisk.classList.remove('tragado');
    floppyDisk.style.transform = 'translateY(0px)';

    stopWhiteNoise();
    stopSoftNoise();
    
    // CORRECCIÓN DE AUDIO: Detener por completo el archivo .ogg y resetear su línea de tiempo
    if (sintonizadoAudio) { 
        try { 
            sintonizadoAudio.pause(); 
            sintonizadoAudio.currentTime = 0; 
        } catch(e) {
            console.log("Error al detener reproductor de audio:", e);
        } 
        sintonizadoAudio = null; 
    }
}

// BOTÓN DE ENCENDIDO MANUAL
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
        apagarTelevisorCompleto();
    }
});

/* --- SECCIÓN DRAG & DROP MÓVIL / PC --- */
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

/* --- SECUENCIA DE CANALES --- */
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

    // Paso 3: Sintonizado (Imagen / Video Final)
    setTimeout(() => {
        if (!tvEncendida) return;
        
        stopWhiteNoise(); 
        startSoftNoise(); 
        
        vhsGlitch.style.display = 'none';
        screenText.style.display = 'none';
        
        // Verificación e inyección de imagen
        const imgFinal = new Image();
        imgFinal.src = 'img.png';
        imgFinal.onload = function() {
            tvSignalAnimation.style.backgroundImage = "url('img.png')";
        };
        imgFinal.onerror = function() {
            // Fallback: Si no hay imagen local, se rompe con el GIF online
            tvSignalAnimation.style.backgroundImage = "url('https://media1.tenor.com/m/4TFhZEyUqyYAAAAC/anime-waifu.gif')";
        };
        
        tvSignalAnimation.style.backgroundSize = "cover";
        tvSignalAnimation.style.backgroundPosition = "center";
        tvSignalAnimation.style.width = "100%";
        tvSignalAnimation.style.height = "100%";
        tvSignalAnimation.style.display = 'block'; 
        
        // Activamos la clase de aberración y distorsión física
        tvSignalAnimation.className = "signal-on aberracion-vhs";
        
        tvLed.classList.remove('rojo');
        tvLed.classList.add('verde'); 

        // CARGA Y REPRODUCCIÓN DEL AUDIO
        sintonizadoAudio = new Audio('grabacion.ogg');
        
        // Al terminar de hablar de forma natural, la TV se apaga por completo
        sintonizadoAudio.onended = apagarTelevisorCompleto;

        sintonizadoAudio.play().catch(error => {
            console.log("Simulador Local: Reproduciendo estática de fondo por 5 segundos.");
            setTimeout(() => {
                // Si la TV sigue encendida y no se ha apagado a mano, corta el ciclo solo
                if(tvEncendida) { apagarTelevisorCompleto(); }
            }, 5000);
        });
    }, 6500);
}
