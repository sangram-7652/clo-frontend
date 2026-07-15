const policySections = [
  {
    number: "01",
    title: "CLO Unboxing Policy",
    blocks: [
      {
        title: "Unboxing Video Requirement",
        copy: [
          "Whenever you receive an order from CLO, please record a complete unboxing video from start to end.",
          "This video is essential for verification in case of issues such as damaged or missing items.",
        ],
      },
      {
        title: "Importance of the Video",
        copy: [
          "The unboxing video acts as valid proof, helping us verify concerns and provide a fair, quick resolution.",
        ],
      },
    ],
  },
  {
    number: "02",
    title: "Return Policy",
    blocks: [
      {
        title: "Eligibility",
        items: [
          "Return is only available in case of a damaged product.",
          "Customers must initiate the request within 24-48 hours of receiving the product.",
          "The item must be unused, in its original condition, and have all tags attached.",
        ],
      },
      {
        title: "Customer Responsibility",
        items: [
          "Return and exchange shipments are entirely the customer's responsibility, including all expenses.",
          "If the customer chooses to send the parcel themselves, they are fully liable for the shipment.",
          "In case of courier loss during return transit, the customer bears full liability.",
        ],
      },
      {
        title: "Mandatory Unboxing Video",
        copy: [
          "A valid unboxing video is compulsory for any damage-related return claim.",
        ],
      },
    ],
  },
  {
    number: "03",
    title: "Refund Policy",
    blocks: [
      {
        title: "When Refund Is Applicable",
        items: [
          "Refund is only applicable if the customer receives a damaged product.",
          "The full amount will be refunded after the returned product is received and verified.",
        ],
      },
      {
        title: "Processing Time",
        items: [
          "Refunds are processed within 5 working days after verification.",
        ],
      },
      {
        title: "Damage Reporting Window",
        items: [
          "Any damage or product concern must be reported within 24 hours of receiving the parcel.",
          "Claims raised after 24-48 hours may not be entertained.",
        ],
      },
    ],
  },
  {
    number: "04",
    title: "Store Credit Policy",
    blocks: [
      {
        copy: [
          "We do not offer refunds for change of mind, but we provide lifetime-valid store credit.",
        ],
      },
      {
        title: "Store Credit Benefits",
        items: [
          "Valid for lifetime.",
          "Can be used anytime in the future.",
          "Redeemable via the same email ID used to place the order.",
          "Applicable on any product across the website.",
        ],
      },
    ],
  },
  {
    number: "05",
    title: "Exchange Policy",
    blocks: [
      {
        title: "Eligibility & Timeframe",
        items: [
          "No questions asked - exchange is allowed freely.",
          "Exchange requests must be raised within 5 days of receiving the order.",
          "Exchange can be done for any product, same or higher value.",
          "If higher, the difference amount must be paid.",
        ],
      },
      {
        title: "Pickup & Charges",
        items: [
          "We can arrange a pickup from your address.",
          "Pickup charges apply and must be paid by the customer.",
        ],
      },
      {
        title: "Terms & Conditions",
        items: [
          "Product must be unused, with tags and packaging intact.",
          "Once an item is exchanged, no further return or exchange is allowed.",
          "For products not liked, a lifetime store credit will be issued.",
          "Orders placed using store credit are treated as exchange orders and cannot be returned or exchanged again.",
          "Refund is not possible for change of mind.",
        ],
      },
    ],
  },
  {
    number: "06",
    title: "Cancellation Policy",
    blocks: [
      {
        title: "Time Limit",
        items: [
          "Cancellation request must be emailed to info@clo.co.in within 2 hours of placing the order.",
        ],
      },
      {
        title: "Eligibility",
        items: [
          "Only orders cancelled within 2 hours qualify for a full refund.",
          "If the order is already under dispatch, it cannot be cancelled.",
          "No requests accepted after 2 hours.",
        ],
      },
      {
        title: "Refund Processing",
        items: ["Approved refunds are processed within 5-7 working days."],
      },
      {
        title: "Customer Agreement",
        copy: [
          "The customer agrees not to dispute CLO's final cancellation decision.",
        ],
      },
      {
        title: "Prepaid Orders",
        items: [
          "If a prepaid parcel is not accepted and returns to us (RTO), it can be re-dispatched, but refund will not be provided.",
          "Re-dispatch charges apply and depend on the location.",
        ],
      },
    ],
  },
  {
    number: "07",
    title: "Important Notes",
    blocks: [
      {
        items: [
          "Returns and exchanges apply only within the specified conditions and timeframes.",
          "CLO reserves the right to reject returns/exchanges that do not meet policy criteria.",
          "Customers must ensure safe return of the item to the designated address.",
          "During festive/monsoon seasons, dispatch may take up to 6-7 working days due to high demand and weather conditions.",
        ],
      },
    ],
  },
];

const ReturnExchange = () => {
  return (
    <main className="min-h-screen bg-[#f7f2eb] text-[#3e3124]">
      <section className="px-4 pb-8 pt-10 sm:px-6 sm:pb-12 sm:pt-14">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1fr_320px] lg:items-end">
          <div>
            <p className="clo-eyebrow mb-4 text-[#8f765b]">CLO Policies</p>

            <h1 className="clo-page-title max-w-3xl text-black">
              Return & Exchange
            </h1>

            <p className="mt-5 max-w-3xl text-sm leading-7 text-[#6f6256] sm:text-base">
              Review the timelines, proof requirements, pickup charges, and
              refund rules before raising a return, exchange, or cancellation
              request.
            </p>
          </div>
        </div>
      </section>

      <section className="border-t border-[#d7c8b8] bg-white/35 px-4 py-10 sm:px-6 sm:py-14">
        <div className="mx-auto max-w-6xl">
          <div className="space-y-4">
            {policySections.map((section) => (
              <PolicySection key={section.title} section={section} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

const PolicySection = ({ section }) => {
  return (
    <article className="rounded-md border border-[#d7c8b8] bg-white p-5 shadow-sm sm:p-6 lg:p-8">
      <div className="grid gap-5 lg:grid-cols lg:gap-6">
        <div>
          <div className="flex items-start gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#d7c8b8] bg-[#f7f2eb] text-xs font-semibold text-[#8f765b]">
              {section.number}
            </span>

            <div className="text-lg font-semibold leading-7 text-black sm:text-xl">
              {section.title}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {section.blocks.map((block, index) => (
            <PolicyBlock key={`${section.title}-${index}`} block={block} />
          ))}
        </div>
      </div>
    </article>
  );
};

const PolicyBlock = ({ block }) => {
  return (
    <div className="space-y-3">
      {block.title && (
        <h3 className="text-base font-semibold text-black">
          {block.title}
        </h3>
      )}

      {block.copy?.map((paragraph) => (
        <p
          key={paragraph}
          className="text-sm leading-7 text-[#3e3124] sm:text-[15px] sm:leading-8">
          {paragraph}
        </p>
      ))}

      {block.items && <PolicyList items={block.items} />}
    </div>
  );
};

const PolicyList = ({ items }) => {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li
          key={item}
          className="flex gap-3 text-sm leading-7 text-[#3e3124] sm:text-[15px] sm:leading-8">
          <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-black" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
};

export default ReturnExchange;
