const STORAGE_KEY = 'edu_students_v2';
const PAGE_SIZE = 10;

let students = [];
let editingId = null;
let deleteTargetId = null;
let currentPage = 1;
let sortCol = 'name';
let sortDir = 1;
let filterSearch = '';
let filterClass = '';
let filterGpa = '';

// ── Seed data ──
const SEED = [
    { id: uid(), msv: 'SV2024001', name: 'Nguyễn Thị Lan Anh', dob: '2003-04-12', cls: 'CNTT2024A', gpa: 9.2, email: 'lananh@university.edu.vn' },
    { id: uid(), msv: 'SV2024002', name: 'Trần Minh Khôi', dob: '2002-11-05', cls: 'CNTT2024A', gpa: 7.8, email: 'minhkhoi@university.edu.vn' },
    { id: uid(), msv: 'SV2024003', name: 'Lê Quốc Bảo', dob: '2003-07-22', cls: 'CNTT2024B', gpa: 6.3, email: 'quocbao@university.edu.vn' },
    { id: uid(), msv: 'SV2024004', name: 'Phạm Thu Hương', dob: '2002-09-15', cls: 'CNTT2024A', gpa: 8.5, email: 'thuphuong@university.edu.vn' },
    { id: uid(), msv: 'SV2024005', name: 'Võ Đình Dũng', dob: '2003-01-30', cls: 'CNTT2024B', gpa: 4.8, email: 'dinhdung@university.edu.vn' },
    { id: uid(), msv: 'SV2024006', name: 'Hoàng Ngọc Mai', dob: '2002-06-18', cls: 'KTPM2024A', gpa: 9.5, email: 'ngocmai@university.edu.vn' },
    { id: uid(), msv: 'SV2024007', name: 'Đặng Văn Tùng', dob: '2003-03-08', cls: 'KTPM2024A', gpa: 7.1, email: 'vantung@university.edu.vn' },
    { id: uid(), msv: 'SV2024008', name: 'Bùi Thị Minh Châu', dob: '2002-12-25', cls: 'KTPM2024B', gpa: 5.6, email: 'minhchau@university.edu.vn' },
];

function uid() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

// ── Load/Save ──
function load() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        students = raw ? JSON.parse(raw) : [...SEED];
    } catch { students = [...SEED]; }
}
function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
}

// ── Stats ──
function updateStats() {
    const total = students.length;
    const gpas = students.map(s => parseFloat(s.gpa) || 0);
    const avg = total ? (gpas.reduce((a, b) => a + b, 0) / total) : null;
    const good = students.filter(s => (parseFloat(s.gpa) || 0) >= 8.0).length;
    const weak = students.filter(s => (parseFloat(s.gpa) || 0) < 5.0).length;
    document.getElementById('stat-total').textContent = total;
    document.getElementById('stat-avg').textContent = avg !== null ? avg.toFixed(2) : '—';
    document.getElementById('stat-good').textContent = good;
    document.getElementById('stat-weak').textContent = weak;
}

// ── Class filter options ──
function updateClassFilter() {
    const sel = document.getElementById('filter-class');
    const current = sel.value;
    const classes = [...new Set(students.map(s => s.cls).filter(Boolean))].sort();
    sel.innerHTML = '<option value="">Tất cả lớp</option>' +
        classes.map(c => `<option value="${esc(c)}" ${c === current ? 'selected' : ''}>${esc(c)}</option>`).join('');
}

// ── GPA label ──
function gpaLabel(gpa) {
    const g = parseFloat(gpa);
    if (isNaN(g)) return { text: '—', cls: '' };
    if (g >= 9.0) return { text: g.toFixed(1) + ' — Xuất sắc', cls: 'gpa-excellent' };
    if (g >= 8.0) return { text: g.toFixed(1) + ' — Giỏi', cls: 'gpa-excellent' };
    if (g >= 6.5) return { text: g.toFixed(1) + ' — Khá', cls: 'gpa-good' };
    if (g >= 5.0) return { text: g.toFixed(1) + ' — TB', cls: 'gpa-average' };
    return { text: g.toFixed(1) + ' — Yếu', cls: 'gpa-poor' };
}

function gpaCategory(gpa) {
    const g = parseFloat(gpa);
    if (isNaN(g)) return '';
    if (g >= 9.0) return 'excellent';
    if (g >= 8.0) return 'good';
    if (g >= 6.5) return 'fair';
    if (g >= 5.0) return 'average';
    return 'poor';
}

function avatarInitials(name) {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    return name.slice(0, 2).toUpperCase();
}
const AVATAR_CLASSES = ['a', 'b', 'c', 'd', '', ''];
function avatarClass(id) {
    const h = id.charCodeAt(0) % AVATAR_CLASSES.length;
    return AVATAR_CLASSES[h];
}

function esc(str) {
    return String(str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function formatDate(d) {
    if (!d) return '—';
    const [y, m, dd] = d.split('-');
    return dd && m && y ? `${dd}/${m}/${y}` : d;
}

// ── Filter & Sort ──
function getFiltered() {
    let list = [...students];
    if (filterSearch) {
        const q = filterSearch.toLowerCase();
        list = list.filter(s =>
            s.name.toLowerCase().includes(q) ||
            s.msv.toLowerCase().includes(q) ||
            (s.email || '').toLowerCase().includes(q)
        );
    }
    if (filterClass) list = list.filter(s => s.cls === filterClass);
    if (filterGpa) list = list.filter(s => gpaCategory(s.gpa) === filterGpa);
    list.sort((a, b) => {
        let va = a[sortCol] || '', vb = b[sortCol] || '';
        if (sortCol === 'gpa') { va = parseFloat(va) || 0; vb = parseFloat(vb) || 0; }
        if (va < vb) return -sortDir;
        if (va > vb) return sortDir;
        return 0;
    });
    return list;
}

// ── Render ──
function render() {
    const filtered = getFiltered();
    const total = filtered.length;
    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
    if (currentPage > totalPages) currentPage = totalPages;
    const start = (currentPage - 1) * PAGE_SIZE;
    const page = filtered.slice(start, start + PAGE_SIZE);

    const tbody = document.getElementById('student-tbody');
    document.getElementById('table-count').textContent = total;

    if (page.length === 0) {
        tbody.innerHTML = `<tr class="empty-row"><td colspan="8">
        <div class="empty-icon">📋</div>
        <div class="empty-text">${filterSearch || filterClass || filterGpa ? 'Không tìm thấy sinh viên phù hợp' : 'Chưa có sinh viên nào. Nhấn "Thêm sinh viên" để bắt đầu!'}</div>
      </td></tr>`;
    } else {
        tbody.innerHTML = page.map((s, i) => {
            const g = gpaLabel(s.gpa);
            return `<tr>
          <td class="muted" style="font-size:0.78rem">${start + i + 1}</td>
          <td><code style="font-size:0.8rem;background:var(--surface-2);padding:2px 8px;border-radius:5px;font-family:monospace">${esc(s.msv)}</code></td>
          <td>
            <div class="student-cell">
              <div class="avatar ${avatarClass(s.id)}">${esc(avatarInitials(s.name))}</div>
              <div>
                <div class="student-name">${esc(s.name)}</div>
              </div>
            </div>
          </td>
          <td class="muted">${formatDate(s.dob)}</td>
          <td><span style="font-size:0.82rem;background:var(--surface-3);padding:3px 10px;border-radius:20px;font-weight:500">${esc(s.cls)}</span></td>
          <td>${g.cls ? `<span class="gpa-badge ${g.cls}">${esc(g.text)}</span>` : '—'}</td>
          <td class="muted" style="font-size:0.82rem">${s.email ? `<a href="mailto:${esc(s.email)}" style="color:var(--accent);text-decoration:none">${esc(s.email)}</a>` : '—'}</td>
          <td>
            <div class="actions-cell" style="justify-content:center">
              <button class="btn btn-edit" onclick="openEdit('${s.id}')">
                <svg fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" style="width:13px;height:13px"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                Sửa
              </button>
              <button class="btn btn-delete" onclick="openDelete('${s.id}')">
                <svg fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" style="width:13px;height:13px"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/></svg>
                Xóa
              </button>
            </div>
          </td>
        </tr>`;
        }).join('');
    }

    // Pagination
    const pg = document.getElementById('pagination');
    const pgInfo = document.getElementById('pagination-info');
    const pgBtns = document.getElementById('page-btns');
    document.getElementById('page-info').textContent = total > 0 ? `Hiển thị ${start + 1}–${Math.min(start + PAGE_SIZE, total)} / ${total}` : '';
    if (totalPages > 1) {
        pg.style.display = 'flex';
        pgInfo.textContent = `Trang ${currentPage} / ${totalPages}`;
        pgBtns.innerHTML = '';
        const makeBtn = (label, p, disabled, active) => {
            const b = document.createElement('button');
            b.className = 'page-btn' + (active ? ' active' : '');
            b.textContent = label;
            b.disabled = disabled;
            if (!disabled) b.onclick = () => { currentPage = p; render(); };
            return b;
        };
        pgBtns.appendChild(makeBtn('‹', currentPage - 1, currentPage === 1, false));
        for (let p = 1; p <= totalPages; p++) {
            if (totalPages <= 7 || p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1) {
                pgBtns.appendChild(makeBtn(p, p, false, p === currentPage));
            } else if (Math.abs(p - currentPage) === 2) {
                const sp = document.createElement('span');
                sp.textContent = '…';
                sp.style.cssText = 'padding:0 4px;color:var(--text-3);display:flex;align-items:center';
                pgBtns.appendChild(sp);
            }
        }
        pgBtns.appendChild(makeBtn('›', currentPage + 1, currentPage === totalPages, false));
    } else {
        pg.style.display = 'none';
    }

    // Sort icons
    document.querySelectorAll('th.sort-col').forEach(th => {
        th.classList.toggle('active', th.dataset.col === sortCol);
        const icon = th.querySelector('.sort-icon');
        if (icon) icon.textContent = th.dataset.col === sortCol ? (sortDir === 1 ? '↑' : '↓') : '↕';
    });

    updateStats();
    updateClassFilter();
}

// ── Modal ──
function openAdd() {
    editingId = null;
    document.getElementById('modal-title').textContent = 'Thêm sinh viên mới';
    document.getElementById('modal-subtitle').textContent = 'Điền đầy đủ thông tin sinh viên';
    document.getElementById('btn-save').innerHTML = `<svg fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" style="width:15px;height:15px"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg> Lưu sinh viên`;
    clearForm();
    clearErrors();
    document.getElementById('modal-backdrop').classList.add('active');
    setTimeout(() => document.getElementById('f-msv').focus(), 100);
}

function openEdit(id) {
    const s = students.find(x => x.id === id);
    if (!s) return;
    editingId = id;
    document.getElementById('modal-title').textContent = 'Cập nhật sinh viên';
    document.getElementById('modal-subtitle').textContent = `Đang chỉnh sửa: ${s.name}`;
    document.getElementById('btn-save').innerHTML = `<svg fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" style="width:15px;height:15px"><polyline points="20 6 9 17 4 12"/></svg> Cập nhật`;
    document.getElementById('f-msv').value = s.msv || '';
    document.getElementById('f-name').value = s.name || '';
    document.getElementById('f-dob').value = s.dob || '';
    document.getElementById('f-class').value = s.cls || '';
    document.getElementById('f-gpa').value = s.gpa !== undefined ? s.gpa : '';
    document.getElementById('f-email').value = s.email || '';
    clearErrors();
    document.getElementById('modal-backdrop').classList.add('active');
    setTimeout(() => document.getElementById('f-name').focus(), 100);
}

function closeModal() {
    document.getElementById('modal-backdrop').classList.remove('active');
    editingId = null;
}

function clearForm() {
    ['f-msv', 'f-name', 'f-dob', 'f-class', 'f-gpa', 'f-email'].forEach(id => {
        document.getElementById(id).value = '';
    });
}

function clearErrors() {
    ['e-msv', 'e-name', 'e-class', 'e-gpa', 'e-email'].forEach(id => {
        document.getElementById(id).textContent = '';
    });
    ['f-msv', 'f-name', 'f-class', 'f-gpa'].forEach(id => {
        document.getElementById(id).classList.remove('error');
    });
}

// ── Validation ──
function validate() {
    let ok = true;
    clearErrors();
    const msv = document.getElementById('f-msv').value.trim();
    const name = document.getElementById('f-name').value.trim();
    const cls = document.getElementById('f-class').value.trim();
    const gpa = document.getElementById('f-gpa').value.trim();
    const email = document.getElementById('f-email').value.trim();

    if (!msv) { setErr('e-msv', 'f-msv', 'Vui lòng nhập mã sinh viên'); ok = false; }
    else if (students.some(s => s.msv === msv && s.id !== editingId)) {
        setErr('e-msv', 'f-msv', 'Mã sinh viên đã tồn tại'); ok = false;
    }
    if (!name) { setErr('e-name', 'f-name', 'Vui lòng nhập họ và tên'); ok = false; }
    if (!cls) { setErr('e-class', 'f-class', 'Vui lòng nhập lớp học'); ok = false; }
    if (gpa === '') { setErr('e-gpa', 'f-gpa', 'Vui lòng nhập điểm trung bình'); ok = false; }
    else {
        const g = parseFloat(gpa);
        if (isNaN(g) || g < 0 || g > 10) { setErr('e-gpa', 'f-gpa', 'Điểm phải từ 0 đến 10'); ok = false; }
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setErr('e-email', 'f-email', 'Email không hợp lệ'); ok = false;
    }
    return ok;
}

function setErr(errId, inputId, msg) {
    document.getElementById(errId).textContent = msg;
    document.getElementById(inputId).classList.add('error');
}

// ── Submit ──
function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    const s = {
        msv: document.getElementById('f-msv').value.trim(),
        name: document.getElementById('f-name').value.trim(),
        dob: document.getElementById('f-dob').value,
        cls: document.getElementById('f-class').value.trim(),
        gpa: parseFloat(document.getElementById('f-gpa').value),
        email: document.getElementById('f-email').value.trim(),
    };
    if (editingId) {
        const idx = students.findIndex(x => x.id === editingId);
        if (idx !== -1) { students[idx] = { ...students[idx], ...s }; }
        save(); render(); closeModal();
        toast('Cập nhật sinh viên thành công!', 'success');
    } else {
        students.push({ id: uid(), ...s });
        currentPage = Math.ceil(students.length / PAGE_SIZE);
        save(); render(); closeModal();
        toast('Thêm sinh viên thành công!', 'success');
    }
}

// ── Delete ──
function openDelete(id) {
    deleteTargetId = id;
    const s = students.find(x => x.id === id);
    document.getElementById('confirm-msg').textContent =
        `Bạn có chắc muốn xóa sinh viên "${s ? s.name : ''}" (${s ? s.msv : ''})? Hành động này không thể hoàn tác.`;
    document.getElementById('confirm-backdrop').classList.add('active');
}

function closeConfirm() {
    document.getElementById('confirm-backdrop').classList.remove('active');
    deleteTargetId = null;
}

function confirmDelete() {
    if (!deleteTargetId) return;
    const s = students.find(x => x.id === deleteTargetId);
    students = students.filter(x => x.id !== deleteTargetId);
    const total = getFiltered().length;
    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
    if (currentPage > totalPages) currentPage = totalPages;
    save(); render(); closeConfirm();
    toast(`Đã xóa sinh viên ${s ? s.name : ''}`, 'warning');
}

// ── Toast ──
function toast(msg, type = 'success') {
    const icons = { success: '✅', error: '❌', warning: '🗑️', info: 'ℹ️' };
    const el = document.createElement('div');
    el.className = `toast ${type}`;
    el.innerHTML = `<span class="toast-icon">${icons[type] || '✅'}</span><span>${msg}</span>`;
    document.getElementById('toast-container').appendChild(el);
    setTimeout(() => {
        el.style.animation = 'slideOut 0.3s ease forwards';
        setTimeout(() => el.remove(), 300);
    }, 3000);
}

// ── Events ──
document.getElementById('btn-add').onclick = openAdd;
document.getElementById('modal-close').onclick = closeModal;
document.getElementById('btn-cancel').onclick = closeModal;
document.getElementById('student-form').onsubmit = handleSubmit;
document.getElementById('btn-save').onclick = handleSubmit;
document.getElementById('confirm-cancel').onclick = closeConfirm;
document.getElementById('confirm-ok').onclick = confirmDelete;

document.getElementById('modal-backdrop').addEventListener('click', e => {
    if (e.target === document.getElementById('modal-backdrop')) closeModal();
});
document.getElementById('confirm-backdrop').addEventListener('click', e => {
    if (e.target === document.getElementById('confirm-backdrop')) closeConfirm();
});

document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
        if (document.getElementById('confirm-backdrop').classList.contains('active')) closeConfirm();
        else if (document.getElementById('modal-backdrop').classList.contains('active')) closeModal();
    }
});

document.getElementById('search-input').oninput = e => {
    filterSearch = e.target.value; currentPage = 1; render();
};
document.getElementById('filter-class').onchange = e => {
    filterClass = e.target.value; currentPage = 1; render();
};
document.getElementById('filter-gpa').onchange = e => {
    filterGpa = e.target.value; currentPage = 1; render();
};

document.querySelectorAll('th.sort-col').forEach(th => {
    th.onclick = () => {
        if (sortCol === th.dataset.col) sortDir *= -1;
        else { sortCol = th.dataset.col; sortDir = 1; }
        render();
    };
});

// ── Init ──
load();
render();