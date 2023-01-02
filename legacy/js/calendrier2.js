$("#choixMedic1").select2({
    language: "fr",
    ajax: {
        url: "/ajax/choixMedic.php",
        dataType: 'json',
        delay: 250,
        data: function (params) {
            return {
                q: params.term // search term
            };
        },
        processResults: function (data) {
            // parse the results into the format expected by Select2.
            // since we are using custom formatting functions we do not need to
            // alter the remote JSON data
            return {
                results: data
            };
        },
        cache: true
    },
    minimumInputLength:3 ,
                    templateResult: formatData
                });

                function formatData (data) {
          if (!data.id) { return data.text; }

          var $data = $(
                        '<div style="display:inline-block;float:right"><span style="text-align:right;font-style:italic; font-size:small; color:grey">' + data.dci + '</span></div><div style:"display:inline-block"><span>' + data.text + ' </span></div>'
                    );

                    return $data;
        }
$('.modal').on('shown.bs.modal', function () {
moment.locale('fr');

$(function() {

  $('input[name="date_debut[]"]').daterangepicker({
		autoUpdateInput: false,
		singleDatePicker: true,
			"locale": {
	        "format": "DD/MM/YYYY",
	        "separator": "/",
	      }
  });

	$('input[name="date_debut[]"]').on('apply.daterangepicker', function(ev, picker) {
		$(this).val(picker.startDate.format('DD/MM/YYYY'));
  });

  $('input[name="date_debut[]"]').on('cancel.daterangepicker', function(ev, picker) {
      $(this).val('');
  });

	$('input[name="date_fin[]"]').daterangepicker({
		autoUpdateInput: false,
		singleDatePicker: true
  });

	$('input[name="date_fin[]"]').on('apply.daterangepicker', function(ev, picker) {
		$(this).val(picker.startDate.format('DD/MM/YYYY'));
  });

  $('input[name="date_fin[]"]').on('cancel.daterangepicker', function(ev, picker) {
      $(this).val('');
  });

});
});
$('.modal').on('shown.bs.modal', function () {

	$(".compteur").TouchSpin({

  // Minimum value.
  min: 1,

  // Maximum value.
  max: 100,

  // Applied when no explicit value is set on the input with the value attribute.
  // Empty string means that the value remains empty on initialization.
  initval: '',
  replacementval: '',

  // Number of decimal points.
  decimals: 0,

  // none | floor | round | ceil
  forcestepdivisibility: 'round',

  // Enables the traditional up/down buttons.
  verticalbuttons: false,

  // Class of the up button with vertical buttons mode enabled.
  verticalupclass: 'glyphicon glyphicon-chevron-up',

  // Class of the down button with vertical buttons mode enabled.
  verticaldownclass: 'glyphicon glyphicon-chevron-down',

  // Incremental/decremental step on up/down change.
  step: 1,

  // Refresh rate of the spinner in milliseconds.
  stepinterval: 100,

  // Time in milliseconds before the spinner starts to spin.
  stepintervaldelay: 500,

  //  Class(es) of down button.
  buttondown_class: 'btn btn-default',

  //  Class(es) of up button.
  buttonup_class: 'btn btn-default',

  // Text for down button
  buttondown_txt: '-',

  // Text for up button
  buttonup_txt: '+'

});

$('input[id="date_debut1"]').daterangepicker({
		autoUpdateInput: false,
		singleDatePicker: true,
        minDate: moment(),
			"locale": {
		        "format": "DD/MM/YYYY",
		        "separator": "/"
		      }
	  });

	  $('input[id="date_debut1"]').on('apply.daterangepicker', function(ev, picker) {
        $(this).val(picker.startDate.format('DD/MM/YYYY'));
      });

      $('input[id="date_debut1"]').on('cancel.daterangepicker', function(ev, picker) {
          $(this).val('');
      });

		$('input[id="date_fin1"]').daterangepicker({
		autoUpdateInput: false,
		singleDatePicker: true,
        minDate: moment(),
			"locale": {
		        "format": "DD/MM/YYYY",
		        "separator": "/"
		      }
	  });

	  $('input[id="date_fin1"]').on('apply.daterangepicker', function(ev, picker) {
        $(this).val(picker.startDate.format('DD/MM/YYYY'));
      });

      $('input[id="date_fin1"]').on('cancel.daterangepicker', function(ev, picker) {
          $(this).val('');
      });

});

$('body').on('hidden.bs.modal', '.modal', function () {
  $(this).removeData('bs.modal');
});
