var express = require('express');
require('dotenv').config()
var axios = require('axios');
var bodyParser = require('body-parser');
const {MongoClient, ObjectId} = require("mongodb");
//var mongoose = require('mongoose');
var app = express();

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json())
app.set('view engine', 'ejs');


var score = 0;
var currentIndex = 0;

var questions = [];
console.log("Start of script");
console.log(process.env.MONGO_USERNAME);

const uri = "mongodb+srv://"+process.env.MONGO_USERNAME+":"+process.env.MONGO_PASSWORD+"@cluster0.j2vmca7.mongodb.net/";


//const uri  = "mongodb+srv://alison:o65Xnxr8atd6Uqka@cluster0.j2vmca7.mongodb.net/";
const client = new MongoClient(uri);

process.env.S3_BUCKET


app.get('/test', (req, res) => {
    res.render('test');
});


app.get('/', async (req, res) => {


    async function main() {

        questions = [];
        currentIndex = 0;

    
        try {
            await client.connect();
            // Make the appropriate DB calls
            //await  listDatabases(client);


            async function getQuestions(client){
                //const result = await client.db("sample_questions").collection("questions").find().toArray();
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



app.get('/gameover', (req, res) => {
    res.render('gameover', {questions, something: score});
});

app.get('/correct', (req, res) => {
    res.render('correct', {questions, something: score});
});




app.post('/', async (req, res) => {

    var userSelectedOpt = Object.keys(req.body)[0];
    var currentItem = questions[currentIndex];

    if(userSelectedOpt == currentItem.opt_a){
        console.log("A was selected!");

        if(currentItem.a_vote >= currentItem.b_vote){
            console.log("Correct!");
            score = score + 1;
            currentItem.a_vote = currentItem.a_vote + 1;


            async function updateOneDocByID() {

                try {
                    await client.connect();
                    //await  updateQues(client, "Red or Orange? Which is more popular colour?");
                    //await updateQues(client, new ObjectId('65ab3131ca697074795b81ca'));


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
                            
                            //res.render("index", {questions, something: score, q: currentIndex})
                            //res.send({questions, something: score, q: currentIndex});
                        }
        
                         await getQuestionsAgain(client);

                    }

                    currentIndex = currentIndex + 1;
                    res.render("index", {questions, something: score, q: currentIndex});




                    /*
                    if(currentIndex == 4 || currentIndex == 5 ){
                        debugger;
                        //CHECK TO COUNTER
                        questions = questions;
                
                        async function getNewQuestionsAgain(){
                            try {
                                await client.connect();
                
                                console.log("A or B was clicked, should we get new questions");
                                console.log("________________________________New questions")
                
                                async function getQuestionsAgain(client){
                                    const result = await client.db("sample_questions").collection("questions").aggregate([{ $sample: { size: 1 } }]).toArray();
                                    questions = result;
                                    currentIndex = 0;
                                    debugger;
                                    console.log("new questions are ready");
                                    
                                    //res.render("index", {questions, something: score, q: currentIndex})
                                    //res.send({questions, something: score, q: currentIndex});
                                }
                
                                 await getQuestionsAgain(client);
                                 
                
                
                
                
                
                            }
                            catch (e) {console.error(e);}
                            finally {console.log("connect B is finally closed");await client.close();}
                
                
                        }
                
                        await getNewQuestionsAgain().catch(console.error);
                        //res.render("index", {questions, something: score, q: currentIndex})
                        
                    }
                    */








                    
                    //if(currentIndex != 4){
                    //    currentIndex = currentIndex + 1;
                        //res.render("index", {questions, something: score, q: currentIndex});
                    //}




                } catch (e) {
                    console.error(e);
                } finally {
                    console.log("connect C is finally closed");
                    await client.close();
                    //currentIndex = currentIndex + 1;
                }
            }




            await updateOneDocByID().catch(console.error);

            
            
            
            //return;
        }else{
            console.log("WRONG!");

            currentItem.b_vote = currentItem.b_vote + 1;

            async function updateOneDocByID_B_Wrong() {

                try {
                    await client.connect();

                    async function updateListingByName_B_1(client, nameOfListing) {
                        const result = await client.db("sample_questions").collection("questions").updateOne({ _id: nameOfListing }, { $set: {b_vote: currentItem.b_vote} });
                        console.log(`${result.matchedCount} document(s) matched the query criteria.`);console.log(`${result.modifiedCount} document(s) was/were updated.`);
                    }

                    await updateListingByName_B_1(client, questions[currentIndex]._id);



                    res.setHeader('Content-Type', 'text/html');
                    res.render('gameover', {something: score});

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
                    //await  updateQues(client, "Red or Orange? Which is more popular colour?");
                    //await updateQues(client, new ObjectId('65ab3131ca697074795b81ca'));

                    async function updateListingByName_B_2(client, nameOfListing) {
                        const result = await client.db("sample_questions").collection("questions").updateOne({ _id: nameOfListing }, { $set: {b_vote: currentItem.b_vote} });
                        console.log(`${result.matchedCount} document(s) matched the query criteria.`);console.log(`${result.modifiedCount} document(s) was/were updated.`);
                    }

                    await updateListingByName_B_2(client, questions[currentIndex]._id);
                    currentIndex = currentIndex + 1;



                } catch (e) {
                    console.error(e);
                } finally {
                    console.log("connect E is finally closed");
                    await client.close();
                }
            }
            
            await updateOneDocByID_B_Right().catch(console.error);
            //currentIndex = currentIndex + 1;





        }else{
            console.log("WRONG!");
            currentItem.a_vote = currentItem.a_vote + 1;

            async function updateOneDocByID_B_adam() {

                try {
                    await client.connect();

                    async function updateListingByName_B_c(client, nameOfListing) {
                        const result = await client.db("sample_questions").collection("questions").updateOne({ _id: nameOfListing }, { $set: {a_vote: currentItem.a_vote} });
                        console.log(`${result.matchedCount} document(s) matched the query criteria.`);console.log(`${result.modifiedCount} document(s) was/were updated.`);
                    }

                    await updateListingByName_B_c(client, questions[currentIndex]._id);



                    res.setHeader('Content-Type', 'text/html');
                    res.render('gameover', {something: score});

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


app.listen(3000, () => console.log("App started"))