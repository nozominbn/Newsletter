const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const { Router } = require("express");

const app = express();


// to serve static files such as css and image, make new folder public, change the link in html
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res) {
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName,
                }
            }
        ]
    };

    // Turn above into flat pack JSON, this is what we are going to send to Mailchimp
    const jsonData = JSON.stringify(data);

    // put yourList ID(cec693c4c2) and API Key number (us13)
    const url = "https://us13.api.mailchimp.com/3.0/lists/cec693c4c2";

    const options = {
        method: "POST",
        auth: "nozomi1:78aac80a2c0eaee57089fa900ec9b488-us13"
    }

    const request = https.request(url, options, function(response) {

        if (response.statusCode == 200) {
            res.sendFile(__dirname + "/sucess.html");
        } else {
            res.sendFile(__dirname + "/failure.html")
        }
        response.on("data", function(data){
            console.log(JSON.parse(data));
        })

    })
    request.write(jsonData);
    request.end();
    
// it redirects to the home route (triggers app.get)
app.post("/failure", function(req, res) {
    res.redirect("/")
})

// console.log(firstName, lastName, email);
})

// {"name":"Freddie'\''s Favorite Hats","contact":{"company":"Mailchimp","address1":"675 Ponce De Leon Ave NE","address2":"Suite 5000","city":"Atlanta","state":"GA","zip":"30308","country":"US","phone":""},"permission_reminder":"You'\''re receiving this email because you signed up for updates about Freddie'\''s newest hats.","campaign_defaults":{"from_name":"Freddie","from_email":"freddie@freddiehats.com","subject":"","language":"en"},"email_type_option":true}



app.listen(3000, function() {
    console.log("Server is running on port 3000.");
})

//API Key
// 78aac80a2c0eaee57089fa900ec9b488-us13

//List Id
// cec693c4c2