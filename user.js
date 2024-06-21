const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const router = express.Router();
const User = require("../models/user.js");
const passport = require("passport");
const {saveRedirectUrl} =require("../middleware.js");

router.get("/signup", (req,res)=>{
    res.render("users/signup.ejs");
});

router.post("/signup" ,wrapAsync(async(req,res)=>{
   try{
    let{username,email,password}=req.body  //ye method post req me req ki body se info nikalne k kam aata h//
    const newUser =new User({email,username});
    const registeredUser=await User.register(newUser , password);
    req.login(registeredUser,(err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","welcome to wanderlust!!!");
        res.redirect("/listings");
    });

 
   }catch (error){
    req.flash("error",error.message);
    res.redirect("/signup");
}
}));

router.get("/login",(req,res)=>{
    res.render("users/login.ejs");
} );

router.post("/login", 
    saveRedirectUrl ,
    passport.authenticate("local",
        {failureRedirect:"/login",failureFlash : true})
         ,async(req,res)=>{
            req.flash( "success","welcome back to wandelust ! you are logged in !!!");
            let redirectUrl = res.locals.redirectUrl||"/listings";
            res.redirect(redirectUrl);
});//passport authenticate  requests in npm passport read kro 


router.get("/logout",(req,res, next)=>{
    req.logout((err)=>{
        if(err){
          return next(err);
        }
        req.flash("sucess" ,"logged out successfully");
        res.redirect("/listings");
    });
});
//req.logout inbuilt function h passport ka automatically logout kr deta h aur ek calllback leta h ki logout hone  just bad aakhirkar krna kya h //



module.exports=router;