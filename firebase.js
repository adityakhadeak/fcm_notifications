const  admin = require("firebase-admin");
const serviceAccount = require("C:/New Volume D/Placements/Internship/NodeJs Developer/fcm_notifications/serviceAccountKey.json");


admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });

module.exports=admin