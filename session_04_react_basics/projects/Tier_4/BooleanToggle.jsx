import { useState } from "react";

function BooleanToggle() {
    const [showPassword, setShowPassword] = useState(false);
    const [password, setPassword] = useState("");

    const [isOpen, setIsOpen] = useState(false);

    const [isLightOn, setIsLightOn] = useState(false);

    return (
        <div style={{ padding: "20px", fontFamily: "Arial", maxWidth: "500px", margin: "0 auto" }}>
            <h1>🔘 Boolean Toggle Demos</h1>

            <div style={{ marginBottom: "30px", border: "1px solid #ddd", padding: "15px", borderRadius: "8px" }}>
                <h3>🔐 1. Hiện/Ẩn mật khẩu</h3>
                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                    <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Nhập mật khẩu"
                        style={{ flex: 1, padding: "8px" }}
                    />
                    <button onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? "🙈 Ẩn" : "👁️ Hiện"}
                    </button>
                </div>
                {password && (
                    <p style={{ marginTop: "10px", fontSize: "14px" }}>
                        Mật khẩu hiện tại: {showPassword ? password : "•".repeat(password.length)}
                    </p>
                )}
            </div>

            <div style={{ marginBottom: "30px", border: "1px solid #ddd", borderRadius: "8px", overflow: "hidden" }}>
                <div
                    onClick={() => setIsOpen(!isOpen)}
                    style={{
                        background: "#3498db",
                        color: "white",
                        padding: "12px 15px",
                        cursor: "pointer",
                        fontWeight: "bold",
                        display: "flex",
                        justifyContent: "space-between"
                    }}
                >
                    <span>📂 Click để mở/đóng nội dung</span>
                    <span>{isOpen ? "▲" : "▼"}</span>
                </div>
                {isOpen && (
                    <div style={{ padding: "15px", background: "#f9f9f9", borderTop: "1px solid #ddd" }}>
                        <p>Đây là nội dung bên trong accordion.</p>
                        <p>Bạn có thể đặt bất kỳ nội dung nào ở đây: văn bản, hình ảnh, form, v.v.</p>
                        <button onClick={() => alert("Accordion content clicked!")}>Hành động</button>
                    </div>
                )}
            </div>

            <div style={{ marginBottom: "30px", border: "1px solid #ddd", padding: "15px", borderRadius: "8px", textAlign: "center" }}>
                <h3>💡 3. Bật/Tắt đèn</h3>
                <div
                    style={{
                        fontSize: "80px",
                        cursor: "pointer",
                        padding: "20px",
                        background: isLightOn ? "#fff7d4" : "#2c3e50",
                        borderRadius: "50%",
                        display: "inline-block",
                        transition: "all 0.3s",
                        boxShadow: isLightOn ? "0 0 20px #f1c40f" : "none"
                    }}
                    onClick={() => setIsLightOn(!isLightOn)}
                >
                    {isLightOn ? "💡" : "🔘"}
                </div>
                <p style={{ marginTop: "10px" }}>
                    Trạng thái: <strong>{isLightOn ? "Đèn BẬT" : "Đèn TẮT"}</strong>
                </p>
                <button onClick={() => setIsLightOn(!isLightOn)}>
                    {isLightOn ? "Tắt đèn" : "Bật đèn"}
                </button>
            </div>
        </div>
    );
}

export default BooleanToggle;