$(document).ready(function() {
    //toggle `popup` / `inline` mode
    $.fn.editable.defaults.mode = 'popup'; 
    $.fn.editable.defaults.onblur = 'submit'; 
    

    $('.modif').editable({
    	mode : 'inline',
    	showbuttons : false, 
      	tpl : '<input type="text" style="text-align:center">'
    });
    $('.modif_commentaire').editable({
    	mode : 'inline',
    	showbuttons : false, 
    	tpl : '<textarea cols="70"></textarea>'
    });
    
});