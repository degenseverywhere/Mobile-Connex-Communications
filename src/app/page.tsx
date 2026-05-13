export default function Home() {
  return (
    <section className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <h1 className="text-4xl sm:text-5xl font-bold text-mcx-dark leading-tight">
        New &amp; Refurbished Phones
        <br />
        <span className="text-mcx-red">You Can Trust</span>
      </h1>
      <p className="mt-4 max-w-xl text-base sm:text-lg text-mcx-gray">
        Buy, sell, and trade quality devices with full transparency. Trusted by
        customers since 2007.
      </p>
      <div className="mt-8 flex flex-wrap gap-4 justify-center">
        <a
          href="/refurbished"
          className="px-6 py-3 rounded-lg bg-mcx-red text-white font-semibold hover:bg-mcx-red-dark transition-colors"
        >
          Shop Refurbished
        </a>
        <a
          href="/trade-in"
          className="px-6 py-3 rounded-lg border-2 border-mcx-red text-mcx-red font-semibold hover:bg-mcx-red-light transition-colors"
        >
          Get Trade-In Value
        </a>
      </div>
    </section>
  );
}
