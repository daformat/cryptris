$(function(){

    var url         = cryptrisSettings.appUrl,
        hrefPath    = url,
        title       = "Cryptris, un jeu gratuit sur la cryptographie asymétrique",
        text        = "Défiez l’ordinateur pour savoir qui arrivera à décrypter le plus rapidement. De nombreux défis cryptologiques vous attendent, êtes-vous prêts ?",
        preview     = "http://daformat.github.io/cryptris/img/cryptis-social-preview-600x600.png";
        preview_xl  = "http://daformat.github.io/cryptris/img/cryptis-social-preview-1200x630.png";

    /** Setup sharing urls **/

    // twitter
    $('#share-tw').attr("href", "https://twitter.com/intent/tweet?text="+title+"&url=" + url);
    $('#share-tw').attr("target", "_blank");

    // google+
    $('#share-gp').attr('data-contenturl', hrefPath);
    $('#share-gp').attr('data-calltoactionurl', url);
    $('#share-gp').attr('data-prefilltext', 'Venez essayer de batte l’ordinateur en jouant à Cryptris.');
          
    (function() {
        var po = document.createElement('script'); po.type = 'text/javascript'; po.async = true;
        po.src = 'https://apis.google.com/js/client:plusone.js';
        var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);
    })();

    // facebook
    $('#share-fb').attr('onclick', "javascript:window.open('https://www.facebook.com/dialog/feed?&app_id=525890597495827&display" + title + "&description=" + text + "&link=" + url + "&picture=" + preview_xl + "&redirect_uri="+cryptrisSettings.appUrl+"merci.html', '', 'toolbar=0,status=0,width=626,height=436');");

})
