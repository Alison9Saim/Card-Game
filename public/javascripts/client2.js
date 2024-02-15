console.log('Client-side game code running');

const button1 = document.getElementById('one');
const button2 = document.getElementById('two');
var inputTxt = document.getElementById('selectedOpt');


const baseUrl = "http://localhost:3000"

function changeValueOfInput(opt){

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
    }


}
