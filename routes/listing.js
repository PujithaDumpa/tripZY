const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const Listing=require("../models/listing.js");
const {isLoggedIn,isOwner,validatelisting}=require("../middleware.js");
const { authorize } = require("passport");
const listingController=require("../controller/listing.js");
const multer=require("multer");
const {storage}=require("../cloudConfig.js");
const upload=multer({storage});

router.get("/search/:place",wrapAsync(listingController.searchListing));

router.get("/new",isLoggedIn,listingController.renderNewForm);

router.get("/:id/edit",isLoggedIn,wrapAsync(listingController.editListing));

router.route("/")
  .get(wrapAsync(listingController.index))
  .post(isLoggedIn,upload.single("image"), wrapAsync(listingController.createListing));
  
router.route("/:id")
  .get(wrapAsync(listingController.showListing))
  .put(isLoggedIn,isOwner,upload.single("image"), wrapAsync(listingController.updateListing))
  .delete(isLoggedIn,isOwner,wrapAsync(listingController.deleteListing));

router.route("/category/:type")
  .get(wrapAsync(listingController.listingbyType))


module.exports=router;
