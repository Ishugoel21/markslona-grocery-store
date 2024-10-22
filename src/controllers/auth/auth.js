import { Customer,DeliveryPartner } from "../../models/user.js";

import jwt from 'jsonwebtoken'

const genrateToken = (user) => {
    const accessToken = jwt.sign(
        {userId:user._id,role:user.role},
        process,env.ACCESS_TOKEN_SECRET,
        {expiresIn:"1d"}
    );
    const refreshToken = jwt.sign(
        {userId:user._id,role:user.role},
        process,env.REFRESH_TOKEN_SECRET,
        {expiresIn:"1d"}
    );
    return {accessToken,refreshToken};
};


export const loginCustomer = async(req,reply) => {
    try {
        const {phone} = req.body;
        let customer = await Customer.findOne({phone})
        if(!customer){
            customer = new Customer({
                phone,
                role:"Customer",
                isActivated:true
            });
            await Customer.save();
        }
        const {accessToken, refreshToken} = genrateToken(customer)

        return reply.send({
            message: customer ? "Login Successfull" : "Customer created and logged in",
            accessToken,
            refreshToken,
            customer
        })

    } catch (error) {
        return reply.status(500).send({message:"An error occured", error})
    }
}
export const loginDeliveryPartner = async(req,reply) => {
    try {
        const {email,password} = req.body;
        let deliveryPartner = await DeliveryPartner.findOne({email})
        if(!deliveryPartner){
            return reply.status(404).send({message:"Delivery Partner occured"})
        }
        const isMatch = password === deliveryPartner.password
        if(!isMatch){return reply.status(400).send({message:"Invalid credentials"})

        }

        const {accessToken, refreshToken} = genrateToken(deliveryPartner)

        return reply.send({
            message:"Login Successfull",
            accessToken,
            refreshToken,
            deliveryPartner
        });

    } catch (error) {
        return reply.status(500).send({message:"An error occured", error})
    }
}
export const refreshToken = async(req,reply) => {
    const {refreshToken} = req.body;

    if(!refreshToken){
        return reply.status(401).send({message:"Refresh token required"})
    }
    try {
        const decoded = jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET)
        let user;
        if(decoded.role==='Customer'){
            user = await Customer.findById(decoded.userId)
        }else if(decoded.role==='DeliveryPartner'){
            user = await DeliveryPartner.findById(decoded.userId)
        }else{
            return reply.status(403).send({message:"Invalid role"})
        }
        if(!user){
            return reply.status(403).send({message:"Invalid refresh token"}) 
        }
        const {accessToken,refreshToken:newRefreshToken} = genrateToken(user);
        return reply.send({
            message:"refresh token",
            accessToken,
            refreshToken:newRefreshToken,
        })
    } catch (error) {
       return reply.status(403).send({message:"Invalid Refresh Token"}) 
    }
}


export const fetchUser = async(req,reply)=>{
    try {
       const {userId,role} = req.user;
       let user;
        if(role==='Customer'){
            user = await Customer.findById(userId)
        }else if(role==='DeliveryPartner'){
            user = await DeliveryPartner.findById(userId)
        }else{
            return reply.status(403).send({message:"Invalid role"})
        }
        if(!user){
            return reply.status(404).send({message:"User not found"}) 
        } 
        return reply.send({
            message:"User found Successfully",
            user,
        })
    } catch (error) {
        return reply.status(500).send({message:"An error occured",error})
    }
}