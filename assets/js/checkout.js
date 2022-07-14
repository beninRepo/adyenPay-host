"use strict";

$(document).ready(function () {
  getClientKey();

  function createDropin(clientkey) {
    $.ajax({
      type: "GET",
      url: "http://localhost:248/api/payment",
      dataType: "json",
      success: function (json) {
        var dt = json.paymentMethods;
        console.log(json);
        const cardConfiguration = {
          hasHolderName: true,
          holderNameRequired: true,
          enableStoreDetails: true,
          name: "Credit or debit card",
          billingAddressRequired: true,
        };
        const configuration = {
          locale: "en_US",
          environment: "test",
          paymentMethodsResponse: json,
          clientKey: clientkey,
          //session: {
          //   id: json.id, // Unique identifier for the payment session.
          //  sessionData: json.sessionData // The payment session data.
          // },

          analytics: {
            enabled: false, // Set to false to not send analytics data to Adyen.
          },
          showPayButton: true,
          onSubmit: (state, dropin) => {
            // Global configuration for onSubmit
            // Your function calling your server to make the `/payments` request
            makePayment(state.data, dropin);
          },
          onAdditionalDetails: (state, dropin) => {
            // Your function calling your server to make a `/payments/details` request
            makeDetailsCall(state.data)
              .then((response) => {
                if (response.action) {
                  // Drop-in handles the action object from the /payments response
                  dropin.handleAction(response.action);
                } else {
                  // Your function to show the final result to the shopper
                  showFinalResult(response);
                }
              })
              .catch((error) => {
                throw Error(error);
              });
          },
          paymentMethodsConfiguration: {
            ideal: {
              showImage: true,
            },

            card: cardConfiguration,
          },
        };

        AdyenCheckout(configuration).then((checkout) => {
          checkout
            .create("dropin")
            .mount(document.getElementById("dropin-container"));
        });

        function makePayment(stateData, dropin) {
          //var paymentMethod=stateData;
          var paymentQueryString = stateData;
          if (stateData.paymentMethod.type == "scheme") {
            paymentQueryString = JSON.stringify(stateData);
          } else {
            paymentQueryString = JSON.stringify(stateData.paymentMethod);
          }
          console.log(paymentQueryString);
          $.ajax({
            type: "GET",
            url:
              "http://localhost:248/api/makepayment?paymentMethod=" +
              encodeURIComponent(paymentQueryString),
            dataType: "json",
            success: function (json) {
              if (json.action) {
                // Drop-in handles the action object from the /payments response
                dropin.handleAction(json.action);
              } else {
                // Your function to show the final result to the shopper
                showFinalResult(json);
              }
            },
          });
        }
        function showFinalResult(json) {
          console.log(json);
          window.location.replace(
            "http://localhost:3000/paymentResponse.html?res=" +
              encodeURIComponent(JSON.stringify(json))
          );
        }
      },
    });
  }

  function getClientKey() {
    console.log("funkey");
    $.ajax({
      type: "GET",
      url: "http://localhost:248/api/clientKey",
      dataType: "text",
      success: function (clientkey) {
        createDropin(clientkey.replaceAll('"', ""));
      },
    });
  }
});
