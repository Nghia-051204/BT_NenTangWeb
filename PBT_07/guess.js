/**
 * Hàm khởi chạy và điều khiển toàn bộ logic trò chơi đoán số.
 */
function startGame() {
    // 1. Tạo số ngẫu nhiên từ 1 đến 100
    const targetNumber = Math.floor(Math.random() * 100) + 1;
    const maxAttempts = 7;
    
    let attempts = 0;          // Biến đếm số lần đoán hợp lệ
    let guessedNumbers = [];   // Mảng lưu vết lịch sử các số đã đoán
    let isWon = false;         // Cờ đánh dấu trạng thái chiến thắng

    alert("Trò chơi bắt đầu! Máy tính đã tạo xong số bí ẩn. Chúc bạn may mắn!");

    // Vòng lặp chính điều khiển trò chơi cho đến khi hết lượt hoặc đoán đúng
    while (attempts < maxAttempts) {
        let currentTurn = attempts + 1;
        let input = prompt(`[Lượt ${currentTurn}/${maxAttempts}] Nhập số bạn đoán (từ 1 đến 100):`);

        // Xử lý khi người dùng nhấn nút "Hủy" (Cancel) trên hộp thoại prompt
        if (input === null) {
            alert("Bạn đã huỷ và thoát khỏi trò chơi.");
            return;
        }

        // Chuẩn hóa dữ liệu đầu vào (xóa khoảng trắng thừa và ép sang số nguyên)
        let guess = parseInt(input.trim(), 10);

        // --- YÊU CẦU THÊM 1: VALIDATE INPUT (Chỉ chấp nhận số từ 1-100) ---
        if (isNaN(guess) || guess < 1 || guess > 100 || input.trim() === "") {
            alert("Lỗi: Vui lòng chỉ nhập một số nguyên hợp lệ trong khoảng từ 1 đến 100!");
            continue; // Nhảy qua các dòng dưới, yêu cầu nhập lại mà KHÔNG mất lượt
        }

        // --- YÊU CẦU THÊM 2: CẢNH BÁO TRÙNG LẶP ---
        if (guessedNumbers.includes(guess)) {
            alert(`Bạn đã đoán số này rồi! Các số bạn từng đoán: [${guessedNumbers.join(", ")}]`);
            continue; // Nhảy qua các dòng dưới, yêu cầu nhập lại mà KHÔNG mất lượt
        }

        // Ghi nhận số hợp lệ vừa đoán vào danh sách lịch sử và tăng số lượt lên 1
        guessedNumbers.push(guess);
        attempts++;

        // --- 3. KIỂM TRA ĐÁP ÁN ---
        if (guess === targetNumber) {
            alert(`Đúng rồi! Bạn đoán đúng sau ${attempts} lần!`);
            isWon = true;
            break; // Thoát khỏi vòng lặp ngay khi đoán trúng
        } else if (guess < targetNumber) {
            alert("Cao hơn! (Số bí ẩn lớn hơn số bạn vừa nhập)");
        } else {
            alert("Thấp hơn! (Số bí ẩn nhỏ hơn số bạn vừa nhập)");
        }
    }

    // --- XỬ LÝ KHI HẾT LƯỢT (THUA CUỘC) ---
    if (!isWon) {
        alert(`Bạn đã hết lượt đoán! Bạn đã thua cuộc.\nĐáp án chính xác là: ${targetNumber}`);
    }
}