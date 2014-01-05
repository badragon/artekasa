/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
        
        var userid;
        this.userid = -1;
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        document.addEventListener('backbutton', this.onBackButton, false);
        
        $(document).on("pageshow", "#agenda", function(e, ui) {
        	app.agendaInit();
        });
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    onBackButton: function(e) {
    	e.preventDefault();
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        console.log('Received Event: ' + id);
        checkConnection();
        setInterval(checkConnection, 10000);
        
        $.mobile.allowCrossDomainPages = true;
        
        chkDeviceReg();
        
        /*
	alert("Model: " + device.model);
    alert("Cordova: " + device.cordova);
    alert("Platform: " + device.platform);
    alert("UUID: " + device.uuid);
    alert("Version: " + device.version);
    alert("Name: " + device.name);
    */
    
    /*
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');
    */
        $(".exit-app").click(function(e) {
        	e.preventDefault();
            navigator.app.exitApp();
        });
        
        $("#device-info").removeClass("ko");
        $("#device-info").addClass("ok");
        $("#uuid_view").html(device.uuid);
        
        $("#loginForm").on("submit",handleLogin);
        
        
    },
    agendaInit: function() {
        console.log('called AgendaInit();');
        
        navigator.notification.alert("Utente: " + app.userid, function() {});
        
        agenda.initialize();
        
    }
    
};



function checkConnection() {
    var networkState = navigator.connection.type;

    var states = {};
    states[Connection.UNKNOWN]  = 'Unknown';
    states[Connection.ETHERNET] = 'Ethernet';
    states[Connection.WIFI]     = 'WiFi';
    states[Connection.CELL_2G]  = 'Cell 2G';
    states[Connection.CELL_3G]  = 'Cell 3G';
    states[Connection.CELL_4G]  = 'Cell 4G';
    states[Connection.CELL]     = 'Cell';
    states[Connection.NONE]     = 'No network';
    
    $(".connection-type").html(states[networkState]);
    //alert("Conn: " + states[networkState]);
}


function handleLogin() {
    var form = $("#loginForm");
    //disable the button so we can't resubmit while we wait
    $("#submitButton",form).attr("disabled","disabled");
    var u = $("#username", form).val();
    var p = $("#password", form).val();
    console.log("click");
    if(u != '' && p!= '') {
        try {
            $.mobile.loading( 'show', { text: "foo", textonly: false, textVisible: true });
            $.ajax({
                type: "POST",
                url: "http://192.168.1.234/devel/ahl/artekasa/artekasa/api/phone/login.php",
                dataType: "json",
                data: {p_u: $().crypt({method:"sha1",source:u}), p_p: $().crypt({method:"sha1",source:p})},
                //data: {p_u: u, p_p: p},
                success: function(data) {
                	navigator.notification.vibrate(500);
                    console.log("Login response: " + data.id + " Error: " + data.errorMsg);
                    if (data.error == false) {
                    	if (data.isValid == true) {
                    		alert(app.userid);
                    		app.userid = data.id;
                    		alert(app.userid);
                    		$.mobile.changePage($("#agenda"), "pop");
                    	}
                    } else {
                    	navigator.notification.alert(data.errorMsg, function() {});
                    }
                  $("#submitButton").removeAttr("disabled");
                },
                error: function(e) {
                  alert('Error: ' + e.message);
                  $("#submitButton").removeAttr("disabled");
                },
                complete: function() {
                    $("#submitButton").removeAttr("disabled");
                    $.mobile.loading( 'hide');
                }
             });
        } catch (e){
            alert(e.message);
            $("#submitButton").removeAttr("disabled");
            $.mobile.loading( 'hide');
        }
    } else {
        navigator.notification.alert("You must enter a username and password", function() {});
        $("#submitButton").removeAttr("disabled");
    }
    return false;
}


//Device
function chkDeviceReg() {
    /*
     * Check if device is registered
     */
    console.log("Device: " + device.uuid);
    try {
        
        /*
        $.mobile.loading( 'show', { text: "Checking Device", textonly: false, textVisible: true });
        $.ajax({
            type: "POST",
            url: "http://192.168.1.234/devel/ahl/artekasa/api/phone/get_device.php",
            dataType: "json",
            data: {identity: u, password: p},
            success: function(data) {
                navigator.notification.alert(data.identity, function() {});
                console.log(data);
              $("#submitButton").removeAttr("disabled");
            },
            error: function(e) {
              alert('Error: ' + e.message);
              $("#submitButton").removeAttr("disabled");
            },
            complete: function() {
                $("#submitButton").removeAttr("disabled");
                $.mobile.loading( 'hide');
            }
         });
         */
    } catch (e){
        alert(e.message);
        $.mobile.loading( 'hide');
    }
    return false;
}

