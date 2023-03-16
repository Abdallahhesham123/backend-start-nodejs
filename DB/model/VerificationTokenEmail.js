import mongoose, { Schema, model, Types } from "mongoose";
const verifivicationSchema = new Schema(
  {
    owner: {
        type:Types.ObjectId,
        ref:"User",
        required: true
      },
      token:{
        type:String,
        required: true
      },
      createdAt:{

        type:Date,
        expires:3600,
        default:Date.now()
      }
  
  },
  {
    timestamps: true,
  }
);

const verifyModel =mongoose.models.Verify || model("Verify", verifivicationSchema);
export default verifyModel;