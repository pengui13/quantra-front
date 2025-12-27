const Skeleton = ({
  width = "w-full",
  height = "h-4",
  rounded = "rounded",
}) => {
  return (
    <div
      className={`inline-block skeleton-box bg-log-bkg ${width} ${height} ${rounded} relative overflow-hidden`}
    ></div>
  );
};

export default Skeleton;
