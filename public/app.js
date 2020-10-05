firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    console.log(user.displayName);
    console.log(user.email);
    console.log(user.photoURL);
    console.log(user.emailVerified);
    console.log(user.uid);

    if(user.displayName == null) {
      getElemID('welcome').innerHTML = user.email;
    } else {
      getElemID('welcome').innerHTML = user.displayName;
    }

    getElemID('update_displayName').innerHTML = user.displayName;
    // getElemID('update_now_email').innerHTML = user.displayName;

    getElemID('logined').className = 'd-block';
    getElemID('no_login').className = 'd-none';
  } else {
    getElemID('logined').className = 'd-none';
    getElemID('no_login').className = 'd-block';
  }
});

firebase.auth().languageCode = 'ja';

document.querySelector("#update_form").addEventListener("submit", function(event) {
  var user = firebase.auth().currentUser;

  user.updateProfile({
    displayName : getElementValue('update_displayName')
  }).then(function() {
    alert('ニックネームを変更しました。');
    location.reload();
  }).catch(function(error) {
    var errorCode = error.code;
    var errorMessage = error.message;
    alert(errorCode + ', ' + errorMessage);
  });
  event.preventDefault();
}, false);

document.querySelector("#update_mailaddress_form").addEventListener("submit", function(event) {

  var user = firebase.auth().currentUser;
  var credential = firebase.auth.EmailAuthProvider.credential(
    user.email,
    getElementValue('update_email_password')
  );

  user.reauthenticateWithCredential(credential).then(function() {
    // User re-authenticated.
    user.updateEmail(getElementValue('update_new_email')).then(function() {
      user.sendEmailVerification().then(function() {
        alert('メールアドレスを変更しました。再度ログインしてください。なお認証メールを送信しております。');
        firebase.auth().signOut();
      }).catch(function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        alert(errorCode + ', ' + errorMessage);
      });
    }).catch(function(error) {
      var errorCode = error.code;
      var errorMessage = error.message;
      alert(errorCode + ', ' + errorMessage);
    });

  }).catch(function(error) {
    var errorCode = error.code;
    var errorMessage = error.message;
    alert(errorCode + ', ' + errorMessage);
  });

  event.preventDefault();
}, false);

document.querySelector("#update_password_form").addEventListener("submit", function(event) {
  event.preventDefault();

  var user = firebase.auth().currentUser;
  var credential = firebase.auth.EmailAuthProvider.credential(
    user.email,
    getElementValue('update_now_password')
  );

  user.reauthenticateWithCredential(credential).then(function() {
    // User re-authenticated.
    user.updatePassword(getElementValue('update_new_password')).then(function() {
      alert('パスワードを変更しました。再度ログインしてください。');
      firebase.auth().signOut();
    }).catch(function(error) {
      var errorCode = error.code;
      var errorMessage = error.message;
      alert(errorCode + ', ' + errorMessage);
    });

  }).catch(function(error) {
    var errorCode = error.code;
    var errorMessage = error.message;
    alert(errorCode + ', ' + errorMessage);
  });

  event.preventDefault();
}, false);

document.querySelector("#remove_account_form").addEventListener("submit", function(event) {
  event.preventDefault();

  var user = firebase.auth().currentUser;
  var credential = firebase.auth.EmailAuthProvider.credential(
    user.email,
    getElementValue('remove_account_password')
  );

  user.reauthenticateWithCredential(credential).then(function() {
    // User re-authenticated.

    user.delete().then(function() {
      alert('アカウントを削除しました。ご利用ありがとうございました。');
      firebase.auth().signOut();
    }).catch(function(error) {
      var errorCode = error.code;
      var errorMessage = error.message;
      alert(errorCode + ', ' + errorMessage);
    });

  }).catch(function(error) {
    var errorCode = error.code;
    var errorMessage = error.message;
    alert(errorCode + ', ' + errorMessage);
  });

  event.preventDefault();
}, false);






document.querySelector("#reset_password_form").addEventListener("submit", function(event) {
  var auth = firebase.auth();
  var emailAddress = getElementValue("reset_password_email");

  auth.sendPasswordResetEmail(emailAddress).then(function() {
    alert('パスワード変更リンクを送信しました。');
    firebase.auth().signOut();
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
  return getElemID(id).value;
}

function getElemID(id){
  return document.getElementById(id);
}
