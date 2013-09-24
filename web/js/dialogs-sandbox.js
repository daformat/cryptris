$(function(){

  var dialog1 = function(){
    $(".wrapper.active").closeAllDialogs(function(){
      $(".wrapper.active .vertical-centering").dialog({
        
        animateText: true,

        title: "Test de titre de dialogue avec text animé",
        content: "Test de contenu <strong>html</strong><br><br><strong>Type :</strong> withoutAvatar<br/>Avec deux boutons</p>",
        
        controls: [{
          label: "annuler", 
          class: "button red",
          onClick: function(){
            alert("Bouton Annuler cliqué");
          }
        }, 

        {
          label: "suivant", 
          class: "button blue",
          onClick: dialog2
        }]

      });
    });
  }

  var dialog2 = function(){
    $(".wrapper.active").closeAllDialogs(function(){
      $(".wrapper.active .vertical-centering").dialog({
        
        type: "withAvatar",
        avatar: "<img src='img/avatar-chercheuse.jpg'>",
        title: "Un dialogue avec avatar",
        content: "Test de contenu <strong>html</strong><p><strong>Type :</strong> withAvatar<br/>Avec trois boutons</p>",
        
        controls: [{
          label: "Test", 
          class: "button",
          onClick: function(){
            alert("Bouton Test cliqué");
          }
        }, 

        {
          label: "annuler", 
          class: "button red",
          onClick: function(){
            alert("Bouton Annuler cliqué");
          }
        }, 

        {
          label: "suivant", 
          class: "button blue",
          onClick: dialog3
        }]

      });
    });
  }  

  var dialog3 = function(){
    $("body").closeAllDialogs(function(){
      $(".wrapper.active .vertical-centering").dialog({
        type: "player",
        content: [
          {
            label: "Première réponse", 
            onClick: function(){
              alert("Première réponse cliquée");
              dialog4();
            }
          }, 
          {
            label: "Deuxième réponse", 
            onClick: function(){
              alert("Deuxième réponse cliquée");
              dialog4();              
            }
          }
        ]
      });
    });
  }

  var dialog4 = function(){
    $("body").closeAllDialogs(function(){
      $(".wrapper.active .vertical-centering").dialog();
    });
  }

  dialog1();
})
