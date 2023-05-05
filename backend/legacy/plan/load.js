$(document).ready(function () {
  $('[data-toggle="tooltip"]').tooltip();
});

function toggleLoader(status, msg) {
  if (!msg) {
    msg = "";
  }
  switch (status) {
    case "on":
      $("#mask").show();
      $("#mask-content").css("opacity", "0.3");
      break;
    case "off":
      $("#mask").hide();
      $("#mask-content").css("opacity", "1");
      break;
    case "error":
      var mask = $("#mask"),
        text = mask.find(".text-center").text();
      console.log(text);
      mask.find(".text-center").text(msg);
      mask
        .find(".progress-bar")
        .removeClass("progress-bar-success")
        .addClass("progress-bar-danger")
        .delay(5000)
        .queue(function () {
          toggleLoader("off");
          mask
            .find(".progress-bar")
            .addClass("progress-bar-success")
            .removeClass("progress-bar-danger");
          mask.find(".text-center").text(text);
          location.reload();
        });
      break;
  }
}

function loadBox(id_plan) {
  console.log("Initiation de loadBox. id = " + id_plan);
  if (!id_plan) {
    id_plan = null;
  }
  if ($("#mask").is(":hidden")) {
    toggleLoader("on");
  }
  if (id_plan !== null) {
    $("#include-box").load(
      "/plan/?id=" + id_plan + " table, .precautions",
      function (response, status, xhr) {
        console.log("Load: /plan/?id=" + id_plan);
        if (status == "success") {
          toggleLoader("off");
        } else {
          location.reload();
        }
      }
    );
    var obj = {
      Title: "Plan de prise",
      Url: "/plan/?id=" + id_plan,
    };
    $(".navbar-fixed-top").load("/plan/?id=" + id_plan + " .nav-content");
    $('input[name="id"]').attr("value", id_plan);
    history.pushState(obj, obj.Title, obj.Url);
  } else {
    location.reload();
  }
  $(document).ajaxComplete(function () {
    $("[contenteditable='true']").off("focusin").off("focusout");
    $("input[type='checkbox'].editable").off("change");
    $("input[type='checkbox'].option").off("click");
    $("input[type='radio'].editable").off("change");
    $(".remove").off("click");
    initEditTable();
  });
}
