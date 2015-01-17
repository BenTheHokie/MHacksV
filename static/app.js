$(".login").click(logInUser);
function display_friends() {
	var friends = user.relation("friendsUsingApp");
	friends.query().find({
		success: function(friends) {
			//friends is an array of friends
			// with the app
		      console.log('hi');
		     for(var i = 0;i<friends.length;i++){
		       $('.friendcontainer').append('<li>'+friends[i].get('name')+' <a href="#">Add to Room</a></li>');
		       console.log(i+friends[i].get('name'));
		     }
		}
	});
}

 