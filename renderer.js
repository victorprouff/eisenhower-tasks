// État de l'application
let tasks = [];
let draggedTask = null;

// Éléments DOM
const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');
const dropZones = document.querySelectorAll('.quadrant-tasks');

// Initialisation
document.addEventListener('DOMContentLoaded', async () => {
  await loadTasks();
  setupEventListeners();
  applyTranslations();
  render();
});

// Configuration des événements
function setupEventListeners() {
  // Ajouter une tâche
  addTaskBtn.addEventListener('click', addTask);
  taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
  });

  // Drag & Drop sur les quadrants
  dropZones.forEach(zone => {
    zone.addEventListener('dragover', handleDragOver);
    zone.addEventListener('drop', handleDrop);
    zone.addEventListener('dragleave', handleDragLeave);
  });

  // Changement de langue
  const langToggle = document.getElementById('langToggle');
  langToggle.addEventListener('click', () => {
    setLang(currentLang === 'fr' ? 'en' : 'fr');
    applyTranslations();
    render();
  });
}

// Ajouter une nouvelle tâche
function addTask() {
  const text = taskInput.value.trim();
  if (!text) return;

  const task = {
    id: Date.now().toString(),
    text: text,
    quadrant: null,
    completed: false,
    createdAt: new Date().toISOString()
  };

  tasks.push(task);
  taskInput.value = '';
  saveTasks();
  render();
}

// Supprimer une tâche
function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  saveTasks();
  render();
}

function toggleTaskComplete(id) {
  const task = tasks.find(t => t.id === id);
  if (task) {
    task.completed = !task.completed;
    saveTasks();
    render();
  }
}

function removeAllTasks() {
  if (confirm(t('confirmDeleteAll'))) {
    tasks = [];
    saveTasks();
    render();
  }
}

function createTaskElement(task, isDraggable = true) {
  const taskEl = document.createElement('div');
  taskEl.className = 'task-item';
  taskEl.dataset.taskId = task.id;

  if (task.completed) {
    taskEl.classList.add('completed');
  }

  if (task.quadrant) {
    taskEl.classList.add(`q${task.quadrant}`);
  }

  if (isDraggable) {
    taskEl.draggable = true;
    taskEl.addEventListener('dragstart', handleDragStart);
    taskEl.addEventListener('dragend', handleDragEnd);
  }

  // Case à cocher
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.className = 'task-checkbox';
  checkbox.checked = task.completed;
  checkbox.onclick = (e) => {
    e.stopPropagation();
    toggleTaskComplete(task.id);
  };

  const textSpan = document.createElement('span');
  textSpan.className = 'task-text';
  textSpan.textContent = task.text;

  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'task-delete';
  deleteBtn.innerHTML = '×';
  deleteBtn.onclick = (e) => {
    e.stopPropagation();
    deleteTask(task.id);
  };

  taskEl.appendChild(checkbox);
  taskEl.appendChild(textSpan);
  taskEl.appendChild(deleteBtn);

  return taskEl;
}

// Gestion du drag
function handleDragStart(e) {
  draggedTask = e.target;
  e.target.classList.add('dragging');
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/html', e.target.innerHTML);
}

function handleDragEnd(e) {
  e.target.classList.remove('dragging');
  draggedTask = null;

  document.querySelectorAll('.quadrant').forEach(q => {
    q.classList.remove('drag-over');
  });
}

function handleDragOver(e) {
  if (e.preventDefault) {
    e.preventDefault();
  }

  e.dataTransfer.dropEffect = 'move';

  const quadrant = e.target.closest('.quadrant');
  if (quadrant) {
    quadrant.classList.add('drag-over');
  }

  return false;
}

function handleDragLeave(e) {
  const quadrant = e.target.closest('.quadrant');
  if (quadrant && !quadrant.contains(e.relatedTarget)) {
    quadrant.classList.remove('drag-over');
  }
}

function handleDrop(e) {
  if (e.stopPropagation) {
    e.stopPropagation();
  }

  e.preventDefault();

  const quadrant = e.target.closest('.quadrant');
  quadrant.classList.remove('drag-over');

  if (draggedTask) {
    const taskId = draggedTask.dataset.taskId;
    const quadrantNumber = parseInt(e.target.dataset.dropZone);

    const task = tasks.find(t => t.id === taskId);
    if (task) {
      task.quadrant = quadrantNumber;
      saveTasks();
      render();
    }
  }

  return false;
}

// Rendu de l'interface
function render() {
  taskList.innerHTML = '';
  dropZones.forEach(zone => zone.innerHTML = '');

  for (let i = 1; i <= 4; i++) {
    document.getElementById(`priority-${i}`).innerHTML = '';
  }

  const unassignedTasks = tasks
    .filter(t => !t.quadrant)
    .sort((a, b) => a.completed - b.completed);

  if (unassignedTasks.length === 0) {
    taskList.innerHTML = `<div class="empty-state">${t('emptyUnassigned')}</div>`;
  } else {
    unassignedTasks.forEach(task => {
      taskList.appendChild(createTaskElement(task));
    });
  }

  for (let i = 1; i <= 4; i++) {
    const quadrantTasks = tasks.filter(task => task.quadrant === i)
          .sort((a, b) => a.completed === b.completed ? 0 : a.completed ? 1 : -1);

    const zone = document.querySelector(`[data-drop-zone="${i}"]`);

    if (quadrantTasks.length === 0) {
      zone.innerHTML = `<div class="empty-state">${t('emptyQuadrant')}</div>`;
    } else {
      quadrantTasks.forEach(task => {
        zone.appendChild(createTaskElement(task));
      });
    }
  }

  renderPriorityList();
}

// Afficher la liste priorisée
function renderPriorityList() {
  for (let i = 1; i <= 4; i++) {
    const priorityContainer = document.getElementById(`priority-${i}`);
    const quadrantTasks = tasks.filter(task => task.quadrant === i)
          .sort((a, b) => a.completed === b.completed ? 0 : a.completed ? 1 : -1);

    if (quadrantTasks.length === 0) {
      priorityContainer.innerHTML = `<div class="empty-state">${t('emptyPriority')}</div>`;
    } else {
      quadrantTasks.forEach(task => {
        priorityContainer.appendChild(createTaskElement(task, false));
      });
    }
  }
}

// Sauvegarde et chargement
async function saveTasks() {
  if (window.electronAPI) {
    await window.electronAPI.saveTasks(tasks);
  }
}

async function loadTasks() {
  if (window.electronAPI) {
    const loadedTasks = await window.electronAPI.loadTasks();
    if (loadedTasks && loadedTasks.length > 0) {
      tasks = loadedTasks;
    }
  }
}

// Gestion des raccourcis clavier
document.addEventListener('keydown', (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key === 'n') {
    e.preventDefault();
    taskInput.focus();
  }
});

// Gestion du thème
const themeToggle = document.getElementById('themeToggle');
const themeIcon = themeToggle.querySelector('.theme-icon');

const savedTheme = localStorage.getItem('theme') || 'dark';
if (savedTheme === 'dark') {
  document.body.classList.add('dark-theme');
  themeIcon.textContent = '☀️';
}

themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-theme');
  const isDark = document.body.classList.contains('dark-theme');
  themeIcon.textContent = isDark ? '☀️' : '🌙';
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

// Mises à jour automatiques
const updateBanner = document.getElementById('update-banner');
const updateMessage = document.getElementById('update-message');
const updateInstallBtn = document.getElementById('update-install-btn');

if (window.electronAPI) {
  window.electronAPI.onUpdateAvailable((version) => {
    updateMessage.textContent = t('updateAvailable', version);
    updateInstallBtn.style.display = 'none';
    updateBanner.classList.remove('hidden');
  });

  window.electronAPI.onUpdateDownloaded((version) => {
    updateMessage.textContent = t('updateReady', version);
    updateInstallBtn.style.display = '';
    updateBanner.classList.remove('hidden');
  });

  updateInstallBtn.addEventListener('click', () => {
    window.electronAPI.restartAndInstall();
  });
}
