# PHIẾU BÀI TẬP 06
## **CSS FRAMEWORKS —  TailwindCSS**
## PHẦN A — ĐỌC HIỂU 
## Câu A1 (10đ) — Grid System

### Bảng phân tích layout theo breakpoint

| Kích thước      | < 768px (xs)       | 768px – 991px (md)       | ≥ 992px (lg)           |
|-----------------|--------------------|--------------------------|------------------------|
| Class áp dụng   | `col-12`           | `col-md-6`               | `col-lg-3`             |
| Số cột mỗi box  | 12 / 12 = **1 cột**| 6 / 12 = **2 cột**       | 3 / 12 = **4 cột**     |
| Box layout      | Xếp dọc, full width| 2 box / hàng (50% mỗi box) | 4 box / hàng (25% mỗi box) |

### Sơ đồ minh họa

**< 768px — Mobile (1 cột)**
```
┌──────────────────────────────┐
│           Box 1              │
├──────────────────────────────┤
│           Box 2              │
├──────────────────────────────┤
│           Box 3              │
├──────────────────────────────┤
│           Box 4              │
└──────────────────────────────┘
```

**768px – 991px — Tablet (2 cột)**
```
┌───────────────┬───────────────┐
│     Box 1     │     Box 2     │
├───────────────┼───────────────┤
│     Box 3     │     Box 4     │
└───────────────┴───────────────┘
```

**≥ 992px — Desktop (4 cột)**
```
┌───────┬───────┬───────┬───────┐
│ Box 1 │ Box 2 │ Box 3 │ Box 4 │
└───────┴───────┴───────┴───────┘
```

---

### Câu hỏi thêm

#### `col-md-6` nghĩa là gì?

`col-md-6` có nghĩa: **tại breakpoint `md` (≥ 768px) trở lên**, element chiếm **6 trong 12 cột** của grid (tương đương 50% chiều rộng container).

- `col` — đây là một cột trong Bootstrap Grid
- `md` — breakpoint medium, áp dụng từ 768px trở lên
- `6` — chiếm 6 cột (= 6/12 = 50%)

#### Tại sao không cần viết `col-sm-12`?

Bootstrap sử dụng **mobile-first approach** — các class áp dụng từ breakpoint đó **trở lên**, và class không có prefix (như `col-12`) áp dụng cho **mọi kích thước bắt đầu từ nhỏ nhất (xs = 0px)**.

```
col-12      →  áp dụng cho TẤT CẢ kích thước (xs và lên)
col-md-6    →  ghi đè từ md (768px) trở lên
col-lg-3    →  ghi đè từ lg (992px) trở lên
```

Do `col-12` đã xử lý mọi màn hình nhỏ, thêm `col-sm-12` sẽ thừa vì kết quả hoàn toàn giống nhau.

---

## Câu A2 — Utilities & Components

### 1. Giải thích `d-none d-md-block`

| Class        | CSS tương đương      | Phạm vi áp dụng         |
|--------------|----------------------|-------------------------|
| `d-none`     | `display: none`      | Tất cả breakpoint (xs+) |
| `d-md-block` | `display: block`     | Từ md (≥ 768px) trở lên |

**Kết hợp hai class:**
- **< 768px (mobile):** Element bị **ẩn** hoàn toàn (`display: none`)
- **≥ 768px (tablet, desktop):** Element **hiện** dưới dạng block (`display: block`)

> **Dùng khi:** Muốn ẩn nội dung phụ trên mobile để giảm cluttering, chỉ hiện ở màn hình lớn hơn.

---

### 2. Năm Spacing Utilities (Margin / Padding)

Bootstrap spacing dùng cú pháp: `{property}{sides}-{size}`

- **Property:** `m` = margin, `p` = padding
- **Sides:** `t` = top, `b` = bottom, `s` = start/left, `e` = end/right, `x` = left+right, `y` = top+bottom, (không có = all 4 sides)
- **Size:** 0–5 (theo scale: 0=0, 1=0.25rem, 2=0.5rem, 3=1rem, 4=1.5rem, 5=3rem), hoặc `auto`

| Class     | CSS tương đương                                     | Giải thích                                   |
|-----------|-----------------------------------------------------|----------------------------------------------|
| `mt-3`    | `margin-top: 1rem` (16px)                           | Margin trên, kích thước 3                    |
| `px-4`    | `padding-left: 1.5rem; padding-right: 1.5rem`       | Padding hai chiều ngang (trái + phải)        |
| `mb-auto` | `margin-bottom: auto`                               | Margin dưới tự động — dùng để đẩy phần tử   |
| `py-2`    | `padding-top: 0.5rem; padding-bottom: 0.5rem`       | Padding hai chiều dọc (trên + dưới)          |
| `ms-3`    | `margin-left: 1rem` (Bootstrap 5: start = left)     | Margin bên trái (margin-start)               |

---

### 3. Sự khác nhau giữa `.container`, `.container-fluid`, `.container-md`

| Class              | Hành vi                                                              | Khi nào dùng                                       |
|--------------------|----------------------------------------------------------------------|----------------------------------------------------|
| `.container`       | Fixed-width, có `max-width` thay đổi theo từng breakpoint, căn giữa | Bố cục tiêu chuẩn, nội dung không quá rộng         |
| `.container-fluid` | Luôn `width: 100%` ở mọi kích thước màn hình                       | Full-width layout, banner, hero section             |
| `.container-md`    | `100%` trên mobile, chuyển sang fixed-width từ `md` (768px) trở lên | Hybrid: mobile full-width, desktop có giới hạn     |

**Ví dụ max-width của `.container`:**

| Breakpoint | Max-width      |
|------------|----------------|
| xs (<576px)| 100% (no max)  |
| sm (576px) | 540px          |
| md (768px) | 720px          |
| lg (992px) | 960px          |
| xl (1200px)| 1140px         |
| xxl(1400px)| 1320px         |

---

## PHẦN C — PHÂN TÍCH 

## Câu C1 (10đ) — Tùy biến Bootstrap

### 1. Quy trình đổi màu `$primary` sang `#E63946`

**Công cụ cần có:**
- Node.js + npm
- Package: `sass` (Dart Sass)
- Bootstrap source (npm package hoặc download)

**Các bước thực hiện:**

**Bước 1:** Cài đặt
```bash
npm install bootstrap sass
```

**Bước 2:** Tạo file `custom.scss`
```scss
// ⚡ QUAN TRỌNG: Override TRƯỚC khi import Bootstrap
$primary: #E63946;

// Sau đó mới import Bootstrap
@import "../node_modules/bootstrap/scss/bootstrap";
```

**Bước 3:** Compile
```bash
npx sass custom.scss custom.css --style compressed
```

**Bước 4:** Dùng `custom.css` thay vì `bootstrap.min.css`

> **Cơ chế hoạt động:** Bootstrap định nghĩa `$primary: #0d6efd !default;` — từ khóa `!default` có nghĩa "chỉ dùng giá trị này nếu biến chưa được khai báo". Khi ta khai báo `$primary: #E63946` trước, Bootstrap sẽ dùng giá trị của ta.

---

### 2. Tại sao KHÔNG override trực tiếp `.btn-primary { background: red; }`?

**Vấn đề khi override trực tiếp:**

```css
/* ❌ Cách SAI — chỉ thay đổi 1 selector */
.btn-primary {
  background: red;
}
```

| Vấn đề               | Hệ quả                                                               |
|----------------------|----------------------------------------------------------------------|
| **Cascade không đủ** | Hover state, active state, disabled state vẫn giữ màu cũ (#0d6efd) |
| **Các biến phái sinh bị bỏ sót** | `$primary-rgb`, `$primary-text-emphasis`, focus ring color vẫn xanh |
| **Specificity wars** | Phải thêm `!important` hoặc tăng specificity để ghi đè, dễ sinh bug |
| **Khó maintain**     | Màu xuất hiện ở nhiều nơi (badge, link, border-color...) nhưng chỉ 1 nơi đổi |
| **Bundle size tăng** | CSS của Bootstrap + CSS override của bạn → file nặng hơn            |

**Khi dùng SASS variable:** Thay `$primary: #E63946` sẽ tự động cập nhật toàn bộ:
- `.btn-primary` (background, border)
- `.btn-primary:hover` (màu hover tối hơn)
- `.btn-outline-primary` (màu border và text)
- `.bg-primary`, `.text-primary`, `.border-primary`
- Focus ring, badge, progress bar, link color...

> **Nguyên tắc:** Sửa ở nguồn (SASS variable), không sửa ở kết quả (compiled CSS).

---

## Câu C2 — So sánh

### Navbar Responsive

**CSS thuần (~80 dòng CSS):**
```css
nav { display: flex; justify-content: space-between; align-items: center;
      padding: 0 1.5rem; background: #fff; box-shadow: 0 2px 4px rgba(0,0,0,.1); height: 60px; }
.nav-logo { font-size: 1.25rem; font-weight: 700; }
.nav-links { display: flex; gap: 1.5rem; list-style: none; margin: 0; }
.nav-links a { text-decoration: none; color: #333; }
.nav-links a:hover { color: #0d6efd; }
.hamburger { display: none; cursor: pointer; }

@media (max-width: 767px) {
  .hamburger { display: block; }
  .nav-links { display: none; flex-direction: column; position: absolute;
               top: 60px; left: 0; right: 0; background: #fff; padding: 1rem; }
  .nav-links.open { display: flex; }
}
/* + JS để toggle .open class (~10 dòng) */
```

**Bootstrap (~5 dòng HTML, 0 dòng CSS):**
```html
<nav class="navbar navbar-expand-md navbar-light bg-white shadow-sm">
  <div class="container">
    <a class="navbar-brand fw-bold" href="#">Logo</a>
    <button class="navbar-toggler" data-bs-toggle="collapse" data-bs-target="#nav">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="nav">
      <ul class="navbar-nav ms-auto gap-3">
        <li class="nav-item"><a class="nav-link" href="#">Home</a></li>
      </ul>
    </div>
  </div>
</nav>
```

---

### Product Card

**CSS thuần (~60 dòng CSS + HTML):**
```css
.card { border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,.12);
        background: #fff; transition: box-shadow .3s; }
.card:hover { box-shadow: 0 8px 24px rgba(0,0,0,.2); }
.card img { width: 100%; height: 200px; object-fit: cover; }
.card-body { padding: 1rem; }
.card-title { font-size: 1rem; font-weight: 600; margin-bottom: .5rem; }
.card-price { color: #e63946; font-size: 1.25rem; font-weight: 700; }
.btn-cart { width: 100%; padding: .5rem; background: #0d6efd; color: #fff;
            border: none; border-radius: 4px; cursor: pointer; margin-top: .75rem; }
.btn-cart:hover { background: #0b5ed7; }
```

**Bootstrap (~0 dòng CSS):**
```html
<div class="card shadow-sm h-100">
  <img src="product.jpg" class="card-img-top" style="height:200px;object-fit:cover">
  <div class="card-body d-flex flex-column">
    <h5 class="card-title">Tên sản phẩm</h5>
    <p class="text-danger fw-bold fs-5 mt-auto">250.000₫</p>
    <button class="btn btn-primary w-100">Thêm vào giỏ</button>
  </div>
</div>
```

---

### Bảng so sánh tổng hợp

| Tiêu chí             | CSS thuần                                      | Bootstrap                                       |
|----------------------|------------------------------------------------|-------------------------------------------------|
| **Số dòng CSS**      | ~140 dòng (navbar + card)                      | ~0 dòng (đã có sẵn)                             |
| **Thời gian dev**    | 2–4 giờ (bao gồm debug responsive)            | 15–30 phút                                      |
| **Tùy biến**         | Tự do hoàn toàn, không giới hạn               | Bị ràng buộc bởi design system của Bootstrap    |
| **File size**        | CSS nhỏ (chỉ những gì cần)                    | Bootstrap.min.css ~22KB (dù không dùng hết)     |
| **Học thuật**        | Nắm chắc CSS căn bản                          | Cần học Bootstrap API, class names              |
| **Consistency**      | Tự quản lý                                    | Nhất quán theo design system có sẵn             |

---

### Khi NÊN và KHÔNG NÊN dùng Bootstrap

**✅ NÊN dùng Bootstrap khi:**
- Deadline gấp, cần prototype nhanh (hackathon, MVP)
- Team lớn, cần UI consistency mà không cần design riêng
- Internal tools, admin dashboard không cần thương hiệu riêng
- Developer không có kinh nghiệm design

**❌ KHÔNG NÊN dùng Bootstrap khi:**
- Project cần thiết kế thương hiệu riêng, khác biệt hoàn toàn
- Chỉ cần 1–2 component (import nguyên Bootstrap là overkill)
- Performance-critical site (mỗi KB quan trọng — mobile, emerging markets)
- Team đã có design system riêng
- Cần hiệu ứng/animation phức tạp vượt ngoài khả năng Bootstrap

---

## TRACK B — TAILWINDCSS

---

## Câu A1 (10đ) — Utility Classes

### Giải thích từng class trong đoạn HTML

#### Outer `<div>` — Card container

| Class                  | CSS tương đương                                                              |
|------------------------|------------------------------------------------------------------------------|
| `flex`                 | `display: flex`                                                              |
| `items-center`         | `align-items: center`                                                        |
| `justify-between`      | `justify-content: space-between`                                             |
| `p-4`                  | `padding: 1rem` (16px — tất cả 4 cạnh)                                      |
| `bg-white`             | `background-color: #ffffff`                                                  |
| `shadow-md`            | `box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)` |
| `rounded-lg`           | `border-radius: 0.5rem` (8px)                                                |
| `hover:shadow-xl`      | Khi hover → `box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), ...`            |
| `transition-shadow`    | `transition-property: box-shadow`                                            |
| `duration-300`         | `transition-duration: 300ms`                                                 |

#### `<img>` — Avatar

| Class           | CSS tương đương                        |
|-----------------|----------------------------------------|
| `w-16`          | `width: 4rem` (64px)                   |
| `h-16`          | `height: 4rem` (64px)                  |
| `rounded-full`  | `border-radius: 9999px` (hình tròn)    |
| `object-cover`  | `object-fit: cover`                    |

#### Inner `<div>` — Text wrapper

| Class    | CSS tương đương                              |
|----------|----------------------------------------------|
| `ml-4`   | `margin-left: 1rem` (16px)                   |
| `flex-1` | `flex: 1 1 0%` (grow và shrink, chiếm hết không gian còn lại) |

#### `<h3>` — Tên người dùng

| Class           | CSS tương đương                              |
|-----------------|----------------------------------------------|
| `text-lg`       | `font-size: 1.125rem` (18px); `line-height: 1.75rem` |
| `font-semibold` | `font-weight: 600`                           |
| `text-gray-800` | `color: #1f2937`                             |
| `truncate`      | `overflow: hidden; text-overflow: ellipsis; white-space: nowrap` |

#### `<p>` — Chức danh

| Class           | CSS tương đương              |
|-----------------|------------------------------|
| `text-sm`       | `font-size: 0.875rem` (14px) |
| `text-gray-500` | `color: #6b7280`             |

#### `<button>` — Follow button

| Class               | CSS tương đương                                   |
|---------------------|---------------------------------------------------|
| `px-4`              | `padding-left: 1rem; padding-right: 1rem` (16px)  |
| `py-2`              | `padding-top: 0.5rem; padding-bottom: 0.5rem` (8px)|
| `bg-blue-500`       | `background-color: #3b82f6`                       |
| `text-white`        | `color: #ffffff`                                  |
| `rounded-md`        | `border-radius: 0.375rem` (6px)                   |
| `hover:bg-blue-600` | Khi hover → `background-color: #2563eb`           |
| `focus:ring-2`      | Khi focus → `box-shadow: ring width 2px`          |
| `focus:ring-blue-300` | Khi focus → ring có màu `#93c5fd`               |

---

## Câu A2 (10đ) — Responsive & States

### 1. Prefix Responsive: `md:`, `lg:`, `xl:`

Tailwind dùng **mobile-first breakpoints** — prefix áp dụng cho breakpoint đó **trở lên**:

| Prefix | Breakpoint     | Min-width |
|--------|----------------|-----------|
| *(none)* | xs — mobile  | 0px       |
| `sm:`  | Small          | 640px     |
| `md:`  | Medium (tablet)| 768px     |
| `lg:`  | Large (desktop)| 1024px    |
| `xl:`  | Extra large    | 1280px    |
| `2xl:` | 2X large       | 1536px    |

**Ví dụ: `md:grid-cols-2 lg:grid-cols-4`**

```
< 768px   → grid-cols mặc định (thường grid-cols-1 nếu khai báo trước)
≥ 768px   → grid-template-columns: repeat(2, minmax(0, 1fr))   ← 2 cột
≥ 1024px  → grid-template-columns: repeat(4, minmax(0, 1fr))   ← 4 cột
```

```html
<!-- Ví dụ hoàn chỉnh: product grid -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  <!-- 1 cột mobile, 2 cột tablet, 4 cột desktop -->
</div>
```

---

### 2. State Modifiers

| Modifier       | CSS tương đương            | Giải thích                                                                   |
|----------------|----------------------------|------------------------------------------------------------------------------|
| `hover:`       | `:hover`                   | Khi người dùng di chuột vào element                                          |
| `focus:`       | `:focus`                   | Khi element được focus (click/tab vào input, button)                         |
| `active:`      | `:active`                  | Trong lúc đang click (giữ chuột)                                             |
| `group-hover:` | `.group:hover .child`      | Khi element **cha** (có class `group`) được hover — con mới thay đổi style   |

**Ví dụ `group-hover:`:**
```html
<div class="group flex items-center gap-3 p-4 hover:bg-gray-50">
  <span class="text-gray-600 group-hover:text-blue-500">Menu Item</span>
  <!-- Khi hover vào div cha, span con đổi màu sang xanh -->
  <svg class="opacity-0 group-hover:opacity-100">...</svg>
  <!-- Icon ẩn, chỉ hiện khi hover cha -->
</div>
```

---

### 3. Ẩn trên Mobile, Hiện dạng Flex trên Tablet+

**Bootstrap:** `d-none d-md-flex`

**Tailwind tương đương:**
```html
<div class="hidden md:flex">
  Nội dung này ẩn trên mobile, hiện flex từ tablet trở lên
</div>
```

- `hidden` → `display: none` (áp dụng từ 0px)
- `md:flex` → `display: flex` (ghi đè từ 768px trở lên)

**Các biến thể phổ biến:**

| Mục đích                         | Tailwind classes          |
|----------------------------------|---------------------------|
| Ẩn mobile, hiện block trên tablet | `hidden md:block`         |
| Ẩn mobile, hiện flex trên tablet  | `hidden md:flex`          |
| Hiện mobile, ẩn trên desktop      | `block lg:hidden`         |
| Chỉ hiện trên mobile              | `block md:hidden`         |

---

## PHẦN C — PHÂN TÍCH 

## Câu C1 (10đ) — Tailwind vs CSS thuần

### So sánh Component: Product Card

**CSS thuần:**

`index.html` (~20 dòng HTML + link CSS)
```html
<div class="product-card">
  <img src="product.jpg" alt="Product">
  <div class="card-body">
    <h3 class="card-title">Tên sản phẩm</h3>
    <p class="card-price">250.000₫</p>
    <button class="btn-cart">Thêm vào giỏ</button>
  </div>
</div>
```

`style.css` (~50 dòng)
```css
.product-card { border-radius: 8px; overflow: hidden; ... }
.product-card img { width: 100%; height: 200px; object-fit: cover; }
.card-body { padding: 1rem; }
.card-title { font-size: 1rem; font-weight: 600; ... }
/* ... v.v. */
```

**Tailwind:**

`index.html` (~20 dòng HTML, KHÔNG cần file CSS riêng)
```html
<div class="rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow">
  <img src="product.jpg" class="w-full h-48 object-cover" alt="Product">
  <div class="p-4">
    <h3 class="text-base font-semibold text-gray-800 mb-2">Tên sản phẩm</h3>
    <p class="text-red-500 font-bold text-xl">250.000₫</p>
    <button class="mt-3 w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
      Thêm vào giỏ
    </button>
  </div>
</div>
```

---

### Bảng so sánh

| Tiêu chí            | CSS thuần                                              | Tailwind                                                  |
|---------------------|--------------------------------------------------------|-----------------------------------------------------------|
| **HTML file size**  | Nhỏ hơn (class names ngắn, semantic)                  | Lớn hơn (nhiều class dài trong HTML)                      |
| **CSS file size**   | Có file riêng (~50 dòng cho 1 component)               | Gần như 0 (dùng utilities có sẵn)                         |
| **Tổng file size**  | Tương đương hoặc nhỏ hơn đôi chút                     | HTML lớn hơn nhưng CSS rất nhỏ (sau PurgeCSS)            |
| **Dễ đọc HTML**     | ✅ Tên class có ý nghĩa (`card-title`)                 | ❌ Khó đọc nếu nhiều class (nhưng quen thì nhanh hơn)    |
| **Dễ sửa style**    | Sửa trong CSS file (1 chỗ, ảnh hưởng nhiều element)   | Sửa trực tiếp trong HTML (phải sửa từng element)          |
| **Dễ debug**        | ✅ DevTools hiện class name có nghĩa                   | Trung bình (nhiều class, cần quen mới đọc được)            |

---

### Reusability — Dùng lại thế nào với `@apply`?

Khi component được dùng nhiều lần, Tailwind cho phép extract ra class riêng bằng `@apply`:

```css
/* Trong file CSS của bạn */
@layer components {
  .btn-primary {
    @apply px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 
           focus:ring-2 focus:ring-blue-300 transition-colors duration-200;
  }

  .product-card {
    @apply rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300;
  }
}
```

Sau đó trong HTML dùng như class thông thường:
```html
<button class="btn-primary">Follow</button>
<div class="product-card">...</div>
```

> **Lưu ý:** Tailwind team khuyến nghị dùng `@apply` **có chọn lọc** — chỉ cho các pattern lặp lại nhiều. Overusing `@apply` sẽ mất đi lợi thế của utility-first.

---

## Câu C2 (10đ) — Performance

### 1. Tại sao Tailwind CSS file nhỏ hơn Bootstrap?

**Bootstrap:**
- Ship toàn bộ ~1500+ CSS rules trong `bootstrap.min.css` (~22KB gzip, ~165KB raw)
- Dù chỉ dùng 10% tính năng, vẫn tải 100% CSS
- Không có cơ chế loại bỏ CSS không dùng (nếu không cấu hình thêm)

**Tailwind:**
- Trong development: Tailwind JIT generate **on-demand** — chỉ tạo CSS cho classes thực sự xuất hiện trong file
- Trong production: Tailwind scan toàn bộ source files và chỉ output CSS của classes được dùng
- Kết quả: Một dự án trung bình chỉ dùng **5–15KB CSS** (gzip), so với Bootstrap ~22KB

```
Bootstrap (unused code):    ████████████████████████ 165KB
Tailwind (JIT, production): ███ 8KB
```

---

### 2. Tailwind PurgeCSS / JIT — Nó loại bỏ gì?

**Tailwind JIT (Just-In-Time) Mode** — mặc định từ Tailwind v3:

**Cơ chế hoạt động:**

```
1. Bạn viết HTML: <div class="text-blue-500 mt-4 hover:bg-gray-100">
2. Tailwind JIT scan file và nhận ra 3 classes được dùng
3. Generate CSS chỉ cho 3 classes đó:
   .text-blue-500 { color: #3b82f6; }
   .mt-4 { margin-top: 1rem; }
   .hover\:bg-gray-100:hover { background-color: #f3f4f6; }
4. Tất cả utilities KHÔNG được dùng → KHÔNG có trong CSS output
```

**Tailwind loại bỏ:**
- Mọi utility class không xuất hiện trong source files (HTML, JSX, Vue, JS...)
- Mọi variant không được dùng (vd: nếu không dùng `active:`, nó không được tạo)
- Mọi màu sắc, kích thước không được reference

**Cấu hình trong `tailwind.config.js`:**
```javascript
module.exports = {
  content: [
    "./src/**/*.{html,js,jsx,tsx,vue}", // Scan các file này
  ],
  // Tailwind JIT chỉ giữ lại classes tìm thấy trong các file trên
}
```

> **Lưu ý quan trọng:** Không được dùng dynamic class names như `text-${color}-500` vì Tailwind scan bằng string matching — string đầy đủ phải xuất hiện trong source code.

---

### 3. Khi nào KHÔNG nên dùng TailwindCSS?

**Tình huống 1: Project có nhiều người không quen Tailwind (team mới hoặc legacy team)**

> Một team 5 developer, 3 người quen Bootstrap, 2 người chưa dùng Tailwind bao giờ.
> Codebase là một hệ thống quản lý nội bộ cần maintain lâu dài.

- HTML với 20+ classes mỗi element khó đọc với người mới
- Onboarding tốn thêm 1–2 tuần để quen Tailwind syntax
- Code review khó hơn: `class="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200 hover:bg-gray-50"` không dễ đọc bằng `class="nav-item"`
- **→ Dùng CSS Modules hoặc BEM + custom CSS phù hợp hơn**

---

**Tình huống 2: CMS-driven content / Email templates / Markdown-rendered HTML**

> Bạn xây một blog dùng WordPress (hoặc Strapi + markdown renderer). Nội dung bài viết được render từ Markdown hoặc Rich Text Editor — bạn không kiểm soát class names trong output HTML.

```html
<!-- WordPress/Markdown render ra: -->
<p>Đây là đoạn văn bản</p>
<h2>Tiêu đề</h2>
<ul><li>Mục 1</li></ul>
<!-- Không có Tailwind classes → Không có style! -->
```

- Tailwind hoạt động dựa trên utility classes trong HTML
- Content từ CMS/Markdown không có classes → mọi thứ trông giống nhau (không có style)
- Giải pháp Tailwind cho vấn đề này (`@tailwindcss/typography` plugin) khá cồng kềnh
- **→ Dùng CSS thuần với selectors (h1, p, ul li) phù hợp hơn nhiều**

**Tình huống bổ sung 3: Thiết kế cực kỳ độc đáo với nhiều animation phức tạp**

> Một landing page nghệ thuật với 30+ animation tùy chỉnh, clip-path phức tạp, custom properties.

- Tailwind có thể handle một phần nhưng phần lớn vẫn phải viết CSS thuần
- Class names trở nên cực dài và khó đọc
- **→ CSS thuần / CSS-in-JS / SCSS sẽ expressive và maintainable hơn**

---