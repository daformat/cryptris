(function(doc) {
    var viewport = document.getElementById('viewport');
    if ( navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPod/i)) {
        doc.getElementById("viewport").setAttribute("content", "initial-scale = 0.5, maximum-scale = 0.5");
    } else if ( navigator.userAgent.match(/iPad/i) ) {
        doc.getElementById("viewport").setAttribute("content", "initial-scale = 0.8, maximum-scale = 0.8");
    } else{
    	alert("hop");
    }
}(document));
