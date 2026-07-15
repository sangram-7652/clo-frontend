import { useState } from "react";
import { FiPlus, FiMinus } from "react-icons/fi";

const faqs = [
  {
    question: "How long does it take for an order to arrive?",
    answer:
      "At CLO, we commit to dispatching your parcel within 24-48 working hours (working days only). Please note that dispatches are processed only on working days to ensure smooth and timely operations. Most orders are delivered within 3-6 tentative working days, depending on the delivery location. For addresses in the Northeast and Southern regions, delivery may take 6-8 effective working days, depending on weather conditions and local logistics speed. During festive seasons or high-volume periods, there may be a significant delay due to courier load and regional restrictions. We request your kind patience during such times. Delivery will be made only to the address provided at the time of order placement.Note - Cash on Delivery is available PAN India. An additional charge will applied.",
  },
  {
    question: "Can I track my order?",
    answer:
      "Yes, you will receive the tracking details from Courier partners website directly on your registered mobile number via SMS, along with your shipping confirmation.",
  },
  {
    question: "Do I have to pay any other taxes and/or fees?",
    answer:
      "All taxes and other fees/charges are included in the price of the order.",
  },
  {
    question: "Can I change or cancel my order?",
    answer:
      "Order cancellation or change in order can be done till the order has not been dispatched. Please email us mentioning your Order ID. Note that requests must be made within 2 hours of placing the order.",
  },
  {
    question: "What to do if I receive a faulty/incorrect item?",
    answer:
      "If you have received an order in damaged condition, products can be returned or exchanged within 5 days from the delivery date. An unboxing video is mandatory for any damage claim.",
  },
  {
    question:
      "What if pickup service is not available at the customer Pin code ?",
    answer:
      "If pickup service is not available at your location, we kindly ask you to courier the parcel to us. Please share the courier receipt with us within 2 working days so we can assist you further",
  },
  {
    question:
      "Can I change my delivery address or make any special requests for my order ?",
    answer:
      "Any changes to the delivery address or special requests must be made within 24 hours of placing the order. Unfortunately, we are unable to accommodate such requests after this window has passed. We recommend reviewing your order details carefully before confirming your purchase to ensure everything is correct.",
  },
  {
    question:
      "Why do the photograph and the real product have slight differences?",
    answer:
      "Slight variations in colour may occur due to lighting, screen resolution, or photography, but the product matches its description.",
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <>
      <section className="bg-[#f7f2eb] px-4 py-14 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-4xl">
          {/* Heading */}
          <div className="mb-10 text-center">
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
              Frequently Asked Questions
            </h2>
          </div>

          {/* FAQ Accordion */}
          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;

              return (
                <div
                  key={index}
                  className={`overflow-hidden rounded-xl border transition-all duration-300 ${
                    isOpen
                      ? "border-gray-400 bg-white shadow-sm"
                      : "border-black/10 bg-white/50 hover:border-black/20 hover:bg-white"
                  }`}>
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="flex w-full items-center justify-between gap-5 px-5 py-5 text-left sm:px-6">
                    <span className="text-base font-medium leading-6 text-gray-900 sm:text-lg">
                      {faq.question}
                    </span>

                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${
                        isOpen
                          ? "bg-gray-900 text-white"
                          : "bg-[#f7f2eb] text-gray-900"
                      }`}>
                      {isOpen ? (
                        <FiMinus className="text-lg" />
                      ) : (
                        <FiPlus className="text-lg" />
                      )}
                    </span>
                  </button>

                  <div
                    className={`grid transition-all duration-300 ease-in-out ${
                      isOpen
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0"
                    }`}>
                    <div className="overflow-hidden">
                      <p className="px-5 pb-5 pr-16 text-sm leading-7 text-gray-600 sm:px-6 sm:pb-6 sm:text-base">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Important Conditions */}
          <div className="mt-12 rounded-2xl border border-black/10 bg-[#eee6db] p-6 sm:p-8">
            <div className="mb-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
                Please Note
              </p>

              <h3 className="mt-2 text-xl font-semibold leading-tight text-gray-900 sm:text-2xl">
                Important Conditions for Return/Exchange Requests
              </h3>
            </div>

            <ul className="space-y-4 text-sm leading-7 text-gray-700 sm:text-base">
              <li className="flex gap-3">
                <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-900" />
                <span>
                  All items to be returned or exchanged must be unused and in
                  their original condition with all original tags and packaging
                  intact.
                </span>
              </li>

              <li className="flex gap-3">
                <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-900" />
                <span>
                  Products can be returned or exchanged within 5 days from the
                  delivery date.
                </span>
              </li>

              <li className="flex gap-3">
                <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-900" />
                <span>
                  If an item includes a free gift or promotional product, the
                  free product must also be returned when returning the main
                  item.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
};

export default FAQ;
