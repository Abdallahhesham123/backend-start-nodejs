import mongoose, { Schema, model, Types } from "mongoose";
const userSchema = new Schema(
  {
    FirstName: String,
    LastName: String,
    username: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    age: Number,
    phone: String,
    Profilepic: String,
    Coverpic: [String],
    confirmEmail: {
      type: Boolean,
      default: false,
    },
    gender: {
      type: String,
      default: "Male",
      enum: ["Male", "Female"],
    },
    status: {
      type: String,
      default: "Offline",
      enum: ["Offline", "Online"],
    },
    isDeleted:{
        type:Boolean,
        default:false
    },
    
    role:{
        type: String,
        default: "user",
        enum: ["user", "admin","superadmin"]
    
    },
   
  },
  {
    timestamps: true,
  }
);

const userModel =mongoose.models.User || model("User", userSchema);
export default userModel;
