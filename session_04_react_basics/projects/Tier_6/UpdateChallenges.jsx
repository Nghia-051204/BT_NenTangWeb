import { useState } from "react";

function UpdateChallenges() {
    const [items, setItems] = useState([
        { id: 1, name: "Minh", age: 20 },
        { id: 2, name: "An", age: 21 },
        { id: 3, name: "Linh", age: 19 }
    ]);
    
    const [editingId, setEditingId] = useState(null);
    const [editName, setEditName] = useState("");
    const [editAge, setEditAge] = useState("");
    const [toastMessage, setToastMessage] = useState("");
    
    function startEdit(item) {
        setEditingId(item.id);
        setEditName(item.name);
        setEditAge(item.age.toString());
    }
    
    function saveEdit() {
        // Thử thách 2: Không cho phép lưu dữ liệu nếu tên bị bỏ trống
        if (editName.trim() === "") {
            alert("Tên không được phép để trống!");
            return;
        }
        if (editAge === "" || parseInt(editAge) <= 0) {
            alert("Tuổi phải là số lớn hơn 0!");
            return;
        }
        
        setItems(items.map(item => 
            item.id === editingId 
                ? { ...item, name: editName.trim(), age: parseInt(editAge) }
                : item
        ));
        
        setEditingId(null); 

        // Thử thách 3: Hiển thị thông báo "Đã lưu!" sau khi sửa đổi thành công
        setToastMessage("✅ Đã lưu thay đổi thành công!");
        setTimeout(() => setToastMessage(""), 2000);
    }
    
    function cancelEdit() {
        setEditingId(null);
    }
    
    function handleKeyPress(event) {
        if (event.key === "Enter") saveEdit();
        if (event.key === "Escape") cancelEdit();
    }
    
    return (
        <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
            <h2>Sửa thông tin sinh viên</h2>

            {/* Thông báo cập nhật thành công */}
            {toastMessage && (
                <div style={{ color: "#27ae60", fontWeight: "bold", marginBottom: "10px" }}>
                    {toastMessage}
                </div>
            )}
            
            {items.map(item => (
                <div key={item.id} style={{ padding: "10px", margin: "5px 0", background: "#f9f9f9", borderRadius: "4px" }}>
                    {editingId === item.id ? (
                        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                            {/* Thử thách 1: Highlight ô input bằng viền xanh dày thông qua thuộc tính border */}
                            <input 
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                onKeyDown={handleKeyPress}
                                autoFocus
                                style={{ padding: "6px", border: "2px solid #2ecc71", borderRadius: "4px", outline: "none" }}
                            />
                            <input 
                                type="number"
                                value={editAge}
                                onChange={(e) => setEditAge(e.target.value)}
                                onKeyDown={handleKeyPress}
                                style={{ padding: "6px", width: "60px", border: "2px solid #2ecc71", borderRadius: "4px", outline: "none" }}
                            />
                            <button onClick={saveEdit} style={{ background: "#27ae60", color: "white", border: "none", padding: "6px 12px", cursor: "pointer", borderRadius: "4px" }}>
                                ✓ Lưu
                            </button>
                            <button onClick={cancelEdit} style={{ background: "#95a5a6", color: "white", border: "none", padding: "6px 12px", cursor: "pointer", borderRadius: "4px" }}>
                                ✕ Hủy
                            </button>
                        </div>
                    ) : (
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span>{item.name} - <strong>{item.age}</strong> tuổi</span>
                            <button onClick={() => startEdit(item)} style={{ background: "#3498db", color: "white", border: "none", padding: "6px 12px", cursor: "pointer", borderRadius: "4px" }}>
                                ✏️ Sửa
                            </button>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}

export default UpdateChallenges;