const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override")
const ejsMate = require("ejs-mate")

const MONGO_URL = "mongodb://127.0.0.1:27017/wonderlust"

main().then(() => {
    console.log("Connected to DB")
}).catch(err =>
    console.log(err)
);

async function main() {
    await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")))


// Index Route_____________________________________________________________________________
app.get("/listings", async (req, res) => {
    const allListings = await Listing.find({})
    res.render("./listings/index.ejs", { allListings })
})

// New Route______________________________________________________________________

app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs")
})


// Show Route___________________________________________________________________

app.get("/listings/:id", async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
    res.render("./listings/show.ejs", { listing })
})

// Create Route____________________________________________________________________________
app.post("/listings", async (req, res) => {
    let newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings")
})

//Edit Route____________________________________________________________________________________
app.get("/listings/:id/edit", async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
    res.render("./listings/edit.ejs", { listing })
})

//Update Route_________________________________________________________________________________

app.put("/listings/:id", async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`)
})

//Delete Route_________________________________________________________________________
app.delete("/listings/:id", async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
})


// app.get("/testLising", async (req, res) => {
//     let sampleListing = new Listing({
//         title: "My new Home",
//         description: "This is my new home",
//         price: 300000,
//         location: "Dhawda",
//         country: "India"
//     })
//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("testing succesfull");
// })


app.get("/", (req, res) => {
    res.redirect("/listings")
})
app.listen(8080, () => {
    console.log("server is starting")
});