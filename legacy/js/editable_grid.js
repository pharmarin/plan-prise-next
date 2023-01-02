function loadEditable () {
	//toggle `popup` / `inline` mode
	$.fn.editable.defaults.mode = 'popup'; 
	$.fn.editable.defaults.onblur = 'submit'; 
	
	$('.indication-simple').editable();
	
	$('.indication-multi').editable({
		prepend:"Sélectionnez une indication", 
		mode:"inline", 
		emptyclass:"indication-empty", 
		emptytext:"Sélectionnez une indication", 
		showbuttons: false
	});
	
	$('.jour').editable({
		mode : 'inline',
		showbuttons : false, 
		tpl : '<input type="text" style="text-align:center">', 
		emptytext:"&nbsp; &nbsp; &nbsp; &nbsp; </br> &nbsp;"
	});
	
	$('.matin').editable({
		mode : 'inline',
		showbuttons : false, 
		tpl : '<input type="text" style="width:4em; text-align:center">', 
		emptytext:"&nbsp; &nbsp; &nbsp; &nbsp; </br> &nbsp;"
	});
	
	$('.midi').editable({
		mode : 'inline', 
		showbuttons : false, 
		tpl : '<input type="text" style="width:4em; text-align:center">', 
		emptytext:"&nbsp; &nbsp; &nbsp; &nbsp; </br> &nbsp;"
	});
	
	$('.soir').editable({
		mode : 'inline',
		showbuttons : false, 
		tpl : '<input type="text" style="width:4em; text-align:center">', 
		emptytext:"&nbsp; &nbsp; &nbsp; &nbsp; </br> &nbsp;"
	});
	
	$('.coucher').editable({
		mode : 'inline',
		showbuttons : false, 
		tpl : '<input type="text" style="width:4em; text-align:center">', 
		emptytext:"&nbsp; &nbsp; &nbsp; &nbsp; </br> &nbsp;"
	});
		
	$('.commentaire').editable({
		placement : 'left',
		emptytext:"&nbsp; &nbsp; &nbsp; &nbsp; </br> &nbsp;",
		emptyclass:"commentaire-empty"
	});
		
	$('.coordo').editable({
		mode : 'inline',
		showbuttons : false, 
		emptytext:"Vide"
	});
}
