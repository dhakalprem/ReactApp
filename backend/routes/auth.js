const express = require('express');
const User = require('../models/User');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var fetchuser = require('../middleware/fetchuser');
const JWT_SECRET = "react-app-tech"


// Route 1: Create a User using POST "api/auth/Createuser". No login required
router.post('/createuser', [
  body('name', 'Enter a valid name').isLength({ min: 3 }),
  body('email', 'Enter a valid email').isEmail(),
  body('password', 'Password must be atleast 5 characters').isLength({ min: 5 }),
], async (req, res) =>
{
  let success = false;
  //if there are errors,return Bad Request and the errors
  const errors = validationResult(req);
  if (!errors.isEmpty())
  {
    return res.status(400).json({ success, errors: errors.array() });
  }
  //Check whether the user with this email exists already
  try
  {
    let user = await User.findOne({ email: req.body.email });
    if (user)
    {
      return res.status(400).json({ success, error: "Sorry a user with this email already exists" })
    }
    //await always return the permise, when this line not resolve that time it is wait this line

    const salt = await bcrypt.genSalt(10);
    //passing the password and salt parameter to bcrypt hash
    secPass = await bcrypt.hash(req.body.password, salt);
    //create the users
    user = await User.create({
      name: req.body.name,
      password: secPass,//using the  secure password variabl
      email: req.body.email,
    })
    const data = {
      user: {
        id: user.id
      }
    }
    //const jwtData=jwt.sign(data,JWT_SECRET);
    //console.log(jwtData);
    //res.json(user)//sending user function as a responses
    const authtoken = jwt.sign(data, JWT_SECRET);
    success = true;
    res.json({ success, authtoken })
  }
  // Catch the error
  catch (error)
  {
    console.error(error.message);
    res.status(500).send("Some Error occured");
  }

});



//Route 2: Authenticate a using usionn POST "api/auth/login". No login required 
// login Endpoint // Authentication User
//Validation checks in Email and Password
router.post('/login', [
  body('email', 'Enter a valid email').isEmail(),
  body('password', 'Password cannot be blank').exists(),
], async (req, res) =>
{
  let success = false;
  //if error occurs then,return Bad Request and the errors
  const errors = validationResult(req);
  if (!errors.isEmpty())
  {
    return res.status(400).json({ errors: errors.array() });
  }
  //Using Destructuring method of javascript
  const { email, password } = req.body;
  try
  {
    //Find the user(In database) with the entered email of the client
    let user = await User.findOne({ email });
    if (!user)
    {
      success = false;
      //Error if invalid email is entered
      return res.status(400).json({ error: "Please ty to login with correct credentials" });
    }
    //Comparing the passwords
    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare)
    {
      succcess = false;
      //If invalid password is entered, show the error
      return res.status(400).json({ success, error: "Please ty to login with correct credentials" });
    }
    const data = {
      user: {
        //If both credentials are correct, then send the payload
        id: user.id
      }
    }
    const authtoken = jwt.sign(data, JWT_SECRET);
    success = true;
    //Send authtoken as a response
    res.json({ success, authtoken })
  }
  catch (error)
  {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});



// ROUTE 3: Get loggedin User Details using: POST "/api/auth/getuser". Login required
//Create a "Get User Route" GetUser is EndPoint
router.post('/getuser', fetchuser, async (req, res) =>
{
  try
  {
    // Geting the user Id
    userId = req.user.id;
    //Selecting the fields expect the password
    //Finding user by userId 
    const user = await User.findById(userId).select("-password")
    res.send(user)// Sending the user as a Response
  }
  catch (error)
  {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
})
module.exports = router
