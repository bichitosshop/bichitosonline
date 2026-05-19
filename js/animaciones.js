const bgCanvas = document.getElementById('bgCanvas');
const ctx = bgCanvas.getContext('2d');
let animFrame = null;
let activePet = null;
let petX, petY, targetX, frame = 0;
const COLOR = '#FF7F2A';
const OPACITY = 0.15;
const SPEED = 0.8;

function resizeCanvas() {
    bgCanvas.width = window.innerWidth;
    bgCanvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function programarProximo() {
    const delay = 15000 + Math.random() * 15000;
    setTimeout(() => {
        const tipo = Math.random() > 0.5 ? 'perro' : 'gato';
        const desdeIzquierda = Math.random() > 0.5;
        petX = desdeIzquierda ? -120 : bgCanvas.width + 120;
        petY = 80 + Math.random() * (bgCanvas.height - 250);
        targetX = desdeIzquierda ? bgCanvas.width + 120 : -120;
        activePet = { tipo, desdeIzquierda };
        frame = 0;
        animar();
        programarProximo();
    }, delay);
}

function animar() {
    if (!activePet) return;
    ctx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);

    petX += activePet.desdeIzquierda ? SPEED : -SPEED;
    if ((activePet.desdeIzquierda && petX > targetX) ||
        (!activePet.desdeIzquierda && petX < targetX)) {
        activePet = null;
        ctx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
        return;
    }

    ctx.save();
    ctx.globalAlpha = OPACITY;
    ctx.fillStyle = COLOR;
    ctx.strokeStyle = COLOR;
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';

    const drawX = petX;
    const drawY = petY;

    if (activePet.tipo === 'perro') {
        dibujarPerro(drawX, drawY);
    } else {
        dibujarGato(drawX, drawY);
    }

    ctx.restore();
    frame++;
    animFrame = requestAnimationFrame(animar);
}

function dibujarPerro(x, y) {
    const b = Math.sin(frame * 0.08) * 3;
    // Cuerpo
    ctx.beginPath();
    ctx.ellipse(x, y + b, 28, 16, 0, 0, Math.PI * 2);
    ctx.fill();
    // Cabeza
    ctx.beginPath();
    ctx.arc(x + 33, y - 5 + b, 14, 0, Math.PI * 2);
    ctx.fill();
    // Hocico
    ctx.beginPath();
    ctx.ellipse(x + 44, y - 1 + b, 7, 5, 0, 0, Math.PI * 2);
    ctx.fill();
    // Oreja
    ctx.beginPath();
    ctx.ellipse(x + 28, y - 18 + b, 5, 9, -0.3, 0, Math.PI * 2);
    ctx.fill();
    // Patas traseras
    ctx.fillRect(x - 12, y + 10 + b, 4, 18);
    ctx.fillRect(x - 2, y + 10 + b, 4, 18);
    // Patas delanteras con movimiento
    const sw = Math.sin(frame * 0.12) * 4;
    ctx.fillRect(x + 12, y + 10 + b + sw, 4, 18);
    ctx.fillRect(x + 22, y + 10 + b - sw, 4, 18);
    // Cola
    const tw = Math.sin(frame * 0.18) * 12;
    ctx.beginPath();
    ctx.moveTo(x - 26, y - 4 + b);
    ctx.quadraticCurveTo(x - 36, y - 18 + b + tw, x - 28, y - 28 + b + tw);
    ctx.stroke();
    // Hueso
    ctx.fillRect(x + 46, y + 4 + b, 16, 3);
    ctx.beginPath();
    ctx.arc(x + 48, y + 5.5 + b, 3.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x + 60, y + 5.5 + b, 3.5, 0, Math.PI * 2);
    ctx.fill();
}

function dibujarGato(x, y) {
    const b = Math.sin(frame * 0.1) * 3;
    // Cuerpo
    ctx.beginPath();
    ctx.ellipse(x, y + b, 22, 13, 0, 0, Math.PI * 2);
    ctx.fill();
    // Cabeza
    ctx.beginPath();
    ctx.arc(x + 27, y - 6 + b, 12, 0, Math.PI * 2);
    ctx.fill();
    // Orejas puntiagudas
    ctx.beginPath();
    ctx.moveTo(x + 20, y - 16 + b);
    ctx.lineTo(x + 22, y - 30 + b);
    ctx.lineTo(x + 28, y - 18 + b);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(x + 31, y - 18 + b);
    ctx.lineTo(x + 36, y - 30 + b);
    ctx.lineTo(x + 38, y - 16 + b);
    ctx.fill();
    // Cola
    const tw = Math.sin(frame * 0.12) * 18;
    ctx.beginPath();
    ctx.moveTo(x + 22, y - 4 + b);
    ctx.quadraticCurveTo(x + 36, y - 12 + b + tw, x + 40, y - 28 + b);
    ctx.stroke();
    // Patas
    ctx.fillRect(x - 10, y + 8 + b, 3, 13);
    ctx.fillRect(x - 2, y + 8 + b, 3, 13);
    ctx.fillRect(x + 8, y + 8 + b, 3, 13);
    ctx.fillRect(x + 16, y + 8 + b, 3, 13);
    // Bola de lana
    const bx = x + 18 + Math.sin(frame * 0.04) * 12;
    const by = y + 22 + b;
    ctx.beginPath();
    ctx.arc(bx, by, 7, 0, Math.PI * 2);
    ctx.fill();
    // Hilo de la bola
    ctx.beginPath();
    ctx.moveTo(bx, by);
    ctx.quadraticCurveTo(bx + 13, by - 18, bx + 22, by - 13);
    ctx.stroke();
}

programarProximo();
