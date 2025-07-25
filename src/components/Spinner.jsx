import ClipLoader from "react-spinners/ClipLoader";

const Spinner = ({ size = 80, loading = true }) => {
  return (
    <div className="absolute transform -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2">
      <ClipLoader
        size={size}
        color={"#8B5CF6"} 
        loading={loading}
      />
    </div>
  );
};

export default Spinner;
