function scrollToTop() {
	var verticalOffset = typeof(verticalOffset) !== 'undefined' ? verticalOffset : 0;
	var element = $('body'),
		offset = element.offset(),
		offsetTop = offset.top;
	$('html, body').animate({scrollTop: offsetTop}, 500, 'linear');
}

function message(status, alerte) {
	var messageText = $('<div class="alert alert-' + status + ' alert-fixed" style="display: none;">' + alerte + '</div>');
	messageText.appendTo($('body')).fadeIn(300).delay(3000).fadeOut(500);
}

function formatData (data) {
	if (!data.id) {
		return data.text;
	}
	var $data = $(
					'<div style="display:inline-block;float:right"><span style="text-align:right;font-style:italic; font-size:small; color:grey">' + data.dci + '</span></div><div style:"display:inline-block"><span>' + data.text + ' </span></div>'
				);
	return $data;
}

function ajoutPP(id, nom, attribut) {
	event.preventDefault();
	attribut.firstElementChild.className= "fa fa-circle-o-notch fa-spin";
	var texte = '';
		// Envoi de la requête HTTP en mode asynchrone
		$.ajax({
			url: '/ajax/pp.ajax.php',
			type: 'GET',
			data: 'ajout&id_medic=' + id,
			dataType: 'json',
			success: function(json) {
				if(json.error === 'success') {
					texte = '<strong>' + nom + '</strong> a été ajouté au plan de prise';
					message ('success', texte);
					attribut.firstElementChild.className="glyphicon glyphicon-plus";
					$('#badgePP').html(function(i, val) {
						return val*1+1;
					}).addClass("badge");
				} else if (json.error === 'present') {
					texte = '<strong>' + nom + '</strong> est déjà présent dans le plan de prise';
					message ('warning', texte);
					attribut.firstElementChild.className="glyphicon glyphicon-plus";
				} else {
					alert('Erreur : '+ json.error);
					attribut.firstElementChild.className="glyphicon glyphicon-plus";
				}
			},
			error: function () {
				var texte = 'Le médicament n\'a pas pu être ajouté au plan de prise. Merci de réessayer.';
				message ('danger', texte);
				attribut.firstElementChild.className="glyphicon glyphicon-plus";
			}
		});
}

$(document).ready(function() {
	$('.hoverable').click(function () {
		var $glyphicon = $(this).find('.glyphicon');
		$(this).parents('tr').find('.commentaire').toggle();
		$glyphicon.toggleClass('glyphicon-collapse-down glyphicon-collapse-up');
	});

	$(function(){
	    $(document).on( 'scroll', function(){

	    	if ($(window).scrollTop() > 100) {
				$('.scroll-top-wrapper').addClass('show');
			} else {
				$('.scroll-top-wrapper').removeClass('show');
			}
		});

		$('.scroll-top-wrapper').on('click', scrollToTop);
	});

	$('#chevron .fa').hover(
		function () {
			$('#voir small').toggle();
		}, function () {
			$('#voir small').toggle();
		}
	);

	$('#chevron .fa').click(function() {
		event.preventDefault();
		event.stopPropagation();
		var url = $(this).parent().attr('href');
		var hash = url.substring(url.indexOf('#'));
		$('html, body').animate( { scrollTop:    $(hash).offset().top }, 750 );
	});
});

$(".pagination li").click(function(e){
    e.preventDefault();
		var loading = '<tr><td class="loading"><div><span class="fa fa-plus fa-spin"></span></div></td></tr>';
    if ($(this).attr('class') !== 'disabled') {
	    $("table").html(loading);
	    $(".pagination li").removeClass('active');
	    $(this).addClass('active');
	    var pageNum = $(this).data('page');
	    $("table").load("tableau_include.php?page=" + pageNum);
    }
});

$(".pagination").change(function(e){
    e.preventDefault();
		var loading = '<tr><td class="loading"><div><span class="fa fa-plus fa-spin"></span></div></td></tr>';
	$("table").html(loading);
	var pageNum = $(this).find('option:selected').text();
    $("table").load("tableau_include.php?page=" + pageNum);
    $('.pagination').val(pageNum);
});

$("#choix-medic").select2({
	language: "fr",
	placeholder: "Cliquez pour ajouter un médicament au plan de prise",
	ajax: {
		url: "/ajax/choixMedic.php",
		dataType: 'json',
		delay: 250,
		data: function(params) {
			return {
				q: params.term
			};
		},
		processResults: function(data) {
			return {
				results: data
			};
		},
		cache: true
	},
	minimumInputLength: 3,
	templateResult: formatData
});

$('#choix-medic').on("select2:select", function() {
		var $this = $(this),
			id = $this.val(),
			texte = '';
		if (id !== null) {
				$.ajax({
						url: '/ajax/pp.ajax.php?ajout',
						type: 'get',
						data: $this.serialize(),
						dataType : 'json',
						cache: false,
						success: function(data) {
							if(data.error === 'success') {
								$('#badgePP').html(function(i, val) {
									return val*1+1;
								}).addClass("badge");
								texte = '<strong>' + $this.text() + '</strong> a été ajouté au plan de prise. ';
								message ('success', texte);
								$this.empty();
							} else if (data.error === 'present') {
								texte = '<strong>' + data.nom + '</strong> est déjà présent dans le plan de prise. ';
								message ('warning', texte);
							}
						},
						error: function () {
							texte = 'Le médicament n\'a pas pu être ajouté au plan de prise. Merci de réessayer.';
							message ('danger', texte);
					}
				});
		}
	});
