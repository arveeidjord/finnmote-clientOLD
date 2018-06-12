(function() {
    'use strict';
  
    var app = {
      isLoading: true,
      visibleArrangementer: {},
    //   selectedCities: [],
      spinner: document.querySelector('.loader'),
      arrangementTemplate: document.querySelector('.arrangementTemplate'),
      arrangementDatoTemplate: document.querySelector('.arrangementDatoTemplate'),
      container: document.querySelector('.main'),
      ukedager:  ['Søndag', 'Mandag', 'Tirsdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lørdag']

    //   addDialog: document.querySelector('.dialog-container'),
    };

    app.loadData = function(data){
        var forrigeArrangement = null;
        for (let i = 0; i < data.length; i++) {
            const arrangement = data[i];
            
            if (!forrigeArrangement || forrigeArrangement.dato != arrangement.dato)
            {
                app.addDatoRad(arrangement)
            }
            forrigeArrangement = arrangement;
            app.updateForecastCard(arrangement);
        }
    }

    app.addDatoRad = function(arrangement) {
        var card = app.arrangementDatoTemplate.cloneNode(true);
        card.classList.remove('arrangementDatoTemplate');
        var dato = new Date(arrangement.dato);
        var dagNavn = app.ukedager[dato.getDay()];
        
        if (dato.toLocaleDateString() == new Date().toLocaleDateString())
            dagNavn = "I dag";
        else if (dato.toLocaleDateString() == app.datoImorgen().toLocaleDateString())
            dagNavn = "I morgen";

        card.querySelector('.arrangementDato').textContent = dagNavn + ", " + dato.getDate() + ". " + dato.toLocaleString(navigator.language, { month: "long" });

        card.removeAttribute('hidden');
        app.container.appendChild(card);
        // app.visibleArrangementer[data.id] = card;
    }

    app.datoImorgen = function(){
        var dato = new Date();
        dato.setDate(dato.getDate() + 1);
        return dato;
    }


    app.updateForecastCard = function(data) {
        var card = app.visibleArrangementer[data.id];
        if (!card) {
          card = app.arrangementTemplate.cloneNode(true);
          card.classList.remove('arrangementTemplate');
          card.querySelector('.arrangementKey').textContent = data.id;

          card.removeAttribute('hidden');
          app.container.appendChild(card);
          app.visibleArrangementer[data.id] = card;
        }
    
        card.querySelector('.arrangementTekst').textContent = data.tekst;
        card.querySelector('.arrangementDato').textContent = new Date(data.dato).toLocaleDateString();
        card.querySelector('.arrangementKl').textContent = new Date(data.dato).toLocaleTimeString(navigator.language, {hour: '2-digit', minute:'2-digit'});
        card.querySelector('.arrangementTaler').textContent = data.taler;
        card.querySelector('.arrangementArrangoer').textContent = data.arrangoer;


        if (app.isLoading) {
          app.spinner.setAttribute('hidden', true);
          app.container.removeAttribute('hidden');
          app.isLoading = false;
        }
      };
  
    var initialWeatherForecast = {
        arrangementer : [
            {      
                id: '1',
                tekst: 'Dette er et møte 1',
                arrangoer: 'Høvåg kirke',
                dato: '2018-06-11T01:00:00Z',
                taler: 'Ola Normann'
            },
            {      
                id: '2',
                tekst: 'Dette er et møte 2',
                arrangoer: 'Høvåg kirke',
                dato: '2018-06-12T01:00:00Z',
                taler: 'Ola Normann'
            },
            {      
                id: '3',
                tekst: 'Dette er et møte 3',
                arrangoer: 'Høvåg kirke',
                dato: '2016-07-25T01:00:00Z',
                taler: 'Ola Normann'
            },
            {      
                id: '4',
                tekst: 'Dette er et møte 4',
                arrangoer: 'Høvåg kirke',
                dato: '2016-07-25T01:00:00Z',
                taler: 'Ola Normann'
            },
            {      
                id: '5',
                tekst: 'Dette er et møte 5',
                arrangoer: 'Høvåg kirke',
                dato: '2016-07-28T01:00:00Z',
                taler: 'Ola Normann'
            }
        ]


    };
    //  app.loadData(initialWeatherForecast.arrangementer);

  })();
  