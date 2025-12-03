import { useState, useEffect } from 'react';
import { FiX, FiFilter } from 'react-icons/fi';

const ProductFilter = ({ filters, onFilterChange, categories = [] }) => {
  const [localFilters, setLocalFilters] = useState(filters);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleChange = (key, value) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const emptyFilters = {
      category: '',
      minPrice: '',
      maxPrice: '',
      sortBy: 'createdAt',
      order: 'desc',
      search: '',
    };
    setLocalFilters(emptyFilters);
    onFilterChange(emptyFilters);
  };

  const hasActiveFilters = 
    localFilters.category || 
    localFilters.minPrice || 
    localFilters.maxPrice || 
    localFilters.search;

  return (
    <div className="bg-white rounded-xl sm:rounded-2xl shadow-md mb-4 sm:mb-6 md:mb-8">
      {/* Mobile Filter Toggle */}
      <div className="lg:hidden p-4 border-b border-gray-200">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="w-full flex items-center justify-between text-[#1f2933] font-semibold"
        >
          <span className="flex items-center gap-2">
            <FiFilter size={20} />
            Filters {hasActiveFilters && `(${Object.values(localFilters).filter(v => v && v !== 'createdAt' && v !== 'desc').length})`}
          </span>
          <span className="text-sm text-[#eec9af]">
            {showFilters ? 'Hide' : 'Show'}
          </span>
        </button>
      </div>

      {/* Filter Content */}
      <div className={`p-4 sm:p-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
        <div className="hidden lg:flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-[#1f2933] font-['Playfair_Display']">
            Filters
          </h3>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-sm text-[#eec9af] hover:text-[#e0b54d] font-medium flex items-center gap-1"
            >
              <FiX size={16} />
              Clear All
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Category Filter */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-[#1f2933] mb-2">
              Category
            </label>
            <select
              value={localFilters.category}
              onChange={(e) => handleChange('category', e.target.value)}
              className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#eec9af] focus:border-transparent"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Min Price */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-[#1f2933] mb-2">
              Min Price
            </label>
            <input
              type="number"
              value={localFilters.minPrice}
              onChange={(e) => handleChange('minPrice', e.target.value)}
              placeholder="₹0"
              min="0"
              className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#eec9af] focus:border-transparent"
            />
          </div>

          {/* Max Price */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-[#1f2933] mb-2">
              Max Price
            </label>
            <input
              type="number"
              value={localFilters.maxPrice}
              onChange={(e) => handleChange('maxPrice', e.target.value)}
              placeholder="$1000"
              min="0"
              className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#eec9af] focus:border-transparent"
            />
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-[#1f2933] mb-2">
              Sort By
            </label>
            <select
              value={`${localFilters.sortBy}-${localFilters.order}`}
              onChange={(e) => {
                const [sortBy, order] = e.target.value.split('-');
                handleChange('sortBy', sortBy);
                handleChange('order', order);
              }}
              className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#eec9af] focus:border-transparent"
            >
              <option value="createdAt-desc">Newest First</option>
              <option value="createdAt-asc">Oldest First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name-asc">Name: A to Z</option>
              <option value="name-desc">Name: Z to A</option>
              <option value="rating-desc">Highest Rated</option>
            </select>
          </div>
        </div>

        {/* Mobile Clear Button */}
        {hasActiveFilters && (
          <div className="mt-4 lg:hidden">
            <button
              onClick={clearFilters}
              className="w-full px-4 py-2 text-sm text-[#eec9af] hover:text-white border border-[#eec9af] hover:bg-[#eec9af] rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              <FiX size={16} />
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductFilter;
