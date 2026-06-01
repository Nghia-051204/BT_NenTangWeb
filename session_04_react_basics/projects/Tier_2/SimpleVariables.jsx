function SimpleVariables() {
    const ten = "Dương Minh Nghĩa";
    const tuoi = 22;
    const queQuan = "Hà Nội";

    const gioHienTai = new Date().getHours();
    let loiChao;
    if (gioHienTai < 12) loiChao = "Chào buổi sáng";
    else if (gioHienTai < 18) loiChao = "Chào buổi chiều";
    else loiChao = "Chào buổi tối";

    const canNang = 55;
    const chieuCao = 1.62;
    const bmi = canNang / (chieuCao * chieuCao);
    const bmiLamTron = bmi.toFixed(1);

    return (
        <div style={{ padding: "20px", fontFamily: "Arial" }}>
            <h1>📌 Thông tin cá nhân</h1>
            <p>👤 Họ tên: {ten}</p>
            <p>📅 Tuổi: {tuoi}</p>
            <p>📍 Quê quán: {queQuan}</p>
            <hr />

            <h2>⏰ {loiChao}!</h2>
            <p>Bây giờ là {gioHienTai} giờ</p>
            <hr />

            <h2>📊 Chỉ số BMI</h2>
            <p>Cân nặng: {canNang} kg</p>
            <p>Chiều cao: {chieuCao} m</p>
            <p>BMI = {canNang} / ({chieuCao}²) = {bmiLamTron}</p>
            <p>
                Phân loại:{" "}
                {bmi < 18.5
                    ? "Gầy"
                    : bmi < 25
                    ? "Bình thường"
                    : bmi < 30
                    ? "Thừa cân"
                    : "Béo phì"}
            </p>
        </div>
    );
}

export default SimpleVariables;