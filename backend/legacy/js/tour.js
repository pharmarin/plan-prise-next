// Instance the tour
var tour = {
	id: "bienvenue",
	steps: [
		{
			target: "#contenu_intro h1",
			title: "Bienvenue !",
			content: "Bienvenue sur le site. C'est la première fois que vous vous connectez, nous vous proposons de découvrir quelques fonctionnalités.", 
			placement: "bottom", 
			xOffset: "center"
		},
		{
			target: "ajout-pp",
			title: "Title of my step",
			content: "Content of my step", 
			placement: "top"
		}, 
		{
			target: "medicaments",
			title: "Title of my step",
			content: "Content of my step", 
			placement: "top", 
			multipage: true, 
			onNext: function () {
				$.ajax({
					url: '/ajax/pp.ajax.php', 
					type: 'GET', 
					data: 'ajout&id_medic=142', 
					dataType : 'html',
					success: function(data) {
						alert(data);
						window.location = "plandeprise.php";
					}
				});
			}
		}, 
		{
			target: "PPrise",
			title: "Bienvenue !",
			content: "Blablabla.", 
			placement: "bottom", 
			xOffset: "center"
		}
	], 
	i18n: {
		nextBtn: "Suivant", 
		prevBtn: "Précédent",
        doneBtn: "Terminer",
        skipBtn: "passer",
        closeTooltip: "Fermer"
	}
};

$('#aide').click(function () {
	hopscotch.startTour(tour);
});