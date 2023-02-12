import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  fullName: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, unique: true },
  password: { type: String, required: true, trim: true },
  contact: { type: String, required: true },
  createdOn: { type: Date, default: Date.now },
  isAdmin: { type: Boolean, default: false },
});

let productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: Number,
  description: String,
  category: String,
  unitName: String,
  image: { type: String },
  createdOn: { type: Date, default: Date.now },
});
const productModel = mongoose.model("products", productSchema);

const adminSchema = mongoose.Schema({
  email: { type: String, required: true, trim: true, unique: true },
  password: { type: String, required: true, trim: true },
});
const otpSchema = new mongoose.Schema({
  otp: String,
  email: String,
  isUsed: { type: Boolean, default: false },
  createdOn: { type: Date, default: Date.now },
});
let categorySchema = new mongoose.Schema({
  category: String,
  image: { type: String },
  createdOn: { type: Date, default: Date.now },
});
const categoryModal = mongoose.model("category", categorySchema);

let orderSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  number: Number,
  email: { type: String },
  shippingAddress: String,
  createdOn: { type: Date, default: Date.now },
});
const orderModal = mongoose.model("order", orderSchema);

const userModel = mongoose.model("Users", userSchema);
const otpModel = mongoose.model("Opts", otpSchema);
const adminModel = mongoose.model("admin", adminSchema);
export { otpModel, adminModel, productModel, categoryModal, orderModal };
export default userModel;
