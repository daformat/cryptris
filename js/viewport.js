/**
 *  Self-executing function to apply proper viewport settings according to the device
 *  @author: Mathieu Jouhet <mathieu@digitalcuisine  
 */

(function adjustViewport(doc) {
    var viewport = document.getElementById('viewport');

    // check for iPhone or iPod
    if ( navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPod/i)) {
        doc.getElementById("viewport").setAttribute("content", "initial-scale = 0.5, maximum-scale = 0.5");
    }
    
    // check for iPad
    else if ( navigator.userAgent.match(/iPad/i) ) {
        doc.getElementById("viewport").setAttribute("content", "initial-scale = 0.85, maximum-scale = 0.85");
    }

    // check for Android devices
    else if ( navigator.userAgent.match(/Android/i) ) {
        // android mobile
        if ( navigator.userAgent.match(/Mobile/i) ) {
            doc.getElementById("viewport").setAttribute("content", "initial-scale = 0.45, maximum-scale = 0.45");
        }

        // android tablet
        else {
            doc.getElementById("viewport").setAttribute("content", "initial-scale = 0.85, maximum-scale = 0.85");
        }
    } else{
    }

}(document));

