import express from "express";
const router = express.Router();
import {
  signup,
  login,
  verification,
  logout,
  changePassword,
  getUser,
  addProduct,
  getProduct,
  deleteProduct,
  addcategory,
  getCategory,
  addOrder,
  getOrder,
} from "../controllers/userControllers.mjs";

// Public Routes
router.post("/login", login);
router.post("/signup", signup);

// Middle ware bearer
// router.use(verification);

// Protective routes
router.post("/logout", logout);
router.post("/change-password", changePassword);
router.post("/addProduct", addProduct);
router.post("/addProduct", addProduct);
router.get("/getOrder", getOrder);
router.post("/addOrder", addOrder);
router.get("/getProduct", getProduct);
router.get("/getCategory", getCategory);
router.delete("/deleteProduct", deleteProduct);
// For getting current user profile
router.get("/profile", getUser);

// For getting specific user
router.get("/profile/:id", getUser);
export default router;
