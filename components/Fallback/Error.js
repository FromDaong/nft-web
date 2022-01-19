export default function ErrorFallback({ custom, customTitle }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: 50,
        paddingBottom: 50,
      }}
    >
      <div
        style={{
          borderRadius: 5,
          paddingRight: 32,
          paddingLeft: 32,
          paddingTop: 16,
          paddingBottom: 16,
        }}
        className="pink-bg mb-5"
      >
        <h4 style={{ textAlign: "center", fontWeight: "bolder" }}>
          {customTitle || "An error occured"}
        </h4>
        <p>{custom || "An error occured while loading your content."}</p>
      </div>
    </div>
  );
}
