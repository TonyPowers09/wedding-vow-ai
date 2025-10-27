const Loader = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="w-12 h-12 border-4 border-brand-accent dark:border-brand-muted-dark border-t-brand-primary dark:border-t-brand-secondary rounded-full animate-spin"></div>
      <p className="text-brand-primary dark:text-brand-secondary font-medium animate-pulse">Crafting your perfect words...</p>
    </div>
  );
};

export default Loader;
