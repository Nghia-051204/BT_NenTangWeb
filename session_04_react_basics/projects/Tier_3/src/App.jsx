import Header from "./components/Header";
import Footer from "./components/Footer";
import ProductCard from "./components/ProductCard";

function App() {
    return (
        <div>
            <Header />
            <main>
                <UserCard name="Minh" email="minh@gmail.com" avatar="..." />
                <UserCard name="An" email="an@gmail.com" avatar="..." />
                <UserCard name="Linh" email="linh@gmail.com" avatar="..." />
                {products.map(p => (
                    <ProductCard key={p.id} {...p} />
                ))}
                <h2 style={{ marginTop: "30px" }}>Sản phẩm giảm giá</h2>
                <PriceTag originalPrice={1200000} salePrice={899000} />
                <PriceTag originalPrice={500000} salePrice={500000} /> {/* không giảm */}
            </main>
            <Footer />
        </div>
    );
}

export default App;