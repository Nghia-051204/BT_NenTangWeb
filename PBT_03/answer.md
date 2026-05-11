# PHẦN A — KIỂM TRA ĐỌC HIỂU

## Câu A1: 3 Cách nhúng CSS vào HTML

### 1. Inline CSS (CSS nội dòng)
* **Ví dụ code:**
    ```html
    <p style="color: red; font-size: 16px;">Đoạn văn này có màu đỏ.</p>
    ```
* **Ưu điểm:** Độ ưu tiên rất cao, thuận tiện khi cần sửa đổi nhanh một phần tử duy nhất.
* **Nhược điểm:** Khó bảo trì, làm mã HTML trở nên rối, không thể tái sử dụng.
* **Khi nào nên dùng:** Dùng cho Email HTML, hoặc khi cần can thiệp style động bằng JavaScript.

### 2. Internal CSS (CSS nội bộ)
* **Ví dụ code:**
    ```html
    <head>
        <style>
            body { background-color: #f0f0f0; }
            h1 { color: blue; }
        </style>
    </head>
    ```
* **Ưu điểm:** Quản lý tập trung toàn bộ CSS của một trang trong một file duy nhất.
* **Nhược điểm:** Chỉ có tác dụng trong trang hiện tại, không tái sử dụng được cho các file HTML khác.
* **Khi nào nên dùng:** Khi làm Single Page (Landing Page) hoặc khi viết template mẫu.

### 3. External CSS (CSS bên ngoài)
* **Ví dụ code:**
    ```html
    <!-- Trong file index.html -->
    <link rel="stylesheet" href="style.css">

    /* Trong file style.css */
    p { line-height: 1.5; }
    ```
* **Ưu điểm:** Tách biệt hoàn toàn cấu trúc và giao diện. Tái sử dụng được cho nhiều trang, giúp trình duyệt cache file để tăng tốc độ tải trang.
* **Nhược điểm:** Tốn thêm 1 request HTTP để tải file CSS.
* **Khi nào nên dùng:** Đây là cách chuẩn mực nhất, dùng trong mọi dự án thực tế.

**Câu hỏi thêm:** Nếu cùng một phần tử áp dụng cả 3 cách, cách nào "thắng"?
* **Đáp án:** **Inline CSS** thắng.
* **Giải thích:** Theo quy tắc Xếp tầng (Cascade), Inline CSS có độ ưu tiên (Specificity) cao nhất (1,0,0,0) so với Internal và External (0,0,1,0 hoặc tương đương).

---

## Câu A2: CSS Selectors - Dự đoán kết quả

Dựa trên cấu trúc HTML đã cho, dưới đây là các phần tử được chọn:

1.  **`h1`** → Chọn: `ShopTLU`
2.  **`.price`** → Chọn: `25.990.000đ` và `45.990.000đ`
3.  **`#app header`** → Chọn: Toàn bộ khối tiêu đề (Chứa `ShopTLU` và menu điều hướng).
4.  **`nav a:first-child`** → Chọn: `Home`
5.  **`.product.featured h2`** → Chọn: `MacBook Pro`
6.  **`article > p`** → Chọn: Tất cả đoạn văn là con trực tiếp của article (`25.990.000đ`, `Mô tả sản phẩm...`, `45.990.000đ`, `Mô tả sản phẩm...`).
7.  **`a[href="/"]`** → Chọn: `Home`
8.  **`.top-bar.dark h1`** → Chọn: `ShopTLU`

---

## Câu A3: Box Model - Tính toán kích thước

### Trường hợp 1: `content-box` (mặc định)
* **Chiều rộng hiển thị (Visible Width):** `400px (width) + 20px*2 (padding) + 5px*2 (border)` = **450px**
* **Không gian chiếm trên trang:** `450px + 10px*2 (margin)` = **470px**

### Trường hợp 2: `border-box`
* **Chiều rộng hiển thị (Visible Width):** Bằng chính `width` đã khai báo = **400px**
* **Kích thước content thực tế:** `400px - 40px (padding) - 10px (border)` = **350px**
* **Không gian chiếm trên trang:** `400px + 20px (margin)` = **420px**

### Trường hợp 3: Margin collapse
* **Khoảng cách giữa box-a và box-b:** **40px**
* **Giải thích:** Do hiện tượng Margin Collapse, trình duyệt chọn giá trị margin lớn nhất giữa hai khối kề nhau (max of 25px and 40px) thay vì cộng dồn.

**Nâng cao:** Nếu `.box-a` có `margin-bottom: -10px` và `.box-b` có `margin-top: 40px`:
* **Khoảng cách:** `40px + (-10px)` = **30px**.

---

## Câu A4: Specificity (Độ ưu tiên)

| Rule | Selector | Specificity Score | Màu sắc |
| :--- | :--- | :--- | :--- |
| **Rule A** | `p` | (0, 0, 1) | Black |
| **Rule B** | `.price` | (0, 1, 0) | Blue |
| **Rule C** | `#main-price` | (1, 0, 0) | Red |
| **Rule D** | `p.price` | (0, 1, 1) | Green |

**Kết quả:**
1.  **Element sẽ có màu gì?** Màu **Đỏ (Red)** vì Rule C có ID selector (độ ưu tiên cao nhất).
2.  **Nếu thêm Inline Style `style="color: orange;"`?** Màu **Cam (Orange)** vì Inline style ưu tiên hơn ID.
3.  **Nếu Rule A thêm `!important`?** Màu **Đen (Black)** vì `!important` ghi đè lên tất cả các quy tắc tính điểm thông thường.

## B (phần B)

### B1 (20đ) — Style trang Profile

Các loại selector đã sử dụng trong `style.css`:

| Loại selector         | Ví dụ                                                                                   |
| --------------------- | --------------------------------------------------------------------------------------- |
| Universal selector    | `*`                                                                                     |
| Element selector      | `body`, `header`, `table`, `footer`, `nav`, `section`                                   |
| Class selector        | `.open-menu`, `.active`, `.profile-card`                                                |
| ID selector           | `#skills`, `#contact`, `#about-me `, `#profile`, `#slogan`                              |
| Descendant selector   | `.main-nav a`, `.skills-table th`                                                       |
| Pseudo-class selector | `figure img:hover`, `#skills table tr:nth-child(even)`, `#skills table tbody tr:hover ` |

### B2(20đ) - Box Model Lab

#### Phần 1 - Chứng minh content-box vs border-box:

Hộp 1 dùng:

```css
box-sizing: content-box;
```

Tính toán:

```txt
300 + 20 + 20 + 5 + 5 = 350px
```

Kết quả:

```txt
Hộp 1 (content-box): chiều rộng thực tế = 350px
```

Hộp 2 dùng:

```css
box-sizing: border-box;
```

Kết quả mong đợi:

```txt
Hộp 2 (border-box): chiều rộng thực tế = 300px
```

Giải thích: Với `content-box`, width chỉ tính phần content, còn padding và border cộng thêm ra ngoài. Với `border-box`, width đã bao gồm content, padding và border.

#### Phần 2 - Layout 3 cột:

Container rộng `1000px`.

Nếu không dùng `border-box`:

```txt
Sidebar: 250 + 15 + 15 = 280px
Content: 500 + 20 + 20 = 540px
Ads: 250 + 15 + 15 = 280px
Tổng = 1100px
```

Nếu dùng `border-box`, mỗi cột giữ đúng width khai báo:

```txt
250 + 500 + 250 = 1000px
```

### Bài B3 (15đ) — Specificity Battle

## HTML

```html
<p id="demo" class="text highlight">
    Hello World
</p>
```

---

# Danh sách 10 CSS Rules + Specificity Score

| STT | CSS Rule | Specificity |
|-----|-----------|--------------|
| 1 | `p` | 0,0,1 |
| 2 | `body p` | 0,0,2 |
| 3 | `.text` | 0,1,0 |
| 4 | `p.text` | 0,1,1 |
| 5 | `.text.highlight` | 0,2,0 |
| 6 | `body p.text` | 0,2,1 |
| 7 | `#demo` | 1,0,0 |
| 8 | `p#demo` | 1,0,1 |
| 9 | `#demo.highlight` | 1,1,0 |
| 10 | `body p#demo.text.highlight` | 1,2,1 |


# Element cuối cùng hiển thị màu gì?

Element cuối cùng hiển thị màu:

```text
black
```

---

# Tại sao?

Rule:

```css
body p#demo.text.highlight
```

có specificity cao nhất:

```text
1,2,1
```

Nó bao gồm:

- 1 ID selector → `#demo`
- 2 class selectors → `.text` và `.highlight`
- 1 element selector → `p`

Vì specificity của rule này lớn nhất nên nó được ưu tiên áp dụng và ghi đè toàn bộ các rule trước đó.

# Thay đổi thứ tự rules trong CSS file. Kết quả có đổi không?

## Trả lời:

```text
Không đổi.
```

---

# Giải thích

CSS ưu tiên theo:

1. `!important`
2. Specificity
3. Thứ tự xuất hiện (nếu specificity bằng nhau)

Trong bài này:

```css
body p#demo.text.highlight
```

luôn có specificity cao nhất:

```text
1,2,1
```

nên dù đặt ở đầu hay cuối file CSS thì nó vẫn thắng các rule còn lại.

---

# Khi nào thứ tự mới ảnh hưởng?

Thứ tự chỉ ảnh hưởng khi:

- Các rule có specificity bằng nhau.

Ví dụ:

```css
.text {
    color: red;
}

.text {
    color: blue;
}
```

Kết quả cuối cùng sẽ là:

```text
blue
```

vì rule phía dưới ghi đè rule phía trên.


## C (phần C) — DEBUG & SUY LUẬN

### C1 (10đ) — Debug CSS Layout

#### Đề bài

`.container` rộng 960px, sidebar (300px) và content (660px) phải nằm cạnh nhau. Nhưng content bị đẩy xuống dòng mới.

#### 1) Chiều rộng thực tế (content-box)

Content-box: width chỉ tính **content**, còn padding + border cộng thêm ra ngoài.

- Sidebar:
```text
  width = 300
  padding = 20px x 2 = 40
  border = 1px x 2 = 2
  width thực tế = 300 + 40 + 2 = 342px
```

- Content:
```text
  width = 660
  padding = 30px x 2 = 60
  border = 1px x 2 = 2
   => width thực tế = 660 + 60 + 2 = 722px
```

Tổng thực tế = 342 + 722 = **1064px** > 960px ⇒ không đủ chỗ nên content bị xuống dòng.

#### 2) Giải thích tại sao layout bị vỡ

- Với `content-box`, tổng kích thước thật (width + padding + border) bị vượt quá 960px.
- Trình duyệt phải xuống dòng cho phần tử tiếp theo khi không còn đủ không gian ngang.

#### 3) 2 cách sửa khác nhau

**Cách 1 (dùng border-box):** thêm `box-sizing: border-box;` cho sidebar và content. Khi đó width đã bao gồm padding và border, nên tổng không vượt 960px.

**Cách 2 (không dùng border-box):** bỏ `float` và dùng layout hiện đại như `display: flex;` cho container. Flex sẽ sắp xếp 2 cột cạnh nhau mà không phụ thuộc vào float/cách cộng padding/border theo cách “float + content-box”.`

### C2 (10đ) — Cascade Puzzle (không chạy code)

Cho CSS:

```css
body { font-size: 16px; color: #333; }
.container { font-size: 14px; }
.card { color: blue; }
.card .title { font-size: 20px; }
.card p { color: inherit; }
#featured .title { color: red; }
.highlight { color: green !important; }
```

HTML:

```html
<body>
  <div class="container">
    <div class="card" id="featured">
      <h2 class="title highlight">Sản phẩm A</h2>
      <p>Mô tả sản phẩm</p>
    </div>
    <div class="card">
      <h2 class="title">Sản phẩm B</h2>
      <p class="highlight">Mô tả sản phẩm B</p>
    </div>
  </div>
</body>
```

#### 1) "Sản phẩm A" (h2) font-size & color

- **font-size = 20px**
  - `.container` cho 14px, nhưng `.card .title { font-size: 20px; }` áp dụng trực tiếp cho `.title` trong `.card` ⇒ 20px.
- **color = green**
  - `.highlight { color: green !important; }` áp dụng cho class `highlight` trên h2.
  - Dù `#featured .title { color: red; }` có thể áp red, nhưng `!important` của `.highlight` thắng ⇒ green.

#### 2) "Mô tả sản phẩm" (p trong card featured) có color = ?

- `p` nằm trong `.card` ⇒ rule `.card p { color: inherit; }`.
- `inherit` lấy màu từ element cha `.card`.
- `.card { color: blue; }` ⇒ cha `.card` là blue.
- Vậy **color của p = blue**.
- Không có rule nào khác ghi màu trực tiếp cho p (p không có class `highlight`).

#### 3) "Sản phẩm B" (h2) font-size & color

- **font-size = 20px**
  - `.card .title { font-size: 20px; }` vẫn áp dụng.
- **color = blue**
  - h2 không có class `highlight` ⇒ không bị `.highlight` tác động.
  - `#featured .title { color: red; }` không áp dụng vì h2 nằm trong `.card` không có id `featured`.
  - Vì `.card { color: blue; }` đặt màu cho card và h2 không override ⇒ **blue**.

#### 4) "Mô tả sản phẩm B" (p.highlight) color = ?

- p có class `highlight` ⇒ `.highlight { color: green !important; }` áp dụng ⇒ **green**.
- Dù `.card p { color: inherit; }` có thể làm inherit, thì `!important` của `.highlight` vẫn thắng.



---