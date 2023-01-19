var jwt = require('jsonwebtoken');// import JWT
const JWT_SECRET = "premtech#89"
//Fetch user function with req,res and next parameters
const fetchuser = (req, res, next) => {
    const token = req.header('auth-token'); //Get the token from the header
    if (!token) {
        //If token is not present show the error
        res.status(401).send({ error: "Please authenticate using a valid token" })
    }
    try {
        const data = jwt.verify(token, JWT_SECRET);// Verify the token and the JWT secret
        req.user = data.user;
        next();// If verified, then execute the next function
    }
    catch (error) {
        res.status(401).send({ error: "Please authenticate using a valid token" })
    }
}
module.exports = fetchuser 
