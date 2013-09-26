var ua = navigator.userAgent,
    nua = navigator.userAgent,
    uaOk = null,
    iCheck = null,
    aCheck = null,
    uaAndroid = null,
    uaIOS = null,
    isAndroid = null,
    isIOS = null,
    isOk = null,
    v = null,
    isPortrait,
    isNative;


function iOSversion() {
  if (/iP(hone|od)/.test(navigator.platform)) {
    var v = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/);
    return [parseInt(v[1], 10), parseInt(v[2], 10), parseInt(v[3] || 0, 10)];
  }
}

function detectIphoneIpod(){
  if (/iP(hone|od)/.test(navigator.platform)) {
    iCheck = true;
  }
  if (iCheck == true) {
    uaIOS = iOSversion();
    if (uaIOS[0] >= 5 && window.DeviceMotionEvent != undefined) {
      isIOS = true;
      isOk = true;
      isNative = true;
    }
  }
}

function detectAndroid() {
  if( ua.indexOf("Android") >= 0 ) {
    var uaAndroid = parseFloat(ua.slice(ua.indexOf("Android")+8));
    if (uaAndroid >= 4 ) {
      isAndroid = true;
      isOk = true;
      isNative = true;
    }
    if( ua.indexOf("Mobile") ) {
      aCheck = true;
    }
  }
}

function forceIsPortrait(){return window.innerHeight > window.innerWidth;}

function checkOrientation() {

  switch(window.orientation) {  
    case -90: case 90:
      isPortrait = false;
    break; 
    case 0: case 180:
      isPortrait = true;
      break; 
  }

  if(!isNative){isPortrait = forceIsPortrait();}
  
  if(isPortrait === true) {$("body").addClass("portrait");}
  else {$("body").removeClass("portrait");}
}

$(function(){
  detectIphoneIpod();
  detectAndroid();
  if(isOk){ isNative = true; }

  window.addEventListener('orientationchange', checkOrientation);
  checkOrientation();
  
  if(iCheck == true || aCheck == true){
    $("body").addClass( ( iCheck == true ? 'ios-mobile' : (aCheck == true ? 'android-mobile' : '') ) );
    $("body").append('<div class="wrapper" id="rotate-device"><div class="vertical-centering"><img src="img/rotate-device.png"></div></div>');
  }
})
