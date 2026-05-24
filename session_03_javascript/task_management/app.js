/* ============================================================
   TaskFlow — app.js
   Quản lý công việc cá nhân | localStorage | Vanilla JS
   ============================================================ */

'use strict';

/* ── Constants ── */
const STORAGE_KEY = 'taskflow_tasks';

const PRIORITY_LABEL = {
  low:    '🟢 Thấp',
  medium: '🟡 Trung bình',
  high:   '🔴 Cao',
};

/* ── Validation rules ── */
const RULES = {
  title: [
    { test: v => v.trim().length > 0,       msg: 'Tiêu đề không được để trống.' },
    { test: v => v.trim().length >= 3,      msg: 'Tiêu đề phải có ít nhất 3 ký tự.' },
    { test: v => v.trim().length <= 100,    msg: 'Tiêu đề không vượt quá 100 ký tự.' },
    { test: v => !/^\s+$/.test(v),         msg: 'Tiêu đề không được chỉ chứa khoảng trắng.' },
  ],
  desc: [
    { test: v => v.length <= 300,          msg: 'Mô tả không vượt quá 300 ký tự.' },
  ],
  priority: [
    { test: v => ['low','medium','high'].includes(v), msg: 'Vui lòng chọn mức ưu tiên.' },
  ],
  // due: validated separately (async logic with editingId context)
};

/* ── State ── */
let tasks         = [];
let editingId     = null;
let pendingDeleteId = null;
// Tracks which fields the user has interacted with (for real-time feedback)
const touchedFields = new Set();

/* ─────────────────────────────────────────────────────────────
   DOM refs
───────────────────────────────────────────────────────────── */
const $taskList      = document.getElementById('task-list');
const $emptyState    = document.getElementById('empty-state');
const $statTotal     = document.getElementById('stat-total');
const $statDone      = document.getElementById('stat-done');
const $statPending   = document.getElementById('stat-pending');
const $overlay       = document.getElementById('overlay');
const $toast         = document.getElementById('toast');

const $taskDialog    = document.getElementById('task-dialog');
const $dialogTitle   = document.getElementById('dialog-title');
const $taskForm      = document.getElementById('task-form');
const $fieldTitle    = document.getElementById('field-title');
const $fieldDesc     = document.getElementById('field-desc');
const $fieldDue      = document.getElementById('field-due');
const $fieldPriority = document.getElementById('field-priority');
const $btnSubmit     = document.getElementById('btn-submit');
const $btnSubmitText = document.getElementById('btn-submit-text');

const $btnOpenForm   = document.getElementById('btn-open-form');
const $btnCloseForm  = document.getElementById('btn-close-form');
const $btnCancel     = document.getElementById('btn-cancel');

const $confirmDialog    = document.getElementById('confirm-dialog');
const $confirmMsg       = document.getElementById('confirm-msg');
const $btnConfirmOk     = document.getElementById('btn-confirm-ok');
const $btnConfirmCancel = document.getElementById('btn-confirm-cancel');

/* ─────────────────────────────────────────────────────────────
   1. localStorage
───────────────────────────────────────────────────────────── */
function loadTasks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    tasks = raw ? JSON.parse(raw) : [];
  } catch { tasks = []; }
}

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

/* ─────────────────────────────────────────────────────────────
   2. Utilities
───────────────────────────────────────────────────────────── */
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function formatDue(dateISO) {
  if (!dateISO) return null;
  const [y, m, d] = dateISO.split('-');
  return `${d}/${m}/${y}`;
}

function dueDateStatus(dateISO) {
  if (!dateISO) return 'none';
  const today = todayISO();
  if (dateISO < today) return 'overdue';
  if (dateISO === today) return 'today';
  return 'future';
}

/* ─────────────────────────────────────────────────────────────
   3. Stats
───────────────────────────────────────────────────────────── */
function updateStats() {
  const total   = tasks.length;
  const done    = tasks.filter(t => t.done).length;
  $statTotal.textContent   = total;
  $statDone.textContent    = done;
  $statPending.textContent = total - done;
}

/* ─────────────────────────────────────────────────────────────
   4. Render
───────────────────────────────────────────────────────────── */
function render() {
  $taskList.innerHTML = '';
  if (tasks.length === 0) {
    $emptyState.hidden = false;
    updateStats();
    return;
  }
  $emptyState.hidden = true;

  const priorityOrder = { high: 0, medium: 1, low: 2 };
  const sorted = [...tasks].sort((a, b) => {
    if (a.done !== b.done) return a.done ? 1 : -1;
    return (priorityOrder[a.priority] ?? 1) - (priorityOrder[b.priority] ?? 1);
  });

  sorted.forEach(task => $taskList.appendChild(createTaskCard(task)));
  updateStats();
}

function createTaskCard(task) {
  const card = document.createElement('div');
  card.className = 'task-card' + (task.done ? ' is-done' : '');
  card.setAttribute('role', 'listitem');
  card.dataset.id = task.id;

  const dueStatus = task.due ? dueDateStatus(task.due) : 'none';
  const dueClass  = dueStatus === 'overdue' ? 'overdue' : dueStatus === 'today' ? 'today' : '';
  const duePrefix = dueStatus === 'overdue' ? '⚠ Quá hạn · ' : '📅 ';
  const dueHTML   = task.due
    ? `<span class="badge-due ${dueClass}">${duePrefix}${formatDue(task.due)}</span>` : '';
  const doneBadge = task.done ? `<span class="badge-done">✓ Hoàn thành</span>` : '';

  card.innerHTML = `
    <div class="task-checkbox-wrap">
      <input type="checkbox" class="task-checkbox"
        aria-label="Đánh dấu hoàn thành"
        ${task.done ? 'checked' : ''}
        data-action="toggle" data-id="${task.id}" />
    </div>
    <div class="task-body">
      <div class="task-meta">
        <span class="task-title">${escapeHtml(task.title)}</span>
      </div>
      ${task.desc ? `<p class="task-desc">${escapeHtml(task.desc)}</p>` : ''}
      <div class="task-footer">
        <span class="badge-priority ${task.priority}">${PRIORITY_LABEL[task.priority] ?? task.priority}</span>
        ${dueHTML}
        ${doneBadge}
      </div>
    </div>
    <div class="task-actions">
      <button class="btn-icon edit" title="Sửa" data-action="edit" data-id="${task.id}" aria-label="Sửa">✎</button>
      <button class="btn-icon delete" title="Xóa" data-action="delete" data-id="${task.id}" aria-label="Xóa">✕</button>
    </div>`;

  return card;
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/* ─────────────────────────────────────────────────────────────
   5. Toast
───────────────────────────────────────────────────────────── */
let _toastTimer = null;

function showToast(msg, type = 'success') {
  $toast.textContent = msg;
  $toast.className   = `toast ${type} show`;
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => $toast.classList.remove('show'), 3000);
}

/* ─────────────────────────────────────────────────────────────
   6. Validation engine
───────────────────────────────────────────────────────────── */

/**
 * Validate a single field by its id.
 * Returns { valid: boolean, message: string, warn: boolean }
 */
function validateField(fieldId) {
  const fieldEl = document.getElementById('field-' + fieldId);
  if (!fieldEl) return { valid: true, message: '', warn: false };
  const val = fieldEl.value;

  // ── title, desc, priority: run through RULES table ──
  if (RULES[fieldId]) {
    for (const rule of RULES[fieldId]) {
      if (!rule.test(val)) {
        return { valid: false, message: rule.msg, warn: false };
      }
    }
    return { valid: true, message: '', warn: false };
  }

  // ── due date: custom logic ──
  if (fieldId === 'due') {
    if (!val) return { valid: true, message: '', warn: false }; // optional

    // Basic format check
    if (!/^\d{4}-\d{2}-\d{2}$/.test(val)) {
      return { valid: false, message: 'Ngày không hợp lệ.', warn: false };
    }

    const today = todayISO();

    // Thêm mới: hạn phải >= hôm nay
    if (!editingId && val < today) {
      return { valid: false, message: 'Hạn hoàn thành không được là ngày trong quá khứ.', warn: false };
    }

    // Sửa: nếu hạn đã qua thì cảnh báo (warn) chứ không block
    if (editingId && val < today) {
      return { valid: true, message: '', warn: true };
    }

    return { valid: true, message: '', warn: false };
  }

  return { valid: true, message: '', warn: false };
}

/**
 * Apply visual state to a form-group.
 * state: 'idle' | 'error' | 'valid' | 'warn'
 */
function setFieldState(fieldId, state, message = '', hintMsg = '') {
  const group   = document.getElementById('group-' + fieldId);
  const errEl   = document.getElementById('err-' + fieldId);
  const iconEl  = document.getElementById('icon-' + fieldId);
  const hintEl  = document.getElementById('hint-' + fieldId);

  if (!group) return;

  // Remove all state classes
  group.classList.remove('is-error', 'is-valid', 'is-warn');

  if (errEl) errEl.textContent = '';
  if (iconEl) iconEl.textContent = '';
  if (hintEl) hintEl.textContent = '';

  if (state === 'error') {
    group.classList.add('is-error');
    if (errEl)  errEl.textContent  = message;
    if (iconEl) iconEl.textContent = '✕';
  } else if (state === 'valid') {
    group.classList.add('is-valid');
    if (iconEl) iconEl.textContent = '✓';
  } else if (state === 'warn') {
    group.classList.add('is-warn');
    if (iconEl) iconEl.textContent = '⚠';
    if (hintEl) hintEl.textContent = hintMsg || message;
  }
  // 'idle' → all removed, nothing added
}

/**
 * Validate + apply state for one field.
 * Returns true if valid (or warn).
 */
function checkField(fieldId) {
  const result = validateField(fieldId);

  if (!result.valid) {
    setFieldState(fieldId, 'error', result.message);
    return false;
  }

  const fieldEl = document.getElementById('field-' + fieldId);
  const val = fieldEl ? fieldEl.value : '';

  if (result.warn) {
    setFieldState(fieldId, 'warn', '', 'Ngày này đã qua — bạn vẫn có thể lưu.');
    return true;
  }

  // Empty optional field → idle (no green tick for optional empty)
  const isOptional = !['title', 'priority'].includes(fieldId);
  if (isOptional && val === '') {
    setFieldState(fieldId, 'idle');
  } else {
    setFieldState(fieldId, 'valid');
  }

  return true;
}

/**
 * Validate all fields; return true if form can be submitted.
 */
function validateAllFields() {
  const fields = ['title', 'desc', 'due', 'priority'];
  let allValid = true;
  let firstInvalidId = null;

  for (const id of fields) {
    const ok = checkField(id);
    if (!ok && allValid) {
      allValid = false;
      firstInvalidId = id;
    }
  }

  if (firstInvalidId) {
    const el = document.getElementById('field-' + firstInvalidId);
    if (el) el.focus();
  }

  return allValid;
}

/* ─────────────────────────────────────────────────────────────
   7. Character counters
───────────────────────────────────────────────────────────── */
function updateCharCount(fieldId, max) {
  const fieldEl = document.getElementById('field-' + fieldId);
  const countEl = document.getElementById('count-' + fieldId);
  if (!fieldEl || !countEl) return;

  const len  = fieldEl.value.length;
  const left = max - len;
  countEl.textContent = `${len} / ${max}`;

  countEl.classList.remove('near-limit', 'at-limit');
  if (len >= max)          countEl.classList.add('at-limit');
  else if (left <= max * 0.1) countEl.classList.add('near-limit'); // last 10%
}

/* ─────────────────────────────────────────────────────────────
   8. Form open / close
───────────────────────────────────────────────────────────── */
function resetFormState() {
  $taskForm.reset();
  touchedFields.clear();
  ['title', 'desc', 'due', 'priority'].forEach(id => setFieldState(id, 'idle'));
  updateCharCount('title', 100);
  updateCharCount('desc',  300);

  // Reset hint on due
  const hintDue = document.getElementById('hint-due');
  if (hintDue) hintDue.textContent = '';
}

function openForm(mode = 'add', task = null) {
  resetFormState();

  if (mode === 'edit' && task) {
    editingId = task.id;
    $dialogTitle.textContent = 'Sửa công việc';
    $btnSubmitText.textContent = 'Cập nhật';
    $fieldTitle.value    = task.title;
    $fieldDesc.value     = task.desc || '';
    $fieldDue.value      = task.due  || '';
    $fieldPriority.value = task.priority || '';
    updateCharCount('title', 100);
    updateCharCount('desc',  300);
  } else {
    editingId = null;
    $dialogTitle.textContent = 'Thêm công việc';
    $btnSubmitText.textContent = 'Lưu công việc';
  }

  $taskDialog.classList.add('open');
  $overlay.classList.add('active');
  $overlay.setAttribute('aria-hidden', 'false');
  setTimeout(() => $fieldTitle.focus(), 60);
}

function closeForm() {
  $taskDialog.classList.remove('open');
  closeOverlayIfNoDialogs();
  editingId = null;
  touchedFields.clear();
}

function openConfirmDialog(id) {
  pendingDeleteId = id;
  const task = tasks.find(t => t.id === id);
  $confirmMsg.textContent =
    `Bạn có chắc muốn xóa "${task?.title ?? 'công việc này'}"? Hành động này không thể hoàn tác.`;
  $confirmDialog.classList.add('open');
  $overlay.classList.add('active');
  $overlay.setAttribute('aria-hidden', 'false');
}

function closeConfirmDialog() {
  $confirmDialog.classList.remove('open');
  closeOverlayIfNoDialogs();
  pendingDeleteId = null;
}

function closeOverlayIfNoDialogs() {
  if (!$taskDialog.classList.contains('open') && !$confirmDialog.classList.contains('open')) {
    $overlay.classList.remove('active');
    $overlay.setAttribute('aria-hidden', 'true');
  }
}

/* Dialog shake on failed submit */
function shakeDialog() {
  $taskDialog.classList.remove('shake');
  // Force reflow so the animation re-triggers
  void $taskDialog.offsetWidth;
  $taskDialog.classList.add('shake');
  $taskDialog.addEventListener('animationend', () => {
    $taskDialog.classList.remove('shake');
  }, { once: true });
}

/* ─────────────────────────────────────────────────────────────
   9. CRUD
───────────────────────────────────────────────────────────── */
function addTask(data) {
  tasks.push({
    id:        generateId(),
    title:     data.title.trim(),
    desc:      data.desc.trim(),
    due:       data.due || '',
    priority:  data.priority,
    done:      false,
    createdAt: new Date().toISOString(),
  });
  saveTasks(); render();
  showToast('✓ Đã thêm công việc mới!');
}

function updateTask(id, data) {
  const idx = tasks.findIndex(t => t.id === id);
  if (idx === -1) return;
  tasks[idx] = {
    ...tasks[idx],
    title:     data.title.trim(),
    desc:      data.desc.trim(),
    due:       data.due || '',
    priority:  data.priority,
    updatedAt: new Date().toISOString(),
  };
  saveTasks(); render();
  showToast('✓ Đã cập nhật công việc!');
}

function deleteTask(id) {
  const task = tasks.find(t => t.id === id);
  tasks = tasks.filter(t => t.id !== id);
  saveTasks(); render();
  showToast(`✕ Đã xóa "${task?.title ?? 'công việc'}"`, 'error');
}

function toggleTask(id) {
  const task = tasks.find(t => t.id === id);
  if (!task) return;
  task.done = !task.done;
  saveTasks(); render();
  showToast(task.done ? '✓ Đã hoàn thành!' : '↩ Đã đánh dấu chưa xong');
}

/* ─────────────────────────────────────────────────────────────
   10. Event listeners
───────────────────────────────────────────────────────────── */

/* Open / close form */
$btnOpenForm.addEventListener('click', () => openForm('add'));
$btnCloseForm.addEventListener('click', closeForm);
$btnCancel.addEventListener('click', closeForm);
$overlay.addEventListener('click', () => { closeForm(); closeConfirmDialog(); });

/* ── Real-time validation: blur (on field leave) ── */
[$fieldTitle, $fieldDesc, $fieldDue, $fieldPriority].forEach(el => {
  el.addEventListener('blur', () => {
    const id = el.id.replace('field-', '');
    touchedFields.add(id);
    checkField(id);
  });
});

/* ── Real-time validation: input (clear error while typing, re-validate if touched) ── */
$fieldTitle.addEventListener('input', () => {
  updateCharCount('title', 100);
  if (touchedFields.has('title')) checkField('title');
});

$fieldDesc.addEventListener('input', () => {
  updateCharCount('desc', 300);
  if (touchedFields.has('desc')) checkField('desc');
});

$fieldDue.addEventListener('change', () => {
  touchedFields.add('due');
  checkField('due');
});

$fieldPriority.addEventListener('change', () => {
  touchedFields.add('priority');
  checkField('priority');
});

/* ── Submit ── */
$taskForm.addEventListener('submit', e => {
  e.preventDefault();

  // Mark all as touched so errors show
  ['title', 'desc', 'due', 'priority'].forEach(id => touchedFields.add(id));

  const valid = validateAllFields();
  if (!valid) {
    shakeDialog();
    return;
  }

  const data = {
    title:    $fieldTitle.value,
    desc:     $fieldDesc.value,
    due:      $fieldDue.value,
    priority: $fieldPriority.value,
  };

  if (editingId) {
    updateTask(editingId, data);
  } else {
    addTask(data);
  }

  closeForm();
});

/* ── Task list (delegation) ── */
$taskList.addEventListener('click', e => {
  const btn = e.target.closest('[data-action]');
  if (!btn) return;
  const { id, action } = btn.dataset;
  if (action === 'edit')   { const t = tasks.find(x => x.id === id); if (t) openForm('edit', t); }
  if (action === 'delete') openConfirmDialog(id);
  if (action === 'toggle') toggleTask(id);
});

/* ── Confirm delete ── */
$btnConfirmOk.addEventListener('click', () => {
  if (pendingDeleteId) deleteTask(pendingDeleteId);
  closeConfirmDialog();
});
$btnConfirmCancel.addEventListener('click', closeConfirmDialog);

/* ── ESC key ── */
document.addEventListener('keydown', e => {
  if (e.key !== 'Escape') return;
  if ($taskDialog.classList.contains('open'))    closeForm();
  if ($confirmDialog.classList.contains('open')) closeConfirmDialog();
});

/* ─────────────────────────────────────────────────────────────
   11. Init
───────────────────────────────────────────────────────────── */
(function init() {
  loadTasks();
  render();
})();