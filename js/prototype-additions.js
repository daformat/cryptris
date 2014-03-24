/**
 *  JS Prototype additions
 *  Should be included before doing anything else
 */

/**
 *  Array shuffle prototype
 *  Randomizes an array
 */

  if(!Array.prototype.shuffle){  
    Array.prototype.shuffle = function() {
      var array = this;

      var currentIndex = array.length,
          temporaryValue,
          randomIndex;

      // While there remains elements to shuffle...
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
  }