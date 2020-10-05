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
  var emailAddress = getElementValue("reset_password_email");

  auth.sendPasswordResetEmail(emailAddress).then(function() {
    alert('パスワード変更メールを発信しました。');
  }).catch(function(error) {
    var errorCode = error.code;
    var errorMessage = error.message;
    alert(errorCode + ', ' + errorMessage);
  });

  event.preventDefault();
}, false);

document.querySelector("#signup_form").addEventListener("submit", function(event) {
  var auth = firebase.auth();
  var emailAddress = getElementValue("signup_email");
  var password = getElementValue("signup_password");

  firebase.auth().createUserWithEmailAndPassword(emailAddress, password).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    alert(errorCode + ', ' + errorMessage);
  });
  event.preventDefault();

}, false);

document.querySelector("#signin_form").addEventListener("submit", function(event) {
  var auth = firebase.auth();
  var emailAddress = getElementValue("signin_email");
  var password = getElementValue("signin_password");

  firebase.auth().signInWithEmailAndPassword(emailAddress, password).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    alert(errorCode + ', ' + errorMessage);
  });
  event.preventDefault();

}, false);

document.querySelector("#logout_form").addEventListener("submit", function(event) {
  firebase.auth().onAuthStateChanged( (user) => {
    firebase.auth().signOut().then(()=>{
      alert("ログアウトしました");
    })
    .catch( (error)=>{
      var errorCode = error.code;
      var errorMessage = error.message;
      alert(errorCode + ', ' + errorMessage);
    });
  });
  event.preventDefault();
}, false);

function getElementValue(id){
  return document.getElementById(id).value;
}
