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

// Create a variable to reference the database
var database = firebase.database();

var url = "";

    

$('#add-input').on('click', function () {
    event.preventDefault();

    url = $('#url-input').val().trim();
    date = moment().format("MMMM Do YYYY");
    

    console.log(url);
    console.log(date);

    var newURL = {
        url: url,
        date: date,
        dataAdded: firebase.database.ServerValue.TIMESTAMP,
    }

    database.ref().push(newURL);

    console.log(newURL.url);
    console.log(newURL.date);
    

    $('#name-input').val('');
    $('#url-input').val('');
    $('#date-input').val('');

    return false;
});

database.ref().on('child_added', function (childSnapshot) {

    console.log(childSnapshot.val());

    var sv = childSnapshot.val();

    var url = sv.url,
        date = sv.date,
        link = url.link(url); 

    console.log(sv.url);  
    console.log(sv.date);     


    $('#add-employee-row').append("<tr><td>" + date + "</td><td>" +  link + "</td></tr>");

}, function (errorObject) {
    console.log("The read failed: " + errorObject.code);


});