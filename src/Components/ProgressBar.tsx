import "./ProgressBar.css";

//-- Timer Progress Bar --//
export const ProgressBar = () => {
  return (
    <div>
      <div
        className="h-full bg-rose-500"
        style={{ animation: "progress 5s linear" }}
      />
    </div>
  );
};
