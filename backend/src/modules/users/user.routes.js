import express from "express";
import { saveProfile, getProfile, uploadAvatar } from "./user.controller.js";
import { protect } from "../auth/auth.middleware.js";
import uploadImage from "../../middlewares/uploadImage.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Protected Routes
|--------------------------------------------------------------------------
*/

router.get("/profile", protect, getProfile);
router.put("/profile", protect, saveProfile);
router.put("/avatar", protect, uploadImage.single("avatar"), uploadAvatar);

export default router;
