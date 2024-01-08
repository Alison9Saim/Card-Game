var express = require('express')
var bodyParser = require('body-parser');
//var MongoClient = require('mongodb').MongoClient;
var app = express();

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');


var deck = [];
const suits = ["Spades", "Hearts", "Diamonds", "Clubs"];
const ranks = ["Ace", "2", "3", "4", "5", "6", "7", "8", "9", "10", "Jack", "Queen", "King"];

for (var suit of suits) {
    for (var rank of ranks) {
        deck.push(`${rank} of ${suit}`);
    }
}



/*
async function main() {
    // we'll add code here soon
    var uri = "mongodb+srv:admin1:qazwsxedc@cluster0.j2vmca7.mongodb.net/?retryWrites=true&w=majority";       
    
    const client = new MongoClient(uri);

    try {
        // Connect to the MongoDB cluster
        await client.connect();

        // Make the appropriate DB calls
        await  listDatabases(client);

    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}

main().catch(console.error);


async function listDatabases(client){
    databasesList = await client.db().admin().listDatabases();

    console.log("Databases:");
    databasesList.databases.forEach(db => console.log(` - ${db.name}`));
};
*/

/*
MongoClient.connect(url, (err, database) =>{

    if(err){
        console.log("not working");
        return console.log(err)
    }
    db = database;
    console.log("DB is working");
});
*/

    //get two random numbers/cards
    
    //var r2 = Math.floor(Math.random() * 52);

function genRandNum() {
    return Math.floor(Math.random() * 52);
}


app.get('/', function (req, res) {
    var r1, r2;
    console.log('Show new data and number')

    //res.send('Hello World!')
    res.render('index', {
        things: deck[1],
        rone: r1 = genRandNum(),
        rtwo: r2 = genRandNum()
    });
});


app.post('/', function (req, res) {
    console.log(req.body.city);
    res.render('index');  
    console.log('show index page again');
  })


  app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
  })