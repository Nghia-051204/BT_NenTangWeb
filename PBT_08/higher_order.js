// =========================================================================
// 1. pipe() — NỐI CHUỖI CÁC HÀM (LEFT-TO-RIGHT COMPOSITION)
// =========================================================================
/**
 * Hàm nhận vào một danh sách các hàm và trả về một hàm mới.
 * Hàm mới này sẽ truyền kết quả của hàm trước làm đầu vào cho hàm sau.
 */
function pipe(...fns) {
    return function(initialValue) {
        // Duyệt qua từng hàm từ trái qua phải, tích lũy kết quả qua biến 'acc'
        return fns.reduce((acc, fn) => fn(acc), initialValue);
    };
}

// Kiểm thử pipe():
const processNumbers = pipe(
    x => x * 2,        // 5 → 10
    x => x + 10,       // 10 → 20
    x => x.toString(), // 20 → "20"
    x => "Kết quả: " + x
);

console.log("=== TEST 1: PIPE ===");
console.log(processNumbers(5)); // → "Kết quả: 20"


// =========================================================================
// 2. memoize() — GHI NHỚ / CACHE KẾT QUẢ TÍNH TOÁN
// =========================================================================
/**
 * Hàm bọc một hàm khác để lưu trữ kết quả đầu ra ứng với mỗi bộ tham số đầu vào.
 * Nếu tham số trùng lặp, hàm sẽ trả về kết quả trong cache thay vì tính lại.
 */
function memoize(fn) {
    // Sử dụng Map làm bộ nhớ đệm (Cache) nằm trong không gian Closure
    const cache = new Map();
    
    return function(...args) {
        // Biến đổi mảng tham số thành một chuỗi String độc nhất để làm Key
        const key = JSON.stringify(args);
        
        // Nếu Key đã tồn tại, trả về kết quả lưu sẵn ngay lập tức
        if (cache.has(key)) {
            return cache.get(key);
        }
        
        // Nếu chưa có, tiến hành thực thi hàm gốc và lưu kết quả vào cache
        const result = fn(...args);
        cache.set(key, result);
        return result;
    };
}

// Kiểm thử memoize():
const expensiveCalc = memoize((n) => {
    console.log("Đang tính...");
    let result = 0;
    for (let i = 0; i < n; i++) result += i;
    return result;
});

console.log("\n=== TEST 2: MEMOIZE ===");
console.log(expensiveCalc(1000000)); // → In "Đang tính..." rồi xuất: 499999500000
console.log(expensiveCalc(1000000)); // → (Không in "Đang tính...", lấy thẳng từ cache!)


// =========================================================================
// 3. debounce() — TRÌ HOÃN THỰC THI (CHỜ USER NGỪNG HÀNH ĐỘNG)
// =========================================================================
/**
 * Hàm trì hoãn việc thực thi 'fn' cho đến khi đã qua một khoảng thời gian 'delay' 
 * tính từ lần kích hoạt cuối cùng. Thường dùng cho sự kiện ô nhập liệu (Input Search).
 */
function debounce(fn, delay) {
    let timeoutId = null;
    
    return function(...args) {
        // Mỗi khi hàm được gọi, xóa bộ đếm thời gian cũ đi để reset lại từ đầu
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        
        // Thiết lập bộ đếm thời gian mới
        timeoutId = setTimeout(() => {
            fn.apply(this, args); // Thực thi hàm gốc với đúng ngữ cảnh và tham số
        }, delay);
    };
}

// Kiểm thử debounce():
const search = debounce((query) => {
    console.log("Searching:", query);
}, 500);

console.log("\n=== TEST 3: DEBOUNCE ===");
// Mô phỏng hành động gõ phím liên tục của người dùng:
search("a");
search("ab");
search("abc"); // Chỉ có lần gọi cuối cùng này mới thực sự kích hoạt sau 500ms ngừng gõ


// =========================================================================
// 4. retry() — TỰ ĐỘNG THỬ LẠI KHI CÓ LỖI (BẤT ĐỒNG BỘ)
// =========================================================================
/**
 * Hàm bất đồng bộ thực thi một tác vụ (Promise). 
 * Nếu tác vụ ném ra lỗi, hàm sẽ tự động thử lại tối đa 'maxAttempts' lần trước khi từ bỏ.
 */
async function retry(fn, maxAttempts = 3) {
    let attempts = 0;
    
    while (attempts < maxAttempts) {
        try {
            // Thử thực thi hàm bất đồng bộ
            return await fn();
        } catch (error) {
            attempts++;
            console.warn(`Lần thử ${attempts} thất bại. (Lỗi: ${error.message})`);
            
            // Nếu vượt quá số lần cấu hình tối đa thì chính thức ném lỗi ra ngoài
            if (attempts >= maxAttempts) {
                throw new Error(`Đã thử lại ${maxAttempts} lần nhưng vẫn thất bại hoàn toàn!`);
            }
        }
    }
}

let apiCallCount = 0;
const mockFetchData = async () => {
    apiCallCount++;
    if (apiCallCount < 3) {
        throw new Error("Mất kết nối mạng (503)");
    }
    return { status: 200, data: "Dữ liệu tải thành công!" };
};

setTimeout(async () => {
    console.log("\n=== TEST 4: RETRY ===");
    try {
        const result = await retry(mockFetchData, 4);
        console.log("Kết quả cuối cùng nhận được:", result);
    } catch (err) {
        console.error("Thất bại chung cuộc:", err.message);
    }
}, 600);