const express = require('express')
const { sendNotificationToSpecificDevice, sendNotificationToMultipleDevice, sendNotificationToTopics, sendNotificationToBatch, saveToken, subscribeToTopic, unsubscribeFromTopic } = require('../controllers/notificationController')

const routerNotify = express()

routerNotify.post('/savetoken',saveToken)

routerNotify.post('/sendtospecificdevice', sendNotificationToSpecificDevice)
routerNotify.post('/sendtomultipledevice', sendNotificationToMultipleDevice)
routerNotify.post('/sendtotopic', sendNotificationToTopics)
routerNotify.post('/sendtobatch', sendNotificationToBatch)


routerNotify.post('/subscribetotopic', subscribeToTopic)
routerNotify.post('/unsubscribefromtopic', unsubscribeFromTopic)


module.exports = routerNotify