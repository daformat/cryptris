/**
 *  Game assets to be loaded
 */

function getPreloadedImages() {
	var imgs = [];
    imgs.push({id:'logo-board', url: "img/assets/board-assets_03.png"});
    imgs.push({id:'pad-untouched', url: "img/assets/board-assets_35.png"});
    imgs.push({id:'pad-left', url: "img/assets/board-assets_25.png"});
    imgs.push({id:'pad-right', url: "img/assets/board-assets_29.png"});
    imgs.push({id:'pad-up', url: "img/assets/board-assets_34.png"});
    imgs.push({id:'pad-down', url: "img/assets/board-assets_27.png"});
    imgs.push({id:'pause-up', url: "img/assets/board-assets_11.png"});
    imgs.push({id:'pause-down', url: "img/assets/board-assets_16.png"});
    imgs.push({id:'help-up', url: "img/assets/board-assets_13.png"});
    imgs.push({id:'help-down', url: "img/assets/board-assets_18.png"});
    imgs.push({id:'timer', url: "img/assets/board-assets_07.png"});
    imgs.push({id:'left-board', url: "img/assets/left-board-assets_07.png"});
    imgs.push({id:'right-board', url: "img/assets/right-board-assets_07.png"});
    imgs.push({id:'center-board', url: "img/assets/center-board-assets_07.png"});
    imgs.push({id:'triangle-left', url: "img/assets/triangle-left.png"});
    imgs.push({id:'triangle-right', url: "img/assets/triangle-right.png"});
    imgs.push({id:'key-symbol', url: "img/key-symbol.png"});
    imgs.push({id:'icn-mini-ia-enveloppe', url: "img/icn-mini-ia-enveloppe.png.png"});
    imgs.push({id:'icn-mini-ia-padlock-closed', url: "img/icn-mini-ia-padlock-closed.png"});
    imgs.push({id:'icn-mini-ia-padlock-open', url: "img/icn-mini-ia-padlock-open.png"});
    imgs.push({id:'icn-mini-player-enveloppe', url: "img/icn-mini-player-enveloppe.png"});
    imgs.push({id:'icn-mini-player-padlock-closed', url: "img/icn-mini-player-padlock-closed.png"});
    imgs.push({id:'icn-mini-player-padlock-open', url: "img/icn-mini-player-padlock-open.png"});
    
    imgs.push({id:'icn-mini-player-key-symbol', url: "img/key-keychain/key-priv-left.png"});
    imgs.push({id:'icn-mini-player-key-symbol-right', url: "img/key-keychain/key-priv-right.png"});

    imgs.push({id:'icn-mini-ia-key-symbol', url: "img/key-keychain/key-pub-right.png"});
    imgs.push({id:'icn-mini-ia-key-symbol-left', url: "img/key-keychain/key-pub-left.png"});

    imgs.push({id:'keychain-ia', url: "img/key-keychain/key-pub-keychain-right.png"});
    imgs.push({id:'keychain-ia-left', url: "img/key-keychain/key-pub-keychain-left.png"});

    imgs.push({id:'keychain-player', url: "img/key-keychain/key-priv-keychain-left.png"});
    imgs.push({id:'keychain-player-right', url: "img/key-keychain/key-priv-keychain-right.png"});

    imgs.push({id:'key-ia-left', url: "img/key-keychain/key-pub-left.png"});
    imgs.push({id:'key-ia-right', url: "img/key-keychain/key-pub-right.png"});

    imgs.push({id:'keychain-ia-left', url: "img/key-keychain/key-pub-keychain-left.png"});
    imgs.push({id:'keychain-ia-right', url: "img/key-keychain/key-pub-keychain-right.png"});

    imgs.push({id:'gauge0', url: "img/gauge/00.png"});
    imgs.push({id:'gauge1', url: "img/gauge/01.png"});
    imgs.push({id:'gauge2', url: "img/gauge/02.png"});
    imgs.push({id:'gauge3', url: "img/gauge/03.png"});
    imgs.push({id:'gauge4', url: "img/gauge/04.png"});
    imgs.push({id:'gauge5', url: "img/gauge/05.png"});
    imgs.push({id:'gauge6', url: "img/gauge/06.png"});
    imgs.push({id:'spinner', url: "img/assets/spinner.gif"});

    var assets = ["img/apple-touch-startup-image-1536x2008.png",
		"img/icn-facebook-large@2x.png",
		"img/logo-inria-medium-2.png",
		"img/logo-inria-medium-@2x.png",
		"img/icn-mini-ia-padlock-open.png",
		"img/icn-gp@2x.png",
		"img/logo-paris7.png",
		"img/64_000-icon.png",
		"img/entangled-cables-R-01.png",
		"img/avatar-new-message-envelope.png",
		"img/avatar-m.jpg",
		"img/bg-institut.jpg",
		"img/icn-mini-player-enveloppe.png",
		"img/temp-encrypted-message.png",
		"img/fond-board.png",
		"img/icn-mini-ia-enveloppe.png.png",
		"img/entangled-cables-R-04.png",
		"img/logo-ens.png",
		"img/entangled-cables-L-04.png",
		"img/icn-mini-player-padlock-closed.png",
		"img/avatar-new-message-background.jpg",
		"img/apple-touch-startup-image-748x1024.png",
		"img/avatar-new-message.jpg",
		"img/apple-touch-icon-76x76.png",
		"img/icn-arrow-down@2x.png",
		"img/icn-facebook@2x.png",
		"img/icn-space@2x.png",
		"img/icn-facebook-large.png",
		"img/apple-touch-icon-120x120.png",
		"img/entangled-cables-L-02.png",
		"img/icn-arrow-up.png",
		"img/logo-inria-medium@2x.png",
		"img/apple-touch-icon-60x60.png",
		"img/icn-arrow-left@2x.png",
		"img/logo-digital-cuisine-medium@2x.png",
		"img/favicon.ico",
		"img/avatar-new-message-padlock-open.png",
		"img/entangled-cables-L-05.png",
		"img/32_000-icon.png",
		"img/avatar-new-message-padlock-closed.png",
		"img/avatar-chercheuse.jpg",
		"img/icn-facebook.png",
		"img/lcd.png",
		"img/apple-touch-startup-image-320x460.png",
		"img/logo-cryptris-large_@2x.png",
		"img/logo-digital-cuisine-medium-2.png",
		"img/icn-arrow-left.png",
		"img/apple-touch-startup-image-640x920.png",
		"img/rotate-device.png",
		"img/apple-touch-startup-image-768x1004.png",
		"img/apple-touch-icon.png",
		"img/logo-cryptris-large.png",
		"img/icn-arrow-right.png",
		"img/apple-touch-icon-152x152.png",
		"img/key-symbol.png",
		"img/avatar-new-message-decrypted.jpg",
		"img/assets/board-assets_13.png",
		"img/assets/board-assets_16.png",
		"img/assets/board-assets_35.png",
		"img/assets/board-assets_29.png",
		"img/assets/board-assets_03.png",
		"img/assets/board-assets_34.png",
		"img/assets/board-assets_11.png",
		"img/assets/board-assets_25.png",
		"img/assets/triangle-right.png",
		"img/assets/left-board-assets_07.png",
		"img/assets/triangle-left.png",
		"img/assets/center-board-assets_07.png",
		"img/assets/board-assets_27.png",
		"img/assets/right-board-assets_07.png",
		"img/assets/board-assets_07.png",
		"img/assets/board-assets_18.png",
		"img/icn-arrow-up@2x.png",
		"img/icn-mini-player-padlock-open.png",
		"img/triangle-right.png",
		"img/triangle-left.png",
		"img/entangled-cables-R-02.png",
		"img/entangled-cables-R-03.png",
		"img/logo-inria-medium.png",
		"img/icn-gp-large@2x.png",
		"img/icn-twitter.png",
		"img/icn-twitter-large@2x.png",
		"img/logo-inria-pixelated.png",
		"img/apple-touch-icon-57x57.png",
		"img/btn-close.png",
		"img/apple-touch-icon-72x72.png",
		"img/lcd@2x.png",
		"img/apple-touch-startup-image-640x1096.png",
		"img/bg-circuits.png",
		"img/icn-gp.png",
		"img/icn-twitter-large.png",
		"img/entangled-cables-outlet.png",
		"img/icn-mini-player-key-symbol.png",
		"img/icn-space.png",
		"img/icn-arrow-right@2x.png",
		"img/entangled-cables-L-01.png",
		"img/icn-gp-large.png",
		"img/logo-digital-cuisine-medium-2@2x.png",
		"img/logo-capmaths.png",
		"img/apple-touch-icon-114x114.png",
		"img/entangled-cables-R-05.png",
		"img/avatar-new-message-ring.png",
		"img/btn-close@2x.png",
		"img/logo-animath.png",
		"img/icn-twitter@2x.png",
		"img/logo-cryptris-medium.png",
		"img/entangled-cables-jack-R.png",
		"img/icn-arrow-down.png",
		"img/apple-touch-icon-144x144.png",
		"img/icn-mini-ia-padlock-closed.png",
		"img/entangled-cables-jack-L.png",
		"img/entangled-cables-L-03.png",
		"img/apple-touch-startup-image-1496x2048.png",
		"img/icn-mini-ia-key-symbol.png",
		"img/logo-digital-cuisine-medium.png"];

	for (var i = 0; i < assets.length; ++i) {
	    imgs.push({id: assets[i], url: assets[i]});
	}

	return imgs;
}
