import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },
 otp: {
      type: String,
   },

   otpExpiry: {
      type: Date,
   },

   isVerified: {
      type: Boolean,
      default: false,
   },
    // -------------------
    // MULTI DEVICE REFRESH TOKENS
    // -------------------
    refreshTokens: [
  {
    token: String,
    expiresAt: Date,
  },
],
  },
  {
    timestamps: true,
  }
);

// -------------------
// HASH PASSWORD
// -------------------
userSchema.pre("save", async function () {
  console.log("Pre-save hook triggered");
  if (!this.isModified("password")) {
    console.log("Password not modified, skipping hash");
    return;
  }

  try {
    console.log("Hashing password...");
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    console.log("Password hashed successfully");
  } catch (error) {
    console.log("Error hashing password:", error);
    throw error;
  }
});


const User = mongoose.model("User", userSchema);

export default User;