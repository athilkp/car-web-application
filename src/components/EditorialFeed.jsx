import { editorialNews } from "../data/cars";

const EditorialFeed = () => {
  const hero = editorialNews.find((n) => n.type === "hero");
  const secondaries = editorialNews.filter((n) => n.type === "secondary");

  return (
    <section className="px-5 mb-10">
      <h3 className="font-headline text-2xl font-bold tracking-tight text-primary mb-5">
        The Editorial Feed
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
        {/* Hero card */}
        {hero && (
          <div className="relative h-60 rounded-2xl overflow-hidden group cursor-pointer car-card">
            <img
              src={hero.image}
              alt={hero.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 hero-gradient flex flex-col justify-end p-5">
              <span className="text-tertiary-fixed text-[9px] font-black tracking-widest mb-2 uppercase">
                {hero.category}
              </span>
              <h4 className="text-on-primary font-headline text-lg font-bold leading-snug">
                {hero.title}
              </h4>
            </div>
          </div>
        )}

        {/* Secondary 2-col grid */}
        <div className="grid grid-cols-2 gap-3">
          {secondaries.map((item) => (
            <div
              key={item.id}
              className="bg-surface-container-low p-4 rounded-xl cursor-pointer hover:bg-surface-container transition-colors"
            >
              <span className="text-secondary text-[9px] font-black tracking-widest uppercase block mb-1.5">
                {item.category}
              </span>
              <h5 className="font-headline font-bold text-primary text-sm mb-1.5 leading-snug">
                {item.title}
              </h5>
              <p className="font-body text-[11px] text-on-surface-variant line-clamp-2">
                {item.excerpt}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EditorialFeed;
