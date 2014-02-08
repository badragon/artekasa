var agenda = {
    // Application Constructor
    initialize: function() {
        console.log('Agenda initialized.');
    	//navigator.notification.alert("Utente: " + app.userid, function() {});
    	
    	$("#content_agenda").html("Loading...");
    	agenda.getAgenda();
    },
    
    getAgenda: function() {
    	$("#content_agenda").html("Loaded");
    }
    
};