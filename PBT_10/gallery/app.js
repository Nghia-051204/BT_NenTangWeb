// Các cấu hình App State toàn cục
let currentPage = 1;
const limit = 20;
let isLoading = false;

// DOM Elements
const galleryGrid = document.getElementById('galleryGrid');
const loadTrigger = document.getElementById('load-trigger');
const lightbox = document.getElementById('lightboxModal');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxAuthor = document.getElementById('lightboxAuthor');
const closeLightboxBtn = document.querySelector('.close-lightbox');

/**
 * BỘ GIÁM SÁT 1: LAZY LOADING IMAGES
 * Kiểm tra xem thẻ ảnh đã chuẩn bị bước vào Viewport chưa, nếu có thì nạp link thực tế vào thuộc tính `src`.
 */
const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            // Thay thế liên kết tạm thời bằng đường dẫn ảnh thực tế thông qua dataset
            img.src = img.dataset.src;
            
            // Lắng nghe sự kiện ảnh hoàn tất tải xuống từ internet để tạo hiệu ứng mượt mà
            img.addEventListener('load', () => {
                img.classList.add('loaded');
            });
            
            // Hủy theo dõi bức ảnh này sau khi đã xử lý xong nhằm tối ưu hiệu năng phần cứng
            observer.unobserve(img);
        }
    });
}, {
    rootMargin: "0px 0px 200px 0px" // Tải trước ảnh khi nó cách vùng nhìn thấy 200px về phía dưới
});

/**
 * HÀM FETCH VÀ RENDER DỮ LIỆU 
 */
async function loadMorePhotos() {
    if (isLoading) return; // Khóa chống trùng lặp dữ liệu khi người dùng cuộn quá nhanh
    isLoading = true;
    loadTrigger.style.visibility = 'visible'; // Hiển thị dòng chữ "Đang tải thêm..."

    try {
        const response = await fetch(`https://picsum.photos/v2/list?page=${currentPage}&limit=${limit}`);
        if (!response.ok) throw new Error('Không thể lấy danh sách hình ảnh từ máy chủ');
        
        const photos = await response.json();
        
        if (photos.length === 0) {
            // Khi hết ảnh trên Server, hủy giám sát đáy trang
            scrollObserver.disconnect();
            loadTrigger.innerHTML = "<span>Bạn đã xem hết toàn bộ ảnh!</span>";
            return;
        }

        // Thực hiện render cấu trúc cây DOM đại diện cho các Card ảnh
        photos.forEach(photo => {
            const card = document.createElement('div');
            card.className = 'photo-card';
            
            // Xây dựng kích thước ảnh chất lượng cao để hiển thị trong Lightbox (Độ phân giải lớn hơn)
            const downloadUrl = photo.download_url;
            // Thu nhỏ ảnh preview về độ phân giải vừa đủ (Ví dụ rộng 500px) để tăng tốc độ lướt mạng
            const previewUrl = `https://picsum.photos/id/${photo.id}/500/375`;

            card.innerHTML = `
                <div class="img-container">
                    <img data-src="${previewUrl}" alt="Photo by ${photo.author}" data-fullsrc="${downloadUrl}" data-author="${photo.author}">
                </div>
                <div class="photo-info">
                    <h3>Tác giả: ${photo.author}</h3>
                </div>
            `;

            // Lắng nghe sự kiện kích hoạt mở trình xem ảnh lớn phóng to (Lightbox)
            card.addEventListener('click', () => {
                const targetImg = card.querySelector('img');
                openLightbox(targetImg.dataset.fullsrc, targetImg.dataset.author);
            });

            galleryGrid.appendChild(card);
            
            // Giao bức ảnh vừa tạo cho ImageObserver chăm sóc và quản lý việc Lazy Loading
            const imgElement = card.querySelector('img');
            imageObserver.observe(imgElement);
        });

        currentPage++; // Nâng số trang lên để sẵn sàng cho lần cuộn tiếp theo
    } catch (error) {
        console.error('Lỗi bộ thư viện:', error);
    } finally {
        isLoading = false;
        loadTrigger.style.visibility = 'hidden'; // Ẩn dòng chữ thông báo tải sau khi kết thúc
    }
}

/**
 * BỘ GIÁM SÁT 2: INFINITE SCROLL
 * Theo dõi thẻ `#load-trigger` ở đáy trang, hễ chạm đáy thì kích hoạt gọi API trang tiếp theo.
 */
const scrollObserver = new IntersectionObserver((entries) => {
    // Chỉ kích hoạt khi phần tử trigger lọt vào tầm nhìn của người dùng và hệ thống không trong trạng thái đang bận tải
    if (entries[0].isIntersecting && !isLoading) {
        loadMorePhotos();
    }
}, {
    rootMargin: "150px" // Kích hoạt sớm hơn một chút khi cách đáy trang 150px để người dùng lướt liền mạch
});

// Gắn bộ giám sát vào thẻ kích hoạt ở chân trang HTML theo đề bài yêu cầu
scrollObserver.observe(document.querySelector("#load-trigger"));

/**
 * CÁC HÀM ĐIỀU KHIỂN TRÌNH XEM ẢNH LỚN (LIGHTBOX)
 */
function openLightbox(fullSrc, author) {
    lightboxImg.src = fullSrc;
    lightboxAuthor.textContent = `Tác phẩm của tác giả: ${author}`;
    lightbox.classList.add('active');
}

function closeLightbox() {
    lightbox.classList.remove('active');
    // Xóa link ảnh cũ khi đóng để lần sau mở ảnh khác không bị nháy lại ảnh cũ
    lightboxImg.src = ""; 
}

// Lắng nghe đóng bằng nút X hoặc click ra ngoài vùng ảnh đen
closeLightboxBtn.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
        closeLightbox();
    }
});

// Lắng nghe phím ESC trên bàn phím để đóng Lightbox nhanh chóng
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
        closeLightbox();
    }
});