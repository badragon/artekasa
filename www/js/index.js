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
//var app_remote_url = "http://192.168.1.234/devel/ahl/artekasa/artekasa/api/phone/";
var app_remote_url = "http://artekasa.webdevhell.com/appl/api/phone/";

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
        
        var userid;
        this.userid = -1;
        
        var regInfo = '';
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
        
        $("#loginButton").on("click",handleLogin);
        
        $("#regButton").on("click", function() {
        	console.log("regButton click");
        	$("#reg_btn_row").hide();
        	$.mobile.changePage($("#loginPage"), "");
        });
        
        
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
    $("#loginButton",form).attr("disabled","disabled");
    var u = $("#username", form).val();
    var p = $("#password", form).val();
    console.log("login init");
    if(u != '' && p!= '') {
        try {
            $.mobile.loading( 'show', { text: "foo", textonly: false, textVisible: true });
            $.ajax({
                type: "POST",
                url: app_remote_url + "login.php",
                dataType: "json",
                data: {
                		//p_u: $().crypt({method:"sha1",source:u}), 
                		p_u: u, 
                		p_p: $().crypt({method:"sha1",source:p}),
                		p_uuid: device.uuid,
                		p_model: device.model,
                		p_platform: device.platform,
                		p_version: device.version,
                		p_name: device.name,
                		p_cordova: device.cordova
                	  },
                //data: {p_u: u, p_p: p},
                success: function(data) {
                	navigator.notification.vibrate(100);
                    console.log("Login response: " + data.id + " Error: " + data.errorMsg + " Debug: " + data.debug);
                    if (data.error == false) {
                    	if (data.isValid == true) {
                    		//alert(app.userid);
                    		app.userid = data.id;
                    		//alert(app.userid);
                    		/*
                    		 * scrivo il file sul device per utilizzarlo offline
                    		 */
                    		app.regInfo = data.id + '|' + data.chk + '|' + data.user + '|';
                    		
                    		window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, setRegInfo, fileFail);
                    		
                    		// Vado alla pagina principale
                    		$.mobile.changePage($("#agenda"), "pop");
                    	}
                    } else {
                    	navigator.notification.alert(data.errorMsg, function() {});
                    }
                  $("#loginButton").removeAttr("disabled");
                },
                error: function(e) {
                  alert('Error: ' + e.message);
                  $("#loginButton").removeAttr("disabled");
                },
                complete: function() {
                    $("#loginButton").removeAttr("disabled");
                    $.mobile.loading( 'hide');
                }
             });
        } catch (e){
            alert(e.message);
            $("#loginButton").removeAttr("disabled");
            $.mobile.loading( 'hide');
        }
    } else {
        navigator.notification.alert("You must enter a username and password", function() {});
        $("#loginButton").removeAttr("disabled");
    }
    return false;
}


//Device
function chkDeviceReg() {
    /*
     * Check if device is registered
     */
	$.mobile.loading();
	
    console.log("Device: " + device.uuid);
    try {
    	$("#reg_btn_row").hide();
    	
    	$("#v_uuid").html(device.uuid);
    	
    	$("#v_model").html(device.model);
    	
    	$("#v_platform").html(device.platform);
    	
    	$("#v_version").html(device.version);
    	
    	$("#v_name").html(device.name);
    	
    	$("#v_cordova").html(device.cordova);
    	
    	window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, getRegInfo, fileFail);
    	
    } catch (e){
        alert(e.message);
        $.mobile.loading('hide');
    }
    return false;
}


/*
 * READ FILE functions
 */ 
function getRegInfo(fileSystem) {
    fileSystem.root.getFile("deviceinfo.txt", {create: true}, gotFileEntryR, fileFail);
}

function setRegInfo(fileSystem) {
    fileSystem.root.getFile("deviceinfo.txt", {create: true}, gotFileEntryW, fileFail);
}

function gotFileEntryR(fileEntry) {
    fileEntry.file(gotFile, fileFail);
}

function gotFile(file){
    readAsText(file);
}

function readAsText(file) {
    var reader = new FileReader();
    reader.onloadend = function(evt) {
        console.log("Read as text");
        console.log(evt.target.result);
        console.log("END of Read as text");
        app.regInfo = evt.target.result;

    	if (app.regInfo == null || app.regInfo == '') {
    		$("#reg_btn_row").show();
    	} else {
    		// Controllo se i dati sono corretti
    		var $aInfo = app.regInfo.split("|");
    		app.userid = $aInfo[0];
    		
    		$.mobile.changePage($("#agenda"), "pop");
    	}
    	$.mobile.loading('hide');
    };
    reader.readAsText(file);
}

// Write
function gotFileEntryW(fileEntry) {
    fileEntry.createWriter(gotFileWriter, fileFail);
}

function gotFileWriter(writer) {
    writer.onwrite = function(evt) {
        console.log("write success");
    };
    writer.write(app.regInfo);
}

function fileFail(evt) {
    console.log("FILE ERROR: " + evt.target.error.code);
}
/*
 * END: READ FILE functions
*/

