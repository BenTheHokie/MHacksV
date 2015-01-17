$(".login").click(logInUser);
var all_friends = null;

//gets all the friends that aren't your roomies yet
function get_friends() {
	var curr_room = user.get("lastAccessedRoom")
	var members = curr_room.relation("members");
	var friends = user.relation("friendsUsingApp");
	members.query().find({
		success: function(list) {
			var ids = [];
			for (var i = 0; i < list.length; i++) {
				ids += [list[i].get("fbID")];
			}
			friends.query().notContainedIn("fbID", ids);
			friends.query().ascending("name");
			friends.query().find({
				success: function(results) {
					console.log(results);
					all_friends = results;
					return results;
				}
			});
		}
	});
}

function create_new_room() {
	var name = $("#room_name").val();
	console.log(name);
	var Room = Parse.Object.extend("Room");
	var room = new Room();
	room.set("name", name); //set the name of the room
	room.relation("members").add(user); //add current user
	room.save(null, {
		success: function(current_user) {
			user.relation("rooms").add(room);
			user.set("lastAccessedRoom", room);
			user.save();
			$('a.close-reveal-modal').trigger('click');
		},
	error: function(current_user, error) {
    // Execute any logic that should take place if the save fails.
    // error is a Parse.Error with an error code and message.
	}
	});
}

function add_roommate(index) {
    var friends = get_friends();
	var curr_room = user.get("lastAccessedRoom");
	var members = curr_room.relation("members");
	members.add(all_friends[index]);
    curr_room.save();
}