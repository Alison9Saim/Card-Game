var express = require('express');
require('dotenv').config();
var axios = require('axios');
var bodyParser = require('body-parser');
const {MongoClient, ObjectId} = require("mongodb");
//var mongoose = require('mongoose');
var app = express();
app.set('view engine', 'ejs');
const PORT = process.env.PORT || 3000;



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


app.get('/test', (req, res) => {
    res.render('test');
});


app.get('/', async (req, res) => {

    async function main() {
        score = 0;
        questions = [];
        currentIndex = 0;

    
        try {
            await client.connect();
            async function getQuestions(client){
                const result = await client.db("sample_questions").collection("questions").aggregate([{ $sample: { size: 5 } }]).toArray();
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



app.get('/gameover', async (req, res) => {
    res.render('gameover', {questions, something: score});
});

app.get('/correct', (req, res) => {
    res.render('correct', {questions, something: score});
});


app.get('/add', (req, res) => {
    res.render('addquestion');
});


app.post('/add', (req, res) => {

    var questionObj = {
        questionText: String(req.body.questionText),
        option_a: String(req.body.option_a),
        option_b: String(req.body.option_b)
    };

    debugger;

    //print values

    //connect to db,
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

           
            res.render("test");



        } catch (e) {
            console.error(e);
        } finally {
            console.log("connect G is finally closed");
            await client.close();
        }
    }
    addQuestionToDB().catch(console.error);
    //send alter message

    //send success message

});



app.post('/', async (req, res) => {

    var userSelectedOpt = Object.keys(req.body)[0];
    var currentItem = questions[currentIndex];
    debugger;
    if(userSelectedOpt == currentItem.opt_a){
        console.log("A was selected!");

        if(currentItem.a_vote >= currentItem.b_vote){
            console.log("Correct!");
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

                    debugger;
                    if(currentIndex == 4 || currentIndex == 5 ){
                        async function getQuestionsAgain(client){
                            const result = await client.db("sample_questions").collection("questions").aggregate([{ $sample: { size: 5 } }]).toArray();
                            questions = result;
                            currentIndex = 0;
                            debugger;
                            console.log("new questions are ready");
                        }
                         await getQuestionsAgain(client);
                    }

                    currentIndex = currentIndex + 1;
                    res.render("index", {questions, something: score, q: currentIndex});



                } catch (e) {
                    console.error(e);
                } finally {
                    console.log("connect C is finally closed");
                    await client.close();
                }
            }
            await updateOneDocByID().catch(console.error);

            
            
            

        }else{
            console.log("WRONG!");
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
                    console.log("connect D is finally closed");
                    await client.close();
                }
            }
           await updateOneDocByID_B_Wrong().catch(console.error);

        }

    }


    if(userSelectedOpt == currentItem.opt_b){
        console.log("B was selected!");
        if(currentItem.b_vote >= currentItem.a_vote){
            console.log("Correct!");
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

                    debugger;
                    if(currentIndex == 4 || currentIndex == 5 ){
                        async function getQuestionsAgain(client){
                            const result = await client.db("sample_questions").collection("questions").aggregate([{ $sample: { size: 5 } }]).toArray();
                            questions = result;
                            currentIndex = 0;
                            debugger;
                            console.log("new questions are ready");
                        }
                         await getQuestionsAgain(client);
                    }

                    currentIndex = currentIndex + 1;
                    res.render("index", {questions, something: score, q: currentIndex});

                } catch (e) {
                    console.error(e);
                } finally {
                    console.log("connect E is finally closed");
                    await client.close();
                }
            }
            
            await updateOneDocByID_B_Right().catch(console.error);





        }else{
            console.log("WRONG!");
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
                        rand_gameover_message = result;
                    }
            
                    await getRandGameOverMessage(client);

                    res.setHeader('Content-Type', 'text/html');
                    res.render('gameover', {something: score, message: rand_gameover_message[0].message_text});

                } catch (e) {
                    console.error(e);
                } finally {
                    console.log("connect F is finally closed");
                    await client.close();
                }
            }
            await updateOneDocByID_B_adam().catch(console.error);
        }

    }









});


app.listen(PORT, () => console.log("App started on " + {PORT}))