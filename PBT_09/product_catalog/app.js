// =========================================================================
// 1. DATA STORE (KHÔNG HARDCODE TRÊN HTML)
// =========================================================================
const products = [
    { id: 1, name: "iPhone 16 Pro Max", price: 34990000, category: "phone", image: "https://placehold.co/250x200/ef4444/fff?text=iPhone+16", rating: 4.9, inStock: true },
    { id: 2, name: "Samsung Galaxy S24 Ultra", price: 29990000, category: "phone", image: "https://placehold.co/250x200/3b82f6/fff?text=Galaxy+S24", rating: 4.7, inStock: true },
    { id: 3, name: "Google Pixel 9 Pro", price: 24500000, category: "phone", image: "https://placehold.co/250x200/10b981/fff?text=Pixel+9", rating: 4.6, inStock: false },
    { id: 4, name: "MacBook Pro M3 Max", price: 59990000, category: "laptop", image: "https://placehold.co/250x200/6366f1/fff?text=MacBook+Pro", rating: 4.9, inStock: true },
    { id: 5, name: "Dell XPS 14 Plus", price: 41990000, category: "laptop", image: "https://placehold.co/250x200/a855f7/fff?text=Dell+XPS", rating: 4.4, inStock: true },
    { id: 6, name: "Lenovo ThinkPad X1 Carbon", price: 45500000, category: "laptop", image: "https://placehold.co/250x200/ec4899/fff?text=ThinkPad+X1", rating: 4.5, inStock: true },
    { id: 7, name: "iPad Pro M4 Nano", price: 31990000, category: "tablet", image: "https://placehold.co/250x200/f59e0b/fff?text=iPad+Pro", rating: 4.8, inStock: true },
    { id: 8, name: "Samsung Galaxy Tab S9 Ultra", price: 22490000, category: "tablet", image: "https://placehold.co/250x200/06b6d4/fff?text=Galaxy+Tab", rating: 4.6, inStock: true },
    { id: 9, name: "Xiaomi Pad 6 Pro", price: 9490000, category: "tablet", image: "https://placehold.co/250x200/14b8a6/fff?text=Xiaomi+Pad", rating: 4.3, inStock: false },
    { id: 10, name: "AirPods Pro Gen 2 Type-C", price: 6190000, category: "accessory", image: "https://placehold.co/250x200/84cc16/fff?text=AirPods+Pro", rating: 4.8, inStock: true },
    { id: 11, name: "Sony WH-1000XM5 Premium", price: 8490000, category: "accessory", image: "https://placehold.co/250x200/e11d48/fff?text=Sony+XM5", rating: 4.7, inStock: true },
    { id: 12, name: "Apple Watch Ultra 2 Ocean", price: 21990000, category: "accessory", image: "https://placehold.co/250x200/475569/fff?text=Watch+Ultra", rating: 4.9, inStock: true }
];

// Trạng thái ứng dụng toàn cục (Global Application State)
const state = {
    currentCategory: 'all',
    searchQuery: '',
    sortOrder: 'default',
    cartItemsCount: 0
};

// Định nghĩa con trỏ các Element chứa sau khi build khung
let productGridContainer;
let cartBadgeElement;

// =========================================================================
// 2. PHÂN TÁCH CÁC HÀM XỬ LÝ LỌC VÀ SẮP XẾP (SEPARATION OF CONCERNS)
// =========================================================================

function searchProducts(list, keyword) {
    if (!keyword) return list;
    const lowerKey = keyword.toLowerCase();
    return list.filter(p => p.name.toLowerCase().includes(lowerKey));
}

function filterByCategory(list, category) {
    if (category === 'all') return list;
    return list.filter(p => p.category === category);
}

function sortProducts(list, order) {
    const sorted = [...list];
    if (order === 'price-asc') return sorted.sort((a, b) => a.price - b.price);
    if (order === 'price-desc') return sorted.sort((a, b) => b.price - a.price);
    if (order === 'name-az') return sorted.sort((a, b) => a.name.localeCompare(b.name));
    if (order === 'rating-desc') return sorted.sort((a, b) => b.rating - a.rating);
    return sorted; // Trạng thái ban đầu
}

/**
 * Hàm điều phối gộp dòng chảy dữ liệu (Pipeline State Router)
 */
function dispatchPipeline() {
    let result = [...products];
    result = filterByCategory(result, state.currentCategory);
    result = searchProducts(result, state.searchQuery);
    result = sortProducts(result, state.sortOrder);
    
    renderProducts(result);
}

// =========================================================================
// 3. HÀM DỰNG GIAO DIỆN BẰNG CREATEELEMENT (100% CONTENT RENDERING)
// =========================================================================

function formatVND(amount) {
    return new Intl.NumberFormat('vi-VN').format(amount) + "đ";
}

/**
 * Tạo và nạp các Card sản phẩm vào lưới hiển thị
 */
function renderProducts(productsToRender) {
    productGridContainer.textContent = ''; // Clear dữ liệu cũ

    if (productsToRender.length === 0) {
        const noResult = document.createElement('p');
        noResult.textContent = "Không tìm thấy sản phẩm phù hợp.";
        noResult.style.textAlign = "center";
        noResult.style.gridColumn = "1 / -1";
        noResult.style.color = "var(--text-secondary)";
        productGridContainer.appendChild(noResult);
        return;
    }

    productsToRender.forEach(product => {
        // Tạo thẻ bao vỏ bọc Card
        const card = document.createElement('div');
        card.className = 'product-card';
        card.addEventListener('click', () => showModal(product));

        // Hình ảnh sản phẩm
        const img = document.createElement('img');
        img.className = 'product-img';
        img.src = product.image;
        img.alt = product.name;
        img.loading = "lazy";

        // Khối chứa thông tin
        const info = document.createElement('div');
        info.className = 'product-info';

        const name = document.createElement('h3');
        name.className = 'product-name';
        name.textContent = product.name;

        const metaRow = document.createElement('div');
        metaRow.className = 'product-meta';

        const price = document.createElement('span');
        price.className = 'product-price';
        price.textContent = formatVND(product.price);

        const rating = document.createElement('span');
        rating.className = 'product-rating';
        rating.textContent = `★ ${product.rating}`;

        metaRow.appendChild(price);
        metaRow.appendChild(rating);

        // Trạng thái kho hàng
        const stock = document.createElement('div');
        stock.className = `stock-status ${product.inStock ? 'in' : 'out'}`;
        stock.textContent = product.inStock ? "Còn hàng" : "Hết hàng";

        // Nút mua hàng
        const btnAdd = document.createElement('button');
        btnAdd.className = 'btn-add-cart';
        btnAdd.textContent = product.inStock ? "Thêm vào giỏ" : "Tạm hết hàng";
        btnAdd.disabled = !product.inStock;
        
        // Ngăn chặn nổi bọt sự kiện (Event Bubbling) để tránh kích hoạt mở Modal của Card cha
        btnAdd.addEventListener('click', (e) => {
            e.stopPropagation();
            state.cartItemsCount++;
            cartBadgeElement.textContent = state.cartItemsCount;
        });

        // Lắp ghép hoàn chỉnh cây DOM cho Card
        info.appendChild(name);
        info.appendChild(metaRow);
        info.appendChild(stock);
        info.appendChild(btnAdd);

        card.appendChild(img);
        card.appendChild(info);

        productGridContainer.appendChild(card);
    });
}

/**
 * Khởi tạo Modal chi tiết sản phẩm tự động bằng JS
 */
function showModal(product) {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';

    const content = document.createElement('div');
    content.className = 'modal-content';

    const btnClose = document.createElement('button');
    btnClose.className = 'modal-close';
    btnClose.textContent = '✕';
    btnClose.addEventListener('click', () => overlay.remove());

    const mTitle = document.createElement('h2');
    mTitle.textContent = product.name;
    mTitle.style.marginTop = '0';

    const mImg = document.createElement('img');
    mImg.src = product.image;
    mImg.style.width = '100%';
    mImg.style.borderRadius = '8px';
    mImg.style.marginBottom = '15px';

    const mCategory = document.createElement('p');
    mCategory.textContent = `Danh mục: ${product.category.toUpperCase()}`;
    mCategory.style.color = 'var(--text-secondary)';

    const mPrice = document.createElement('p');
    mPrice.innerHTML = `Giá bán: <strong style="color:var(--accent-color); font-size:18px">${formatVND(product.price)}</strong>`;

    const mRating = document.createElement('p');
    mRating.textContent = `Đánh giá chuyên gia: ${product.rating} / 5.0 ★`;

    // Click ra ngoài vùng Modal Content thì đóng modal
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) overlay.remove();
    });

    content.appendChild(btnClose);
    content.appendChild(mTitle);
    content.appendChild(mImg);
    content.appendChild(mCategory);
    content.appendChild(mPrice);
    content.appendChild(mRating);
    overlay.appendChild(content);

    document.body.appendChild(overlay);
}

// =========================================================================
// 4. HÀM DỰNG BỘ KHUNG SHELL GIAO DIỆN BAN ĐẦU (APP INITIALIZER)
// =========================================================================

function buildAppShell() {
    const root = document.getElementById('app');

    // --- 4.1 TIÊU ĐỀ & TIỆN ÍCH HEADER ---
    const header = document.createElement('header');
    const title = document.createElement('h1');
    title.textContent = "TechStore Premium";
    title.style.margin = '0';

    const headerRight = document.createElement('div');
    headerRight.className = 'header-right';

    // Nút Toggle Dark Mode
    const btnDarkMode = document.createElement('button');
    btnDarkMode.className = 'btn';
    btnDarkMode.textContent = "🌙 Dark Mode";
    btnDarkMode.addEventListener('click', () => {
        const isDark = document.body.classList.toggle('dark-mode');
        btnDarkMode.textContent = isDark ? "☀️ Light Mode" : "🌙 Dark Mode";
    });

    // Icon Giỏ hàng + Badge hiển thị số lượng tích lũy
    const cartWrapper = document.createElement('div');
    cartWrapper.className = 'cart-icon-wrapper';
    cartWrapper.textContent = "🛒";
    cartBadgeElement = document.createElement('span');
    cartBadgeElement.className = 'cart-badge';
    cartBadgeElement.textContent = state.cartItemsCount;
    cartWrapper.appendChild(cartBadgeElement);

    headerRight.appendChild(btnDarkMode);
    headerRight.appendChild(cartWrapper);
    header.appendChild(title);
    header.appendChild(headerRight);

    // --- 4.2 THANH ĐIỀU KHIỂN BỘ LỌC (CONTROLS BAR) ---
    const controlsBar = document.createElement('div');
    controlsBar.className = 'controls-bar';

    // Thanh nhập từ khóa (Search Input Live)
    const searchBox = document.createElement('div');
    searchBox.className = 'search-box';
    const inputSearch = document.createElement('input');
    inputSearch.type = 'text';
    inputSearch.placeholder = 'Tìm tên sản phẩm hi tech...';
    inputSearch.addEventListener('input', (e) => {
        state.searchQuery = e.target.value;
        dispatchPipeline();
    });
    searchBox.appendChild(inputSearch);

    // Hàng nút chọn Danh mục (Category Chips)
    const categoryContainer = document.createElement('div');
    categoryContainer.className = 'category-filters';
    const categoriesList = ['all', 'phone', 'laptop', 'tablet', 'accessory'];
    const vnNames = { all: 'Tất cả', phone: 'Điện thoại', laptop: 'Máy tính', tablet: 'Máy tính bảng', accessory: 'Phụ kiện' };

    categoriesList.forEach(cat => {
        const btnCat = document.createElement('button');
        btnCat.className = `btn ${cat === 'all' ? 'active' : ''}`;
        btnCat.textContent = vnNames[cat];
        btnCat.addEventListener('click', (e) => {
            // Xóa active cũ và gán active mới
            categoryContainer.querySelectorAll('.btn').forEach(b => b.classList.remove('active'));
            btnCat.classList.add('active');
            
            state.currentCategory = cat;
            dispatchPipeline();
        });
        categoryContainer.appendChild(btnCat);
    });

    // Thẻ Dropdown sắp xếp (Sort Select Option)
    const sortBox = document.createElement('div');
    sortBox.className = 'sort-box';
    const selectSort = document.createElement('select');
    
    const options = [
        { value: 'default', text: 'Sắp xếp mặc định' },
        { value: 'price-asc', text: 'Giá tăng dần ↑' },
        { value: 'price-desc', text: 'Giá giảm dần ↓' },
        { value: 'name-az', text: 'Tên hàng từ A-Z' },
        { value: 'rating-desc', text: 'Đánh giá cao nhất ★' }
    ];
    options.forEach(opt => {
        const o = document.createElement('option');
        o.value = opt.value;
        o.textContent = opt.text;
        selectSort.appendChild(o);
    });
    selectSort.addEventListener('change', (e) => {
        state.sortOrder = e.target.value;
        dispatchPipeline();
    });
    sortBox.appendChild(selectSort);

    // Gom tụ vào Controls Bar
    controlsBar.appendChild(searchBox);
    controlsBar.appendChild(categoryContainer);
    controlsBar.appendChild(sortBox);

    // --- 4.3 KHỞI TẠO LƯỚI SẢN PHẨM ---
    productGridContainer = document.createElement('div');
    productGridContainer.className = 'product-grid';

    // Đẩy toàn bộ cấu trúc tổng vào Node Root #app
    root.appendChild(header);
    root.appendChild(controlsBar);
    root.appendChild(productGridContainer);
}

// =========================================================================
// 5. KÍCH HOẠT HỆ THỐNG BAN ĐẦU (APPLICATION RUNTIME KICKSTART)
// =========================================================================

// Bước 1: Dựng cấu trúc Node DOM cho bộ khung trang web
buildAppShell();

// Bước 2: Chạy pipeline xử lý dữ liệu và đẩy danh sách sản phẩm lần đầu tiên
dispatchPipeline();