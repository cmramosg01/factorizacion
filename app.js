// Configuración de ejercicios
const exercises = [
  { a: 1, b: 5, c: 6, solution: [2, 3], equation: "x² + 5x + 6" },
  { a: 1, b: -7, c: 10, solution: [-2, -5], equation: "x² - 7x + 10" },
  { a: 1, b: 1, c: -12, solution: [-3, 4], equation: "x² + x - 12" },
];

let currentExercise = exercises[0];
let draggedTile = null;
let placedNumbers = {};

document.addEventListener('DOMContentLoaded', () => {
  loadExercise(currentExercise);
});

function loadExercise(ex) {
  document.getElementById('equation').textContent = ex.equation;
  document.getElementById('ac-value').textContent = ex.a * ex.c;
  document.getElementById('b-value').textContent = ex.b;
  
  generateTiles(ex);
  
  document.querySelectorAll('.drop-zone').forEach(zone => {
    zone.textContent = '';
    zone.classList.remove('filled');
  });
  
  document.querySelectorAll('.aspa-box[id^="num"]').forEach(box => {
    box.textContent = '?';
    box.classList.remove('filled');
  });
  
  const feedback = document.getElementById('feedback');
  feedback.className = 'feedback';
  feedback.textContent = '';
  
  placedNumbers = {};
  document.getElementById('hintText').textContent = '';
}

function generateTiles(ex) {
  const container = document.getElementById('tiles');
  container.innerHTML = '';
  
  const options = [...new Set([
    ...ex.solution, 
    ex.c, ex.b, 
    ...(ex.solution.map(n => n * -1)),
    0, 1
  ].filter(n => Number.isInteger(n)))];
  
  options.sort(() => Math.random() - 0.5).slice(0, 6).forEach(num => {
    const tile = document.createElement('div');
    tile.className = 'tile';
    tile.textContent = num;
    tile.dataset.value = num;
    tile.draggable = true;
    
    tile.addEventListener('dragstart', (e) => {
      draggedTile = tile;
      e.dataTransfer.setData('text/plain', num);
      e.dataTransfer.effectAllowed = 'move';
      setTimeout(() => tile.classList.add('used'), 0);
    });
    
    tile.addEventListener('dragend', () => {
      draggedTile = null;
    });
    
    container.appendChild(tile);
  });
}

// Configurar zonas de drop
document.querySelectorAll('.drop-zone').forEach(zone => {
  zone.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    zone.classList.add('drag-over');
  });
  
  zone.addEventListener('dragleave', () => {
    zone.classList.remove('drag-over');
  });
  
  zone.addEventListener('drop', (e) => {
    e.preventDefault();
    zone.classList.remove('drag-over');
    
    if (!draggedTile) return;
    
    const value = draggedTile.dataset.value;
    zone.textContent = value;
    zone.classList.add('filled');
    placedNumbers[zone.dataset.slot] = parseInt(value);
    
    updateAspaPreview();
  });
});

function updateAspaPreview() {
  const slots = document.querySelectorAll('.drop-zone');
  const values = Array.from(slots).map(s => parseInt(s.textContent) || null);
  
  if (values[0] !== null && values[1] !== null) {
    const [n1, n2] = values;
    document.getElementById('num1-placeholder').textContent = n1;
    document.getElementById('num2-placeholder').textContent = n2;
    
    const sum = n1 + n2;
    const prod = n1 * n2;
    const ac = currentExercise.a * currentExercise.c;
    const b = currentExercise.b;
    
    if (sum === b && prod === ac) {
      document.querySelectorAll('.aspa-box').forEach(b => b.classList.add('filled'));
    }
  }
}

// Verificar solución
document.getElementById('checkBtn').addEventListener('click', () => {
  const slots = document.querySelectorAll('.drop-zone');
  const values = Array.from(slots).map(s => parseInt(s.textContent)).filter(v => !isNaN(v));
  
  if (values.length < 2) {
    showFeedback('Coloca los dos números primero 👇', 'error');
    return;
  }
  
  const [n1, n2] = values;
  const correct = currentExercise.solution;
  
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

// Reiniciar
document.getElementById('resetBtn').addEventListener('click', () => {
  loadExercise(currentExercise);
});

// Pista
document.getElementById('hintBtn').addEventListener('click', () => {
  const [n1, n2] = currentExercise.solution;
  const hint = `Pista: ${n1} + ${n2} = ${n1+n2} | ${n1} × ${n2} = ${n1*n2}`;
  document.getElementById('hintText').textContent = hint;
});

function showFeedback(msg, type) {
  const fb = document.getElementById('feedback');
  fb.textContent = msg;
  fb.className = `feedback show ${type}`;
}

// Permitir reusar tiles haciendo click
document.getElementById('tiles').addEventListener('click', (e) => {
  if (e.target.classList.contains('tile') && e.target.classList.contains('used')) {
    const value = parseInt(e.target.dataset.value);
    
    Object.entries(placedNumbers).forEach(([slot, val]) => {
      if (val === value) {
        const zone = document.querySelector(`.drop-zone[data-slot="${slot}"]`);
        if (zone) {
          zone.textContent = '';
          zone.classList.remove('filled');
          delete placedNumbers[slot];
        }
      }
    });
    
    e.target.classList.remove('used');
    updateAspaPreview();
  }
});
