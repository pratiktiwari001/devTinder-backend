const cron = require("node-cron");
const {subDays, startOfDay, endOfDay} = require("date-fns")
const sendEmail = require("../utils/sendEmail")
const ConnectionRequestModel = require("../models/connectionRequest")

// Send Email everyday at 8 am
cron.schedule("0 8 * * *", async () => {
    try {
        const yesterday = subDays(new Date(), 1);
        const yesterdayStart = startOfDay(yesterday);
        const yesterdayEnd = endOfDay(yesterday);
        
        const pendingRequests = await ConnectionRequestModel.find({
            status: "interested",
            createdAt: {
                $gte: yesterdayStart,
                $lte: yesterdayEnd,
            },
        }).populate("fromUserId toUserId");
        const uniqueRecipients = new Map();
        
        pendingRequests.forEach((req) => {
            const recipientId = req.toUserId._id.toString(); 
            
            if (!uniqueRecipients.has(recipientId)) {
                uniqueRecipients.set(recipientId, {
                    email: req.toUserId.emailID,
                    firstName: req.toUserId.firstName, 
                });
            }
        });
        
        for (const recipient of uniqueRecipients.values()) {
            const { email, firstName } = recipient; 
            
            
            // Send personalized emails to unique users who received a connection request yesterday
            try {
                await sendEmail.run( `Pending Connection Requests for ${firstName}!`, 
                    `Hi ${firstName}, 
                \n\nYou have some new pending connection requests on DevTinder.
                \n\nLogin now to accept or reject the request: http://13.235.49.31/
                \n\nDevTinder Team`);
                
            } catch (error) {
                // Log failure with first name and email
                console.error(`❌ Failed to send email to user: ${email} `, error);
            }
        }

    } catch (error) {
        // Main catch for database/processing failure
        console.error("❌ Cron Job Failed: Error during fetching pending connection requests or general processing.", error);
    }
});