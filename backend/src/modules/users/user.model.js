import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    // tenantId: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     required: true,
    //     index: true,
    // },

    name: {
      type: String,
      required: true,
    },

    username: {
      type: String,
      unique: true,
      sparse: true,
    },

    email: {
      type: String,
      required: true,
    },

    password: {
      type: String,
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    status: {
      type: String,
      enum: ["active", "suspended", "banned"],
      default: "active",
    },

    isPartner: {
      type: Boolean,
      default: false,
    },

    provider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },

    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },

    avatar: {
      type: String,
      default: null,
    },

    profileImage: {
      url: String,
      public_id: String,
      //   required: true,
    },

    resetPasswordToken: {
      type: String,
      default: null,
    },

    resetPasswordExpiry: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

// hash password only if modified
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  if (!this.password) return;

  this.password = await bcrypt.hash(this.password, 10);
});

// compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
  if (!this.password) return false;
  return bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
