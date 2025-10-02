const PulseLoader = () => {
  return (
    <div className="flex space-x-2 justify-center items-center">
      <div className="w-3 h-3 bg-gray-600/75 rounded-full animate-pulse"></div>
      <div className="w-3 h-3 bg-gray-600/75 rounded-full animate-pulse delay-150"></div>
      <div className="w-3 h-3 bg-gray-600/75 rounded-full animate-pulse delay-300"></div>
    </div>
  );
};
export default PulseLoader;
