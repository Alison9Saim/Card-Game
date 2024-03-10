var max_chars = 20;
function limit(element)
{
    var max_chars = 20;
         
    if(element.value.length > max_chars) {
        element.value = element.value.substr(0, max_chars);
    }
}
    
$('#userNameTxt').keydown( function(e){
    if ($(this).val().length >= max_chars) { 
        $(this).val($(this).val().substr(0, max_chars));
    }
});
    
$('#userNameTxt').keyup( function(e){
    if ($(this).val().length >= max_chars) { 
        $(this).val($(this).val().substr(0, max_chars));
    }
});