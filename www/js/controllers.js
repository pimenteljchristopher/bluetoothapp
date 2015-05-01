

angular.module('starter.controllers', [])
.controller('DashCtrl', function($scope,Camera) {
 $scope.macAddress = "7C:7A:91:34:0F:11";

 $scope.getPhoto = function() {
    Camera.getPicture().then(function(imageURI) {
      $scope.imageTaken=imageURI;
    }, function(err) {
      console.err(err);
    });
 };

 	var app = {
    macAddress: $scope.macAddress,  // get your mac address from bluetoothSerial.list
    chars: "",

/*
    Application constructor
 */
    initialize: function() {
        this.bindEvents();
        console.log("Starting SimpleSerial app");
    },
/*
    bind any events that are required on startup to listeners:
*/
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        connectButton.addEventListener('touchend', app.manageConnection, false);
        listViewButton.addEventListener('touchend', app.listConnection, false);
        insecureButton.addEventListener('touchend', app.inSecureConnection, false);

    },

/*
    this runs when the device is ready for user interaction:
*/
    onDeviceReady: function() {
        // check to see if Bluetooth is turned on.
        // this function is called only
        //if isEnabled(), below, returns success:
        var listPorts = function() {
            // list the available BT ports:
            bluetoothSerial.list(
                function(results) {
                	var ob = JSON.stringify(results)
                    app.display(JSON.stringify(results));
                },
                function(error) {
                    app.display(JSON.stringify(error));
                }
            );
        }

        // if isEnabled returns failure, this function is called:
        var notEnabled = function() {
        
            app.display("Bluetooth is not enabled.")
        }

         // check if Bluetooth is on:
        bluetoothSerial.isEnabled(
            listPorts,
            notEnabled
        );
              var failure = function(){
        }

        //list device
        
		bluetoothSerial.read(function (data) {
		    app.connectInsecureView(data);
		}, failure);

		bluetoothSerial.readUntil('\n', function (data) {
		   app.display(data);
		}, failure);
		bluetoothSerial.subscribe('\n', function (data) {
		    console.log(data);
		    app.display(data);
		}, failure);
		bluetoothSerial.subscribeRawData(function (data) {
	    var bytes = new Uint8Array(data);
	    console.log(bytes);
	     app.display(bytes);
	}, failure);
    },
    inSecureConnection: function(){
        var connectfailure = function(){
            app.connectInsecure("failed");
        }
        var connectSuccess = function(data){
            app.connectInsecureView("Success"+data);
            bluetoothSerial.read(function (data) {
                console.log(data);
                   app.connectInsecureView("this data please"+data);
            }, failure);
        }
        bluetoothSerial.connectInsecure(app.macAddress, connectSuccess, connectFailure);
    }
    ,
/*
    Connects if not connected, and disconnects if connected:
*/  listConnection: function(){
        var failure = function(){
        }
        bluetoothSerial.list(function(devices) {
            devices.forEach(function(device) {
                console.log(device.id);
                 app.listView(device.id);
            })
        }, failure);
    }
    ,manageConnection: function() {
        var connect = function () {
            // if not connected, do this:
            // clear the screen and display an attempt to connect
            app.clear();
            app.display("Attempting to connect." +
                "Make sure the serial port is open on the target device.");
            // attempt to connect:
            bluetoothSerial.connect(
                app.macAddress,  // device to connect to
                app.openPort,    // start listening if you succeed
                app.showError    // show the error if you fail
            );
        };

        // disconnect() will get called only if isConnected() (below)
        // returns success  In other words, if  connected, then disconnect:
        var disconnect = function () {
            app.display("attempting to disconnect");
            // if connected, do this:
            bluetoothSerial.disconnect(
                app.closePort,     // stop listening to the port
                app.showError      // show the error if you fail
            );
        };

        // here's the real action of the manageConnection function:
        bluetoothSerial.isConnected(disconnect, connect);
    },
/*
    subscribes to a Bluetooth serial listener for newline
    and changes the button:
*/
    openPort: function() {
        // if you get a good Bluetooth serial connection:
        app.display("Connected to: " + app.macAddress);
        var success= function(data){
              app.display("Data: " + data);
        }
        var failure = function(){

        }
        // change the button's name:
        connectButton.innerHTML = "Disconnect";
        // set up a listener to listen for newlines
        // and display any new data that's come in since
        // the last newline:
        bluetoothSerial.read(success, failure);
        bluetoothSerial.subscribe('\n', function (data) {
            app.clear();
            app.display(data);
        });
    },

/*
    unsubscribes from any Bluetooth serial listener and changes the button:
*/
    closePort: function() {
        // if you get a good Bluetooth serial connection:
        app.display("Disconnected from: " + app.macAddress);
        // change the button's name:
        connectButton.innerHTML = "Connect";
        // unsubscribe from listening:
        bluetoothSerial.unsubscribe(
                function (data) {
                    app.display(data);
                },
                app.showError
        );
    },
/*
    appends @error to the message div:
*/
    showError: function(error) {
        app.display(error);
    },

/*
    appends @message to the message div:
*/  
    connectInsecureView:function(message){
         var listView = document.getElementById("insecure_data"); // the message div
           listView.innerHTML = "";
            lineBreak = document.createElement("br"),     // a line break
            label = document.createTextNode(message);     // create the label

        listView.appendChild(lineBreak);          // add a line break
        listView.appendChild(label);
        listView.appendChild(lineBreak);  
    }
    ,
    listView:function(message){
         var listView = document.getElementById("list_bluetooth"); // the message div
           listView.innerHTML = "";
            lineBreak = document.createElement("br"),     // a line break
            label = document.createTextNode(message);     // create the label

        listView.appendChild(lineBreak);          // add a line break
        listView.appendChild(label);
        listView.appendChild(lineBreak);  
    },
    display: function(message) {
        var display = document.getElementById("message"), // the message div
            lineBreak = document.createElement("br"),     // a line break
            label = document.createTextNode(message);     // create the label

        display.appendChild(lineBreak);          // add a line break
        display.appendChild(label);              // add the message node
    },
/*
    clears the message div:
*/

    clear: function() {
        var display = document.getElementById("message");
        display.innerHTML = "";
    }
};   
    app.initialize();
   // end of app

})

.controller('ChatsCtrl', function($scope, Chats) {
  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  }
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
