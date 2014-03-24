/**
 *	Plugin for the Cryptris entangled cables scenes
 *	@author: Mathieu Jouhet <mathieu@digitalcuisine.fr>
 *	@desc:	Randomizes cable number and images.
 *					Apply electrification behavior to wrong cables.
 *	@dependencies: jQuery
 */

$(function(){

	$(".hidden").removeClass("hidden").hide();

	// Keep reference to the actual cable set used
	var cableSet = {
				L: 0,
				R: 0
			},
			$cableDialog,
			_callback,
			timeouts = [];

	// Cable data
	var cables = {
		0: {
				pics: {
					L: 'img/entangled-cables-L-01.png',
					R: 'img/entangled-cables-R-01.png',
				},
				L: {
					0: 3,
					1: 6,
					2: 5,
					3: 0,
					4: 2,
					5: 1,
					6: 4
				},
				R: {
					0: 3,
					1: 5,
					2: 1,
					3: 2,
					4: 6,
					5: 0,
					6: 4	
				}
			},

		1: {
			pics: {
				L: 'img/entangled-cables-L-02.png',
				R: 'img/entangled-cables-R-02.png',
			},
			L: {
				0: 1,
				1: 4,
				2: 3,
				3: 2,
				4: 0,
				5: 6,
				6: 5	
			},
			R: {
				0: 5,
				1: 4,
				2: 2,
				3: 6,
				4: 0,
				5: 3,
				6: 1
			}
		},

		2: {
			pics: {
				L: 'img/entangled-cables-L-03.png',
				R: 'img/entangled-cables-R-03.png',
			},
			L: {
				0: 5,
				1: 4,
				2: 0,
				3: 3,
				4: 2,
				5: 6,
				6: 1
			},
			R: {
				0: 2,
				1: 4,
				2: 1,
				3: 0,
				4: 6,
				5: 5,
				6: 3
			}
		},

		3: {
			pics: {
				L: 'img/entangled-cables-L-04.png',
				R: 'img/entangled-cables-R-04.png',
			},
			L: {
				0: 6,
				1: 3,
				2: 4,
				3: 1,
				4: 5,
				5: 0,
				6: 2
			},
			R: {
				0: 3,
				1: 5,
				2: 2,
				3: 0,
				4: 6,
				5: 4,
				6: 1
			}
		},

		4: {
			pics: {
				L: 'img/entangled-cables-L-05.png',
				R: 'img/entangled-cables-R-05.png',
			},
			L: {
				0: 5,
				1: 1,
				2: 4,
				3: 6,
				4: 0,
				5: 2,
				6: 3
			},
			R: {
				0: 5,
				1: 2,
				2: 4,
				3: 6,
				4: 1,
				5: 0,
				6: 3
			}
		}
	}

	// Loop through cables and set according behavior
	var setCorrectCable = function(n) {
		var cableIndex, $cableJack;

		$(".left .numbers li", $cableDialog).each(function(i) {
			cableIndex = cables[cableSet.L].L[i];
			$cableJack = $(".left .jacks li", $cableDialog).eq(cableIndex);

			applyCableBehavior($(this), $cableJack, n);

		});

		$(".cables .right .numbers li").each(function(i) {
			cableIndex = cables[cableSet.R].R[i];
			$cableJack = $(".right .jacks li", $cableDialog).eq(cableIndex);

			applyCableBehavior($(this), $cableJack, n, i);

		});

	}

	// Apply cable behavior
	var applyCableBehavior = function ($cableNumber, $cableJack, n, i){

		if( $cableNumber.text() == n ) {
			// Answer is correct
			$cableJack.click(function() {
				clearTimeouts();
				
				$cableNumber.toggleClass("unplugged"); 
				$cableJack.toggleClass("unplugged"); 

				if(_callback && typeof(_callback === "function" ))
					timeouts.push(setTimeout(function(){
						_callback();
					}, 1000));

			});
		} else {

			//Answer is wrong, or every cable is set to be electrified
			electrifyCable($cableJack, (n == null ? true : false));
		}

	}

	// Picking the wrong cable plays an animation to simulate an electric shock
	var electrifyCable = function ($cable, callbackOnClick) {
		var $d = $cableDialog;
		
		$d.jrumble({
			opacity: true,
			opacityMin: .75
		});

		$cable.click(function(){
			clearTimeouts();

			$('.wrapper.white').fadeIn(10,function(){$(this).fadeOut()});
			
			$d.trigger('startRumble');
			timeouts.push(setTimeout(function(){
				$d.trigger('stopRumble');

				if( callbackOnClick == true ) {

					if(_callback && typeof(_callback === "function" ))
						timeouts.push(setTimeout(function(){
							_callback();
						}, 1000));

				}

			}, 700));

		})
	}

	// shuffle cable position
	var randomizeCables = function() {
		var numbers = [];

		$(".numbers li", $cableDialog).each(function(i){
			numbers.push($(this).text());
		});

		numbers.shuffle();

		$(".numbers li", $cableDialog).each(function(i){
			$(this).text(numbers[i]);
		});

	}

	// pick a random cable set
	var pickRandomCableSet = function() {
		cableSet = {
			L: Math.floor(Math.random() * objectsize(cables)),
			R: Math.floor(Math.random() * objectsize(cables)),
		}

		$(".left .cables-img", $cableDialog).attr('src', cables[cableSet.L].pics.L);
		$(".right .cables-img", $cableDialog).attr('src', cables[cableSet.R].pics.R);
	}

	// Count object size (kept out of Object prototype to avoid jquery mess)
	var objectsize = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
	};

	// clear timeouts to prevent mess
	var clearTimeouts = function () {
		$.each(timeouts, function(i){
			clearTimeout(timeouts[i])
		});

		timeouts = [];
	}

	// correctCable: Numeric label of the correct cable
	// callback: fired when correct cable is unplugged
	$.fn.prepareCables = function(correctCable, callback){
		$cableDialog = this;
		_callback = callback;

		pickRandomCableSet();
		randomizeCables();
		setCorrectCable(correctCable);
	}
})