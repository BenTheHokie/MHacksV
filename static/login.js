Parse.initialize("Egi8d0x6nAxuE4tRaFM48klQwT9brWsR2KuQKOsk", "cVPx1sVT9aXa7m7zlxzVzTRP9i3v7CSzkXtaZIZg");

var user = Parse.User.current();

function onLogin() {
    FB.api("/me", function(response) {
        if (response && !response.error) {
            user.set("fbID", response.id);
            user.set("name", response.name);

            user.save();

	    token = user.attributes.authData.facebook.access_token;
	    name = user._serverData.name;
            console.log("User's Name: " + name + "\nAccess Token: " + token + "\nNow we can make a POST request that can be validated by the server, bitches.");

	    console.log("Begin posting data");

	    $atform = $("<form method=\"POST\" action=\"tokenvalidate\"></form>");
	    $atform.append("<input type=\"hidden\" name=\"accesstoken\" value=\""+token+"\">");
	    $atform.append("<input type=\"hidden\" name=\"name\" value=\""+name+"\">");
	    $atform.submit();
        }
    });
}

function statusChangeCallback(response) {
        console.log('statusChangeCallback');
        console.log(response);
        // The response object is returned with a status field that lets the
        // app know the current login status of the person.
        // Full docs on the response object can be found in the documentation
        // for FB.getLoginStatus().
        if (response.status === 'connected') {
            // Logged into your app and Facebook.
            onLogin();
        } else if (response.status === 'not_authorized') {
            // The person is logged into Facebook, but not your app.
            document.getElementById('status').innerHTML = 'Please log ' +
                'into this app.';
        } else {
            // The person is not logged into Facebook, so we're not sure if
            // they are logged into this app or not.
            document.getElementById('status').innerHTML = 'Please log ' +
                'into Facebook.';
        }
    }
    // This function is called when someone finishes with the Login
    // Button.  See the onlogin handler attached to it in the sample
    // code below.
function checkLoginState() {
    FB.getLoginStatus(function(response) {
        statusChangeCallback(response);
    });
}

window.fbAsyncInit = function() {
    Parse.FacebookUtils.init({
        appId: '647173522059867',
        cookie: true,
        xfbml: true,
        version: 'v2.1'
    });
};

(function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {
        return;
    }
    js = d.createElement(s);
    js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

function logInUser() {
    Parse.FacebookUtils.logIn("public_profile,email,user_friends", {
        success: function(user) {
             if (!user.existed()) {
				      console.log("User signed up and logged in through Facebook!");
			      } else {
			        console.log("User logged in through Facebook!");
			      }
			      //link FB User with Parse
			      if (!Parse.FacebookUtils.isLinked(user)) {
			        Parse.FacebookUtils.link(user, null, {
				        success: function(user) {
  				        console.log("Woohoo, user logged in with Facebook!");
				        },
				        error: function(user, error) {
				          console.log("User cancelled the Facebook login or did not fully authorize.");
				        }
			        });
			      }
            checkLoginState();
        },
        error: function(user, error) {
            console.log("User cancelled the Facebook login or did not fully authorize.");
        }
    });
};
