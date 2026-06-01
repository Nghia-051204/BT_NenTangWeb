function ConditionalDemo() {
    const isOnline = true; 
    const isLoggedIn = true;
    const stock = 0;

    return (
        <div style={{ padding: "20px", fontFamily: "Arial" }}>
            <h1>🎯 Conditional Rendering</h1>
            <div style={{ marginBottom: "20px" }}>
                <h2>Trạng thái kết nối</h2>
                <p>{isOnline ? "🟢 Online" : "🔴 Offline"}</p>
            </div>

            <div style={{ marginBottom: "20px" }}>
                <h2>Menu điều khiển</h2>
                {isLoggedIn && (
                    <div style={{ display: "flex", gap: "10px" }}>
                        <button>Trang chủ</button>
                        <button>Hồ sơ</button>
                        <button>Cài đặt</button>
                        <button>Đăng xuất</button>
                    </div>
                )}
                {!isLoggedIn && (
                    <div>
                        <button>Đăng nhập</button>
                        <button>Đăng ký</button>
                    </div>
                )}
            </div>

            <div>
                <h2>Sản phẩm mẫu</h2>
                <p>Giá: 250.000đ</p>
                <p>
                    Tồn kho: {stock > 0 ? `${stock} sản phẩm` : "Hết hàng"}
                </p>

                {stock > 0 ? (
                    <button style={{ background: "green", color: "white" }}>
                        Mua ngay
                    </button>
                ) : (
                    <button disabled style={{ background: "gray", color: "white" }}>
                        Tạm hết hàng
                    </button>
                )}
            </div>
        </div>
    );
}

export default ConditionalDemo;