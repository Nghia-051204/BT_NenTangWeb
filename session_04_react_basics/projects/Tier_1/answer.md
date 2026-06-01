## Bài 1.1 — Component Render Khi Nào?

Component chỉ **render 1 lần duy nhất** khi khởi động (mount).

> Nó sẽ **render lại** khi có thay đổi `state` hoặc `props`.

---

## Bài 1.2 — Biến "Bình Thường" vs `useState`

### ❌ Vấn đề: Biến thường KHÔNG làm UI cập nhật

```jsx
function BadCounter() {
    let count = 0; // biến thường

    function handleClick() {
        count = count + 1;
        // Console tăng đúng, nhưng UI "đứng hình"
    }

    return <button onClick={handleClick}>Bộ đếm: {count}</button>;
}
```

**Lý do:** React không "biết" rằng `count` vừa thay đổi → không có gì kích hoạt re-render.

---

### ✅ Giải pháp: `useState`

```jsx
import { useState } from "react";

function GoodCounter() {
    const [count, setCount] = useState(0);

    function handleClick() {
        setCount(count + 1); // React được thông báo → re-render!
    }

    return <button onClick={handleClick}>Bộ đếm: {count}</button>;
}
```

---

### So Sánh Nhanh

| Tiêu chí        | Biến thường          | `useState`                          |
|-----------------|----------------------|-------------------------------------|
| Khai báo        | `let count = 0`      | `const [count, setCount] = useState(0)` |
| Thay đổi        | `count = 5`          | `setCount(5)`                       |
| UI cập nhật?    | ❌ Không             | ✅ Có                               |
| Khi nào re-render? | Không bao giờ     | Mỗi lần gọi `setCount`              |

---

## Bài 1.3 — Luồng Hoạt Động (React Flow)

```
1. Component function được gọi
        ↓
2. Return JSX → React hiển thị lên màn hình
        ↓
3. Người dùng tương tác (click, nhập...)
        ↓
4. Gọi setState(newValue)
        ↓
5. React gọi lại component → RE-RENDER
        ↓
6. Return JSX mới → React cập nhật màn hình (chỉ phần thay đổi)
        ↓
   ↩ Quay lại bước 3
```

### Ví Dụ Minh Họa

```jsx
function FlowDemo() {
    console.log("🔄 Component render!");

    const [step, setStep] = useState(1);

    return (
        <div>
            <p>Bước hiện tại: {step}</p>
            <button onClick={() => setStep(step + 1)}>Tiếp →</button>
            <button onClick={() => setStep(1)}>Reset</button>

            {step === 1 && <p>👋 Bước 1: Xin chào!</p>}
            {step === 2 && <p>📖 Bước 2: Đang học React</p>}
            {step === 3 && <p>🎯 Bước 3: Hiểu useState</p>}
            {step === 4 && <p>🎉 Bước 4: Hoàn thành!</p>}
        </div>
    );
}
```

**Quan sát:** Mỗi lần nhấn nút, Console in ra `🔄 Component render!` → đây chính là React đang chạy lại toàn bộ function.