import ProductCard from './ProductCard';
import Loader from '../common/Loader';
import EmptyState from '../common/EmptyState';

const ProductGrid = ({ products, isLoading }) => {
  if (isLoading) {
    return <Loader fullScreen={false} />;
  }

  if (!products || products.length === 0) {
    return (
      <EmptyState
        title="No Products Found"
        message="We couldn't find any products matching your criteria. Try adjusting your filters or search query."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;
