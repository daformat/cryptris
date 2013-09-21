$(function(){

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
			if( $(this).text() == n ){
				console.log("Si la réponse est "+n+", alors il faut débrancher le "+(cables[cableSet.L].L[i]+1)+"e cable de gauche");
				$(".cables .left .jacks li").eq(cables[cableSet.L].L[i]).click(function(){alert('Bravo')});
				
			}
		})

		$(".cables .right li").each(function(i){
			if( $(this).text() == n ){
				console.log("Si la réponse est "+n+", alors il faut débrancher le "+(cables[cableSet.R].R[i]+1)+"e cable de droite");
				$(".cables .left .jacks li").eq(cables[cableSet.R].R[i]).click(function(){alert('Bravo')});
			}
		})

	}

	setCorrectCable(42);
})