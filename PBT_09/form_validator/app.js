// Map lưu trữ trạng thái kiểm tra của toàn bộ Form (Form Validity Ledger)
const formState = {
    fullName: false,
    email: false,
    password: false,
    confirmPassword: false,
    phone: false
};

// Truy vết nhanh tất cả các phần tử DOM phục vụ tính toán
const form = document.getElementById('registerForm');
const fullName = document.getElementById('fullName');
const email = document.getElementById('email');
const password = document.getElementById('password');
const confirmPassword = document.getElementById('confirmPassword');
const phone = document.getElementById('phone');
const submitBtn = document.getElementById('submitBtn');

// Các biểu tượng hiển thị
const nameStatus = document.getElementById('nameStatus');
const emailStatus = document.getElementById('emailStatus');
const confirmStatus = document.getElementById('confirmStatus');
const phoneStatus = document.getElementById('phoneStatus');

// Các khối đo lường mật khẩu
const strengthBar = document.getElementById('strengthBar');
const strengthText = document.getElementById('strengthText');

// Khối điều khiển Modal
const successModal = document.getElementById('successModal');
const modalBody = document.getElementById('modalBody');
const closeModalBtn = document.getElementById('closeModalBtn');

/**
 * Kiểm tra tổng quát trạng thái Form để Bật/Tắt (Enable/Disable) nút Đăng ký
 */
function validateFormToggle() {
    // Nếu tất cả các trường trong formState đều mang giá trị TRUE -> Kích hoạt nút
    const isFormValid = Object.values(formState).every(state => state === true);
    submitBtn.disabled = !isFormValid;
}

/**
 * Hàm tiện ích đặt giao diện của Group về trạng thái Hợp Lệ (VALID)
 */
function setValid(inputEl, statusIconEl) {
    const group = inputEl.closest('.form-group');
    group.classList.remove('invalid');
    group.classList.add('valid');
    if (statusIconEl) statusIconEl.textContent = '✅';
}

/**
 * Hàm tiện ích đặt giao diện của Group về trạng thái LỖI (INVALID)
 */
function setInvalid(inputEl, statusIconEl) {
    const group = inputEl.closest('.form-group');
    group.classList.remove('valid');
    group.classList.add('invalid');
    if (statusIconEl) statusIconEl.textContent = '❌';
}

// =========================================================================
// ĐĂNG KÝ CÁC SỰ KIỆN VALIDATE REAL-TIME (EVENT INPUT)
// =========================================================================

// 1. Validate Họ và Tên (Từ 2 đến 50 ký tự)
fullName.addEventListener('input', () => {
    const value = fullName.value.trim();
    if (value.length >= 2 && value.length <= 50) {
        setValid(fullName, nameStatus);
        formState.fullName = true;
    } else {
        setInvalid(fullName, nameStatus);
        formState.fullName = false;
    }
    validateFormToggle();
});

// 2. Validate Email (Sử dụng biểu thức chính quy Regex chuẩn W3C)
email.addEventListener('input', () => {
    const value = email.value.trim();
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
    if (emailRegex.test(value)) {
        setValid(email, emailStatus);
        formState.email = true;
    } else {
        setInvalid(email, emailStatus);
        formState.email = false;
    }
    validateFormToggle();
});

// 3. Phân tích độ mạnh Mật khẩu (Password Strength Meter)
password.addEventListener('input', () => {
    const value = password.value;
    
    // Nếu trống ô mật khẩu
    if (value.length === 0) {
        strengthBar.style.width = '0%';
        strengthBar.style.backgroundColor = 'transparent';
        strengthText.textContent = 'Chưa nhập mật khẩu';
        strengthText.style.color = 'var(--text-muted)';
        formState.password = false;
        
        // Chạy lại kiểm tra đối chiếu trùng khớp mật khẩu con
        checkConfirmPassword();
        validateFormToggle();
        return;
    }

    // Tiêu chí đo đạc
    const hasLetter = /[a-zA-Z]/.test(value);
    const hasNumber = /[0-9]/.test(value);
    const hasUpper = /[A-Z]/.test(value);
    const hasLower = /[a-z]/.test(value);
    const hasSpecial = /[^A-Za-z0-9]/.test(value);

    // Thuật toán gán điểm sức mạnh dựa trên đề bài
    if (value.length < 8) {
        // YẾU (ĐỎ): Dưới 8 ký tự
        strengthBar.style.width = '33%';
        strengthBar.style.backgroundColor = 'var(--color-invalid)';
        strengthText.textContent = 'Mật khẩu: Yếu (Độ dài < 8)';
        strengthText.style.color = 'var(--color-invalid)';
        formState.password = false; // Yếu thì không tính là valid để submit
    } else if (hasUpper && hasLower && hasNumber && hasSpecial) {
        // MẠNH (XANH): 8+ ký tự, đủ Hoa, thường, số, đặc biệt
        strengthBar.style.width = '100%';
        strengthBar.style.backgroundColor = 'var(--color-valid)';
        strengthText.textContent = 'Mật khẩu: Mạnh (An toàn)';
        strengthText.style.color = 'var(--color-valid)';
        formState.password = true;
    } else if (hasLetter && hasNumber) {
        // TRUNG BÌNH (VÀNG): 8+ ký tự, có chữ + số
        strengthBar.style.width = '66%';
        strengthBar.style.backgroundColor = 'var(--color-warning)';
        strengthText.textContent = 'Mật khẩu: Trung bình';
        strengthText.style.color = 'var(--color-warning)';
        formState.password = true;
    } else {
        // Trường hợp >= 8 ký tự nhưng thiếu chữ hoặc thiếu số (chỉ toàn số / toàn chữ) -> Tính là Yếu
        strengthBar.style.width = '33%';
        strengthBar.style.backgroundColor = 'var(--color-invalid)';
        strengthText.textContent = 'Mật khẩu: Yếu (Cần cả chữ và số)';
        strengthText.style.color = 'var(--color-invalid)';
        formState.password = false;
    }

    // Đồng bộ kiểm tra chéo luôn ô Confirm Password khi ô gốc thay đổi
    checkConfirmPassword();
    validateFormToggle();
});

// 4. Validate Khớp mật khẩu (Confirm Password)
function checkConfirmPassword() {
    const passVal = password.value;
    const confirmVal = confirmPassword.value;

    if (confirmVal.length > 0 && passVal === confirmVal && formState.password) {
        setValid(confirmPassword, confirmStatus);
        formState.confirmPassword = true;
    } else {
        setInvalid(confirmPassword, confirmStatus);
        formState.confirmPassword = false;
    }
}
confirmPassword.addEventListener('input', () => {
    checkConfirmPassword();
    validateFormToggle();
});

// 5. Định dạng Số điện thoại thông minh (Auto-masking: 0901-234-567)
phone.addEventListener('input', (e) => {
    // Bước 5.1: Lọc bỏ toàn bộ ký tự không phải là số
    let value = e.target.value.replace(/\D/g, '');
    
    // Giới hạn cứng tối đa 10 chữ số gốc
    if (value.length > 10) {
        value = value.substring(0, 10);
    }

    // Bước 5.2: Tự động chèn các dấu gạch ngang theo phân đoạn đề bài
    let formattedValue = '';
    if (value.length > 0) {
        formattedValue += value.substring(0, 4);
    }
    if (value.length > 4) {
        formattedValue += '-' + value.substring(4, 7);
    }
    if (value.length > 7) {
        formattedValue += '-' + value.substring(7, 10);
    }

    // Gán ngược lại chuỗi đã định dạng đẹp vào ô Input
    e.target.value = formattedValue;

    // Bước 5.3: Validate độ dài thực tế (đảm bảo đủ 10 số gốc)
    if (value.length === 10) {
        setValid(phone, phoneStatus);
        formState.phone = true;
    } else {
        setInvalid(phone, phoneStatus);
        formState.phone = false;
    }
    validateFormToggle();
});

// =========================================================================
// XỬ LÝ SỰ KIỆN SUBMIT FORM & POPUP CHI TIẾT
// =========================================================================

form.addEventListener('submit', (e) => {
    e.preventDefault(); // Ngăn chặn hành động tải lại trang mặc định

    // Xây dựng giao diện cấu trúc nội dung hiển thị thông tin đăng ký thành công
    modalBody.textContent = ''; // Clear trắng modal cũ

    const pName = document.createElement('p');
    pName.innerHTML = `👤 <strong>Họ tên:</strong> ${fullName.value.trim()}`;
    
    const pEmail = document.createElement('p');
    pEmail.innerHTML = `✉️ <strong>Email:</strong> ${email.value.trim()}`;
    
    const pPhone = document.createElement('p');
    pPhone.innerHTML = `📞 <strong>Số điện thoại:</strong> ${phone.value}`;

    modalBody.appendChild(pName);
    modalBody.appendChild(pEmail);
    modalBody.appendChild(pPhone);

    // Kích hoạt mở hiển thị Modal
    successModal.classList.add('open');
});

// Đăng ký sự kiện đóng modal và làm mới hoàn toàn trang web
closeModalBtn.addEventListener('click', () => {
    successModal.classList.remove('open');
    form.reset(); // Xóa sạch dữ liệu trong form
    
    // Đặt lại toàn bộ Map trạng thái về False
    Object.keys(formState).forEach(key => formState[key] = false);
    
    // Xóa tất cả các class giao diện cũ
    document.querySelectorAll('.form-group').forEach(group => {
        group.classList.remove('valid', 'invalid');
    });
    document.querySelectorAll('.status-icon').forEach(icon => {
        icon.textContent = '';
    });
    
    // Khôi phục thanh đo mật khẩu ban đầu
    strengthBar.style.width = '0%';
    strengthText.textContent = 'Chưa nhập mật khẩu';
    strengthText.style.color = 'var(--text-muted)';
    
    validateFormToggle();
});