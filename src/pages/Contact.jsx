const Contact = () => {
  const handleSubmit = (event) => {
    event.preventDefault();
  };

  return (
    <section className="min-h-screen bg-[#f7f2eb] px-4 py-8 md:px-8 lg:px-16">
      {/* HERO */}
      <div className="mx-auto max-w-4xl text-center">
        <h1 className="clo-page-title text-black">
          We are here to help with your order.
        </h1>
      </div>

      <div className="mx-auto mt-10 flex max-w-7xl justify-center md:mt-16">
        {/* FORM CARD */}
        <div className="w-full max-w-3xl bg-white p-5 shadow-[0_10px_40px_rgba(0,0,0,0.05)] sm:p-6 md:p-10">
          <div className="mb-8">
            <h2 className="clo-section-title text-black">
              How can we help?
            </h2>

            <p className="mt-2 text-sm text-[#6f6256]">
              Fill out the form below and we'll contact you shortly.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* NAME + EMAIL */}
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-medium text-black">
                  Full name
                </label>

                <input
                  id="name"
                  type="text"
                  placeholder="Enter your name"
                  className="h-12 w-full rounded-md border border-[#d7c8b8] bg-white px-4 text-sm outline-none transition focus:border-black"
                />
              </div>

              <div>
                <label
                  htmlFor="contactEmail"
                  className="mb-2 block text-sm font-medium text-black">
                  Email address
                </label>

                <input
                  id="contactEmail"
                  type="email"
                  placeholder="you@example.com"
                  className="h-12 w-full rounded-md border border-[#d7c8b8] bg-white px-4 text-sm outline-none transition focus:border-black"
                />
              </div>
            </div>

            {/* PHONE */}
            <div>
              <label
                htmlFor="contactPhone"
                className="mb-2 block text-sm font-medium text-black">
                Mobile number
              </label>

              <input
                id="contactPhone"
                type="tel"
                placeholder="Enter mobile number"
                className="h-12 w-full rounded-md border border-[#d7c8b8] bg-white px-4 text-sm outline-none transition focus:border-black"
              />
            </div>

            {/* MESSAGE */}
            <div>
              <label
                htmlFor="message"
                className="mb-2 block text-sm font-medium text-black">
                Message
              </label>

              <textarea
                id="message"
                rows={6}
                placeholder="Tell us what you need help with"
                className="w-full rounded-md border border-[#d7c8b8] bg-white px-4 py-3 text-sm outline-none transition focus:border-black"
              />
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              className="mx-auto flex h-12 items-center justify-center rounded-md bg-black px-8 text-sm font-medium uppercase tracking-[2px] text-white transition hover:bg-[#222]">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
