const admin = require("../firebase")

// Send messages to specific devices
const sendNotificationToSpecificDevice = async (req, res) => {
    // This registration token comes from the client FCM SDKs.
    // const registrationToken = "cSHtBrMFTSSr-w37-FISa-:APA91bGdlcHL0rgarrXbwWVNy5uVbdTWBLIvetNf7s1EbfIOkXAPWSvgqP7CVy0ru_8dWoUNfzXs_bu_4FwQexQtiOjAR7qHSB-x2ONw9kIGXpbYPbhNoe2L5quy5FkA2F6pFCuuQtK_";
    const registrationToken = req.body.registrationtoken;
    console.log(req.body)
console.log(registrationToken)
    if (!registrationToken) {
        return res.status(400).json({
            success:false,
            message:"Registration token required"
        })
    }
    const message = {
        notification:{
            title:"Testing",
            body:"Hello World"
        },
        token: registrationToken
    };

    try {
        const response = await admin.messaging().send(message)
        res.status(200).json({
            success: true,
            response
        })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({
            success: false,
            message: `Error sending message: ${error}`
        });
    }

}

// Send messages to multiple devices
const sendNotificationToMultipleDevice = async (req, res) => {

}

// Send messages to topics
const sendNotificationToTopics = async (req, res) => {

}

// Send a batch of messages
const sendNotificationToBatch = async (req, res) => {

}

module.exports = { sendNotificationToBatch, sendNotificationToMultipleDevice, sendNotificationToSpecificDevice, sendNotificationToTopics }