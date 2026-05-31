// Khai báo các DOM Elements
const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const historyList = document.getElementById('historyList');

// Các DOM State
const loadingState = document.getElementById('loadingState');
const errorState = document.getElementById('errorState');
const successState = document.getElementById('successState');
const errorMessage = document.getElementById('errorMessage');

// Các DOM hiển thị data
const cityNameDisplay = document.getElementById('cityNameDisplay');
const weatherIcon = document.getElementById('weatherIcon');
const tempValue = document.getElementById('tempValue');
const weatherDesc = document.getElementById('weatherDesc');
const humidityValue = document.getElementById('humidityValue');

// Khởi tạo lịch sử từ LocalStorage
let searchHistory = JSON.parse(localStorage.getItem('weather_history')) || [];

// Lắng nghe sự kiện click nút Tìm kiếm
searchBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) {
        getWeather(city);
    }
});

// Lắng nghe sự kiện nhấn Enter trong input
cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchBtn.click();
    }
});

// Hàm quản lý hiển thị các State
function updateUIState(state, message = "") {
    // Ẩn tất cả trước
    loadingState.classList.add('hidden');
    errorState.classList.add('hidden');
    successState.classList.add('hidden');

    // Hiển thị State tương ứng
    if (state === 'loading') {
        loadingState.classList.remove('hidden');
    } else if (state === 'error') {
        errorState.classList.remove('hidden');
        errorMessage.textContent = message;
    } else if (state === 'success') {
        successState.classList.remove('hidden');
    }
}

// Hàm Fetch API
async function getWeather(city) {
    updateUIState('loading');

    try {
        // wttr.in format=j1 trả về dạng JSON
        const response = await fetch(`https://wttr.in/${encodeURIComponent(city)}?format=j1`);
        
        if (!response.ok) {
            throw new Error('Thành phố không tồn tại hoặc lỗi server!');
        }

        const data = await response.json();
        
        // Lấy thông tin hiện tại từ JSON của wttr.in
        const current = data.current_condition[0];
        const requestArea = data.nearest_area[0].areaName[0].value;

        // Render data lên giao diện
        cityNameDisplay.textContent = requestArea;
        tempValue.textContent = current.temp_C;
        humidityValue.textContent = current.humidity;
        weatherDesc.textContent = current.weatherDesc[0].value;
        weatherIcon.src = current.weatherIconUrl[0].value; 
        
        // Cập nhật State thành công và lưu lịch sử
        updateUIState('success');
        saveToHistory(requestArea);

    } catch (error) {
        // Xử lý lỗi (mất mạng, URL sai, 404...)
        console.error(error);
        updateUIState('error', 'Không thể lấy dữ liệu. Vui lòng kiểm tra lại tên thành phố hoặc kết nối mạng.');
    }
}

// Hàm xử lý và lưu LocalStorage
function saveToHistory(city) {
    // Chuyển về chữ thường để tránh lặp (VD: Hanoi và hanoi)
    const lowerCity = city.toLowerCase();
    
    // Xóa thành phố nếu đã tồn tại để đẩy lên đầu mảng
    searchHistory = searchHistory.filter(item => item.toLowerCase() !== lowerCity);
    
    // Thêm vào đầu mảng
    searchHistory.unshift(city);
    
    // Chỉ giữ lại 5 thành phố gần nhất
    if (searchHistory.length > 5) {
        searchHistory.pop();
    }

    // Lưu vào LocalStorage
    localStorage.setItem('weather_history', JSON.stringify(searchHistory));
    
    // Cập nhật lại UI lịch sử
    renderHistory();
}

// Hàm vẽ danh sách lịch sử ra màn hình
function renderHistory() {
    historyList.innerHTML = '';
    
    searchHistory.forEach(city => {
        const li = document.createElement('li');
        li.textContent = city;
        
        // Click vào lịch sử -> Tìm lại luôn
        li.addEventListener('click', () => {
            cityInput.value = city;
            getWeather(city);
        });
        
        historyList.appendChild(li);
    });
}

// Khởi chạy lúc load trang: Vẽ ra lịch sử (nếu có)
renderHistory();