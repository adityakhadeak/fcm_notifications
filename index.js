const express=require('express')
const routerNotify = require('./routes/notificationRoutes');
const cors=require('cors')
const app=express()

app.use(cors())
app.use(express())
app.use(express.json())
app.use(express.urlencoded({extended:true}))




app.use('/api/notification',routerNotify)

app.listen(4000,()=>{
    console.log("Server listening on Port 4000")
})