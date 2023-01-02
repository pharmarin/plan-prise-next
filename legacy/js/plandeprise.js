function ajout() {
    $("#choixMedic").select2("open");
}

function valproate() {
    var x;
    if (confirm("L\'ordonnance concerne-t-elle une fille, une adolescente ou une femme enceinte ou en âge de procréer ?") === true) {
        $.ajax({
             url : 'ajax/precautions.php', // La ressource ciblée
             type : 'GET', // Le type de la requête HTTP.
             data : 'precaution=valproate',
             dataType: 'html',
             success : function(){
                 window.location.reload();
              },
        });
    }
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
