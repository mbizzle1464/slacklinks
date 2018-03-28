// Initialize Firebase
var config = {
    apiKey: "AIzaSyCMUCGO6kMf8iYlXRPY3vN2t3E6JNXSDdY",
    authDomain: "slack-links-3044f.firebaseapp.com",
    databaseURL: "https://slack-links-3044f.firebaseio.com",
    projectId: "slack-links-3044f",
    storageBucket: "slack-links-3044f.appspot.com",
    messagingSenderId: "944486128107"
};
firebase.initializeApp(config);

//Global Firebase variables
var database = firebase.database(),
    authorize = firebase.auth(),
    //google auth firebase instance
    googleProvider = new firebase.auth.GoogleAuthProvider(),
    userLoggedIn = false,
    //used to determine if user is online at any time
    disconnectUser,
    //will be user object with all kinds of datas
    userObject,
    //to allow easy use of the database
    databaseObject;
//database reference for user login
database.ref().on("value", function (snapshot) {
    databaseObject = snapshot.toJSON();
    console.log(databaseObject);
    //firebase function to check whether user is logged into site
    authorize.onAuthStateChanged(function (user) {
        if (user) {//will return non-null if there is a user logged in 
            event.preventDefault();
            userObject = user;//get the returned object for the auth, which has the logged in user's information, namely uid
            userLoggedIn = true;//used below to state user is logged in and to proceed to next page            
        }
        else if (databaseObject != null) {//if there is nothing in the database , then snapshot is null
            event.preventDefault();
            disconnectUser = database.ref("/users/" + userObject.uid + "/iconnect")
            disconnectUser.set(true);
            disconnectUser.onDisconnect().set("disconnected");
        } else {
            userLoggedIn = false;
        }
    });
});
//////////////////////////////////HOME PAGE LOAD/////////////////////////////////////
var pageToLoad,
    url = "";
//////////////////////////////////MODAL CODE/////////////////////////////////////
// Login User 
var logIn = function () {
    //checks to see if user is logged in 
    if (!userLoggedIn) {//userLoggedIn is set above in OnAuthChange
        $("#loginModal").modal({ backdrop: 'static', keyboard: false }); //if user not logged in, show modal for user to log in
        $("#loginModal").modal("show");
        pageToLoad = "index.html";//store page to load so that user can be directed to it after login
        database.ref(childSnapshot);    
    } else {//if user is logged in
        database.ref("/users/" + userObject.uid + "/cameFromOtherPage").set(false);
        var win = window.open("index.html", "_self");
        win.focus();
    }
};
//This function is for going to sign up modal from Log in Modal
var formUp = function () {
    $("#loginModal").modal("hide");
    $("#signUpModal").modal("show");
    $("#submit-up").show();
    $("#close-up").show();
    $("#errorMsg").empty();
};  
//This function is for going to sign in modal from Log In Modal
var formSign = function () {
    $("#loginModal").modal("hide");
    $("#signInModal").modal("show");
    $("#submit-sign").show();
    $("#close-sign").show();
    $("#passwordBtn").show();
    $("#errorMsg").empty();

};
//This function is for sign ups. 
var signUp = function () {
    var email = $("#email-up").val(),
        password = $("#password-up").val(),
        name = $("#firstName").val() + " " + $("#lastName").val(),
        errorCode = "";
    $("#errorMsg").empty();

    console.log(email);
    console.log(password);
    console.log(name);
    console.log(errorCode);

    $('#close-up').on("click", function () {
        $("#signUpModal").modal("hide");
        $("#loginModal").modal("show");
    });
    authorize.createUserWithEmailAndPassword(email, password).then(function (user) {
        //creates user 
        $("#signUpModal").modal("hide")
        userLoggedIn = true;
        database.ref("/users/" + user.uid).set({//sets preliminary information gathered in user form to firebase in the node users/the user's uid - since uid is a primary key for the user, this makes sense to set data here since uid will always be unique to the particular user
            name: name,
            email: email,
        });
    }).catch(function (error) {//shows firebase auth error warning
        var errorCode = error.code,
            errorMessage = error.message;

        console.log(errorMessage);

        if (errorMessage == "The email address is already in use by another account.") {
            $("#errorMsg").empty();
            $("#errorMsg").append("<p>" + errorMessage + " If this is your account, please click the sign in button to sign in.</p>")
        } else {
            $("#errorMsg").empty();
            $("#errorMsg").append("<p>" + errorMessage + " Please try again.</p>")
        }
    });
};
//This function is for changing to login Modal from Sign in Modal.
var closeSign = function () {
    $("#signInModal").modal("hide");
    $("#loginModal").modal("show");
};
//This function is for closing the password Modal
var closePassword = function () {
    $("#passwordModal").modal("hide");
    $("#loginModal").modal("show");
};
//This function is for changing to login Modal from Sign Up Modal.
var closeUp = function () {
    $("#signUpModal").modal("hide");
    $("#loginModal").modal("show");
};
//This function is for sign ins
var submitSign = function () {
    var email = $("#email-sign").val(),
        password = $("#password-sign").val();

    

    //firebase sign in with email and password function
    //returns user - used to personal statement on post sign in modal
    authorize.signInWithEmailAndPassword(email, password).then(function (user) {
        $("#signInModal").modal("hide")
        userLoggedIn = true;
        console.log(userLoggedIn);
    }).catch(function (error) {//shows firebase auth error warning
        var errorCode = error.code,
            errorMessage = error.message;

        console.log(errorCode);
        console.log(errorMessage);

        if (errorMessage) {
            $("#errorMessage").empty();
            $("#errorMessage").append("<p class='text-center'>" + errorMessage + " Please try again.</p>")
            $('.closeBtn').on("click", function () {
                $(".closeBtn").css("display", "none");
                $("#errorMessage").empty();
                $("#signInModal").modal("hide");
                $("#loginModal").modal("show");
            });
        }
    });
};
//This function is for going to Password Modal from Forgot password button
var passwordSign = function () {
    $("#signInModal").modal("hide")
    $("#password-form").show();
    $("#close-password").show();
    $("#passwordModal").modal("show")
};  
//This function is for sending email to user to reset password
var submitPassword = function () {
    var email = $("#email-password").val();
    authorize.sendPasswordResetEmail(email).then(function () {
        $("#passwordModal").modal("hide")
    }).catch(function (error) {
        var errorCode = error.code,
            errorMessage = error.message;
        console.log(errorCode);
        console.log(errorMessage);

        if (errorMessage) {
            $("#errorPassword").empty();
            $("#password-form").css("display", "none");
            $("#errorPassword").append("<p class='text-center'>" + errorMessage + " Please try again.</p>")
            $('.closeBtn').on("click", function () {
                $(".closeBtn").css("display", "none");
                $("#errorPassword").empty();
                $("#loginModal").modal("show");
            });
        }
    });
};
//signs out user
var logOut = function () {
    firebase.auth().signOut().then(function () {
        var win = window.open("index.html", "_self");
        win.focus();
    }, function (error) {
        console.error('Sign Out Error', error);
    });
};  
////////////////////////////////// END MODAL CODE/////////////////////////////////////
// add URL input     
var addInput = function () {
    event.preventDefault();
    url = $('#url-input').val().trim();
    date = moment().format("MMMM Do YYYY");
    //console.log(url);
    //console.log(date);
    if (!userLoggedIn) {
        logIn();    
        return
    }
    else if (url === "") {
        $("#urlModal").modal("show");
        $('.closeBtn').on("click", function () {
            $("#urlModal").modal("hide");
        });
        return
        
    }
    else if ($("#url-input-error")) {
        $("#urlModal").modal("show");
        $('.closeBtn').on("click", function () {
            $("#urlModal").modal("hide");
        });
        return
    }
    else {
        var newURL = {
            url: url,
            date: date,
            dataAdded: firebase.database.ServerValue.TIMESTAMP,
        }
        database.ref().push(newURL);
        //console.log(newURL.url);
        //console.log(newURL.date);
        $('#url-input').val('');
        return false;
}
    
};

// database reference for URL storage  
database.ref().on('child_added', function (childSnapshot) {

    console.log(childSnapshot.val());

    var sv = childSnapshot.val();

    var url = sv.url,
        date = sv.date,
        link = url.link(url); 

    console.log(sv.url);  
    console.log(sv.date);     


    $('#add-url-row').append("<tr><td>" + link + "</td></tr>");

    }, function (errorObject) {
    console.log("The read failed: " + errorObject.code);

});

var searchInput = function () {
    event.preventDefault();
    var value = $(this).val().toLowerCase();
    $("#url-table tr").filter(function () {
        $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
    });
}

//Event Handlers
$(document).on("click", "#logIn", logIn);
$("#form-up").on("click", formUp);
$("#form-sign").on("click", formSign);
$("#submit-up").on("click", signUp);
$('#close-sign').on("click", closeSign);
$('#close-password').on("click", closePassword);
$('#close-up').on("click", closeUp);
$("#submit-sign").on("click", submitSign);
$('#passwordSign').on("click", passwordSign);
$('#submit-password').on("click", submitPassword);
$('#add-input').on('click', addInput);
$('#search-input').on('keyup', searchInput);
$(document).on("click", "#logOut", logOut);