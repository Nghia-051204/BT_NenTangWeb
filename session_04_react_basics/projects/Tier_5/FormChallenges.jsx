import { useState } from "react";

function FormChallenges() {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        confirmPassword: ""
    });
    
    // State lưu trữ lỗi realtime
    const [errors, setErrors] = useState({});
    const [isSuccess, setIsSuccess] = useState(false);

    // Xử lý thay đổi và Validate realtime
    const handleChange = (e) => {
        const { name, value } = e.target;
        
        // Cập nhật giá trị
        setFormData(prev => ({ ...prev, [name]: value }));
        
        // Xóa thông báo thành công nếu người dùng đang sửa lại form
        setIsSuccess(false);

        // Validate realtime
        let newErrors = { ...errors };

        if (name === "email") {
            if (!value.includes("@")) {
                newErrors.email = "Email phải chứa ký tự @";
            } else {
                delete newErrors.email;
            }
        }

        if (name === "password") {
            if (value.length < 6) {
                newErrors.password = "Mật khẩu phải từ 6 ký tự";
            } else {
                delete newErrors.password;
            }
            // Nếu mật khẩu thay đổi, cần kiểm tra lại confirmPassword
            if (formData.confirmPassword && value !== formData.confirmPassword) {
                newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
            }
        }

        if (name === "confirmPassword") {
            if (value !== formData.password) {
                newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
            } else {
                delete newErrors.confirmPassword;
            }
        }

        setErrors(newErrors);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Kiểm tra lần cuối trước khi submit
        if (!formData.email || !formData.password || !formData.confirmPassword) {
            alert("Vui lòng điền đầy đủ thông tin!");
            return;
        }
        
        if (Object.keys(errors).length > 0) {
            alert("Form vẫn còn lỗi, vui lòng kiểm tra lại!");
            return;
        }

        setIsSuccess(true);
    };

    return (
        <div style={{ padding: "20px" }}>
            <h2>Thử thách 5.4: Form Events</h2>
            
            <form onSubmit={handleSubmit} style={{ maxWidth: "300px" }}>
                <div style={{ marginBottom: "15px" }}>
                    <label style={{ display: "block", marginBottom: "5px" }}>Email:</label>
                    <input 
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        style={{ width: "100%", padding: "5px" }}
                    />
                    {errors.email && <div style={{ color: "red", fontSize: "12px", marginTop: "5px" }}>{errors.email}</div>}
                </div>

                <div style={{ marginBottom: "15px" }}>
                    <label style={{ display: "block", marginBottom: "5px" }}>Mật khẩu:</label>
                    <input 
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        style={{ width: "100%", padding: "5px" }}
                    />
                    {errors.password && <div style={{ color: "red", fontSize: "12px", marginTop: "5px" }}>{errors.password}</div>}
                </div>

                <div style={{ marginBottom: "15px" }}>
                    <label style={{ display: "block", marginBottom: "5px" }}>Xác nhận mật khẩu:</label>
                    <input 
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        style={{ width: "100%", padding: "5px" }}
                    />
                    {errors.confirmPassword && <div style={{ color: "red", fontSize: "12px", marginTop: "5px" }}>{errors.confirmPassword}</div>}
                </div>

                <button type="submit" style={{ padding: "8px 15px", cursor: "pointer" }}>Đăng ký</button>
            </form>

            {isSuccess && (
                <div style={{ marginTop: "20px", color: "green", fontWeight: "bold" }}>
                    ✅ Đăng ký thành công!
                </div>
            )}
        </div>
    );
}

export default FormChallenges;