function MissionSection() {
  return (
    <section className="bg-[#f9fdff] py-24 sm:py-28">
      <div className="mx-auto grid max-w-7xl gap-14 px-6 lg:grid-cols-[0.92fr_1.08fr] lg:items-center lg:gap-20">
        <div className="relative">
          <div className="overflow-hidden rounded-[1.75rem] shadow-[0_18px_48px_rgba(15,23,42,0.12)]">
            <img
              alt="Alokayon mission"
              className="aspect-[4/5] w-full object-cover"
              src="/assets/home/carousel-2.jpg"
            />
          </div>

          <div className="absolute bottom-[-1.25rem] right-4 max-w-[16.5rem] rounded-[1.2rem] bg-[#ffe39a] px-7 py-6 shadow-[0_18px_40px_rgba(245,158,11,0.14)] sm:bottom-[-1.5rem] sm:right-6">
            <p className="font-serif text-[1.05rem] italic leading-[1.45] text-[#7d6620] sm:text-[1.15rem]">
              &quot;The best of people are those who are most useful to others.&quot;
            </p>
          </div>
        </div>

        <div className="max-w-[40rem]">
          <p className="mb-5 text-sm font-bold uppercase tracking-[0.22em] text-[#115b82]">
            Our Sacred Mission
          </p>
          <h2 className="max-w-3xl font-serif text-[2.55rem] leading-[0.98] tracking-[-0.04em] text-[#14324d] sm:text-[3.15rem] lg:text-[3.7rem]">
            Empowering Communities Through Spiritual Responsibility
          </h2>

          <div className="mt-10 max-w-[35rem] space-y-10 text-[1.02rem] leading-[1.7] text-[#5b6d7a] sm:text-[1.08rem]">
            <p className="max-w-[34rem]">
              At Alokayon, we believe charity is more than just a transaction; it
              is a profound act of stewardship. We bridge the gap between those
              with the means to give and those with the capacity to thrive.
            </p>
            <p className="max-w-[34rem]">
              Our model prioritizes sustainable change, from direct community
              support to long-term educational opportunity, all grounded in the
              principles of equity, dignity, and transparency.
            </p>
          </div>

          <a
            className="mt-12 inline-flex items-center gap-4 rounded-full border border-[#c8dcea] bg-[#f3fbff] px-5 py-2.5 text-sm font-bold uppercase tracking-[0.2em] text-[#115b82] transition hover:gap-5 hover:border-[#abcbe0] hover:bg-[#e8f5fc]"
            href="#"
          >
            Learn More About Us
            <span aria-hidden="true" className="text-3xl leading-none">
              →
            </span>
          </a>
        </div>
      </div>
    </section>
  )
}

export default MissionSection
