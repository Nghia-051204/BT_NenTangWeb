import { useState } from "react";

function NumberState() {
    const [count, setCount] = useState(0);

    let color = "black";
    if (count > 0) color = "green";
    if (count < 0) color = "red";

    const signMessage = count > 0 ? "Số dương" : (count < 0 ? "Số âm" : "Số không");

    return (
        <div style={{ textAlign: "center", padding: "20px", fontFamily: "Arial" }}>
            <h2 style={{ color: color }}>
                Bộ đếm: {count}
            </h2>
            <p>{signMessage}</p>

            <div style={{ display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap" }}>
                <button onClick={() => setCount(count + 1)}>Tăng (+1)</button>
                <button onClick={() => setCount(count - 1)}>Giảm (-1)</button>
                <button onClick={() => setCount(count + 5)}>Tăng 5 (+5)</button>  {/* ✅ Thử thách 1 */}
                <button onClick={() => setCount(0)}>Reset</button>
                <button onClick={() => setCount(count * 2)}>Nhân đôi</button>
            </div>
        </div>
    );
}

export default NumberState;