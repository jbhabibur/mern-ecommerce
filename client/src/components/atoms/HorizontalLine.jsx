export const HorizontalLine = ({ height = "1px", color = "#E7E7E7" }) => {
  return (
    <div
      style={{ height, backgroundColor: color }}
      className="w-full mb-3"
    ></div>
  );
};
