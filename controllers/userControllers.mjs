import userModel from "../model/userModel.mjs";
import {
  productModel,
  categoryModal,
  orderModal,
} from "../model/userModel.mjs";
import { stringToHash, varifyHash, validateHash } from "bcrypt-inzi";
import cookieParser from "cookie-parser";
import Jwt from "jsonwebtoken";

const SECRETKEY = "topsecret" || process.env.SECRETKEY;

const signup = async (req, res) => {
  // Get all data from user
  let { fullName, email, password, contact, isAdmin } = req.body;
  if ((!fullName || !email || !password, !contact)) {
    return res.status(400).send({
      message: "All data is required for authorization",
    });
  }

  userModel.findOne({ email: email }, (err, user) => {
    if (!err) {
      if (user) {
        return res.status(400).send({
          message: "user already exist,, please try a different email",
        });
      } else {
        stringToHash(password).then((hashString) => {
          userModel.create(
            {
              fullName,
              email,
              password: hashString,
              contact,
              isAdmin,
            },
            (err, result) => {
              if (!err) {
                return res.status(201).send({ message: "user is created" });
              } else {
                return res
                  .status(500)
                  .send({ message: "internal server error" });
              }
            }
          );
        });
      }
    } else {
      return res.status(500).send({ message: "db error in query" });
    }
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    // null check - undefined, "", 0 , false, null , NaN
    return res.status(400).send({ message: "Data is missing" });
  }

  // check if user exist
  userModel.findOne(
    { email: email },
    "fullName email password isAdmin",
    (err, data) => {
      if (!err) {
        if (data) {
          // user found
          varifyHash(password, data.password).then((isMatched) => {
            if (isMatched) {
              const tokenData = {
                _id: data._id,
                email: data.email,
                iat: Math.floor(Date.now() / 1000) - 30,
                exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
              };
              const token = Jwt.sign(tokenData, SECRETKEY);
              return res
                .cookie("Token", token, {
                  maxAge: 86_400_000,
                  httpOnly: true,
                })
                .send({
                  message: "login successful",
                  profile: {
                    email: data.email,
                    fullName: data.fullName,
                    _id: data._id,
                    isAdmin: data.isAdmin,
                    token,
                  },
                });
            } else {
              return res
                .status(401)
                .send({ message: "Incorrect email or password" });
            }
          });
        } else {
          return res
            .status(401)
            .send({ message: "Incorrect email or password" });
        }
      } else {
        return res
          .status(500)
          .send({ message: "login failed, please try later" });
      }
    }
  );
};

const verification = (req, res, next) => {
  if (!req?.cookies?.Token) {
    return res.status(401).send({ message: "Your session has been expired" });
  }

  Jwt.verify(req?.cookies?.Token, SECRETKEY, (err, decodedData) => {
    if (!err) {
      const nowDate = new Date().getTime() / 1000;
      if (decodedData.exp < nowDate) {
        return res
          .status(401)
          .cookie("Token", "", {
            maxAge: 1,
            httpOnly: true,
          })
          .send({ message: "Your session has been expired" });
      } else {
        req.body.token = decodedData;
        next();
      }
    } else {
      return res.status(401).send("invalid token");
    }
  });
};

const logout = (req, res) => {
  res.cookie("Token", "", {
    maxAge: 1,
    httpOnly: true,
  });
  return res.send({ message: "Logout successful" });
};

const addProduct = (req, res) => {
  const body = req.body;

  if (
    // validation
    !body.name ||
    !body.price ||
    !body.description ||
    !body.category ||
    !body.unitName ||
    !body.image
  ) {
    res.status(400).send({
      message: "required parameters missing",
    });
    return;
  }

  productModel.create(
    {
      name: body.name,
      price: body.price,
      description: body.description,
      image: body.image,
      category: body.category,
      unitName: body.unitName,
    },
    (err, saved) => {
      if (!err) {
        res.send({
          message: "product added successfully",
        });
      } else {
        res.status(500).send({
          message: "server error",
        });
      }
    }
  );
};

const getProduct = (req, res) => {
  productModel.find({}, (err, data) => {
    if (!err) {
      res.send({
        message: "got all products successfully",
        data: data,
      });
    } else {
      res.status(500).send({
        message: "server error",
      });
    }
  });
};

const deleteProduct = (req, res) => {
  const id = req.body.id;

  productModel.deleteOne({ _id: id }, (err, deletedData) => {
    if (!err) {
      if (deletedData.deletedCount !== 0) {
        res.send({
          message: "Product has been deleted successfully",
        });
      } else {
        res.status(404);
        res.send({
          message: "No Product found with this id: " + id,
        });
      }
    } else {
      res.status(500).send({
        message: "server error",
      });
    }
  });
};

const addcategory = (req, res) => {
  const body = req.body;

  if (
    // validation
    !body.category ||
    !body.image
  ) {
    res.status(400).send({
      message: "required parameters missing",
    });
    return;
  }

  categoryModal.create(
    {
      category: body.category,
      image: body.image,
    },
    (err, saved) => {
      if (!err) {
        res.send({
          message: "category added successfully",
        });
      } else {
        res.status(500).send({
          message: "server error",
        });
      }
    }
  );
};

const addOrder = (req, res) => {
  const body = req.body;

  if (!body.fullName || !body.email || !body.shippingAddress || !body.number) {
    res.status(400).send({
      message: "required parameters missing",
    });
    return;
  }

  orderModal.create(
    {
      fullName: body.fullName,
      email: body.email,
      number: body.number,
      shippingAddress: body.shippingAddress,
    },
    (err, saved) => {
      if (!err) {
        res.send({
          message: "Order added successfully",
        });
      } else {
        res.status(500).send({
          message: "server error",
        });
      }
    }
  );
};

const getCategory = (req, res) => {
  categoryModal.find({}, (err, data) => {
    if (!err) {
      res.send({
        message: "got all category successfully",
        data: data,
      });
    } else {
      res.status(500).send({
        message: "server error",
      });
    }
  });
};

const getOrder = (req,res) => {
  orderModal.find({}, (err, data) => {
    if (!err) {
      res.send({
        message: "got all orders successfully",
        data: data,
      });
    } else {
      res.status(500).send({
        message: "server error",
      });
    }
  });
};

// const verifyToken = () => {

// }

const changePassword = async (req, res) => {
  try {
    const body = req.body;
    const currentPassword = body.currentPassword;
    const newPassword = body.password;
    const _id = req.body.token._id;

    // check if user exist
    const user = await userModel.findOne({ _id: _id }, "password").exec();
    if (!user) return res.send({ message: "User not found" });
    const isMatched = await varifyHash(currentPassword, user.password);
    if (!isMatched) return res.send({ message: "password not match" });
    const newHash = await stringToHash(newPassword);
    await userModel.updateOne({ _id: _id }, { password: newHash }).exec();
    // success
    return res.send({ message: "password changed successful" });
  } catch (error) {
    return res.status(500).send({
      message: "Internal server timeout",
    });
  }
};

const getUser = async (req, res) => {
  let { email } = req.body;
  if (!req.body.email) {
    try {
      const user = await userModel.findOne({ email: email });
      res.send({ message: user });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  } else {
    res.send({ message: "Invalid data" });
  }
};

export {
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
  getOrder
};
