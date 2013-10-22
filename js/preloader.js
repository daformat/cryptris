function getQuerystring(key, default_) {
  if (default_==null) default_=""; 
  key = key.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
  var regex = new RegExp("[\\?&]"+key+"=([^&#]*)");
  var qs = regex.exec(window.location.href);
  if(qs == null)
    return default_;
  else
    return qs[1];
}

$(document).ready(function() {

    if (getQuerystring('no-preloader', true) === true) {
        /**
         * Declare our main caat director.
         */
        director = new CAAT.Director();

        /**
         * Image assets
         */
        var imgs = getPreloadedImages();

        /**
         * Preload our necessarly images and load the splash screens.
         */
        var time = $.now();
        var preloadImages = new CAAT.Module.Preloader.ImagePreloader().loadImages(
            imgs,
            function on_load(counter, images) {
                if (counter === images.length) {
                    $('#preloader-view').attr('style', 'display: none;');
                    $('#menu-view').attr('style', '');
                    console.debug($.now() - time);
                    director.emptyScenes();
                    director.setImagesCache(images);
                    director.setClear(CAAT.Foundation.Director.CLEAR_ALL);
                    CAAT.loop(60);
                } else {
                    $('#preloader-display').text((counter + 1) + '/' + images.length);
                }
            }
        );
    }
});
