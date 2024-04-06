import mongoose from "mongoose";

export interface FavYoutubeVideosSchema {
  title: string;
  description: string;
  thumbnailUrl?: string;
  watched: boolean;
  youtuberName: string;
}

const schema = new mongoose.Schema<FavYoutubeVideosSchema>({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  thumbnailUrl: {
    type: String,
    default: "https://via.placeholder.com/1600x900.webp",
    required: false,
  },
  watched: {
    type: Boolean,
    default: false,
    required: true,
  },
  youtuberName: {
    type: String,
    required: true,
  },
});

export const FavYoutubeVideosModel = mongoose.model(
  "fav-youtube-videos",
  schema
);
