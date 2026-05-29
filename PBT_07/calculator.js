/**
 * Hàm thực hiện các phép tính toán cơ bản giữa hai số.
 * @param {number} num1 - Số thứ nhất
 * @param {string} operator - Toán tử ("+", "-", "*", "/", "%", "**")
 * @param {number} num2 - Số thứ hai
 * @returns {number|string} Kết quả phép tính hoặc thông báo lỗi nếu gặp trường hợp không hợp lệ.
 */
function calculate(num1, operator, num2) {
    // 1. Xử lý lỗi: Input không phải số
    // Kiểm tra kiểu dữ liệu hoặc kiểm tra nếu số đó là NaN (Not a Number)
    if (typeof num1 !== 'number' || typeof num2 !== 'number' || Number.isNaN(num1) || Number.isNaN(num2)) {
        return "Lỗi: Input không phải số";
    }

    // 2. Thực hiện tính toán dựa trên toán tử
    switch (operator) {
        case "+":
            return num1 + num2;
        case "-":
            return num1 - num2;
        case "*":
            return num1 * num2;
        case "/":
            // Xử lý lỗi: Chia cho 0
            if (num2 === 0) {
                return "Lỗi: Không thể chia cho 0";
            }
            return num1 / num2;
        case "%":
            // Xử lý lỗi: Chia lấy dư cho 0
            if (num2 === 0) {
                return "Lỗi: Không thể chia cho 0";
            }
            return num1 % num2;
        case "**":
            return num1 ** num2;
        default:
            // Xử lý lỗi: Toán tử không hợp lệ
            return `Lỗi: Operator '${operator}' không hợp lệ`;
    }
}

console.log(calculate(10, "+", 5));    // → 15
console.log(calculate(10, "/", 0));    // → "Lỗi: Không thể chia cho 0"
console.log(calculate(10, "^", 5));    // → "Lỗi: Operator '^' không hợp lệ"
console.log(calculate("abc", "+", 5)); // → "Lỗi: Input không phải số"
console.log(calculate(2, "**", 10));   // → 1024

// Bổ sung thêm test case cho toán tử chia lấy dư và kiểm tra NaN
console.log(calculate(10, "%", 3));    // → 1
console.log(calculate(5, "%", 0));     // → "Lỗi: Không thể chia cho 0"
console.log(calculate(10, "-", NaN));  // → "Lỗi: Input không phải số"