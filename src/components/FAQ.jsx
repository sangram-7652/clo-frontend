import { useState } from "react";
import { FiPlus, FiMinus } from "react-icons/fi";

const faqs = [
  {
    question: "How can I place an order on CLO?",
    answer:
      "Browse products, add items to your cart, and proceed to checkout to place your order.",
  },
  {
    question: "I am facing an issue with my order. How can I get help?",
    answer:
      "You can contact our support team through the help section or email us for assistance.",
  },
  {
    question: "I want to return/exchange an item. How do I do that?",
    answer:
      "Go to your orders page, select the item, and choose return or exchange.",
  },
  {
    question: "Do you offer international shipping?",
    answer: "Yes, we offer international shipping to selected countries.",
  },
  {
    question: "How can I track my order?",
    answer:
      "After your order is shipped, you will receive a tracking link via email or SMS.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept UPI, debit cards, credit cards, net banking, and COD on selected orders.",
  },
  {
    question: "How long does delivery take?",
    answer:
      "Orders are usually delivered within 3-7 business days depending on your location.",
  },
  {
    question: "Can I cancel my order after placing it?",
    answer:
      "Yes, orders can be canceled before they are shipped from our warehouse.",
  },
  {
    question: "Are the product colors accurate in photos?",
    answer:
      "We try to display product colors as accurately as possible, but slight variations may occur.",
  },
  {
    question: "Do I need an account to place an order?",
    answer:
      "No, you can place an order as a guest, but creating an account helps manage orders easily.",
  },
  {
    question: "How can I contact CLO customer support?",
    answer:
      "You can reach our customer support team through email, phone, or the contact form on our website.",
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <>
      <div className="bg-[#f7f2eb] px-4 py-10 text-center text-2xl font-bold text-gray-900 sm:text-3xl">
        Frequently Asked Questions
      </div>

      <div className="mx-auto w-full max-w-3xl bg-[#f7f2eb] px-4 pb-12 sm:px-6">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="rounded-lg mb-4 overflow-hidden border border-gray-300 hover:border-gray-500 transition">
            <button
              onClick={() => toggleFAQ(index)}
              className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left text-base font-medium transition hover:bg-gray-50 sm:px-5 sm:text-lg">
              <span className="min-w-0">{faq.question}</span>

              {openIndex === index ? (
                <FiMinus className="text-xl" />
              ) : (
                <FiPlus className="text-xl" />
              )}
            </button>

            {openIndex === index && (
              <div className="px-5 pb-4 text-gray-600">{faq.answer}</div>
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default FAQ;
