(function() {
    'use strict';
  
    var app = {
      isLoading: true,
      visibleArrangementer: {},
    //   selectedCities: [],
      spinner: document.querySelector('.loader'),
      container: document.querySelector('.main'),
      menyArrangementliste: document.querySelector('.menyArrangementliste'),
      menyHjem: document.querySelector('.menyHjem'),
      tittelElement: document.querySelector('.header__title'),


    //   addDialog: document.querySelector('.dialog-container'),
    };

    app.init = function(){
        app.menyArrangementliste.href = "arrangementliste.html?arr=" + window.app.server.qs('arr');
        app.menyHjem.href = "arrangoer.html?arr=" + window.app.server.qs('arr');

        window.app.server.loadSide(window.app.server.qs('arr'))
            .then(function(data) {
                app.tittelElement.textContent = data.valgtArrangoer.navn;
            })
            .catch(function(err){
                alert("Det oppstod en feil: " + JSON.stringify(err));
            });
        
    }

           // Export to window
           window.app = window.app || {};
           window.app.app = app;
           
    app.init();


       

  })(window);