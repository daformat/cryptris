$(function(){

    var url = cryptrisSettings.appUrl;

    var  hrefPath = url;


     // Setup sharing urls
    $('#share-tw').attr("href", "https://twitter.com/intent/tweet?text=Jouez contre l’ordinateur pour savoir qui arrivera à décrypter le plus rapidement.&url=" + url);
    $('#share-tw').attr("target", "_blank");

    $('#share-gp').attr('data-contenturl', hrefPath);
    $('#share-gp').attr('data-calltoactionurl', url);

    (function() {
        var po = document.createElement('script'); po.type = 'text/javascript'; po.async = true;
        po.src = 'https://apis.google.com/js/client:plusone.js';
        var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);
    })();

    $('#share-fb').attr('href', 'http://www.facebook.com/sharer.php?s=100&p[url]=' + url + '&p[title]=Cryptris, un jeu sur la cryptographie asymétrique'+'&p[summary]=Jouez contre l’ordinateur pour savoir qui arrivera à décrypter le plus rapidement.');
    $('#share-fb').attr('target', '_blank');
    $('#share-fb').attr('onclick', 'javascript:window.open(\'http://www.facebook.com/sharer.php?s=100&p[url]='
                                     + url 
                                     + '&p[title]=Cryptris, un jeu sur la cryptographie asymétrique' 
                                     + '&p[summary]=Jouez contre l’ordinateur pour savoir qui arrivera à décrypter le plus rapidement.\', \'\', \''
                                     + 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=600,width=600\'); return false;');

    console.log(url);    
})
