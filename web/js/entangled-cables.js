$(function(){

	$(".hidden").removeClass("hidden").hide();

	// Keep reference to the actual cable set used
	var cableSet = {
				L: 0,
				R: 0
			},
			$cableDialog;

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
					0: 2,
					1: 5,
					2: 4,
					3: 6,
					4: 1,
					5: 0,
					6: 3	
				}
		},
		1: {
				pics: {
					L: 'img/entangled-cables-L-02.png',
					R: 'img/entangled-cables-R-02.png',
				},
				L: {
					0: 2,
					1: 5,
					2: 4,
					3: 6,
					4: 1,
					5: 0,
					6: 3
				},
				R: {	
					0: 3,
					1: 6,
					2: 5,
					3: 0,
					4: 2,
					5: 1,
					6: 4					
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
				$cableNumber.toggleClass("unplugged"); 
				$cableJack.toggleClass("unplugged"); 
			});
		} else {
			//Answer is wrong
			electrifyCable($cableJack);
		}

	}

	// Picking the wrong cable plays an animation to simulate an electric shock
	var electrifyCable = function ($cable) {
		var $d = $cableDialog;
		
		$d.jrumble({
			opacity: true,
			opacityMin: .75
		});

		$cable.click(function(){
			
			$('.wrapper.white').fadeIn(10,function(){$(this).fadeOut()});
			
			$d.trigger('startRumble');
			setTimeout(function(){$d.trigger('stopRumble');}, 700);

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

	// Shuffle array
	Array.prototype.shuffle = function() {
		var array = this;

	  var currentIndex = array.length
	    , temporaryValue
	    , randomIndex
	    ;

	  // While there remain elements to shuffle...
	  while (0 !== currentIndex) {

	    // Pick a remaining element...
	    randomIndex = Math.floor(Math.random() * currentIndex);
	    currentIndex -= 1;

	    // And swap it with the current element.
	    temporaryValue = array[currentIndex];
	    array[currentIndex] = array[randomIndex];
	    array[randomIndex] = temporaryValue;
	  }

	  return array;
	}

	// Count object size (kept out of Object prototype to avoid jquery mess)
	var objectsize = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
	};

	// Need to be refactored ?
	$.fn.prepareCables = function(correctCable){
		$cableDialog = this;

		pickRandomCableSet();
		randomizeCables();
		setCorrectCable(correctCable);
	}
})