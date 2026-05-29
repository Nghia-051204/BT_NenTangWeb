// Quản lý trạng thái ứng dụng (State Store)
let todos = JSON.parse(localStorage.getItem('todos')) || [];
let currentFilter = 'all';

// Truy vết các phần tử DOM cốt lõi
const todoInput = document.getElementById('todoInput');
const addBtn = document.getElementById('addBtn');
const todoList = document.getElementById('todoList');
const todoCount = document.getElementById('todoCount');
const clearCompletedBtn = document.getElementById('clearCompleted');
const filterButtons = document.querySelectorAll('.filter-btn');

/**
 * Đồng bộ hóa dữ liệu hiện hành vào LocalStorage
 */
function saveToStorage() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

/**
 * Hàm khởi dựng và render toàn bộ danh sách Todo sử dụng createElement độc quyền
 */
function render() {
    // Xóa sạch vùng chứa cũ mà KHÔNG dùng innerHTML để tối ưu hiệu năng bảo mật
    todoList.textContent = '';

    // Trích lọc phần tử theo bộ lọc trạng thái active
    const filteredTodos = todos.filter(todo => {
        if (currentFilter === 'active') return !todo.completed;
        if (currentFilter === 'completed') return todo.completed;
        return true; // tất cả ('all')
    });

    // Vòng lặp dựng cấu trúc cây DOM cho từng phần tử
    filteredTodos.forEach(todo => {
        const li = document.createElement('li');
        li.dataset.id = todo.id;
        if (todo.completed) {
            li.classList.add('completed');
        }

        // Tạo nhãn hiển thị nội dung công việc
        const spanText = document.createElement('span');
        spanText.className = 'todo-text';
        spanText.textContent = todo.text;

        // Tạo ô nhập liệu phục vụ chế độ chỉnh sửa (Edit Mode)
        const inputEdit = document.createElement('input');
        inputEdit.type = 'text';
        inputEdit.className = 'edit-input';
        inputEdit.value = todo.text;

        // Tạo nút bấm xóa nhiệm vụ
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'destroy-btn';
        deleteBtn.textContent = '❌';

        // Lắp ráp cây thư mục con vào khối thẻ <li>
        li.appendChild(spanText);
        li.appendChild(inputEdit);
        li.appendChild(deleteBtn);

        // Đẩy thẻ li hoàn tất vào vùng hiển thị danh sách chung
        todoList.appendChild(li);
    });

    // Cập nhật bộ đếm số lượng công việc còn lại chưa hoàn thành
    const activeCount = todos.filter(t => !t.completed).length;
    todoCount.textContent = `${activeCount} mục chưa làm`;
}

/**
 * Hàm xử lý thêm một Todo mới vào mảng dữ liệu
 */
function addTodo() {
    const textValue = todoInput.value.trim();
    if (textValue === '') return;

    const newTodo = {
        id: Date.now().toString(), // Tạo mã nhận diện ID độc nhất bằng timestamp
        text: textValue,
        completed: false
    };

    todos.push(newTodo);
    saveToStorage();
    todoInput.value = ''; // Làm sạch thanh nhập liệu ban đầu
    render();
}

// =========================================================================
// ĐĂNG KÝ CÁC SỰ KIỆN TƯƠNG TÁC (NO INLINE ONCLICK)
// =========================================================================

// Sự kiện bấm nút "Thêm" hoặc nhấn "Enter" tại ô điền text chính
addBtn.addEventListener('click', addTodo);
todoInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        addTodo();
    }
});

// --- BIỂU DIỄN KỸ THUẬT EVENT DELEGATION (RÀNG BUỘC TOÀN BỘ LÊN CHA #todoList) ---
todoList.addEventListener('click', (e) => {
    const target = e.target;
    const li = target.closest('li');
    if (!li) return;
    const id = li.dataset.id;

    // Trường hợp 1: Nhấp chuột vào Text -> Chuyển đổi trạng thái đóng/mở hoàn thành (Toggle)
    if (target.classList.contains('todo-text')) {
        todos = todos.map(todo => 
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
        );
        saveToStorage();
        render();
    }

    // Trường hợp 2: Nhấp chuột vào icon ❌ -> Tiến hành xóa tác vụ
    if (target.classList.contains('destroy-btn')) {
        todos = todos.filter(todo => todo.id !== id);
        saveToStorage();
        render();
    }
});

// Đón chặn sự kiện Double-Click trên danh sách để kích hoạt chế độ Sửa (Edit)
todoList.addEventListener('dblclick', (e) => {
    const target = e.target;
    if (target.classList.contains('todo-text')) {
        const li = target.closest('li');
        li.classList.add('editing');
        
        const inputEdit = li.querySelector('.edit-input');
        inputEdit.focus();
        // Đặt con trỏ chuột ở cuối chuỗi chữ khi focus vào
        const val = inputEdit.value;
        inputEdit.value = '';
        inputEdit.value = val;
    }
});

// Đón chặn sự kiện Lưu thông tin chỉnh sửa khi nhấn Enter bên trong ô Edit Input
todoList.addEventListener('keydown', (e) => {
    const target = e.target;
    if (target.classList.contains('edit-input') && e.key === 'Enter') {
        const li = target.closest('li');
        const id = li.dataset.id;
        const finalValue = target.value.trim();

        if (finalValue === '') {
            // Nếu xóa trắng chữ, coi như hành động xóa bỏ vật phẩm
            todos = todos.filter(todo => todo.id !== id);
        } else {
            todos = todos.map(todo => 
                todo.id === id ? { ...todo, text: finalValue } : todo
            );
        }
        
        saveToStorage();
        li.classList.remove('editing');
        render();
    }
    
    // Nếu bấm nút Escape -> Hủy bỏ phiên sửa đổi dữ liệu, giữ nguyên hiện trạng
    if (target.classList.contains('edit-input') && e.key === 'Escape') {
        const li = target.closest('li');
        li.classList.remove('editing');
        render();
    }
});

// Xử lý mất tiêu điểm (Blur) khi nhấn chuột ra ngoài vùng sửa đổi thì tự đóng form lưu lại
todoList.addEventListener('focusout', (e) => {
    const target = e.target;
    if (target.classList.contains('edit-input')) {
        const li = target.closest('li');
        if (li.classList.contains('editing')) {
            const id = li.dataset.id;
            const finalValue = target.value.trim();
            
            if (finalValue !== '') {
                todos = todos.map(todo => todo.id === id ? { ...todo, text: finalValue } : todo);
                saveToStorage();
            }
            li.classList.remove('editing');
            render();
        }
    }
}, true); // Dùng true (capture phase) vì focusout/blur không có cơ chế nổi bọt (bubbling) thông thường


// --- ĐĂNG KÝ SỰ KIỆN CHO CÁC NÚT BỘ LỌC (FILTER CHIPS) ---
filterButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
        // Gỡ bỏ class active cũ và gán sang nút vừa click
        filterButtons.forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');

        currentFilter = e.target.dataset.filter;
        render();
    });
});

// --- SỰ KIỆN XÓA TOÀN BỘ CÁC MỤC ĐÃ HOÀN THÀNH ---
clearCompletedBtn.addEventListener('click', () => {
    todos = todos.filter(todo => !todo.completed);
    saveToStorage();
    render();
});

// Lệnh thực thi kết xuất giao diện ban đầu khi nạp trang (F5)
render();