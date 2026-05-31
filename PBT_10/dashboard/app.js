// Danh sách các API Endpoint phục vụ Dashboard
const API_URLS = [
    "https://api.open-meteo.com/v1/forecast?latitude=21.03&longitude=105.85&current_weather=true", // Index 0: Weather
    "https://jsonplaceholder.typicode.com/posts?_limit=3",                                        // Index 1: Posts
    "https://dog.ceo/api/breeds/image/random"                                                     // Index 2: Dog Image
];

// DOM Elements điều khiển chung
const globalLoader = document.getElementById("globalLoader");
const refreshBtn = document.getElementById("refreshBtn");
const executionTimeDisplay = document.getElementById("executionTime");

/**
 * Hàm trung gian bọc Fetch: Ép buộc ném lỗi nếu Status Code không nằm trong khoảng 200-299.
 * Giúp Promise.allSettled chuyển trạng thái phần tử sang 'rejected' khi API bị sập.
 */
async function fetchJSON(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`HTTP ${response.status} - Máy chủ phản hồi lỗi.`);
    }
    return await response.json();
}

/**
 * CORE LOGIC: Gọi song song và kiểm soát Dashboard bằng Promise.allSettled
 */
async function loadDashboard() {
    const startTime = Date.now();
    
    // Bước 1: Kích hoạt trạng thái Loading tổng thể toàn trang
    globalLoader.classList.add("active");
    clearAllWidgets();

    // Bước 2: Kích nổ đồng thời 3 luồng HTTP Request bất đồng bộ
    const results = await Promise.allSettled([
        fetchJSON(API_URLS[0]), // Kết quả xử lý đưa về Index 0
        fetchJSON(API_URLS[1]), // Kết quả xử lý đưa về Index 1
        fetchJSON(API_URLS[2])  // Kết quả xử lý đưa về Index 2
    ]);
    
    // Bước 3: Duyệt qua từng kết quả trả về để phân phối hiển thị độc lập
    results.forEach((result, index) => {
        if (result.status === "fulfilled") {
            renderWidget(index, result.value);
        } else {
            // Cô lập lỗi đơn lẻ cho riêng Widget đó, không làm hỏng ứng dụng
            renderWidgetError(index, result.reason.message);
        }
    });
    
    // Bước 4: Tắt Loading tổng thể và ghi nhận thời gian xử lý thực tế
    globalLoader.classList.remove("active");
    const msCalculated = Date.now() - startTime;
    executionTimeDisplay.textContent = `Hệ thống ổn định. Dữ liệu đồng bộ trong: ${msCalculated} ms`;
    console.log(`Loaded in ${msCalculated}ms`);
}

/**
 * HÀM RENDER WIDGET THÀNH CÔNG (SUCCESS STATE)
 */
function renderWidget(index, data) {
    const widgetBody = document.querySelector(`#widget-${index} .widget-body`);
    widgetBody.innerHTML = ""; // Xóa dữ liệu cũ/loading trống trước đó

    switch(index) {
        case 0: // Xử lý render cho Open-Meteo Weather
            const currentWeather = data.current_weather;
            widgetBody.innerHTML = `
                <div class="weather-info">
                    <p>Nhiệt độ hiện tại: <span>${currentWeather.temperature}°C</span></p>
                    <p>Tốc độ gió: <span>${currentWeather.windspeed} km/h</span></p>
                    <p>Mã thời tiết: WMO ${currentWeather.weathercode}</p>
                </div>
            `;
            break;

        case 1: // Xử lý render cho JSONPlaceholder Posts
            let postsHTML = `<div class="posts-list">`;
            data.forEach(post => {
                postsHTML += `
                    <div class="post-item">
                        <h4>${post.title.substring(0, 30)}...</h4>
                        <p>${post.body.substring(0, 65)}...</p>
                    </div>
                `;
            });
            postsHTML += `</div>`;
            widgetBody.innerHTML = postsHTML;
            break;

        case 2: // Xử lý render cho Dog CEO Image
            widgetBody.innerHTML = `
                <div class="dog-img-box">
                    <img src="${data.message}" alt="Random Dog">
                </div>
            `;
            break;
    }
}

/**
 * HÀM RENDER CÔ LẬP LỖI WIDGET (ERROR STATE)
 */
function renderWidgetError(index, errorMessage) {
    const widgetBody = document.querySelector(`#widget-${index} .widget-body`);
    widgetBody.innerHTML = `
        <div class="widget-error">
            <p>⚠️ Kết nối thất bại</p>
            <small>${errorMessage || "Lỗi đường truyền mạng hoặc sai cấu hình."}</small>
        </div>
    `;
}

/**
 * Hàm xóa sạch bộ nhớ đệm hiển thị
 */
function clearAllWidgets() {
    for (let i = 0; i < 3; i++) {
        document.querySelector(`#widget-${i} .widget-body`).innerHTML = `
            <div style="text-align:center; color: var(--border);">Đang xử lý gói...</div>
        `;
    }
}

// Lắng nghe sự kiện click nút Tải lại toàn bộ
refreshBtn.addEventListener("click", loadDashboard);

// Tự động khởi chạy nạp tài nguyên ngay khi trình duyệt render xong cây DOM cơ sở
document.addEventListener("DOMContentLoaded", loadDashboard);