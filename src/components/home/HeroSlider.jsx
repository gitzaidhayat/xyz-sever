import { useEffect, useState } from "react";

const HeroSlider = ({
  slides,
  autoPlay = true,
  delay = 2000,
  overlay = true,
}) => {
  const [current, setCurrent] = useState(0);
  const [isHovered, setIsHovered] = useState(true);

  // Auto play
  useEffect(() => {
    if (!autoPlay || isHovered || slides.length <= 1) return;

    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, delay);

    return () => clearInterval(interval);
  }, [autoPlay, delay, isHovered, slides.length]);

  if (!slides || slides.length === 0) return null;

  const goToSlide = (index) => {
    if (index < 0) index = slides.length - 1;
    if (index >= slides.length) index = 0;
    setCurrent(index);
  };

  return (
    <div
      className="relative w-full overflow-hidden bg-black"
      style={{ height: "100vh" }}
      onMouseEnter={() => setIsHovered(false)}                 /* Auto Play HeroSlider Image */
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Slides */}
      <div
        className="flex transition-transform duration-1000 ease-in-out h-full"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <div key={index} className="w-full h-full shrink-0 relative">
            {/* Background Image */}
            <img
              src={slide.src}
              alt={slide.alt || ""}
              className="w-full h-full object-cover object-center"
              loading={index === 0 ? "eager" : "lazy"}
            />

            {/* Dark Gradient Overlay */}
            <div className="absolute inset-0 bg-linear-to-r from-black/60 via-black/30 to-transparent" />

            {/* Content */}
            {overlay && (slide.title || slide.subtitle || slide.ctaText) && (
              <div className="absolute inset-0 flex items-center justify-center md:justify-start">
                <div className="px-8 md:px-16 lg:px-24 text-white max-w-2xl space-y-4 md:space-y-6">
                  {slide.badge && (
                    <span className="inline-block text-xs md:text-sm uppercase tracking-widest text-white/80 font-light">
                      {slide.badge}
                    </span>
                  )}
                  {slide.title && (
                    <h1
                      className="text-4xl md:text-5xl lg:text-7xl font-light leading-tight tracking-wide"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      {slide.title}
                    </h1>
                  )}
                  {slide.subtitle && (
                    <p className="text-sm md:text-base lg:text-lg text-white/90 font-light max-w-md leading-relaxed">
                      {slide.subtitle}
                    </p>
                  )}
                  {slide.ctaText && slide.onClick && (
                    <button
                      onClick={slide.onClick}
                      className="inline-block mt-4 text-sm md:text-base font-medium uppercase tracking-widest bg-white text-black px-8 py-3 hover:bg-white/90 transition-all duration-300"
                    >
                      {slide.ctaText}
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Vertical Text (Left Side) */}
            <div className="hidden md:block absolute left-8 top-1/2 -translate-y-1/2">
              <p
                className="text-white/60 text-xs uppercase tracking-widest"
                style={{
                  writingMode: "vertical-rl",
                  transform: "rotate(180deg)",
                }}
              >
                {current + 1 < 10 ? `0${current + 1}` : current + 1} / Woman
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Left Arrow */}
      <button
        type="button"
        onClick={() => goToSlide(current - 1)}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 text-white hover:text-white/70 transition-all duration-300 focus:outline-none z-20"
        aria-label="Previous slide"
      >
        <svg
          width="40"
          height="40"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>

      {/* Right Arrow */}
      <button
        type="button"
        onClick={() => goToSlide(current + 1)}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 text-white hover:text-white/70 transition-all duration-300 focus:outline-none z-20"
        aria-label="Next slide"
      >
        <svg
          width="40"
          height="40"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>

      {/* Dots Navigation */}
      <div className="absolute bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 flex gap-3 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => goToSlide(index)}
            className={`h-1.5 transition-all duration-300 ${
              current === index ? "bg-white w-12" : "bg-white/40 w-8"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSlider;
