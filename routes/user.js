const { Router } = require("express");
const userRouter = Router();
const { userModel, purchaseModel, courseModel } = require("../db");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { z, ZodError } = require('zod');
const {JWT_SECRET_USER} = require('../config');
const { userMiddleware } = require('../middlewares/user');
const signupSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6), // Ensuring password is at least 6 characters
    firstName: z.string().min(1),
    lastName: z.string().min(1)
});

userRouter.post('/signup', async (req, res) => {
    try {
        // Validate request body using Zod
        const { email, password, firstName, lastName } = signupSchema.parse(req.body);

        // Hash the password (await this promise)
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the user in the database with the hashed password
        await userModel.create({
            email: email,
            password: hashedPassword, // Make sure the hashed password is passed, not the promise
            firstName: firstName,
            lastName: lastName
        });

        res.json({
            message: "You are signed up"
        });
    } catch (error) {
        // Handle validation or other errors
        if (error instanceof z.ZodError) {
            return res.status(400).json({
                message: "Validation failed",
                errors: error.errors
            });
        }
        res.status(500).json({
            message: "An error occurred",
            error: error.message
        });
    }
});


userRouter.post('/signin',async(req,res)=>{
    const { email , password} = req.body; 

    const user = await userModel.findOne({
        email: email, 
    })
    if(user){
    const isMatch = bcrypt.compare(password, user.password);
    
    if(isMatch){
        const token = jwt.sign({
            id: user._id
        },JWT_SECRET_USER);

        res.json({
            token: token
        })
    }

}else{
        res.status(403).json('User not found');
    }
    
});

userRouter.get('/purchases',(req,res)=>{
    res.json({
        message: "course"
    })
});
module.exports = {
    userRouter : userRouter
}