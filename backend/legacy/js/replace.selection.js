function commande(nom, argument) {
	event.preventDefault();
    if (typeof argument === 'undefined') {
        argument = '';
    }
    document.execCommand(nom, false, argument);
}

function result(){
    document.getElementById("resultat").value = document.getElementById("editeur").innerHTML;
}

$('#editeur, .btn').click(function () {
	if(document.queryCommandState("bold")){
	    document.getElementById("btn-bold").className="btn btn-primary";
	}
	else{
	    document.getElementById("btn-bold").className = "btn btn-default";
	}
	
	if(document.queryCommandState("italic")){
	    document.getElementById("btn-italic").className = "btn btn-primary";
	}
	else{
	    document.getElementById("btn-italic").className = "btn btn-default";
	}
	
	if(document.queryCommandState("underline")){
	    document.getElementById("btn-underline").className = "btn btn-primary";
	}
	else{
	    document.getElementById("btn-underline").className = "btn btn-default";
	}
	
	if(document.queryCommandState("superscript")){
	    document.getElementById("btn-superscript").className = "btn btn-primary";
	}
	else{
	    document.getElementById("btn-superscript").className = "btn btn-default";
	}
	
	if(document.queryCommandState("subscript")){
	    document.getElementById("btn-subscript").className = "btn btn-primary";
	}
	else{
	    document.getElementById("btn-subscript").className = "btn btn-default";
	}
});