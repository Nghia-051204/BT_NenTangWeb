import { useState, useEffect } from "react";

function KeyboardChallenges() {
    // 1. Game đoán phím
    const [targetKey, setTargetKey] = useState("a");
    const [gameMsg, setGameMsg] = useState("Hãy nhấn phím: a");

    // 2. Di chuyển ô vuông
    const [position, setPosition] = useState({ x: 0, y: 0 });

    // 3. Đổi màu bằng Ctrl+D
    const [bgColor, setBgColor] = useState("transparent");

    const generateRandomKey = () => {
        const letters = "abcdefghijklmnopqrstuvwxyz";
        const randomLetter = letters[Math.floor(Math.random() * letters.length)];
        setTargetKey(randomLetter);
        setGameMsg(`Hãy nhấn phím: ${randomLetter}`);
    };

    const handleKeyDown = (e) => {
        // Thử thách 3: Ctrl + D (Ngăn chặn trình duyệt mở Bookmark)
        if (e.ctrlKey && e.key.toLowerCase() === "d") {
            e.preventDefault();
            const randomColor = "#" + Math.floor(Math.random()*16777215).toString(16);
            setBgColor(randomColor);
            return;
        }

        // Thử thách 1: Game đoán phím
        if (e.key === targetKey) {
            setGameMsg("🎉 Chính xác! Bạn đã thắng!");
            setTimeout(generateRandomKey, 1500); // Đổi phím mới sau 1.5s
        }

        // Thử thách 2: Di chuyển ô vuông (Giới hạn bước nhảy 10px)
        const step = 10;
        switch(e.key) {
            case "ArrowUp":
                e.preventDefault(); // Ngăn cuộn trang
                setPosition(prev => ({ ...prev, y: prev.y - step }));
                break;
            case "ArrowDown":
                e.preventDefault();
                setPosition(prev => ({ ...prev, y: prev.y + step }));
                break;
            case "ArrowLeft":
                setPosition(prev => ({ ...prev, x: prev.x - step }));
                break;
            case "ArrowRight":
                setPosition(prev => ({ ...prev, x: prev.x + step }));
                break;
            default:
                break;
        }
    };

    return (
        <div 
            style={{ padding: "20px", backgroundColor: bgColor, border: "2px dashed #ccc", outline: "none" }}
            onKeyDown={handleKeyDown}
            tabIndex={0} 
        >
            <h2>Thử thách 5.3: Keyboard Events</h2>
            <p><em>(Hãy click vào khung này để bắt đầu gõ phím)</em></p>
            
            <div style={{ marginBottom: "20px", color: "blue", fontWeight: "bold" }}>
                {gameMsg}
            </div>

            <p>Ấn <strong>Ctrl + D</strong> để đổi màu nền khung này.</p>
            <p>Dùng <strong>phím mũi tên (↑↓←→)</strong> để di chuyển khối vuông bên dưới:</p>

            <div style={{ width: "100%", height: "200px", border: "1px solid black", position: "relative", overflow: "hidden", backgroundColor: "#fff" }}>
                <div style={{
                    width: "30px", 
                    height: "30px", 
                    backgroundColor: "red", 
                    position: "absolute",
                    top: `${position.y}px`,
                    left: `${position.x}px`,
                    transition: "0.1s" // Chuyển động mượt hơn
                }}></div>
            </div>
        </div>
    );
}

export default KeyboardChallenges;