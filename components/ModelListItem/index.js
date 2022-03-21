import {Button} from "@chakra-ui/react"import GumletImage from "../../components/Image/GumletImage";

const ModelListItem = ({ data }) => {
  const profilePic = data.profilePicCdnUrl ?? data.profile_pic;
  const profilePicUrl = `/api/v2/utils/images/fetchWithFallback?default=${profilePic}`;
  return (
    <a href={`/creator/${data.username.replace("@", "")}`}>
      <div className="model-list-item">
        <div className="creator">
          <div className="pic">
            <GumletImage src={profilePicUrl} />
          </div>
          <div className="details">
            <div className="label">CREATOR</div>
            <div className="name">{data.username}</div>
          </div>
        </div>
        <div className="button pt-4 pt-md-0 ">
          <Button className="bg-primary text-white font-bold">
            <b>VIEW CREATOR</b>
          </Button>
        </div>
      </div>
    </a>
  );
};

export default ModelListItem;
