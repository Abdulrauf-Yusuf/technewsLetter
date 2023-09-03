const express = require("express")
const bodyParser = require("body-parser")
const https = require("https");
const request = require("request")
const port = process.env.PORT || 3000
const app = express()
const apiKey =  "429036b2d4d22b386345d124eb05d757-us21";
const audienceId = "2270c190e6"
const datacenter = apiKey.split('-')[1];
// const url =  `${baseUrl}/lists/${audienceId}/members`
app.use(bodyParser.urlencoded({extended: true}))

app.use(express.static("public"));
app.use(express.json());

// send the sign up page when requested 

app.get('/', (req, res) =>{
    res.sendFile(__dirname + "/signup.html")
})

// collect the data filled in the form and send it to the mail chimp server

app.post('/', (req, res) =>{
    const firstName = req.body.firstName 
    const lastName = req.body.lastName
    const email = req.body.email
    
    console.log(req.body)
    // this is used to structure the data in the mail chimp 
    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields:{
                    FNAME: firstName,
                    LNAME: lastName
                }
                
            }
        ]
    }
// this turn the data into string format 
    const jsonData = JSON.stringify(data);
    const url = "https://us21.api.mailchimp.com/3.0/lists/2270c190e6"
    const options = {
        method: "POST",
        auth: `Abdularuf:${apiKey}`,
    };
    // deciding which page to display base on the status of the form filled, whether successfull or not
    const request= https.request(url, options, (response)=> {
       if (response.statusCode === 200) {
        res.sendFile(__dirname + "/success.html")
       } else {
        res.sendFile(__dirname + "/failure.html")
       }
        response.on("data", (data)=> {
            console.log(JSON.parse(data));
        })
    })
    request.write(jsonData);
    request.end();
    
});
app.post('/failure', (req, res)=> {
    res.redirect("/"+ '/signup.html');
});











app.listen(port, (req, res)=> {
    console.log("listening at port 3000")
})




// mailchimp  API Key 
// 429036b2d4d22b386345d124eb05d757-us21 
// list ID 
// 2270c190e6 