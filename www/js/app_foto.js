var foto = {
    // Application Constructor
    initialize: function() {
        console.log('Foto initialized.');
    	//navigator.notification.alert("Utente: " + app.userid, function() {});
    	
    	$("#content_foto").html("Loading...");
    	foto.getProp();
    },
    
    getProp: function() {
    	window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, getDir, dirFail);
    	
    },
    
    capturePhoto: function(dir) {
      // Take picture using device camera and retrieve image as base64-encoded string
      navigator.camera.getPicture(onPhotoDataSuccess, onFail, { quality: 50,
        destinationType: destinationType.DATA_URL });
    }
    
};


function getDir(fileSystem) {
	//alert(fileSystem.name);
    //alert(fileSystem.root.name);
    fileSystem.root.getDirectory("artekasa", {create: false, exclusive: false}, getDirSuccess, dirFail);
}

function getDirSuccess(dirEntry) {
    // Get a directory reader
	var directoryReader = dirEntry.createReader();

    // Get a list of all the entries in the directory
	directoryReader.readEntries(readerSuccess,dirFail);
    
}

function readerSuccess(entries) {
	var row;
    var i;
    var html = '';
    html += '<table><tr><td class=".col-md-6">Casa</td><td class=".col-md-6">foto</td></tr>';
    for (i=0; i<entries.length; i++) {
    	//alert(entries[i].name);
    	if (entries[i].isDirectory) {
    		html += '<tr><td>'+entries[i].name+'</td><td><button onclick="foto.capturePhoto(\''+entries[i].name+'\');">Capture Photo</button></td></tr>';
    	}
    }
    html += '</table>';
    $("#content_foto").html(html);
}

function dirFail(evt) {
	alert(evt.target.error.code);
    console.log(evt.target.error.code);
}







