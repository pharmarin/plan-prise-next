// Instance the tour
var tour = {
	id: "plandeprise",
	steps: [
		{
			target: "PPrise",
			title: "Bienvenue !",
			content: "Bienvenue sur le site. C'est la première fois que vous vous connectez, nous vous proposons de découvrir quelques fonctionnalités.", 
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

hopscotch.startTour(tour);