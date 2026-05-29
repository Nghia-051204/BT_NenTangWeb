/**
 * Module khởi tạo giỏ hàng sử dụng Closure (Encapsulation / Private Data)
 */
function createCart() {
    // ---- PRIVATE DATA (Dữ liệu bảo mật, bên ngoài không tiếp cận trực tiếp được) ----
    let items = [];
    let discountCode = null;

    // Hàm tiện ích định dạng tiền tệ Việt Nam VNĐ bên trong module
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN').format(Math.round(amount));
    };

    // ---- PRIVATE METHODS / FUNCTIONS ----

    // 1. Thêm sản phẩm (nếu đã có → tăng quantity)
    function addItem(product, quantity = 1) {
        if (!product || !product.id || quantity <= 0) return;
        
        // Kiểm tra sản phẩm đã tồn tại trong giỏ hàng chưa
        const existingItem = items.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            // Sao chép thuộc tính sản phẩm và đính kèm số lượng ban đầu
            items.push({ ...product, quantity });
        }
    }

    // 2. Xóa sản phẩm theo id khỏi giỏ hàng
    function removeItem(productId) {
        items = items.filter(item => item.id !== productId);
    }

    // 3. Cập nhật số lượng mới cho sản phẩm
    function updateQuantity(productId, newQuantity) {
        if (newQuantity <= 0) {
            removeItem(productId);
            return;
        }
        const item = items.find(item => item.id === productId);
        if (item) {
            item.quantity = newQuantity;
        }
    }

    // 4. Tính tổng tiền sau khi áp dụng các điều kiện giảm giá
    function getTotal() {
        // Tính tổng tiền gốc (Subtotal)
        const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        let total = subtotal;

        // Xử lý các điều kiện coupon
        if (discountCode === "SALE10") {
            total *= 0.9;  // Giảm 10%
        } else if (discountCode === "SALE20") {
            total *= 0.8;  // Giảm 20%
        } else if (discountCode === "FREESHIP") {
            total -= 30000; // Giảm thẳng 30,000đ
        }

        // Biên giới hạn dưới không để tổng tiền bị âm
        return total < 0 ? 0 : total;
    }

    // 5. Áp dụng mã giảm giá
    function applyDiscount(code) {
        const validCodes = ["SALE10", "SALE20", "FREESHIP"];
        if (validCodes.includes(code)) {
            discountCode = code;
        }
    }

    // 6. Lấy tổng số lượng tất cả sản phẩm đang có trong giỏ
    function getItemCount() {
        return items.reduce((sum, item) => sum + item.quantity, 0);
    }

    // 7. Làm rỗng hoàn toàn giỏ hàng và đặt lại coupon
    function clearCart() {
        items = [];
        discountCode = null;
    }

    // 8. Xuất hóa đơn hiển thị giỏ hàng dạng bảng chuẩn ASCII căn chỉnh tự động
    function printCart() {
        // Chiều rộng thiết kế cố định cho khung bảng đảm bảo không lệch viền
        console.log("┌───────────────────────────────────────────────────┐");
        console.log("│ # │ Sản phẩm       │ SL │ Đơn giá    │ Tổng       │");
        
        items.forEach((item, index) => {
            const stt = (index + 1).toString().padEnd(1);
            const name = item.name.padEnd(14);
            const qty = item.quantity.toString().padStart(2);
            const price = formatCurrency(item.price).padStart(10);
            const totalItem = formatCurrency(item.price * item.quantity).padStart(10);
            
            console.log(`│ ${stt} │ ${name} │ ${qty} │ ${price} │ ${totalItem} │`);
        });
        
        console.log("├───────────────────────────────────────────────────┤");
        
        // Tính toán khoảng trắng động cho dòng tổng kết hóa đơn
        const finalTotalStr = formatCurrency(getTotal()) + "đ";
        const discountText = discountCode ? ` (Giảm ${discountCode})` : "";
        const label = `Tổng cộng:${discountText}`;
        
        // Khung trống khả dụng bên trong là 49 khoảng trắng
        const remainingSpace = 49 - label.length - finalTotalStr.length;
        const spaces = " ".repeat(remainingSpace > 0 ? remainingSpace : 1);
        
        console.log(`│ ${label}${spaces}${finalTotalStr} │`);
        console.log("└───────────────────────────────────────────────────┘");
    }

    // ---- PUBLIC API (Trả về các hàm công khai ra bên ngoài) ----
    return {
        addItem,
        removeItem,
        updateQuantity,
        getTotal,
        applyDiscount,
        printCart,
        getItemCount,
        clearCart
    };
}

// =========================================================================
// === BỘ KIỂM THỬ KỊCH BẢN (TEST CASES) THEO YÊU CẦU ĐỀ BÀI ===
// =========================================================================

const cart = createCart();

// Thêm các sản phẩm vào giỏ
cart.addItem({ id: 1, name: "iPhone 16", price: 25990000 }, 1);
cart.addItem({ id: 3, name: "AirPods Pro", price: 6990000 }, 2);

// Thêm trùng sản phẩm ID 1 -> Hệ thống tự động nâng số lượng lên 2 thay vì đẩy phần tử mới
cart.addItem({ id: 1, name: "iPhone 16", price: 25990000 }, 1); 

// In giỏ hàng lần 1 (Chưa áp mã)
cart.printCart();

// Áp mã giảm giá 10%
cart.applyDiscount("SALE10");

// In giỏ hàng lần 2 (Đã áp mã chiết khấu thành công)
cart.printCart();

// Kiểm tra hàm lấy tổng số lượng sản phẩm (Kỳ vọng: 2 iPhone + 2 AirPods = 4)
console.log("Số SP:", cart.getItemCount()); // → 4

// Xóa sản phẩm AirPods Pro (ID 3) khỏi giỏ
cart.removeItem(3);

// Kiểm tra lại số lượng sản phẩm sau khi xóa (Kỳ vọng: chỉ còn 2 iPhone = 2)
console.log("Sau xóa:", cart.getItemCount()); // → 2