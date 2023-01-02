$(".add").click(function() {
	$(".clone").clone()
	.find("input[name='labo[]']").val("").end()
	.find("input[name='duree[]']").val("").end()
	.appendTo('#conservations_form').removeClass('clone hidden').addClass('cloned');
});

$('#conservations_form').submit(function(e) {
	e.preventDefault();
	var array = "{"; 
    $('.cloned').each(function (index, value) {
		array += '"' + $(this).find('input[name="labo"]').val() + '" : "' + $(this).find('input[name="duree"]').val() + '",';
	});
	array = array.slice(0,-1);
	array += "}";
	$('input[name="dureeConservation"]').val(array);
	$('#conservations').modal("hide");
});

$(document).ready (function () {
	loadPre();
});

function loadPre () {
	$.ajax({
	    url: 'log.php?ajax', 
	    type: 'GET', 
	    dataType: 'html', 
	    success: function (data) {
	    	affichePre(data);
	    }
	});
}

function affichePre (data) {
	$('.console').fadeOut();
	if (data.length > 0) {
		$('.console').html(data).fadeIn();
		setTimeout(loadPre, 10000);
	}
}