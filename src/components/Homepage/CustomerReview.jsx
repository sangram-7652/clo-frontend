import { useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";

import { ChevronLeft, ChevronRight, Star } from "lucide-react";

const CustomerReview = () => {
  const reviews = [
    {
      name: "Sophia Williams",
      review: "Absolutely loved the fabric quality and fitting.",
    },
    {
      name: "Emma Johnson",
      review: "The delivery was super fast and amazing.",
    },
    {
      name: "Olivia Brown",
      review: "Premium quality and excellent support.",
    },
    {
      name: "Ava Taylor",
      review: "Beautiful collection and very comfortable.",
    },
    {
      name: "Sophia Williams",
      review: "Absolutely loved the fabric quality and fitting.",
    },
    {
      name: "Emma Johnson",
      review: "The delivery was super fast and amazing.",
    },
    {
      name: "Olivia Brown",
      review: "Premium quality and excellent support.",
    },
    {
      name: "Ava Taylor",
      review: "Beautiful collection and very comfortable.",
    },
  ];

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
  });

  // NEXT
  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  // PREV
  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  return (
    <section className="w-full overflow-hidden bg-clo-soft py-20">
      {/* HEADING */}
      <div className="text-center mb-12 px-4">
        <h2 className="clo-section-title mb-4">Customer Reviews</h2>

        <p className="text-gray-600">Hear what our customers say about us</p>
      </div>

      {/* CAROUSEL */}
      <div className="max-w-7xl mx-auto px-6 relative">
        {/* LEFT BUTTON */}
        <button
          onClick={scrollPrev}
          className="absolute left-0 md:-left-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full border border-black bg-white flex items-center justify-center hover:bg-black hover:text-white transition">
          <ChevronLeft size={22} />
        </button>

        {/* RIGHT BUTTON */}
        <button
          onClick={scrollNext}
          className="absolute right-0 md:-right-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full border border-black bg-white flex items-center justify-center hover:bg-black hover:text-white transition">
          <ChevronRight size={22} />
        </button>

        {/* EMBLA */}
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {reviews.map((item, index) => (
              <div
                key={index}
                className="min-w-full sm:min-w-[50%] lg:min-w-[25%] p-4">
                <div className="flex min-h-50 flex-col justify-center rounded-md bg-clo-soft p-8 text-center shadow-lg">
                  {/* STARS */}
                  <div className="flex justify-center gap-1 mb-5  ">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={18}
                        className="fill-black text-black"
                      />
                    ))}
                  </div>

                  {/* REVIEW */}
                  <p className="text-gray-700 leading-7 mb-6">
                    "{item.review}"
                  </p>

                  {/* NAME */}
                  <h3 className="clo-card-title">{item.name}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CustomerReview;
