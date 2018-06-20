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
      container: document.querySelector('.main'),
      arrangoerContainer: document.querySelector('.arrangoerer'),

      ukedager:  ['Søndag', 'Mandag', 'Tirsdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lørdag']

    //   addDialog: document.querySelector('.dialog-container'),
    };

    arrangement.loadData = function(data){
        var forrigeArrangement = null;
        for (let i = 0; i < data.length; i++) {
            const arr = data[i];
            
            if (!forrigeArrangement || forrigeArrangement.dato != arr.dato)
            {
                arrangement.addDatoRad(arr)
            }

            forrigeArrangement = arr;
            arrangement.updateForecastCard(arr);
        }

        //#Add arrangoer til filter
        var k = _.orderBy(data, ['arrangoer'], ['asc']);
        k = _.uniqBy(k, 'arrangoer');

        for (let i = 0; i < k.length; i++) {
            const rad = k[i];
            arrangement.addArrangoer(rad);
        }
        //###
    }

    arrangement.addArrangoer = function(data) {
        //#Add Arrangør til filter
        var arrangoer = arrangement.arrangoerTemplate.cloneNode(true);
        arrangoer.classList.remove('arrangoerTemplate');
        arrangoer.querySelector('.arrangoerNavn').textContent = data.arrangoer;

        arrangoer.removeAttribute('hidden');
        arrangement.arrangoerContainer.appendChild(arrangoer);
        // app.visibleArrangementer[data.id] = card;
        //###
    }

    arrangement.addDatoRad = function(arr) {
        var card = arrangement.arrangementDatoTemplate.cloneNode(true);
        card.classList.remove('arrangementDatoTemplate');
        var dato = new Date(arr.dato);
        var dagNavn = arrangement.ukedager[dato.getDay()];
        
        if (dato.toLocaleDateString() == new Date().toLocaleDateString())
            dagNavn = "I dag";
        else if (dato.toLocaleDateString() == arrangement.datoImorgen().toLocaleDateString())
            dagNavn = "I morgen";

        card.querySelector('.arrangementDato').textContent = dagNavn + ", " + dato.getDate() + ". " + dato.toLocaleString(navigator.language, { month: "long" });

        card.removeAttribute('hidden');
        arrangement.container.appendChild(card);
        // app.visibleArrangementer[data.id] = card;
    }

    arrangement.datoImorgen = function(){
        var dato = new Date();
        dato.setDate(dato.getDate() + 1);
        return dato;
    }


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
        card.querySelector('.arrangementArrangoer').textContent = data.arrangoer;

        if (arrangement.isLoading) {
            arrangement.spinner.setAttribute('hidden', true);
            arrangement.container.removeAttribute('hidden');
            arrangement.isLoading = false;
        }
      };
          // Export to window
        window.app = window.app || {};
        window.app.arrangement = arrangement;
        
        window.app.server.getArrangementerAlle()
            .then(function(data) {
                arrangement.loadData(data.arrangementer);
            })
            .catch(function(err){
                alert("Det oppstod en feil: " + err);
            });

  })(window);
  
