export default function FolderIcon({
  dashed = false,
  width,
  height,
}: {
  dashed?: boolean;
  width?: number | string;
  height?: number | string;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width ? width : "180"}
      height={height ? height : "106"}
      viewBox="0 0 292 171"
      fill="#fefefe"
      strokeDasharray={dashed ? "18" : "0"}
    >
      <path
        d="M271 20C282.046 20 291 28.9543 291 40V150C291 161.046 282.046 170 271 170H21C9.9543 170 1 161.046 1 150V20C1 8.95431 9.9543 1 21 1H69H92.5L103 13M271 20H261L109.082 20.4808L103 13M271 20L265.5 13H103"
        stroke="black"
        strokeWidth={2}
      />
    </svg>
  );
}
