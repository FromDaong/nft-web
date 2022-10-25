import { Button } from "packages/shared/components/Button";
import Card from "../Card";

export default function ProfileCard() {
  return (
    <Card className="border border-gray-200">
      <div className="w-full">
      <div className="relative overflow-hidden h-96 rounded-xl">
        <div className="absolute top-0 left-0 w-full h-[30%] z-0">
          <img
            src="https://ui8-crypter-nft.herokuapp.com/images/content/video-preview@2x.jpg"
            alt="Profile Cover"
            className="z-0 object-cover w-full h-full"
          />
        </div>
        <div className="absolute left-0 w-full h-20 px-8 top-16">
          <img
            src="https://ui8-crypter-nft.herokuapp.com/images/content/video-preview@2x.jpg"
            className="object-cover w-20 h-full border-4 border-white rounded-full shadow-xl"
            alt="TOTM Profile Picture"
          />
        </div>
        <div className="absolute bottom-0 ">
          <div className="p-4">
            <div className="flex">
              <h3 className="text-2xl font-medium text-gray-900">
                Cherie Noel
              </h3>
            </div>
            <p className="mt-1">@cherienoel</p>
            <p className="mt-2 text-ellipsis line-clamp-2">
              From Dominican Republic and the web. Their work includes computer
              drawings, installations and audiovisuals. Founder of the
              experimental creators community El Cuarto Elástico.
            </p>
          </div>
          <div className="flex items-center justify-between p-4 border-t border-gray-100">
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl font-medium text-gray-900">13k</h3>
              <p>followers</p>
            </div>
            <div>
              <Button className="text-white bg-blue-600 ">Follow</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
    </Card>
  );
}
