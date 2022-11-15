import { ImageResponse } from "@vercel/og";

export const config = {
  runtime: "experimental-edge",
};

const image = (
  <div
    style={{
      height: "100%",
      width: "100%",
      display: "flex",
      flexDirection: "column",
      background: "#fff",
      fontSize: 32,
      fontWeight: 600,
    }}
  >
    <div
      style={{
        position: "absolute",
        width: "80%",
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
        fontStyle: "normal",
        fontWeight: "800",
        fontSize: "64px",
        color: "#212121",
        display: "flex",
      }}
    >
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        <div
          style={{
            background: "#FFFFFF",
            boxShadow: "2px 4px 34px 7px rgba(17, 34, 17, 0.07)",
            padding: "28px",
            position: "relative",
            borderRadius: "30px",
            marginBottom: "20px",
            display: "flex",
          }}
        >
          <svg
            width="64"
            height="64"
            viewBox="0 0 564 564"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M196.045 33.043c-34.263 11.994-62.665 36.975-78.195 56.324l-.156.194-.167.184c-41.72 45.826-64.525 97.481-75.628 150.699l108.453-5.752a125.877 125.877 0 0 1 2.103-10.978l.07-.297.094-.291c3.391-10.591 11.541-25.081 25.567-33.387 14.755-8.737 34.319-9.65 57.787 4.306 6.962 4.084 17.565 10.198 26.766 15.281 4.616 2.549 8.807 4.8 11.986 6.398.882.443 1.655.82 2.316 1.132 5.27-2.442 12.393-4.873 19.865-5.707 6.631-.74 14.395-.286 21.284 3.35 6.955-7.89 16.134-15.08 25.143-21.098 11.614-7.757 23.71-14.068 32.268-17.885l.639-.285.679-.17c29.887-7.478 49.599-4.19 61.177 6.381 11.472 10.474 12.249 25.609 10.138 35.572l29.916-2.159c-5.035-16.366-14.148-31.233-26.976-44.423-7.697-7.914-16.111-13.303-24.813-16.799-12.363-4.966-25.562-6.209-38.413-5.114-21.589 1.839-41.488 10.223-53.07 17.348l-20.728 12.752 9.12-22.564c21.722-53.746-1.413-91.098-14.404-102.544-39.593-31.592-79.073-32.282-112.821-20.468Zm146.422 44.96c5.979 17.386 8.37 39.506 1.841 65.212 10.242-4.286 22.386-8.018 35.37-9.854-.372-6.165-2.653-13.354-6.204-20.752-4.385-9.135-10.125-17.391-14.209-22.37l-16.798-12.235Zm53.166 54.151c11.918-.088 24.286 1.721 36.276 6.466 4.881 1.411 11.003 4.637 17.21 8.36 6.642 3.985 14.148 9.016 21.691 14.345 15.096 10.663 30.689 22.764 40.459 30.668l.327.265.297.297c39.882 39.869 43.014 93.017 23.218 144.847-19.723 51.638-62.413 103.017-116.302 142.13-43.877 31.845-107.62 50.468-168.587 61.001-61.183 10.57-120.683 13.172-156.935 12.315l-2.378-.056-53.335-36.606-.581-3.311C26.401 452.52 13.897 379.361 17.697 305.131c.98-19.157 3.047-38.417 6.52-57.581 10.702-59.081 34.75-117.175 81.312-168.394 16.905-20.993 47.551-48.025 85.229-61.214C228.987 4.559 274.393 5.53 318.856 41.013l51.42 37.451.625.743c4.841 5.75 11.725 15.497 16.997 26.478 3.795 7.905 7.127 17.211 7.735 26.469Zm90.993 60.786a117.71 117.71 0 0 1 9.491 27.554c10.559 50.097-10.458 110.053-68.659 175.803-30.416 37.167-85.949 69.442-153.316 91.646-60.214 19.848-130.645 31.907-202.752 32.047l24.643 16.913c35.53.669 92.73-1.99 151.465-12.137 60.274-10.413 121.06-28.533 161.912-58.183 52.022-37.757 92.392-86.816 110.754-134.89 18.236-47.745 14.55-93.459-19.29-127.528a804.172 804.172 0 0 0-14.248-11.225ZM51.633 503.721c-9.98-57.121-20.767-123.46-18.269-190.704l110.541-7.826a31.35 31.35 0 0 0 1.113 3.518c3.866 10.125 12.37 16.963 18.75 20.301l.821.429.897.23a99.278 99.278 0 0 0 7.873 1.683c22.121 3.808 44.711.231 63.78-5.596 17.292-5.283 32.171-12.563 41.887-18.512 8.125 3.122 18.676 4.76 29.69.805 12.045 9.846 29.671 21.393 47.696 27.193 10.071 3.24 20.857 4.879 31.103 2.899 8.714-1.683 16.678-5.926 23.129-13.289 4.488.907 9.841.582 14.838-2.867 7.733-5.337 11.329-15.996 11.329-31.217v-.383l-.037-.382a87.518 87.518 0 0 1-.334-5.645l41.438-3.674c-8.462 31.326-28.359 66.576-62.503 105.123l-.106.12-.102.125c-27.639 33.847-79.927 64.906-146.034 86.696-64.099 21.127-140.294 33.236-217.5 30.973Zm429.694-239.406c1.777-11.873 1.831-23.11.337-33.672l-38.928 2.809c-3.453 12.419-5.177 24.612-5.906 34.809l44.497-3.946Zm-69.02 44.395c1.849.831 3.318.637 4.087.107.725-.501 2.671-2.479 3.722-8.595-3.899-4.037-10.014-7.286-18.21-9.461-9.547-2.533-21.028-3.357-32.762-2.71-8.388.462-16.723 1.666-24.341 3.432 6.068.402 12.298.964 18.428 1.724 9.809 1.217 19.562 2.964 28.073 5.452 7.903 2.311 15.51 5.477 21.003 10.051Zm-97.778-23.106c5.007-2.805 10.79-5.142 16.816-7.036 11.068-3.479 23.996-5.781 36.919-6.493 12.894-.711 26.139.142 37.746 3.222 5.016 1.331 9.904 3.127 14.375 5.503-.047-16.489 2.409-42.767 12.312-67.677 1.293-6.813.129-14.827-5.389-19.865-5.57-5.085-18.272-9.613-45.826-2.844-7.8 3.524-18.774 9.287-29.262 16.292-10.93 7.301-20.587 15.465-25.909 23.339-2.321 3.435-3.574 6.463-3.972 9.052l-.067.437-.115.426c-.747 2.776-1.641 7.196-1.895 11.213-.127 2.018-.071 3.627.114 4.743.048.291.097.5.136.64l4.365 4.369-3.934 5.512c-1.88 2.634-4.492 7.564-5.724 13.1-.461 2.073-.705 4.107-.69 6.067Zm-14.985 8.375c-1.558-6.281-1.14-12.538.057-17.916 1.25-5.622 3.436-10.722 5.653-14.685a21.444 21.444 0 0 1-.662-2.844c-.459-2.765-.466-5.702-.298-8.369.325-5.15 1.385-10.44 2.304-13.954.485-2.854 1.382-5.608 2.572-8.243-2.856-1.081-6.374-1.377-10.489-.918-4.76.532-9.517 2.016-13.292 3.606-.313 1.563-.747 3.358-1.199 5.181-.207.833-.425 1.703-.652 2.607-1.208 4.811-2.658 10.587-3.842 16.809-1.41 7.408-2.35 15.008-2.072 21.73.252 6.086 1.472 10.62 3.465 13.666 5.082 2.682 11.64 4.554 18.455 3.33Zm-37.413-10.616a61.808 61.808 0 0 1-.493-5.717c-.352-8.49.832-17.46 2.34-25.385 1.279-6.72 2.858-13.004 4.064-17.807a390.663 390.663 0 0 0 .927-3.726 116.99 116.99 0 0 1-1.429-.709c-3.457-1.737-7.862-4.105-12.537-6.688-9.371-5.176-20.112-11.371-27.146-15.497l-.021-.013-.022-.013c-19.378-11.531-32.623-9.544-41.475-4.302-9.476 5.612-15.699 16.013-18.391 24.217-5.343 22.746-2.05 41.151-.147 46.674l1.507 4.373-3.038 3.488c-8.264 9.486-8.012 16.273-6.305 20.744.224.585.483 1.159.774 1.719a18.225 18.225 0 0 1 1.041-3.325c1.714-4.063 4.834-7.331 9.078-9.667 4.886-2.689 12.431-4.576 20.371-5.956 8.244-1.432 17.936-2.478 27.791-3.08 14.84-.907 30.818-.853 43.111.67Zm-83.009 32.691c17.905 2.441 36.639-.496 53.342-5.599a180.905 180.905 0 0 0 27.944-11.188c-10.569-1.334-25.504-1.515-40.412-.604-9.419.575-18.503 1.567-26.028 2.874-7.827 1.36-13.041 2.914-15.395 4.209-1.547.852-1.926 1.571-2.051 1.869-.166.394-.312 1.113-.086 2.365.351 1.948 1.422 4.167 2.686 6.074Zm90.789-89.803Zm64.582 80.7c8.349 5.301 17.645 10.108 26.819 13.06 8.6 2.767 16.5 3.709 23.168 2.421 4.033-.78 7.796-2.401 11.177-5.227-2.465-1.112-5.413-2.185-8.844-3.189-7.391-2.161-16.225-3.774-25.551-4.93-8.967-1.112-18.206-1.78-26.769-2.135Zm-190.247-17.824c1.296-4.543 3.634-9.216 7.173-13.938-1.365-5.753-2.52-14.215-2.365-24.406l-110.17 5.844c-2.203 13.377-3.72 26.829-4.661 40.289l110.023-7.789Z"
              fill="#000"
            />
          </svg>
        </div>
        <h1>Hot, spicy content, directly from the creators!</h1>
      </div>
    </div>
  </div>
);

export default function (req) {
  const { searchParams } = new URL(req.url);

  // ?type=<media_type>
  const hasType = searchParams.has("type");
  if (!hasType) return new ImageResponse(image);
}
