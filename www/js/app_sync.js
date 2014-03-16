var sync = {
    // Application Constructor
    initialize: function() {
        console.log('Foto initialized.');
    	//navigator.notification.alert("Utente: " + app.userid, function() {});
        
        var dir;
        this.dir = "";
        
    	$("#content_foto").html("");
    	$("#content_sync").html("Loading...");
    	sync.getProp();
    },
    
    getProp: function() {
    	window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, syncGetDir, dirFail);
    	
    },
    
    doSync: function(dir) {
    	//alert(dir);
    	sync.dir = dir;
    	
    	$("#file_"+dir).html("");
    	
    	/*
    	// prop.txt
    	window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
        	fileSystem.root.getFile("artekasa/"+dir+"/prop.txt", {create: true}, function(fileEntry) {
        		//alert("fullpath=" + fileEntry.fullPath);
        		sync.fileUpload(dir, fileEntry.fullPath);
        	}, fileFail);
        }, dirFail);
    	
    	// prop2.txt
    	window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
        	fileSystem.root.getFile("artekasa/"+dir+"/prop2.txt", {create: true}, function(fileEntry) {
        		//alert("fullpath=" + fileEntry.fullPath);
        		sync.fileUpload(dir, fileEntry.fullPath);
        	}, fileFail);
        }, dirFail);
    	*/
    	
    	// foto
    	window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, getPropPhotos, dirFail);
    	
    },
    
    fileUpload: function(dir, fileURI) {
    	var options = new FileUploadOptions();
        options.fileKey="file";
        options.fileName=fileURI.substr(fileURI.lastIndexOf('/')+1);
        options.mimeType="text/plain";
        
        //  genero la progressbar
        var id_file = 'prg_'+dir+'_'+$().crypt({method:"md5",source: options.fileName});
        var html = $("#file_"+dir).html();
	    html += '<tr>';
	    html += '<td style="width:150px;">';
	    html += options.fileName;
	    html += '</td>';
	    html += '<td id="'+id_file+'" style="width:300px;" >';
	    html += '';
	    html += '</td>';
	    html += '</tr>';
	    $("#file_"+dir).html(html);

        var params = new Object();
        params.dir = dir;

        options.params = params;

        var ft = new FileTransfer();
        //alert(encodeURI(app_remote_url + "save_prop.php"));
        ft.upload(fileURI, encodeURI(app_remote_url + "save_prop.php"), function (r) {
	        	//alert('OK');
	            console.log("Code = " + r.responseCode);
	            console.log("Response = " + r.response);
	            console.log("Sent = " + r.bytesSent);
	            $("#"+id_file).html("100% loaded.");
	        }, Upfail, options);
        
        ft.onprogress = function(progressEvent) {
	        if (progressEvent.lengthComputable) {
		        var perc = Math.floor(progressEvent.loaded / progressEvent.total * 100);
		        $("#"+id_file).html(perc + "% loaded... ("+progressEvent.loaded + "/" + progressEvent.total+")");
		    } else {
		        if($("#"+id_file).html() == "") {
		        	$("#"+id_file).html("Loading");
		        } else {
		        	$("#"+id_file).html($("#"+id_file).html()+".");
		        }
	        }
        };
        
    }
    
};


function syncGetDir(fileSystem) {
	//alert(fileSystem.name);
    //alert("1 " + fileSystem.root.name);
	//sync.localFS = fileSystem;
    //alert("2 " + sync.localFS.root.name);
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
    		html += '<td colspan="4" style="border: 1px solid black;">';
    		html += '<div class="row"><div class="col-sm-6"><button type="button" class="btn btn-primary" onclick="sync.doSync(\''+entries[i].name+'\');"><i class="fa fa-cloud-download fa-fw"></i>Sincronizza</button></div><div class="col-sm-6 text-right"><button type="button" class="btn btn-danger" onclick="sync.delete(\''+entries[i].name+'\');"><i class="fa fa-trash-o fa-fw"></i>Cancella</button></div></div>';
    		html += '</td>';
    		html += '</tr>';
    		// file da inviare
    		html += '<tr>';
    		html += '<td colspan="4" style="border: 1px solid black;">';
	    		html += '<table style="width:90%;" id="file_'+entries[i].name+'">';
	    		html += '<tr>';
	    		html += '<td>';
	    		html += 'File';
	    		html += '</td>';
	    		html += '<td>';
	    		html += 'Progresso';
	    		html += '</td>';
	    		html += '</tr>';
	    	    html += '</table>';
	    	    	
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
    $("#content_sync").html(html);
    
    // Popolo la tabella con i dati delle proprieta
    for (i=0; i<entries.length; i++) {
    	//alert(entries[i].name);
    	if (entries[i].isDirectory) {
    		prop.readPropFile(entries[i].name);
    	}
    }
}





function getPropPhotos(fileSystem) {
    fileSystem.root.getDirectory("artekasa/"+sync.dir, {create: false, exclusive: false}, getPropPhotosSuccess, dirFail);
}

function getPropPhotosSuccess(dirEntry) {
    // Get a directory reader
	var directoryReader = dirEntry.createReader();

    // Get a list of all the entries in the directory
	directoryReader.readEntries(photoReaderSuccess, dirFail);
    
}

function photoReaderSuccess(entries) {
    for (i=0; i<entries.length; i++) {
    	//alert(entries[i].name);
    	if (entries[i].isFile) {
    		//alert("tipo=" + entries[i].type);
    		//alert("photoReaderSuccess filename = " + entries[i].name);
    		sync.fileUpload(sync.dir, entries[i].fullPath);
    	}
    }
}



function Upfail(error) {
    alert("An error has occurred: Code = " = error.code);
    console.log("upload error source " + error.source);
    console.log("upload error target " + error.target);
}


function onPhotoUriSuccess(imageUriToUpload){
	//alert(imageUriToUpload);
    //var url=encodeURI("http://your_url_for_the_post/");
    var url=encodeURI(app_remote_url + "save_prop.php")

    var username='your_user';
    var password='your_pwd';

    var params = new Object();
    params.your_param_name = "something";  //you can send additional info with the file

    var options = new FileUploadOptions();
    options.fileKey = "file"; //depends on the api
    options.fileName = imageUriToUpload.substr(imageUriToUpload.lastIndexOf('/')+1);
    options.mimeType = "image/jpeg";
    options.params = params;
    options.chunkedMode = true; //this is important to send both data and files
    
    /*
    var headers={'Authorization':"Basic " + Base64.encode(username + ":" + password)};
    options.headers = headers;
	*/
    
    var ft = new FileTransfer();
    ft.upload(imageUriToUpload, url, Upwin, Upfail, options);

}


