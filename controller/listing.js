const Listing=require("../models/listing");
const {listingschema}=require("../schema.js");

module.exports.index=async(req,res,next)=>{
    const alllistings=await Listing.find();
    res.render("listings/index.ejs",{alllistings});
};

module.exports.searchListing=async(req,res)=>{
    let{place}=req.params;
    const regex=new RegExp(place,'i');
    const listings = await Listing.find({ $or:[{location:regex},{country:regex},{title:regex}]});
    res.render("listings/index.ejs", { alllistings: listings });
}

module.exports.renderNewForm=(req,res)=>{    
    res.render("listings/new.ejs");
};

module.exports.showListing=async(req,res)=>{
   
    let {id}=req.params;
   
    const listing=await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
    if(!listing){
      req.flash("error","Listing you requested doesn't exist");
      res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listing});
};


module.exports.createListing = async (req, res, next) => {
    if (req.file) {
        req.body.listing.image = {
            url: req.file.path,
            filename: req.file.filename
        };
    } else {
        req.flash("error", "Image is required.");
        return res.redirect("/listings/new");
    }
    // Now create the new listing using the validated data
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save();

    req.flash("success", "New listing created!");
    res.redirect("/listings");
};


module.exports.editListing=async(req,res)=>{
  
    let {id}=req.params;
    const listing=await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you requested doesn't exist");
        res.redirect("/listings");
      }
    let originalImage=listing.image.url;
    originalImage.replace("/upload","/upload/h_300,w_250");
    res.render("listings/edit.ejs",{listing,originalImage});
};

  
module.exports.updateListing = async (req, res) => {
    let{id}=req.params;
    let listing=await Listing.findByIdAndUpdate(id,{...req.body.listing},{new:true});
    if(typeof req.file!=="undefined"){
        listing.image = {
            url: req.file.path,       
            filename: req.file.filename
        };
        await listing.save();
    }
    req.flash("success","Listing Updated");
    res.redirect(`/listings/${id}`);
};

module.exports.listingbyType=async (req, res) => {
    const { type } = req.params;
    const listings = await Listing.find({ category: type });
    res.render("listings/index.ejs", { alllistings: listings });
  };


module.exports.deleteListing=async(req,res)=>{
    let {id}=req.params;
    let deletedlist=await Listing.findByIdAndDelete(id);
    req.flash("success","listing deleted")
    res.redirect("/listings");
};