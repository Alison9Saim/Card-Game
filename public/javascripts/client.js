console.log('Client-side code running');

const button = document.getElementById('myButton');
button.addEventListener('click', function(e) {
  console.log('button was clicked');
});



//button1 or button 2 is clicked
const button1 = document.getElementById('bone');
const button2 = document.getElementById('btwo');

button1.addEventListener('click', function(e){
  console.log('button one was clicked');
  document.getElementById("item").innerHTML = "test 1"; 


  fetch('/', {method: 'GET'})

  .then(function(response) {
    if(response.ok) {
      console.log('Click was recorded');
      return;
    }
    throw new Error('Request failed.');
  })
  .catch(function(error) {
    console.log(error);
  });

});

button2.addEventListener('click', function(e){
  console.log('button two was clicked');
  document.getElementById("item").innerHTML = "test 2"; 



  //function testServerCall(){
  //  debugger;
    $.ajax({
        type:"GET",
        url:"/",
        data:{ 
        },
        success:function(){
          console.log('success');
        },
        error:function(){
          console.log('error');
        }
      });
  //

});
