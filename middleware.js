
const Listing = require("./models/listing");
const { listingSchema  } = require("./schema.js");
const ExpressError = require("./utils/ExpressError.js");

module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        //saving info of url
        req.session.redirectUrl= req.originalurl;
        req.flash("error" ,"You must login");
         return res.redirect("/login");
      }
      next();
};//(req.isauthenticated is used here which is a prebuilt function of npm passport package)//

module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner = async (req,res,next)=>{

    let {id}=req.params;
    let listing =  Listing.findById(id);
    if(!currUser&&listing.owner._id.equals(res.locals.currUser._id)){
      req.flash("error" , "you don't have permission to perform this task");
       return res.redirect(`/listings/${id}`);
    }
    next();


};

  
