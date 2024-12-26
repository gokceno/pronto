export const GenreSection = ({ genres }) => {
    return (
      <div className="w-[1440px] h-[368px] mx-auto px-6">
        <h2 className="text-2xl font-bold mb-4">Radio by Genre</h2>
        <div className="grid grid-cols-4 gap-6">
          {genres.map((genre) => (
            <GenreCard key={genre.id} genre={genre} />
          ))}
        </div>
      </div>
    );
  };