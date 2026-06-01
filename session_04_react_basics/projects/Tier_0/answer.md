1. React Component là gì?
* Trong HTML thông thường:
    ```html
    <h1>Xin chào</h1>
    <p>Học React</p>
    ```
* Trong React:
    ```jsx
    function App() {
        return (
            <div>
                <h1>Xin chào</h1>
                <p>Học React</p>
            </div>
        );
    }
    ```

    - `App` được gọi là **Component** -> Component = Hàm tạo giao diện.

2. Tại sao phải có return?
    ```jsx
    function App() {
        return <h1>Hello</h1>;
    }
    ```
    - `return` dùng để trả giao diện cho React hiển thị.
    - Ví dụ trên sẽ hiển thị:
    ```html
    <h1>Hello</h1>
    ```
    - Nếu không có `return`:
    ```jsx
    function App() {

    }
    ```
thì React không có gì để hiển thị.

3. Tại sao phải bọc trong div?
* Sai:
    ```jsx
    function App() {
        return (
            <h1>Hello</h1>
            <p>React</p>
        );
    }
    ```
* Đúng:
    ```jsx
    function App() {
        return (
            <div>
                <h1>Hello</h1>
                <p>React</p>
            </div>
        );
    }
    ```
* React cần một phần tử gốc duy nhất.

4. File .jsx khác .js thế nào?
* JavaScript
    ```js
    const ten = "Minh";

    console.log(ten);
    ```
* JSX
    ```jsx
    function App() {
        return <h1>Hello</h1>;
    }
    ```

* `.jsx` cho phép viết JSX (gần giống HTML) bên trong JavaScript.

5. export default App là gì?
    ```jsx
    export default App;
    ```
    - Cho phép file khác import và sử dụng component App.
    - Ví dụ:
    ```jsx
    import App from "./App";
    ```

6. Nếu xóa export default?
* Nếu xóa:
    ```jsx
    export default App;
    ```
    - thì React sẽ không import được component.
* Lỗi thường gặp:
    ```text
    does not provide an export named 'default'
    ```