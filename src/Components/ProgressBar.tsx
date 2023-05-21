import "./ProgressBar.css";

//-- Timer Progress Bar --//
export const ProgressBar = () => {
  return (
    <div>
      <div
        className="h-full bg-red-500"
        style={{ animation: "progress 3s linear" }}
      />
    </div>
  );
};
