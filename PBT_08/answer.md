# PHIẾU BÀI TẬP 08
# **JAVASCRIPT FUNCTIONS, ARRAYS & OBJECTS**

## PHẦN A — KIỂM TRA ĐỌC HIỂU (20 điểm)

### Câu A1 (5đ) — Function Declaration vs Expression vs Arrow

## Yêu cầu

Hàm tính:

* Thuế = 10% nếu lương > 11 triệu
* Thuế = 0% nếu ≤ 11 triệu

Trả về:

```js id="mwwcwe"
{
    thue,
    thuc_nhan
}
```

---

# 1. Function Declaration

```js id="ls5qrl"
function tinhThueBaoHiem(luong) {
    const thue = luong > 11000000 ? luong * 0.1 : 0;

    return {
        thue,
        thuc_nhan: luong - thue
    };
}
```

---

# 2. Function Expression

```js id="c0m4ii"
const tinhThueBaoHiem2 = function(luong) {
    const thue = luong > 11000000 ? luong * 0.1 : 0;

    return {
        thue,
        thuc_nhan: luong - thue
    };
};
```

---

# 3. Arrow Function

```js id="5jqu5x"
const tinhThueBaoHiem3 = (luong) => {
    const thue = luong > 11000000 ? luong * 0.1 : 0;

    return {
        thue,
        thuc_nhan: luong - thue
    };
};
```

---

# Hoisting khác nhau như thế nào?

# Function Declaration

Có hoisting hoàn toàn.

Ví dụ:

```js id="qjlwm5"
hello();

function hello() {
    console.log("Xin chào");
}
```

### Kết quả

```js id="8qg60w"
Xin chào
```

### Giải thích

* Function declaration được kéo toàn bộ lên đầu scope.
* Có thể gọi trước khi khai báo.

---

# Function Expression

```js id="pdjlwm"
hello();

const hello = function() {
    console.log("Xin chào");
};
```

### Kết quả

```js id="qkmfzk"
ReferenceError
```

### Giải thích

* Chỉ biến `hello` được hoisting.
* Nhưng biến nằm trong TDZ vì dùng `const`.

---

# Arrow Function

```js id="ab83qt"
hello();

const hello = () => {
    console.log("Xin chào");
};
```

### Kết quả

```js id="ngd3xl"
ReferenceError
```

### Giải thích

* Arrow function hoạt động giống function expression.
* Không được hoisting như declaration.

---

# Kết luận

| Kiểu                 | Hoisting         | Gọi trước khai báo |
| -------------------- | ---------------- | ------------------ |
| Function Declaration | Có               | Được               |
| Function Expression  | Không hoàn chỉnh | Không              |
| Arrow Function       | Không hoàn chỉnh | Không              |

---

# Câu A2 (5đ) — Scope & Closure

# Đoạn 1

```js id="f5ov07"
function counter() {
    let count = 0;

    return {
        increment: () => ++count,
        decrement: () => --count,
        getCount: () => count
    };
}

const c = counter();

console.log(c.increment());
console.log(c.increment());
console.log(c.increment());
console.log(c.decrement());
console.log(c.getCount());
```

---

# Dự đoán output

```js id="7k8h6f"
1
2
3
2
2
```

---

# Giải thích

* `count` được giữ lại nhờ closure.
* Các function bên trong vẫn truy cập được biến `count` dù `counter()` đã chạy xong.

Diễn biến:

| Lệnh        | count |
| ----------- | ----- |
| increment() | 1     |
| increment() | 2     |
| increment() | 3     |
| decrement() | 2     |
| getCount()  | 2     |

---

# Đoạn 2

```js id="mb6x0o"
for (var i = 0; i < 3; i++) {
    setTimeout(() => console.log("var:", i), 100);
}

for (let j = 0; j < 3; j++) {
    setTimeout(() => console.log("let:", j), 200);
}
```

---

# Output sau 200ms

```js id="v11h24"
var: 3
var: 3
var: 3

let: 0
let: 1
let: 2
```

---

# Giải thích chi tiết

# Vì sao `var` ra 3 3 3?

`var` có function scope.

Toàn bộ vòng lặp dùng chung một biến `i`.

Khi callback chạy:

```js id="8f0f92"
i === 3
```

nên in:

```js id="h6msm8"
3 3 3
```

---

# Vì sao `let` ra 0 1 2?

`let` có block scope.

Mỗi vòng lặp tạo một biến `j` mới.

Tương đương:

```js id="v5xqbt"
{
   let j = 0;
}

{
   let j = 1;
}

{
   let j = 2;
}
```

Mỗi callback giữ giá trị riêng nhờ closure.

---

# Kết luận

| Từ khóa | Scope          | Kết quả |
| ------- | -------------- | ------- |
| var     | Function scope | 3 3 3   |
| let     | Block scope    | 0 1 2   |

---

# Câu A3 (5đ) — Array Methods

```js id="vljz10"
const nums = [1,2,3,4,5,6,7,8,9,10];
```

---

# 1. Lấy các số chẵn

```js id="5g9v8m"
nums.filter(n => n % 2 === 0);
```

Kết quả:

```js id="jhtlyc"
[2,4,6,8,10]
```

---

# 2. Nhân mỗi số với 3

```js id="6rn6x8"
nums.map(n => n * 3);
```

Kết quả:

```js id="4ryq0z"
[3,6,9,12,15,18,21,24,27,30]
```

---

# 3. Tính tổng tất cả

```js id="n35p8s"
nums.reduce((sum, n) => sum + n, 0);
```

Kết quả:

```js id="4v2q0q"
55
```

---

# 4. Tìm số đầu tiên > 7

```js id="s1zc5t"
nums.find(n => n > 7);
```

Kết quả:

```js id="39z31o"
8
```

---

# 5. Kiểm tra CÓ số > 10 không

```js id="t89ktd"
nums.some(n => n > 10);
```

Kết quả:

```js id="srm1mj"
false
```

---

# 6. Kiểm tra TẤT CẢ đều > 0

```js id="8j8yha"
nums.every(n => n > 0);
```

Kết quả:

```js id="ay5l1s"
true
```

---

# 7. Tạo mảng "Số X là [chẵn/lẻ]"

```js id="6yg72v"
nums.map(n => `Số ${n} là ${n % 2 === 0 ? "chẵn" : "lẻ"}`);
```

---

# 8. Đảo ngược mảng (không mutate gốc)

```js id="0r9gk8"
[...nums].reverse();
```

Kết quả:

```js id="4h9hqr"
[10,9,8,7,6,5,4,3,2,1]
```

---

# Giải thích

* `reverse()` làm thay đổi mảng gốc.
* Dùng spread để copy trước khi reverse.

---

# Câu A4 (5đ) — Object Destructuring & Spread

```js id="l39rq4"
const product = {
    name: "iPhone 16",
    price: 25990000,
    specs: {
        ram: 8,
        storage: 256,
        color: "Titan"
    }
};
```

---

# Destructuring

```js id="fepohw"
const { name, price, specs: { ram, color } } = product;

console.log(name, price, ram, color);
console.log(specs);
```

---

# Dự đoán output

```js id="jrbw4t"
iPhone 16 25990000 8 Titan
```

---

```js id="yrxmhq"
ReferenceError
```

---

# Giải thích

Trong destructuring:

```js id="jlwm3x"
specs: { ram, color }
```

KHÔNG tạo biến `specs`.

Chỉ tạo:

```js id="qwecmg"
ram
color
```

nên:

```js id="5ddnfr"
console.log(specs);
```

bị lỗi.

---

# Spread

```js id="rlniv4"
const updated = {
    ...product,
    price: 23990000,
    sale: true
};

console.log(updated.price);
console.log(updated.sale);
console.log(product.price);
```

---

# Dự đoán output

```js id="y1l1aq"
23990000
true
25990000
```

---

# Giải thích

* Spread tạo object mới.
* `updated.price` thay đổi.
* `product.price` gốc không đổi.

---

# Spread gotcha

```js id="k9nl0k"
const copy = { ...product };

copy.specs.ram = 16;

console.log(product.specs.ram);
```

---

# Dự đoán output

```js id="f2vq3z"
16
```

---

# Tại sao?

Spread chỉ copy SHALLOW COPY.

Nghĩa là:

```js id="fup8av"
copy.specs === product.specs
```

vẫn là:

```js id="2bqhzv"
true
```

Cả hai cùng trỏ tới cùng object `specs`.

Nên sửa:

```js id="kavwqo"
copy.specs.ram = 16
```

sẽ làm object gốc đổi theo.

---

# Kết luận

* Function Declaration được hoisting hoàn toàn.
* Closure giúp function nhớ biến bên ngoài.
* `let` tạo scope riêng trong vòng lặp.
* Array methods giúp code ngắn gọn và functional hơn.
* Spread chỉ shallow copy, không deep copy.

# PHẦN C — SUY LUẬN

---

# Câu C1 (10đ) — Refactor Code

```js id="n8e3ol"
const processOrders = (orders) =>
    orders
        .filter(({ status, total }) =>
            status === "completed" && total > 100000
        )
        .map(({ id, customer, total }) => {
            const discount = total * 0.1;

            return {
                id,
                customer,
                total,
                discount,
                finalTotal: total - discount
            };
        })
        .sort((a, b) => b.finalTotal - a.finalTotal);
```

# Câu C2 (10đ) — Thiết kế API miniArray

## Implement miniArray

```js id="j8i5q0"
const miniArray = {
    map(arr, fn) {
        const result = [];

        for (let i = 0; i < arr.length; i++) {
            result.push(fn(arr[i], i, arr));
        }

        return result;
    },

    filter(arr, fn) {
        const result = [];

        for (let i = 0; i < arr.length; i++) {
            if (fn(arr[i], i, arr)) {
                result.push(arr[i]);
            }
        }

        return result;
    },

    reduce(arr, fn, initialValue) {
        let accumulator = initialValue;

        for (let i = 0; i < arr.length; i++) {
            accumulator = fn(accumulator, arr[i], i, arr);
        }

        return accumulator;
    }
};
```

---

# Test

```js id="r33n8f"
console.log(
    miniArray.map([1,2,3], x => x * 2)
);
// [2,4,6]
```

---

```js id="j2a4m8"
console.log(
    miniArray.filter([1,2,3,4], x => x > 2)
);
// [3,4]
```

---

```js id="jlwm7q"
console.log(
    miniArray.reduce([1,2,3,4], (a,b) => a+b, 0)
);
// 10
```