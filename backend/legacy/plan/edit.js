initEditTable();

function initEditTable () {
	var content;
	$("[contenteditable='true']").hover(function() {
		if ($(this).is('.commentaire-line, .commentaire-perso')) {
			$(this).addClass('hover');
		} else {
			$(this).parents('td').addClass('hover');
		}
	}, function() {
		if ($(this).is('.commentaire-line, .commentaire-perso')) {
			$(this).removeClass('hover');
		} else {
			$(this).parents('td').removeClass('hover');
		}
	}).on('focusin', function () {
		content = $(this).text();
	}).on('focusout', function (e) {
		console.log('FOCUSOUT ' + $(this).attr('class'));
		if ($(this).text() != content) {
			$('body').focus();
			toggleLoader('on');
			var type = $(this).data('type'), 
				value = $(this).html(), 
				row = $(this).data('row'),
				id_plan = $('table').data('id_plan');
			if ($(this).next().next().is('a')) {
				value += " " + $(this).next().next().outerHTML();
			}
			value = escape(value);
			var ajaxData = 'update=&type=' + type + '&value=' + value + '&row=' + row + '&id_plan=' + id_plan;
			if (type == 'text' || type == 'status') {
				var rang = $(this).data('rang');
				ajaxData += '&rang=' + rang;
			}
			//console.log('EDIT: UPDATE ' + type + ' VALUE: ' + value);
			$.ajax({
				url: '/plan/actions.php',
				type: 'POST',
				data: ajaxData,
				dataType : 'text',
				contentType: "application/x-www-form-urlencoded;charset=utf-8",
				tryCount : 0,
				retryLimit : 1,
				success: function() {
					toggleLoader('off');
				},
				error: function (xhr, textStatus, errorThrown) {
					console.log(xhr);
					console.log(textStatus);
					console.log(errorThrown);
					if (textStatus) {
						this.tryCount++;
						if (this.tryCount <= this.retryLimit) {
						    $.ajax(this);
						    return;
						}            
					}
					toggleLoader('error', 'Les modifications que vous avez effectué n\'ont pas pu être enregistrées. Merci de réessayer. ');
				}, 
			timeout: 15000
			});
		}
	});
	$("input[type='checkbox'].editable").on('change', function () {
		toggleLoader('on');
		var $this = $(this),
			type = $(this).data('type'), 
			row = $(this).data('row'),
			id_plan = $('table').data('id_plan');
		if ($(this).prop('checked')) {
			value = 'checked';
		} else {
			value = '';
		}
		var ajaxData = 'update=&type=' + type + '&value=' + value + '&row=' + row + '&id_plan=' + id_plan;
		if (type == 'text' || type == 'status') {
			var rang = $(this).data('rang');
			ajaxData += '&rang=' + rang;
		}
		$.ajax({
			url: '/plan/actions.php',
			type: 'POST',
			data: ajaxData,
			dataType : 'text',
			contentType: "application/x-www-form-urlencoded;charset=utf-8",
			tryCount : 0,
			retryLimit : 1,
			success: function() {
				toggleLoader('off');
				console.log("Comment toggled");
				if (value == 'checked') {
					$this.parent().find('span.editable').removeClass('notSelected');
				} else {
					$this.parent().find('span.editable').addClass('notSelected');
				}
			},
			error: function (xhr, textStatus, errorThrown) {
				if (textStatus) {
					this.tryCount++;
					if (this.tryCount <= this.retryLimit) {
					    $.ajax(this);
					    return;
					}            
				}
				toggleLoader('error');
			}, 
			timeout: 15000
		});
	});
	$("input[type='checkbox'].option").on('click', function (e) {
		if (!$("table").data('id_plan')) {
			e.preventDefault();
			return;
		}
		toggleLoader('on');
		var type = $(this).attr('name'), 
			value = [],
			key = $(this).attr('value'),
			id_plan = $('table').data('id_plan');
		$("input[type='checkbox'].option").each(function() {
			if ($(this).prop('checked')) {
				value.push($(this).attr('value'));
			}
		});
		var ajaxData = 'option=&type=' + type + '&value=' + value + '&id_plan=' + id_plan;
		$.ajax({
			url: '/plan/actions.php',
			type: 'POST',
			data: ajaxData,
			dataType : 'text',
			contentType: "application/x-www-form-urlencoded;charset=utf-8",
			tryCount : 0,
			retryLimit : 1,
			success: function() {
				loadBox(id_plan);
			},
			error: function (xhr, textStatus, errorThrown) {
				if (textStatus) {
					this.tryCount++;
					if (this.tryCount <= this.retryLimit) {
					    $.ajax(this);
					    return;
					}            
				}
				toggleLoader('error');
			}, 
			timeout: 5000
		});
	});
	$("input[type='radio'].editable").on('change', function () {
		toggleLoader('on');
		var type = $(this).data('type'), 
			row = $(this).data('row'),
			id_plan = $('table').data('id_plan'), 
			value = $(this).parent().text();
		if (type == 'dureeConservation') {
			value = $(this).data('value');
		}
		var ajaxData = 'update=&type=' + type + '&value=' + value + '&row=' + row + '&id_plan=' + id_plan;
		$.ajax({
			url: '/plan/actions.php',
			type: 'POST',
			data: ajaxData,
			dataType : 'text',
			contentType: "application/x-www-form-urlencoded;charset=utf-8",
			tryCount : 0,
			retryLimit : 1,
			success: function() {
				loadBox(id_plan);
			},
			error: function (xhr, textStatus, errorThrown) {
				if (textStatus) {
					this.tryCount++;
					if (this.tryCount <= this.retryLimit) {
					    $.ajax(this);
					    return;
					}            
				}
				toggleLoader('error', 'Un problème est survenu. Merci de réessayer. ');
			}, 
			timeout: 15000
		});
	});
	$(".remove").on('click', function () {
		toggleLoader('on');
		var row = $(this).data('row'),
			id_plan = $('table').data('id_plan');
		var ajaxData = 'remove=&row=' + row + '&id_plan=' + id_plan;
		$.ajax({
			url: '/plan/actions.php',
			type: 'POST',
			data: ajaxData,
			dataType : 'text',
			contentType: "application/x-www-form-urlencoded;charset=utf-8",
			tryCount : 0,
			retryLimit : 1,
			success: function() {
				location.reload();
			},
			error: function (xhr, textStatus, errorThrown) {
				if (textStatus) {
					this.tryCount++;
					if (this.tryCount <= this.retryLimit) {
					    $.ajax(this);
					    return;
					}            
				}
				toggleLoader('error', 'Un problème est survenu. Merci de réessayer. ');
			}, 
			timeout: 15000
		});
	});
}

(function($) {
    $.extend({
        outerHTML: function() {
            var $ele = arguments[0],
                args = Array.prototype.slice.call(arguments, 1)
            if ($ele && !($ele instanceof jQuery) && (typeof $ele == 'string' || $ele instanceof HTMLCollection || $ele instanceof Array)) $ele = $($ele);
            if ($ele.length) {
                if ($ele.length == 1) return $ele[0].outerHTML;
                else return $.map($("div"), function(ele,i) { return ele.outerHTML; });
            }
            throw new Error("Invalid Selector");
        }
    })
    $.fn.extend({
        outerHTML: function() {
            var args = [this];
            if (arguments.length) for (x in arguments) args.push(arguments[x]);
            return $.outerHTML.apply($, args);
        }
    });
})(jQuery);