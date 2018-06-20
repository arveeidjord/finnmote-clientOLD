(function(window) {
    'use strict';
  
    var server = {

    };

    server.getArrangementerAlle = function(filter){
        
        var url = 'testAlle.json';
        return makeRequest('GET', url);
    }

    server.getArrangementer = function(filter){
        
      var url = 'test.json';
      return makeRequest('GET', url);
  }

  server.insertArrangement = function(obj){
    obj.key = 55;
    return obj;
    // var url = 'test.json';
    // return makeRequest('GET', url);
}

    var makeRequest = function (method, url) {
        return new Promise(function (resolve, reject) {
          var xhr = new XMLHttpRequest();
          xhr.open(method, url);
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
          xhr.send();
        });
      }

        	// Export to window
	window.app = window.app || {};
	window.app.server = server;
  })(window);
  