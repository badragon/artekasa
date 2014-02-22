var appdb = {
		
    // Application Constructor
    initialize: function() {
        console.log('Db initialized.');
        
        
        db.transaction(appdb.populateDB, appdb.errorCB, appdb.successCB);
    },
    


    // Populate the database 
    //
    populateDB: function(tx) {
         //tx.executeSql('DROP TABLE IF EXISTS DEMO');
         //tx.executeSql('CREATE TABLE IF NOT EXISTS DEMO (id unique, data)');
         //tx.executeSql('INSERT INTO DEMO (id, data) VALUES (1, "First row")');
         //tx.executeSql('INSERT INTO DEMO (id, data) VALUES (2, "Second row")');
         
    	 tx.executeSql('SELECT * FROM DEMO', [], appdb.querySuccess, appdb.errorCB);
         
    },
    
    saveImage: function(img) {
        //tx.executeSql('DROP TABLE IF EXISTS DEMO');
        //tx.executeSql('CREATE TABLE IF NOT EXISTS DEMO (id unique, data)');
        //tx.executeSql('INSERT INTO DEMO (id, data) VALUES (1, "First row")');
    	alert('1');
    	console.log("IMG= " + img);
    	db.transaction(function (tx) {
    		tx.executeSql('INSERT INTO DEMO (id, data) VALUES (3, "'+img+'")');
    	}, appdb.errorCB, appdb.successCB);
    	alert('2');
   },

    // Transaction error callback
    //
    errorCB: function(err) {
        alert("Error processing SQL: "+err);
    },

    // Transaction success callback
    //
    successCB: function() {
        alert("success!");
    },

    // Transaction error callback
    //
    querySuccess: function(tx, results) {
        // the number of rows returned by the select statement
    	var len = results.rows.length;
    	console.log("DEMO table: " + len + " rows found.");
    	for (var i=0; i<len; i++){
    	    console.log("Row = " + i + " ID = " + results.rows.item(i).id + " Data =  " + results.rows.item(i).data);
    	}
    }
    
};