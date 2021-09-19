const fs = require('fs')
const express = require('express')
const https = require('https')
const request = require('request')

const app = express()
const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static("public"))

app.get("/weatherInfo" , (req , res) => {
    res.sendFile(__dirname + '/weatherInfo.html')
})

app.post('/weatherInfo' , (req , res) => {
    
    const query = req.body.weatherInfo 
    const appId = '7f7848e09d57f598f4a26a201bc68727'
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${appId}`

    https.get(url , (response) => {
        response.on('data' , (data) => {
            const output = JSON.parse(data)
            const name = output.name
            const temp = output.main.temp
            const description = output.weather[0].description
            const icon = output.weather[0].icon
            const imgUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`

            res.send(`<div class="card text-center mx-auto" style="width: 18rem;">
                <img src=${imgUrl} class="card-img-top">
                <div class="card-body">
                <h5 class="card-title">City name: ${name}</h5>
                <p class="card-text">Temperature: ${temp}</p>
                <p class="card-text">Weather description: ${description}</p>
                </div>
            </div>`)


        })
    })
    
})

// Mail chimp data base api project code starts here

app.get('/userInfo' , (req , res) => {
    res.sendFile(__dirname + '/userInfo.html')
})

app.post('/userInfo' , (req , res) => {
    const fName = req.body.fName
    const lName = req.body.lName
    const email = req.body.email

    const data = {
         members: [
             {
                email_address: email,
                status:  "subscribed",
                merge_fields: {
                    FNAME: fName,
                    LNAME: lName
                }
             }
         ]    
    }

    const jsonData = JSON.stringify(data)

    const url = 'https://us5.api.mailchimp.com/3.0/lists/167ce6f5fe'

    const options = {
        method: 'POST',
        auth: 'munim:63de9fbcf657f834ac3a693b650e6d12-us5'
    }

    const request = https.request(url , options , (response) => {
        if(response.statusCode === 200){
            res.sendFile(__dirname + '/success.html')
        } else {
            res.sendFile(__dirname + '/failed.html')
        }
        response.on('data' , (data) => {
            console.log(JSON.parse(data))
        })
    })

    request.write(jsonData)
    request.end()
    
})

app.post('/failed' , (req , res) => {
    res.redirect('/userInfo')
})

app.listen(3000 , () => {
    console.log('Server is running')
})

// API key

// 63de9fbcf657f834ac3a693b650e6d12-us5

// Audience ID

// 167ce6f5fe