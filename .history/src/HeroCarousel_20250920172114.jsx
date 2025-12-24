import React from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';

const carouselImages = [
  "https://i.postimg.cc/L6KxJJ9Y/arno-senoner-FDt-JZDU8kws-unsplash.jpg",
  "https://i.postimg.cc/PqK5tq1d/dashboard-ui-3.png",
  "https://i.postimg.cc/9F0ffYvT/dashboard-ui-2.png",
];

export const HeroCarousel = () => {
  const [emblaRef] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 4000, stopOnInteraction: false })
  ]);

  return (
    <div id="hero-image" className="mt-16 flow-root sm:mt-24">
      <div className="-m-2 rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-2xl lg:p-4">

        <div className="embla rounded-md shadow-2xl" ref={emblaRef}>
          <div className="embla__container">
            {carouselImages.map((src, index) => (
              <div className="embla__slide" key={index}>
                <img
                  src={src}
                  alt={`Carousel slide ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};