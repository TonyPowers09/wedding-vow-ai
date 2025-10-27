const Loader = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="w-12 h-12 border-4 border-brand-accent border-t-brand-primary rounded-full animate-spin"></div>
      <p className="text-brand-primary font-medium animate-pulse">Crafting your perfect words...</p>
    </div>
  );
};

export default Loader;
