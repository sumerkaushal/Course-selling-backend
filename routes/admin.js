const { adminModel, courseModel } = require("../db");
const { Router } = require("express");
const adminRouter = Router();
const { z } = require("zod");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const user = require("./user");
const {JWT_SECRET_ADMIN} = require("../config");
const { adminMiddleware } = require("../middlewares/admin");


const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6), // Ensuring password is at least 6 characters
  firstName: z.string().min(1),
  lastName: z.string().min(1),
});

adminRouter.post("/signup", async(req, res) => {
  try {
    const parsedData = signupSchema.safeParse(req.body);
    if (!parsedData.success) {
      res.status(403).json({
        message: "Validation failed",
      });
    }
    const { email, password, firstName, lastName } = parsedData.data;
    const hashPassword = await bcrypt.hash(password, 10);

    await adminModel.create({
      email: email,
      password: hashPassword,
      firstName: firstName,
      lastName: lastName,
    });

    res.json({
      message: "Signup succeeded",
    });
  } catch (error) {
    error;
  }
});

adminRouter.post("/signin", async (req, res) => {
  const { password, email } = req.body;
  const admin = await adminModel.findOne({
    email: email,
  });

  if (admin) {
    const isMatch = await bcrypt.compare(password, admin.password);
    if (isMatch) {
      const token = jwt.sign(
        {
          id: admin._id,
        },
        JWT_SECRET_ADMIN
      );
      res.json({
        token: token,
      });
    }
  } else {
    res.json({
      message: "User not found",
    });
  }
});

adminRouter.post("/course", adminMiddleware, async (req, res) => {
  try {
    const adminId = req.userId;
    const { title, description, price, imageUrl, creatorId } = req.body;

    const course = await courseModel.create({
      title,
      description,
      price,
      imageUrl,
      creatorId: adminId, 
    });

    res.json({
      message: "Course Created",
      courseId: course._id,
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating course", error: error.message });
  }
});

adminRouter.put("/course",adminMiddleware,async(req,res)=>{
  try {
    const adminId = req.userId;
    const { title, description, price, imageUrl, courseId } = req.body;

    const course = await courseModel.updateOne({
      _id : courseId,
      creatorId: adminId
    },
     { title,
      description,
      price,
      imageUrl,
      creatorId: adminId, 
    });

    res.json({
      message: "Course Created",
      courseId: course._id,
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating course", error: error.message });
  }
})



adminRouter.get("/course/bulk", adminMiddleware, async(req, res) => {
  try {
    const adminId = req.userId;
    const { title, description, price, imageUrl, courseId } = req.body;

    const courses = await courseModel.find({
      _id : courseId,
      creatorId: adminId
    },
     

    res.json({
      message: "Course Created",
      courses
    }));
  } catch (error) {
    res.status(500).json({ message: "Error creating course", error: error.message });
  }
});

module.exports = {
  adminRouter: adminRouter,
};
