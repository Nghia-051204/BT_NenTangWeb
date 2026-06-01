import { useState } from "react";

function StringState() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const maxLength = 100;
    const remaining = maxLength - name.length;

    const isValidEmail = email.includes('@');

    const togglePasswordVisibility = () => setShowPassword(!showPassword);

    return (
        <div style={{ padding: "20px", fontFamily: "Arial", maxWidth: "500px", margin: "0 auto" }}>
            <h2>📝 Nhập thông tin người dùng</h2>

            <div style={{ marginBottom: "15px" }}>
                <label>Họ tên: </label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value.slice(0, maxLength))}
                    placeholder="Nhập tên (tối đa 100 ký tự)"
                    style={{ width: "100%", padding: "8px", marginTop: "5px" }}
                />
                <div style={{ fontSize: "12px", textAlign: "right", marginTop: "5px" }}>
                    {name.length}/{maxLength} ký tự
                    {remaining < 10 && <span style={{ color: "orange" }}> (còn {remaining})</span>}
                </div>
            </div>

            <div style={{ marginBottom: "15px" }}>
                <label>Email: </label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@domain.com"
                    style={{ width: "100%", padding: "8px", marginTop: "5px" }}
                />
                {email && (
                    <div style={{ fontSize: "12px", marginTop: "5px" }}>
                        {isValidEmail ? (
                            <span style={{ color: "green" }}>✅ Email hợp lệ</span>
                        ) : (
                            <span style={{ color: "red" }}>❌ Email chưa hợp lệ (thiếu @)</span>
                        )}
                    </div>
                )}
            </div>

            <div style={{ marginBottom: "15px" }}>
                <label>Mật khẩu: </label>
                <div style={{ display: "flex", gap: "5px" }}>
                    <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Nhập mật khẩu"
                        style={{ flex: 1, padding: "8px", marginTop: "5px" }}
                    />
                    <button
                        onClick={togglePasswordVisibility}
                        style={{ marginTop: "5px", padding: "8px 12px", cursor: "pointer" }}
                    >
                        {showPassword ? "🙈 Ẩn" : "👁️ Hiện"}
                    </button>
                </div>
                {password && (
                    <div style={{ fontSize: "12px", marginTop: "5px" }}>
                        Mật khẩu nhập: {'*'.repeat(password.length)}
                    </div>
                )}
            </div>

            <hr />
            <h3>📋 Thông tin đã nhập:</h3>
            <p>Tên: <strong>{name || "(chưa nhập)"}</strong></p>
            <p>Email: <strong>{email || "(chưa nhập)"}</strong></p>
            <p>Mật khẩu: <strong>{password ? "••••••" : "(chưa nhập)"}</strong></p>

            {name && (
                <div style={{ background: "#f0f0f0", padding: "10px", borderRadius: "4px" }}>
                    👋 Xin chào <strong>{name}</strong>!<br />
                    Email của bạn là {email || "chưa có"}.
                </div>
            )}
        </div>
    );
}

export default StringState;