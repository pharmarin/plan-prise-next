<script>
	function message(status, alerte) {
		var messageText = $('<div class="alert alert-' + status + ' error-message alert-fixed" style="display: none;">');
		messageText.append(alerte);
		messageText.appendTo($('body')).fadeIn(300).delay(3000).fadeOut(500);
	}
	
<?php
use Illuminate\Support\Facades\Auth;

if (Auth::user()->admin): ?>
	function showSearch () {
		if ($(window).width() > 992) {
			$('.navbar-hide').hide();
		} else {
			$('.search-icon-top').hide();
		}
		$('.search-box-top, .navbar-search').css('display', 'inline');
		$('#search-top').focus();
	}
	
	$(document).ready(function() {
		
		$('.search-icon-top').click(function(e){
			e.preventDefault();
			showSearch();
		});
		
		$('.search-close-top').click(function(e){
			e.preventDefault();
			$('.navbar-hide').show();
			$('.search-icon-top').show();
			$('.search-box-top, .navbar-search').hide();
		});
		
	});
	
	$(window).bind('keydown', function(event) {
	    if (event.ctrlKey || event.metaKey) {
	        switch (String.fromCharCode(event.which).toLowerCase()) {
	        case 'f':
	            event.preventDefault();
	            showSearch();
	            break;
	        }
	    }
	});
<?php endif;
?>
	$(document).ready(function() {
	
		$('a.delete').on('click',function(e){
			var answer = confirm ('Voulez-vous vraiment effacer cet élément ? ');
			if (!answer) {
				e.preventDefault();   
			}
		});
		
		if ($(window).width() > 992) {
			$('#PP, #cal').hover(function () {
				$(this).find('.glyphicon').toggleClass('glyphicon-trash');
			}, function () {
				$(this).find('.glyphicon').toggleClass('glyphicon-trash');
			});
			$('#nom').show();
			$('#deco').hide();
			$('#nom, #deco').hover(function(){
				$('#nom').hide();
				$('#deco').show();
			}, function() {
				$('#nom').show();
				$('#deco').hide();
			});
		} else {
			$('#PP, #cal').find('.glyphicon').toggleClass('glyphicon-trash');
			$('#nom').hide();
			$('#deco').show();
		}
		
	    $('.navbar a[href="' + this.location.pathname + '"]').parent().addClass('active');
	});
</script>