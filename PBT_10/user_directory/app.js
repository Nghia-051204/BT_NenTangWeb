/**
 * 1. API LAYER: Quản lý toàn bộ cổng kết nối và các tác vụ mạng HTTP Request.
 */
const api = {
    baseURL: "https://jsonplaceholder.typicode.com",

    async _handleFetch(url, options = {}) {
        const response = await fetch(`${this.baseURL}${url}`, options);
        if (!response.ok) {
            throw new Error(`Lỗi máy chủ: HTTP ${response.status}`);
        }
        return await response.json();
    },

    async getUsers() {
        return this._handleFetch("/users");
    },

    async getUser(id) {
        return this._handleFetch(`/users/${id}`);
    },

    async createUser(data) {
        return this._handleFetch("/users", {
            method: "POST",
            body: JSON.stringify(data),
            headers: { "Content-type": "application/json; charset=UTF-8" }
        });
    },

    async updateUser(id, data) {
        return this._handleFetch(`/users/${id}`, {
            method: "PUT",
            body: JSON.stringify(data),
            headers: { "Content-type": "application/json; charset=UTF-8" }
        });
    },

    async deleteUser(id) {
        return this._handleFetch(`/users/${id}`, {
            method: "DELETE"
        });
    }
};

/**
 * 2. UI LAYER: Chịu trách nhiệm trực tiếp thao túng DOM và hiển thị trạng thái phần cứng.
 */
const ui = {
    userGrid: document.getElementById("userGrid"),
    toastContainer: document.getElementById("toastContainer"),

    renderUsers(users) {
        this.userGrid.innerHTML = "";
        if (users.length === 0) {
            this.userGrid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 2rem;">Không tìm thấy thành viên phù hợp.</div>`;
            return;
        }

        users.forEach(user => {
            const card = document.createElement("div");
            card.className = "user-card";
            card.setAttribute("data-id", user.id);
            card.innerHTML = `
                <div class="card-body">
                    <h3>${user.name}</h3>
                    <p><strong>Email:</strong> ${user.email}</p>
                    <p><strong>Phone:</strong> ${user.phone}</p>
                    <p><strong>Company:</strong> ${user.company?.name || user.company || "N/A"}</p>
                </div>
                <div class="card-actions">
                    <button class="btn btn-sm btn-edit" onclick="controller.handleEditClick(${user.id})">Sửa</button>
                    <button class="btn btn-sm btn-delete" onclick="controller.handleDeleteClick(${user.id})">Xóa</button>
                </div>
            `;
            this.userGrid.appendChild(card);
        });
    },

    showLoading() {
        this.userGrid.innerHTML = "";
        for (let i = 0; i < 6; i++) {
            const skeleton = document.createElement("div");
            skeleton.className = "skeleton-card";
            skeleton.innerHTML = `
                <div class="skeleton-line" style="width: 70%; height: 24px; margin-bottom: 1rem;"></div>
                <div class="skeleton-line" style="width: 90%; height: 16px;"></div>
                <div class="skeleton-line" style="width: 60%; height: 16px;"></div>
                <div class="skeleton-line" style="width: 80%; height: 16px; margin-bottom: 1.5rem;"></div>
                <div class="skeleton-line" style="width: 40%; height: 32px; float: right; border-radius: 6px;"></div>
            `;
            this.userGrid.appendChild(skeleton);
        }
    },

    hideLoading() {
        // Tự động giải phóng khi renderUsers() viết đè nội dung mới vào innerHTML
    },

    showToast(message, type = "success") {
        const toast = document.createElement("div");
        toast.className = `toast ${type}`;
        toast.textContent = message;
        
        this.toastContainer.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = "slideIn 0.3s ease-in reverse forwards";
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    },

    showError(message) {
        this.showToast(message, "error");
    },

    showSuccess(message) {
        this.showToast(message, "success");
    }
};

/**
 * 3. CONTROLLER LAYER: Bộ não kết nối điều phối, giữ trạng thái ứng dụng (AppState).
 */
const state = {
    users: [],
    modalMode: "create" // "create" hoặc "update"
};

const dom = {
    modal: document.getElementById("userModal"),
    form: document.getElementById("userForm"),
    modalTitle: document.getElementById("modalTitle"),
    openCreateModalBtn: document.getElementById("openCreateModalBtn"),
    closeModalBtn: document.getElementById("closeModalBtn"),
    cancelModalBtn: document.getElementById("cancelModalBtn"),
    searchInput: document.getElementById("searchInput"),
    
    // Form fields
    idField: document.getElementById("userIdField"),
    nameField: document.getElementById("userName"),
    emailField: document.getElementById("userEmail"),
    phoneField: document.getElementById("userPhone"),
    companyField: document.getElementById("userCompany")
};

const controller = {
    async init() {
        this.bindEvents();
        await this.loadInitialUsers();
    },

    bindEvents() {
        // Sự kiện đóng/mở Modal
        dom.openCreateModalBtn.addEventListener("click", () => this.openModal("create"));
        dom.closeModalBtn.addEventListener("click", () => this.closeModal());
        dom.cancelModalBtn.addEventListener("click", () => this.closeModal());
        
        // Form submission
        dom.form.addEventListener("submit", (e) => this.handleFormSubmit(e));
        
        // Search Filter (Client-side)
        dom.searchInput.addEventListener("input", (e) => this.handleSearch(e));
    },

    async loadInitialUsers() {
        ui.showLoading();
        try {
            state.users = await api.getUsers();
            ui.renderUsers(state.users);
        } catch (error) {
            ui.showError("Không thể tải danh sách thành viên!");
            console.error(error);
        }
    },

    handleSearch(e) {
        const keyword = e.target.value.toLowerCase().trim();
        const filtered = state.users.filter(user => 
            user.name.toLowerCase().includes(keyword) || 
            user.email.toLowerCase().includes(keyword)
        );
        ui.renderUsers(filtered);
    },

    openModal(mode, user = null) {
        state.modalMode = mode;
        dom.form.reset();
        dom.idField.value = "";
        
        if (mode === "create") {
            dom.modalTitle.textContent = "Thêm thành viên mới";
        } else if (mode === "update" && user) {
            dom.modalTitle.textContent = "Cập nhật thông tin thành viên";
            dom.idField.value = user.id;
            dom.nameField.value = user.name;
            dom.emailField.value = user.email;
            dom.phoneField.value = user.phone;
            dom.companyField.value = user.company?.name || user.company || "";
        }
        dom.modal.classList.add("active");
    },

    closeModal() {
        dom.modal.classList.remove("active");
    },

    async handleFormSubmit(e) {
        e.preventDefault();
        
        const payload = {
            name: dom.nameField.value,
            email: dom.emailField.value,
            phone: dom.phoneField.value,
            company: { name: dom.companyField.value }
        };

        try {
            if (state.modalMode === "create") {
                const newUser = await api.createUser(payload);
                // Tạo ID tạm tránh đụng hàng trên Local State nếu API trả về trùng ID 11
                newUser.id = state.users.length > 0 ? Math.max(...state.users.map(u => u.id)) + 1 : 11;
                
                state.users.unshift(newUser); // Thêm lên đầu danh sách
                ui.showSuccess("Thêm mới thành viên thành công!");
            } else {
                const id = parseInt(dom.idField.value);
                await api.updateUser(id, payload);
                
                // Đồng bộ hóa dữ liệu vào Local AppState Cache
                const index = state.users.findIndex(u => u.id === id);
                if (index !== -1) {
                    state.users[index] = { ...state.users[index], ...payload, id };
                }
                ui.showSuccess("Cập nhật thông tin thành công!");
            }
            
            this.closeModal();
            // Reset thanh tìm kiếm về rỗng để hiển thị đầy đủ danh sách mới cập nhật
            dom.searchInput.value = ""; 
            ui.renderUsers(state.users);
        } catch (error) {
            ui.showError("Thao tác thất bại. Vui lòng thử lại!");
            console.error(error);
        }
    },

    async handleEditClick(id) {
        const user = state.users.find(u => u.id === id);
        if (user) {
            this.openModal("update", user);
        }
    },

    async handleDeleteClick(id) {
        const user = state.users.find(u => u.id === id);
        if (!user) return;

        const confirmDelete = confirm(`Bạn có chắc chắn muốn xóa thành viên "${user.name}" không?`);
        if (!confirmDelete) return;

        try {
            await api.deleteUser(id);
            // Xóa phần tử khỏi mảng dữ liệu local state
            state.users = state.users.filter(u => u.id !== id);
            
            ui.showSuccess("Xóa thành viên thành công!");
            ui.renderUsers(state.users);
        } catch (error) {
            ui.showError("Không thể xóa thành viên lúc này!");
            console.error(error);
        }
    }
};

// Đính kèm bộ điều hướng vào đối tượng window để phục vụ các sự kiện inline `onclick` trên các nút Card
window.controller = controller;

// Kích hoạt chạy toàn bộ ứng dụng sau khi tệp mã nguồn tải xong
document.addEventListener("DOMContentLoaded", () => controller.init());