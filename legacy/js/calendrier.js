$(document).ready(function(){
    $('[data-toggle="tooltip"]').tooltip();
});

$("select[name='id_medic']").select2({
    language: "fr",
    placeholder: 'Sélectionnez un médicament',
    ajax: {
        url: "/ajax/choixMedic.php",
        dataType: 'json',
        delay: 250,
        data: function (params) {
            return {
                q: params.term,
      					options: 'add'
            };
        },
        processResults: function (data) {
            return {
                results: data
            };
        },
        cache: true
    },
    minimumInputLength:3,
        templateResult: formatData
});

function formatData (data) {
	if (!data.id) { return data.text; }
	var $data = $(
		'<div style="display:inline-block;float:right"><span style="text-align:right;font-style:italic; font-size:small; color:grey">' + data.dci + '</span></div><div style:"display:inline-block"><span>' + data.text + ' </span></div>'
	);
	return $data;
}

var counter = $('.formulaire').length;

function initPicker (number) {
  if (!number) {
    number = 0;
  } else {
		var dates = $('#date' + (number - 1)).val();
		if (dates === undefined) dates = $('#date' + (number - 2)).val();
		if (dates === undefined) dates = $('#date' + (number - 3)).val();
		if (dates === undefined) dates = $('#date' + (number - 4)).val();
		//console.log(dates);
	}
	var idinput = '#date' + number,
		idcontainer = '#date_container' + number;
	$(idinput).dateRangePicker(
		{
			startOfWeek: 'monday',
			language: 'fr',
			format: 'DD/MM/YYYY',
			separator: ' au ',
			inline:true,
			container: idcontainer,
			alwaysOpen:true,
			stickyMonths: true,
			beforeShowDay: function(t)
				{
					//console.debug(t.getYear())
					var valid = t;
					if (dates !== undefined && dates.length > 4) {
						//console.log(dates);
						var dates2 = dates.split(" au ");
						var firstdate = dates2[0].split("/");
						var lastdate = dates2[1].split("/");
						var year = t.getFullYear();
						var month = t.getMonth() + 1;
						var day = t.getDate();
						//console.log(firstdate[2]);
						valid = !(((year <= lastdate[2]) && (month < lastdate[1])) || (year == lastdate[2]) && (month == lastdate[1]) && (day <= lastdate[0]));
						//console.log(year + "/" + firstdate[2] +" " +lastdate[2]);
						//console.log(month + "/" + firstdate[1] +" " +lastdate[1]);
					}
					var _class = '';
					var _tooltip = '';
					return [valid,_class,_tooltip];
				}
		}
	);

	testRemoveBtn ();
	initRemoveBtn ();
}

function testRemoveBtn () {
	$('form.box-wrapper').each(function() {
		if ($(this).find('.formulaire').length <= 1) {
			$(this).find('.remove-period').hide();
		} else {
			$(this).find('.remove-period').show();
		}
	});
}

$('a.add-period').on('click', function(e) {
	e.preventDefault();
	var style = $(this).data("style"),
		form = '<hr/><div class="formulaire"><div class="row">';
		form += '<div class="form-group col-xs-12 unites">';
		form += '<input id="nombre" name="nombre[]" type="text" min="0" class="form-control input-sm">';
		form += '<label> unité(s) de prise tous les </label>';
		form += '<input id="frequence" name="frequence[]" type="text" min="1" class="form-control input-sm">';
		form += '<label> jours</label>';
		form += '<a href="#" class="btn btn-round btn-xs btn-danger remove-period" data-toggle="tooltip" data-placement="left" title="Supprimer cette période"><span class="glyphicon glyphicon-remove"></span></a>';
		form += '</div></div>';
		form += '<div class="row">';
		form += '<div class="form-group col-xs-12 periode">';
		form += '<input name="dates[]" type="text" class="form-control input-sm hidden" id="date' + counter + '">';
		form += '<div id="date_container' + counter + '" class="date_container date-' + style + '"></div>';
		form += '</div></div></div>';
	$(form).insertAfter($(this).parents('form').find('.formulaire').last());
	initPicker(counter);
	counter++;
});

function initRemoveBtn () {
	$('a.remove-period').on('click', function (e) {
		e.preventDefault();
		if ($(this).parents('form').find('.formulaire').length > 1) {
			$(this).parents('.formulaire').next('hr').remove();
			$(this).parents('.formulaire').remove();
		}
		testRemoveBtn ();
	});
}

//===== SCROLLER
var currentIdx = 1;
$("#scroller").click(function(e){
	e.preventDefault();
	jQuery.easing.def = "easeInOutQuad";
	$('.table-responsive').animate({
		scrollLeft: 490*currentIdx
	}, 600);
	currentIdx++;
});
