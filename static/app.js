$(".login").click(logInUser);
var all_friends = null;

function display_friends() {
    var friends = user.relation("friendsUsingApp");
    friends.query().ascending("name").find({
        success: function(friends) {
            all_friends = friends;
            //friends is an array of friends
            // with the app
            console.log('hi');
            for (var i = 0; i < friends.length; i++) {
                $('.friendcontainer').append('<li>' + friends[i].get('name') + ' <a href="#">Add to Room</a></li>');
                console.log(i + friends[i].get('name'));
            }
        }
    });
}

function add_roommate(index) {
    var new_Room = Parse.Object.extend("Room");
    var query = new Parse.Query(new_Room);
    //find the room started by you
    query.equalTo("room_starter", user);
    query.find({
        success: function(results) {
            //hopefully the size of results is 1
            console.log(results.length);
            if (results.length == 0) {
                var Room = Parse.Object.extend("Room");
                var your_room = new Room();
                your_room.set("room_starter", user);
                your_room.relation("members").add(user);
                your_room.relation("members").add(all_friends[index]);
                your_room.save();
            } else {
                results[0].relation("members".add(all_friends[index]));
                results[0].save();
            }

        }
    });
}