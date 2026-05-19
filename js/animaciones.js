const SVG_DOG = `<svg viewBox="0 0 256 256" fill="#FF7F2A"><path d="M239.71,125l-16.42-88a16,16,0,0,0-19.61-12.58l-.31.09L150.85,40h-45.7L52.63,24.56l-.31-.09A16,16,0,0,0,32.71,37.05L16.29,125a15.77,15.77,0,0,0,9.12,17.52A16.26,16.26,0,0,0,32.12,144,15.48,15.48,0,0,0,40,141.84V184a40,40,0,0,0,40,40h96a40,40,0,0,0,40-40V141.85a15.5,15.5,0,0,0,7.87,2.16,16.31,16.31,0,0,0,6.72-1.47A15.77,15.77,0,0,0,239.71,125ZM176,208H136V195.31l13.66-13.65a8,8,0,0,0-11.32-11.32L128,180.69l-10.34-10.35a8,8,0,0,0-11.32,11.32L120,195.31V208H80a24,24,0,0,1-24-24V123.11L107.93,56h40.14L200,123.11V184A24,24,0,0,1,176,208Zm-72-68a12,12,0,1,1-12-12A12,12,0,0,1,104,140Zm72,0a12,12,0,1,1-12-12A12,12,0,0,1,176,140Z"/></svg>`;

const SVG_CAT = `<svg viewBox="0 0 400 380" fill="#FF7F2A"><path d="M 151.34904,307.20455 L 264.34904,307.20455 C 264.34904,291.14096 263.2021,287.95455 236.59904,287.95455 C 240.84904,275.20455 258.12424,244.35808 267.72404,244.35808 C 276.21707,244.35808 286.34904,244.82592 286.34904,264.20455 C 286.34904,286.20455 323.37171,321.67547 332.34904,307.20455 C 345.72769,285.63897 309.34904,292.21514 309.34904,240.20455 C 309.34904,169.05135 350.87417,179.18071 350.87417,139.20455 C 350.87417,119.20455 345.34904,116.50374 345.34904,102.20455 C 345.34904,83.30695 361.99717,84.403577 358.75805,68.734879 C 356.52061,57.911656 354.76962,49.23199 353.46516,36.143889 C 352.53959,26.857305 352.24452,16.959398 342.59855,17.357382 C 331.26505,17.824992 326.96549,37.77419 309.34904,39.204549 C 291.76851,40.631991 276.77834,24.238028 269.97404,26.579549 C 263.22709,28.901334 265.34904,47.204549 269.34904,60.204549 C 275.63588,80.636771 289.34904,107.20455 264.34904,111.20455 C 239.34904,115.20455 196.34904,119.20455 165.34904,160.20455 C 134.34904,201.20455 135.49342,249.3212 123.34904,264.20455 C 82.590696,314.15529 40.823919,293.64625 40.823919,335.20455 C 40.823919,353.81019 72.349045,367.20455 77.349045,361.20455 C 82.349045,355.20455 34.863764,337.32587 87.995492,316.20455 C 133.38711,298.16014 137.43914,294.47663 151.34904,307.20455 z"/></svg>`;

let petEl = null;
let petX, petY, targetX;
const SPEED = 0.6;

function programarProximo() {
    const delay = 18000 + Math.random() * 20000;
    setTimeout(() => {
        if (petEl) return;
        const tipo = Math.random() > 0.5 ? 'perro' : 'gato';
        const desdeIzquierda = Math.random() > 0.5;
        const size = 160 + Math.random() * 80;
        const bottomArea = window.innerHeight * 0.55;

        petX = desdeIzquierda ? -size : window.innerWidth + 20;
        petY = bottomArea + Math.random() * (window.innerHeight - bottomArea - size * 0.6);
        targetX = desdeIzquierda ? window.innerWidth + 20 : -size;

        const el = document.createElement('div');
        el.innerHTML = tipo === 'perro' ? SVG_DOG : SVG_CAT;
        el.style.cssText = `
            position: fixed; z-index: 0; pointer-events: none;
            opacity: 0; width: ${size}px; transition: opacity 1s ease;
            will-change: transform;
            transform: translate(${petX}px, ${petY}px);
        `;
        document.body.appendChild(el);
        petEl = el;

        requestAnimationFrame(() => { petEl.style.opacity = '0.12'; });
        animar();
        programarProximo();
    }, delay);
}

function animar() {
    if (!petEl) return;
    petX += petX < targetX ? SPEED : -SPEED;
    const dist = Math.abs(petX - targetX);
    if (dist < 5 || petX === targetX || (petX < targetX && petX > window.innerWidth + 20)) {
        petEl.style.opacity = '0';
        setTimeout(() => { if (petEl && petEl.parentNode) petEl.remove(); petEl = null; }, 1000);
        return;
    }
    const bounce = Math.sin(Date.now() * 0.0025) * 4;
    petEl.style.transform = `translate(${petX}px, ${petY + bounce}px)`;
    requestAnimationFrame(animar);
}

programarProximo();
