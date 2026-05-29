function classicFizzBuzz() {
    console.log("=== RUNNING CLASSIC FIZZBUZZ (1 - 100) ===");
    for (let i = 1; i <= 100; i++) {
        let output = "";
        
        if (i % 3 === 0) output += "Fizz";
        if (i % 5 === 0) output += "Buzz";
        
        // Nếu chuỗi output không rỗng thì in output, ngược lại in số i
        console.log(output || i);
    }
}

function customFizzBuzz(n, rules) {
    console.log(`\n=== RUNNING CUSTOM FIZZBUZZ (1 - ${n}) ===`);
    
    for (let i = 1; i <= n; i++) {
        let output = "";
        
        // Duyệt qua toàn bộ danh sách quy tắc được truyền vào
        for (let j = 0; j < rules.length; j++) {
            const rule = rules[j];
            if (i % rule.divisor === 0) {
                output += rule.word; // Cộng dồn từ nếu chia hết
            }
        }
        
        console.log(output || i);
    }
}

classicFizzBuzz();

const advancedRules = [
    { divisor: 3, word: "Fizz" },
    { divisor: 5, word: "Buzz" },
    { divisor: 7, word: "Jazz" }
];

customFizzBuzz(105, advancedRules);