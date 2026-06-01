import { useState } from "react";

function MultipleStates() {
    const [name, setName] = useState("");  
    const [isStudent, setIsStudent] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    
    const ageNumber = parseInt(age);
    const isAgeValid = !isNaN(ageNumber) && ageNumber > 0 && ageNumber < 100;
    const isFormValid = name.trim() !== "" && 
                        email.trim() !== "" && 
                        email.includes("@") && 
                        isAgeValid;
    
    function handleSubmit() {
        if (!isFormValid) {
            alert("Vui lòng điền đầy đủ thông tin hợp lệ:\n- Tên không được để trống\n- Email phải có @\n- Tuổi phải từ 1 đến 99");
            return;
        }
        setSubmitted(true);
    }
    
    function handleReset() {
        setName("");
        setEmail("");
        setAge("");
        setIsStudent(false);
        setSubmitted(false);
    }
    
    return (
        <div style={{ padding: "20px", fontFamily: "Arial", maxWidth: "500px", margin: "0 auto" }}>
            <h2>📝 Form đăng ký người dùng</h2>
            
            {!submitted ? (
                <div>
                    <div style={{ marginBottom: "10px" }}>
                        <label>Tên: </label>
                        <input 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Nhập họ tên"
                            style={{ width: "100%", padding: "6px", marginTop: "4px" }}
                        />
                    </div>
                    
                    <div style={{ marginBottom: "10px" }}>
                        <label>Email: </label>
                        <input 
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="example@domain.com"
                            style={{ width: "100%", padding: "6px", marginTop: "4px" }}
                        />
                        {email && !email.includes("@") && (
                            <div style={{ color: "red", fontSize: "12px" }}>
                                Email phải chứa ký tự '@'
                            </div>
                        )}
                    </div>
                    
                    <div style={{ marginBottom: "10px" }}>
                        <label>Tuổi: </label>
                        <input 
                            type="number"
                            value={age}
                            onChange={(e) => setAge(e.target.value)}
                            placeholder="1 - 99"
                            style={{ width: "100%", padding: "6px", marginTop: "4px" }}
                        />
                        {age && !isAgeValid && (
                            <div style={{ color: "red", fontSize: "12px" }}>
                                Tuổi phải từ 1 đến 99
                            </div>
                        )}
                    </div>
                    
                    <div style={{ marginBottom: "15px" }}>
                        <label>
                            <input 
                                type="checkbox"
                                checked={isStudent}
                                onChange={(e) => setIsStudent(e.target.checked)}
                            />
                            Là sinh viên
                        </label>
                    </div>
                    
                    <button 
                        onClick={handleSubmit}
                        style={{
                            background: isFormValid ? "#3498db" : "#ccc",
                            color: "white",
                            border: "none",
                            padding: "8px 16px",
                            borderRadius: "4px",
                            cursor: isFormValid ? "pointer" : "not-allowed"
                        }}
                        disabled={!isFormValid}
                    >
                        Đăng ký
                    </button>
                </div>
            ) : (
                <div style={{ background: "#d4edda", padding: "15px", borderRadius: "8px" }}>
                    <h3>✅ Đăng ký thành công!</h3>
                    <p><strong>👋 Xin chào {name}!</strong></p>   {/* Thử thách 3 */}
                    <p>📧 Email: {email}</p>
                    <p>📅 Tuổi: {age}</p>
                    <p>🎓 Sinh viên: {isStudent ? "Có" : "Không"}</p>
                    <button 
                        onClick={handleReset}
                        style={{
                            background: "#e74c3c",
                            color: "white",
                            border: "none",
                            padding: "8px 16px",
                            borderRadius: "4px",
                            cursor: "pointer",
                            marginTop: "10px"
                        }}
                    >
                        Đăng ký lại
                    </button>
                </div>
            )}
        </div>
    );
}

export default MultipleStates;