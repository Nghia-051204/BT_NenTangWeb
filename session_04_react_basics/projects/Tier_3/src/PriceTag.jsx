function PriceTag({ originalPrice, salePrice }) {
  // Tính % giảm giá
  const discount = Math.round(
    (1 - salePrice / originalPrice) * 100
  );

  return (
    <div className="price-tag">
      <p className="original">{originalPrice}đ</p>
      <p className="sale">{salePrice}đ</p>
      <span>-{discount}%</span>
    </div>
  );
}

export default PriceTag;