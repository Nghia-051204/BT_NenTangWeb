function createRow(leftText, rightText, totalWidth = 36) {
    let spaces = totalWidth - leftText.length - rightText.length;
    if (spaces < 0) spaces = 1; 
    return `║ ${leftText}${" ".repeat(spaces)}${rightText} ║`;
}

// Hàm format tiền tệ (Ví dụ: 200000 -> "200.000")
function formatVND(number) {
    return number.toLocaleString('vi-VN');
}

function printBill(items, includeTip = false, dayOfWeek = new Date().getDay()) {
    let subTotal = 0;

    // 1. Tính tổng tiền ban đầu (Subtotal)
    for (let i = 0; i < items.length; i++) {
        subTotal += items[i].price * items[i].quantity;
    }

    // 2. Tính phần trăm giảm giá
    let discountPercent = 0;

    // Xét giảm giá theo tổng tiền (Chỉ lấy mức cao nhất)
    if (subTotal > 1000000) {
        discountPercent = 15;
    } else if (subTotal > 500000) {
        discountPercent = 10;
    }

    // Đề yêu cầu "giảm thêm" nên cộng dồn vào phần trăm hiện tại
    if (dayOfWeek === 3) {
        discountPercent += 5;
    }

    // 3. Tính toán các con số cuối cùng
    let discountAmount = subTotal * (discountPercent / 100);
    let amountAfterDiscount = subTotal - discountAmount;
    
    // VAT và Tip được tính trên số tiền SAU khi đã trừ chiết khấu (logic thực tế)
    let vatAmount = amountAfterDiscount * 0.08; 
    let tipAmount = includeTip ? (amountAfterDiscount * 0.05) : 0;
    
    let finalTotal = amountAfterDiscount + vatAmount + tipAmount;

    // 4. IN HÓA ĐƠN GIAO DIỆN CONSOLE (UI)
    const lineTop =    `╔${"═".repeat(38)}╗`;
    const lineMid =    `╠${"═".repeat(38)}╣`;
    const lineBottom = `╚${"═".repeat(38)}╝`;

    console.log(lineTop);
    console.log(createRow("       HÓA ĐƠN NHÀ HÀNG", "")); // Căn giữa thủ công
    console.log(lineMid);

    // In danh sách món ăn
    for (let i = 0; i < items.length; i++) {
        let item = items[i];
        let lineTotal = item.price * item.quantity;
        
        // Tạo chuỗi bên trái: "1. Phở bò      x2"
        let leftStr = `${i + 1}. ${item.name.padEnd(12)} x${item.quantity}`;
        
        // Tạo chuỗi bên phải: "@65k  = 130k"
        let rightStr = `@${item.price/1000}k  = ${lineTotal/1000}k`;
        
        console.log(createRow(leftStr, rightStr));
    }

    console.log(lineMid);

    // In phần tổng kết
    console.log(createRow("Tổng cộng:", `${formatVND(subTotal)}đ`));
    console.log(createRow(`Giảm giá (${discountPercent}%):`, `${formatVND(discountAmount)}đ`));
    console.log(createRow("VAT (8%):", `${formatVND(vatAmount)}đ`));
    
    if (includeTip) {
        console.log(createRow("Tip (5%):", `${formatVND(tipAmount)}đ`));
    } else {
        console.log(createRow("Tip (5%):", "0đ"));
    }

    console.log(lineMid);
    console.log(createRow("THANH TOÁN:", `${formatVND(finalTotal)}đ`));
    console.log(lineBottom);
    console.log("\n"); // Cách dòng cho dễ nhìn
}

const order1 = [
    { name: "Phở bò", price: 65000, quantity: 2 },
    { name: "Trà đá", price: 5000, quantity: 3 },
    { name: "Bún chả", price: 55000, quantity: 1 },
];
console.log(" TEST 1: Đơn nhỏ, có Tip, Ngày thường");
printBill(order1, true, 1); // 1 = Thứ 2

const order2 = [
    { name: "Tôm hùm", price: 800000, quantity: 1 },
    { name: "Steak bò", price: 400000, quantity: 2 },
    { name: "Vang đỏ", price: 200000, quantity: 1 }
];
console.log(" TEST 2: Đơn VIP, KHÔNG Tip, Thứ Tư (Giảm 20%)");
printBill(order2, false, 3); // 3 = Thứ Tư (Wednesday)