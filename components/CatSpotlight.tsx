const CAT_IMAGE_URL =
  'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=800&q=80';

const CatSpotlight = () => {
  return (
    <section className="flex flex-col md:flex-row gap-6 md:gap-8 items-center justify-center bg-white/70 dark:bg-brand-muted-dark/70 border border-white/60 dark:border-slate-700 rounded-2xl p-6 md:p-8 shadow-xl shadow-brand-accent/40 dark:shadow-black/40 backdrop-blur transition-colors">
      <img
        src={CAT_IMAGE_URL}
        alt="A curious orange cat looking up with bright green eyes."
        loading="lazy"
        className="w-full md:w-48 h-48 object-cover rounded-2xl shadow-lg border border-white/70 dark:border-slate-600"
      />
      <div className="text-center md:text-left space-y-2">
        <h2 className="text-2xl font-serif font-semibold text-brand-primary dark:text-brand-secondary">
          Catnap Muse
        </h2>
        <p className="text-brand-text/80 dark:text-slate-300">
          A quick stretch, a slow blink, and endless curiosity—let this whiskered muse nudge you toward
          vows that feel playful, affectionate, and wonderfully sincere.
        </p>
      </div>
    </section>
  );
};

export default CatSpotlight;
