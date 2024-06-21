const express = require("express");
const router = express.Router({mergeParams:true});
const ExpressError = require("../utils/ExpressError.js");
const wrapAsync =require("../utils/wrapAsync.js");
const Review = require("../models/review.js");
const { listingSchema , reviewSchema } = require("../schema.js");
const Listing= require("../models/listing.js");



const validateReview= (req ,res ,next)=>{
  let {error}= reviewSchema.validate(req.body);

  if(error){
    throw new ExpressError(400 , error);
  }else{
    next();
  }
};


//review route
router.post("/", validateReview, wrapAsync(async(req,res)=>{
    let listing = await Listing.findById(req.params.id);  //we are finding the particular lsiting
    let newReview = new Review(req.body.review); // and we are creating a new review
  
    listing.reviews.push(newReview); // now we are pushing the created review in the found listing.
  
    await newReview.save(); //here we are saving the changes of the review 
    await listing.save(); //here the listing changes are being saved. okk?
    req.flash("success" , "New review Created!!");
    
    res.redirect(`/listings/${listing._id}`);
  }));
  //delete review route
  router.delete("/:reviewId" , wrapAsync(async(req, res)=>
  {
    let {id ,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id ,{$pull:{reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success" , " Review deleted!!");
    res.redirect(`/listings/${id}`);
  
  }
  ));

  module.exports = router;
  