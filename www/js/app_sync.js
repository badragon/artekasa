var sync = {
    // Application Constructor
    initialize: function() {
        console.log('Foto initialized.');
    	//navigator.notification.alert("Utente: " + app.userid, function() {});
    	
    	$("#content_foto").html("Loading...");
    	sync.getProp();
    },
    
    getProp: function() {
    	window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, syncGetDir, dirFail);
    	
    },
    
    doSync: function() {
    	alert('Sincronizzazione al momento non disponibile');
    }
    
};


function syncGetDir(fileSystem) {
	//alert(fileSystem.name);
    //alert(fileSystem.root.name);
    fileSystem.root.getDirectory("artekasa", {create: false, exclusive: false}, syncGetDirSuccess, dirFail);
}

function syncGetDirSuccess(dirEntry) {
    // Get a directory reader
	var directoryReader = dirEntry.createReader();

    // Get a list of all the entries in the directory
	directoryReader.readEntries(syncReaderSuccess,dirFail);
    
}

function syncReaderSuccess(entries) {
	var row;
    var i;
    var html = '';
    html += '<table><tr><td class=".col-md-6">Casa</td><td class=".col-md-6">foto</td></tr>';
    for (i=0; i<entries.length; i++) {
    	//alert(entries[i].name);
    	if (entries[i].isDirectory) {
    		html += '<tr><td>'+entries[i].name+'</td><td><button onclick="sync.doSync(\''+entries[i].name+'\');">Sincronizza</button></td></tr>';
    	}
    }
    html += '</table>';
    $("#content_sync").html(html);
}







