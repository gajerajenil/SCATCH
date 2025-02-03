const bcrypt = require('bcrypt');
const userModel = require('../models/user-model');
const { generateToken } = require('../utils/generateToken'); // 


//user registration
module.exports.registerUser = async function(req, res) {
    try {
        let { email, password, fullname } = req.body;

        let user = await userModel.findOne({email: email});
        if(user ) return res.status(401).send("you already have account. plz login")
        // Generate salt and hash password
        bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(password, salt, async function(err, hash) {
                if (err) {
                    return res.status(500).send(err.message);
                } else {
                    try {
                        let user = await userModel.create({
                            fullname,
                            email,
                            password: hash,
                        });

                        // Generate token
                        let token = generateToken(user);

                        // Set token as a cookie
                        res.cookie("token", token);

                        // Send success response
                        res.status(201).send("User created successfully");
                    } catch (err) {
                        console.error(err.message);
                        res.status(500).send("Error creating user");
                    }
                }
            });
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};

//user create
module.exports.loginUser = async function(req,res){
    let {email, password} = req.body;

    let user = await userModel.findOne({ email: email});
    if(!user) return res.send("email or password incorrect");

    bcrypt.compare(password, user.password, function(err, result){
       if(result){
        let token = generateToken(user);
       res.cookie("token", token);
       res.redirect("/shop");
       }else{
        return res.redirect("/");
       }
    })
};

//user logout
module.exports.logout = function(req,res){
    res.cookie("token","");
    res.redirect("/");
}

