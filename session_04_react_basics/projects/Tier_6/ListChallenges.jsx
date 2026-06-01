import { useState } from "react";

function ListChallenges() {
    const [fruits] = useState(["Táo", "Chuối", "Cam", "Nho"]);
    const [students] = useState([
        { id: 1, name: "Minh", age: 20 },
        { id: 2, name: "An", age: 21 },
        { id: 3, name: "Linh", age: 19 },
        { id: 4, name: "Dũng", age: 18 }
    ]);

    // Thử thách 3: Tính tuổi trung bình
    const totalAge = students.reduce((sum, student) => sum + student.age, 0);
    const averageAge = students.length > 0 ? (totalAge / students.length).toFixed(1) : 0;

    return (
        <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
            <h2>Danh sách trái cây</h2>
            <ul>
                {fruits.map((fruit, index) => (
                    <li key={index}>{fruit}</li>
                ))}
            </ul>
            
            <hr />
            <h2>Danh sách sinh viên</h2>
            {students.map((student, index) => {
                // Thử thách 2: Kiểm tra điều kiện tuổi >= 20 để đổi màu xanh
                const isAdult = student.age >= 20;
                
                return (
                    <div key={student.id} style={{ 
                        padding: "8px", 
                        margin: "5px 0",
                        background: "#f9f9f9",
                        borderLeft: isAdult ? "5px solid #27ae60" : "5px solid #95a5a6",
                        color: isAdult ? "#27ae60" : "#2c3e50",
                        fontWeight: isAdult ? "bold" : "normal"
                    }}>
                        {/* Thử thách 1: Hiển thị STT bằng index + 1 */}
                        <span>#{index + 1} . </span>
                        {student.name} - {student.age} tuổi
                    </div>
                );
            })}

            {/* Hiển thị tuổi trung bình */}
            <div style={{ marginTop: "15px", padding: "10px", background: "#e8f4f8", borderRadius: "4px" }}>
                <strong>📊 Tuổi trung bình của lớp:</strong> {averageAge} tuổi
            </div>
        </div>
    );
}

export default ListChallenges;