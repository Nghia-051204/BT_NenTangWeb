// 1. Mảng dữ liệu sản phẩm ban đầu
const products = [
    { id: 1, name: "iPhone 16", price: 25990000, category: "phone", stock: 15, rating: 4.5 },
    { id: 2, name: "MacBook Pro", price: 45990000, category: "laptop", stock: 8, rating: 4.8 },
    { id: 3, name: "AirPods Pro", price: 6990000, category: "accessory", stock: 50, rating: 4.3 },
    { id: 4, name: "iPad Air", price: 16990000, category: "tablet", stock: 0, rating: 4.6 },
    { id: 5, name: "Samsung S24", price: 22990000, category: "phone", stock: 20, rating: 4.4 },
    { id: 6, name: "Dell XPS 15", price: 35990000, category: "laptop", stock: 5, rating: 4.7 },
    { id: 7, name: "Galaxy Buds", price: 3490000, category: "accessory", stock: 100, rating: 4.1 },
    { id: 8, name: "Xiaomi Pad 6", price: 7990000, category: "tablet", stock: 25, rating: 4.2 },
    { id: 9, name: "Pixel 9", price: 19990000, category: "phone", stock: 12, rating: 4.6 },
    { id: 10, name: "ThinkPad X1", price: 32990000, category: "laptop", stock: 3, rating: 4.5 }
];

// =========================================================================
// THỰC HIỆN CÁC HÀM XỬ LÝ LOGIC (SỬ DỤNG CÁC PHƯƠNG THỨC MẢNG NÂNG CAO)
// =========================================================================

// 1. Lọc sản phẩm còn hàng (stock > 0)
function getInStock(products) {
    return products.filter(product => product.stock > 0);
}

// 2. Lọc theo category VÀ khoảng giá
function filterProducts(products, category, minPrice, maxPrice) {
    return products.filter(product => 
        product.category === category && 
        product.price >= minPrice && 
        product.price <= maxPrice
    );
}

// 3. Sắp xếp theo giá (tăng/giảm) mà không làm biến đổi mảng gốc [...products]
function sortByPrice(products, order = "asc") {
    return [...products].sort((a, b) => 
        order === "asc" ? a.price - b.price : b.price - a.price
    );
}

// 4. Tìm sản phẩm rẻ nhất của mỗi danh mục (category)
// Sự kết hợp tuyệt vời giữa: map (lấy danh mục), sort (xếp giá tăng dần), find (chọc trúng sp đầu tiên), reduce (gộp object)
function cheapestByCategory(products) {
    // Lấy ra danh sách các category duy nhất
    const categories = [...new Set(products.map(p => p.category))];
    // Sắp xếp danh sách sản phẩm theo giá tăng dần
    const sortedProducts = [...products].sort((a, b) => a.price - b.price);

    // Dùng reduce gom mảng danh mục thành một Object kết quả mong muốn
    return categories.reduce((acc, category) => {
        // Do mảng đã sort tăng dần, phần tử đầu tiên được tìm thấy chắc chắn là rẻ nhất
        acc[category] = sortedProducts.find(p => p.category === category);
        return acc;
    }, {});
}

// 5. Tính tổng giá trị kho hàng (tổng của price × stock cho tất cả sản phẩm)
function totalInventoryValue(products) {
    return products.reduce((total, product) => total + (product.price * product.stock), 0);
}

// 6. Tạo mảng mới chỉ chứa các thuộc tính { name, formattedPrice } theo chuẩn tiền tệ VN
function formatProductList(products) {
    return products.map(product => ({
        name: product.name,
        formattedPrice: new Intl.NumberFormat('vi-VN').format(product.price) + "đ"
    }));
}

// 7. Tính điểm đánh giá (rating) trung bình của toàn bộ kho hàng
function averageRating(products) {
    if (products.length === 0) return 0;
    const totalRating = products.reduce((sum, product) => sum + product.rating, 0);
    // Làm tròn lấy 2 chữ số thập phân sau dấu phẩy
    return Math.round((totalRating / products.length) * 100) / 100;
}

// 8. Tìm danh sách sản phẩm theo từ khóa (Không phân biệt chữ hoa/chữ thường)
function searchProducts(products, keyword) {
    const lowerKeyword = keyword.toLowerCase();
    return products.filter(product => product.name.toLowerCase().includes(lowerKeyword));
}


// =========================================================================
// --- BỘ KIỂM THỬ (TEST CASES) THEO YÊU CẦU ---
// =========================================================================

console.log("=== IN-STOCK PRODUCTS ===");
console.log(getInStock(products));

console.log("\n=== PHONES 15-25 TRIỆU ===");
console.log(filterProducts(products, "phone", 15000000, 25000000));

console.log("\n=== CHEAPEST BY CATEGORY ===");
console.log(cheapestByCategory(products));

console.log("\n=== TOTAL INVENTORY VALUE ===");
console.log(totalInventoryValue(products).toLocaleString() + "đ");

// Khảo sát thêm các hàm bổ trợ khác để kiểm định tính chính xác
console.log("\n=== SORT BY PRICE (DESC) ===");
console.log(sortByPrice(products, "desc").map(p => `${p.name}: ${p.price.toLocaleString()}đ`));

console.log("\n=== FORMATTED PRODUCT LIST ===");
console.log(formatProductList(products.slice(0, 3))); // Thử nghiệm nhanh với 3 phần tử đầu tiên

console.log("\n=== AVERAGE RATING ===");
console.log(`${averageRating(products)} / 5 ★`);

console.log("\n=== SEARCH PRODUCTS (Keyword: 'pad') ===");
console.log(searchProducts(products, "pad"));