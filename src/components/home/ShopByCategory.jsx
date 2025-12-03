import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Masonry } from 'antd';
import { productApi } from '../../api/productApi';

// Fallback categories if DB is empty
const fallbackCategories = [
  {
    title: "OCCASION ABAYAS",
    image: "https://ik.imagekit.io/j90xpcrfe/Abaya%20B/Design-3/120.jpg?updatedAt=1763378853176",
    category: "occasion"
  },
  {
    title: "HAJJ/UMRAH CLOTHING",
    image: "https://ik.imagekit.io/j90xpcrfe/Abaya%20B/Design-1/makka_image_bg_optimized_500_o65AhkaAV.png",
    category: "hajj-umrah"
  },
  {
    title: "ESSENTIAL ABAYAS",
    image: "https://ik.imagekit.io/j90xpcrfe/Abaya%20B/Design-1/IMG-20251023-WA0020.jpg?updatedAt=1763378727733",
    category: "essential"
  },
  {
    title: "HIJABS",
    image: "https://ik.imagekit.io/j90xpcrfe/Abaya%20B/Design-1/IMG-20251023-WA0012.jpg?updatedAt=1763378727814",
    category: "hijabs"
  },
  {
    title: "KIDS",
    image: "https://ik.imagekit.io/j90xpcrfe/Abaya%20B/Design-3/2_1_zoom.jpeg",
    category: "kids"
  },
  {
    title: "THOBES",
    image: "https://ik.imagekit.io/j90xpcrfe/Abaya%20B/Design-3/AB_79_4386.jpg",
    category: "mens"
  },
  {
    title: "CASUAL WEAR",
    image: "https://ik.imagekit.io/j90xpcrfe/b10e8f3a-83e7-475f-9773-ad216f2b9e00_xwbN6JHwgh?updatedAt=1763889076117",
    category: "casual-wear"
  },
  {
    title: "SPORTSWEAR",
    image: "https://ik.imagekit.io/j90xpcrfe/Abaya%20B/Design-3/61.jpg?updatedAt=1763378853422",
    category: "sportswear"
  },
  {
    title: "NAHT Abaya Collection",
    image: "https://ik.imagekit.io/j90xpcrfe/115.jpg",
    category: "NAHT Abaya Collection"
  }
  
];

const ShopByCategory = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await productApi.getCategories();
        
        if (response?.categories && response.categories.length > 0) {
          // Use categories from database
          setCategories(response.categories);
        } else {
          // Use fallback categories if DB is empty
          setCategories(fallbackCategories);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        setCategories(fallbackCategories);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryClick = (category) => {
    navigate(`/products?category=${category}`);
  };

  if (loading) {
    return (
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
              Shop by Category
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="aspect-square bg-gray-200 animate-pulse rounded-lg" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-4 bg-white h-auto w-full">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            Shop by Category
          </h2>
          <p className="text-gray-600">Discover our curated collections</p>
        </div>

        <Masonry
          columns={{
            xs: 2,
            sm: 2,
            md: 3,
            lg: 4,
            xl: 4,
            xxl: 4
          }}
          gutter={16}
          items={categories.map((cat, index) => ({
            key: `category-${index}`,
            data: cat,
          }))}
          itemRender={({ data }) => (
            <div
              onClick={() => handleCategoryClick(data.category)}
              className="group relative overflow-hidden rounded-lg cursor-pointer"
              style={{ width: '100%' }}
            >
              {/* Image */}
              <img
                src={data.image}
                alt={data.title}
                className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-300"
                width="300"
                height="300"
                loading="lazy"
                style={{ width: '100%', height: 'auto' }}
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />

              {/* Text Overlay */}
              <div className="absolute inset-0 flex items-end justify-center pb-4">
                <h3 className="text-white text-sm sm:text-base md:text-lg lg:text-xl font-bold tracking-wider text-center px-2">
                  {data.title}
                  {data.count && (
                    <span className="block text-xs font-normal mt-1 opacity-90">
                      {data.count} items
                    </span>
                  )}
                </h3>
              </div>

              {/* Hover Effect Border */}
              <div className="absolute inset-0 border-2 border-transparent group-hover:border-white/50 transition-colors rounded-lg" />
            </div>
          )}
        />
      </div>
    </section>
  );
};

export default ShopByCategory;
