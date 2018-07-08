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
      container: document.querySelector('.mainContainer'),
      arrangoerContainer: document.querySelector('.arrangoerer'),

      ukedager:  ['Søndag', 'Mandag', 'Tirsdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lørdag']

    //   addDialog: document.querySelector('.dialog-container'),
    };

    arrangement.loadData = function(data){

        //#Fjerner alle
        while (arrangement.container.hasChildNodes()) {   
            arrangement.container.removeChild(arrangement.container.firstChild);
        }

        arrangement.visibleArrangementer = {};
        //###

        var forrigeArrangement = null;
        for (let i = 0; i < data.length; i++) {
            const arr = data[i];
            
            if (!forrigeArrangement || forrigeArrangement.tidspunkt != arr.tidspunkt)
            {
                arrangement.addDatoRad(arr)
            }

            forrigeArrangement = arr;
            arrangement.updateForecastCard(arr);
        }

    //     //#Add arrangoer til filter
    //     //var k = _.orderBy(data, ['arrangoer'], ['asc']);
    //     //var k = _.map(data, function(data) { return data.arrangoer.navn; })
    //    // k = _.uniqBy(k, 'arrangoer');
    //     //k = _.uniq(k);
    //     var k = data.arrangoerer;
    //     for (let i = 0; i < k.length; i++) {
    //         const rad = k[i];
    //         arrangement.addArrangoer(rad);
    //     }
    //     //###
    }

    arrangement.loadArrangoerer = function(data){
 
        var k = data;
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
        arrangoer.querySelector('.arrangoerNavn').textContent = data.navn;
        arrangoer.querySelector('.arrangoerChk').value = data.id;


        arrangoer.removeAttribute('hidden');
        arrangement.arrangoerContainer.appendChild(arrangoer);

        arrangoer.addEventListener('click', function() {


            var valgteArrangoererElem = document.querySelectorAll(".arrangoerChk:checked");


            var values = Array.from(valgteArrangoererElem).map(function(x) {return x.value});

            window.app.server.getArrangementerAlle(values)
            .then(function(data) {
                arrangement.loadData(data.arrangementer);
                // arrangement.loadArrangoerer(data.arrangoerer);
            })
            .catch(function(err){
                alert("Det oppstod en feil: " + err);
            });
          });
        

        // app.visibleArrangementer[data.id] = card;
        //###
    }

    arrangement.addDatoRad = function(arr) {
        var card = arrangement.arrangementDatoTemplate.cloneNode(true);
        card.classList.remove('arrangementDatoTemplate');
        var dato = arrangement.tid(arr.tidspunkt);
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

    arrangement.tid = function(datoString){


        var s = new Date(Date.parse(datoString));
        return s;

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
    
        card.querySelector('.arrangementTekst').textContent = data.beskrivelse;
        card.querySelector('.arrangementDato').textContent = arrangement.tid(data.tidspunkt).toLocaleDateString(); //new Date(data.tidspunkt).toLocaleDateString();
        card.querySelector('.arrangementKl').textContent = arrangement.tid(data.tidspunkt).toLocaleTimeString(navigator.language, {hour: '2-digit', minute:'2-digit'});
        card.querySelector('.arrangementTaler').textContent = data.taler;
        card.querySelector('.arrangementArrangoer').textContent = data.arrangoer.navn;
        card.querySelector('.arrangementArrangoer').href = "arrangoer.html?arr=" + data.arrangoer.id;
        
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
                arrangement.loadArrangoerer(data.arrangoerer);
            })
            .catch(function(err){
                alert("Det oppstod en feil: " + err);
            });

  })(window);
  
