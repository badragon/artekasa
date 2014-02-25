var foto = {
    // Application Constructor
		
    initialize: function() {
        console.log('Foto initialized.');
    	//navigator.notification.alert("Utente: " + app.userid, function() {});
        
        var dir;
        this.dir = '';
        
        var imageData;
        this.imageData = '';
        
        var delDir;
        this.delDir = '';
        
        var delFile;
        this.delFile = '';
    	
        $("#content_sync").html("");
    	$("#content_foto").html("Loading...");

    	$("#aaa").on("click", function (){
    		alert($(this).attr("data-dir") + '/' + $(this).attr("data-file"));
    	});
    	
    	foto.getProp();
    },
    
    getProp: function() {
        foto.imageData = '';
    	window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, getDir, dirFail);
    	
    },
    
    capturePhoto: function(dir) {
    	foto.dir = dir;
      // Take picture using device camera and retrieve image as base64-encoded string
    	//navigator.camera.getPicture(onPhotoDataSuccess, onFail, { quality: 50, destinationType: destinationType.DATA_URL });
    	//navigator.camera.getPicture(onPhotoURISuccess, onFail, { quality: 100, destinationType: destinationType.FILE_URI });
    	//navigator.camera.getPicture(onPhotoDataSuccessWrite, onFail, { quality: 100, destinationType: destinationType.DATA_URL });
        navigator.camera.getPicture(onPhotoURISuccess, onFail, { quality: 100, destinationType: navigator.camera.DestinationType.FILE_URI });
    },
    
    deletePhoto: function(dir, filename) {
    	if (confirm("Cancelllare la foto?")) {
    		foto.delDir = dir;
    		foto.delFile = filename;
    		window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, foto.deletePhotoFile, fileFail);
    	}
    },
    deletePhotoFile: function(fileSystem) {
    	fileSystem.root.getFile("artekasa/"+foto.delDir+"/"+foto.delFile, {create: true}, foto.gotFileRemove, fileFail);
    },
    gotFileRemove: function(fileEntry) {
        fileEntry.remove(foto.afterDelete, fileFail);
    },
    afterDelete: function(evt) {
    	console.log("file "+foto.delDir+"/"+foto.delFile+" CANCELLATO");
        $("#photo_"+foto.delDir+"_"+$().crypt({method:"md5",source: foto.delFile})).remove();
        foto.delDir = "";
        foto.delFile = "";
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
    //html += '<table><tr><td class=".col-md-6">Casa</td><td class=".col-md-6">foto</td></tr>';
    html += '<table style="width:100%;">';
    html += '<tr>';
    html += '<td style="width:200px;border: 1px solid black;">';
    html += 'ID casa';
    html += '</td>';
    html += '<td style="width:150px;border: 1px solid black;">';
    html += 'Ref. N.';
    html += '</td>';
    html += '<td style="width:200px;border: 1px solid black;">';
    html += 'Citta';
    html += '</td>';
    html += '<td style="border: 1px solid black;">';
    html += 'Via';
    html += '</td>';
    html += '</tr>';
    for (i=0; i<entries.length; i++) {
    	//alert(entries[i].name);
    	if (entries[i].isDirectory) {
    		//html += '<tr><td>'+entries[i].name+'</td><td><button onclick="foto.capturePhoto(\''+entries[i].name+'\');">Fai una foto</button></td></tr>';
    		html += '<tr>';
    		html += '<td style="border: 1px solid black;">';
    		html += entries[i].name;
    		html += '</td>';
    		html += '<td id="prop_'+entries[i].name+'_PROP_REF" style="border: 1px solid black;">';
    		html += 'aaa';
    		html += '</td>';
    		html += '<td id="prop_'+entries[i].name+'_PROP_CITY" style="border: 1px solid black;">';
    		html += '';
    		html += '</td>';
    		html += '<td id="prop_'+entries[i].name+'_PROP_ADDRESS" style="border: 1px solid black;">';
    		html += '';
    		html += '</td>';
    		html += '</tr>';
    		// bottone foto
    		html += '<tr>';
    		html += '<td colspan="4"';
    		html += '<button type="button" class="btn btn-primary" onclick="foto.capturePhoto(\''+entries[i].name+'\');">Fai una foto</button>';
    		html += '</td>';
    		html += '</tr>';
    		// foto thumbnail
    		html += '<tr>';
    		html += '<td colspan="4" id="foto_'+entries[i].name+'" style="border: 1px solid black;">';
    		html += '</td>';
    		html += '</tr>';
    		// spazio
    		html += '<tr>';
    		html += '<td colspan="4">';
    		html += '<br>';
    		html += '</td>';
    		html += '</tr>';
    	}
    }
    html += '</table>';
    $("#content_foto").html(html);
    
    // Popolo la tabella con i dati delle proprieta
    for (i=0; i<entries.length; i++) {
    	//alert(entries[i].name);
    	if (entries[i].isDirectory) {
    		prop.readPropFile(entries[i].name);
    	}
    }
}

function dirFail(evt) {
	alert(evt.target.error.code);
    console.log(evt.target.error.code);
}

//Called when a photo is successfully retrieved
//
function onPhotoURISuccess(imageURI) {
	// Uncomment to view the image file URI 
	//console.log(imageURI);
	
	// Get image handle
	//
	//var largeImage = document.getElementById('largeImage');
	
	// Unhide image elements
	//
	//largeImage.style.display = 'block';
	
	// Show the captured photo
	// The inline CSS rules are used to resize the image
	//
	//largeImage.src = imageURI;
	//$("#txt_img").html(imageURI);
	
	movePic(imageURI);
}

function movePic(file){ 
    window.resolveLocalFileSystemURI(file, saveFoto, onFail); 
}

//Callback function when the file system uri has been resolved
function saveFoto(entry) {
	//console.log("entry= " + entry);
	
    var d = new Date();
    var n = d.getTime();
    //new file name
    var newFileName = n + ".jpg";
    var myFolderApp = "artekasa/"+foto.dir;

    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSys) {      
	    //The folder is created if doesn't exist
	    fileSys.root.getDirectory( myFolderApp,
	                    {create:true, exclusive: false},
	                    function(directory) {
	                    	//console.log("Directory: " + directory);
	                        entry.moveTo(directory, newFileName,  successMove, onFail);
	                    },
	                    onFail);
	                    },
	                    onFail);
}

function successMove(fileEntry) {
    //console.log("successMove: " + fileEntry.fullPath);
	var new_thumb = '<img src="'+fileEntry.fullPath+'" class="img-thumbnail prop-thumb" id="photo_'+foto.dir+'_'+$().crypt({method:"md5",source: fileEntry.name})+'" style="width: 100px;" data-dir="'+foto.dir+'" data-file="'+fileEntry.name+'" onclick="foto.deletePhoto(\''+foto.dir+'\', \''+fileEntry.name+'\');">';
	$("#foto_"+foto.dir).html($("#foto_"+foto.dir).html() + new_thumb);
}

/*
function saveFotoW(fileEntry) {
    fileEntry.createWriter(saveFotoWriter, fileFail);
}

function saveFotoWriter(writer) {
    writer.onwrite = function(evt) {
        alert("Foto salvata.");
    };
    writer.write(foto.imageData);
}
*/



