# Bài Tập HTML5 — Forms, Validation, Accessibility & Media

---
# PHẦN A — KIỂM TRA ĐỌC HIỂU

## Câu A1 (5đ) — Input Types

> 10 loại `input` trong HTML5, mỗi loại kèm giao diện, validation và use case E-Commerce.

```
1. type="email"
   → Giao diện: Ô nhập text thông thường, bàn phím mobile hiện thêm phím "@"
   → Validation: Bắt buộc có "@" và domain hợp lệ (vd: abc@gmail.com)
   → E-Commerce: Form đăng ký tài khoản, đăng ký nhận newsletter

2. type="password"
   → Giao diện: Ô nhập text, ký tự bị ẩn bằng dấu chấm/dấu hoa thị
   → Validation: Không tự kiểm định format, chỉ hỗ trợ minlength/maxlength
   → E-Commerce: Trang đăng nhập, trang đổi mật khẩu tài khoản

3. type="number"
   → Giao diện: Ô nhập số kèm 2 mũi tên tăng/giảm (spinner), bàn phím số trên mobile
   → Validation: Chỉ chấp nhận số, kiểm tra min/max/step nếu có
   → E-Commerce: Ô nhập số lượng sản phẩm trong giỏ hàng (min="1")

4. type="tel"
   → Giao diện: Ô nhập text, mobile hiện bàn phím số (có dấu #, *)
   → Validation: Không tự validate format — cần kết hợp pattern để kiểm tra
   → E-Commerce: Form thanh toán, nhập số điện thoại nhận thông báo giao hàng

5. type="date"
   → Giao diện: Ô chọn ngày, hiện date-picker của trình duyệt (lịch thả xuống)
   → Validation: Kiểm tra min/max ngày, từ chối ngày không hợp lệ
   → E-Commerce: Chọn ngày giao hàng mong muốn, chọn ngày hết hạn thẻ tín dụng

6. type="range"
   → Giao diện: Thanh kéo ngang (slider), không hiện giá trị mặc định
   → Validation: Ép về min/max tự động, không báo lỗi cho user
   → E-Commerce: Bộ lọc giá sản phẩm (min–max price filter)

7. type="checkbox"
   → Giao diện: Ô vuông tick, có thể chọn nhiều cùng lúc
   → Validation: Không có validation nội tại (trừ required trên một checkbox đơn)
   → E-Commerce: Lọc sản phẩm theo nhiều thương hiệu, màu sắc, tính năng

8. type="radio"
   → Giao diện: Ô tròn, chỉ chọn được một trong nhóm cùng name
   → Validation: Nếu required, buộc phải chọn một giá trị trong nhóm
   → E-Commerce: Chọn phương thức vận chuyển (tiêu chuẩn / nhanh / hỏa tốc)

9. type="file"
   → Giao diện: Nút "Choose File" + tên file đã chọn, hỗ trợ accept, multiple
   → Validation: Kiểm tra loại file qua accept (vd: accept="image/*")
   → E-Commerce: Upload ảnh sản phẩm (shop), upload hóa đơn hoàn tiền, ảnh review

10. type="search"
    → Giao diện: Ô nhập text có nút "×" xóa nhanh, bàn phím mobile hiện nút "Search"
    → Validation: Không có validation tự động
    → E-Commerce: Thanh tìm kiếm sản phẩm (search bar) trên header
```

---

## Câu A2 (5đ) — Validation Attributes

### Dự đoán (trước khi chạy code)

**Trường hợp 1 — `type="text" required value=""`**

```html
<input type="text" required value="">
```

> **Dự đoán:** Form **KHÔNG được submit**. Trình duyệt hiện tooltip lỗi ngay tại ô input:
> *"Please fill out this field"* (Chrome) / *"Vui lòng điền vào trường này"* (bản VN).
>
> **Tại sao:** Thuộc tính `required` bắt buộc trường không được rỗng. Khi `value=""`, constraint `valueMissing` = `true`, form validation bắt lỗi trước khi gửi.

---

**Trường hợp 2 — `type="email" value="abc"`**

```html
<input type="email" value="abc">
```

> **Dự đoán:** Form **KHÔNG được submit**. Tooltip lỗi:
> *"Please include an '@' in the email address."*
>
> **Tại sao:** `type="email"` có built-in format validation — giá trị hợp lệ phải chứa `@` và có domain. Chuỗi `"abc"` không thỏa mãn → constraint `typeMismatch` = `true`.

---

**Trường hợp 3 — `type="number" min="1" max="10" value="15"`**

```html
<input type="number" min="1" max="10" value="15">
```

> **Dự đoán:** Form **KHÔNG được submit**. Tooltip lỗi:
> *"Value must be less than or equal to 10."*
>
> **Tại sao:** Giá trị `15` vượt quá `max="10"` → constraint `rangeOverflow` = `true`. Trình duyệt tự động block submission và chỉ trường vi phạm.

---

**Trường hợp 4 — `type="text" pattern="[0-9]{10}" value="abc123"`**

```html
<input type="text" pattern="[0-9]{10}" value="abc123">
```

> **Dự đoán:** Form **KHÔNG được submit**. Tooltip lỗi:
> *"Please match the requested format."*
>
> **Tại sao:** Regex `[0-9]{10}` yêu cầu đúng 10 chữ số. `"abc123"` chứa chữ cái và chỉ có 6 ký tự → constraint `patternMismatch` = `true`. Tooltip không lộ regex (bảo mật), chỉ thông báo chung chung — nên kết hợp `title="Nhập đúng 10 chữ số"` để UX tốt hơn.

---

**Trường hợp 5 — `type="password" minlength="8" value="123"`**

```html
<input type="password" minlength="8" value="123">
```

> **Dự đoán:** Form **KHÔNG được submit**. Tooltip lỗi:
> *"Please lengthen this text to 8 characters or more (you are currently using 3 characters)."*
>
> **Tại sao:** `minlength="8"` yêu cầu tối thiểu 8 ký tự. `"123"` chỉ có 3 ký tự → constraint `tooShort` = `true`.

---

### So sánh dự đoán vs. thực tế

File `validation_test.html` đã được tạo và chạy. Screenshot thực tế cho thấy:

| TC | Dự đoán | Thực tế | Khớp? |
|----|---------|---------|-------|
| 1  | Tooltip "fill out this field" tại TC1 | ✅ Chặn submit, tooltip xuất hiện tại TC1 | ✅ |
| 2  | Tooltip email format tại TC2 | ✅ Tooltip "@" tại TC2 | ✅ |
| 3  | Tooltip "≤ 10" tại TC3 | ✅ Tooltip max tại TC3 | ✅ |
| 4  | Tooltip "match format" tại TC4 | ✅ Tooltip pattern tại TC4 | ✅ |
| 5  | Tooltip minlength tại TC5 | ✅ Tooltip minlength tại TC5 | ✅ |

> **Ghi chú quan trọng:** Trình duyệt validate từ trên xuống, **chỉ hiện lỗi của trường đầu tiên vi phạm**. Sau khi sửa TC1, mới hiện lỗi TC2, v.v. — đây là hành vi mặc định của browser-native form validation.

---

## Câu A3 (5đ) — Accessibility

### 1. Tại sao `<label for="email">` quan trọng cho screen reader?

`<label for="id">` tạo **liên kết ngữ nghĩa** (programmatic association) giữa nhãn văn bản và ô input tương ứng.

Khi screen reader (NVDA, VoiceOver, JAWS...) focus vào một ô input, nó đọc:
- **Có `<label>`:** *"Email address, edit text"* → người dùng hiểu ngay trường này nhập gì
- **Không có `<label>`:** *"edit text"* → không rõ trường này dùng để làm gì

**Ngoài ra**, liên kết `for` còn:
- Tăng vùng click — click vào chữ nhãn cũng focus vào ô input (UX tốt hơn cho chuột và cảm ứng)
- Là yêu cầu bắt buộc theo **WCAG 2.1 — Success Criterion 1.3.1 (Info and Relationships)**

```html
<!-- ✅ Đúng — screen reader đọc "Email, edit text" -->
<label for="email">Email</label>
<input type="email" id="email" name="email">

<!-- ❌ Sai — screen reader chỉ đọc "edit text" -->
<input type="email" placeholder="Email" name="email">
```

> ⚠️ `placeholder` **KHÔNG thay thế được** `<label>`: placeholder biến mất khi gõ, màu thường quá nhạt (contrast thấp), và nhiều screen reader không đọc placeholder.

---

### 2. Khi nào dùng `<fieldset>` + `<legend>`?

Dùng khi cần **nhóm các input có liên quan logic** vào một khối, đặc biệt với `radio` và `checkbox` — nơi các lựa chọn cùng thuộc về một câu hỏi/chủ đề.

Screen reader sẽ đọc: *"[legend text], [label của từng input]"* → người dùng hiểu context của nhóm.

**Ví dụ 1 — Phương thức thanh toán (radio):**
```html
<fieldset>
  <legend>Phương thức thanh toán</legend>
  <label><input type="radio" name="payment" value="cod"> Thanh toán khi nhận hàng (COD)</label>
  <label><input type="radio" name="payment" value="card"> Thẻ tín dụng / Visa</label>
  <label><input type="radio" name="payment" value="momo"> Ví MoMo</label>
</fieldset>
```
> Screen reader đọc: *"Phương thức thanh toán, Thanh toán khi nhận hàng, radio button, 1 of 3"*

**Ví dụ 2 — Địa chỉ giao hàng (nhóm text inputs):**
```html
<fieldset>
  <legend>Địa chỉ giao hàng</legend>
  <label for="street">Số nhà, tên đường</label>
  <input type="text" id="street" name="street">
  <label for="city">Thành phố</label>
  <input type="text" id="city" name="city">
  <label for="zip">Mã bưu chính</label>
  <input type="text" id="zip" name="zip" pattern="[0-9]{6}">
</fieldset>
```

---

### 3. `aria-label` dùng khi nào? Tại sao không dùng khi đã có `<label>`?

**`aria-label` dùng khi không thể có `<label>` hiển thị trong UI**, tức là khi nhãn văn bản sẽ gây mất thẩm mỹ hoặc trùng lặp với ngữ cảnh đã rõ ràng.

**Các trường hợp hợp lý:**
```html
<!-- Icon-only button — không có text hiển thị -->
<button aria-label="Thêm vào giỏ hàng">
  <svg><!-- icon giỏ hàng --></svg>
</button>

<!-- Search bar với icon search, không cần label riêng -->
<input type="search" aria-label="Tìm kiếm sản phẩm" placeholder="Nhập tên sản phẩm...">

<!-- Nhiều ô nhập cùng loại trong table, cần phân biệt từng hàng -->
<input type="number" aria-label="Số lượng iPhone 16 Pro">
```

**Tại sao KHÔNG dùng `aria-label` khi đã có `<label>`?**

Vì `aria-label` sẽ **ghi đè** (override) nội dung của `<label>` khi screen reader đọc — tạo ra sự không nhất quán giữa những gì nhìn thấy và những gì nghe thấy. Điều này vi phạm nguyên tắc accessibility và gây confuse.

```html
<!-- ❌ Xung đột — screen reader đọc "Nhập email" nhưng màn hình hiện "Email" -->
<label for="email">Email</label>
<input type="email" id="email" aria-label="Nhập email">

<!-- ✅ Đúng — chỉ dùng label, đủ và nhất quán -->
<label for="email">Email</label>
<input type="email" id="email">
```

> **Nguyên tắc:** Luôn ưu tiên `<label>` (visible label) → `aria-labelledby` → `aria-label` (last resort). `aria-label` là giải pháp cho trường hợp UI không cho phép hiện label nhìn thấy được.

---

## Câu A4 (5đ) — Media

### 1. `loading="lazy"` trên `<img>`

```html
<img src="product.jpg" alt="..." loading="lazy">
```

**Cơ chế hoạt động:**
Trình duyệt chỉ tải ảnh khi ảnh đó **sắp vào viewport** (vùng nhìn thấy của người dùng). Các ảnh nằm xa dưới trang không được tải ngay từ đầu.

**Cải thiện:**
- **Giảm thời gian tải trang ban đầu (initial load time)** — tiết kiệm bandwidth cho ảnh chưa cần thiết
- **Tiết kiệm dữ liệu người dùng** — đặc biệt quan trọng trên mobile
- **Cải thiện điểm Core Web Vitals** (LCP, TBT) — ảnh below-the-fold không block render

**Khi KHÔNG nên dùng `loading="lazy"`:**
- **Ảnh nằm above-the-fold** (logo, hero banner, ảnh đầu trang) — lazy load sẽ làm chậm LCP, gây hiện tượng layout shift
- **Ảnh được prioritize** — dùng `fetchpriority="high"` thay thế cho ảnh quan trọng
- **Môi trường không hỗ trợ JS** hoặc browser cũ (cần polyfill)

```html
<!-- ❌ Không nên lazy cho hero banner -->
<img src="hero-banner.jpg" alt="Sale mùa hè" loading="lazy">

<!-- ✅ Nên lazy cho ảnh sản phẩm trong danh sách dài -->
<img src="product-thumbnail.jpg" alt="Áo thun nam" loading="lazy">
```

---

### 2. Tại sao cung cấp nhiều `<source>` trong `<video>`?

```html
<video controls>
  <source src="video.webm" type="video/webm">
  <source src="video.mp4" type="video/mp4">
  <source src="video.ogv" type="video/ogg">
  <p>Trình duyệt của bạn không hỗ trợ video.</p>
</video>
```

**Lý do:**
- **Tương thích đa trình duyệt** — không trình duyệt nào hỗ trợ 100% tất cả codec. Safari ưu tiên H.264/MP4, Firefox hỗ trợ WebM/VP9, Chrome hỗ trợ cả hai
- **Tối ưu chất lượng và dung lượng** — WebM (VP9/AV1) thường nhỏ hơn MP4 cùng chất lượng
- **Fallback graceful** — trình duyệt đọc từ trên xuống, chọn `<source>` đầu tiên nó hiểu được

**3 format phổ biến:**

| Format | Container | Codec | Hỗ trợ tốt ở |
|--------|-----------|-------|--------------|
| `.webm` | WebM | VP8/VP9/AV1 | Chrome, Firefox, Edge |
| `.mp4` | MP4 | H.264/H.265 | Safari, Chrome, Edge, mobile |
| `.ogv` | Ogg | Theora | Firefox (legacy) |

---

### 3. Thuộc tính `alt` trên `<img>`

`alt` (alternative text) cung cấp **mô tả văn bản** cho ảnh, phục vụ:
- Screen reader đọc cho người khiếm thị
- Hiển thị khi ảnh bị lỗi tải
- Công cụ tìm kiếm (SEO)
- Trình duyệt text-only

**Viết `alt` cho 3 trường hợp:**

**1. Ảnh sản phẩm iPhone 16:**
```html
<!-- ✅ Mô tả cụ thể: tên, màu, góc chụp nếu cần -->
<img src="iphone16.jpg" alt="iPhone 16 Pro Max màu Titan Tự Nhiên, mặt trước">

<!-- ❌ Quá chung chung -->
<img src="iphone16.jpg" alt="điện thoại">

<!-- ❌ Thừa từ "image of" — screen reader đã nói "image" trước đó -->
<img src="iphone16.jpg" alt="Ảnh iPhone 16">
```

**2. Ảnh trang trí (decorative):**
```html
<!-- ✅ alt="" rỗng — screen reader bỏ qua hoàn toàn, KHÔNG dùng alt="decorative" -->
<img src="background-wave.svg" alt="">

<!-- ❌ Mô tả ảnh trang trí gây nhiễu cho screen reader -->
<img src="background-wave.svg" alt="Sóng biển trang trí">
```

**3. Ảnh biểu đồ doanh thu Q1/2026:**
```html
<!-- ✅ Mô tả ý nghĩa dữ liệu, không phải hình thức -->
<img src="revenue-q1-2026.png" 
     alt="Biểu đồ cột doanh thu Q1/2026: tháng 1 đạt 4.2 tỷ, tháng 2 đạt 3.8 tỷ, tháng 3 đạt 5.1 tỷ đồng">

<!-- Nếu biểu đồ phức tạp, nên kết hợp với <figure> + <figcaption> + bảng dữ liệu riêng -->
```

---

## Câu A5 (5đ) — So sánh `<figure>` vs `<img>`

### Phân tích 2 cách

```html
<!-- Cách 1 — Ảnh độc lập -->
<img src="product.jpg" alt="iPhone">

<!-- Cách 2 — Ảnh có chú thích -->
<figure>
    <img src="product.jpg" alt="iPhone 16 Pro Max 256GB Titan">
    <figcaption>iPhone 16 Pro Max — 25.990.000đ</figcaption>
</figure>
```

**Sự khác biệt ngữ nghĩa:**

| Tiêu chí | `<img>` đơn | `<figure>` + `<figcaption>` |
|----------|------------|---------------------------|
| Ngữ nghĩa HTML | Ảnh đơn giản, nội tuyến | Đơn vị tự trị (self-contained unit) có chú thích |
| Screen reader | Đọc alt text | Đọc alt text → "figure" → đọc figcaption |
| Di chuyển ảnh | Ảnh không có context riêng | Ảnh + caption luôn đi cùng nhau |
| SEO | Chỉ alt text | Thêm tín hiệu từ figcaption |
| CSS targeting | `.product img` | `figure`, `figcaption` tách biệt rõ |

---

### Khi nào dùng **Cách 1** (`<img>` đơn)?

Dùng khi ảnh **không cần caption đi kèm**, là phần trang trí hoặc hỗ trợ nội dung, không mang thông tin tự độc lập.

**Ví dụ 1 — Icon / logo trong header:**
```html
<a href="/" aria-label="Trang chủ Shopee">
  <img src="shopee-logo.svg" alt="Shopee">
</a>
```
> Logo không cần caption, nó là phần của navigation, không phải nội dung tự trị.

**Ví dụ 2 — Ảnh thumbnail trong danh sách sản phẩm:**
```html
<article class="product-card">
  <a href="/iphone16">
    <img src="iphone16-thumb.jpg" alt="iPhone 16 Pro Max 256GB Titan" loading="lazy">
  </a>
  <h3>iPhone 16 Pro Max</h3>
  <p class="price">25.990.000đ</p>
</article>
```
> Thông tin sản phẩm đã có ở `<h3>` và `<p>` bên ngoài — không cần thêm `<figure>`. Ảnh chỉ là phần minh họa trong layout.

---

### Khi nào dùng **Cách 2** (`<figure>` + `<figcaption>`)?

Dùng khi **ảnh + chú thích là một đơn vị thông tin hoàn chỉnh**, có thể di chuyển ra khỏi vị trí trong văn bản mà vẫn giữ nguyên ý nghĩa (như ảnh trong sách, bài báo, bảng giá).

**Ví dụ 1 — Trang chi tiết sản phẩm với gallery ảnh có mô tả:**
```html
<figure>
  <img src="iphone16-back.jpg" alt="iPhone 16 Pro Max nhìn từ phía sau, camera 48MP">
  <figcaption>
    Camera chính 48MP, khẩu độ f/1.78 — Chụp đêm xuất sắc
  </figcaption>
</figure>
```
> Caption bổ sung thông tin marketing/kỹ thuật không thể nhét vào `alt`. Ảnh + caption là đơn vị tự trị.

**Ví dụ 2 — Blog/bài đánh giá sản phẩm (review page):**
```html
<figure>
  <img src="benchmark-chart.png" 
       alt="Biểu đồ benchmark AnTuTu: iPhone 16 đạt 1.850.000 điểm, cao nhất trong các model 2025">
  <figcaption>
    Kết quả benchmark AnTuTu v10 — iPhone 16 Pro dẫn đầu phân khúc cao cấp năm 2025
  </figcaption>
</figure>
```
> Biểu đồ + chú thích là nội dung có thể trích dẫn độc lập, hoàn toàn hợp lý với `<figure>`.

---

### Tóm tắt

```
Ảnh là minh họa/trang trí trong layout?
  → Dùng <img> đơn

Ảnh cần một chú thích gắn liền (giá, mô tả kỹ thuật, nguồn ảnh, kết quả...)?
  → Dùng <figure> + <figcaption>

Ảnh + caption có thể "tách ra" khỏi trang mà vẫn có nghĩa?
  → Chắc chắn dùng <figure>
```

# PHẦN C — PHÂN TÍCH & SUY LUẬN 
---

## CÂU C1 — Debug Form

### Phân tích: 8 lỗi được tìm thấy

---

**Lỗi 1: Dòng 1 — `<form>` thiếu `action` và `method`, vi phạm best practices**

`<form>` không có `action` (URL xử lý) và `method` (HTTP method).
Trình duyệt sẽ dùng mặc định `method="GET"` — gửi dữ liệu nhạy cảm
(mật khẩu, email) lên URL dưới dạng query string, rất nguy hiểm.

```html
<!-- ❌ Sai -->
<form>

<!-- ✅ Sửa -->
<form action="/register" method="POST">
```

---

**Lỗi 2: Dòng 2 — "Tên:" là text node thuần, không phải `<label for>`;
input thiếu `id`, `name`, `required` — vi phạm accessibility & validation**

Text node không liên kết với input nên screen reader không đọc được.
Thiếu `name` khiến giá trị không được gửi lên server.
Thiếu `required` khiến bỏ trống vẫn submit được.

```html
<!-- ❌ Sai -->
Tên: <input type="text">

<!-- ✅ Sửa -->
<label for="full-name">Họ và tên:</label>
<input
  type="text"
  id="full-name"
  name="full_name"
  placeholder="Nguyễn Văn An"
  required
  minlength="2"
  maxlength="50"
/>
```

---

**Lỗi 3: Dòng 4 — Input email thiếu `<label>`, `id`, `name`, `required`
— vi phạm accessibility & validation**

`placeholder` KHÔNG thay thế được `<label>`.
Placeholder biến mất khi người dùng bắt đầu gõ,
gây mất context; screen reader không thông báo field này là gì.

```html
<!-- ❌ Sai -->
<input type="email" placeholder="Email của bạn">

<!-- ✅ Sửa -->
<label for="email">Email:</label>
<input
  type="email"
  id="email"
  name="email"
  placeholder="example@email.com"
  required
  autocomplete="email"
/>
```

---

**Lỗi 4: Dòng 6 — Input password thiếu `<label>`, `id`, `name`, `required`
— vi phạm accessibility & validation**

Tương tự lỗi 3, ngoài ra thiếu `minlength`/`pattern` để enforce
độ phức tạp mật khẩu.

```html
<!-- ❌ Sai -->
<input type="password" placeholder="Mật khẩu">

<!-- ✅ Sửa -->
<label for="password">Mật khẩu:</label>
<input
  type="password"
  id="password"
  name="password"
  placeholder="Tối thiểu 8 ký tự, 1 chữ hoa, 1 số"
  required
  minlength="8"
  pattern="(?=.*[A-Z])(?=.*[0-9]).{8,}"
  title="Mật khẩu cần ít nhất 8 ký tự, 1 chữ hoa và 1 chữ số"
  autocomplete="new-password"
/>
```

---

**Lỗi 5: Dòng 7 — Input "Nhập lại mật khẩu" thiếu `<label>`, `id`, `name`
và không có hướng dẫn rõ ràng — vi phạm accessibility & UX**

Cũng cần nhắc rõ trong `title`/`aria-describedby` rằng phải trùng
với mật khẩu phía trên (dù HTML không tự validate được — phải dùng JS).

```html
<!-- ❌ Sai -->
<input type="password" placeholder="Nhập lại mật khẩu">

<!-- ✅ Sửa -->
<label for="confirm-password">Xác nhận mật khẩu:</label>
<input
  type="password"
  id="confirm-password"
  name="confirm_password"
  placeholder="Nhập lại mật khẩu"
  required
  minlength="8"
  pattern="(?=.*[A-Z])(?=.*[0-9]).{8,}"
  title="Phải trùng với mật khẩu đã nhập — HTML không tự validate, cần JavaScript"
  autocomplete="new-password"
/>
```

---

**Lỗi 6: Dòng 9 — Phone dùng `type="text"` thay vì `type="tel"`,
và `value="0901234567"` thay vì `placeholder` — vi phạm UX & best practices**

`type="text"` không mở bàn phím số trên mobile.
Dùng `value=` hardcode số thật là dữ liệu giả — người dùng có thể
quên xóa đi, dẫn đến gửi sai thông tin. Phải dùng `placeholder`.
Ngoài ra thiếu `<label>`, `id`, `name`, `pattern`.

```html
<!-- ❌ Sai -->
Phone: <input type="text" value="0901234567">

<!-- ✅ Sửa -->
<label for="phone">Số điện thoại:</label>
<input
  type="tel"
  id="phone"
  name="phone"
  placeholder="0901234567"
  pattern="[0-9]{10}"
  title="Số điện thoại phải gồm đúng 10 chữ số"
  required
  autocomplete="tel"
/>
```

---

**Lỗi 7: Dòng 12 — `<select>` thiếu `<label>`, `id`, `name`,
và thiếu option placeholder — vi phạm accessibility & UX**

Không có `<label>` → screen reader không biết `<select>` này dùng để
chọn gì. Không có `name` → giá trị không được submit. Không có option
mặc định disabled → người dùng không biết cần phải chọn.

```html
<!-- ❌ Sai -->
<select>
    <option>Hà Nội</option>
    <option>TP.HCM</option>
</select>

<!-- ✅ Sửa -->
<label for="city">Thành phố:</label>
<select id="city" name="city" required>
    <option value="" disabled selected>-- Chọn thành phố --</option>
    <option value="HN">Hà Nội</option>
    <option value="HCM">TP. Hồ Chí Minh</option>
</select>
```

---

**Lỗi 8: Dòng 17 — `<label>` điều khoản không có `for` attribute
VÀ thiếu hoàn toàn `<input type="checkbox">` — vi phạm structure & accessibility**

`<label>` trống (không có `for`) không liên kết với bất kỳ input nào.
Quan trọng hơn, `<input type="checkbox">` bị thiếu hoàn toàn —
đây là field bắt buộc phải có `required` và phải gắn với label.

```html
<!-- ❌ Sai -->
<label>
    Tôi đồng ý điều khoản
</label>

<!-- ✅ Sửa -->
<input
  type="checkbox"
  id="terms"
  name="terms"
  value="agreed"
  required
/>
<label for="terms">
    Tôi đồng ý với <a href="/terms" target="_blank">Điều khoản dịch vụ</a>
</label>
```

---

### Form sửa 

```html
<form action="/register" method="POST">

  <div>
    <label for="full-name">Họ và tên:</label>
    <input
      type="text"
      id="full-name"
      name="full_name"
      placeholder="Nguyễn Văn An"
      required
      minlength="2"
      maxlength="50"
      autocomplete="name"
    />
  </div>

  <div>
    <label for="email">Email:</label>
    <input
      type="email"
      id="email"
      name="email"
      placeholder="example@email.com"
      required
      autocomplete="email"
    />
  </div>

  <div>
    <label for="password">Mật khẩu:</label>
    <input
      type="password"
      id="password"
      name="password"
      placeholder="Tối thiểu 8 ký tự, 1 chữ hoa, 1 số"
      required
      minlength="8"
      pattern="(?=.*[A-Z])(?=.*[0-9]).{8,}"
      title="Mật khẩu cần ít nhất 8 ký tự, 1 chữ hoa và 1 chữ số"
      autocomplete="new-password"
    />
  </div>

  <div>
    <label for="confirm-password">Xác nhận mật khẩu:</label>
    <input
      type="password"
      id="confirm-password"
      name="confirm_password"
      placeholder="Nhập lại mật khẩu"
      required
      minlength="8"
      pattern="(?=.*[A-Z])(?=.*[0-9]).{8,}"
      title="Phải trùng với mật khẩu đã nhập"
      autocomplete="new-password"
    />
  </div>

  <div>
    <label for="phone">Số điện thoại:</label>
    <input
      type="tel"
      id="phone"
      name="phone"
      placeholder="0901234567"
      required
      pattern="[0-9]{10}"
      title="Số điện thoại phải gồm đúng 10 chữ số"
      autocomplete="tel"
    />
  </div>

  <div>
    <label for="city">Thành phố:</label>
    <select id="city" name="city" required>
      <option value="" disabled selected>-- Chọn thành phố --</option>
      <option value="HN">Hà Nội</option>
      <option value="HCM">TP. Hồ Chí Minh</option>
    </select>
  </div>

  <div>
    <input type="checkbox" id="terms" name="terms" value="agreed" required />
    <label for="terms">
      Tôi đồng ý với <a href="/terms" target="_blank">Điều khoản dịch vụ</a>
    </label>
  </div>

  <div>
    <button type="submit">Gửi</button>
  </div>

</form>
```

> **Lưu ý thêm:** `<input type="submit">` đã đổi thành `<button type="submit">`
> theo best practice — `<button>` linh hoạt hơn (có thể chứa HTML bên trong,
> dễ style hơn, hành vi giống nhau).

---
---

## CÂU C2 

---

### Câu C2.1 — Pattern regex cho CMND/CCCD và Số tài khoản

#### CMND/CCCD — đúng 12 chữ số

```html
<label for="cccd">Số CCCD:</label>
<input
  type="text"
  id="cccd"
  name="cccd"
  placeholder="012345678901"
  required
  pattern="[0-9]{12}"
  minlength="12"
  maxlength="12"
  inputmode="numeric"
  title="CCCD phải gồm đúng 12 chữ số"
/>
```

**Giải thích regex `[0-9]{12}`:**

| Thành phần | Ý nghĩa |
|---|---|
| `[0-9]` | Chỉ chấp nhận các ký tự là chữ số 0–9 |
| `{12}` | Phải xuất hiện đúng 12 lần |
| `pattern` bao toàn bộ | HTML tự thêm `^...$` — khớp cả chuỗi, không phải substring |

> Tại sao không dùng `\d`? `pattern` trong HTML dùng JS regex engine.
> `\d` trong một số môi trường có thể khớp cả Unicode digits (ví dụ: ١٢٣ tiếng Ả Rập).
> `[0-9]` an toàn hơn vì chỉ khớp đúng 10 chữ số ASCII.

---

#### Số tài khoản ngân hàng — 10 đến 15 chữ số

```html
<label for="account-number">Số tài khoản:</label>
<input
  type="text"
  id="account-number"
  name="account_number"
  placeholder="Từ 10 đến 15 chữ số"
  required
  pattern="[0-9]{10,15}"
  minlength="10"
  maxlength="15"
  inputmode="numeric"
  title="Số tài khoản phải gồm 10 đến 15 chữ số"
/>
```

**Giải thích regex `[0-9]{10,15}`:**

| Thành phần | Ý nghĩa |
|---|---|
| `[0-9]` | Chỉ chấp nhận chữ số |
| `{10,15}` | Cho phép từ 10 đến 15 ký tự (inclusive) |

---

#### PIN — đúng 6 chữ số, không hiển thị

```html
<label for="pin">Mã PIN:</label>
<input
  type="password"
  id="pin"
  name="pin"
  placeholder="6 chữ số"
  required
  pattern="[0-9]{6}"
  minlength="6"
  maxlength="6"
  inputmode="numeric"
  autocomplete="new-password"
  title="PIN phải gồm đúng 6 chữ số"
/>
```

> `type="password"` ẩn ký tự khi nhập.
> `inputmode="numeric"` mở bàn phím số trên mobile (nhưng KHÔNG giới hạn ký tự —
> `pattern` vẫn phải có để enforce).

---

### Câu C2.2 — HTML5 Validation có đủ an toàn cho ứng dụng ngân hàng không?

**Trả lời ngắn gọn: KHÔNG. HTML5 validation là tầng UX, không phải tầng bảo mật.**

#### Lý do chi tiết:

**1. HTML5 validation chạy hoàn toàn ở phía client (trình duyệt)**

Người dùng hoặc attacker có thể bypass bằng nhiều cách:
- Dùng DevTools xóa attribute `required`, `pattern`, `minlength`
- Gửi HTTP request trực tiếp bằng `curl`, Postman, Burp Suite — hoàn toàn bỏ qua form HTML
- Tắt JavaScript (nếu validation có dùng JS)
- Chỉnh sửa DOM trước khi submit

```bash
# Ví dụ: gửi dữ liệu không hợp lệ trực tiếp, bỏ qua HTML hoàn toàn
curl -X POST https://bank.example.com/api/transfer \
  -d "account=abc&amount=-999999&pin=wrong"
```

**2. Pattern regex có thể bị bypass qua encoding**

M��t số regex engine xử lý Unicode khác nhau.
Dữ liệu có thể được encode (URL encode, base64...) trước khi gửi.

**3. Không có bảo vệ chống tấn công tự động**

HTML validation không ngăn được brute-force PIN,
không có rate limiting, không detect bot.

#### Kết luận cho ứng dụng ngân hàng:

```
HTML5 Validation     → Tầng 1: UX feedback (giúp người dùng nhập đúng)
JavaScript Validation → Tầng 2: Real-time feedback nâng cao
Server-side Validation → Tầng 3: BẮT BUỘC — tuyến phòng thủ thực sự
Database Constraints  → Tầng 4: Bảo vệ tầng dữ liệu
```

---

### Câu C2.3 — 3 loại validation HTML5 KHÔNG THỂ làm, phải dùng JavaScript

**1. So sánh giá trị giữa hai field (cross-field validation)**

HTML5 không thể so sánh giá trị của field này với field khác.
Ví dụ điển hình: mật khẩu và xác nhận mật khẩu phải trùng nhau.

```javascript
// Phải dùng JS — HTML hoàn toàn bất lực
const pass    = document.getElementById('password');
const confirm = document.getElementById('confirm-password');

confirm.addEventListener('input', () => {
  confirm.setCustomValidity(
    confirm.value !== pass.value ? 'Mật khẩu không khớp' : ''
  );
});
```

**2. Kiểm tra tính tồn tại / duy nhất qua API (async validation)**

HTML5 không thể gọi server để kiểm tra username/email đã tồn tại chưa,
hay số tài khoản ngân hàng có hợp lệ không.

```javascript
// Phải dùng JS + fetch để gọi API
usernameInput.addEventListener('blur', async () => {
  const res  = await fetch(`/api/check-username?q=${usernameInput.value}`);
  const data = await res.json();
  usernameInput.setCustomValidity(
    data.taken ? 'Tên đăng nhập đã được sử dụng' : ''
  );
});
```

**3. Validation có điều kiện (conditional validation)**

HTML5 không thể thay đổi rules tùy theo trạng thái của field khác.
Ví dụ: nếu chọn "Chuyển khoản" thì số tài khoản mới `required`;
nếu chọn "COD" thì không cần.

```javascript
// Phải dùng JS để bật/tắt required động
paymentRadios.forEach(radio => {
  radio.addEventListener('change', () => {
    const isBankTransfer = radio.value === 'bank_transfer';
    accountInput.required = isBankTransfer;

    // HTML5 không có khái niệm "required tùy điều kiện"
  });
});
```

> **Các trường hợp khác cũng cần JS:**
> kiểm tra ngày kết thúc > ngày bắt đầu,
> tính toán giá trị hợp lệ theo context (VD: số tiền không vượt số dư),
> debounce để tránh spam validation, format mask (VD: tự thêm dấu chấm vào CMND).

---

### Câu C2.4 — 2 rủi ro bảo mật nếu chỉ validate Frontend, không validate Backend

#### Rủi ro 1: SQL Injection / Command Injection

Nếu Backend không validate và sanitize input, attacker có thể gửi
payload độc hại trực tiếp qua HTTP (bypass hoàn toàn HTML form):

```bash
# Attacker gửi thẳng bằng curl, bỏ qua HTML validation
curl -X POST https://bank.example.com/login \
  -d "username=admin' OR '1'='1&password=anything"
```

Nếu Backend dùng giá trị này trong SQL query mà không parameterize:

```sql
-- Query bị inject
SELECT * FROM users
WHERE username = 'admin' OR '1'='1' AND password = 'anything';
-- Kết quả: trả về tất cả users — attacker đăng nhập được không cần mật khẩu
```

**Hậu quả với ngân hàng số:** lộ toàn bộ dữ liệu khách hàng,
số tài khoản, lịch sử giao dịch, thậm chí thực thi lệnh trên database.

---

#### Rủi ro 2: Business Logic Bypass — gian lận dữ liệu tài chính

Attacker có thể gửi dữ liệu không hợp lệ về mặt nghiệp vụ mà
HTML validation không ngăn được:

```bash
# Gửi số tiền âm → có thể cộng tiền vào tài khoản thay vì trừ
curl -X POST https://bank.example.com/api/transfer \
  -d "from_account=123&to_account=456&amount=-500000"

# Gửi PIN dạng mảng để bypass so sánh kiểu dữ liệu
curl -X POST https://bank.example.com/api/verify-pin \
  -H "Content-Type: application/json" \
  -d '{"pin": ["6","6","6","6","6","6"]}'
  # Nếu server dùng != thay vì !==, mảng != chuỗi → bypass PIN check

# Brute-force PIN 6 chữ số (chỉ 1.000.000 khả năng)
for i in $(seq -w 0 999999); do
  curl -s -X POST .../verify-pin -d "pin=$i" | grep -q "success" && echo "PIN: $i"
done
```

**Hậu quả với ngân hàng số:**
- Giao dịch sai số tiền → thất thoát tài chính
- Bypass xác thực PIN → chiếm đoạt tài khoản
- Không có rate limiting trên Backend → brute-force PIN toàn bộ hệ thống

---

### Tổng kết chiến lược validation đúng đắn

```
┌─────────────────────────────────────────────────────────┐
│                   MÔ HÌNH DEFENSE IN DEPTH              │
├──────────────────┬──────────────────────────────────────┤
│ Tầng             │ Trách nhiệm                          │
├──────────────────┼──────────────────────────────────────┤
│ HTML5 Attributes │ UX: hướng dẫn người dùng nhập đúng  │
│ JavaScript       │ Real-time feedback, cross-field       │
│ Server-side      │ BẮT BUỘC: nguồn sự thật duy nhất    │
│ Database         │ Constraints, transactions, integrity  │
│ WAF / Rate limit │ Chống brute-force, bot, injection     │
└──────────────────┴──────────────────────────────────────┘

Nguyên tắc vàng: "Never trust the client."
M��i dữ liệu từ phía người dùng đều phải được coi là
không đáng tin cho đến khi server tự xác minh.
```