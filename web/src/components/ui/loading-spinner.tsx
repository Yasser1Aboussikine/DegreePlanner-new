import { BeatLoader } from "react-spinners";

export const LoadingSpinner = () => {
  return (
    <div
      className="flex w-full items-center justify-center"
      style={{ minHeight: "calc(100vh - 120px)" }}
    >
      <BeatLoader color="green" size={20} />
    </div>
  );
};
