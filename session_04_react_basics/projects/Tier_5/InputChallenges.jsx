import { useState } from "react";

function InputChallenges() {
    // State cho Email validation
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");

    // State cho Preview và Đếm từ
    const [text, setText] = useState("");

    // Xử lý thay đổi Email
    const handleEmailChange = (e) => {
        const value = e.target.value;
        setEmail(value);
        if (value.length > 0 && !value.includes("@")) {
            setEmailError("Email không hợp lệ (thiếu @)");
        } else {
            setEmailError("");
        }
    };

    // Hàm đếm số từ (loại bỏ khoảng trắng thừa)
    const getWordCount = (str) => {
        if (!str.trim()) return 0;
        return str.trim().split(/\s+/).length;
    };

    return (
        <div style={{ padding: "20px" }}>
            <h2>Thử thách 5.2: Input Events</h2>
            
            {/* Thử thách 1: Validate Email */}
            <div style={{ marginBottom: "20px" }}>
                <label>Nhập Email: </label>
                <input 
                    value={email} 
                    onChange={handleEmailChange} 
                    placeholder="example@gmail.com"
                />
                {emailError && <span style={{ color: "red", marginLeft: "10px" }}>{emailError}</span>}
            </div>

            {/* Thử thách 2 & 3: Preview và đếm từ */}
            <div>
                <label>Nhập nội dung: </label>
                <textarea 
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    rows="3"
                    style={{ width: "100%", marginTop: "5px" }}
                    placeholder="Gõ gì đó vào đây..."
                />
                
                <div style={{ marginTop: "10px", padding: "10px", background: "#f0f0f0", borderRadius: "5px" }}>
                    <p><strong>Preview:</strong> {text}</p>
                    <p><strong>Số từ:</strong> {getWordCount(text)} từ</p>
                </div>
            </div>
        </div>
    );
}

export default InputChallenges;