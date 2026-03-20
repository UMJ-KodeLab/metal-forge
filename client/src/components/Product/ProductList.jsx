import ProductCard from './ProductCard';
import './ProductList.css';

export default function ProductList({ products }) {
  if (!products || products.length === 0) {
    return (
      <div className="product-list__empty">
        <p>Nenhum CD encontrado</p>
      </div>
    );
  }

  return (
    <div className="product-list">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
