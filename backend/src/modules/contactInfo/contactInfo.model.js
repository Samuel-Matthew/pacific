import mongoose from "mongoose";

const contactInfoSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    whatsapp: {
      type: String,
      trim: true,
    },
    telegram: {
      type: String,
      trim: true,
    },
    signal: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model("ContactInfo", contactInfoSchema);
