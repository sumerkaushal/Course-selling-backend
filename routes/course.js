const { Router } = require("express");
const courseRouter = Router();

courseRouter.post('/purchase',(req,res)=>{
    res.json({
        message : "$"
    })
});

courseRouter.get('/preview',(req,res)=>{
    res.json({
        message : "all courses"
    })
});

module.exports = {
    courseRouter : courseRouter
}