const FastLoader = () => {
  return (
    <div
      className="fixed inset-0 flex justify-center items-center bg-gray-200 bg-opacity-50 "
      style={{ zIndex: "100" }}
    >
      <div role="status" className="flex justify-center items-center">
        <div className="flex gap-2 mt-12">
          <div className="h-4 w-4 sm:h-6 sm:w-6 md:h-[1.625rem] md:w-[1.625rem] bg-secondaryBg rounded-full animate-loader" />
          <div className="h-4 w-4 sm:h-6 sm:w-6 md:h-[1.625rem] md:w-[1.625rem] bg-secondaryBg rounded-full animate-loader animation-delay-200" />
          <div className="h-4 w-4 sm:h-6 sm:w-6 md:h-[1.625rem] md:w-[1.625rem] bg-secondaryBg rounded-full animate-loader animation-delay-400" />
        </div>
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
};

export default FastLoader;
