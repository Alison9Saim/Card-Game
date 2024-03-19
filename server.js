var express = require('express');
require('dotenv').config();
var axios = require('axios');
var nodemailer = require("nodemailer");
var bodyParser = require('body-parser');
const {MongoClient, ObjectId} = require("mongodb");
//var mongoose = require('mongoose');
var app = express();
app.set('view engine', 'ejs');
const Port = process.env.PORT || 3000;



//app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

app.use(bodyParser.json());
//app.use(express.json());




var score = 0;
var currentIndex = 0;

var questions = [];

const uri = "mongodb+srv://"+process.env.MONGO_USERNAME+":"+process.env.MONGO_PASSWORD+"@cluster0.j2vmca7.mongodb.net/";
const client = new MongoClient(uri);



app.get('/', async (req, res) => {

    async function main() {
        score = 0;
        questions = [];
        currentIndex = 0;

    
        try {
            await client.connect();
            async function getQuestions(client){
                const result = await client.db("sample_questions").collection("questions").aggregate([{ $sample: { size: 30 } }]).toArray();
                questions = result;
                currentIndex = 0;
                console.log("new questions are ready");
            }
    
            await getQuestions(client);

            res.render("index", {questions, something: score, q: currentIndex})
        }
        catch (e) {console.error(e);}
        finally {console.log("connect A is finally closed");await client.close();}
    }

    await main().catch(console.error);
    
});


app.get('/highscores', async  (req, res) => {
    var listOfUsers = "";
    async function getHighScores() {    
        try {
            await client.connect();
            async function getListOfUsers(client){
                const result = await client.db("sample_questions").collection("high_scores").find({},{_id:0}).sort({"score":-1}).toArray();
                listOfUsers = result;
                var ONE_HOUR = 60 * 60 * 1000; /* ms */
                var CURRENT_TIME_IN_MS = new Date().getTime();
                var ONE_HOUR_AGO = CURRENT_TIME_IN_MS - ONE_HOUR;

                for(i = 0; i < result.length; i++){
                    if(result[i].when > ONE_HOUR_AGO){
                        result[i].recent = true;
                    }
                    else{
                        result[i].recent = false;
                    }
                }
            }
    
            await getListOfUsers(client);
            res.render('highscores', {users: listOfUsers});

        }
        catch (e) {console.error(e);}
        finally {console.log("connect A is finally closed");await client.close();}
    }
    await getHighScores().catch(console.error);
});



app.post('/highscores', async  (req, res) => {

    var userNameTxtField = String(req.body.userNameTxt);
    async function AddUserToHighScores() {

        try {
            await client.connect();
            async function addUserScore(client) {
                const result = await client.db("sample_questions").collection("high_scores").insertOne({
                    userName: userNameTxtField,
                    score: score,
                    when: new Date()
                  });
                console.log(`${result.matchedCount} document(s) matched the query criteria.`);console.log(`${result.modifiedCount} document(s) was/were updated.`);
            }
            await addUserScore(client);


        } catch (e) {
            console.error(e);
        } finally {
            await client.close();
        }
    }
    await AddUserToHighScores().catch(console.error);
    res.redirect("/highscores");



});



app.get('/gameover', (req, res) => {
    res.render('gameover', {something: score, message:""});
});


app.get('/add', (req, res) => {
    res.render('addquestion');
});


app.post('/add', async (req, res) => {

    var questionObj = {
        questionText: String(req.body.questionText),
        option_a: String(req.body.option_a),
        option_b: String(req.body.option_b)
    };

    async function addQuestionToDB() {

        try {
            await client.connect();
            async function addQuestionFromUser(client) {
                const result = await client.db("sample_questions").collection("questions").insertOne({
                    text: questionObj.questionText,
                    difficulty: 'Easy',
                    category: 'Life',
                    opt_a: questionObj.option_a,
                    opt_b: questionObj.option_b,
                    a_vote: 0,
                    b_vote: 0
                  });
                console.log(`${result.matchedCount} document(s) matched the query criteria.`);console.log(`${result.modifiedCount} document(s) was/were updated.`);
            }
            await addQuestionFromUser(client);

           
            //res.render("index");
            res.redirect("/");



        } catch (e) {
            console.error(e);
        } finally {
            await client.close();
        }
    }
    await addQuestionToDB().catch(console.error);
});



app.post('/', async (req, res) => {
    var userSelectedOpt = Object.keys(req.body)[0];
    var currentItem = questions[currentIndex];
    if(userSelectedOpt == currentItem.opt_a){
        //A Selected

        if(currentItem.a_vote >= currentItem.b_vote){
            //Correct
            score = score + 1;
            currentItem.a_vote = currentItem.a_vote + 1;


            async function updateOneDocByID() {

                try {
                    await client.connect();
                    async function updateListingByName_A(client, nameOfListing) {
                        const result = await client.db("sample_questions").collection("questions").updateOne({ _id: nameOfListing }, { $set: {a_vote: currentItem.a_vote} });
                        console.log(`${result.matchedCount} document(s) matched the query criteria.`);console.log(`${result.modifiedCount} document(s) was/were updated.`);
                    }
                    await updateListingByName_A(client, questions[currentIndex]._id);




                    currentIndex = currentIndex + 1;
                    res.render("index", {questions, something: score, q: currentIndex});



                } catch (e) {
                    console.error(e);
                } finally {
                    await client.close();
                }
            }
            await updateOneDocByID().catch(console.error);

            /*
            if(currentIndex == 4 || currentIndex == 5 ){
                async function getQuestionsAgain(client){
                    const result = await client.db("sample_questions").collection("questions").aggregate([{ $sample: { size: 5 } }]).toArray();
                    questions = result;
                    currentIndex = 0;

                    console.log("new questions are ready");
                }
                await getQuestionsAgain(client);
            }
            */

            
            
            

        }else{
            // Wrong
            currentItem.a_vote = currentItem.a_vote + 1;

            async function updateOneDocByID_B_Wrong() {
                try {
                    await client.connect();
                    async function updateListingByName_B_1(client, nameOfListing) {
                        const result = await client.db("sample_questions").collection("questions").updateOne({ _id: nameOfListing }, { $set: {a_vote: currentItem.a_vote} });
                        console.log(`${result.matchedCount} document(s) matched the query criteria.`);console.log(`${result.modifiedCount} document(s) was/were updated.`);
                    }
                    await updateListingByName_B_1(client, questions[currentIndex]._id);


                    var randGameOverText = "";
                    async function getRandGameOverMessage(client){
                        const result = await client.db("sample_questions").collection("gameover_message").aggregate([{ $sample: { size: 1 } }]).toArray();
                        rand_gameover_message = result;
                    }
            
                    await getRandGameOverMessage(client);

                    res.setHeader('Content-Type', 'text/html');
                    res.render('gameover', {something: score, message: rand_gameover_message[0].message_text});

                } catch (e) {
                    console.error(e);
                } finally {
                    await client.close();
                }
            }
            await updateOneDocByID_B_Wrong().catch(console.error);

        }

    }


    if(userSelectedOpt == currentItem.opt_b){
        //B Selected
        if(currentItem.b_vote >= currentItem.a_vote){
            //Correct
            score = score + 1;
            currentItem.b_vote = currentItem.b_vote + 1;


            async function updateOneDocByID_B_Right() {

                try {
                    await client.connect();
                    async function updateListingByName_B_2(client, nameOfListing) {
                        const result = await client.db("sample_questions").collection("questions").updateOne({ _id: nameOfListing }, { $set: {b_vote: currentItem.b_vote} });
                        console.log(`${result.matchedCount} document(s) matched the query criteria.`);console.log(`${result.modifiedCount} document(s) was/were updated.`);
                    }
                    await updateListingByName_B_2(client, questions[currentIndex]._id);


                    currentIndex = currentIndex + 1;
                    res.render("index", {questions, something: score, q: currentIndex});

                } catch (e) {
                    console.error(e);
                } finally {
                    await client.close();
                }
            }
            
             updateOneDocByID_B_Right().catch(console.error);

            /*
             if(currentIndex == 4 || currentIndex == 5 ){
                async function getQuestionsAgain(client){
                    const result = await client.db("sample_questions").collection("questions").aggregate([{ $sample: { size: 5 } }]).toArray();
                    questions = result;
                    currentIndex = 0;
                    console.log("new questions are ready");
                }
                 await getQuestionsAgain(client);
            }
            */





        }else{
            //WRONG
            currentItem.b_vote = currentItem.b_vote + 1;
            async function updateOneDocByID_B_adam() {
                try {
                    await client.connect();
                    async function updateListingByName_B_c(client, nameOfListing) {
                        const result = await client.db("sample_questions").collection("questions").updateOne({ _id: nameOfListing }, { $set: {b_vote: currentItem.b_vote} });
                        console.log(`${result.matchedCount} document(s) matched the query criteria.`);console.log(`${result.modifiedCount} document(s) was/were updated.`);
                    }
                    await updateListingByName_B_c(client, questions[currentIndex]._id);


                    var randGameOverText = "";
                    async function getRandGameOverMessage(client){
                        const result = await client.db("sample_questions").collection("gameover_message").aggregate([{ $sample: { size: 1 } }]).toArray();
                        randGameOverText = result;
                    }
            
                    await getRandGameOverMessage(client);

                    res.setHeader('Content-Type', 'text/html');
                    res.render('gameover', {something: score, message: randGameOverText[0].message_text});

                } catch (e) {
                    console.error(e);
                } finally {
                    await client.close();
                }
            }
            await updateOneDocByID_B_adam().catch(console.error);
        }

    }









});


app.get('/contact', (req, res) =>{
    res.render('contact');
});

app.get('/about', (req, res) =>{
    res.render('about');
});

app.get('/privacy', (req, res) =>{
    res.render('privacy-policy');
});

app.get('/cookies', (req, res) =>{
    res.render('cookies');
});


app.post('/email', async (req, res) => {

    var emailObj = {
        email_from: String(req.body.emailAddress),
        email_sub: String(req.body.subjectLine),
        email_body: String(req.body.emailBody)
    };

    const transporter = nodemailer.createTransport({
        //host: "smtp.ethereal.email",
        service: "Gmail",
        host: "smtp.gmail.com",
        port: 465,
        secure: true, // Use `true` for port 465, `false` for all other ports // 587
        auth: {
          //user: "aorb.info@gmail.com",
          user: process.env.GMAIL,
          //pass: "lpcxgyxgxbxdepvy",
          pass: process.env.GMAIL_PASS
        },
      });
      
      // async..await is not allowed in global scope, must use a wrapper
      async function main() {
        // send mail with defined transport object
        const info = await transporter.sendMail({
          //from: '"Maddison Foo Koch 👻" <aorb.info@gmail.com>', // sender address
          from: emailObj.from,
          //to: "aorb.info@gmail.com", // list of receivers
          to: ["aorb.info@gmail.com, alisaimwindows@gmail.com"],
          subject: emailObj.email_sub, // Subject line
          text: emailObj.email_body, // plain text body
          html: emailObj.email_body, // html body
        });
      
        console.log("Message sent: %s", info.messageId);
        // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>



        //res.render("index");
        res.redirect("/");
      }
      
      await main().catch(console.error);
      


});


app.get('/ads.txt', (req, res) =>{
    const filePath = __dirname + '/ads.txt'
    res.sendFile(filePath);
});


//potential google error fix?
app.get('/*', (req, res) =>{
    res.redirect('/');
});



app.listen(Port, () => {
  console.log('Express server listening on port', Port)
});