// Toggle Function
var b = 0; //Defines visiblility of desired object
							   //1 = visible, 0 = invisible
$("#Toggle").click(function() {
						//When anything with the "MyButton" id is clicked:
						
						
	if (b === 0){
								//If the object is hidden make it visible
		$('#SToggle').text("Sign In");
		b++; //Define the state as visible
									
	}else{
								//If the button is clicked and the object is invisible
		$('#SToggle').text("Sign Up");
		b = 0; //Defines the state as invisible
									 
	}
				 
});


$('.toggle').click(function(){
  // Switches the Icon
  $(this).children('i').toggleClass('fa-pencil');
  // Switches the forms  
  $('.form').animate({
    height: "toggle",
    'padding-top': 'toggle',
    'padding-bottom': 'toggle',
    opacity: "toggle"
  }, "slow");
});

