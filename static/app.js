$(".login").click(logInUser);

function display_friends() {
	var friends = user.relation("friendsUsingApp");
	relation.query().find({
		success: function(friends) {
			//friends is an array of friends
			// with the app
		}
	});
}