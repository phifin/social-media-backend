import mongoose from "mongoose";

const imageSchema = new mongoose.Schema(
     {
          urlImage:{
               type: String,
               required: true
          }
     }
)

export default mongoose.model("Image", imageSchema);