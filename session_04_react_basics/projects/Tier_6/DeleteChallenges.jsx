import { useState, useRef } from "react";

function DeleteChallenges() {
    const [items, setItems] = useState([
        { id: 1, name: "Minh" },
        { id: 2, name: "An" },
        { id: 3, name: "Linh" }
    ]);
    
    // State quản lý việc Hoàn tác
    const [history, setHistory] = useState(null); 
    const [alertText, setAlertText] = useState("");
    const timerRef = useRef(null);

    function handleDelete(itemToDelete) {
        // Thử thách 3: Hỏi xác nhận (Confirm) trước khi xóa
        if (!window.confirm(`Bạn chắc chắn muốn xóa sinh viên ${itemToDelete.name}?`)) {
            return;
        }

        // Sao lưu trạng thái trước khi xóa để hỗ trợ tính năng Hoàn tác
        setHistory(items);
        setItems(items.filter(item => item.id !== itemToDelete.id));
        
        // Thử thách 1: Hiển thị tên phần tử vừa xóa
        setAlertText(`Đã xóa sinh viên: ${itemToDelete.name}`);

        // Thử thách 2: Thiết lập thời gian hủy nút Hoàn tác sau 5 giây
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
            setHistory(null);
            setAlertText("");
        }, 5000);
    }

    // Hàm xử lý khi ấn nút Hoàn tác
    function handleUndo() {
        if (history) {
            setItems(history);
            setHistory(null);
            setAlertText("↩️ Đã khôi phục dữ liệu!");
            if (timerRef.current) clearTimeout(timerRef.current);
            setTimeout(() => setAlertText(""), 2000);
        }
    }
    
    return (
        <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
            <h2>Xóa sinh viên</h2>

            {/* Banner hiển thị thông báo và nút Hoàn Tác */}
            {alertText && (
                <div style={{ 
                    background: "#fff3cd", 
                    padding: "10px", 
                    marginBottom: "15px", 
                    borderRadius: "4px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                }}>
                    <span>⚠️ {alertText}</span>
                    {history && (
                        <button onClick={handleUndo} style={{ background: "#2980b9", color: "white", border: "none", padding: "5px 10px", cursor: "pointer", borderRadius: "3px" }}>
                            Hoàn tác (5s)
                        </button>
                    )}
                </div>
            )}
            
            {items.length === 0 ? (
                <p style={{ color: "#999" }}>Danh sách trống</p>
            ) : (
                items.map(item => (
                    <div key={item.id} style={{ 
                        display: "flex", justifyContent: "space-between", alignItems: "center",
                        padding: "10px", margin: "5px 0", background: "#f9f9f9"
                    }}>
                        <span>{item.name}</span>
                        <button 
                            onClick={() => handleDelete(item)}
                            style={{ background: "#e74c3c", color: "white", border: "none", padding: "4px 8px", cursor: "pointer" }}
                        >
                            Xóa
                        </button>
                    </div>
                ))
            )}
        </div>
    );
}

export default DeleteChallenges;