const pool = require("../db/db")
const admin = require("../firebase")


const saveToken = async (req, res) => {
    try {
        const { token } = req.body

        if (!token) {
            return res.status(400).json({
                success: false,
                message: "Token is required"
            });
        }

        const query = 'INSERT INTO registration_tokens (token) VALUES( $1 ) ON CONFLICT (token) DO UPDATE SET token=EXCLUDED.token RETURNING *'
        const values = [token]
        const result = await pool.query(query, values)

        if (result.rowCount == 0) {
            return res.status(201).json({
                success: false,
                message: "Cannot save token"
            })
        }

        res.status(201).json({
            success: true,
            message: "Token saved successfully",
            token: result.rows[0]
        })

    } catch (error) {
        console.log(error.message)
        res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

// Send messages to specific devices
const sendNotificationToSpecificDevice = async (req, res) => {
    // const registrationToken = "cSHtBrMFTSSr-w37-FISa-:APA91bGdlcHL0rgarrXbwWVNy5uVbdTWBLIvetNf7s1EbfIOkXAPWSvgqP7CVy0ru_8dWoUNfzXs_bu_4FwQexQtiOjAR7qHSB-x2ONw9kIGXpbYPbhNoe2L5quy5FkA2F6pFCuuQtK_";
    try {
        const { registrationtoken, title, body } = req.body;

        if (!registrationtoken) {
            return res.status(400).json({
                success: false,
                message: "Registration token required"
            })
        }
        const message = {
            notification: {
                title: title,
                body: body
            },
            token: registrationtoken
        };


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
    try {
        const { title, body } = req.body
        const registrationTokens = [];

        const result = await pool.query('SELECT * FROM registration_tokens limit 500')

        result.rows.forEach(row => {
            registrationTokens.push(row.token)
        })

        const message = {
            notification: {
                title: title,
                body: body
            },
            tokens: registrationTokens,
        };

        const response = await admin.messaging().sendEachForMulticast(message)

        const failedTokens = [];
        if (response.failureCount > 0) {
            response.responses.forEach((resp, idx) => {
                if (!resp.success) {
                    failedTokens.push(registrationTokens[idx]);
                }
            });
            console.log('List of tokens that caused failures: ' + failedTokens);
        }
        res.status(200).json({
            success: true,
            message: "Message send to all the devices",
            successtoken: response,
            failedtokens: failedTokens
        })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({
            success: false,
            message: `Error sending message: ${error}`
        });
    }
}

// Send messages to topics
const sendNotificationToTopics = async (req, res) => {
    try {
        const { topic, title, body } = req.body
        const message = {
            notification: {
                title: title,
                body: body
            },
            topic: topic
        };

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

// Send a batch of messages
const sendNotificationToBatch = async (req, res) => {
    try {

        const messages = [];
        messages.push({
            notification: { title: 'Price drop', body: '5% off all electronics' },
            token: "cSHtBrMFTSSr-w37-FISa-:APA91bGdlcHL0rgarrXbwWVNy5uVbdTWBLIvetNf7s1EbfIOkXAPWSvgqP7CVy0ru_8dWoUNfzXs_bu_4FwQexQtiOjAR7qHSB-x2ONw9kIGXpbYPbhNoe2L5quy5FkA2F6pFCuuQtK_",
        });
        messages.push({
            notification: { title: 'Price drop', body: '2% off all books' },
            topic: 'offers',
        });

       

        const response=await admin.messaging().sendEach(messages)
        console.log(response.successCount + ' messages were sent successfully');

        res.status(200).json({
            success:true,
            messages:response.successCount + ' messages were sent successfully',
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



const subscribeToTopic = async (req, res) => {
    try {
        const { topic } = req.body

        const registrationTokens = [];

        const result = await pool.query('SELECT * FROM registration_tokens')

        result.rows.forEach(row => {
            registrationTokens.push(row.token)
        })

        // Subscribe the devices corresponding to the registration tokens to the
        // topic.
        const response = await admin.messaging().subscribeToTopic(registrationTokens, topic)

        res.status(200).json({
            success: true,
            response
        })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({
            success: false,
            message: `Internal Server Error`
        });
    }
}


const unsubscribeFromTopic = async (req, res) => {
    try {
        const { topic } = req.body

        const registrationTokens = [];

        const result = await pool.query('SELECT * FROM registration_tokens')

        result.rows.forEach(row => {
            registrationTokens.push(row.token)
        })
        console.log(registrationTokens)

        // Subscribe the devices corresponding to the registration tokens to the
        // topic.
        const response = await admin.messaging().unsubscribeFromTopic(registrationTokens, topic)

        res.status(200).json({
            success: true,
            response
        })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({
            success: false,
            message: `Internal Server Error`
        });
    }
}


module.exports = { saveToken, sendNotificationToBatch, sendNotificationToMultipleDevice, sendNotificationToSpecificDevice, sendNotificationToTopics, subscribeToTopic ,unsubscribeFromTopic}