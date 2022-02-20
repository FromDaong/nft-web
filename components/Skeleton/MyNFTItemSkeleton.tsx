import ContentLoader from "react-content-loader";

export default function MyNFTItemSkeleton(props) {
  return (
    <div className="col-span-1" style={{ padding: "8px" }}>
      <ContentLoader
        speed={2}
        height={360}
        viewBox="0 0 400 460"
        backgroundColor="#f3f3f3"
        foregroundColor="#ecebeb"
      >
        <circle cx="31" cy="31" r="15" />
        <rect x="58" y="18" rx="2" ry="2" width="140" height="10" />
        <rect x="58" y="34" rx="2" ry="2" width="140" height="10" />
        <rect x="0" y="60" rx="2" ry="2" width="400" height="400" />
      </ContentLoader>
    </div>
  );
}
