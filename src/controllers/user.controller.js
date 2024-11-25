import errResponse from "../utils/errResponse.js";
import sucResponse from "../utils/sucResponse.js"

import { User } from "../models/user.model.js";


// Create a new user
export const createUser = async(req,res,next) => {

    // get the user
    // check whether inputs are empty
    // check whether user exists
    // create a new user
    // save the user

    try {

        const {username,password} = req.body;

        if(!username.trim() || !password.trim()){
           throw new errResponse("Please provide a username and password",400)
        }

        const ifUserExists = await User.findOne({username})

        if(ifUserExists){
            throw new errResponse("User already exists",400)
        }

        const newUser = new User({
            username,
            password
        })

        await newUser.save()

        return res.json( new sucResponse("User created successfully", 201 , newUser))
        
    } catch (error) {
        next(error)
    }
}

// Login a user
export const loginUser = async(req,res,next) => {

    // get the username and password
    // check whether inputs are empty
    // check whether user exists
    // check whether password is correct
    // generate a token
    // return the token

    try {
        const {username,password} = req.body;

        if(!username.trim() || !password.trim()){
            throw new errResponse("Please provide a username and password",400)
         }

        const user = await User.findOne({username}).select("+password")

        if(!user){
            throw new errResponse("User does not exist",400)
        }

        const isMatch = await user.matchPassword(password)

        if(!isMatch){
            throw new errResponse("Invalid credentials",400)
        }

        const token = await user.getSignedToken()

        const loggedInUserDetails = await User.findOne({username})

        const options = {
            httpOnly:true,
            secure:true,
            sameSite: 'None',
            maxAge: 7 * 24 * 60 * 60 * 1000
        }

        return res
        .cookie("accessToken",token,options)
        .status(200)
        .json(
            new sucResponse(200,"User Login Success",{loggedInUserDetails,token})
        )

        
    } catch (error) {
        next(error)
    }
}

// Logout a user
export const logout = async(req,res)=>{

    console.log(req.user)
    
    return res
    .status(200)
    .clearCookie("accessToken")
    .json(new sucResponse(200,"User logged out successfully")) 

}