# PHIẾU BÀI TẬP 07
# **JAVASCRIPT BASICS — Variables, Data Types, Control Structures**

## PHẦN A — KIỂM TRA ĐỌC HIỂU

# Câu A1 (5đ) — var / let / const

## Đoạn 1

```js
console.log(x);
var x = 5;
```

### Dự đoán output

```js
undefined
```

### Giải thích

* `var` được **hoisting** (kéo lên đầu scope).
* Biến được tạo trước nhưng giá trị ban đầu là `undefined`.

Thực tế JS hiểu như sau:

```js
var x;
console.log(x);
x = 5;
```

---

## Đoạn 2

```js
console.log(y);
let y = 10;
```

### Dự đoán output

```js
ReferenceError
```

### Giải thích

* `let` cũng được hoisting nhưng nằm trong **Temporal Dead Zone (TDZ)**.
* Không thể truy cập biến trước khi khai báo.

---

## Đoạn 3

```js
const z = 15;
z = 20;
console.log(z);
```

### Dự đoán output

```js
TypeError
```

### Giải thích

* `const` không cho phép gán lại giá trị.
* Khi chạy `z = 20` sẽ báo lỗi ngay.

---

## Đoạn 4

```js
const arr = [1, 2, 3];
arr.push(4);
console.log(arr);
```

### Dự đoán output

```js
[1, 2, 3, 4]
```

### Giải thích

* `const` không cho phép gán lại biến.
* Nhưng vẫn có thể thay đổi nội dung object hoặc array.

Sai:

```js
arr = [1,2];
```

Đúng:

```js
arr.push(4);
```

---

## Đoạn 5

```js
let a = 1;

{
    let a = 2;
    console.log("Trong block:", a);
}

console.log("Ngoài block:", a);
```

### Dự đoán output

```js
Trong block: 2
Ngoài block: 1
```

### Giải thích

* `let` có **block scope**.
* Biến `a` bên trong block khác với biến `a` bên ngoài.

---

# Các kết quả bất ngờ

## 1. `var` cho ra `undefined`

Do cơ chế hoisting.

---

## 2. `let` bị lỗi dù cũng hoisting

Do Temporal Dead Zone.

---

## 3. `const` vẫn sửa được array

Vì `const` chỉ khóa việc gán lại biến, không khóa nội dung object/array.

---

# Câu A2 (5đ) — Data Types & Coercion

## Dự đoán kết quả

```js
console.log(typeof null);
```

Kết quả:

```js
"object"
```

---

```js
console.log(typeof undefined);
```

Kết quả:

```js
"undefined"
```

---

```js
console.log(typeof NaN);
```

Kết quả:

```js
"number"
```

---

```js
console.log("5" + 3);
```

Kết quả:

```js
"53"
```

---

```js
console.log("5" - 3);
```

Kết quả:

```js
2
```

---

```js
console.log("5" * "3");
```

Kết quả:

```js
15
```

---

```js
console.log(true + true);
```

Kết quả:

```js
2
```

---

```js
console.log([] + []);
```

Kết quả:

```js
""
```

---

```js
console.log([] + {});
```

Kết quả:

```js
"[object Object]"
```

---

```js
console.log({} + []);
```

Kết quả:

```js
0
```

---

# Giải thích `"5" + 3` và `"5" - 3`

## `"5" + 3`

Toán tử `+` ưu tiên nối chuỗi nếu có string.

```js
"5" + 3
→ "53"
```

---

## `"5" - 3`

Toán tử `-` chỉ dùng cho số nên JS ép kiểu:

```js
"5" → 5
```

Sau đó:

```js
5 - 3 = 2
```

---

# Câu A3 (5đ) — So sánh `==` vs `===`

## Dự đoán kết quả

```js
console.log(5 == "5");
```

```js
true
```

---

```js
console.log(5 === "5");
```

```js
false
```

---

```js
console.log(null == undefined);
```

```js
true
```

---

```js
console.log(null === undefined);
```

```js
false
```

---

```js
console.log(NaN == NaN);
```

```js
false
```

---

```js
console.log(0 == false);
```

```js
true
```

---

```js
console.log(0 === false);
```

```js
false
```

---

```js
console.log("" == false);
```

```js
true
```

---

# Nên dùng `==` hay `===`?

Nên dùng:

```js
===
```

## Vì sao?

* `===` so sánh:

  * giá trị
  * kiểu dữ liệu

* Tránh ép kiểu tự động gây lỗi khó debug.

Ví dụ nguy hiểm:

```js
0 == false // true
"" == false // true
```

Dùng `===` sẽ an toàn hơn.

---

# Câu A4 (5đ) — Truthy & Falsy

# TẤT CẢ giá trị Falsy trong JavaScript

```js
false
0
-0
0n
""
null
undefined
NaN
```

Ngoài các giá trị trên thì hầu hết đều là Truthy.

---

# Dự đoán kết quả

```js
if ("0") console.log("A");
```

Kết quả:

```js
In A
```

Vì `"0"` là string không rỗng → truthy.

---

```js
if ("") console.log("B");
```

Kết quả:

```js
Không in
```

---

```js
if ([]) console.log("C");
```

Kết quả:

```js
In C
```

Array rỗng vẫn là truthy.

---

```js
if ({}) console.log("D");
```

Kết quả:

```js
In D
```

Object rỗng vẫn là truthy.

---

```js
if (null) console.log("E");
```

Kết quả:

```js
Không in
```

---

```js
if (0) console.log("F");
```

Kết quả:

```js
Không in
```

---

```js
if (-1) console.log("G");
```

Kết quả:

```js
In G
```

---

```js
if (" ") console.log("H");
```

Kết quả:

```js
In H
```

Vì string chứa dấu cách vẫn là string không rỗng.

---

# Câu A5 (5đ) — Template Literals

## Cách 1

### Code cũ

```js
var greeting = "Xin chào " + name + "! Bạn " + age + " tuổi.";
```

### Viết bằng template literal

```js
var greeting = `Xin chào ${name}! Bạn ${age} tuổi.`;
```

---

## Cách 2

### Code cũ

```js
var url = "https://api.example.com/users/" + userId + "/orders?page=" + page;
```

### Viết bằng template literal

```js
var url = `https://api.example.com/users/${userId}/orders?page=${page}`;
```

---

## Cách 3

### Code cũ

```js
var html = "<div class=\"card\">" +
    "<h2>" + title + "</h2>" +
    "<p>" + description + "</p>" +
    "<span>Giá: " + price + "đ</span>" +
    "</div>";
```

### Viết bằng template literal

```js
var html = `
<div class="card">
    <h2>${title}</h2>
    <p>${description}</p>
    <span>Giá: ${price}đ</span>
</div>
`;
```

---

# Kết luận

* `var` có hoisting và function scope.
* `let` và `const` có block scope.
* `===` an toàn hơn `==`.
* JavaScript có cơ chế ép kiểu tự động rất mạnh.
* Template literals giúp code dễ đọc hơn nhiều.

## PHẦN C — SUY LUẬN (20 điểm)

### Câu C1 (10đ) — Debug JavaScript

Tìm và sửa TẤT CẢ lỗi trong code sau (có ít nhất 6 lỗi):

```javascript
function tinhGiaGiamGia(giaBan, phanTramGiam) {
    if (phanTramGiam < 0 || phanTramGiam > 100) {
        return "Phần trăm giảm không hợp lệ"
    }
    
    var giamGia = giaBan * phanTramGiam / 100
    let giaSauGiam = giaBan - giamGia
    
    if (giaSauGiam = 0) {
        console.log("Sản phẩm miễn phí!")
    }
    
    return giaSauGiam
}

// Test
const gia = tinhGiaGiamGia("100000", 20)
console.log("Giá sau giảm: " + gia + "đ")

const gia2 = tinhGiaGiamGia(50000, 110)
console.log("Giá: " + gia2)

for (var i = 0; i < 5; i++) {
    setTimeout(function() {
        console.log("Item " + i)
    }, 1000)
}
```

- **Lỗi 1:** Lỗi toán từ so sánh `if (giaSauGiam = 0)` => `if (giaSauGiam === 0)`
- **Lỗi 2:** Lỗi Scope với setTimeout `for (var i = 0; i < 5; i++)` => `for (let i = 0; i < 5; i++)`
- **Lỗi 3:** Lỗi kiểu dữ liệu truyền vào `tinhGiaGiamGia("100000", 20)` => `tinhGiaGiamGia(100000, 20)`
- **Lỗi 4:** Thiếu kiểm tra Validate đầu vào =>  `const gia = Number(giaBan);`
- **Lỗi 5:** Lỗi thiết kế hàm trả về kiểu dữ liệu không nhất quán `return "Phần trăm giảm không hợp lệ"` => `throw new Error("Lỗi: Input phải là số hợp lệ!");`
- **Lỗi 6:** Sử dụng var không cần thiết `var giamGia = giaBan * phanTramGiam / 100` => `const giamGia = gia * phanTramGiam / 100;`

**Code sau khi sửa:**
```javascript
// Đã sửa hàm
function tinhGiaGiamGia(giaBan, phanTramGiam) {
    const gia = Number(giaBan);
    if (isNaN(gia) || typeof phanTramGiam !== "number") {
        throw new Error("Lỗi: Input phải là số hợp lệ!"); 
    }

    if (phanTramGiam < 0 || phanTramGiam > 100) {
        throw new Error("Lỗi: Phần trăm giảm không hợp lệ!");
    }

    const giamGia = gia * phanTramGiam / 100; thay đổi
    const giaSauGiam = gia - giamGia;
    if (giaSauGiam === 0) {
        console.log("Sản phẩm miễn phí!");
    }
    
    return giaSauGiam;
}

// =======================
// Test lại code
// =======================
try {
    
    const gia = tinhGiaGiamGia(100000, 20);
    console.log("Giá sau giảm: " + gia + "đ");

    const gia2 = tinhGiaGiamGia(50000, 110); 
    console.log("Giá: " + gia2);
} catch (error) {
    console.error(error.message); 
}

for (let i = 0; i < 5; i++) {
    setTimeout(function() {
        console.log("Item " + i); // Output: Item 0, Item 1, Item 2, Item 3, Item 4
    }, 1000);
}
```

### Câu C2 (10đ) — Bài toán thực tế

**Chạy chương trình:**
```terminal
node restaurant_bill.js
```