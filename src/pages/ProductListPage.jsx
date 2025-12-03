import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { fetchProducts, setFilters, fetchCategories } from '../store/slices/productSlice';
import ProductGrid from '../components/product/ProductGrid';
import ProductFilter from '../components/product/ProductFilter';

const ProductListPage = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { products, filters, categories, pagination, isLoading } = useSelector((state) => state.products);

  useEffect(() => {
    // Get filters from URL
    const urlFilters = {
      category: searchParams.get('category') || '',
      minPrice: searchParams.get('minPrice') || '',
      maxPrice: searchParams.get('maxPrice') || '',
      search: searchParams.get('search') || '',
      sortBy: searchParams.get('sortBy') || 'createdAt',
      order: searchParams.get('order') || 'desc',
    };
    dispatch(setFilters(urlFilters));
  }, [searchParams, dispatch]);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    const params = {
      ...filters,
      page: pagination.page,
      limit: pagination.limit,
    };
    dispatch(fetchProducts(params));
  }, [filters, pagination.page, dispatch]);

  const handleFilterChange = (newFilters) => {
    dispatch(setFilters(newFilters));
    // Update URL params
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    setSearchParams(params);
  };

  return (
    <div className="min-h-screen bg-[#f5e9da] py-4 sm:py-6 md:py-8 px-3 sm:px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-4 sm:mb-6 md:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#1f2933] mb-2 font-['Playfair_Display']">
            Our Collection
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            {pagination.total} products available
          </p>
        </div>

        {/* Filters */}
        <ProductFilter
          filters={filters}
          onFilterChange={handleFilterChange}
          categories={categories}
        />

        {/* Products Grid */}
        <ProductGrid products={products} isLoading={isLoading} />

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="mt-8 sm:mt-12 flex justify-center gap-1 sm:gap-2 flex-wrap">
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => dispatch(setFilters({ ...filters, page }))}
                className={`
                  px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors text-sm sm:text-base
                  ${
                    page === pagination.page
                      ? 'bg-[#d5a437] text-white'
                      : 'bg-white text-[#1f2933] hover:bg-[#f5e9da]'
                  }
                `}
              >
                {page}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductListPage;
