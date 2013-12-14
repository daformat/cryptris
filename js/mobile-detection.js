/**
 *  Cryptris mobile detection script
 *  @author: Mathieu Jouhet <mathieu@digitalcuisine.fr>
 *  @desc:  Check the device type for android / iOS, looks for the following:
 *          iPhone / iPod / Ipad / Android Mobile / Android Tablet.
 *          Handle device rotation if relevant.
 *          Displays rotation instructions when on small devices.
 *  @dependencies: jQuery
 */

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
  if ( navigator.userAgent.match(/(iPad|iPhone|iPod)/g) ) {
    var v = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/);
    
    isIOS = true;

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
  iOSversion();
  detectIphoneIpod();
  detectAndroid();
  if(isOk){ isNative = true; }

  window.addEventListener('orientationchange', checkOrientation);
  checkOrientation();
  
  $("body").addClass( ( iCheck == true ? 'ios-mobile' : ( isIOS == true ? 'ios-tablet' : ( aCheck ? 'android-mobile' : ( isAndroid ? 'android-tablet' : 'desktop' ) )  ))  );

  if(isIOS == true || isAndroid == true){
    $("body").append('<div class="wrapper" id="rotate-device"><div class="vertical-centering"><img src="img/rotate-device.png"></div></div>');
  }

  if(window.navigator.standalone){
    $(document).on('click', 'a', function (event)
    {      
        var href = $(this).attr("href");

        // prevent internal links (href.indexOf...) to open in safari if target
        // is not explicitly set_blank, doesn't break href="#" links
        if (href && $(this).attr("target") != "_blank")
        {
            event.preventDefault();
            window.location = href;
        }

    });  
  }  

})
