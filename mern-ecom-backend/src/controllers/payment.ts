import { Request, Response, NextFunction } from "express";
import { stripe } from "../app.js";
import { TryCatch } from "../middlewares/error.js";
import { Coupon } from "../models/coupon.js";
import ErrorHandler from "../utils/utility-class.js";


export const createPaymentIntent = TryCatch( async(req, res, next) => {

    const {amount} = req.body;

    if (!amount) return next(new ErrorHandler("Please Enter the Amount", 400));

    const paymentIntent = await stripe.paymentIntents.create({amount: Number(amount)*100, currency: "inr", description: "testing" })

    return res.status(201).json({
        success: true,
        clientSecret: paymentIntent.client_secret
    });

});


export const newCoupon = TryCatch( async(req, res, next) => {

    const {coupon, amount} = req.body;

    if (!coupon || !amount) return next(new ErrorHandler("Please Enter Both Coupon and Amount", 400));
    await Coupon.create({coupon, amount});

    return res.status(201).json({
        success: true,
        message: `Coupon ${coupon} Created Successfully`
    });

});


export const applyDiscount = TryCatch( async(req, res, next) => { 

    const {coupon} = req.query;

    const discount = await Coupon.findOne({coupon});

    if (!discount) return next( new ErrorHandler("Invalid Coupon Code", 400))

    return res.status(200).json({
        success: true,
        discount: discount.amount
    });

}); 



export const allCoupons = TryCatch(async (req, res, next) => {

    const coupons = await Coupon.find({});

    return res.status(200).json({
        success: true,
        coupons
    });

});



export const deleteCoupon = TryCatch(async (req, res, next) => {

    const {id} = req.params;

    const coupon = await Coupon.findByIdAndDelete(id);

    if (!coupon) return next( new ErrorHandler( "Coupon Code not found", 404));

    return res.status(200).json({
        success: true,
        message: `Coupon ${coupon.value} Deleted Successfully!`
    });

});


/** Stripe webhook — verifies signature so only genuine Stripe events are processed. */
export const stripeWebhook = async (req: Request, res: Response, next: NextFunction) => {
    const sig = req.headers["stripe-signature"] as string;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET ?? "";

    if (!webhookSecret) {
        return res.status(400).json({ success: false, message: "Webhook secret not configured" });
    }

    let event;
    try {
        event = stripe.webhooks.constructEvent(req.body as Buffer, sig, webhookSecret);
    } catch (err: any) {
        return res.status(400).json({ success: false, message: `Webhook Error: ${err.message}` });
    }

    switch (event.type) {
        case "payment_intent.succeeded":
            // Order is already created client-side after stripe.confirmPayment succeeds.
            // Use this event for server-side reconciliation / fraud detection if needed.
            break;
        case "payment_intent.payment_failed":
            // Log or notify on failure
            break;
        default:
            break;
    }

    return res.json({ received: true });
};