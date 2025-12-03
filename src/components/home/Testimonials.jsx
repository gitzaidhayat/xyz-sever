import { useState, useEffect } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import leftBg from '../../assets/reviews-bg-image-left.svg';
import rightBg from '../../assets/reviews-bg-image-right.svg';
import starIcon from '../../assets/icon-star.svg';

const testimonials = [
  {
    id: 1,
    title: "OUTSTANDING",
    text: "Thank you . And I love your all Abayas . I ordered last week 3 Abayas and I love it and I order again seven Abayas coming this week.",
    author: "DAISY FLOWER",
    rating: 5
  },
  {
    id: 2,
    title: "EXCELLENT QUALITY",
    text: "The fabric quality is amazing and the fit is perfect. I've ordered multiple times and never been disappointed. Highly recommend!",
    author: "SARAH AHMED",
    rating: 5
  },
  {
    id: 3,
    title: "BEST ABAYAS",
    text: "Beautiful designs and excellent customer service. The shipping was fast and the packaging was very secure. Will definitely order again!",
    author: "FATIMA KHAN",
    rating: 5
  },
  {
    id: 4,
    title: "HIGHLY RECOMMENDED",
    text: "I am so impressed with the quality and style. These abayas are elegant and comfortable. Perfect for everyday wear and special occasions.",
    author: "AMINA MALIK",
    rating: 5
  },
  {
    id: 5,
    title: "AMAZING SERVICE",
    text: "From ordering to delivery, everything was smooth. The abayas exceeded my expectations. Great value for money!",
    author: "ZAINAB HASSAN",
    rating: 5
  }
];

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto scroll effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
    }, 5000); // Change testimonial every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const currentTestimonial = testimonials[currentIndex];

  return (
    <section className="py-20 px-4 bg-[#f5ebe0] relative overflow-hidden">
      {/* Background Images */}
      <div className="absolute left-0 top-0 w-1/3 h-full opacity-100">
        <img src={leftBg} alt="" className="absolute w-100% h-auto object-contain l-0 t-0 overflow-clip  " />
      </div>
      <div className="absolute right-0 bottom-0 w-100% h-auto opacity-100">
        <img src={rightBg} alt="" className="w-full h-full object-contain" />
      </div>

      <style>
        {`
          @keyframes fade-in {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-fade-in {
            animation: fade-in 0.7s ease-in-out;
          }
        `}
      </style>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Content */}
        <div className="text-center transition-all duration-700 ease-in-out">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 tracking-wider animate-fade-in">
            {currentTestimonial.title}
          </h2>
          
          <p className="text-base md:text-lg text-gray-700 leading-relaxed mb-6 max-w-2xl mx-auto px-4 animate-fade-in">
            {currentTestimonial.text}
          </p>
          
          <p className="text-sm md:text-base font-medium text-gray-600 tracking-widest mb-8 animate-fade-in">
            {currentTestimonial.author}
          </p>

          {/* Star Rating */}
          <div className="flex justify-center gap-2 mb-12 animate-fade-in">
            {[...Array(currentTestimonial.rating)].map((_, index) => (
              <img 
                key={index} 
                src={starIcon} 
                alt="star" 
                className="w-6 h-6 md:w-8 md:h-8"
              />
            ))}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-6">
            <button
              onClick={handlePrev}
              className="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-gray-900 transition-colors"
              aria-label="Previous testimonial"
            >
              <FiChevronLeft size={32} />
            </button>
            
            <span className="text-gray-600 font-medium">
              {currentIndex + 1} / {testimonials.length}
            </span>
            
            <button
              onClick={handleNext}
              className="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-gray-900 transition-colors"
              aria-label="Next testimonial"
            >
              <FiChevronRight size={32} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
