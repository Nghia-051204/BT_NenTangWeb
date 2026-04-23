# PHẦN A: ĐỌC HIỂU

__Câu A1:__

I. 5 bước xảy ra khi truy cập https://shopee.vn (theo đúng thứ tự):
- Dựa trên quy trình "Cuộc hành trình 0.3 giây" và kiến trúc "Nhà hàng Online" trong tài liệu (Introduction và phần 1), các bước diễn ra là:

1. Gửi Request (DNS Lookup & Kết nối): Trình duyệt (Client) tiếp nhận URL, tìm địa chỉ IP của server Shopee và gửi yêu cầu (HTTP Request) qua Internet (đi qua router, nhà mạng, cáp quang...).

2. Server xử lý: Server của Shopee nhận được yêu cầu, "đầu bếp" (Server) sẽ xử lý logic, truy xuất dữ liệu (ví dụ: các mặt hàng sale, giỏ hàng của cậu).

3. Gửi Response: Server phản hồi (HTTP Response) bằng cách gửi các file cần thiết (HTML, CSS, JS) ngược trở lại cho trình duyệt qua "anh shipper" Internet.

4. Parse & Execute (Phân tích mã): Trình duyệt nhận file, bắt đầu đọc bản vẽ kiến trúc (Parse HTML), đọc thiết kế nội thất (Parse CSS) và lắp đặt hệ thống tương tác (Execute JS).

5. Paint & Render (Hiển thị): Trình duyệt hoàn thiện việc vẽ các điểm ảnh lên màn hình để cậu thấy giao diện trang chủ Shopee.
- Mở một trình duyệt web trang shopee và đánh giá kết quả tab Network:

![img](screenshots/image.png)

__Câu A2:__

- Tại sao Google đánh giá thấp?

Google đọc HTML để **hiểu cấu trúc và nội dung** trang. Khi toàn bộ dùng `<div>`, Google không phân biệt được đâu là header, đâu là nội dung chính, đâu là sản phẩm → không index tốt → SEO kém.

---

❌ 4 Lỗi Semantic (+ bonus)

**Lỗi 1 — `<!DOCTYPE>` thiếu khai báo loại tài liệu**  
`<!DOCTYPE>` không hợp lệ → trình duyệt không biết đây là HTML5, có thể vào quirks mode. Sửa thành `<!DOCTYPE html>`.

**Lỗi 2 — `<title>` thiếu thẻ đóng**  
`<title>Trang web` không có `</title>` → trình duyệt có thể nuốt luôn thẻ `<meta>` phía sau vào trong title.

**Lỗi 3 — `charset` sai giá trị**  
`charset="utf8"` không phải tên chuẩn → một số trình duyệt không nhận. Giá trị đúng là `charset="UTF-8"` (có dấu gạch ngang).

**Lỗi 4 — `<h1>` dùng thẻ mở thay vì thẻ đóng**  
`<h1>Welcome to ShopTLU<h1>` → thẻ đóng phải là `</h1>`, không phải `<h1>`.

**Lỗi 5 — `<h1>` nằm ngoài `<header>` (semantic)**  
`<h1>` xuất hiện trước `<header>` → vi phạm cấu trúc ngữ nghĩa, tiêu đề trang nên nằm bên trong `<header>`.

**Lỗi 6 — `<a>` đóng sai thẻ**  
`<a href="home">Trang chủ<a>` dùng thẻ mở thay vì thẻ đóng → phải là `</a>`.

**Lỗi 7 — `<img>` thiếu nháy và thiếu `alt`**  
`src=iphone.jpg` không có dấu nháy và không có thuộc tính `alt` → Google Images không index được, vi phạm accessibility. Sửa thành `src="iphone.jpg" alt="iPhone 16 Pro"`.

**Lỗi 8 — `<b>` và `<p>` lồng nhau sai thứ tự**  
`<p>Giá: <b>25.990.000đ</p></b>` → thẻ `<b>` mở bên trong `<p>` nhưng lại đóng bên ngoài, sai cấu trúc lồng nhau. Sửa thành `<p>Giá: <b>25.990.000đ</b></p>`.

**Lỗi 9 — Header bảng dùng `<td>` thay vì `<th>` (semantic)**  
`<td>Tên</td>` và `<td>Giá</td>` ở hàng đầu bảng không truyền tín hiệu tiêu đề → Google và screen reader không nhận ra đây là header. Sửa thành `<th>`.

**Lỗi 10 — Dùng `<main>` thứ hai thay vì `<aside>` (semantic)**  
Một trang chỉ được có một phần tử `<main>`. Sidebar content nằm trong `<main>` thứ hai → không hợp lệ. Sửa thành `<aside>` và đưa vào trong `<main>` hiện có.

**Lỗi 11 — `<p>` trong `<footer>` thiếu thẻ đóng**  
`<p>Copyright 2026` không có `</p>` → HTML không hợp lệ, dễ gây lỗi render.

**Lỗi 12 — Thiếu thẻ đóng `</html>`**  
File kết thúc mà không có `</html>` → tài liệu HTML không hoàn chỉnh.

---

## ✅ Code đã sửa

```html
<!DOCTYPE html>
<html lang="vi">
<head>
    <title>Trang web</title>
    <meta charset="UTF-8">
</head>
<body>
    <header>
        <h1>Welcome to ShopTLU</h1>
        <nav>
            <a href="home">Trang chủ</a>
            <a href="products">Sản phẩm</a>
        </nav>
    </header>

    <main>
        <section>
            <h3>Sản phẩm hot</h3>
            <img src="iphone.jpg" alt="iPhone 16 Pro">
            <p>iPhone 16 Pro</p>
            <p>Giá: <b>25.990.000đ</b></p>
        </section>

        <section>
            <h3>Thông tin</h3>
            <table>
                <tr>
                    <th>Tên</th>
                    <th>Giá</th>
                </tr>
                <tr>
                    <td>iPhone</td>
                    <td>25tr</td>
                </tr>
            </table>
        </section>

        <aside>
            <p>Sidebar content</p>
        </aside>
    </main>

    <footer>
        <p>Copyright 2026</p>
    </footer>
</body>
</html>
```

---

## 📋 Bảng tóm tắt

| # | Lỗi | Cũ | Sửa |
|---|---|---|---|
| 1 | Header | `<div class="header">` | `<header>` |
| 2 | Navigation | `<div class="menu">` | `<nav>` |
| 3 | Nội dung chính | `<div class="main">` | `<main>` |
| 4 | Sản phẩm | `<div class="product">` | `<article>` |
| 5 | Tiêu đề | `<div class="title">` | `<h2>` |
| 6 | Ảnh | `<img src="...">` | thêm `alt`, `loading="lazy"`, bọc `<figure>` |

__Câu A3:__


```
┌─────────────────────────────────────┐
│ Hộp 1                               │  ← <div> chiếm cả dòng
└─────────────────────────────────────┘
[Text A][Text B]                          ← <span> nằm cạnh nhau
┌─────────────────────────────────────┐
│ Hộp 2                               │  ← <div> chiếm cả dòng
└─────────────────────────────────────┘
[Text C][Text D]                          ← <span> + <strong> cùng dòng
┌─────────────────────────────────────┐
│ Hộp 3                               │  ← <div> chiếm cả dòng
└─────────────────────────────────────┘
```

---

## Giải thích

**`<div>` là block element** → tự động chiếm toàn bộ chiều ngang, phần tử tiếp theo bị đẩy xuống dòng mới. Vì vậy 3 hộp luôn đứng riêng từng dòng.

**`<span>` và `<strong>` là inline element** → chỉ chiếm đúng phần nội dung, các inline element kế tiếp tự động nằm cùng dòng. Đó là lý do:
- `Text A` + `Text B` nằm cạnh nhau
- `Text C` + `Text D` nằm cạnh nhau

**`<div>Hộp 2</div>` chen vào giữa** → làm Text A/B và Text C/D bị tách ra hai nhóm riêng biệt — `<div>` luôn "ngắt dòng" dù nằm giữa các inline element.

---

## Bảng tóm tắt

| Thẻ | Loại | Chiếm chỗ | Xuống dòng? |
|---|---|---|---|
| `<div>` | Block | Cả dòng ngang | Có |
| `<span>` | Inline | Vừa nội dung | Không |
| `<strong>` | Inline | Vừa nội dung | Không |

__Câu A4:__

1. Phân biệt `<thead>`, `<tbody>`, `<tfoot>`

| Thẻ | Vai trò | Nội dung |
|---|---|---|
| `<thead>` | Header bảng | Tiêu đề các cột (`<th>`) |
| `<tbody>` | Thân bảng | Dữ liệu chính (`<td>`) |
| `<tfoot>` | Footer bảng | Tổng kết, tổng cộng (`<td>`) |


2. Tại sao KHÔNG dùng `<table>` để layout trang web?

**Lý do 1 — Sai ngữ nghĩa (Semantic)**
`<table>` sinh ra để chứa *dữ liệu dạng bảng*, không phải để chia cột layout. Google và screen reader đọc `<table>` = "đây là bảng dữ liệu" → hiểu sai cấu trúc trang → SEO kém, accessibility kém.

**Lý do 2 — Khó responsive**
Table mặc định có chiều rộng cố định theo nội dung, rất khó co giãn trên màn hình điện thoại. CSS Grid/Flexbox có thể `wrap`, `stack`, ẩn/hiện cột linh hoạt — table thì không.

**Lý do 3 — Code rối, khó bảo trì**
Layout bằng table phải lồng nhiều `<tr>`, `<td>` chỉ để chia cột → HTML phình to, khó đọc, khó sửa. Dùng CSS Grid chỉ cần vài dòng CSS là xong.

**Lý do 4 — Load chậm hơn**
Trình duyệt phải đọc *toàn bộ* table trước khi render (vì cần tính độ rộng từng cột). Layout CSS render từng phần tử ngay lập tức → trang hiển thị nhanh hơn.

---

## Tóm tắt

> `<table>` = dùng cho **dữ liệu** (danh sách sản phẩm, bảng so sánh, thống kê).  
> Layout trang web = dùng **CSS Grid / Flexbox**.

__Câu B4:__


1. 3 thẻ semantic HTML5 mà trang đó sử dụng (Tiki)

- Thẻ `<header>`:

![img](screenshots/imgb4p3.png)
- Thẻ `<main>`:

![img](screenshots/imgb4p1.png)
- Thẻ `<footer>`:

![img](screenshots/footer.png)

2. Thẻ `<table>`:

- Trong bảng có `<thead>` chứa hình ảnh sản phẩm, `<tbody>` chứa thông tin sản phầm tương ứng với mỗi hàng, mỗi cột của sản phẩm đó

![img](screenshots/imgb4p2.png)

__*- Web tiki không có thẻ form*__

# PHẦN C: SUY LUẬN

__Câu C1:__

- Bạn được giao thiết kế cấu trúc HTML cho trang chi tiết sản phẩm (giống trang sản phẩm Shopee/Tiki). Trang bao gồm:

1. Header + Navigation
2. Breadcrumb (Trang chủ > Điện thoại > iPhone 16)
3. Khu vực ảnh sản phẩm (5 ảnh)
4. hông tin sản phẩm (tên, giá, đánh giá sao, mô tả)
5. Bảng thông số kỹ thuật
6.  Khu vực đánh giá/bình luận
7. Sidebar: Sản phẩm tương tự
8. Footer

Bài làm:

```html
<!DOCTYPE html>
<html lang="vi"> <!-- Ngôn ngữ trang -->
<head>
    <meta charset="UTF-8"> <!-- Hỗ trợ tiếng Việt -->
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Chi tiết sản phẩm</title> <!-- Tiêu đề trang -->
</head>
<body>

    <!-- HEADER -->
    <header> <!-- header: chứa phần đầu trang -->
        <div class="logo">Logo</div> <!-- div: nhóm logo -->
        <nav> <!-- khu vực điều hướng chính -->
            <ul> <!-- ul: menu không có thứ tự -->
                <li><a href="#">Trang chủ</a></li>
                <li><a href="#">Danh mục</a></li>
                <li><a href="#">Liên hệ</a></li>
            </ul>
        </nav>
    </header>

    <main> <!-- main: nội dung chính của trang -->
        <!-- BREADCRUMB -->
        <nav aria-label="breadcrumb"> <!-- điều hướng breadcrumb -->
            <ol> <!-- ol: có thứ tự (Trang chủ > ...) -->
                <li><a href="#">Trang chủ</a></li>
                <li><a href="#">Điện thoại</a></li>
                <li aria-current="page">iPhone 16</li> <!-- phần hiện tại -->
            </ol>
        </nav>

        <!-- PRODUCT DETAIL -->
        <section class="product-detail"> <!-- section: nhóm nội dung sản phẩm -->

            <!-- PRODUCT IMAGES -->
            <div class="product-images"> <!-- div: layout ảnh -->
                <figure> <!-- figure: ảnh + chú thích -->
                    <img src="#" alt="Ảnh sản phẩm chính"> <!-- img: ảnh -->
                    <figcaption>Ảnh chính</figcaption> <!-- figcaption: mô tả -->
                </figure>

                <div class="thumbnail-list"> <!-- div: danh sách ảnh nhỏ -->
                    <img src="#" alt="Ảnh 1">
                    <img src="#" alt="Ảnh 2">
                    <img src="#" alt="Ảnh 3">
                    <img src="#" alt="Ảnh 4">
                    <img src="#" alt="Ảnh 5">
                </div>
            </div>

            <!-- PRODUCT INFO -->
            <div class="product-info"> <!-- div: nhóm thông tin -->

                <h1>Tên sản phẩm</h1> <!-- h1: tiêu đề chính -->

                <p class="price">Giá</p> <!-- p: văn bản giá -->

                <div class="rating"> <!-- div: nhóm đánh giá -->
                    <span>★★★★★</span> <!-- span: inline text -->
                    <span>(100 đánh giá)</span>
                </div>

                <article class="description"> <!-- article: nội dung độc lập -->
                    <p>Mô tả sản phẩm...</p>
                </article>

            </div>
        </section>

        <!-- SPECIFICATIONS -->
        <section class="specs"> <!-- section: nhóm thông số -->
            <h2>Thông số kỹ thuật</h2> <!-- h2: tiêu đề cấp 2 -->

            <table> <!-- table: dữ liệu dạng bảng -->
                <thead> <!-- thead: phần đầu bảng -->
                    <tr>
                        <th>Thuộc tính</th> <!-- th: tiêu đề cột -->
                        <th>Giá trị</th>
                    </tr>
                </thead>
                <tbody> <!-- tbody: dữ liệu -->
                    <tr>
                        <td>Màn hình</td> <!-- td: ô dữ liệu -->
                        <td>...</td>
                    </tr>
                </tbody>
            </table>
        </section>

        <!-- REVIEWS -->
        <section class="reviews"> <!-- section: đánh giá -->
            <h2>Đánh giá</h2>

            <article class="review"> <!-- article: mỗi đánh giá độc lập -->
                <h3>Tên người dùng</h3>
                <p>Nội dung bình luận...</p>
            </article>

        </section>

        <!-- SIDEBAR -->
        <aside> <!-- aside: nội dung phụ -->
            <h2>Sản phẩm tương tự</h2>

            <ul> <!-- ul: danh sách sản phẩm -->
                <li><a href="#">Sản phẩm 1</a></li>
                <li><a href="#">Sản phẩm 2</a></li>
            </ul>
        </aside>

    </main>

    <!-- FOOTER -->
    <footer> <!-- footer: chân trang -->
        <p>&copy; 2026 Công ty</p>
    </footer>

</body>
</html>
```

__Câu C2:__

- Một đồng nghiệp nói: "Dùng `<div>` cho mọi thứ rồi thêm class là được, không cần semantic HTML. Tốn thời gian học thêm thẻ mới."

Viết 1 đoạn phản biện (200-300 từ), phải bao gồm:
Ít nhất 2 lý do kỹ thuật (SEO, Accessibility)
1 ví dụ cụ thể chứng minh semantic HTML giúp ích
1 trường hợp thực tế mà `<div>` vẫn phù hợp

**Bài làm:**

Quan điểm “dùng `<div>` cho mọi thứ” nghe có vẻ nhanh, nhưng về kỹ thuật lại tạo ra chi phí ẩn đáng kể. Thứ nhất là **SEO**: các công cụ tìm kiếm không chỉ đọc nội dung mà còn dựa vào cấu trúc ngữ nghĩa để hiểu trang. Những thẻ như `<header>`, `<main>`, `<article>`, `<nav>` giúp xác định rõ đâu là nội dung chính, đâu là điều hướng, từ đó cải thiện khả năng index và xếp hạng. Nếu chỉ dùng `<div>`, bạn phải phụ thuộc vào class — vốn không mang nhiều giá trị ngữ nghĩa đối với bot. Thứ hai là **Accessibility (trợ năng)**: các screen reader như NVDA hay VoiceOver dựa vào semantic HTML để điều hướng nhanh. Người dùng có thể nhảy trực tiếp tới `<main>` hoặc `<nav>` thay vì đọc toàn bộ trang. Nếu dùng `<div>`, bạn buộc phải bổ sung ARIA phức tạp hơn và dễ sai. Ví dụ cụ thể: breadcrumb sử dụng `<nav aria-label="breadcrumb">` kết hợp `<ol>` giúp công cụ hỗ trợ hiểu đây là điều hướng có thứ tự; nếu thay bằng `<div>`, bạn phải “vá” thêm nhiều thuộc tính mà vẫn kém hiệu quả. Tuy vậy, `<div>` vẫn phù hợp trong các trường hợp layout thuần túy như wrapper cho flex/grid hoặc grouping không mang ý nghĩa nội dung. Vấn đề không phải loại bỏ
`<div>`, mà là sử dụng đúng vai trò: semantic cho ý nghĩa, `<div>` cho trình bày.