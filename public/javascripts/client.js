console.log('Client-side code running');
/*
const button = document.getElementById('myButton');
button.addEventListener('click', function(e) {
  console.log('button was clicked');
});
*/



//button1 or button 2 is clicked
const button1 = document.getElementById('bone');
const button2 = document.getElementById('btwo');
const postBtn = document.getElementById('myButton');
const inputData = document.getElementById('answer');

const q_id = document.getElementById("");

const baseUrl = "http://localhost:3000/"


button1.addEventListener("click", getInfoA);

  async function getInfoA(e){
    e.preventDefault();
    const res = await fetch(baseUrl, 
    {
      method: "GET"
    })

    inputData.value = "test a";
    console.log(res);
  }



button2.addEventListener("click", getInfoB);

async function getInfoB(e){
  e.preventDefault();
  const res = await fetch(baseUrl, 
  {
    method: "GET"
  })

  inputData.value = "test b";
  console.log(res);
}


postBtn.addEventListener("click", postInfo);

async function postInfo(e){
  e.preventDefault();
  const res = await fetch(baseUrl /*+ "james?key=Hello"*/, 
  {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      parcel: inputData.value
    })
  })
}



