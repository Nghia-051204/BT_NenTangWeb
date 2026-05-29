// =========================================================================
// 1. DATA RESOURCE POOL
// =========================================================================
const images = [
    { id: 1, title: "Kỳ Quan Núi Đá Phú Sĩ", url: "https://picsum.photos/id/10/800/600", desc: "Ảnh phong cảnh góc rộng chụp núi Phú Sĩ tuyết phủ mờ." },
    { id: 2, title: "Sương Mờ Rừng Thông", url: "https://picsum.photos/id/28/800/600", desc: "Con đường uốn lượn xuyên qua rừng thông già buổi sớm." },
    { id: 3, title: "Bờ Biển Sóng Vỗ", url: "https://picsum.photos/id/36/800/600", desc: "Bãi đá hoang sơ đón nhận đợt bọt sóng biển dạt dào." },
    { id: 4, title: "Hoang Mạc Cát Đỏ", url: "https://picsum.photos/id/48/800/600", desc: "Ánh mặt trời gay gắt trải dài trên đồi cát đỏ rực rỡ." },
    { id: 5, title: "Kiến Trúc Đô Thị Cao Tầng", url: "https://picsum.photos/id/54/800/600", desc: "Tòa nhà chọc trời bằng kính phản chiếu mây xanh." },
    { id: 6, title: "Thung Lũng Hoa Thuỷ Tiên", url: "https://picsum.photos/id/63/800/600", desc: "Cánh đồng hoa dại nở rộ trải rộng chân núi." },
    { id: 7, title: "Hồ Nước Đóng Băng", url: "https://picsum.photos/id/76/800/600", desc: "Vết rạn nứt nghệ thuật bên trên bề mặt mặt hồ lạnh giá." },
    { id: 8, title: "Ngọn Hải Đăng Cổ Kính", url: "https://picsum.photos/id/84/800/600", desc: "Ngọn tháp kiên cố đứng vững trước tâm bão đại dương." },
    { id: 9, title: "Mùa Thu Lá Phong Vàng", url: "https://picsum.photos/id/96/800/600", desc: "Tán cây chuyển sắc đỏ vàng lãng mạn góc công viên." }
];

const systemCommands = [
    { id: "toggle-theme", text: "Giao diện: Chuyển đổi Dark/Light Mode", shortcut: "Lệnh" },
    { id: "play-slideshow", text: "Slideshow: Kích hoạt chạy tự động", shortcut: "Space" },
    { id: "pause-slideshow", text: "Slideshow: Dừng tiến trình chạy tự động", shortcut: "Space" },
    { id: "open-first", text: "Thư viện: Mở hình ảnh số 1 đầu tiên", shortcut: "1" },
    { id: "close-all", text: "Hệ thống: Đóng toàn bộ các cửa sổ ẩn", shortcut: "Esc" }
];

// Trạng thái ứng dụng (System Core State Store)
const state = {
    currentIndex: 0,
    isModalOpen: false,
    isPaletteOpen: false,
    slideshowInterval: null,
    selectedCommandIndex: 0,
    filteredCommands: [...systemCommands]
};

// Truy vết Dom Elements
const galleryGrid = document.getElementById('galleryGrid');
const galleryModal = document.getElementById('galleryModal');
const commandPalette = document.getElementById('commandPalette');
const modalMainImage = document.getElementById('modalMainImage');
const modalCaption = document.getElementById('modalCaption');
const slideshowStatus = document.getElementById('slideshowStatus');
const paletteInput = document.getElementById('paletteInput');
const commandList = document.getElementById('commandList');

// Ghi lại Element giữ tiêu điểm trước khi mở Modal nhằm phục hồi sau này
let elementFocusedBeforeModal = null;

// =========================================================================
// 2. KHỞI TẠO VÀ RENDER PHẦN TỬ (ACCESSIBILITY FIRST)
// =========================================================================

function initGallery() {
    images.forEach((img, idx) => {
        const item = document.createElement('div');
        item.className = 'gallery-item';
        item.setAttribute('role', 'button');
        item.setAttribute('tabindex', '0'); // Cho phép Tab tìm thấy tiêu điểm tự nhiên
        item.setAttribute('aria-label', `Hình ảnh số ${img.id}: ${img.title}. Nhấn Enter để phóng to.`);

        const image = document.createElement('img');
        image.src = img.url;
        image.alt = img.desc;

        const info = document.createElement('div');
        info.className = 'item-info';
        
        const title = document.createElement('span');
        title.className = 'item-title';
        title.textContent = img.title;

        const num = document.createElement('span');
        num.className = 'item-number';
        num.textContent = `Phím ${img.id}`;

        info.appendChild(title);
        info.appendChild(num);
        item.appendChild(image);
        item.appendChild(info);

        // Kích hoạt bằng Chuột hoặc phím Enter/Space khi đang focus
        const triggerAction = () => openGalleryModal(idx);
        item.addEventListener('click', triggerAction);
        item.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                triggerAction();
            }
        });

        galleryGrid.appendChild(item);
    });
}

// =========================================================================
// 3. LOGIC XỬ LÝ HỘP THOẠI ẢNH (GALLERY MODAL OPERATIONS)
// =========================================================================

function openGalleryModal(index) {
    state.currentIndex = index;
    elementFocusedBeforeModal = document.activeElement; // Lưu vết vị trí cũ
    
    updateModalImageContent();
    
    galleryModal.setAttribute('aria-hidden', 'false');
    state.isModalOpen = true;
    
    // Đẩy tiêu điểm vào nút Đóng bên trong Modal ngay khi mở ra
    setTimeout(() => document.getElementById('closeModalBtn').focus(), 50);
}

function closeGalleryModal() {
    galleryModal.setAttribute('aria-hidden', 'true');
    state.isModalOpen = false;
    
    if (elementFocusedBeforeModal) {
        elementFocusedBeforeModal.focus(); // Trả lại tiêu điểm về vị trí ban đầu
    }
}

function updateModalImageContent() {
    const currentImg = images[state.currentIndex];
    modalMainImage.src = currentImg.url;
    modalMainImage.alt = currentImg.desc;
    modalCaption.textContent = `${currentImg.title} (${state.currentIndex + 1}/${images.length})`;
}

function navigateGallery(direction) {
    if (direction === 'next') {
        state.currentIndex = (state.currentIndex + 1) % images.length;
    } else if (direction === 'prev') {
        state.currentIndex = (state.currentIndex - 1 + images.length) % images.length;
    }
    updateModalImageContent();
}

function toggleSlideshow() {
    if (state.slideshowInterval) {
        clearInterval(state.slideshowInterval);
        state.slideshowInterval = null;
        slideshowStatus.textContent = "Trạng thái Slideshow: Đang tắt";
        slideshowStatus.style.color = "#ef4444";
    } else {
        if (!state.isModalOpen) openGalleryModal(0); // Nếu chưa mở ảnh thì kích hoạt mở ảnh số 1
        slideshowStatus.textContent = "Trạng thái Slideshow: ĐANG CHẠY TỰ ĐỘNG";
        slideshowStatus.style.color = "#10b981";
        
        state.slideshowInterval = setInterval(() => {
            navigateGallery('next');
        }, 2500); // 2.5 giây tự lật ảnh
    }
}

// =========================================================================
// 4. KIẾN TRÚC LỆNH TRUNG TÂM (COMMAND PALETTE CORE ENGINE)
// =========================================================================

function openCommandPalette() {
    state.isPaletteOpen = true;
    commandPalette.setAttribute('aria-hidden', 'false');
    paletteInput.value = '';
    state.selectedCommandIndex = 0;
    filterCommands('');
    
    setTimeout(() => paletteInput.focus(), 50); // Khóa tiêu điểm ngay vào ô nhập liệu
}

function closeCommandPalette() {
    state.isPaletteOpen = false;
    commandPalette.setAttribute('aria-hidden', 'true');
}

function filterCommands(query) {
    const cleanQuery = query.toLowerCase().trim();
    state.filteredCommands = systemCommands.filter(cmd => 
        cmd.text.toLowerCase().includes(cleanQuery)
    );
    state.selectedCommandIndex = 0;
    renderPaletteList();
}

function renderPaletteList() {
    commandList.textContent = '';
    
    if (state.filteredCommands.length === 0) {
        const noCmd = document.createElement('li');
        noCmd.className = 'command-item';
        noCmd.style.color = 'var(--text-muted)';
        noCmd.textContent = "Không tìm thấy lệnh nào khả dụng.";
        commandList.appendChild(noCmd);
        return;
    }

    state.filteredCommands.forEach((cmd, idx) => {
        const li = document.createElement('li');
        li.className = `command-item ${idx === state.selectedCommandIndex ? 'selected' : ''}`;
        li.setAttribute('role', 'option');
        li.setAttribute('aria-selected', idx === state.selectedCommandIndex ? 'true' : 'false');
        li.textContent = cmd.text;

        const shortcutSpan = document.createElement('span');
        shortcutSpan.className = 'command-shortcut';
        shortcutSpan.textContent = cmd.shortcut;
        li.appendChild(shortcutSpan);

        li.addEventListener('click', () => {
            state.selectedCommandIndex = idx;
            executeSelectedCommand();
        });

        commandList.appendChild(li);
    });
}

function executeSelectedCommand() {
    const command = state.filteredCommands[state.selectedCommandIndex];
    if (!command) return;

    closeCommandPalette();

    // Hệ thống Router định tuyến thực thi chức năng lệnh
    switch (command.id) {
        case 'toggle-theme':
            document.body.classList.toggle('light-theme');
            break;
        case 'play-slideshow':
            if (!state.slideshowInterval) toggleSlideshow();
            break;
        case 'pause-slideshow':
            if (state.slideshowInterval) toggleSlideshow();
            break;
        case 'open-first':
            openGalleryModal(0);
            break;
        case 'close-all':
            closeGalleryModal();
            break;
    }
}

// Lắng nghe sự kiện người dùng gõ từ khóa lọc lệnh realtime
paletteInput.addEventListener('input', (e) => {
    filterCommands(e.target.value);
});

// =========================================================================
// 5. BỘ CHẶN BÀN PHÍM TOÀN CỤC (GLOBAL KEYBOARD EVENT ROUTER)
// =========================================================================

window.addEventListener('keydown', (e) => {
    const key = e.key;
    
    // --- KHÔNG GIAN 1: KHI COMMAND PALETTE ĐANG MỞ ---
    if (state.isPaletteOpen) {
        if (key === 'Escape') {
            e.preventDefault();
            closeCommandPalette();
            if (elementFocusedBeforeModal) elementFocusedBeforeModal.focus();
            return;
        }
        if (key === 'ArrowDown') {
            e.preventDefault();
            state.selectedCommandIndex = (state.selectedCommandIndex + 1) % state.filteredCommands.length;
            renderPaletteList();
            return;
        }
        if (key === 'ArrowUp') {
            e.preventDefault();
            state.selectedCommandIndex = (state.selectedCommandIndex - 1 + state.filteredCommands.length) % state.filteredCommands.length;
            renderPaletteList();
            return;
        }
        if (key === 'Enter') {
            e.preventDefault();
            executeSelectedCommand();
            return;
        }
        return; // Chặn không cho phím tắt khác lọt vào khi đang gõ text lệnh
    }

    // --- KHÔNG GIAN 2: KHI TRÌNH XEM ẢNH MODAL ĐANG MỞ ---
    if (state.isModalOpen) {
        if (key === 'Escape') {
            e.preventDefault();
            closeGalleryModal();
            return;
        }
        if (key === 'ArrowRight') {
            e.preventDefault();
            navigateGallery('next');
            return;
        }
        if (key === 'ArrowLeft') {
            e.preventDefault();
            navigateGallery('prev');
            return;
        }
    }

    // --- KHÔNG GIAN 3: PHÍM TẮT CHUNG CHO TOÀN BỘ TRANG WEB ---
    
    // Phím tắt Ctrl + K (hoặc Cmd + K trên Mac) mở Command Palette độc quyền
    if ((e.ctrlKey || e.metaKey) && key.toLowerCase() === 'k') {
        e.preventDefault();
        openCommandPalette();
        return;
    }

    // Nút Space dùng để Play/Pause chu trình Slideshow (Chặn cuộn trang mặc định)
    if (key === ' ' || key === 'Spacebar') {
        // Chỉ kích hoạt nếu user không đang focus vào một nút bấm cụ thể để tránh xung đột
        if (document.activeElement.tagName !== 'BUTTON' && document.activeElement.tagName !== 'INPUT') {
            e.preventDefault();
            toggleSlideshow();
        }
    }

    // Tổ hợp phím số 1-9 giúp nhảy vọt mở bức ảnh tương ứng ngay lập tức
    if (/^[1-9]$/.test(key)) {
        // Chặn kích hoạt nếu user đang tập trung gõ ô tìm kiếm ở bên ngoài
        if (document.activeElement.tagName !== 'INPUT') {
            e.preventDefault();
            const targetIndex = parseInt(key) - 1;
            openGalleryModal(targetIndex);
        }
    }
});

// Gán sự kiện cơ bản cho các nút điều phối giao diện trong Modal bằng mã script cô lập
document.getElementById('closeModalBtn').addEventListener('click', closeGalleryModal);
document.getElementById('prevImgBtn').addEventListener('click', () => navigateGallery('prev'));
document.getElementById('nextImgBtn').addEventListener('click', () => navigateGallery('next'));

// Khởi chạy kích hoạt tạo lập giao diện hệ thống
initGallery();