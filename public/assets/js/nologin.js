function getElementValue(id){
  return getElemID(id).value;
}

function getElemID(id){
  return document.getElementById(id);
}

// パスワード変更リンク取得
document.querySelector("#reset_password_form").addEventListener("submit", function(event) {
  if(confirm('パスワード変更リンクを送信します。よろしいですか？')){
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
  }
  window.location.hash = "reminder";
  event.preventDefault();
}, false);

// サインアップ
document.querySelector("#signup_form").addEventListener("submit", function(event) {
  if(confirm('アカウントを登録します。よろしいですか？')){
    var auth = firebase.auth();
    var emailAddress = getElementValue("signup_email");
    var password = getElementValue("signup_password");

    firebase.auth().createUserWithEmailAndPassword(emailAddress, password).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      alert(errorCode + ', ' + errorMessage);
    });
    window.location.hash = "signup";
    event.preventDefault();
  }
}, false);

// サインイン
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
  window.location.hash = "signin";
  event.preventDefault();
}, false);


firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    var xhr = new XMLHttpRequest(),
      method = "GET",
      url = "parts/parts.html";//読み込まれるHTMLを指定
    var box = getElemID('main_contents');//読み込みたい位置を指定

    xhr.open(method, url, true);
    xhr.onreadystatechange = function () {
      if(xhr.readyState === 4 && xhr.status === 200) {
        fadeOut(getElemID('loading'), 50);
        fadeIn(getElemID('main_contents'), 100);
        var restxt=xhr.responseText;//String型で取得

        document.body.innerHTML = restxt;//完了
        window.location.hash = "top";

        loadScript("/parts/app.js", function() {
          console.log('script loaded');
        });

      } else {
        console.log('L94');
        // fadeOut(box, 0);
      }
    };
    xhr.send();
  } else {
    fadeOut(getElemID('loading'), 50);
    fadeIn(getElemID('main_contents'), 100);
    console.log('L109');
  }
});

function loadScript(src, callback) {
  var done = false;
  var head = document.getElementsByTagName('head')[0];
  var script = document.createElement('script');
  script.src = src;
  head.appendChild(script);
  // Attach handlers for all browsers
  script.onload = script.onreadystatechange = function() {
    if ( !done && (!this.readyState ||
      this.readyState === "loaded" || this.readyState === "complete") ) {
      done = true;
      callback();
      // Handle memory leak in IE
      script.onload = script.onreadystatechange = null;
      if ( head && script.parentNode ) {
        head.removeChild( script );
      }
    }
  };
}



/**
 * Fade-In
 * @param {Element} element 適用する要素
 * @param {Number} [time=400] 効果時間（ミリ秒で指定）
 * @param {Function} [callback] 完了後のコールバック関数
 */
var fadeIn = function(element, time, callback) {
  var fadeTime     = (time) ? time : 400,
    keyFrame     = 30,
    stepTime     = fadeTime / keyFrame,
    maxOpacity   = 1,
    stepOpacity  = maxOpacity / keyFrame,
    opacityValue = 0,
    sId          = '';

  if (!element) return;

  if (element.getAttribute('data-fade-stock-display') !== undefined &&
    element.getAttribute('data-fade-stock-display') !== null) {
    element.style.display = element.getAttribute('data-fade-stock-display');
  }

  var setOpacity = function(setNumber) {
    if ('opacity' in element.style) {
      element.style.opacity = setNumber;
    } else {
      element.style.filter = 'alpha(opacity=' + (setNumber * 100) + ')';

      if (navigator.userAgent.toLowerCase().match(/msie/) &&
        !window.opera && !element.currentStyle.hasLayout) {
        element.style.zoom = 1;
      }
    }
  };

  if (!callback || typeof callback !== 'function') callback = function() {};

  setOpacity(0);

  sId = setInterval(function() {
    opacityValue = Number((opacityValue + stepOpacity).toFixed(12));

    if (opacityValue > maxOpacity) {
      opacityValue = maxOpacity;
      clearInterval(sId);
    }

    setOpacity(opacityValue);

    if (opacityValue === maxOpacity) callback();
  }, stepTime);

  return element;
};

/**
* Fade-Out
* @param {Element} element 適用する要素
* @param {Number} [time=400] 効果時間（ミリ秒で指定）
* @param {Function} [callback] 完了後のコールバック関数
*/
var fadeOut = function(element, time, callback) {
  var fadeTime     = (time) ? time : 400,
      keyFrame     = 30,
      stepTime     = fadeTime / keyFrame,
      minOpacity   = 0,
      stepOpacity  = 1 / keyFrame,
      opacityValue = 1,
      sId          = '';

  if (!element) return;

  element.setAttribute('data-fade-stock-display', element.style.display.replace('none', ''));

  var setOpacity = function(setNumber) {
    if ('opacity' in element.style) {
      element.style.opacity = setNumber;
    } else {
      element.style.filter = 'alpha(opacity=' + (setNumber * 100) + ')';

      if (navigator.userAgent.toLowerCase().match(/msie/) &&
        !window.opera && !element.currentStyle.hasLayout) {
        element.style.zoom = 1;
      }
    }
  };

  if (!callback || typeof callback !== 'function') callback = function() {};

  setOpacity(1);

  sId = setInterval(function() {
    opacityValue = Number((opacityValue - stepOpacity).toFixed(12));

    if (opacityValue < minOpacity) {
      opacityValue = minOpacity;
      element.style.display = 'none';
      clearInterval(sId);
    }

    setOpacity(opacityValue);

    if (opacityValue === minOpacity) callback();
  }, stepTime);

  return element;
};

fadeIn(getElemID('loading'), 10);
