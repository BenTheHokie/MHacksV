Parse.initialize("Egi8d0x6nAxuE4tRaFM48klQwT9brWsR2KuQKOsk","cVPx1sVT9aXa7m7zlxzVzTRP9i3v7CSzkXtaZIZg");

var user = Parse.User.current();

function onLogin() {
	FB.api("/me", function (response) {
		if (response && !response.error) {
			user.set("fbID", response.id);
			user.set("name", response.name);
			
			user.save();
			console.log("user has been added");
		}
	});
	
	/*FB.api("/me/friends",
    function (response) {
      if (response && !response.error) {
        var ids = [];
        var query = new Parse.Query(Parse.User);
        var relation = user.relation("friendsUsingApp");
        //get size of dictionaries
        for (i = 0; i < response.data.length; i++) {
          ids[i] = response.data[i].id;
        }
        query.containedIn("fbId", ids);
        query.find({
          success: function(friends) {
            relation.add(friends);
            user.save();
          }	
        });
      }
    });*/
};