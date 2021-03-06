$(".login").click(logInUser);
var all_friends = null;
var all_members = null;
var boardposts = null;

//get room's members (except for you)
function get_members() {
    var curr_room = user.get("lastAccessedRoom");
    var members = curr_room.relation("members");
    var mq = members.query();
    mq.notEqualTo("fbID", user.get("fbID"));
	mq.ascending("name");
    mq.find({
        success: function(list) {
            all_members = list;
            $(".roommatecontainer").empty();
            for (var i = 0; i < list.length; i++) {
                $(".roommatecontainer").append("<li><img src='"+list[i].get('picture_url')+"' />" + list[i].get('name') + "</li>");
            }
        }
    });
}

get_members();

//gets all the friends that aren't your roomies yet
function get_friends() {
    var curr_room = user.get("lastAccessedRoom")
    var members = curr_room.relation("members");
    var friends = user.relation("friendsUsingApp");
	members.query().ascending("name");
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
                    show_friends();
                    //get_members();
                    return results;
                }
            });
        }
    });
}

function show_friends() {
    $('.friendcontainer').empty();
    $('.friendlist').empty();
    for (var i = 0; i < all_friends.length; i++) {
        $('.friendcontainer').append('<li><img src="'+all_friends[i].get('picture_url')+'" />' + all_friends[i].get('name') + ' <a onClick="add_roommate(' + i + ')" href="#">Add</a></li>');
    }
    for (var i = 0; i < all_members.length; i++) {
        $('.friendlist').append("<option value='" + i + "'>" + all_members[i].get('name') + "</option>");
    }
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
    $('a.close-reveal-modal').trigger('click');
}

function create_bulletin(post, anon) {
    var Post = Parse.Object.extend("Post");
    var newPost = new Post();
    newPost.set("post", post);
    if (anon)
        newPost.set("author", "Anonymous");
    else
        newPost.set("author", user.get("name"));

    newPost.save().then(function() {
        var currentRoom = user.get("lastAccessedRoom");
        var relation = currentRoom.relation("bulletin_board");
        relation.add(newPost);
        currentRoom.save();

        setTimeout(get_bulletins(), 500);
		
		document.getElementById("postForm").reset();
    }, function(error) {});
}


function get_bulletins() {
    var currentRoom = user.get("lastAccessedRoom");
    var relation = currentRoom.relation("bulletin_board");
    var query = relation.query();
    query.limit(10);
    query.descending('createdAt');
    query.find({
        success: function(currentBulletins) {
            console.log(currentBulletins);
            boardposts = currentBulletins;
            show_bulletins();
            return currentBulletins;
        }
    });
}

function show_bulletins() {
    $(".boardcontainer").empty();

    for (var i = 0; i < boardposts.length; i++) {
        $(".boardcontainer").append("<tr><td>" + boardposts[i].get('author') + "</td><td>" + boardposts[i].get('post') + "</td><td>" + boardposts[i].createdAt + "</td></tr>");
    }
}

function get_rooms() {
    var usr = user.get("lastAccessedRoom");
    usr.fetch({
	success: function(result){
	    console.log("LAR:");
	    console.log(result);
	    $('#currroomtext').text(result.attributes.name);
	},
	error: function(error) {
	    console.log("LAR Error: "+error.message);
	}
    });

}

get_bulletins();
get_friends();

get_rooms();

$('#bulletinpost').click(function() {
    var text = $('#bulletintext').val();
    console.log(text);
    create_bulletin(text, false);
});

$('#anonpost').click(function() {
    var text = $('#bulletintext').val();
    console.log(text);
    create_bulletin(text, true);
});

$('#setroomtxt').click(function() {
    var text = $('#setroomtxt').val();

});

function addChore() {
	var date_time = $('#due_date').val();
	var year = date_time.substring(0,4);
	var month = date_time.substring(5,7);
	var day = date_time.substring(8,10);
	var hour = date_time.substring(11,13);
	var min = date_time.substring(14,date_time.length);
	var due_date = new Date(year, month, day, hour, min, 0, 0);
	var chore = $('#chore').val();
	var index = $('.friendlist').val();
	var person_chosen = all_members[index];
	
	var Chore = Parse.Object.extend("Chore");
	var friend_chore = new Chore();
	
	friend_chore.set("chore", chore);
	friend_chore.set("personDoingChore", person_chosen);
	friend_chore.set("dueDate", due_date);
	friend_chore.save().then(function() {
		var curr_room = user.get("lastAccessedRoom");
		var relation = curr_room.relation("chores");
		relation.add(friend_chore);
		curr_room.save();
		document.getElementById("choreForm").reset();
		showChores();
    }, function(error) {});
}

function splitBill() {
	console.log(all_members.length);
	all_members.push(user); 
	var billAmount = parseFloat($('#billAmount').val());
	console.log("HELL YEAH");
	console.log(billAmount);
	console.log(all_members.length);
	var billShare = billAmount/(all_members.length);
	var billType = $('#billType').val();
	
	var Bill = Parse.Object.extend("Bill");
	var newBill = new Bill();
	
	newBill.set("billShare", billShare);
	newBill.set("billType", billType);
	
	var owners = newBill.relation("billOwners");
	//since all_members doesn't include current user
	
	newBill.save().then(function() {
		for(var i =0;i<all_members.length;i++) {
			all_members[i].relation("bills").add(newBill);
			all_members[i].save();
		}
		var currentRoom = user.get("lastAccessedRoom");
		currentRoom.fetch({
			success: function(currentRoom) {
			var relation = currentRoom.relation("bills");
			relation.add(newBill);
			currentRoom.save();
			document.getElementById("billForm").reset();
		}
		});
	}, function(error) {});
}
function showChores(){
    var currentRoom = user.get("lastAccessedRoom");
    var relation = currentRoom.relation("chores");
    var query = relation.query();
    query.limit(10);
    query.descending('createdAt');
    query.find({
        success: function(currentchores) {
            console.log(currentchores);
            //choreposts = currentchores;
            //show_bulletins();
	    $('.chorecontainer').empty();
	    for (var i = 0; i < currentchores.length; i++) {
		console.log(currentchores[i].get('dueDate'));
		$(".chorecontainer").append("<tr><td>" + currentchores[i].get('chore') + "</td><td>" + currentchores[i].get('dueDate') + "</td></tr>");
	    }
            return currentchores;
        }
    });
}

showChores();

function showBills(){
    var currentRoom = user.get("lastAccessedRoom");
    var relation = currentRoom.relation("bills");
    var query = relation.query();
    query.limit(10);
    query.descending('createdAt');
    query.find({
        success: function(currentbills) {

	    $('.billcontainer').empty();
	    for (var i = 0; i < currentbills.length; i++) {
		//console.log(currentbills[i].get('billType'));
		$(".billcontainer").append("<tr><td>" + currentbills[i].get('billType') + "</td><td>" + currentbills[i].get('billShare') + "</td><td>" + currentbills[i].get('dueDate') + "</td></tr>");
	    }
            return currentbills;
        }
    });
}

showBills();


function updateRoomList(){
    var curr_room = user.get("lastAccessedRoom");
	var relation = user.relation("rooms");
	var query = relation.query();
	query.ascending("name");
	
	curr_room.fetch({
		success: function(curr_room) {
			query.find({
				success:function(response){
				console.log(response);
				$("#roomlist").empty();
				for(var i = 0;i<response.length;i++){
					if (response[i].objectId == curr_room.objectId) {
						$("#roomlist").append("<option selected='selected'>"+response[i].get('name')+"</option>");
					} else {
						$("#roomlist").append("<option>"+response[i].get('name')+"</option>");
					}		
				} 
				}, error: function(error) {} });
		}, error: function(collection, error) {}
	});
}  

updateRoomList();
