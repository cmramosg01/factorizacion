// Configuración de ejercicios (nivel progresivo)
const exercises = [
  { a: 1, b: 5, c: 6, solution: [2, 3], equation: "x² + 5x + 6" },
  { a: 1, b: -7, c: 10, solution: [-2, -5], equation: "x² - 7x + 10" },
  { a: 1, b: 1, c: -12, solution: [-3, 4], equation: "x² + x - 12" },
  // Nivel 2: a ≠ 1 (próxima versión)
];

let currentExercise = exercises[0];
let draggedTile = null;
let placedNumbers = {};

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
  loadExercise(currentExercise);
  setupEventListeners();
});

function loadExercise(ex) {
  document.getElementById('equation').textContent = ex.equation;
  document.getElementById('ac-value').textContent = ex.a * ex.c;
  document.getElementById('b-value').textContent = ex.b;
  
  // Generar tiles con opciones (incluye distractores)
  generateTiles(ex);
  
  // Resetear zonas
  document.querySelectorAll('.drop-zone').forEach(zone => {
    zone.textContent = '';
    zone.classList.remove('filled', 'drag-over');
  });
  document.querySelectorAll('.aspa-box[id^="num"]').forEach(box => {
    box.textContent = '?';
    box.classList.remove('filled');
  });
  
  // Limpiar feedback
  const feedback = document.getElementById('feedback');
  feedback.className = 'feedback';
  feedback.textContent = '';
  
  // Resetear estado
  placedNumbers = {};
  document.getElementById('hintText').textContent = '';
}

function generateTiles(ex) {
  const container = document.getElementById('tiles');
  container.innerHTML = '';
  
  // Números correctos + distractores
  const options = [...new Set([
    ...ex.solution, 
    ex.c, ex.b, 
    ...(ex.solution.map(n => n * -1)),
    0, 1
  ].filter(n => Number.isInteger(n)))];
  
  // Mezclar y crear tiles
  options.sort(() => Math.random() - 0.5).slice(0, 6).forEach(num => {
    const tile = document.createElement('div');
    tile.className = 'tile';
    tile.textContent = num;
    tile.dataset.value = num;
    
    // Eventos drag (ratón + táctil)
    tile.addEventListener('dragstart', handleDragStart);
    tile.addEventListener('touchstart', handleTouchStart, { passive: false });
    
    container.appendChild(tile);
  });
}

// === DRAG & DROP: Ratón ===
function handleDragStart(e) {
  draggedTile = e.target;
  e.dataTransfer.setData('text/plain', e.target.dataset.value);
  setTimeout(() => e.target.classList.add('used'), 0);
}

// === DRAG & DROP: Táctil ===
function handleTouchStart(e) {
  e.preventDefault();
  draggedTile = e.target;
  const touch = e.touches[0];
  
  // Crear clone visual para arrastrar
  const ghost = draggedTile.cloneNode(true);
  ghost.style.position = 'fixed';
  ghost.style.left = `${touch.clientX - 25}px`;
  ghost.style.top = `${touch.clientY - 20}px`;
  ghost.style.zIndex = '1000';
  ghost.style.opacity = '0.9';
  document.body.appendChild(ghost);
  
  // Mover ghost con el dedo
  const moveGhost = (e) => {
    const t = e.touches[0];
    ghost.style.left = `${t.clientX - 25}px`;
    ghost.style.top = `${t.clientY - 20}px`;
  };
  
  // Soltar
  const endDrag = (e) => {
    document.removeEventListener('touchmove', moveGhost);
    document.removeEventListener('touchend', endDrag);
    ghost.remove();
    
    // Detectar drop zone bajo el dedo
    const touch = e.changedTouches[0];
    const elem = document.elementFromPoint(touch.clientX, touch.clientY);
    const dropZone = elem?.closest('.drop-zone');
    
    if (dropZone && !dropZone.textContent.trim()) {
      handleDrop({ target: dropZone });
    }
    
    draggedTile = null;
  };
  
  document.addEventListener('touchmove', moveGhost, { passive: false });
  document.addEventListener('touchend', endDrag);
}

// === ZONAS DE DROP ===
document.querySelectorAll('.drop-zone').forEach(zone => {
  // Ratón
  zone.addEventListener('dragover', (e) => {
    e.preventDefault();
    zone.classList.add('drag-over');
  });
  zone.addEventListener('dragleave', () => zone.classList.remove('drag-over'));
  zone.addEventListener('drop', handleDrop);
  
  // Táctil: ya gestionado en handleTouchStart
});

function handleDrop(e) {
  e.preventDefault();
  const zone = e.target.closest('.drop-zone');
  if (!zone || !draggedTile) return;
  
  zone.classList.remove('drag-over');
  const value = draggedTile.dataset.value;
  
  // Colocar en zona
  zone.textContent = value;
  zone.classList.add('filled');
  placedNumbers[zone.dataset.slot] = parseInt(value);
  
  // Actualizar aspa visual
  updateAspaPreview();
  
  // Marcar tile como usado
  draggedTile.classList.add('used');
  draggedTile = null;
}

function updateAspaPreview() {
  const slots = document.querySelectorAll('.drop-zone');
  const values = Array.from(slots).map(s => parseInt(s.textContent) || null);
  
  if (values[0] && values[1]) {
    const [n1, n2] = values;
    document.getElementById('num1-placeholder').textContent = n1;
    document.getElementById('num2-placeholder').textContent = n2;
    
    // Verificar suma y producto visualmente
    const sum = n1 + n2;
    const prod = n1 * n2;
    const ac = currentExercise.a * currentExercise.c;
    const b = currentExercise.b;
    
    if (sum === b && prod === ac) {
      document.querySelectorAll('.aspa-box').forEach(b => b.classList.add('filled'));
    }
  }
}

// === VERIFICAR SOLUCIÓN ===
document.getElementById('checkBtn').addEventListener('click', () => {
  const slots = document.querySelectorAll('.drop-zone');
  const values = Array.from(slots).map(s => parseInt(s.textContent)).filter(v => !isNaN(v));
  
  if (values.length < 2) {
    showFeedback('Coloca los dos números primero 👇', 'error');
    return;
  }
  
  const [n1, n2] = values;
  const correct = currentExercise.solution;
  
  // Verificar (orden no importa)
  const isCorrect = 
    (n1 === correct[0] && n2 === correct[1]) || 
    (n1 === correct[1] && n2 === correct[0]);
  
  if (isCorrect) {
    showFeedback('🎉 ¡Excelente! (x' + (n1>=0?'+':'') + n1 + ')(x' + (n2>=0?'+':'') + n2 + ')', 'success');
    document.querySelector('.card').classList.add('celebrate');
    setTimeout(() => document.querySelector('.card').classList.remove('celebrate'), 1000);
  } else {
    showFeedback('❌ Revisa: ¿Suman ' + currentExercise.b + '? ¿Multiplican ' + (currentExercise.a*currentExercise.c) + '?', 'error');
  }
});

// === REINICIAR ===
document.getElementById('resetBtn').addEventListener('click', () => {
  loadExercise(currentExercise);
});

// === PISTA ===
document.getElementById('hintBtn').addEventListener('click', () => {
  const [n1, n2] = currentExercise.solution;
  const hint = `Pista: ${n1} + ${n2} = ${n1+n2} | ${n1} × ${n2} = ${n1*n2}`;
  document.getElementById('hintText').textContent = hint;
});

// === FEEDBACK ===
function showFeedback(msg, type) {
  const fb = document.getElementById('feedback');
  fb.textContent = msg;
  fb.className = `feedback show ${type}`;
}

// === EVENT LISTENERS ===
function setupEventListeners() {
  // Permitir reusar tiles al hacer doble click (para móvil)
  document.getElementById('tiles').addEventListener('click', (e) => {
    if (e.target.classList.contains('tile') && e.target.classList.contains('used')) {
      // Desmarcar tile y limpiar zona donde estaba
      e.target.classList.remove('used');
      Object.entries(placedNumbers).forEach(([slot, val]) => {
        if (val == e.target.dataset.value) {
          const zone = document.querySelector(`.drop-zone[data-slot="${slot}"]`);
          if (zone) {
            zone.textContent = '';
            zone.classList.remove('filled');
            delete placedNumbers[slot];
          }
        }
      });
      updateAspaPreview();
    }
  });
}