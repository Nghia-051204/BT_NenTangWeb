# PHIẾU BÀI TẬP 09
# **DOM MANIPULATION & EVENTS**

## PHẦN A — KIỂM TRA ĐỌC HIỂU 

## Câu A1 — DOM Tree

### 1. Sơ đồ cây DOM

```
document
└── html
    └── body
        └── div#app
            ├── header
            │   ├── h1
            │   │   └── [text: "Todo App"]
            │   └── nav
            │       ├── a.active
            │       │   └── [text: "All"]
            │       ├── a
            │       │   └── [text: "Active"]
            │       └── a
            │           └── [text: "Completed"]
            └── main
                ├── form#todoForm
                │   ├── input#todoInput  [type="text"]
                │   └── button  [type="submit"]
                │       └── [text: "Add"]
                └── ul#todoList
                    ├── li.todo-item
                    │   └── [text: "Learn HTML"]
                    └── li.todo-item.completed
                        └── [text: "Learn CSS"]
```

> **Ghi chú:** Mỗi node text (`[text: "..."]`) cũng là một **Text Node** trong DOM thực — không phải attribute. Các attribute như `id`, `class`, `href`, `type` là **Attribute Node** nằm bên trong element node tương ứng (không vẽ thành nhánh riêng để giữ sơ đồ gọn).

---

### 2. querySelector cho từng yêu cầu

| Yêu cầu | querySelector |
|---|---|
| Chọn thẻ `<h1>` | `document.querySelector("h1")` |
| Chọn input trong form | `document.querySelector("#todoForm input")` |
| Chọn tất cả `.todo-item` | `document.querySelectorAll(".todo-item")` |
| Chọn link đang active | `document.querySelector("nav a.active")` |
| Chọn `<li>` đầu tiên trong `#todoList` | `document.querySelector("#todoList li:first-child")` |
| Chọn tất cả `<a>` bên trong `<nav>` | `document.querySelectorAll("nav a")` |

**Lưu ý phân biệt:**
- `querySelector` → trả về **1 element đầu tiên** khớp (hoặc `null`).
- `querySelectorAll` → trả về **NodeList** gồm tất cả element khớp.

---

## Câu A2 — innerHTML vs textContent

### Sự khác nhau cốt lõi

| Tiêu chí | `innerHTML` | `textContent` |
|---|---|---|
| **Đọc** | Trả về chuỗi HTML (bao gồm thẻ) | Trả về chỉ nội dung văn bản thuần |
| **Ghi** | Parse chuỗi như HTML, tạo DOM node | Gán như plain text, **không** parse HTML |
| **Hiệu năng** | Chậm hơn (phải parse lại DOM) | Nhanh hơn |
| **Bảo mật** | ⚠️ Nguy hiểm với input người dùng (XSS) | ✅ An toàn |

### Ví dụ thực tế

```javascript
const box = document.querySelector("#box");

// innerHTML: dùng khi cần render HTML thực sự
box.innerHTML = "<strong>Xin chào</strong> <em>thế giới</em>";
// → Hiển thị: Xin chào thế giới (bold + italic)

// textContent: dùng khi chỉ cần text thuần
box.textContent = "<strong>Xin chào</strong>";
// → Hiển thị nguyên văn: <strong>Xin chào</strong>
//   (không render HTML, in ra ký tự literal)
```

**Khi nào dùng cái nào:**
- Dùng **`innerHTML`** khi bạn tự viết HTML markup (không phải từ user input), ví dụ tạo card, danh sách động từ template nội bộ.
- Dùng **`textContent`** khi hiển thị nội dung đến từ người dùng hoặc API bên ngoài — luôn ưu tiên vì an toàn và nhanh hơn.

---

### Câu hỏi bảo mật: XSS với innerHTML

**Tại sao nguy hiểm?**

`innerHTML` sẽ **parse và thực thi** bất kỳ HTML nào được gán vào, bao gồm các event handler như `onerror`, `onload`, `onclick`. Kẻ tấn công chỉ cần nhúng chuỗi HTML độc hại vào input để trình duyệt tự chạy JavaScript tùy ý — đây gọi là **Cross-Site Scripting (XSS)**.

```javascript
// ❌ NGUY HIỂM — code gốc
// Giả sử user nhập: <img src=x onerror="alert('Hacked!')">
const userInput = document.querySelector("#search").value;
document.querySelector("#result").innerHTML = userInput;
// → Trình duyệt tạo thẻ <img>, src=x lỗi → onerror kích hoạt → alert chạy
// → Kẻ tấn công có thể thay alert() bằng: đánh cắp cookie, gửi request giả,
//   chuyển hướng trang, keylog toàn bộ input...
```

```javascript
// ✅ SỬA — dùng textContent
const userInput = document.querySelector("#search").value;
document.querySelector("#result").textContent = userInput;
// → Hiển thị nguyên văn chuỗi "<img src=x onerror=...>" như plain text
// → Không có gì được parse hay thực thi

// ✅ HOẶC — nếu bắt buộc cần render HTML (ví dụ từ rich-text editor đáng tin):
// Dùng thư viện sanitize như DOMPurify
import DOMPurify from "dompurify";
document.querySelector("#result").innerHTML = DOMPurify.sanitize(userInput);
```

**Nguyên tắc vàng:** *Không bao giờ gán input người dùng trực tiếp vào `innerHTML`.*

---

## Câu A3 (5đ) — Event Bubbling

### HTML cấu trúc

```
#outer
  └── #inner
        └── #btn (button)
```

### Cơ chế Event Bubbling

Khi click vào `#btn`, sự kiện **bắt đầu từ target** (`#btn`) rồi **nổi bọt lên** (bubble) qua các ancestor theo thứ tự: `#btn` → `#inner` → `#outer` → `document` → `window`.

---

### Trường hợp 1: Không có `stopPropagation()`

```
Click vào #btn → Output:

BUTTON
INNER
OUTER
```

Lý do: Sự kiện bubble từ `#btn` lên `#inner` rồi lên `#outer`, mỗi level đều có listener nên đều log.

---

### Trường hợp 2: Bỏ comment `e.stopPropagation()`

```
Click vào #btn → Output:

BUTTON
```

Lý do: `stopPropagation()` **chặn sự kiện tại `#btn`**, không cho nổi bọt lên `#inner` và `#outer` nữa. Chỉ listener trên chính `#btn` chạy.

---

### Tóm tắt

| Trạng thái | Output |
|---|---|
| Không `stopPropagation` | `BUTTON` → `INNER` → `OUTER` |
| Có `stopPropagation` | `BUTTON` |

**Lưu ý:** Nếu click vào vùng `#inner` (không phải `#btn`), output sẽ là `INNER` → `OUTER`. Nếu click vào vùng `#outer`, chỉ ra `OUTER`. Bubbling luôn đi từ **element cụ thể nhất lên element tổng quát**.

---

## Câu C1 (8đ) — Debug DOM Code

Tổng cộng tìm được **9 lỗi**:

---

### Lỗi 1 — Sai tên event (`"onclick"` thay vì `"click"`)

```javascript
// ❌ Lỗi: "onclick" không phải tên event hợp lệ trong addEventListener
document.querySelector("#decrementBtn").addEventListener("onclick", function() { ... });

// ✅ Sửa:
document.querySelector("#decrementBtn").addEventListener("click", function() { ... });
```
> `addEventListener` nhận tên event không có tiền tố "on". `"onclick"` → listener không bao giờ kích hoạt.

---

### Lỗi 2 — Gán số vào biến DOM thay vì cập nhật nội dung

```javascript
// ❌ Lỗi: countDisplay là DOM element, không thể gán trực tiếp
countDisplay = count;  // Ghi đè biến, mất reference đến DOM node!

// ✅ Sửa:
countDisplay.textContent = count;
```

---

### Lỗi 3 — `innerHTML = null` gán chuỗi "null" thay vì xóa

```javascript
// ❌ Lỗi: null được ép kiểu thành chuỗi "null", hiển thị text "null"
historyList.innerHTML = null;

// ✅ Sửa:
historyList.innerHTML = "";
```

---

### Lỗi 4 — Thiếu `()` khi gọi `.remove`

```javascript
// ❌ Lỗi: Đây là truy cập property, không phải gọi hàm → không làm gì cả
item.remove;

// ✅ Sửa:
item.remove();
```

---

### Lỗi 5 — `localStorage.getItem` trả về string, gây lỗi type khi tính toán

```javascript
// ❌ Lỗi: getItem trả về string "5", count++ → "51", "52"... (nối chuỗi thay vì cộng số)
count = localStorage.getItem("count");

// ✅ Sửa:
count = parseInt(localStorage.getItem("count"), 10) || 0;
```

---

### Lỗi 6 — Không kiểm tra null khi load từ localStorage (lần đầu chạy)

```javascript
// ❌ Lỗi: Nếu chưa có dữ liệu, getItem trả về null → count = null → NaN
count = localStorage.getItem("count");
countDisplay.textContent = count; // Hiển thị "null"

// ✅ Sửa (gộp với lỗi 5):
const saved = localStorage.getItem("count");
count = saved !== null ? parseInt(saved, 10) : 0;
countDisplay.textContent = count;
```

---

### Lỗi 7 — Decrement không ghi vào history (logic không nhất quán)

```javascript
// ❌ Lỗi: Increment có ghi history, decrement thì không → inconsistent UX
document.querySelector("#decrementBtn").addEventListener("click", function() {
    count--;
    countDisplay.innerHTML = count;
    // Thiếu: không tạo li và append vào historyList
});

// ✅ Sửa: thêm lịch sử tương tự increment
document.querySelector("#decrementBtn").addEventListener("click", function() {
    count--;
    countDisplay.textContent = count;
    const li = document.createElement("li");
    li.textContent = "Count changed to " + count;
    li.addEventListener("click", function() { deleteHistory(this); });
    historyList.appendChild(li);
});
```

---

### Lỗi 8 — Dùng `innerHTML` để hiển thị số (nên dùng `textContent`)

```javascript
// ❌ Không sai về chức năng nhưng là bad practice — innerHTML parse không cần thiết
countDisplay.innerHTML = count;

// ✅ Sửa:
countDisplay.textContent = count;
```
> Với số nguyên thì vô hại, nhưng nếu `count` bị thao túng thành chuỗi HTML → XSS tiềm ẩn. Luôn dùng `textContent` khi không cần render HTML.

---

### Lỗi 9 — Reset không ghi vào history

```javascript
// ❌ Lỗi logic: Reset về 0 không để lại dấu vết trong history
document.querySelector("#resetBtn").addEventListener("click", () => {
    count = 0;
    countDisplay.textContent = count;
    historyList.innerHTML = ""; // Xóa history luôn, không hỏi user
});

```

## PHẦN C — DEBUG & PHÂN TÍCH

## Câu C1 — Debug DOM Code
---

### Code sửa

```javascript
const countDisplay = document.querySelector(".count");
const historyList = document.getElementById("history");

let count = 0;

function addHistoryEntry(text) {
    const li = document.createElement("li");
    li.textContent = text;
    li.addEventListener("click", function () {
        deleteHistory(this);
    });
    historyList.appendChild(li); // appendChild rõ ràng hơn append
}

document.querySelector("#incrementBtn").addEventListener("click", function () {
    count++;
    countDisplay.textContent = count;         // FIX #8: textContent thay innerHTML
    addHistoryEntry("Count changed to " + count);
});

document.querySelector("#decrementBtn").addEventListener("click", function () { // FIX #1: "click"
    count--;
    countDisplay.textContent = count;
    addHistoryEntry("Count changed to " + count); // FIX #7: thêm history
});

document.querySelector("#resetBtn").addEventListener("click", () => {
    count = 0;
    countDisplay.textContent = count;         // FIX #2: .textContent = count
    historyList.innerHTML = "";               // FIX #3: "" thay null
});

function deleteHistory(element) {
    element.parentNode.removeChild(element);
}

document.querySelector("#clearHistory").addEventListener("click", () => {
    const items = historyList.querySelectorAll("li");
    items.forEach(item => {
        item.remove();                        // FIX #4: remove() có dấu ()
    });
});

window.addEventListener("beforeunload", () => {
    localStorage.setItem("count", count);
    localStorage.setItem("history", historyList.innerHTML);
});

window.addEventListener("load", () => {
    const saved = localStorage.getItem("count");
    count = saved !== null ? parseInt(saved, 10) : 0; // FIX #5 & #6: parseInt + null check
    countDisplay.textContent = count;
});
```

---

## Câu C2 — Performance

### 1. Tại sao bind event lên 1000 element riêng lẻ là BAD PRACTICE?

**Vấn đề:**

```javascript
// ❌ BAD: 1000 listener riêng lẻ
document.querySelectorAll(".item").forEach(item => {
    item.addEventListener("click", handleClick);
});
```

| Hệ quả | Chi tiết |
|---|---|
| **Tốn bộ nhớ** | Mỗi listener là một closure/function object riêng → 1000 item = 1000 object trong heap |
| **Chậm khi khởi tạo** | Phải lặp qua 1000 element để gắn listener |
| **Không tự động cho element mới** | Item được thêm vào sau (dynamic) sẽ không có listener |
| **Dọn dẹp phức tạp** | Phải `removeEventListener` thủ công từng cái khi unmount |

**Event Delegation — giải pháp:**

```javascript
// ✅ GOOD: 1 listener duy nhất trên container cha
document.querySelector("#list").addEventListener("click", function (e) {
    // e.target là element thực sự được click
    if (e.target.matches(".item")) {
        handleClick(e.target);
    }
});
```

**Tại sao hoạt động?** Nhờ **Event Bubbling**: click vào `.item` → sự kiện nổi lên `#list` → listener trên `#list` bắt được → kiểm tra `e.target` xem có phải `.item` không.

**Lợi ích của Event Delegation:**

| | 1000 Listeners riêng | Event Delegation |
|---|---|---|
| Số listener | 1000 | **1** |
| Bộ nhớ | Tốn nhiều | **Tối thiểu** |
| Dynamic elements | ❌ Không hỗ trợ | ✅ Tự động |
| Khởi tạo | Chậm | **Nhanh** |

---

### 2. Refactor dùng `DocumentFragment`

**Code gốc — 1000 lần reflow:**

```javascript
// ❌ BAD: Mỗi appendChild gây 1 lần reflow + repaint
for (let i = 0; i < 1000; i++) {
    const div = document.createElement("div");
    div.textContent = `Item ${i}`;
    document.body.appendChild(div);   // ← 1000 lần DOM mutation!
}
```

**Code đã refactor — chỉ 1 lần reflow:**

```javascript
// ✅ GOOD: Dùng DocumentFragment làm "bộ đệm" ngoài DOM
const fragment = document.createDocumentFragment();

for (let i = 0; i < 1000; i++) {
    const div = document.createElement("div");
    div.textContent = `Item ${i}`;
    fragment.appendChild(div);   // ← Thao tác trong bộ nhớ, không đụng DOM thật
}

document.body.appendChild(fragment);  // ← CHỈ 1 lần reflow duy nhất!
```

**Tại sao nhanh hơn?**

`DocumentFragment` là một **lightweight container tồn tại trong bộ nhớ** (in-memory), **không phải một phần của DOM tree**. Khi bạn `appendChild` vào fragment:

- Trình duyệt **không cần tính lại layout** (no reflow)
- Trình duyệt **không cần vẽ lại** (no repaint)
- Chỉ cần cập nhật cấu trúc bộ nhớ nội bộ

Khi `document.body.appendChild(fragment)` được gọi, toàn bộ 1000 node được **gắn vào DOM trong một thao tác duy nhất** → trình duyệt chỉ phải tính layout và vẽ lại **đúng 1 lần**.

```
Không dùng Fragment:
[DOM mutation x1] → reflow → repaint
[DOM mutation x2] → reflow → repaint
...
[DOM mutation x1000] → reflow → repaint
= 1000 reflows

Dùng Fragment:
[bộ nhớ x1] ... [bộ nhớ x1000] → (không có reflow)
[DOM mutation x1 — append fragment] → reflow → repaint
= 1 reflow
```

**Cải thiện hiệu năng thực tế:** Với 1000 element phức tạp, DocumentFragment có thể nhanh hơn **10–50x** tùy trình duyệt và độ phức tạp của layout.

**Lưu ý thêm:** `innerHTML` một lần cũng là cách thay thế, nhưng kém linh hoạt hơn (không attach event listener được, và kém an toàn hơn). `DocumentFragment` là cách **idiomatic** và đúng nhất.

---