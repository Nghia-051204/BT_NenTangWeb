import { useState, useRef } from "react";

function CreateChallenges() {
    const [items, setItems] = useState([
        { id: 1, name: "HTML" },
        { id: 2, name: "CSS" }
    ]);
    const [newName, setNewName] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    
    // Khởi tạo ref để bắt thẻ input
    const inputRef = useRef(null);
    
    function handleAdd() {
        // Thử thách 1: Validate không cho phép chuỗi trống
        if (newName.trim() === "") {
            alert("Tên môn học không được để trống!");
            return;
        }
        
        const newItem = {
            id: Date.now(),
            name: newName.trim()
        };
        
        setItems([...items, newItem]);
        setNewName(""); // Xóa dữ liệu ô input
        
        // Thử thách 2: Hiển thị thông báo thành công trong 2.5 giây
        setSuccessMsg(`🎉 Đã thêm thành công môn: ${newItem.name}`);
        setTimeout(() => setSuccessMsg(""), 2500);

        // Thử thách 3: Focus lại vào input sau khi thêm thành công
        inputRef.current.focus();
    }
    
    function handleKeyPress(event) {
        if (event.key === "Enter") {
            handleAdd();
        }
    }
    
    return (
        <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
            <h2>Thêm môn học</h2>
            
            <div style={{ marginBottom: "15px" }}>
                <input 
                    ref={inputRef} // Gắn ref vào input
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Nhập tên môn học..."
                    style={{ padding: "8px", marginRight: "10px", width: "200px" }}
                />
                <button onClick={handleAdd} style={{ padding: "8px 16px", cursor: "pointer" }}>
                    ➕ Thêm
                </button>
            </div>

            {/* Khu vực hiển thị thông báo thành công */}
            {successMsg && (
                <div style={{ color: "#27ae60", marginBottom: "10px", fontWeight: "bold" }}>
                    {successMsg}
                </div>
            )}
            
            <h3>Danh sách ({items.length} môn):</h3>
            {items.map(item => (
                <div key={item.id} style={{ padding: "8px", borderBottom: "1px solid #eee" }}>
                    {item.name}
                </div>
            ))}
        </div>
    );
}

export default CreateChallenges;