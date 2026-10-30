(() => {
  'use strict';

  const STORAGE_KEY = 'calendario-note-v1';
  const monthTitle = document.getElementById('monthTitle');
  const calendarGrid = document.getElementById('calendarGrid');
  const dialogBackdrop = document.getElementById('dialogBackdrop');
  const dialogTitle = document.getElementById('dialogTitle');
  const noteInput = document.getElementById('noteInput');
  const charCount = document.getElementById('charCount');
  const deleteBtn = document.getElementById('deleteBtn');
  const toast = document.getElementById('toast');

  const now = new Date();
  let visibleDate = new Date(now.getFullYear(), now.getMonth(), 1);
  let selectedKey = null;
  let lastFocusedElement = null;
  let toastTimer = null;

  const monthFormatter = new Intl.DateTimeFormat('it-IT', { month: 'long', year: 'numeric' });
  const fullDateFormatter = new Intl.DateTimeFormat('it-IT', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  });

  function loadNotes() {
    try {
      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
    } catch (error) {
      console.warn('Impossibile leggere le note salvate.', error);
      return {};
    }
  }

  let notes = loadNotes();

  function saveNotes() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
      return true;
    } catch (error) {
      console.error('Impossibile salvare le note.', error);
      showToast('Spazio di salvataggio non disponibile');
      return false;
    }
  }

  function dateKey(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  function dateFromKey(key) {
    const [year, month, day] = key.split('-').map(Number);
    return new Date(year, month - 1, day);
  }

  function isSameDay(a, b) {
    return a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate();
  }

  function renderCalendar() {
    const year = visibleDate.getFullYear();
    const month = visibleDate.getMonth();
    monthTitle.textContent = monthFormatter.format(visibleDate);
    calendarGrid.replaceChildren();

    const firstDay = new Date(year, month, 1);
    const mondayOffset = (firstDay.getDay() + 6) % 7;
    const gridStart = new Date(year, month, 1 - mondayOffset);
    const fragment = document.createDocumentFragment();

    for (let index = 0; index < 42; index++) {
      const date = new Date(gridStart);
      date.setDate(gridStart.getDate() + index);
      const key = dateKey(date);
      const note = notes[key] || '';
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'day';
      button.dataset.date = key;

      if (date.getMonth() !== month) button.classList.add('outside');
      if (isSameDay(date, now)) button.classList.add('today');

      const accessibleDate = fullDateFormatter.format(date);
      button.setAttribute('aria-label', note ? `${accessibleDate}. Nota: ${note}` : `${accessibleDate}. Aggiungi una nota`);

      const dayHead = document.createElement('div');
      dayHead.className = 'day-head';
      const dayNumber = document.createElement('span');
      dayNumber.className = 'day-number';
      dayNumber.textContent = date.getDate();
      dayHead.appendChild(dayNumber);

      if (note) {
        const dot = document.createElement('span');
        dot.className = 'note-count';
        dot.setAttribute('aria-hidden', 'true');
        dayHead.appendChild(dot);

        const preview = document.createElement('div');
        preview.className = 'note-preview';
        preview.textContent = note;
        button.append(dayHead, preview);
      } else {
        button.appendChild(dayHead);
      }

      fragment.appendChild(button);
    }

    calendarGrid.appendChild(fragment);
  }

  function openDialog(key, trigger) {
    selectedKey = key;
    lastFocusedElement = trigger || document.activeElement;
    const selectedDate = dateFromKey(key);
    const existingNote = notes[key] || '';
    dialogTitle.textContent = fullDateFormatter.format(selectedDate);
    noteInput.value = existingNote;
    charCount.textContent = existingNote.length;
    deleteBtn.hidden = !existingNote;
    dialogBackdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
    window.setTimeout(() => noteInput.focus(), 80);
  }

  function closeDialog() {
    dialogBackdrop.classList.remove('open');
    document.body.style.overflow = '';
    selectedKey = null;
    if (lastFocusedElement && document.contains(lastFocusedElement)) lastFocusedElement.focus();
  }

  function showToast(message) {
    window.clearTimeout(toastTimer);
    toast.textContent = message;
    toast.classList.add('show');
    toastTimer = window.setTimeout(() => toast.classList.remove('show'), 2200);
  }

  function saveCurrentNote() {
    if (!selectedKey) return;
    const value = noteInput.value.trim();
    if (value) notes[selectedKey] = value;
    else delete notes[selectedKey];

    if (saveNotes()) {
      renderCalendar();
      closeDialog();
      showToast(value ? 'Nota salvata' : 'Nota rimossa');
    }
  }

  function deleteCurrentNote() {
    if (!selectedKey || !notes[selectedKey]) return;
    delete notes[selectedKey];
    if (saveNotes()) {
      renderCalendar();
      closeDialog();
      showToast('Nota eliminata');
    }
  }

  calendarGrid.addEventListener('click', (event) => {
    const day = event.target.closest('.day');
    if (!day) return;
    openDialog(day.dataset.date, day);
  });

  document.getElementById('prevBtn').addEventListener('click', () => {
    visibleDate = new Date(visibleDate.getFullYear(), visibleDate.getMonth() - 1, 1);
    renderCalendar();
  });

  document.getElementById('nextBtn').addEventListener('click', () => {
    visibleDate = new Date(visibleDate.getFullYear(), visibleDate.getMonth() + 1, 1);
    renderCalendar();
  });

  document.getElementById('todayBtn').addEventListener('click', () => {
    visibleDate = new Date(now.getFullYear(), now.getMonth(), 1);
    renderCalendar();
    const todayCell = calendarGrid.querySelector(`[data-date="${dateKey(now)}"]`);
    if (todayCell) todayCell.focus();
  });

  document.getElementById('saveBtn').addEventListener('click', saveCurrentNote);
  document.getElementById('deleteBtn').addEventListener('click', deleteCurrentNote);
  document.getElementById('cancelBtn').addEventListener('click', closeDialog);
  document.getElementById('closeBtn').addEventListener('click', closeDialog);

  noteInput.addEventListener('input', () => {
    charCount.textContent = noteInput.value.length;
  });

  noteInput.addEventListener('keydown', (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') saveCurrentNote();
  });

  dialogBackdrop.addEventListener('click', (event) => {
    if (event.target === dialogBackdrop) closeDialog();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && dialogBackdrop.classList.contains('open')) closeDialog();
  });

  renderCalendar();
})();
