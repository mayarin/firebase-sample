firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    console.log(user);
    var body = 'displayName : ' + user.displayName + '<br>' +
      'email : ' + user.email + '<br>' +
      'photoURL : ' + user.photoURL + '<br>' +
      'emailVerified : ' + user.emailVerified + '<br>' +
      'uid : ' + user.uid  + '<br>';

    document.getElementById('user-email').innerHTML = user.email
    document.getElementById('logined').className = 'd-block';
    document.getElementById('no_login').className = 'd-none';
  } else {
    document.getElementById('logined').className = 'd-none';
    document.getElementById('no_login').className = 'd-block';
  }
});

document.querySelector("#reset_password_form").addEventListener("submit", function(event) {
  var auth = firebase.auth();
  var emailAddress = document.getElementById("reset_password_email").value;

  auth.sendPasswordResetEmail(emailAddress).then(function() {
    // Email sent.
  }).catch(function(error) {
    document.getElementById('reset_result_area').innerHTML = error;
    console.log(error);
  });

  event.preventDefault();
}, false);

document.querySelector("#signup_form").addEventListener("submit", function(event) {
  var auth = firebase.auth();
  var emailAddress = document.getElementById("signup_email").value;
  var password = document.getElementById("signup_password").value;

  firebase.auth().createUserWithEmailAndPassword(emailAddress, password).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    alert(errorCode + ', ' + errorMessage);
    document.getElementById('signup_result_area').innerHTML = errorCode + ', ' + errorMessage;

  });
  event.preventDefault();

}, false);

document.querySelector("#signin_form").addEventListener("submit", function(event) {
  var auth = firebase.auth();
  var emailAddress = document.getElementById("signin_email").value;
  var password = document.getElementById("signin_password").value;

  firebase.auth().signInWithEmailAndPassword(emailAddress, password).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log(errorCode);
    document.getElementById('signin_result_area').innerHTML = errorCode + ', ' + errorMessage;

  });
  event.preventDefault();

}, false);

document.querySelector("#logout_form").addEventListener("submit", function(event) {
  firebase.auth().onAuthStateChanged( (user) => {
    firebase.auth().signOut().then(()=>{
      console.log("ログアウトしました");
    })
    .catch( (error)=>{
      console.log(`ログアウト時にエラーが発生しました (${error})`);
    });
  });
}, false);
