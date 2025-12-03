import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { videoApi } from "../../api/videoApi";
import ProductVideoCard from "../product/ProductVideoCard";

const FeedbackSection = () => {
  const navigate = useNavigate();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const scrollContainerRef = useRef(null);
  const currentVideoRef = useRef(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await videoApi.getVideos({ limit: 8 });
        if (response?.videos) {
          setVideos(response.videos);
        }
      } catch (error) {
        console.error("Error fetching videos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  const handlePrevious = () => {
    setCurrentVideoIndex((prev) => (prev > 0 ? prev - 1 : videos.length - 1));
  };

  const handleNext = () => {
    setCurrentVideoIndex((prev) => (prev < videos.length - 1 ? prev + 1 : 0));
  };

  const handleVideoClick = (index) => {
    setCurrentVideoIndex(index);
  };

  useEffect(() => {
    if (scrollContainerRef.current && videos.length > 0) {
      const container = scrollContainerRef.current;
      const videoWidth = 180; // Approximate width of thumbnail
      const scrollPosition = currentVideoIndex * videoWidth;
      container.scrollTo({
        left: scrollPosition - container.clientWidth / 2 + videoWidth / 2,
        behavior: "smooth",
      });
    }
  }, [currentVideoIndex, videos.length]);

  return (
    <section className="py-10 md:py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Feedback Section */}
        <div className="bg-[#eec9af]/20 rounded-lg md:rounded-2xl p-4 md:p-8 lg:p-12">
          <div className="flex flex-col gap-8 md:gap-12 items-center">
            
            {/* Video Showcase Section */}
            {videos.length > 0 && (
              <div className="mb-10 md:mb-20 w-full">
                <div className="text-center mb-6 md:mb-12">
                  <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-2">
                    Shop The Look
                  </h2>
                  <p className="text-sm md:text-base text-gray-600">
                    Discover our collection in motion
                  </p>
                </div>

                {loading ? (
                  <div className="flex gap-4 justify-center">
                    <div className="aspect-9/16 w-80 bg-gray-200 animate-pulse rounded-2xl" />
                  </div>
                ) : (
                  <div className="relative">
                    {/* Main Video Display */}
                    <div className="flex justify-center mb-4 md:mb-6">
                      <div className="w-full max-w-[300px] sm:max-w-sm md:max-w-md">
                        <ProductVideoCard
                          key={`active-${videos[currentVideoIndex]._id}`}
                          video={videos[currentVideoIndex]}
                          isActive={true}
                          ref={currentVideoRef}
                        />
                      </div>
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex justify-center gap-3 md:gap-4 mb-4 md:mb-6">
                      <button
                        onClick={handlePrevious}
                        className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gray-800 text-white hover:bg-gray-700 transition-colors flex items-center justify-center shadow-lg"
                        aria-label="Previous video"
                      >
                        <svg
                          className="w-5 h-5 md:w-6 md:h-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 19l-7-7 7-7"
                          />
                        </svg>
                      </button>

                      <button
                        onClick={handleNext}
                        className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gray-800 text-white hover:bg-gray-700 transition-colors flex items-center justify-center shadow-lg"
                        aria-label="Next video"
                      >
                        <svg
                          className="w-5 h-5 md:w-6 md:h-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </button>
                    </div>

                    {/* Scrollable Thumbnail Strip */}
                    <div className="relative">
                      <div
                        ref={scrollContainerRef}
                        className="flex gap-2 md:gap-3 overflow-x-hidden pb-4 px-2 md:px-4 scrollbar-hide snap-x snap-mandatory"
                        style={{
                          scrollBehavior: "smooth",
                          WebkitOverflowScrolling: "touch",
                        }}
                      >
                        {videos.map((video, index) => (
                          <div
                            key={video._id}
                            onClick={() => handleVideoClick(index)}
                            className={`shrink-0 w-28 sm:w-32 md:w-40 cursor-pointer transition-all duration-300 snap-center ${
                              index === currentVideoIndex
                                ? "ring-2 ring-[#02333a] scale-105"
                                : "opacity-60 hover:opacity-100"
                            }`}
                          >
                            <div className="relative aspect-9/16 rounded-lg overflow-hidden">
                              <video
                                src={video.video}
                                className="w-full h-full object-cover"
                                muted
                              />
                              {/* Play indicator for non-active videos */}
                              {index !== currentVideoIndex && (
                                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                                  <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center">
                                    <svg
                                      className="w-6 h-6 text-gray-800"
                                      fill="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path d="M8 5v14l11-7z" />
                                    </svg>
                                  </div>
                                </div>
                              )}
                              {/* Active indicator */}
                              {index === currentVideoIndex && (
                                <div className="absolute top-2 right-2 w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                              )}
                            </div>
                            
                          </div>
                        ))}
                      </div>
                    </div>

                    
                  </div>
                )}
              </div>
            )}


            {/* Left - Image */}
            <div className="flex flex-col md:flex-row gap-4 md:gap-6 order-2 md:order-1 w-full">
              <img
                src="https://ik.imagekit.io/j90xpcrfe/ReviewImage.jpg"
                alt="Muslim Fashion"
                className="w-full md:w-[50%] rounded-lg md:rounded-2xl shadow-lg"
              />

              <div className="flex flex-col justify-center">
                <p className="text-gray-800 text-sm md:text-lg lg:text-xl leading-relaxed mb-4">
                Experience the elegance and modesty of Muslim fashion with our
                curated collection. From stylish abayas to chic hijabs, find the
                perfect pieces that blend tradition with contemporary trends.
              </p>
              <button
                onClick={() => navigate("/shop")}
                className="mt-2 md:mt-4 px-6 py-3 bg-[#02333a] text-white text-base md:text-lg lg:text-xl hover:bg-[#03514c] transition-colors shadow-lg rounded"
              >
                Shop Now
              </button>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeedbackSection;
