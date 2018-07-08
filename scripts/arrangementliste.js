(function(window) {
    'use strict';

    var arrangement = {
      isLoading: true,
      visibleArrangementer: {},
    //   visibleArrangoerer: {},

    //   selectedCities: [],
      spinner: document.querySelector('.loader'),
      arrangementTemplate: document.querySelector('.arrangementTemplate'),
      arrangoerTemplate: document.querySelector('.arrangoerTemplate'),

      arrangementDatoTemplate: document.querySelector('.arrangementDatoTemplate'),
      container: document.querySelector('.container'),
      arrangoerContainer: document.querySelector('.arrangoerer'),
      nyDialog: document.querySelector('.dialog-container'),
      meny: document.querySelector('#meny'),
      tittelElement: document.querySelector('.header__title'),
      menyArrangementliste: document.querySelector('.menyArrangementliste'),
      menyHjem: document.querySelector('.menyHjem'),

      ukedager:  ['Søndag', 'Mandag', 'Tirsdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lørdag'],
      picker : new Pikaday({ 
          field: document.getElementById('dialogTidspunkt'),
          format: 'D/M/YYYY',
    toString(date, format) {
        // you should do formatting based on the passed format,
        // but we will just return 'D/M/YYYY' for simplicity
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        return `${day}.${month}.${year}`;
    },
    // parse(dateString, format) {
    //     // dateString is the result of `toString` method
    //     const parts = dateString.split('/');
    //     const day = parseInt(parts[0], 10);
    //     const month = parseInt(parts[1] - 1, 10);
    //     const year = parseInt(parts[1], 10);
    //     return new Date(year, month, day);
    // },
          i18n: {
            previousMonth : 'Forrige måned',
            nextMonth     : 'Neste måned',
            months        : ['Januar','Februar','Mars','April','Mai','Juni','Juli','August','September','Oktober','November','Desember'],
            weekdays      : ['Søndag','Mandag','Tirsdag','Onsdag','Torsdag','Fredag','Lørdag'],
            weekdaysShort : ['Søn','Man','Tir','Ons','Tor','Fre','Lør']
        } })


    //   addDialog: document.querySelector('.dialog-container'),
    };

    document.getElementById('butAdd').addEventListener('click', function() {
        // Open/show the add new city dialog
        arrangement.picker.setDate(new Date());

        arrangement.toggleAddDialog(true);
      });

      document.getElementById('butMeny').addEventListener('click', function() {
        var hidden = arrangement.meny.offsetParent === null
        
        if (hidden) {
            arrangement.meny.removeAttribute('hidden');
        } else {
            arrangement.meny.setAttribute('hidden', '');
        }
      });

      document.getElementById('butAddCity').addEventListener('click', function() {


        var tekst = document.getElementById('dialogTekst').value;
        // var taler = document.getElementById('dialogTaler').value;
        var tidspunkt = arrangement.picker.getDate(); //document.getElementById('dialogTidspunkt').value;

        var selectTime = document.getElementById('dialogTime');
        var selectedTime = selectTime.options[selectTime.selectedIndex].value;

        var selectMin = document.getElementById('dialogMin');
        var selectedMin = selectMin.options[selectMin.selectedIndex].value;
        
        if (!tekst){
            alert("Feltet 'Tekst' må ha en verdi")
            return;
        }

        if (!tidspunkt){
            alert("Feltet 'Dato' må ha en verdi")
            return;
        }

        //Legger på time og min på datoen som er valgt
        tidspunkt.setHours(selectedTime);
        tidspunkt.setMinutes(selectedMin);

        window.app.server.insertArrangement(
            { 
            beskrivelse : tekst, 
            tidspunkt: tidspunkt, 
            arrangoerId : 1
            //2012.12.24 20:30
        }
        ).then(function(data) {
            arrangement.updateForecastCard(data);

        }).catch(function (err) {
            alert("Det oppstod en feil: " + err);
        });


        arrangement.toggleAddDialog(false);
      });

    document.getElementById('butAddCancel').addEventListener('click', function() {
        arrangement.toggleAddDialog(false);
      });
    

    arrangement.loadData = function(data){
        var forrigeArrangement = null;
        for (let i = 0; i < data.length; i++) {
            const arr = data[i];
            
            arrangement.updateForecastCard(arr);
        }
    }

    arrangement.visNyDialogDialog = function(obj) {

        

        arrangement.nyDialog.classList.add('dialog-container--visible');
    };

    arrangement.toggleAddDialog = function(visible) {
        if (visible) {
            arrangement.nyDialog.classList.add('dialog-container--visible');
        } else {
            arrangement.nyDialog.classList.remove('dialog-container--visible');
        }
      };

    arrangement.updateForecastCard = function(data) {
        var card = arrangement.visibleArrangementer[data.id];
        if (!card) {
          card = arrangement.arrangementTemplate.cloneNode(true);
          card.classList.remove('arrangementTemplate');
          card.querySelector('.arrangementKey').textContent = data.id;

          card.removeAttribute('hidden');
          arrangement.container.appendChild(card);
          arrangement.visibleArrangementer[data.id] = card;
        }
    
        card.querySelector('.arrangementTekst').textContent = data.beskrivelse;
        card.querySelector('.arrangementDato').textContent = new Date(data.tidspunkt).toLocaleDateString();
        card.querySelector('.arrangementKl').textContent = new Date(data.tidspunkt).toLocaleTimeString(navigator.language, {hour: '2-digit', minute:'2-digit'});
        // card.querySelector('.arrangementTaler').textContent = data.taler;
        // card.querySelector('.arrangementArrangoer').textContent = data.arrangoer;

        card.addEventListener('click', function() {
            arrangement.toggleAddDialog(true);
        });

        if (arrangement.isLoading) {
            arrangement.spinner.setAttribute('hidden', true);
            arrangement.container.removeAttribute('hidden');
            arrangement.isLoading = false;
        }
      };

      app.init = function(){

        arrangement.menyArrangementliste.href = "arrangementliste.html?arr=" + window.app.server.qs('arr');
        arrangement.menyHjem.href = "arrangoer.html?arr=" + window.app.server.qs('arr');
        
        window.app.server.loadSide(window.app.server.qs('arr'))
            .then(function(data) {
                arrangement.tittelElement.textContent = data.valgtArrangoer.navn;
            })
            .catch(function(err){
                alert("Det oppstod en feil: " + JSON.stringify(err));
            });
        
    }


      if (window.screen.width < 1024) {
        arrangement.meny.setAttribute('hidden', '');
      }

          // Export to window
        window.app = window.app || {};
        window.app.arrangement = arrangement;
        
        window.app.server.getArrangementer(window.app.server.qs('arr'))
            .then(function(data) {
                arrangement.loadData(data);
            })
            .catch(function(err){
                alert("Det oppstod en feil: " + err);
            });

    app.init();


  })(window);
  
