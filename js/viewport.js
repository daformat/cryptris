(function adjustViewport(doc) {
    var viewport = document.getElementById('viewport');
    if ( navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPod/i)) {
        doc.getElementById("viewport").setAttribute("content", "initial-scale = 0.5, maximum-scale = 0.5");
    } else if ( navigator.userAgent.match(/iPad/i) ) {
        doc.getElementById("viewport").setAttribute("content", "initial-scale = 0.85, maximum-scale = 0.85");
    }  else if ( navigator.userAgent.match(/Android/i) ) {
                if ( navigator.userAgent.match(/Mobile/i) ) {
                    // android mobile
            doc.getElementById("viewport").setAttribute("content", "initial-scale = 0.45, maximum-scale = 0.45");
        } else{
                // android tablet
            doc.getElementById("viewport").setAttribute("content", "initial-scale = 0.85, maximum-scale = 0.85");
            }
    } else{
    }
}(document));

