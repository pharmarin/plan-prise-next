initSelect();
submitOnChange();

function formatData (data) {
	if (!data.id) { return data.text; }

	var $data = $(
	    '<div style="display:inline-block;float:right"><span style="text-align:right;font-style:italic; font-size:small; color:grey">' + data.dci + '</span></div><div style:"display:inline-block"><span>' + data.text + ' </span></div>'
	);

	return $data;
}

function initSelect () {
	$("#choix-medic").select2({
		language: "fr",
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
		placeholder: "Ajouter un médicament au plan de prise. ",
		minimumInputLength: 3,
		templateResult: formatData
	})//.select2("open");
}

function submitOnChange() {
	$('#choix-medic').on("select2:select", function() {
		if($(this).val() !== null) {
			var id_plan = $("table").data('id_plan');
			if (!$("table").data('id_plan')) {
				id_plan = 'new';
			}
			toggleLoader('on');
			$.ajax({
				url: '/plan/actions.php',
				type: 'POST',
				data: "add=&id_medic=" + escape($(this).val()) + "&id_plan=" + id_plan,
				dataType : 'json',
				cache: false,
				success: function(data) {
					if(data.status === 'success') {
						console.log("Nouveau médicament ajouté au plan de prise. ");
						if (id_plan == 'new') {
					        console.log("Nouveau plan de prise créé : " + data.id + ". Nous essayons de le charger. ");
					        loadBox(data.id);
						} else {
							loadBox(id_plan);
						}
						console.log("Added item to plan : " + id_plan);
					} else if (data.status === 'present') {
						toggleLoader('error', '<strong>' + data.name + '</strong> est déjà présent dans le plan de prise');
					}
				},
				error: function () {
					toggleLoader('error', 'Le médicament n\'a pas pu être ajouté au plan de prise. Merci de réessayer.');
				}
			});
		}
		$(document).ajaxComplete(function () {
			$('#choix-medic').val(null).trigger("change");
		});
	});
}