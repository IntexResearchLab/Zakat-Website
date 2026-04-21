function SupportOptionsSection() {
  return (
    <section className="bg-[#f9fdff] py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-8 lg:grid-cols-[1.02fr_0.98fr] lg:items-stretch">
          <div className="rounded-[1.35rem] bg-white p-8 shadow-[0_16px_40px_rgba(15,23,42,0.06)] sm:p-10 lg:p-12">
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.22em] text-[#115b82]">
              Stay Connected
            </p>
            <h2 className="max-w-[28rem] font-serif text-[2.4rem] leading-[0.98] tracking-[-0.04em] text-[#14324d] sm:text-[3rem]">
              Join with us to help others
            </h2>
            <p className="mt-5 max-w-[31rem] text-[1rem] leading-[1.65] text-[#5b6d7a]">
              Leave your contact information and we’ll reach out about ways to
              support Alokayon through giving, volunteering, or community work.
            </p>

            <form className="mt-8 space-y-4">
              <input
                className="w-full rounded-[1rem] border border-[#dbe6ee] bg-[#fcfeff] px-5 py-4 text-[1rem] text-[#14324d] outline-none transition placeholder:text-[#7e8d99] focus:border-[#98c1da] focus:ring-2 focus:ring-[#d9edf8]"
                placeholder="Enter your name"
                type="text"
              />
              <input
                className="w-full rounded-[1rem] border border-[#dbe6ee] bg-[#fcfeff] px-5 py-4 text-[1rem] text-[#14324d] outline-none transition placeholder:text-[#7e8d99] focus:border-[#98c1da] focus:ring-2 focus:ring-[#d9edf8]"
                placeholder="Enter your email"
                type="email"
              />
              <input
                className="w-full rounded-[1rem] border border-[#dbe6ee] bg-[#fcfeff] px-5 py-4 text-[1rem] text-[#14324d] outline-none transition placeholder:text-[#7e8d99] focus:border-[#98c1da] focus:ring-2 focus:ring-[#d9edf8]"
                placeholder="Enter your phone number"
                type="tel"
              />
              <button
                className="mt-2 inline-flex items-center justify-center rounded-full bg-[#f3be84] px-8 py-3.5 text-base font-bold text-[#3a2a1f] transition hover:bg-[#edb16d]"
                type="button"
              >
                Share My Contact
              </button>
            </form>
          </div>

          <div className="overflow-hidden rounded-[1.35rem] bg-white shadow-[0_16px_40px_rgba(15,23,42,0.06)]">
            <div className="relative h-full min-h-[28rem]">
              <img
                alt="Support donation"
                className="absolute inset-0 h-full w-full object-cover"
                src="/assets/home/carousel-3.jpg"
              />
              <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(11,35,53,0.78),rgba(11,35,53,0.18))]" />

              <div className="relative flex h-full flex-col justify-end p-8 sm:p-10 lg:p-12">
                <div className="max-w-sm rounded-[1.2rem] bg-white/92 p-6 backdrop-blur-sm">
                  <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#115b82]">
                    Give Directly
                  </p>
                  <h3 className="mt-3 font-serif text-[2rem] leading-[1] tracking-[-0.04em] text-[#14324d]">
                    Choose an amount to donate
                  </h3>

                  <div className="mt-6 rounded-[1rem] bg-[#f3f5f7] px-5 py-4 text-[1rem] text-[#70808c]">
                    $ Other amount
                  </div>

                  <button className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-[#1d621f] px-8 py-4 text-sm font-bold uppercase tracking-[0.16em] text-white transition hover:bg-[#174f19]">
                    Complete Donation
                  </button>

                  <p className="mt-4 text-center text-[0.72rem] tracking-[0.06em] text-[#8a96a0]">
                    Accepted: Visa, Mastercard, PayPal, Apple Pay
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default SupportOptionsSection
