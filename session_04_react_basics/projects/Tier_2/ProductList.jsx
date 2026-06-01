function ProductList() {
    const products = [
        { id: 1, name: "Tai nghe Bluetooth", price: 850000 },
        { id: 2, name: "Bàn phím cơ", price: 1250000 },
        { id: 3, name: "Chuột không dây", price: 450000 },
        { id: 4, name: "Màn hình 24 inch", price: 3890000 },
        { id: 5, name: "Laptop bag", price: 950000 }
    ];

    const totalPrice = products.reduce((sum, product) => sum + product.price, 0);

    const formatCurrency = (price) => {
        return price.toLocaleString('vi-VN') + '₫';
    };

    return (
        <div style={{ padding: "20px", fontFamily: "Arial" }}>
            <h1>🛒 Danh sách sản phẩm</h1>

            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                    <tr style={{ background: "#3498db", color: "white" }}>
                        <th style={{ padding: "10px", border: "1px solid #ddd" }}>STT</th>
                        <th style={{ padding: "10px", border: "1px solid #ddd" }}>Tên sản phẩm</th>
                        <th style={{ padding: "10px", border: "1px solid #ddd" }}>Giá (VND)</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product, index) => (
                        <tr 
                            key={product.id} 
                            style={{
                                color: product.price > 1000000 ? "red" : "black",
                                fontWeight: product.price > 1000000 ? "bold" : "normal"
                            }}
                        >
                            <td style={{ padding: "8px", border: "1px solid #ddd", textAlign: "center" }}>
                                {index + 1}
                            </td>
                            <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                                {product.name}
                            </td>
                            <td style={{ padding: "8px", border: "1px solid #ddd", textAlign: "right" }}>
                                {formatCurrency(product.price)}
                            </td>
                        </tr>
                    ))}
                </tbody>
                <tfoot>
                    <tr style={{ background: "#f9f9f9", fontWeight: "bold" }}>
                        <td colSpan="2" style={{ padding: "10px", border: "1px solid #ddd", textAlign: "right" }}>
                            Tổng cộng:
                        </td>
                        <td style={{ padding: "10px", border: "1px solid #ddd", textAlign: "right", color: "#e67e22" }}>
                            {formatCurrency(totalPrice)}
                        </td>
                    </tr>
                </tfoot>
            </table>

            {products.some(p => p.price > 1000000) && (
                <div style={{ marginTop: "20px", padding: "10px", background: "#ffe6e6", borderRadius: "4px" }}>
                    ⚠️ Có sản phẩm giá trên 1 triệu đồng (hiển thị màu đỏ).
                </div>
            )}
        </div>
    );
}

export default ProductList;