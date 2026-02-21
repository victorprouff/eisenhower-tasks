const translations = {
  fr: {
    appTitle: "Matrice d'Eisenhower",
    clearTasksTitle: "Supprimer toutes les tâches",
    themeToggleTitle: "Changer de thème",
    langToggleTitle: "Switch to English",
    restartAndUpdate: "Redémarrer et mettre à jour",
    newTask: "Nouvelle tâche",
    taskInputPlaceholder: "Entrez une tâche...",
    addTask: "Ajouter",
    unassignedTasks: "Tâches non assignées",
    q1Title: "Faire immédiatement",
    q1Label: "Urgent & Important",
    q2Title: "Planifier",
    q2Label: "Important & Non urgent",
    q3Title: "Déléguer - Annuler si pas le temps",
    q3Label: "Urgent & Non important",
    q4Title: "À piocher si on en a envie et le temps",
    q4Label: "Non urgent & Non important",
    axisImportance: "IMPORTANCE",
    axisUrgency: "URGENCE",
    prioritizedList: "Liste priorisée",
    priority1: "Faire maintenant",
    priority2: "Planifier",
    priority3: "Déléguer",
    priority4: "À piocher",
    confirmDeleteAll: "Êtes-vous sûr de vouloir supprimer toutes les tâches ?",
    emptyUnassigned: "Aucune tâche en attente",
    emptyQuadrant: "Glissez une tâche ici",
    emptyPriority: "Aucune tâche",
    updateAvailable: (v) => `Mise à jour v${v} disponible — téléchargement en cours...`,
    updateReady: (v) => `v${v} prête à installer.`,
  },
  en: {
    appTitle: "Eisenhower Matrix",
    clearTasksTitle: "Delete all tasks",
    themeToggleTitle: "Toggle theme",
    langToggleTitle: "Passer en français",
    restartAndUpdate: "Restart and update",
    newTask: "New task",
    taskInputPlaceholder: "Enter a task...",
    addTask: "Add",
    unassignedTasks: "Unassigned tasks",
    q1Title: "Do immediately",
    q1Label: "Urgent & Important",
    q2Title: "Schedule",
    q2Label: "Important & Not urgent",
    q3Title: "Delegate - Cancel if no time",
    q3Label: "Urgent & Not important",
    q4Title: "Pick up when you have time",
    q4Label: "Not urgent & Not important",
    axisImportance: "IMPORTANCE",
    axisUrgency: "URGENCY",
    prioritizedList: "Prioritized list",
    priority1: "Do now",
    priority2: "Schedule",
    priority3: "Delegate",
    priority4: "Pick up",
    confirmDeleteAll: "Are you sure you want to delete all tasks?",
    emptyUnassigned: "No pending tasks",
    emptyQuadrant: "Drag a task here",
    emptyPriority: "No tasks",
    updateAvailable: (v) => `Update v${v} available — downloading...`,
    updateReady: (v) => `v${v} ready to install.`,
  },
};

let currentLang = localStorage.getItem('lang') || 'fr';

function t(key, ...args) {
  const val = translations[currentLang]?.[key];
  if (val === undefined) return key;
  if (typeof val === 'function') return val(...args);
  return val;
}

function setLang(lang) {
  currentLang = lang;
  localStorage.setItem('lang', lang);
}

function applyTranslations() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    const attr = el.dataset.i18nAttr;
    if (attr) {
      el.setAttribute(attr, t(key));
    } else {
      el.textContent = t(key);
    }
  });

  document.title = t('appTitle');
  document.documentElement.lang = currentLang;

  const langBtn = document.getElementById('langToggle');
  if (langBtn) {
    langBtn.textContent = currentLang === 'fr' ? 'EN' : 'FR';
    langBtn.title = t('langToggleTitle');
  }
}
