const express = require('express');
const router = express.Router();
const isLoggedin = require("../middlewares/isLoggedin");
const productModel = require("../models/product-model");
const userModel = require('../models/user-model');

router.get("/", function (req, res) {
    let error = req.flash("error");
    res.render("index", { error, loggedin: false });
});

router.get("/shop", isLoggedin, async function (req, res) {
    let products = await productModel.find();
    let success = req.flash("success");
    res.render("shop", { products, success });
});

router.get("/cart", isLoggedin, async function (req, res) {
    try {
        let user = await userModel
           .findOne({ email: req.user.email })
           .populate({ path: "cart", model: productModel });
        console.log(user.cart);

        if (!user.cart || user.cart.length === 0) {
            res.render("cart", { user, bill: 0 });
            return;
        }

        let bill = 0;
        user.cart.forEach((product) => {
            let price = Number(product.price);
            let discount = product.discount? Number(product.discount) : 0;
            bill += price + 20 - discount;
        });

        // Pass the product image URL to the cart template
        let productsWithImages = user.cart.map((product) => {
            return {
               ...product,
                imageUrl: product.image.url, // Assuming image is a separate field in the product model
            };
        });

        res.render("cart", { user, bill, products: productsWithImages });
    } catch (err) {
        console.error("Error fetching user and cart:", err);
        res.status(500).send("Internal Server Error");
    }
});

router.get("/addtocart/:id", isLoggedin, async function (req, res) {
    let user = await userModel.findOne({ email: req.user.email });
    let product = await productModel.findById(req.params.id);
    if (!product) {
        req.flash("error", "Product not found");
        res.redirect("/shop");
        return;
    }
    user.cart.push(product);
    await user.save();
    req.flash("success", "added to cart");
    res.redirect("/shop");
});

router.get("/logout", isLoggedin, function (req, res) {
    res.render("shop");
});

module.exports = router;