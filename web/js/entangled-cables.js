$(function(){

	$(".hidden").removeClass("hidden").fadeOut(0);

	// Keep reference to the actual cable set used
	var cableSet = {
		L: 0,
		R: 0
	}

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
		
		$(".cables .left .numbers li").each(function(i) {
			
			var cableIndex = cables[cableSet.L].L[i];
			var $cable = $(".cables .left .jacks li").eq(cableIndex);

			if( $(this).text() == n ) {
				// Answer is correct
				//console.log("Si la réponse est "+n+", alors il faut débrancher le "+(cableIndex+1)+"e cable de gauche");
				$cable.click(function() {
					$(this).addClass("unplugged"); 
					$(".cables .left .numbers li").eq(i).addClass("unplugged"); 
				});
			} else {
				//Answer is wrong
				electrifyCable($cable);
			}

		});

		$(".cables .right .numbers li").each(function(i) {
			
			var cableIndex = cables[cableSet.L].L[i];
			var $cable = $(".cables .right .jacks li").eq(cableIndex);

			if( $(this).text() == n ){
				// Answer is correct
				//console.log("Si la réponse est "+n+", alors il faut débrancher le "+(cableIndex+1)+"e cable de gauche");
				$cable.click(function(){
					$(this).addClass("unplugged"); 
					$(".cables .right .numbers li").eq(i).addClass("unplugged"); 
				});
			} else {
				//Answer is wrong
				electrifyCable($cable);
			}

		});

	}

	// Picking the wrong cable plays an animation to simulate electric shock
	var electrifyCable = function ($cable) {
		var $d = $('.dialog');
		
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

		$(".cables .numbers li").each(function(i){
			numbers.push($(this).text());
		});

		numbers.shuffle();

		$(".cables .numbers li").each(function(i){
			$(this).text(numbers[i]);
		});

	}

	// pick a random cable set
	var pickRandomCableSet = function() {
		cableSet = {
			L: Math.floor(Math.random() * cables.size()),
			R: Math.floor(Math.random() * cables.size()),
		}

		console.log(cableSet);
		$(".cables .left .cables-img").attr('src', cables[cableSet.L].pics.L);
		$(".cables .right .cables-img").attr('src', cables[cableSet.L].pics.R);
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

	// Count object size
	Object.prototype.size = function() {
		var obj = this;
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
	};

	pickRandomCableSet();
	randomizeCables();
	setCorrectCable(42);
})