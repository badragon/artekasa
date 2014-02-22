var prop = {
    // Application Constructor
    initialize: function() {
        console.log('Property initialized.');
    	//navigator.notification.alert("Utente: " + app.userid, function() {});
    	
    	$("#content_prop").html("Loading...");
    	prop.getProp();
    },
    
    getProp: function() {
        $("#btnNewHouse")
	        .on("click", function() {
	        	$.mobile.changePage($("#prop_new"), "prop_new");
	        });
    	$("#content_prop").html("Caricamento case in corso...");
    	
        $("#btnNewHouseCancel")
        .on("click", function() {
        	$.mobile.changePage($("#prop"), "prop");
        });
    	
        $("#btnNewHouseSave")
        .on("click", function() {
        	window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, saveProp, fileFail);
        });
    }
    
};


function saveProp(fileSystem) {
	var dir = $().crypt({method:"md5",source: $("#prop-ref").val()});
	var entry=fileSystem.root; 
    entry.getDirectory("artekasa/"+dir, {create: true, exclusive: false}, null, null);
    //fileSystem.root.getFile("artekasa/"+dir+"prop.txt", {create: true}, gotFileEntryW, fileFail);
    fileSystem.root.getFile("artekasa/"+dir+"/prop.txt", {create: true}, savePropW, fileFail);
}

function savePropW(fileEntry) {
    fileEntry.createWriter(savePropWriter, fileFail);
}

function savePropWriter(writer) {
    writer.onwrite = function(evt) {
        console.log("write success");
    };
    var content = $("#new-prop-content :input").serialize();
    writer.write(content);
}






