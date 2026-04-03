import TopHeader from "../components/TopHeader";
import BottomNav from "../components/BottomNav";
import SearchListingCard from "../components/SearchListingCard";
import Icon from "../components/Icon";
import { useData } from "../context/DataContext";

const Favorites = () => {
  const { cars, favorites } = useData();
  
  const favoriteCars = cars.filter(c => favorites.includes(c.id));

  return (
    <>
      <TopHeader title="Motriva" showSearch={true} />

      <main className="page-wrapper animate-fade-up">
        {/* ── Page header ──────────────────────────── */}
        <div className="px-5 pt-5 pb-3">
            <h2 className="font-headline text-2xl font-black tracking-tight text-primary">
              Your Garage
            </h2>
            <p className="font-body text-sm text-on-surface-variant mt-1">
              Your favorited curated listings.
            </p>
        </div>

        {/* ── Listing Feed ─────────────────────────── */}
        <div className="px-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pb-5 mt-4">
          {favoriteCars.length > 0 ? (
            favoriteCars.map((car) => (
              <SearchListingCard key={car.id} car={car} />
            ))
          ) : (
            <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-10 bg-surface-container-lowest rounded-2xl border border-dashed border-outline-variant/30">
                <Icon name="favorite_border" size={48} className="text-outline-variant mb-2 mx-auto block" />
                <h4 className="font-headline font-bold text-on-surface">No favorites yet</h4>
                <p className="font-body text-sm text-on-surface-variant mt-1">Tap the heart icon on any car to save it here.</p>
            </div>
          )}
        </div>
      </main>

      <BottomNav />
    </>
  );
};

export default Favorites;
