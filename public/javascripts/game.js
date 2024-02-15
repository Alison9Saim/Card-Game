console.log('Client-side game code running');



const button1 = document.getElementById('one');
const button2 = document.getElementById('two');
const button3 = document.getElementById('three');
const button4 = document.getElementById('four');

var inputTxt = document.getElementById('selectedOpt');


const baseUrl = "http://localhost:3000"


//button1.addEventListener("click", changeValueOfInput("a"));

function changeValueOfInput(opt){
    //debugger;
    inputTxt.value = opt;

    //getInfoA();

    async function getInfoA(e){
        //e.preventDefault();
        
        const res = await fetch(baseUrl + "?key=Hello",
        {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                user_choice: inputTxt.value
            })
        })
        //console.log(res);
    }


}
/*
async function getInfoA(e){
    //e.preventDefault();
    const res = await fetch(baseUrl, 
    {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            user_choice: button1.name
        })
    })
    console.log(res);
}
*/


//button2.addEventListener("click", changeValueOfInput("b"));
/*
async function getInfoB(e){
    //e.preventDefault();
    const res = await fetch(baseUrl, 
    {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            user_choice: button2.name
        })
    })
    console.log(res);
}
*/

//button3.addEventListener("click", changeValueOfInput("c"));
/*
async function getInfoC(e){
    //e.preventDefault();
    const res = await fetch(baseUrl, 
    {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            user_choice: button3.name
        })
    })
    console.log(res);
}
*/

//button4.addEventListener("click", changeValueOfInput("d"));
/*
async function getInfoD(e){
    //e.preventDefault();
    const res = await fetch(baseUrl, 
    {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            user_choice: button4.name
        })
    })
    console.log(res);
}
*/