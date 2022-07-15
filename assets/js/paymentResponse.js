"use strict";

$(document).ready(function () {
  var urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get("redirectResult") != null) {
    var queryKey = urlParams.get("redirectResult");

    $.ajax({
      type: "GET",
      url: "http://localhost:248/api/redirect?redirectData=" + queryKey,
      dataType: "json",
      success: function (json) {
        var items = [];
        if (json.resultCode == "Authorised") {
          items.push(
            "<h1>" +
              json.resultCode +
              "</h1> " +
              "<p> Currency : " +
              json.amount.currency +
              "</p> " +
              "<p>Amount : " +
              json.amount.value +
              "</p> " +
              "<p>Merchant Reference : " +
              json.merchantReference +
              "</p> " +
              "<p>psp Reference : " +
              json.pspReference +
              "</p> "
          );
        } else {
          items.push(
            "<h1>" +
              json.resultCode +
              "</h1> " +
              "<p>Reason : " +
              json.refusalReason +
              "</p> " +
              "<p>Merchant Reference : " +
              json.merchantReference +
              "</p> " +
              "<p>psp Reference : " +
              json.pspReference +
              "</p> "
          );
        }
        $("#reciept").append(items);
      },
    });
  } else {
    var queryKey = urlParams.get("res");
    var res = JSON.parse(queryKey);

    var items = [];
    if (res.resultCode == "Authorised") {
      items.push(
        "<h1>" +
          res.resultCode +
          "</h1> " +
          "<p> Currency : " +
          res.amount.currency +
          "</p> " +
          "<p>Amount : " +
          res.amount.value +
          "</p> " +
          "<p>Merchant Reference : " +
          res.merchantReference +
          "</p> " +
          "<p>psp Reference : " +
          res.pspReference +
          "</p> "
      );
    } else {
      items.push(
        "<h1>" +
          res.resultCode +
          "</h1> " +
          "<p>Reason : " +
          res.refusalReason +
          "</p> " +
          "<p>Merchant Reference : " +
          res.merchantReference +
          "</p> " +
          "<p>psp Reference : " +
          res.pspReference +
          "</p> "
      );
    }
    $("#reciept").append(items);
  }
});
