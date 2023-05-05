function formatData (data) {
	if (!data.id) { return data.text; }

	var $data = '';
	if (data.dci) { 
		$data += '<div style="display:inline-block;float:right"><span style="text-align:right;font-style:italic; font-size:small; color:grey">' + data.dci + '</span></div>';
	}
	$data += '<div style:"display:inline-block"><span>' + data.text + ' </span></div>';

	return $(data);
}

function message(status, alerte) {
	var messageText = $('<div class="alert alert-' + status + ' error-message alert-fixed" style="display: none;">');
	messageText.append(alerte);
	messageText.appendTo($('#message')).fadeIn(300).delay(3000).fadeOut(500);
}

function divHover () {
	$('#planprise tr, .action').hover(function() {
	    $(this).find('.action').removeClass('hover');
	}, function() {
	    $(this).find('.action').addClass('hover');
	});

	$('.supprime').click(function(e) {
		e.preventDefault();
		var $this = $(this);
		$this.addClass('disabled');
		var id = $this.data('id');
		$.ajax({
			url: '/ajax/pp.ajax.php?supprime',
			type: 'get',
			data: "id_medic=" + id,
			dataType : 'text',
			cache: false,
			success: function() {
				$('.row_'+id).fadeOut();
				$(".print-precaution").load("index.php .print-precaution");
				$('#badgePP').html(function(i, val) { return val*1-1; }).addClass("badge");
				$this.removeClass('disabled');
			},
			error: function () {
				var texte = 'Le médicament n\'a pas pu être retiré du plan de prise. Merci de réessayer.';
				message ('warning', texte);
				$this.removeClass('disabled');
			}
		});

	});

	$('.resize').click(function(e) {
		e.preventDefault();
		var $this = $(this),
			$parent = $(this).closest("tr"),
			id = $this.data('id');
		$this.addClass('disabled');
		$.ajax({
			url: '/ajax/pp.ajax.php?resize',
			type: 'get',
			data: "id_medic=" + id,
			dataType : 'text',
			success: function() {
				$parent.find('.fusion').toggleClass('hidden');
				$parent.find('td.success').toggleClass('hidden');
				$parent.find('td.warning').toggleClass('hidden');
				$parent.find('td.danger').toggleClass('hidden');
				$this.removeClass('disabled');
			},
			error: function () {
				$this.removeClass('disabled');
			}
		});
	});
}

function loadEditable () {
	$('.modifiable').on('click', function (e) {
		e.preventDefault();
		$(this).attr('contenteditable', 'true').focus();
	}).on('focusout', function () {
		var $label = $(this).parents('label'),
		$check = $label.find('.check-commentaire');
		$check.addClass('hidden');
		$label.prepend('<span class="fa fa-circle-o-notch fa-spin check-loader"></span>');
		$(this).attr('contenteditable', 'false');
		$.ajax({
			url: 'editable_grid.php',
			type: 'post',
			data: 'pk=' + $(this).data('pk') + '&rang=' + $(this).data('params').rang + '&value=' + escape($(this).html()) + '&name=' + $(this).data('name'),
			dataType : 'text',
			contentType: "application/x-www-form-urlencoded;charset=utf-8",
			success: function() {
				$('.check-loader').remove();
				$check.removeClass('hidden');
			},
			error: function () {
				$('.check-loader').remove();
				$check.removeClass('hidden');
			}
		});
	});

	$.fn.editable.defaults.onblur = 'submit';
	$('.editable-inline').editable({
		mode:"inline",
		emptytext:"&nbsp; &nbsp; &nbsp; &nbsp; </br> &nbsp;",
		showbuttons: false
	});
	$('.editable-popup').editable({
		placement : 'bottom',
		emptytext:"&nbsp; &nbsp; &nbsp; &nbsp; </br> &nbsp;"
	});
	$('.editable-poso').editable({
		mode : 'inline',
		showbuttons : false,
		tpl : '<input type="text" style="width:4em;text-align:center">',
		emptytext:"&nbsp; &nbsp; &nbsp; &nbsp; </br> &nbsp;"
	});
	$('.editable-com').editable({
		mode : 'inline',
		showbuttons : false,
		emptytext:"Ajouter un commentaire",
		emptyclass: "com-empty"
	});
	$('.option').editable({
		mode : 'inline',
		showbuttons : false,
		emptytext:"Ajouter un commentaire",
		emptyclass: "com-empty",
		tpl: "<input type='text' class='option-item'>"
	});

	$('.choix').change(function() {
		var $this = $(this),
			texte = $this.data('texte'),
			id = $this.data('id'),
			action = $this.data('action'),
			cell = $this.parents('td');
		$.ajax({
	        url: '/ajax/pp.ajax.php?' + action,
	        type: 'get',
	        data: "id_medic=" + id + "&texte=" + texte,
	        dataType : 'text',
	        success: function() {
						if (action === 'indication') {
							var link = '<a href="#" class="indication-simple editable-inline" data-type="textarea" data-name="indication" data-pk="' + id + '" data-url="editable_grid.php">' + texte + '</a>';
							cell.html(link);
							loadEditable();
							if (texte === '') {
								cell.find('.modifiable').editable('toggle');
							}
						} else {
							cell.text(texte);
						}
	        },
	        error: function () {
			}
		});
	});
}

function selectAjout () {
	$("#choix-medic").select2({
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
				return {
					results: data
				};
			},
			cache: true
		},
		minimumInputLength: 3,
		theme: "bootstrap",
		templateResult: formatData
	}).select2("open");
}

function submitOnChange() {
	$('#choix-medic').on("select2:select", function() {
	    var $this = $(this),
		    id = $this.val(),
	    	spinner = '<tr class="progress hidden" id="spinner" style="margin-top:7px;"><td>';
			spinner += '<div class="progress-bar progress-bar-info progress-bar-striped active" role="progressbar" style="width:100%"></div>';
			spinner += '</td></tr>';
	    $('table').html(spinner);
	    if(id !== null) {
	        $.ajax({
	            url: '/ajax/pp.ajax.php?ajout',
	            type: 'get',
	            data: $this.serialize(),
	            dataType : 'json',
	            cache: false,
	            success: function(data) {
	            	if(data.error === 'success') {
	            		$("#loadPP").load('pp_include.php');
									$(".print-precaution").load("index.php .print-precaution");
		                $('#badgePP').html(function(i, val) {
		                	return val*1+1;
		                }).addClass("badge");
		                $('#PPrise').removeClass('hidden');
	                } else if (data.error === 'present') {
						var texte = '<strong>' + data.nom + '</strong> est déjà présent dans le plan de prise';
						message ('warning', texte);
	    				$('table').html(tableContent);
	                }
	            },
	            error: function () {
				    var texte = 'Le médicament n\'a pas pu être ajouté au plan de prise. Merci de réessayer.';
				    message ('danger', texte);
	    			$('table').html(tableContent);
				}
	        });
	    }
			$('.ajout-vide').remove();
			$('#boutonMedic').removeClass('hidden');
			$('.alert-info').addClass('hidden');
	    $(document).ajaxComplete(function () {
	    	loadEditable();
			divHover();
			checkComment();
		});
	});
}

function loadAjout() {
	tableContent = $('table').html();
	if ($('tbody').children().length === 0) {
		var select = '<form class="form-ajout ajout-vide" method="get" action="pp.ajax.php?ajout">';
			select += '<select id="choix-medic" class="form-control" name="id_medic">';
			select += '</select>';
			select += '</form>';
		$('#ajout-row').append(select);
		selectAjout();
		submitOnChange();
	}
}

function options() {
	$('#options').toggle();
	$('#boutonOptions').toggle();
}

$(document).ready(function() {

	divHover();
	loadEditable();
	loadAjout();
	checkComment();

    $('.button-checkbox').each(function () {

        // Settings
        var $widget = $(this),
            $button = $widget.find('button'),
            $checkbox = $widget.find('input:checkbox'),
            color = $button.data('color'),
            settings = {
                on: {
                    icon: 'glyphicon glyphicon-check'
                },
                off: {
                    icon: 'glyphicon glyphicon-unchecked'
                }
            };

        // Event Handlers
        $button.on('click', function () {
            $checkbox.prop('checked', !$checkbox.is(':checked'));
            $checkbox.triggerHandler('change');
            updateDisplay();
        });
        $checkbox.on('change', function () {
            $.ajax({
                url: '/ajax/pp.ajax.php?coucher',
                type: 'get',
                data: '',
                dataType : 'html',
                success: function() {
                	$('.posologie .info').toggleClass('hidden');
									options();
                	updateDisplay();
                }
            });
        });

        // Actions
        function updateDisplay() {
            var isChecked = $checkbox.is(':checked');

            // Set the button's state
            $button.data('state', (isChecked) ? "on" : "off");

            // Set the button's icon
            $button.find('.state-icon')
                .removeClass()
                .addClass('state-icon ' + settings[$button.data('state')].icon);

            // Update the button's color
            if (isChecked) {
                $button
                    .removeClass('btn-link')
                    .addClass('btn-' + color + ' active')
                    .html('&nbsp;Cacher une colonne coucher');
            }
            else {
                $button
                    .removeClass('btn-' + color + ' active')
                    .addClass('btn-link')
                    .html('&nbsp;Afficher une colonne coucher');
            }
            if ($button.find('.state-icon').length === 0) {
                $button.prepend('<i class="state-icon ' + settings[$button.data('state')].icon + '"></i>');
            }
        }

        updateDisplay();

    });

});

$('#ajouter-ligne').click(function () {
	if ($('.vide').length === 0) {
		$('table tr:last').clone().removeClass().addClass('vide').insertAfter("table tr:last").show();
		$('table tr:last td').empty();
		var select = '<form class="form-ajout" method="get" action="pp.ajax.php?ajout">';
			select += '<select id="choix-medic" class="form-control" name="id_medic">';
			select += '</select>';
			select += '</form>';
		var ntd = $('table tr:last').children('td').not('.hidden').length;
		ntd = --ntd;
		$('table tr:last td:first').html(select).attr('colspan', ntd);
		$('table tr:last td:not(:first)').addClass('hidden');
		selectAjout();
		submitOnChange();
	}
});

function checkComment () {
	$('.check-commentaire').change(function() {
		var $this = $(this),
			id = $this.data('id'),
			rang = $this.data('rang'),
			status = '', 
			$label = $(this).parents('label'),
			$check = $label.find('.check-commentaire');
		$check.addClass('hidden');
		$label.prepend('<span class="fa fa-circle-o-notch fa-spin check-loader"></span>');
		if ($this.prop('checked')) {
			status = 'checked';
		}
		$.ajax({
	        url: '/ajax/pp.ajax.php?commentaire',
	        type: 'get',
	        data: "id_medic=" + id + "&rang=" + rang + "&status=" + status,
	        dataType : 'text',
	        success: function() {
				if (status === 'checked') {
					$this.parent().find('.modifiable').removeClass('gris');
				} else {
					$this.parent().find('.modifiable').addClass('gris');
				}
				$('.check-loader').remove();
				$check.removeClass('hidden');
	        },
	        error: function () {
				console.log('Erreur lors du process AJAX-commentaire');
				$('.check-loader').remove();
				$check.removeClass('hidden');
			}
		});
	});
}

$('#bouton-options, #hide-options').click(function(){
	options();
});

jQuery.fn.selectText = function(){
   var doc = document;
   var element = this[0];
   console.log(this, element);
   if (doc.body.createTextRange) {
       var range = document.body.createTextRange();
       range.moveToElementText(element);
       range.select();
   } else if (window.getSelection) {
       var selection = window.getSelection();
       var range = document.createRange();
       range.selectNodeContents(element);
       selection.removeAllRanges();
       selection.addRange(range);
   }
};
