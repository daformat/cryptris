$(function(){

	$(".hidden").removeClass("hidden").fadeOut(0);

	var cableSet = {
		L: 0,
		R: 0
	}

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
		}
	}

	var setCorrectCable = function(n){
		
		$(".cables .left .numbers li").each(function(i){
			
			var cableIndex = cables[cableSet.L].L[i];
			var $cable = $(".cables .left .jacks li").eq(cableIndex);

			if( $(this).text() == n ){
				// Answer is correct
				//console.log("Si la réponse est "+n+", alors il faut débrancher le "+(cableIndex+1)+"e cable de gauche");
				$cable.click(function(){
					$(this).addClass("unplugged"); 
					$(".cables .left .numbers li").eq(i).addClass("unplugged"); 
				});
			} else {
				//Answer is wrong
				electrifyCable($cable);
			}

		});

		$(".cables .right .numbers li").each(function(i){
			
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

	var electrifyCable = function ($cable){
		$cable.click(function(){
			var $d = $('.dialog');
			
			$d.jrumble({
				opacity: true,
				opacityMin: .75
			});
			
			$('.wrapper.white').fadeIn(10,function(){$(this).fadeOut()});
			
			$d.trigger('startRumble');
			setTimeout(function(){$d.trigger('stopRumble');}, 700);

		})
	}

	setCorrectCable(42);
})