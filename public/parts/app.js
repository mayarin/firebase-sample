var any_chat_parts = getElemID('any_chat_parts_template').innerHTML;
var my_chat_parts = getElemID('my_chat_parts_template').innerHTML;

getElemID('any_chat_parts_template').remove();
getElemID('my_chat_parts_template').remove();

fadeIn(document.body, 20);

// ログイン判別
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // userの中身
    // console.log(user.displayName);
    // console.log(user.email);
    // console.log(user.photoURL);
    // console.log(user.emailVerified);
    // console.log(user.uid);

    // displayNameが埋まっていなかったらemailをWelcome欄に表示
    if(user.displayName == null) {
      getElemID('welcome').innerHTML = user.email;
    } else {
      getElemID('welcome').innerHTML = user.displayName;
    }

    var query = firebase.firestore()
    .collection('openchats')
    .orderBy('datetime', 'asc');

    // Start listening to the query.
    query.onSnapshot(function(snapshot) {
      snapshot.docChanges().forEach(function(change) {
        console.log(change.type);
        var message = change.doc.data();
        console.log(change.doc.id);
        console.log(message.uid);

        var line = '';

        if(message.uid == user.uid){
          line = my_chat_parts;
        } else {
          line = any_chat_parts;
        }

        line = line.replace('replace_to_message', message.message);
        line = line.replace('replace_to_datetime', message.datetime);
        line = line.replace('replace_to_name', message.name);
        line = line.replace('/assets/img/unnamed.png', message.picture);
        getElemID('chat_window').innerHTML += line;

      });
      getElemID('chat_window').scrollTop = getElemID('chat_window').scrollHeight;
    });

    getElemID('update_displayName').value = user.displayName;
    getElemID('preview').src = user.photoURL;
    getElemID('header_picture').src = user.photoURL;
  }
});

firebase.auth().languageCode = 'ja';

document.querySelector("#chat_form").addEventListener("submit", function(event) {
  var user = firebase.auth().currentUser;
  var db = firebase.firestore();
  var date = new Date();
  var datetime = date.getFullYear() + '-' +
                ( '00' + ( date.getMonth() +1 ) ).slice( -2 ) + '-' +
                ( '00' + date.getDate() ).slice( -2 ) + ' ' +
                ( '00' + date.getHours() ).slice( -2 ) + ':' +
                ( '00' + date.getMinutes() ).slice( -2 ) + ':' +
                ( '00' + date.getSeconds() ).slice( -2 );

  // Add a new document in collection "cities"
  db.collection("openchats").doc().set({
    uid: user.uid,
    name: user.displayName,
    message: getElementValue('chat_message'),
    picture: user.photoURL,
    datetime : datetime
  })
  .then(function() {
    console.log("Document successfully written!");
    document.getElementById('chat_message').value = '';
  })
  .catch(function(error) {
    console.error("Error writing document: ", error);
  });
  event.preventDefault();
});

// プロフィール更新
document.querySelector("#update_form").addEventListener("submit", function(event) {
  if(confirm('プロフィールを更新します。よろしいですか？')){
    document.querySelector('#update_form button').setAttribute('disabled', true);
    document.querySelector('#update_form button').innerText = '反映中...';

    var user = firebase.auth().currentUser;
    var photoURLElement = getElemID('update_picture').files;

    // 先に画像がアップロードされているかを判別
    if(photoURLElement.length > 0){
      // 画像がある場合は画像をアップロードしてから user.updateProfile を発火させる
      console.log(photoURLElement.length);
      for(var i=0;i<photoURLElement.length;i++){
        var file = photoURLElement[i];
          var userName = user.uid+'_'+file.name;
          console.log(userName);
          var storageRef = firebase.storage().ref(userName);
          var uploadTask = storageRef.put(file);
          uploadTask.on('state_changed', function(snapshot){
            // Observe state change events such as progress, pause, and resume
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            var progress = Math.ceil((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
            document.querySelector('#update_form button').innerText = '反映中...'+progress+'%';

            switch (snapshot.state) {
              case firebase.storage.TaskState.PAUSED: // or 'paused'
                console.log('Upload is paused');
                break;
              case firebase.storage.TaskState.RUNNING: // or 'running'
                console.log('Upload is running');
                break;
            }
          }, function(error) {
            // Handle unsuccessful uploads
            alert('画像のアップロードに失敗しました。お手数ですが少々時間を置いてから試してください。');
          }, function() {
            // Handle successful uploads on complete
            // For instance, get the download URL: https://firebasestorage.googleapis.com/...
            uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
              console.log('File available at', downloadURL);
              updateProfile(downloadURL);
            });
          });
      }
    } else {
      // 画像がない場合は間髪入れずに user.updateProfile を発火させる
      updateProfile(user.photoURL);
    }
  }
  event.preventDefault();
}, false);

function updateProfile(photoURL){
  var user = firebase.auth().currentUser;
  var displayName = getElementValue('update_displayName');

  user.updateProfile({
    displayName : getElementValue('update_displayName'),
    photoURL : photoURL
  }).then(function() {
    alert('プロフィールを更新しました。');
    location.reload();
  }).catch(function(error) {
    var errorCode = error.code;
    var errorMessage = error.message;
    alert(errorCode + ', ' + errorMessage);
  });

  document.querySelector('#update_form button').removeAttribute('disabled');
  document.querySelector('#update_form button').innerText = '反映';
}

// メルアド変更
document.querySelector("#update_mailaddress_form").addEventListener("submit", function(event) {
  if(confirm('メールアドレスを変更します。よろしいですか？')){
    document.querySelector('#update_mailaddress_form button').setAttribute('disabled', true);
    document.querySelector('#update_mailaddress_form button').innerText = '反映中...';

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

    document.querySelector('#update_mailaddress_form button').removeAttribute('disabled');
    document.querySelector('#update_mailaddress_form button').innerText = '反映';
  }
  event.preventDefault();
}, false);

// パスワード変更
document.querySelector("#update_password_form").addEventListener("submit", function(event) {
  if(confirm('パスワードを変更します。よろしいですか？')){
    document.querySelector('#update_password_form button').setAttribute('disabled', true);
    document.querySelector('#update_password_form button').innerText = '反映中...';

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

    document.querySelector('#update_password_form button').removeAttribute('disabled');
    document.querySelector('#update_password_form button').innerText = '反映';
  }
  event.preventDefault();
}, false);

// アカウント削除
document.querySelector("#remove_account_form").addEventListener("submit", function(event) {
  if(confirm('アカウントを削除します。本当によろしいですか？')){
    document.querySelector('#remove_account_form button').setAttribute('disabled', true);
    document.querySelector('#remove_account_form button').innerText = '削除中...';

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
  }

  event.preventDefault();
}, false);

// ログアウト
document.querySelector("#logout_form").addEventListener("submit", function(event) {
  if(confirm('ログアウトします。よろしいですか？')){
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
  }
    event.preventDefault();
}, false);

function getElementValue(id){
  return getElemID(id).value;
}

function getElemID(id){
  return document.getElementById(id);
}

function getElemClass(name){
  return document.getElementsByClassName(name);
}


function previewImage(obj)
{
	var fileReader = new FileReader();
	fileReader.onload = (function() {
		document.getElementById('preview').src = fileReader.result;
	});
	fileReader.readAsDataURL(obj.files[0]);
}





