import { useNavigate } from "react-router-dom";
import { CiLocationArrow1 } from "react-icons/ci";

const PromoBanner = () => {
  const navigate = useNavigate();

  const promoCategories = [
    {
      title: "Casual Abayas",
      image:
        "https://ik.imagekit.io/j90xpcrfe/c8bef5ee-ded0-494d-a6b7-6ad0c88e2524_DEeB0tWBO?updatedAt=1763280129224",
      category: "casual-abayas",
      size: "large", // Takes left half
    },
    {
      title: "SPRING SUMMER",
      image:
        "https://images.unsplash.com/photo-1523359346063-d879354c0ea5?w=800&q=80",
      category: "spring-summer",
      size: "small", // Top right
    },
    {
      title: "SHIRT'S",
      image:
        "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=80",
      category: "shirts",
      size: "small", // Top right
    },
    {
      title: "CASUAL WEAR",
      image:
        "https://images.unsplash.com/photo-1490367532201-b9bc1dc483f6?w=800&q=80",
      category: "casual",
      size: "small", // Bottom right
    },
    {
      title: "EFFORTLESS ELEGANCE",
      image:
        "https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=800&q=80",
      category: "elegance",
      size: "small", // Bottom right
    },
  ];

  return (
    <div className="flex flex-col flex-1">
      <div className="py-10 md:py-16 px-3 h-screen sm:px-4 mb-8 md:mb-12 w-full">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:auto-rows-[600px]">
            {/* Left Large Card - DENIM'S */}
            <div
              onClick={() =>
                navigate(`/products?category=${promoCategories[0].category}`)
              }
              className="relative overflow-hidden cursor-pointer group aspect-16/9 sm:aspect-21/9 lg:aspect-auto lg:h-full"
            >
              <img
                src={promoCategories[0].image}
                alt={promoCategories[0].title}
                className="absolute inset-0 w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 group-hover:bg-black/10 transition-colors" />
              <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-4 sm:left-6 md:left-8">
                <h3 className="text-white text-2xl sm:text-3xl md:text-5xl font-bold tracking-wider">
                  {promoCategories[0].title}
                </h3>
              </div>
            </div>

            {/* Right Grid - 4 Cards */}
            <div className="grid grid-cols-2 gap-4 lg:h-full">
              {promoCategories.slice(1).map((item, index) => (
                <div
                  key={index}
                  onClick={() =>
                    navigate(`/products?category=${item.category}`)
                  }
                  className="relative overflow-hidden cursor-pointer group aspect-[1/1] sm:aspect-[4/3] lg:aspect-[1/1]"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 group-hover:bg-black/10 transition-colors" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <h3 className="text-white text-sm sm:text-lg md:text-2xl font-bold tracking-wider text-center px-3 sm:px-4">
                      {item.title}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}

      <div>
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-2xl md:text-4xl font-bold text-[#1f2933] mb-4 md:mb-6 font-['Playfair_Display']">
            Ready to Start Your Wholesale Journey?
          </h2>
          <p className="text-base md:text-xl text-gray-700 mb-6 md:mb-8">
            Join thousands of satisfied retailers worldwide
          </p>
          <button
            onClick={() => navigate("/products")}
            className="px-8 md:px-12 py-3 md:py-4 bg-[#02333a] text-white text-base md:text-lg font-medium rounded-full hover:bg-[#02333a]/80 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Explore Collection <CiLocationArrow1 className="inline ml-4 text-2xl text-bold!" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PromoBanner;
