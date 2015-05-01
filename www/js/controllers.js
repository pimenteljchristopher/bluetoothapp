

angular.module('starter.controllers', [])
.controller('DashCtrl', function($scope,Camera) {
 $scope.macAddress = "CE:7B:8D:57:DD:C8";
  // $scope.macAddress = "7C:7A:91:34:0F:11";

     $scope.getPhoto = function() {
    Camera.getPicture().then(function(imageURI) {
      $scope.imageTaken=imageURI;
    }, function(err) {
      console.err(err);
    });
 };
  //macAddress Bluetooth
  
 	var app = {
    macAddress: "CE:7B:8D:57:DD:C8",  // get your mac address from bluetoothSerial.list
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
   
    },

/*
    this runs when the device is ready for user interaction:
*/
    onDeviceReady: function() {
        // app.macAddress = document.getElementById("bluetooth_id");
        // check to see if Bluetooth is turned on.
        // this function is called only
        //if isEnabled(), below, returns success:
        var listPorts = function() {
            // list the available BT ports:
            bluetoothSerial.list(function(devices) {
            devices.forEach(function(device) {
                console.log(device.id);
                 app.listView("Id :  "+device.id + ", Name : "+device.name );
            })
        }, failure);

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
              var failure = function(){};

        //list device
        
		// bluetoothSerial.read(function (data) {
		//     app.connectInsecureView(data);
		// }, failure);

		// bluetoothSerial.readUntil('\n', function (data) {
		//    app.connectInsecureView("Read"+data);
		// }, failure);
		// bluetoothSerial.subscribe('\n', function (data) {
		//     console.log(data);
		//     app.display("Subscribe"+data);
		// }, failure);
	// 	bluetoothSerial.subscribeRawData(function (data) {
	//     var bytes = new Uint8Array(data);
	//     console.log(bytes);
	//      app.connectInsecureView(bytes);
	// }, failure);
    },
/*
    Connects if not connected, and disconnects if connected:
*/  listConnection: function(){
        var failure = function(){
        }
        bluetoothSerial.list(function(devices) {
            devices.forEach(function(device) {
                console.log(device.id);
                 app.listView("Id :  "+device.id + ", Name : "+device.name);
            })
        }, failure);
    }
    ,manageConnection: function() {
        var dataBt =  document.getElementById('bluetooth_id').value;
        app.macAddress = dataBt;
        var connect = function () {
            // if not connected, do this:
            // clear the screen and display an attempt to connect
            app.clear();
            app.display(dataBt+"Attempting to connect." +"Make sure the serial port is open on the target device.");
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
              app.connectRawView("Data:"+data);
        };
        var failure = function(){
        };
        var bytesData = function(data){
          app.connectBytesView(data);
        };
        // change the button's name:
        connectButton.innerHTML = "Disconnect";
        //subscribe data
        bluetoothSerial.subscribeRawData(success, failure);
        //read data bytes
        bluetoothSerial.available(bytesData, failure);
        bluetoothSerial.subscribe('\n', function (data) {
            app.clear();
            app.connectInsecureView(data);
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
         connectButton.innerHTML = "Connect";
    },

/*
    appends @message to the message div:
*/  connectBytesView:function(message){
         var bytes_data = document.getElementById("bytes_data"), // the message div
            lineBreak = document.createElement("br"),     // a line break
            label = document.createTextNode(message);     // create the label
         bytes_data.innerHTML = "";
        bytes_data.appendChild(lineBreak);          // add a line break
        bytes_data.appendChild(label);
        bytes_data.appendChild(lineBreak);  
    },
    connectInsecureView:function(message){
         var dataBluetooth = document.getElementById("insecure_data"), // the message div
            lineBreak = document.createElement("br"),     // a line break
            label = document.createTextNode(message);     // create the label
         dataBluetooth.innerHTML = "";
        dataBluetooth.appendChild(lineBreak);          // add a line break
        dataBluetooth.appendChild(label);
        dataBluetooth.appendChild(lineBreak);  
    },
     connectRawView:function(message){
         var dataBluetooth = document.getElementById("rawdata_data"), // the message div
            lineBreak = document.createElement("br"),     // a line break
            label = document.createTextNode(message);     // create the label
         dataBluetooth.innerHTML = "";
        dataBluetooth.appendChild(lineBreak);          // add a line break
        dataBluetooth.appendChild(label);
        dataBluetooth.appendChild(lineBreak);  
    },
    listView:function(message){
         var listView = document.getElementById("list_bluetooth"), // the message div
            lineBreak = document.createElement("br"),     // a line break
            label = document.createTextNode(message);     // create the label
         listView.innerHTML = "";
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
