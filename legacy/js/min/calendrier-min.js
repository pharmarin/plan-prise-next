function formatData(t){if(!t.id)return t.text;var a=$('<div style="display:inline-block;float:right"><span style="text-align:right;font-style:italic; font-size:small; color:grey">'+t.dci+'</span></div><div style:"display:inline-block"><span>'+t.text+" </span></div>");return a}$("#choixMedic1").select2({language:"fr",ajax:{url:"/ajax/choixMedic.php",dataType:"json",delay:250,data:function(t){return{q:t.term}},processResults:function(t){return{results:t}},cache:!0},minimumInputLength:3,templateResult:formatData}),$(".modal").on("shown.bs.modal",function(){moment.locale("fr"),$(function(){$('input[name="date_debut[]"]').daterangepicker({autoUpdateInput:!1,singleDatePicker:!0,locale:{format:"DD/MM/YYYY",separator:"/"}}),$('input[name="date_debut[]"]').on("apply.daterangepicker",function(t,a){$(this).val(a.startDate.format("DD/MM/YYYY"))}),$('input[name="date_debut[]"]').on("cancel.daterangepicker",function(t,a){$(this).val("")}),$('input[name="date_fin[]"]').daterangepicker({autoUpdateInput:!1,singleDatePicker:!0}),$('input[name="date_fin[]"]').on("apply.daterangepicker",function(t,a){$(this).val(a.startDate.format("DD/MM/YYYY"))}),$('input[name="date_fin[]"]').on("cancel.daterangepicker",function(t,a){$(this).val("")})})}),$(".modal").on("shown.bs.modal",function(){$(".compteur").TouchSpin({min:1,max:100,initval:"",replacementval:"",decimals:0,forcestepdivisibility:"round",verticalbuttons:!1,verticalupclass:"glyphicon glyphicon-chevron-up",verticaldownclass:"glyphicon glyphicon-chevron-down",step:1,stepinterval:100,stepintervaldelay:500,buttondown_class:"btn btn-default",buttonup_class:"btn btn-default",buttondown_txt:"-",buttonup_txt:"+"}),$('input[id="date_debut1"]').daterangepicker({autoUpdateInput:!1,singleDatePicker:!0,minDate:moment(),locale:{format:"DD/MM/YYYY",separator:"/"}}),$('input[id="date_debut1"]').on("apply.daterangepicker",function(t,a){$(this).val(a.startDate.format("DD/MM/YYYY"))}),$('input[id="date_debut1"]').on("cancel.daterangepicker",function(t,a){$(this).val("")}),$('input[id="date_fin1"]').daterangepicker({autoUpdateInput:!1,singleDatePicker:!0,minDate:moment(),locale:{format:"DD/MM/YYYY",separator:"/"}}),$('input[id="date_fin1"]').on("apply.daterangepicker",function(t,a){$(this).val(a.startDate.format("DD/MM/YYYY"))}),$('input[id="date_fin1"]').on("cancel.daterangepicker",function(t,a){$(this).val("")})}),$("body").on("hidden.bs.modal",".modal",function(){$(this).removeData("bs.modal")});