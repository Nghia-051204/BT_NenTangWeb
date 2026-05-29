// 1. Mảng dữ liệu đầu vào
const students = [
    { name: "An", math: 8, physics: 7, cs: 9, gender: "M" },
    { name: "Bình", math: 6, physics: 9, cs: 7, gender: "F" },
    { name: "Chi", math: 9, physics: 6, cs: 8, gender: "F" },
    { name: "Dũng", math: 5, physics: 5, cs: 6, gender: "M" },
    { name: "Em", math: 10, physics: 8, cs: 9, gender: "F" },
    { name: "Phong", math: 3, physics: 4, cs: 5, gender: "M" },
    { name: "Giang", math: 7, physics: 7, cs: 7, gender: "F" },
    { name: "Huy", math: 4, physics: 6, cs: 3, gender: "M" }
];

// Hàm tự viết để thêm khoảng trắng vào sau chuỗi, giúp căn chỉnh cột trong bảng ngay ngắn
function padRight(str, targetLength) {
    let result = str.toString();
    for (let i = result.length; i < targetLength; i++) {
        result += " ";
    }
    return result;
}

// 2. Khởi tạo các biến tích lũy và thống kê
let gioiCount = 0;
let khaCount = 0;
let tbCount = 0;
let yeuCount = 0;

let highestStudent = null;
let lowestStudent = null;

let totalMath = 0;
let totalPhysics = 0;
let totalCs = 0;

let totalMaleScore = 0;
let maleCount = 0;
let totalFemaleScore = 0;
let femaleCount = 0;

// In tiêu đề bảng kết quả
console.log("| STT | Tên    | TB   | Xếp loại    |");
console.log("|-----|--------|------|-------------|");

// 3. Vòng lặp chính xử lý từng sinh viên
for (let i = 0; i < students.length; i++) {
    const student = students[i];
    
    // Tính điểm trung bình (math×0.4 + physics×0.3 + cs×0.3)
    const avg = student.math * 0.4 + student.physics * 0.3 + student.cs * 0.3;
    // Làm tròn tới 1 chữ số thập phân
    const roundedAvg = Math.round(avg * 10) / 10;

    // Xếp loại học lực
    let rank = "";
    if (roundedAvg >= 8.0) {
        rank = "Giỏi";
        gioiCount++;
    } else if (roundedAvg >= 6.5) {
        rank = "Khá";
        khaCount++;
    } else if (roundedAvg >= 5.0) {
        rank = "Trung bình";
        tbCount++;
    } else {
        rank = "Yếu";
        yeuCount++;
    }

    // Tìm sinh viên có điểm TB cao nhất và thấp nhất
    if (highestStudent === null || avg > highestStudent.avg) {
        highestStudent = { name: student.name, avg: avg };
    }
    if (lowestStudent === null || avg < lowestStudent.avg) {
        lowestStudent = { name: student.name, avg: avg };
    }

    // Cộng dồn điểm để tính TB môn toàn lớp
    totalMath += student.math;
    totalPhysics += student.physics;
    totalCs += student.cs;

    // Tích lũy điểm phục vụ tính TB theo giới tính (Bonus)
    if (student.gender === "M") {
        totalMaleScore += avg;
        maleCount++;
    } else if (student.gender === "F") {
        totalFemaleScore += avg;
        femaleCount++;
    }

    // Định dạng chuỗi cho từng hàng trong bảng
    const sttStr = padRight(i + 1, 3);
    const nameStr = padRight(student.name, 6);
    const avgStr = padRight(roundedAvg.toFixed(1), 4);
    const rankStr = padRight(rank, 11);

    // In hàng dữ liệu ra console
    console.log(`| ${sttStr} | ${nameStr} | ${avgStr} | ${rankStr} |`);
}

// 4. Tính toán các giá trị trung bình sau khi kết thúc vòng lặp
const classAvgMath = totalMath / students.length;
const classAvgPhysics = totalPhysics / students.length;
const classAvgCs = totalCs / students.length;

const avgMale = maleCount > 0 ? (totalMaleScore / maleCount) : 0;
const avgFemale = femaleCount > 0 ? (totalFemaleScore / femaleCount) : 0;

// 5. In kết quả thống kê chi tiết
console.log("\n=========================================");
console.log("--- ĐẾM SỐ SINH VIÊN THEO XẾP LOẠI ---");
console.log(`Giỏi:       ${gioiCount} SV`);
console.log(`Khá:        ${khaCount} SV`);
console.log(`Trung bình: ${tbCount} SV`);
console.log(`Yếu:        ${yeuCount} SV`);

console.log("\n--- SINH VIÊN CAO ĐIỂM / THẤP ĐIỂM NHẤT ---");
console.log(`Cao nhất:  ${highestStudent.name} (${highestStudent.avg.toFixed(1)} điểm)`);
console.log(`Thấp nhất: ${lowestStudent.name} (${lowestStudent.avg.toFixed(1)} điểm)`);

console.log("\n--- ĐIỂM TRUNG BÌNH CÁC MÔN TOÀN LỚP ---");
console.log(`Toán (Math):       ${classAvgMath.toFixed(1)}`);
console.log(`Vật lý (Physics):  ${classAvgPhysics.toFixed(1)}`);
console.log(`Tin học (CS):      ${classAvgCs.toFixed(1)}`);

console.log("\n--- ĐIỂM TRUNG BÌNH THEO GIỚI TÍNH (BONUS) ---");
console.log(`Nam (M): ${avgMale.toFixed(1)}`);
console.log(`Nữ (F):  ${avgFemale.toFixed(1)}`);
console.log("=========================================");