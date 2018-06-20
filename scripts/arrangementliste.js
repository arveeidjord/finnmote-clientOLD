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
        // Add the newly selected city
        // var select = document.getElementById('selectCityToAdd');
        // var selected = select.options[select.selectedIndex];
        // var key = selected.value;
        // var label = selected.textContent;
        // if (!app.selectedCities) {
        //   app.selectedCities = [];
        // }
        // app.getForecast(key, label);
        // app.selectedCities.push({key: key, label: label});
        // app.saveSelectedCities();

        var tekst = document.getElementById('dialogTekst').value;
        var taler = document.getElementById('dialogTaler').value;
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

        var res = window.app.server.insertArrangement(
            { 
            tekst : tekst, 
            taler : taler, 
            dato: tidspunkt, 
            //2012.12.24 20:30
        }
        );

        arrangement.updateForecastCard(res);

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
    
        card.querySelector('.arrangementTekst').textContent = data.tekst;
        card.querySelector('.arrangementDato').textContent = new Date(data.dato).toLocaleDateString();
        card.querySelector('.arrangementKl').textContent = new Date(data.dato).toLocaleTimeString(navigator.language, {hour: '2-digit', minute:'2-digit'});
        card.querySelector('.arrangementTaler').textContent = data.taler;
        // card.querySelector('.arrangementArrangoer').textContent = data.arrangoer;

        if (arrangement.isLoading) {
            arrangement.spinner.setAttribute('hidden', true);
            arrangement.container.removeAttribute('hidden');
            arrangement.isLoading = false;
        }
      };


      if (window.screen.width < 1024) {
        arrangement.meny.setAttribute('hidden', '');
      }

          // Export to window
        window.app = window.app || {};
        window.app.arrangement = arrangement;
        
        window.app.server.getArrangementer()
            .then(function(data) {
                arrangement.loadData(data.arrangementer);
            })
            .catch(function(err){
                alert("Det oppstod en feil: " + err);
            });

  })(window);
  
