import mongoose from "mongoose";

const videoSchema = new mongoose.Schema(
     {
          urlVideo:{
               type: String,
               required: true
          }
     }
)

export default mongoose.model("Video", videoSchema);