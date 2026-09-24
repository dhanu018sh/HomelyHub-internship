import {Property} from "../Models/propertyModel.js";
import {Booking} from "../Models/bookingModel.js";

//createorder : booking any property
const createOrder = async (req, res) => {
    const {amount,propertyId,fromDate,toDate,guests} = req.body;

    //orderID : order_123456789
    const orderId = "order_" + Date.now();
    res.json({
        success:true,
        message:"Order created successfully",
        orderId,
        amount,
        propertyId,
        fromDate,
        toDate,
        guests
    })
}


//verifyPayment
// 25,26
//1. save the booking
//2. Block these dates
 const verifyPayment = async (req, res) => {
    const {orderId, bookingDetails,forceStatus} = req.body;

    if(forceStatus === "success"){
        const paymentId = "pay_" + Date.now();

        //save the booking
        const newBooking =  await Booking.create({
            user : req.user._id,
            property : bookingDetails.propertyId,
            price : bookingDetails.price,
            fromDate : bookingDetails.fromDate,
            toDate : bookingDetails.toDate,
            guests : bookingDetails.guests,
            numberofNights : bookingDetails.nights,
            paid : true
        });

        //tell property those dates are taken
        const updatedProperty = await Property.findByIdAndUpdate(
            bookingDetails.propertyId,{
                $push : {
                    currentBookings : {
                        bookingID: newBooking._id,
                        fromDate : bookingDetails.fromDate,
                        toDate : bookingDetails.toDate,
                        userId : req.user._id
                    }
                }
            },
            {new:true}
        );

        res.json({
            success:true,
            message:"Payment successfull,booking confirmed",
            paymentId,
            orderId,
            booking: newBooking
        });
    }else{
        res.status(400).json({
            success:false,
            message:"Payment failed!",
            orderId
        });
    }
 }

 //get my bookings
 const getUserBookings = async (req, res) => {
    try{
        const bookings = await Booking.find({user:req.user._id});

        res.status(200).json({
            success:true,
            data:{
                bookings
            }
        })

    }catch(error){
        res.status(401).json({
            success:false,
            message:error.message
        })
    }
 }

//get one booking details
// /:bookingid
const getBookingDetails = async (req, res) => {
    try{
        const bookings = await Booking.findById(req.params.id);
        res.status(200).json({
            status:"success",
            data:{
                bookings
            }
        })
    }catch(error){
        res.status(401).json({
            status:"fail",
            message:error.message
        })
    }
}

export {getBookingDetails, getUserBookings, createOrder, verifyPayment  };