var prop = {
    // Application Constructor
    initialize: function() {
        console.log('Property initialized.');
        
        var data;
        this.data = '';
    	
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
        	$.mobile.changePage($("#prop"), "pop");
        });
    	
        $("#btnNewHouseSave")
        .on("click", function() {
        	window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, saveProp, fileFail);
        });
    },
    
    readPropFile: function(dir) {
		//alert("dir= " + dir);
    	//alert("inizio prop.propData="+this.propData);
    	window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
    		//alert("dir_2l= " + dir);
    		fileSystem.root.getFile("artekasa/"+dir+"/prop2.txt", {create: true}, function(fileEntry) {
    			fileEntry.file(function(file) {
    				var reader = new FileReader();
    			    reader.onloadend = function(evt) {
    			        console.log("Prop read as text");
    			        console.log(evt.target.result);
    			        prop.data = evt.target.result;
    			        console.log("END of Read as text");
    			    	if (prop.data == null || prop.data == '') {
    			    		//alert("File non trovato");
    			    	} else {
        			        //alert(prop.data);
        			        obj = JSON.parse(prop.data);
        			        //console.log(obj);
        			        var aTmp = new Array();
        			        $.each(obj,
        			        	    function(i, v) {
        			        	        console.log("i="+i+" -- v.name="+v.name+" -- v.value="+v.value);
        			        			aTmp[v.name] = v.value;
        			        	    });
        			        //alert(dir + " ==> "+ aTmp["a_data[PROP_REF]"]);
        			        //alert("prima= "+$("#prop_"+dir+"_PROP_REF").html());
        			        $("#prop_"+dir+"_PROP_REF").html(aTmp["a_data[PROP_REF]"]);
        			        //alert("dopo= "+$("#prop_"+dir+"_PROP_REF").html());
        			        $("#prop_"+dir+"_PROP_CITY").html(aTmp["a_data[PROP_CITY]"]);
        			        $("#prop_"+dir+"_PROP_ADDRESS").html(aTmp["a_data[PROP_ADDRESS]"]);
    			    	}
    			    };
    			    reader.readAsText(file);
    			}, fileFail);
    		}, fileFail);
    	}, fileFail);
    }
    
};


function saveProp(fileSystem) {
	var dir = $().crypt({method:"md5",source: $("#prop-ref").val()});
	var entry=fileSystem.root; 
    entry.getDirectory("artekasa/"+dir, {create: true, exclusive: false}, null, null);
    //fileSystem.root.getFile("artekasa/"+dir+"prop.txt", {create: true}, gotFileEntryW, fileFail);
    fileSystem.root.getFile("artekasa/"+dir+"/prop.txt", {create: true}, savePropW, fileFail);
    fileSystem.root.getFile("artekasa/"+dir+"/prop2.txt", {create: true}, savePropW2, fileFail);
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
    alert("Salvataggio effettuato con successo");
}

function savePropW2(fileEntry) {
    fileEntry.createWriter(function savePropWriter(writer) {
        writer.onwrite = function(evt) {
            console.log("write success");
        };
        var content = JSON.stringify($("#new-prop-content :input").serializeArray());
        alert(content);
        writer.write(content);
    }, fileFail);
}






