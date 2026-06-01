import { useState } from "react";

function ClickChallenges() {
    // 1. Đổi màu ngẫu nhiên
    const [bgColor, setBgColor] = useState("white");
    
    // 2. Đếm số lần click riêng biệt
    const [btn1Count, setBtn1Count] = useState(0);
    const [btn2Count, setBtn2Count] = useState(0);
    
    // 3. Nút Like toggle
    const [isLiked, setIsLiked] = useState(false);

    // Hàm tạo mã màu HEX ngẫu nhiên
    const changeColor = () => {
        const randomColor = "#" + Math.floor(Math.random()*16777215).toString(16);
        setBgColor(randomColor);
    };

    return (
        <div style={{ padding: "20px", backgroundColor: bgColor, minHeight: "200px" }}>
            <h2>Thử thách 5.1: Click Events</h2>
            
            {/* Thử thách 1 */}
            <div style={{ marginBottom: "20px" }}>
                <button onClick={changeColor}>Đổi màu nền ngẫu nhiên</button>
            </div>

            {/* Thử thách 2 */}
            <div style={{ marginBottom: "20px" }}>
                <button onClick={() => setBtn1Count(btn1Count + 1)}>Nút 1 (Click: {btn1Count})</button>
                <span style={{ margin: "0 10px" }}></span>
                <button onClick={() => setBtn2Count(btn2Count + 1)}>Nút 2 (Click: {btn2Count})</button>
            </div>

            {/* Thử thách 3 */}
            <div>
                <button 
                    onClick={() => setIsLiked(!isLiked)}
                    style={{ fontSize: "20px", cursor: "pointer", background: "none", border: "1px solid #ccc", borderRadius: "5px", padding: "5px 15px" }}
                >
                    {isLiked ? "❤️ Đã thích" : "🤍 Thích"}
                </button>
            </div>
        </div>
    );
}

export default ClickChallenges;