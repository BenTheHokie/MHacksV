Parse.initialize("Egi8d0x6nAxuE4tRaFM48klQwT9brWsR2KuQKOsk", "cVPx1sVT9aXa7m7zlxzVzTRP9i3v7CSzkXtaZIZg");

var user = Parse.User.current();

function onLogin() {
    FB.api("/me", function(response) {
        if (response && !response.error) {
            user.set("fbID", response.id);
            user.set("name", response.name);

            user.save();

            console.log("User's Name: " + user._serverData.name + "\nAccess Token: " + JSON.parse(user._hashedJSON.authData).facebook.access_token + "\nNow we can make a POST request that can be validated by the server, bitches.");
        }
    });
}