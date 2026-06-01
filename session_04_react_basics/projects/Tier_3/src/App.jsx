import Header      from "./components/Header";
import Footer      from "./components/Footer";
import ProductCard from "./components/ProductCard";

function App() {
  return (
    <div>
      <Header />         
      <main>
        {products.map(p => (
          <ProductCard key={p.id} {...p} />
        ))}

        <UserCard name="Minh" email="minh@gmail.com" avatar="..." />
        <UserCard name="An"   email="an@gmail.com"   avatar="..." />
        <UserCard name="Linh" email="linh@gmail.com" avatar="..." />

        
      </main>
      <Footer />        
    </div>
  );
}

export default App;