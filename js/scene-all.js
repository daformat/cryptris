
var cryptrisSettings = {
    cryptoExplanations: [false, false, false],
    dialogWhatArePrivatePublicKey: [false, false, false]
}

$(function() {

  function specialOutInterpolator() {
    this.getPosition = function(time) {
      return {'x' : time, 'y' : 0};
    }
  }

  function specialInInterpolator() {
    this.getPosition = function(time) {
      return {'x' : time, 'y' : 1};
    }
  }

  function activateHelp(dataScene, hookName, helpFunction) {
    if (dataScene.scene.isPaused() === false) {
      dataScene.scene.setPaused(true);
      dataScene.needStopPaused = true;
    } else {
      dataScene.needStopPaused = false;
    }
    currentGame[hookName] = false;
    helpFunction();
  }

  function deActivateHelp(dataScene, hookName) {
    $("body").closeAllDialogs(function() {});

    // Relaunch the board if necessary.
    if (dataScene.needStopPaused === true) {
      dataScene.scene.setPaused(false);
    }
    dataScene.needStopPaused = null;
    currentGame[hookName] = true;
  }

  $(document).on("helpCreateKeyEvent", function() {
    activateHelp(currentGame.scenes.create_key_scene, "createKeySceneActive", helpCreateKey);
  });

  $(document).on("playChercheuseHelpEvent", function() {
    activateHelp(currentGame.scenes.play_chercheuse_scene, "playChercheuseSceneActive", helpPlayChercheuse);
  });

  $(document).on("playSoloHelpEvent", function() {
    activateHelp(currentGame.scenes.play_solo_scene, "playSoloSceneActive", helpPlaySolo);
  });

  $(document).on("playMinHelpEvent", function() {
    activateHelp(currentGame.scenes.play_min_scene, "playMinSceneActive", helpPlayMin);
  });

  $(document).on("playMediumHelpEvent", function() {
    activateHelp(currentGame.scenes.play_medium_scene, "playMediumSceneActive", helpPlayMedium);
  });

  $(document).on("playMaxHelpEvent", function() {
    activateHelp(currentGame.scenes.play_max_scene, "playMaxSceneActive", helpPlayMax);
  });



  function activatePause(dataScene, hookName, pauseFunction) {
    if (dataScene.scene.isPaused() === false) {
      dataScene.scene.setPaused(true);
      dataScene.needStopPaused = true;
    } else {
      dataScene.needStopPaused = false;
    }
    currentGame[hookName] = false;
    pauseFunction();
  }

  function deActivatePause(dataScene, hookName) {
    $("body").closeAllDialogs(function() {});

    // Relaunch the board if necessary.
    if (dataScene.needStopPaused === true) {
      dataScene.scene.setPaused(false);
    }
    dataScene.needStopPaused = null;
    currentGame[hookName] = true;
  }

  $(document).on("pauseCreateKeyEvent", function() {
    activatePause(currentGame.scenes.create_key_scene, "createKeySceneActive", pauseCreateKey);
  });

  $(document).on("playChercheusePauseEvent", function() {
    activatePause(currentGame.scenes.play_chercheuse_scene, "playChercheuseSceneActive", pausePlayChercheuse);
  });

  $(document).on("playSoloPauseEvent", function() {
    activatePause(currentGame.scenes.play_solo_scene, "playSoloSceneActive", pausePlaySolo);
  });

  $(document).on("playMinPauseEvent", function() {
    activatePause(currentGame.scenes.play_min_scene, "playMinSceneActive", pausePlayMin);
  });

  $(document).on("playMediumPauseEvent", function() {
    activatePause(currentGame.scenes.play_medium_scene, "playMediumSceneActive", pausePlayMedium);
  });

  $(document).on("playMaxPauseEvent", function() {
    activatePause(currentGame.scenes.play_max_scene, "playMaxSceneActive", pausePlayMax);
  });



  function switchToCreateKey() {
    $("body").closeAllDialogs();
    // Enable the action on the key.
    currentGame.createKeySceneActive = true;

    var waitToContinue = currentGame.director.createTimer(currentGame.director.time, Number.MAX_VALUE, null,
      function(time, ttime, timerTask) {
        if (currentGame.scenes.create_key_scene.game_box.crypt_key.numberApplied === currentGame.maxNewKeyMove) {
          waitToContinue.cancel();
          currentGame.createKeySceneActive = false;
          $(document).trigger('nextDialog');
        }
      }
    );
  }

  function switchToFinishCreateKey() {
    $("body").closeAllDialogs();
    // Launch the ia.
    currentGame.scenes.create_key_scene.game_box.boxOption.timeInfo = createKeyIASceneTime;

    if (score(currentGame.scenes.create_key_scene.game_box.message.getNumbers()) < 2) {
      ia_create_pk(currentGame.scenes.create_key_scene.scene, currentGame.scenes.create_key_scene.game_box, true);
    } else {
      ia_create_pk(currentGame.scenes.create_key_scene.scene, currentGame.scenes.create_key_scene.game_box, false);
    }

    var waitToContinue = currentGame.director.createTimer(currentGame.director.time, Number.MAX_VALUE, null,
      function(time, ttime, timerTask) {
        if (currentGame.goToNextDialog === true) {
          waitToContinue.cancel();
          currentGame.goToNextDialog = false;
          currentGame.createKeySceneActive = false;

          // Disable the action on the key.
          setTimeout(function() {
            currentGame.director.easeInOut(currentGame.director.getSceneIndex(currentGame.scenes.waiting_scene), CAAT.Foundation.Scene.prototype.EASE_SCALE, CAAT.Foundation.Actor.ANCHOR_CENTER,
                                           currentGame.director.getSceneIndex(currentGame.scenes.create_key_scene.scene), CAAT.Foundation.Scene.prototype.EASE_SCALE, CAAT.Foundation.Actor.ANCHOR_CENTER, transitionTime, true,
                                           new specialInInterpolator(), new specialOutInterpolator());
            $(document).trigger('nextDialog');
            currentGame.dontShowKey = false;
          }, 2000);
        }
      }
    );
  }

  $.goToBattleScene = goToBattleScene;
  var currentGameOverData = null;

  function stopGameOver() {
    var saveScene = currentGame.scenes[currentGameOverData.sceneName].scene;
    goToBattleScene(currentGameOverData.sceneName, currentGameOverData.onDecrypt, currentGameOverData.sizeBoard, currentGameOverData.hookName, currentGameOverData.withIaBoard, currentGameOverData.timeInfo, currentGameOverData.message, currentGameOverData.helpEvent, currentGameOverData.timeout);
    saveScene.setExpired(true);
    $("body").closeAllDialogs(function() {});
    currentGame.scenes[currentGameOverData.sceneName].scene.setPaused(false);
    currentGame.scenes[currentGameOverData.sceneName].add_key_symbol(currentGame.director, currentGame.scenes[currentGameOverData.sceneName]);
    currentGame[currentGameOverData.hookName] = true;
    currentGame.iaPlay = true;
  }

  function goToBattleScene(sceneName, onDecrypt, sizeBoard, hookName, withIaBoard, timeInfo, message, helpEvent, pauseEvent, timeout) {

    // Prepare the sceneName and set it as the current scene.
    preparePlayScene(currentGame.director, sizeBoard, sceneName, message, hookName, withIaBoard, helpEvent, pauseEvent);
    currentGame.iaPlay = false;
    currentGame[hookName] = false;
    currentGame.gameOver = false;
    currentGame.tooManyBlocksInAColumn = false;

    currentGame.director.currentScene.setPaused(false);
    currentGame.director.easeInOut(currentGame.director.getSceneIndex(currentGame.scenes[sceneName].scene), CAAT.Foundation.Scene.prototype.EASE_SCALE, CAAT.Foundation.Actor.ANCHOR_CENTER,
                                   currentGame.director.getSceneIndex(currentGame.director.currentScene), CAAT.Foundation.Scene.prototype.EASE_SCALE, CAAT.Foundation.Actor.ANCHOR_CENTER, transitionTime, true,
                                   new specialInInterpolator(), new specialOutInterpolator());
        
    setTimeout(function() {currentGame.scenes[sceneName].add_key_symbol(currentGame.director, currentGame.scenes[sceneName])}, 500);

    // set the speed of this scene.
    timeInfo && withIaBoard ? currentGame.scenes[sceneName].rival_box.boxOption.timeInfo = timeInfo : null;

    // Create a timer to catch the moment we have to go to the next scene.
    var waitToContinue = currentGame.director.createTimer(currentGame.director.time, Number.MAX_VALUE, null,
      function(time, ttime, timerTask) {
        if (currentGame.goToNextDialog === true) {
          waitToContinue.cancel();
          currentGame.goToNextDialog = false;
          if (onDecrypt === null) {
            onDecrypt = function() {
              $(document).trigger('nextDialog');
            }
          }
          timeout ? setTimeout(onDecrypt, timeout) : onDecrypt();
        }
        if (currentGame.gameOver === true || currentGame.tooManyBlocksInAColumn === true) {
          waitToContinue.cancel();
          currentGame.scenes[sceneName].scene.setPaused(true);
          currentGame[hookName] = false;

          currentGameOverData = {
            'sceneName' : sceneName,
            'onDecrypt' : onDecrypt,
            'sizeBoard' : sizeBoard,
            'hookName' : hookName,
            'withIaBoard' : withIaBoard,
            'timeInfo' : timeInfo,
            'message' : message,
            'helpEvent' : helpEvent,
            'timeout' : timeout
          };
          if (currentGame.gameOver === true) {
            gameOver();
          } else if (currentGame.tooManyBlocksInAColumn === true) {
            tooManyBlocks();
          }
          currentGame.gameOver = false;
          currentGame.tooManyBlocksInAColumn = false;
        }
      }
    );
  }

  function playChercheuse() {
    $("body").closeAllDialogs(function() {});
    currentGame.scenes.play_chercheuse_scene.scene.setPaused(false);

    var gameBox = currentGame.scenes.play_chercheuse_scene.game_box;
    var key = gameBox.crypt_key;
    var message = gameBox.message;
    var ia = new IA(currentGame.scenes.play_chercheuse_scene.scene, key, message, gameBox.boxOption);
    ia.moveList = currentGame.animateEncryptionMove;
    ia.startIA();

    currentGame.iaPlay = true;

    var chercheuseAnimateTimer = currentGame.scenes.play_chercheuse_scene.scene.createTimer(0, Number.MAX_VALUE, null,
      function(time, ttime, timerTask) {
        if (ia.moveList.length === 0 && key.keyInMove === false && key.keyFirstMove === false) {
          chercheuseAnimateTimer.cancel();
          currentGame.scenes.play_chercheuse_scene.game_box.closePadlock();
          $(document).trigger('endAnimate');
          setTimeout(function() { $(document).trigger('nextDialog') }, 4000);
        }
      }
    );
  }

  function activatePlaySolo() {
    $("body").closeAllDialogs(function() {});
    currentGame.scenes.play_solo_scene.scene.setPaused(false);
    currentGame.playSoloSceneActive = true;
  }

  function playLevel1() {
    $("body").closeAllDialogs(function() {
      // Active input for play_min_scene
      currentGame.iaPlay = true;
      currentGame.scenes.play_min_scene.scene.setPaused(false);
      currentGame.playMinSceneActive = true;
    });
  }

  function playLevel2() {
    $("body").closeAllDialogs(function() {
      $.switchWrapper('#bg-circuits', function() {
        // Display the battle scene in background.
        goToBattleScene('play_medium_scene', null, MEDIUM_BOARD_LENGTH, 'playMediumSceneActive', true, false, currentGame.play_medium_scene_msg, 'playMediumHelpEvent', 'playMediumPauseEvent');
        
        // Active input for play_medium_scene
        currentGame.iaPlay = true;
        currentGame.scenes.play_medium_scene.scene.setPaused(false);
        currentGame.playMediumSceneActive = true;
        currentGame.scenes.play_medium_scene.add_key_symbol(currentGame.director, currentGame.scenes.play_medium_scene);
      });
    });
  }

  function playLevel3() {
    $("body").closeAllDialogs(function() {          
      $.switchWrapper('#bg-circuits', function() {
        // Display the battle scene in background.
        goToBattleScene('play_max_scene', null, MAX_BOARD_LENGTH, 'playMaxSceneActive', true, false, currentGame.play_max_scene_msg, 'playMaxHelpEvent', 'playMaxPauseEvent');
        
        // Active input for play_max_scene
        currentGame.iaPlay = true;
        currentGame.scenes.play_max_scene.scene.setPaused(false);
        currentGame.playMaxSceneActive = true;
        currentGame.scenes.play_max_scene.add_key_symbol(currentGame.director, currentGame.scenes.play_max_scene);
      });
    });
  }

  function createChart() {
    // define dimensions of graph
    var m = [20, 25, 45, 130]; // margins
    var w = 355 - m[1] - m[3]; // width
    var h = 350 - m[0] - m[2]; // height
                    
    var dataIAInitial = [{x: 8, y: 0}, {x: 9, y: 0}, {x: 10, y: 0}, {x: 11, y: 0}, {x: 12, y: 0}];
    var dataIA = [{x: 8, y: 131072 * 3.75}, {x: 9, y: 524288 * 3.2}, {x: 10, y: 2097152 * 1.7}, {x: 11, y: 8388608 * 1.2}, {x: 12, y: 33554432}];
    var dataPlayerInitial = [{x: 8, y: 0}, {x: 10, y: 0}, {x: 12, y: 0}];
    var dataPlayer = [{x: 8, y: 120/2}, {x: 10, y: 240/2}, {x: 12, y: 360/2}];      

    // X scale will fit all values from data[] within pixels 0-w
    var x = d3.scale.linear().domain([8, 12]).range([0, w]);

    // Y scale will fit values from 0-10 within pixels h-0 (Note the inverted domain for the y-scale: bigger is up!)
    var y = d3.scale.linear().range([h, 0]).domain([60, dataPlayer[2].y*1.3]);

    var div = d3.select("body").append("div").attr("class", "tooltip").style("opacity", 0);

    var options = {m: m, w: w, h: h, x: x, y: y, div: div };

    // Add an SVG element with the desired dimensions and margin.
    var graph = d3.select("#graph").append("svg:svg").attr("width", w + m[1] + m[3]).attr("height", h + m[0] + m[2]).append("svg:g").attr("transform", "translate(" + m[3] + "," + m[0] + ")");

    options.name = currentGame.username;

    populateChart(graph, dataPlayer, dataPlayerInitial, 'player', options);

    var graph2 = d3.select("#graph").append("svg:svg").attr("width", w + m[1] + m[3]).attr("height", h + m[0] + m[2]).append("svg:g").attr("transform", "translate(" + m[3] + "," + m[0] + ")");

    y = d3.scale.linear().range([h, 0]).domain([0, dataIA[4].y]);

    options.y = y;
    options.name = 'Serveur';

    populateChart(graph2, dataIA, dataIAInitial, 'ia', options);
  }
  
  function populateChart(graph, dataSet, dataInitial, appendClass, options) {
    var m = options.m;
    var w = options.w;
    var h = options.h;
    var x = options.x;
    var y = options.y;
    var div = options.div;
    var name = options.name;

    var zoom = d3.behavior.zoom().x(y).y(y).scaleExtent([0.001, 200]).on("zoom", zoomed);

    function zoomed() {

      var trans = zoom.translate(),
          scale = zoom.scale();

      tx = Math.min(0, Math.max(w * (1 - scale), trans[0]));
      ty = Math.min(0, Math.max(h * (1 - scale), trans[1]));

      zoom.translate([tx, ty]);

      graph.select(".x.axis").call(xAxis);
      graph.select(".y.axis").call(yAxis);
      graph.select("path.line."+appendClass).attr("d", line(dataSet));
      graph.selectAll("circle."+appendClass).attr("cy",  function(d, i) { return y(dataSet[i].y); });
    }

    graph.call(zoom);

    // create a line function that can convert data[] into x and y points
    var line = d3.svg.line()
                  // assign the X function to plot our line as we wish
                  .x(function(d,i) { 
                      // return the X coordinate where we want to plot this datapoint
                      return x(d.x); 
                    })
                  .y(function(d, i) { 
                    // return the Y coordinate where we want to plot this datapoint
                    return y(d.y); 
                  }).interpolate("cardinal");

    var formatTime = d3.time.format("%Hh %Mm %Ss"),
        formatSeconds = function(d) {
                          var sign = (d<0 ? "-" : "");
                          d = Math.abs(d);
                          var sec_num = parseInt(d, 10); // don't forget the second parm
                          var days   =  Math.floor(sec_num / 86400);
                          var hours   = Math.floor((sec_num - (days * 86400)) / 3600);
                          var minutes = Math.floor((sec_num - (days * 86400 + hours * 3600)) / 60);
                          var seconds = sec_num - (days * 86400 + hours * 3600) - (minutes * 60);

                          if (hours   < 10) { hours   = "0"+hours; }
                          if (minutes < 10) { minutes = "0"+minutes; }
                          if (seconds < 10) { seconds = "0"+seconds; }


                          var time    = sign + (days>0 ? days+'j ' : '' ) + (days>10 ? '' : (hours == "00" ? "": hours)+(days>0 ? (hours == "00" ? "": "h ") : (hours == "00" ? "": "h ")+minutes+'m '+seconds+ 's'));
                          return ( d == 0 ? '0' : time);
                        };

    graph.append("rect").attr("x", 0-20).attr("y", 0-20).attr("width", w+20).attr("height", h+40).attr("fill", "#93bcd7");
    graph.append("clipPath").attr("id", "clip").append("rect").attr("x", -15).attr("y", -15).attr("width", w+35).attr("height", h+25);

    var clip = d3.select("clip");

    // create xAxis
    var xAxis = d3.svg.axis().scale(x).ticks(3).tickSize(10).tickSubdivide(false);
    // Add the x-axis.
    graph.append("svg:g").attr("class", "x axis").attr("transform", "translate(0," + h + ")").call(xAxis);

    // create left yAxis
    var yAxis = d3.svg.axis().scale(y).ticks(4).tickSize(-w - m[1]).tickFormat(formatSeconds).orient("left");
    // Add the y-axis to the left
    graph.append("svg:g").attr("class", "y axis").attr("transform", "translate(-25,0)").call(yAxis);
    graph.append("text").attr("class", "x label").attr("text-anchor", "end").attr("x", w+10).attr("y", h + m[2]-6).text("Taille de la clé (blocs)");

    graph.append("text").attr("class", "y label").attr("text-anchor", "end").attr("y", 6).attr("dy", ".75em").attr("transform", "rotate(-90) translate(0, -100)").text("Durée du décryptage (" + name + ")");                        

    // Add the line by appending an svg:path element with the data line we created above
    // do this AFTER the axes above so that the line is above the tick-lines
    graph.append("svg:path").attr('class', 'line '+appendClass).attr("d", line(dataInitial)).transition().duration(500).attr("d", line(dataSet)).attr("clip-path", "url(#clip)");

    // draw dots
    var circles = graph.selectAll("dot")    
                        .data(dataInitial)         
                        .enter().append("circle")
                        .attr("class", appendClass)
                        .attr("r", 5)       
                        .attr("cx", function(d) { return x(d.x); })       
                        .attr("cy", function(d) { return y(d.y); }) 
                        .attr("clip-path", "url(#clip)")    
                        .on("mouseover", function(d, i) {
                                            d3.select(this).transition().duration(100).ease("quad-in-out").attr("r", 10);
                                            div.transition()        
                                               .duration(200)      
                                               .style("opacity", .9)
                                            div.html("<strong>"+name+"</strong><br/>Taille de la clé : "+d.x+" blocs" + "<br/>Durée (maximale) de décryptage : "  + formatSeconds(parseInt(dataSet[i].y) ) )  
                                               .style("left", (d3.event.pageX+15) + "px")     
                                               .style("top", (d3.event.pageY - 28) + "px");    
                                          })                  
                        .on("mouseout", function(d) {       
                                          d3.select(this).transition().duration(100).ease("quad-in-out").attr("r", 5);
                                          div.transition()        
                                             .duration(500)      
                                             .style("opacity", 0);   
                                        });         
    circles.transition().duration(500).attr("cy",  function(d, i) { return y(dataSet[i].y); });

    $('.dialog.graph .content').append($('<div class="label '+appendClass+'"><h2>'+name+'</h2></div>'))
  }

  var game = cryptrisSettings;
  var transitionTime = 1000;

  // -- Hide .hidden elements and remove class.
  $('.hidden').hide().removeClass('hidden');

  function gameOver() {
    $("body").closeAllDialogs(function() {
      $.switchWrapper('#bg-circuits', function() {
        $(".wrapper.active .vertical-centering").dialog(gameOverDialog);
      });
    });
  }

  function tooManyBlocks() {
    $("body").closeAllDialogs(function() {
      $.switchWrapper('#bg-circuits', function() {
        $(".wrapper.active .vertical-centering").dialog(tooManyBlocksDialog);
      });
    });
  }

  function intro() {
    // -- Make sure prompt is empty.
    $('.prompt .content').text('');

    // -- Launch the welcome dialog.
    $("body").closeAllDialogs(function() { 
      firstPrompt();
    });
  }

  function switchToNewLogin() {
    $("body").closeAllDialogs(function() {
      $.switchWrapper('#new-login', function() {
        $('#login-name').focus();

        $('.new-login').submit(function(e) {
          currentGame.litteralName = $('#login-name').val();
          currentGame.username = currentGame.litteralName !== "" ? currentGame.litteralName : 'Joueur';
          updateNameFunction();
          /*
          $.switchWrapper('#bg-institut', accountCreated);
          */
          $(document).trigger('nextDialog');
          $('#login-name').blur();
          $('.new-login').unbind('submit').submit(function(e) {
            return false;
          });
          return false;
        });
      });
    });
  }

  function cryptoExplanationsOpt1() {
    game.cryptoExplanations[0] = true;
    $("body").closeAllDialogs(function() {   
      $.switchWrapper('#bg-institut', function() {
        $(".wrapper.active .vertical-centering").dialog(cryptoExplanationsOpt1Dialog);   
      });
    });
  }

  function cryptoExplanationsOpt2() {
    game.cryptoExplanations[1] = true;
    $("body").closeAllDialogs(function() {
      $.switchWrapper('#bg-institut', function() {
        $(".wrapper.active .vertical-centering").dialog(cryptoExplanationsOpt2Dialog);
      });
    });
  }

  function goingToCreakeKeys() {
    game.cryptoExplanations[2] = true;
  }

  function dialogWhatArePrivatePublicKeyOpt1() {
    game.dialogWhatArePrivatePublicKey[0] = true;
    $("body").closeAllDialogs(function() {
      $.switchWrapper('#bg-institut', function() {
        $(".wrapper.active .vertical-centering").dialog(keysExplanationsOpt1Dialog);   
      });
    });
  }   

  function dialogWhatArePrivatePublicKeyOpt2() {
    game.dialogWhatArePrivatePublicKey[1] = true;
    $("body").closeAllDialogs(function() {
      $.switchWrapper('#bg-institut', function() {
        $(".wrapper.active .vertical-centering").dialog(keysExplanationsOpt2Dialog);   
      });
    });
  }       

  function hereYourPrivateKey() {
    game.dialogWhatArePrivatePublicKey[2] = true;
    // Set the createKeyScene as the current scene.
    currentGame.director.easeInOut(
                                  currentGame.director.getSceneIndex(currentGame.scenes.create_key_scene.scene),
                                  CAAT.Foundation.Scene.prototype.EASE_SCALE, CAAT.Foundation.Actor.ANCHOR_CENTER,
                                  currentGame.director.getSceneIndex(currentGame.director.currentScene),
                                  CAAT.Foundation.Scene.prototype.EASE_SCALE,
                                  CAAT.Foundation.Actor.ANCHOR_CENTER,
                                  transitionTime,
                                  true,
                                  new specialInInterpolator(),
                                  new specialOutInterpolator()
    );
    currentGame.scenes['create_key_scene'].add_key_symbol(currentGame.director, currentGame.scenes['create_key_scene']);
  }

  function helpCreateKey() {
    $("body").closeAllDialogs(function() {
      $.switchWrapper('#bg-circuits', function() {
        $(".wrapper.active .vertical-centering").dialog(helpCreateKeyDialog);
      });
    });
  }  

  function pauseCreateKey() {
    $("body").closeAllDialogs(function() {
      $.switchWrapper('#bg-circuits', function() {
        $(".wrapper.active .vertical-centering").dialog(pauseCreateKeyDialog);
      });
    });
  }

  function keyPreGeneratedUpdateText() {
    if (score(currentGame.scenes.create_key_scene.game_box.message.getNumbers()) < 2) {
      keyPreGeneratedDialog['content'] = keyPreGeneratedErrorText;
    }
  }

  function wellDone() {
    currentGame.director.currentScene.setPaused(false);
    currentGame.director.easeInOut(currentGame.director.getSceneIndex(currentGame.scenes.waiting_scene), CAAT.Foundation.Scene.prototype.EASE_SCALE, CAAT.Foundation.Actor.ANCHOR_CENTER,
                                  currentGame.director.getSceneIndex(currentGame.director.currentScene), CAAT.Foundation.Scene.prototype.EASE_SCALE, CAAT.Foundation.Actor.ANCHOR_CENTER, transitionTime, true,
                                  new specialInInterpolator(), new specialOutInterpolator());
  }


  function letsGoToEncrypt() {
    // Change our player name for 'Chercheuse';
    currentGame.saveUsername = currentGame.username;
    currentGame.username = "Chercheuse";

    // Prepare the tutorial message
    currentGame.play_solo_scene_msg = createMessageForPlayScene(MIN_BOARD_LENGTH, FIRST_MESSAGE);
    // Set the tutorial message to the dialog box.
    addInteractiveContentToDialog(firstMessageDialog, board_message_to_string(currentGame.play_solo_scene_msg.plain_message));

    // Prepare the sceneName and set it as the current scene.
    var sceneName = 'play_chercheuse_scene';
    var hookName = 'playChercheuseSceneActive';
    prepareAnimatePlayScene(currentGame.director, MIN_BOARD_LENGTH, 'play_chercheuse_scene', createMessageForAnimateEncryption(MIN_BOARD_LENGTH, FIRST_MESSAGE), 'playChercheuseSceneActive', false, 'helpPlayChercheuse', 'pausePlayChercheuse');
    currentGame.scenes[sceneName].game_box.changeToAnimateEncryption();
    currentGame.iaPlay = false;
    currentGame[hookName] = false;
    currentGame.gameOver = false;
    currentGame.tooManyBlocksInAColumn = false;

    currentGame.director.currentScene.setPaused(false);
    currentGame.director.easeInOut(currentGame.director.getSceneIndex(currentGame.scenes[sceneName].scene), CAAT.Foundation.Scene.prototype.EASE_SCALE, CAAT.Foundation.Actor.ANCHOR_CENTER,
                                     currentGame.director.getSceneIndex(currentGame.director.currentScene), CAAT.Foundation.Scene.prototype.EASE_SCALE, CAAT.Foundation.Actor.ANCHOR_CENTER, transitionTime, true,
                                     new specialInInterpolator(), new specialOutInterpolator()
    );
        
    setTimeout(function() { currentGame.scenes[sceneName].add_key_symbol(currentGame.director, currentGame.scenes[sceneName]); }, 500);
  }

  function helpPlayChercheuse() {
    $("body").closeAllDialogs(function() {
      $.switchWrapper('#bg-circuits', function() {
        $(".wrapper.active .vertical-centering").dialog(helpPlayChercheuseDialog);
      });
    });
  }

  function pausePlayChercheuse() {
    $("body").closeAllDialogs(function() {
      $.switchWrapper('#bg-circuits', function() {
        $(".wrapper.active .vertical-centering").dialog(pausePlayChercheuseDialog);
      });
    });
  }

  function helpPlaySolo() {
    $("body").closeAllDialogs(function() {
      $.switchWrapper('#bg-circuits', function() {
        $(".wrapper.active .vertical-centering").dialog(helpPlaySoloDialog);
      });
    });
  }

  function helpPlaySolo2() {
    $("body").closeAllDialogs(function() {
      $.switchWrapper('#bg-circuits', function() {
        $(".wrapper.active .vertical-centering").dialog(helpPlaySolo2Dialog);
      });
    });
  }

  function pausePlaySolo() {
    $("body").closeAllDialogs(function() {
      $.switchWrapper('#bg-circuits', function() {
        $(".wrapper.active .vertical-centering").dialog(pausePlaySoloDialog);
      });
    });
  }

  var testMessageTest = true;
  function messageTest() {
    if (testMessageTest === true) {
      testMessageTest = false;
      // Display the battle scene in background.
      currentGame.username = currentGame.saveUsername;
      goToBattleScene('play_solo_scene', null, MIN_BOARD_LENGTH, 'playSoloSceneActive', false, false, currentGame.play_solo_scene_msg, 'playSoloHelpEvent', 'playSoloPauseEvent', 4000);
    }
  }

  function tutorial() {
    // Launch the timer and display private key.
    currentGame.scenes.play_solo_scene.add_key_symbol(currentGame.director, currentGame.scenes.play_solo_scene);
  }

  function congratulationsOnCompletingTutorial() {
    // Disable the action on the key and switch to the waiting scene.
    currentGame.playSoloSceneActive = false;
    currentGame.director.switchToScene(currentGame.director.getSceneIndex(currentGame.scenes['waiting_scene']), transitionTime, true, false);
  }

  function cables0() {
    $('.cables').prepareCables(null, function() { $(document).trigger('nextDialog'); });
  }

  function encryptedFirstCable() {
    // Prepare the first battle message
    currentGame.play_min_scene_msg = createMessageForPlayScene(MIN_BOARD_LENGTH, FIRST_BATTLE_MESSAGE);
    
    // Set the first battle message to the dialog box.
    addInteractiveContentToDialog(firstBattleMessageDialog, (function(){
                    var t = board_message_to_string(currentGame.play_min_scene_msg.plain_message),
                        a = t.split(' '),
                        o = '';

                        for (var i = 0; i<a.length; i++) {
                            if(a[i] != '') o += "<span class='letter-block crypted crypted-message'>"+a[i]+"</span>";
                        }

                        return o;
                }()));
  }

  function helpPlayMin() {
    $("body").closeAllDialogs(function() {
      $.switchWrapper('#bg-circuits', function() {
        $(".wrapper.active .vertical-centering").dialog(helpPlayMinDialog);
      });
    });
  }

  function helpPlayMin2() {
    $("body").closeAllDialogs(function() {
      $.switchWrapper('#bg-circuits', function() {
        $(".wrapper.active .vertical-centering").dialog(helpPlayMin2Dialog);
      });
    });
  }

  function pausePlayMin() {
    $("body").closeAllDialogs(function() {
      $.switchWrapper('#bg-circuits', function() {
        $(".wrapper.active .vertical-centering").dialog(pausePlayMinDialog);
      });
    });
  }

  function serverAlsoTryingToBreakEncryption() {
    // Display the battle scene in background.
    goToBattleScene('play_min_scene', null, MIN_BOARD_LENGTH, 'playMinSceneActive', true, false, currentGame.play_min_scene_msg, 'playMinHelpEvent', 'playMinPauseEvent');
  }

  function cables1() {
    // Disable the action on the key and switch to the waiting scene.
    currentGame.playMinSceneActive = false;
    currentGame.director.switchToScene(currentGame.director.getSceneIndex(currentGame.scenes['waiting_scene']), transitionTime, true, false);

    $('.cables').prepareCables(24, function() { $(document).trigger('nextDialog'); });
  }   

  function encryptedSecondCable() {

    // Prepare the second battle message
    currentGame.play_medium_scene_msg = createMessageForPlayScene(MEDIUM_BOARD_LENGTH, SECOND_BATTLE_MESSAGE);

    // Set the first battle message to the dialog box.
    addInteractiveContentToDialog(secondBattleMessageDialog, (function(){
                var t = board_message_to_string(currentGame.play_medium_scene_msg.plain_message),
                    a = t.split(' '),
                    o = '';

                    for (var i = 0; i<a.length; i++) {
                        if(a[i] != '') o += "<span class='letter-block crypted crypted-message'>"+a[i]+"</span>";
                    }

                    return o;
            }()));
  }

  function helpPlayMedium() {
    $("body").closeAllDialogs(function() {
      $.switchWrapper('#bg-circuits', function() {
        $(".wrapper.active .vertical-centering").dialog(helpPlayMediumDialog);
      });
    });
  }

  function helpPlayMedium2() {
    $("body").closeAllDialogs(function() {
      $.switchWrapper('#bg-circuits', function() {
        $(".wrapper.active .vertical-centering").dialog(helpPlayMedium2Dialog);
      });
    });
  }
  function pausePlayMedium() {
    $("body").closeAllDialogs(function() {
      $.switchWrapper('#bg-circuits', function() {
        $(".wrapper.active .vertical-centering").dialog(pausePlayMediumDialog);
      });
    });
  }


  function cables2() {
    // Disable the action on the key and switch to the waiting scene.
    currentGame.playMinSceneActive = false;
    currentGame.director.switchToScene(currentGame.director.getSceneIndex(currentGame.scenes['waiting_scene']), transitionTime, true, false);

    $('.cables').prepareCables(78, function() { $(document).trigger('nextDialog')});
  }   

  function encryptedThirdCable() {
    // Prepare the third battle message
    currentGame.play_max_scene_msg = createMessageForPlayScene(MAX_BOARD_LENGTH, THIRD_BATTLE_MESSAGE);
    
    // Set the third battle message to the dialog box.
    addInteractiveContentToDialog(thirdBattleMessageDialog, (function(){
        var t = board_message_to_string(currentGame.play_max_scene_msg.plain_message),
            a = t.split(' '),
            o = '';

            for (var i = 0; i<a.length; i++) {
                if(a[i] != '') o += "<span class='letter-block crypted crypted-message'>"+a[i]+"</span>";
            }

            return o;
    }()) );    
  }

  function helpPlayMax() {
    $("body").closeAllDialogs(function() {
      $.switchWrapper('#bg-circuits', function() {
        $(".wrapper.active .vertical-centering").dialog(helpPlayMaxDialog);
      });
    });
  }

  function helpPlayMax2() {
    $("body").closeAllDialogs(function() {
      $.switchWrapper('#bg-circuits', function() {
        $(".wrapper.active .vertical-centering").dialog(helpPlayMax2Dialog);
      });
    });
  }
  function pausePlayMax() {
    $("body").closeAllDialogs(function() {
      $.switchWrapper('#bg-circuits', function() {
        $(".wrapper.active .vertical-centering").dialog(pausePlayMaxDialog);
      });
    });
  }


  function cables3() {
    // Disable the action on the key and switch to the waiting scene.
    currentGame.playMinSceneActive = false;
    currentGame.director.switchToScene(currentGame.director.getSceneIndex(currentGame.scenes['waiting_scene']), transitionTime, true, false);
    $('.cables').prepareCables(31, function() { $(document).trigger('nextDialog'); });
  }       

  function theEnd() {
    $("body").closeAllDialogs(function() {
      $.switchWrapper('#end-game', function() {});
    });
  }

  addControlToDialog(gameOverDialog, [{label: labelNext, class: "button blue", onClick: stopGameOver}, {label: "Abandonner", class: "button red", onClick: theEnd}]);
  addControlToDialog(tooManyBlocksDialog, [{label: labelNext, class: "button blue", onClick: stopGameOver}, {label: "Abandonner", class: "button red", onClick: theEnd}]);

  addControlToDialog(cryptoExplanationsOpt1Dialog, [{label: labelNext, class: "button blue", onClick:
    function () {
      $(document).trigger('stayDialog');
    }
  }]);
  addControlToDialog(cryptoExplanationsOpt2Dialog, [{label: labelNext, class: "button blue", onClick:
    function () {
      $(document).trigger('stayDialog');
    }
  }]);
  addControlToDialog(keysExplanationsOpt1Dialog, [{label: labelNext, class: "button blue", onClick:
    function() {
      $(document).trigger('stayDialog');
    }
  }]);
  addControlToDialog(keysExplanationsOpt2Dialog, [{label: labelNext, class: "button blue", onClick:
    function() {
      $(document).trigger('stayDialog');
    }
  }]);
  addControlToDialog(helpCreateKeyDialog, [{label: labelNext, class: "button blue",
    onClick: function() {
      deActivateHelp(currentGame.scenes.create_key_scene, "createKeySceneActive");
    }
  }]);
  addControlToDialog(pauseCreateKeyDialog, [
    {label: "Quitter", class: "button red", onClick: theEnd},
    {label: labelResume, class: "button blue",
    onClick: function() {
      deActivatePause(currentGame.scenes.create_key_scene, "createKeySceneActive");
    }
  }]);


  
  addControlToDialog(helpPlaySoloDialog, [{label: labelNext, class: "button blue", onClick: helpPlaySolo2}]);
  addControlToDialog(helpPlaySolo2Dialog, [{label: labelNext, class: "button blue",
    onClick: function() {
      deActivateHelp(currentGame.scenes.play_solo_scene, "playSoloSceneActive");
    }
  }]);
  addControlToDialog(pausePlaySoloDialog, [
    {label: "Quitter", class: "button red", onClick: theEnd},
    {label: labelResume, class: "button blue",
    onClick: function() {
      deActivatePause(currentGame.scenes.play_solo_scene, "playSoloSceneActive");
    }
  }]);

  addControlToDialog(helpPlayMinDialog, [{label: labelNext, class: "button blue", onClick: helpPlayMin2}]);
  addControlToDialog(helpPlayMin2Dialog, [{label: labelNext, class: "button blue",
    onClick: function() {
      deActivateHelp(currentGame.scenes.play_min_scene, "playMinSceneActive");
    }
  }]);
  addControlToDialog(pausePlayMinDialog, [
    {label: "Quitter", class: "button red", onClick: theEnd},
    {label: labelResume, class: "button blue",
    onClick: function() {
      deActivatePause(currentGame.scenes.play_min_scene, "playMinSceneActive");
    }
  }]);

  addControlToDialog(helpPlayMediumDialog, [{label: labelNext, class: "button blue", onClick: helpPlayMedium2}]);
  addControlToDialog(helpPlayMedium2Dialog, [{label: labelNext, class: "button blue",
    onClick: function() {
      deActivateHelp(currentGame.scenes.play_medium_scene, "playMediumSceneActive");
    }
  }]);
  addControlToDialog(pausePlayMediumDialog, [
    {label: "Quitter", class: "button red", onClick: theEnd},
    {label: labelResume, class: "button blue",
    onClick: function() {
      deActivatePause(currentGame.scenes.play_medium_scene, "playMediumSceneActive");
    }
  }]);
  
  addControlToDialog(helpPlayMaxDialog, [{label: labelNext, class: "button blue", onClick: helpPlayMax2}]);
  addControlToDialog(helpPlayMax2Dialog, [{label: labelNext, class: "button blue",
    onClick: function() {
      deActivateHelp(currentGame.scenes.play_max_scene, "playMaxSceneActive");
    }
  }]);
  addControlToDialog(pausePlayMaxDialog, [
    {label: "Quitter", class: "button red", onClick: theEnd},
    {label: labelResume, class: "button blue",
    onClick: function() {
      deActivatePause(currentGame.scenes.play_max_scene, "playMaxSceneActive");
    }
  }]);

  var indexDialog = -1;

  currentGame.currentDialog = function() {
    return indexDialog;
  }

  var jumpDialog = 1;
  var dialogsList = [
    {'dialog' : welcomeInstituteDialog, 'background' : 'bg-institut', 'controlsList' : [getControl(controlNext, switchToNewLogin)]},
    {'dialog' : accountCreatedDialog, 'background' : 'bg-institut', 'controlsList' : [getControl(controlPrev, function() { indexDialog--; switchToNewLogin() }), getControl(controlNext, null)]},
    {'dialog' : cryptoExplanationsDialog, 'background' : 'bg-institut', 'callback' : addCryptoExplanationsContent, 'controlsList' : []},
    {'dialog' : goingToCreateKeysDialog, 'background' : 'bg-institut', 'callback' : goingToCreakeKeys, 'controlsList' : [getControl(controlPrev, null), getControl(controlNext, null)]},
    {'dialog' : keysExplanationsDialog, 'background' : 'bg-institut', 'callback' : addKeysExplanationsContent, 'controlsList' : []},
    {'dialog' : hereYourPrivateKeyDialog, 'background' : 'bg-circuits', 'callback' : hereYourPrivateKey, 'controlsList' : [getControl(controlPass, function() { jumpDialog = 3; $(document).trigger('passDialog'); }), getControl(controlNext, null)]},
    {'dialog' : fallSixTimesDialog, 'background' : 'bg-circuits', 'controlsList' : [getControl(controlPass, function() { jumpDialog = 2; $(document).trigger('passDialog'); }), getControl(controlPrev, null), getControl(controlNext, switchToCreateKey)]},

    {'dialog' : keyPreGeneratedDialog, 'background' : 'bg-circuits', 'callback' : keyPreGeneratedUpdateText, 'controlsList' : [getControl(controlNext, switchToFinishCreateKey)]},
    {'dialog' : wellDoneDialog, 'background' : 'bg-institut', 'callback' : wellDone, 'controlsList' : [getControl(controlNext, null)]},
    {'dialog' : letsGoToEncryptDialog, 'background' : 'bg-circuits', 'callback' : letsGoToEncrypt, 'controlsList' : [getControl(controlPass, function() { jumpDialog = 2; $(document).trigger('passDialog'); }), getControl(controlNext, playChercheuse)]},
    
    {'dialog' : firstMessageDialog, 'background' : 'bg-circuits', 'controlsList' : [getControl(controlOpen, null)]},
    {'dialog' : messageTestDialog, 'background' : 'bg-circuits', 'callback' : messageTest, 'controlsList' : [getControl(controlNext, null)]},
    {'dialog' : tutorialDialog, 'background' : 'bg-circuits', 'callback' : tutorial, 'controlsList' : [getControl(controlPrev, null), getControl(controlNext, activatePlaySolo)]},
    {'dialog' : decryptedMessage0Dialog, 'background' : 'bg-circuits', 'controlsList' : [getControl(controlNext, null)]},
    {'dialog' : congratulationsOnCompletingTutorialDialog, 'background' : 'bg-institut', 'callback' : congratulationsOnCompletingTutorial, 'controlsList' : [getControl(controlNext, null)]},

    {'dialog' : aProblemOccursDialog, 'background' : 'bg-institut', 'controlsList' : [getControl(controlPrev, null), getControl(controlNext, null)]},
    {'dialog' : weirdDialog, 'background' : 'bg-institut', 'controlsList' : [getControl(controlPrev, null), getControl(controlNext, null)]},
    {'dialog' : cables0Dialog, 'background' : 'bg-institut', 'afterCallback' : cables0, 'controlsList' : []},
    {'dialog' : electricShockDialog, 'background' : 'bg-institut', 'callback' : addElectricShockContent, 'controlsList' : [getControl(controlPrev, null), getControl(controlNext, null)]},

    {'dialog' : thisAintNormalDialog, 'background' : 'bg-institut', 'controlsList' : [getControl(controlPrev, null), getControl(controlNext, null)]},
    {'dialog' : useCryptoProtocolDialog, 'background' : 'bg-institut', 'controlsList' : [getControl(controlPrev, null), getControl(controlNext, null)]},
    {'dialog' : sendingFirstCableDialog, 'background' : 'bg-institut', 'controlsList' : [getControl(controlPrev, null), getControl(controlNext, null)]},

    {'dialog' : firstBattleMessageDialog, 'background' : 'bg-institut', 'callback' : encryptedFirstCable, 'controlsList' : [getControl(controlDecrypt, null)]},
    {'dialog' : serverAlsoTryingToBreakEncryptionDialog, 'background' : 'bg-circuits', 'callback' : serverAlsoTryingToBreakEncryption, 'controlsList' : [getControl(controlNext, playLevel1)]},
    {'dialog' : decryptedMessage1Dialog, 'background' : 'bg-circuits', 'controlsList' : [getControl(controlNext, null)]},
    {'dialog' : cables1Dialog, 'background' : 'bg-institut', 'afterCallback' : cables1, 'controlsList' : []},
    {'dialog' : successCables1Dialog, 'background' : 'bg-institut', 'controlsList' : [getControl(controlPrev, null), getControl(controlNext, null)]},

    {'dialog' : serverIsFasterDialog, 'background' : 'bg-institut', 'controlsList' : [getControl(controlPrev, null), getControl(controlNext, null)]},
    {'dialog' : sendingSecondCableDialog, 'background' : 'bg-institut', 'controlsList' : [getControl(controlPrev, null), getControl(controlNext, null)]},
    {'dialog' : secondBattleMessageDialog, 'background' : 'bg-institut', 'callback' : encryptedSecondCable, 'controlsList' : [getControl(controlDecrypt, playLevel2)]},
    {'dialog' : decryptedMessage2Dialog, 'background' : 'bg-circuits', 'controlsList' : [getControl(controlNext, null)]},
    {'dialog' : cables2Dialog, 'background' : 'bg-institut', 'afterCallback' : cables2, 'controlsList' : []},
    {'dialog' : successCables2Dialog, 'background' : 'bg-institut', 'controlsList' : [getControl(controlPrev, null), getControl(controlNext, null)]},

    {'dialog' : serverIsInfectingOtherMachinesDialog, 'background' : 'bg-institut', 'controlsList' : [getControl(controlPrev, null), getControl(controlNext, null)]},
    {'dialog' : sendingThirdCableDialog, 'background' : 'bg-institut', 'controlsList' : [getControl(controlPrev, null), getControl(controlNext, null)]},
    {'dialog' : thirdBattleMessageDialog, 'background' : 'bg-institut', 'callback' : encryptedThirdCable, 'controlsList' : [getControl(controlDecrypt, playLevel3)]},
    {'dialog' : decryptedMessage3Dialog, 'background' : 'bg-circuits', 'controlsList' : [getControl(controlNext, null)]},
    {'dialog' : cables3Dialog, 'background' : 'bg-institut', 'afterCallback' : cables3, 'controlsList' : []},
    {'dialog' : successCables3Dialog, 'background' : 'bg-institut', 'controlsList' : [getControl(controlPrev, null), getControl(controlNext, null)]},

    {'dialog' : IWasTrappedDialog, 'background' : 'bg-institut', 'controlsList' : [getControl(controlPrev, null), getControl(controlNext, null)]},
    {'dialog' : thanksToCryptoDialog, 'background' : 'bg-institut', 'controlsList' : [getControl(controlPrev, null), getControl(controlNext, null)]},
    {'dialog' : thanksToCrypto2Dialog, 'background' : 'bg-institut', 'controlsList' : [getControl(controlPrev, null), getControl(controlNext, null)]},
    {'dialog' : comparePlayTimeChartDialog, 'background' : 'bg-institut', 'afterCallback' : function() { setTimeout(createChart, 100); }, 'controlsList' : [getControl(controlPrev, null), getControl(controlNext, theEnd)]}
  ];

  for (var dialogI in dialogsList) {
    if (dialogsList[dialogI]['controlsList']) {
      dialogsList[dialogI]['dialog']['controls'] = dialogsList[dialogI]['controlsList'];
    }
  }

  function displayDialog(dialog) {
    $("body").closeAllDialogs(function() {
      $.switchWrapper('#' + dialog['background'], function() {
        if (dialog['callback']) {
          dialog['callback']();
        }
        $(".wrapper.active .vertical-centering").dialog(dialog['dialog']);
        if (dialog['afterCallback']) {
          dialog['afterCallback']();
        }
      });
    });
  }

  currentGame.switchDialog = function(newIndex) {
    indexDialog = newIndex;
    displayDialog(dialogsList[indexDialog]);
  }

  currentGame.displayDialog = displayDialog;
  currentGame.dialogsList = dialogsList;

  var lockDialog = false;
  var lockTime = 1000;
  $(document).on('nextDialog', function() {
    if (lockDialog === false) {
      lockDialog = true;
      ++indexDialog;
      jumpDialog = 1; 
      displayDialog(dialogsList[indexDialog]);
      setTimeout(function() { lockDialog = false; }, lockTime);
    }
  });

  $(document).on('stayDialog', function() {
    if (lockDialog === false) {
      lockDialog = true;
      displayDialog(dialogsList[indexDialog]);
      setTimeout(function() { lockDialog = false; }, lockTime);
    }
  });


  $(document).on('prevDialog', function() {
    if (lockDialog === false) {
      lockDialog = true;
      indexDialog = indexDialog - jumpDialog;
      jumpDialog = 1;
      displayDialog(dialogsList[indexDialog]);
      setTimeout(function() { lockDialog = false; }, lockTime);
    }
  });

  $(document).on('passDialog', function() {
    indexDialog = indexDialog + jumpDialog;
    displayDialog(dialogsList[indexDialog]);
  });

  function addCryptoExplanationsContent() {
    var cryptoExplanationsContent = [{
      label: cryptoExplanationsLabel0, 
      onClick: cryptoExplanationsOpt1,
      class: game.cryptoExplanations[0] ? 'asked': 'not-asked'
    }, {
      label: cryptoExplanationsLabel1,
      onClick: cryptoExplanationsOpt2,
      class: game.cryptoExplanations[1] ? 'asked': 'not-asked'
    }, {
      label: cryptoExplanationsLabel2,
      onClick: function() { $(document).trigger('nextDialog') },
      class: game.cryptoExplanations[2] ? 'asked' : 'not-asked'
    }];
    addInteractiveContentToDialog(cryptoExplanationsDialog, cryptoExplanationsContent);
  }

  function addKeysExplanationsContent() {
    currentGame.director.easeInOut(
                                  currentGame.director.getSceneIndex(currentGame.scenes.waiting_scene),
                                  CAAT.Foundation.Scene.prototype.EASE_SCALE, CAAT.Foundation.Actor.ANCHOR_CENTER,
                                  currentGame.director.getSceneIndex(currentGame.director.currentScene),
                                  CAAT.Foundation.Scene.prototype.EASE_SCALE,
                                  CAAT.Foundation.Actor.ANCHOR_CENTER,
                                  transitionTime,
                                  true,
                                  new specialInInterpolator(),
                                  new specialOutInterpolator()
    );
    var keysExplanationsContent = [{
      label: keysExplanationsLabel0,
      onClick: dialogWhatArePrivatePublicKeyOpt1,
      class: game.dialogWhatArePrivatePublicKey[0] ? 'asked': 'not-asked'
    }, {
      label: keysExplanationsLabel1,
      onClick: dialogWhatArePrivatePublicKeyOpt2,
      class: game.dialogWhatArePrivatePublicKey[1] ? 'asked': 'not-asked'
    }, {
      label: keysExplanationsLabel2,
      onClick: function() { $(document).trigger('nextDialog') },
      class: game.dialogWhatArePrivatePublicKey[2] ? 'asked': 'not-asked'
    }];
    addInteractiveContentToDialog(keysExplanationsDialog, keysExplanationsContent);         
  }

  function addElectricShockContent() {
    var electricShockContent = [{
      label: labelAie,
      onClick: function() { $(document).trigger('nextDialog') },
    }];
    addInteractiveContentToDialog(electricShockDialog, electricShockContent);
  }

  intro();
});
