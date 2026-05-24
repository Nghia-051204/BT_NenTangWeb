/* ============================================================
   TaskFlow — app.js
   Quản lý công việc cá nhân | localStorage | Vanilla JS
   ============================================================ */

'use strict';

/* ── Storage key ── */
const STORAGE_KEY = 'taskflow_tasks';

/* ── Priority labels ── */
const PRIORITY_LABEL = {
  low:    '🟢 Thấp',
  medium: '🟡 Trung bình',
  high:   '🔴 Cao',
};

/* ── State ── */
let tasks = [];             // mảng công việc
let editingId = null;       // id đang sửa (null = thêm mới)
let pendingDeleteId = null; // id chờ xác nhận xóa

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

// Form dialog
const $taskDialog    = document.getElementById('task-dialog');
const $dialogTitle   = document.getElementById('dialog-title');
const $taskForm      = document.getElementById('task-form');
const $fieldTitle    = document.getElementById('field-title');
const $fieldDesc     = document.getElementById('field-desc');
const $fieldDue      = document.getElementById('field-due');
const $fieldPriority = document.getElementById('field-priority');
const $editId        = document.getElementById('edit-id');
const $errTitle      = document.getElementById('err-title');
const $btnSubmit     = document.getElementById('btn-submit');

// Buttons
const $btnOpenForm   = document.getElementById('btn-open-form');
const $btnCloseForm  = document.getElementById('btn-close-form');
const $btnCancel     = document.getElementById('btn-cancel');

// Confirm dialog
const $confirmDialog = document.getElementById('confirm-dialog');
const $confirmMsg    = document.getElementById('confirm-msg');
const $btnConfirmOk  = document.getElementById('btn-confirm-ok');
const $btnConfirmCancel = document.getElementById('btn-confirm-cancel');

/* ─────────────────────────────────────────────────────────────
   1. localStorage helpers
───────────────────────────────────────────────────────────── */
function loadTasks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    tasks = raw ? JSON.parse(raw) : [];
  } catch {
    tasks = [];
  }
}

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

/* ─────────────────────────────────────────────────────────────
   2. Utility helpers
───────────────────────────────────────────────────────────── */
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function todayISO() {
  return new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"
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
  const pending = total - done;

  $statTotal.textContent   = total;
  $statDone.textContent    = done;
  $statPending.textContent = pending;
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

  // Sắp xếp: chưa hoàn thành lên trên, ưu tiên cao lên trên
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  const sorted = [...tasks].sort((a, b) => {
    if (a.done !== b.done) return a.done ? 1 : -1;
    return (priorityOrder[a.priority] ?? 1) - (priorityOrder[b.priority] ?? 1);
  });

  sorted.forEach(task => {
    $taskList.appendChild(createTaskCard(task));
  });

  updateStats();
}

function createTaskCard(task) {
  const card = document.createElement('div');
  card.className = 'task-card' + (task.done ? ' is-done' : '');
  card.setAttribute('role', 'listitem');
  card.dataset.id = task.id;

  const dueStatus  = task.due ? dueDateStatus(task.due) : 'none';
  const dueClass   = dueStatus === 'overdue' ? 'overdue' : dueStatus === 'today' ? 'today' : '';
  const dueLabelPrefix = dueStatus === 'overdue' ? '⚠ Quá hạn · ' : dueStatus === 'today' ? '📅 Hôm nay · ' : '📅 ';
  const dueHTML = task.due
    ? `<span class="badge-due ${dueClass}">${dueLabelPrefix}${formatDue(task.due)}</span>`
    : '';

  const doneBadge = task.done ? `<span class="badge-done">✓ Hoàn thành</span>` : '';

  card.innerHTML = `
    <div class="task-checkbox-wrap">
      <input
        type="checkbox"
        class="task-checkbox"
        aria-label="Đánh dấu hoàn thành"
        ${task.done ? 'checked' : ''}
        data-action="toggle"
        data-id="${task.id}"
      />
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
      <button class="btn-icon edit" title="Sửa công việc" data-action="edit" data-id="${task.id}" aria-label="Sửa">✎</button>
      <button class="btn-icon delete" title="Xóa công việc" data-action="delete" data-id="${task.id}" aria-label="Xóa">✕</button>
    </div>
  `;

  return card;
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/* ─────────────────────────────────────────────────────────────
   5. Toast
───────────────────────────────────────────────────────────── */
let _toastTimer = null;

function showToast(msg, type = 'success') {
  $toast.textContent = msg;
  $toast.className   = `toast ${type} show`;
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => {
    $toast.classList.remove('show');
  }, 3000);
}

/* ─────────────────────────────────────────────────────────────
   6. Form / Dialog helpers
───────────────────────────────────────────────────────────── */
function openForm(mode = 'add', task = null) {
  // Reset
  $taskForm.reset();
  $errTitle.textContent = '';

  if (mode === 'edit' && task) {
    editingId                  = task.id;
    $dialogTitle.textContent   = 'Sửa công việc';
    $btnSubmit.textContent     = 'Cập nhật';
    $fieldTitle.value          = task.title;
    $fieldDesc.value           = task.desc || '';
    $fieldDue.value            = task.due  || '';
    $fieldPriority.value       = task.priority || 'medium';
  } else {
    editingId                  = null;
    $dialogTitle.textContent   = 'Thêm công việc';
    $btnSubmit.textContent     = 'Lưu công việc';
  }

  $taskDialog.classList.add('open');
  $overlay.classList.add('active');
  $overlay.setAttribute('aria-hidden', 'false');
  setTimeout(() => $fieldTitle.focus(), 50);
}

function closeForm() {
  $taskDialog.classList.remove('open');
  closeOverlayIfNoDialogs();
  editingId = null;
}

function openConfirmDialog(id) {
  pendingDeleteId = id;
  const task = tasks.find(t => t.id === id);
  $confirmMsg.textContent = `Bạn có chắc muốn xóa "${task?.title ?? 'công việc này'}"? Hành động này không thể hoàn tác.`;
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

/* ─────────────────────────────────────────────────────────────
   7. CRUD operations
───────────────────────────────────────────────────────────── */
function addTask(data) {
  const newTask = {
    id:       generateId(),
    title:    data.title.trim(),
    desc:     data.desc.trim(),
    due:      data.due || '',
    priority: data.priority,
    done:     false,
    createdAt: new Date().toISOString(),
  };
  tasks.push(newTask);
  saveTasks();
  render();
  showToast('✓ Đã thêm công việc mới!');
}

function updateTask(id, data) {
  const idx = tasks.findIndex(t => t.id === id);
  if (idx === -1) return;
  tasks[idx] = {
    ...tasks[idx],
    title:    data.title.trim(),
    desc:     data.desc.trim(),
    due:      data.due || '',
    priority: data.priority,
    updatedAt: new Date().toISOString(),
  };
  saveTasks();
  render();
  showToast('✓ Đã cập nhật công việc!');
}

function deleteTask(id) {
  const task = tasks.find(t => t.id === id);
  tasks = tasks.filter(t => t.id !== id);
  saveTasks();
  render();
  showToast(`✕ Đã xóa "${task?.title ?? 'công việc'}"`, 'error');
}

function toggleTask(id) {
  const task = tasks.find(t => t.id === id);
  if (!task) return;
  task.done = !task.done;
  saveTasks();
  render();
  showToast(task.done ? '✓ Đã hoàn thành!' : '↩ Đã đánh dấu chưa xong');
}

/* ─────────────────────────────────────────────────────────────
   8. Validate form
───────────────────────────────────────────────────────────── */
function validateForm() {
  let ok = true;
  $errTitle.textContent = '';

  if (!$fieldTitle.value.trim()) {
    $errTitle.textContent = 'Tiêu đề không được để trống.';
    $fieldTitle.focus();
    ok = false;
  }

  return ok;
}

/* ─────────────────────────────────────────────────────────────
   9. Event listeners
───────────────────────────────────────────────────────────── */

/* 9A. Mở form thêm */
$btnOpenForm.addEventListener('click', () => openForm('add'));

/* 9B. Đóng form */
$btnCloseForm.addEventListener('click', closeForm);
$btnCancel.addEventListener('click', closeForm);

/* 9C. Click overlay đóng tất cả dialog */
$overlay.addEventListener('click', () => {
  closeForm();
  closeConfirmDialog();
});

/* 9D. Submit form thêm/sửa */
$taskForm.addEventListener('submit', e => {
  e.preventDefault();
  if (!validateForm()) return;

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

/* 9E. Sự kiện trong danh sách (delegation) */
$taskList.addEventListener('click', e => {
  const btn = e.target.closest('[data-action]');
  if (!btn) return;

  const id     = btn.dataset.id;
  const action = btn.dataset.action;

  if (action === 'edit') {
    const task = tasks.find(t => t.id === id);
    if (task) openForm('edit', task);
  }

  if (action === 'delete') {
    openConfirmDialog(id);
  }

  if (action === 'toggle') {
    toggleTask(id);
  }
});

/* 9F. Xác nhận xóa */
$btnConfirmOk.addEventListener('click', () => {
  if (pendingDeleteId) deleteTask(pendingDeleteId);
  closeConfirmDialog();
});

$btnConfirmCancel.addEventListener('click', closeConfirmDialog);

/* 9G. Phím ESC đóng dialog */
document.addEventListener('keydown', e => {
  if (e.key !== 'Escape') return;
  if ($taskDialog.classList.contains('open'))  closeForm();
  if ($confirmDialog.classList.contains('open')) closeConfirmDialog();
});

/* ─────────────────────────────────────────────────────────────
   10. Init
───────────────────────────────────────────────────────────── */
(function init() {
  loadTasks();
  render();
})();