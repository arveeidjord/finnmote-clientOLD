(function(window) {
    'use strict';
  
    var server = {

    };


    //TODO: flytte til felles-fil
    server.qs = function getUrlParameter(name) {
      name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
      var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
      var results = regex.exec(location.search);
      return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
  };



    server.loadSide = function(arrangoerId){
      var url = "http://localhost:5000/api/main?arrangoerId=" + arrangoerId;

      return makeRequestGet(url);
  }

    server.getArrangementerAlle = function(arrangoerer){
        var url = "http://localhost:5000/api/arrangement/sok";
        //var url = 'testAlle.json';
        // return makeRequest('GET', url);

        var json = JSON.stringify({ 
          arrangoerer : arrangoerer
        });

        return makeRequestPost(url, json);
    }

    server.getArrangementer = function(arrangoerId){
        
      // var url = 'test.json';
      var url = "http://localhost:5000/api/arrangement/arrangementliste?arrangoerId=" + arrangoerId;

      return makeRequestGet(url);
  }

  server.insertArrangement = function(obj){
    var url = "http://localhost:5000/api/arrangement";

    var json = JSON.stringify(obj);
    return makeRequestPost(url, json);
}

    var makeRequest = function (method, url, data) {
        return new Promise(function (resolve, reject) {
          var xhr = new XMLHttpRequest();
          xhr.open(method, url);
          xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
          xhr.onload = function () {
            if (this.status >= 200 && this.status < 300) {
                var response = JSON.parse(xhr.response);
              resolve(response);
            } else {
              reject({
                status: this.status,
                statusText: xhr.statusText
              });
            }
          };
          xhr.onerror = function () {
            reject({
              status: this.status,
              statusText: xhr.statusText
            });
          };
          xhr.send(data);
        });
      }

      var makeRequestGet = function (url) {
        return makeRequest("GET", url, null);

      }


      var makeRequestPost = function (url, data) {
        return makeRequest("POST", url, data);
      }

        	// Export to window
	window.app = window.app || {};
	window.app.server = server;
  })(window);
  