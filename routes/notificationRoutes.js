const express = require('express')
const { sendNotificationToSpecificDevice, sendNotificationToMultipleDevice, sendNotificationToTopics, sendNotificationToBatch } = require('../controllers/notificationController')

const routerNotify = express()


routerNotify.post('/sendtospecificdevice', sendNotificationToSpecificDevice)
routerNotify.post('/sendtomultipledevice', sendNotificationToMultipleDevice)
routerNotify.post('/sendtotopic', sendNotificationToTopics)
routerNotify.post('/sendtobatch', sendNotificationToBatch)


module.exports = routerNotify