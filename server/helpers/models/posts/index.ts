import mongoose from "mongoose";
import createMongoDBModel from "../../utils";
import * as paginate from "mongoose-paginate-v2";

const NFTSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: [true, "Please add an NFT ID"],
      unique: "ID is already taken",
    },
    tx_hash: {
      type: String,
    },
    text: {
      type: String,
      required: [true, "Please add an NFT description"],
    },
    image: {
      cdn: {
        type: String,
        required: [true, "Please add an CDN url"],
      },
      ipfs: {
        type: String,
        required: [true, "Please add an IPFS url"],
      },
      blurhash: {
        type: String,
      },
    },
    tags: [],
    protected: {
      type: Boolean,
      required: false,
      default: false,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Profile",
      },
    ],
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

NFTSchema.plugin(paginate);

const Post = createMongoDBModel("Post", NFTSchema);

export default Post;
