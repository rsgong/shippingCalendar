// Threshold before the AJAX call aborts
var DISPLAY_TIMEOUT= 7000,

// Var to track whether the AJAX call aborts
aborted = false,


// Dummy address data to generate time in transit request
dummyAddress = {
  address1: "6222 Kellogg Drive",
  address_type: "residential",
  city: "McLean",
  country: "United States",
  state: "Virginia",
  zip: "22101"
},

// Dummy product lookup to retrieve manufacturing lead times
dummyProduct = "Exotic Meats Jerkygram",

DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday",
  "Thursday", "Friday", "Saturday"],

MONTH_NAMES = ["January", "February", "March", "April", "May",
  "June", "July", "August", "September", "October", "November", "December"];



// On page load, request time in transit requests
$(function(){
  // jsonp request
  var rateRequest = $.ajax({
    url: "https://struts.mancrates.com/core/shipping_rates/fedex.json",
    data: {
      address_info: dummyAddress,
      product_name: dummyProduct
    },
    dataType: "jsonp",
    jsonp: false,
    jsonpCallback: 'rates',
    success: function(results) {
      if (!aborted) {
        clearTimeout(fallbackTimer);
        displayShippingEstimates(results);
      }
    }
  });

  // Fallback timer
  var fallbackTimer = setTimeout(function () {
    aborted = true;
    // Show default shipping picker
    fallbackShippingEstimates();
  }, DISPLAY_TIMEOUT);

});

fallbackShippingEstimates = function (){
  $("li").show();
  $(".CalculatingShipping").hide();
  $(".ShippingContinueButton").show();
};

// Add time in transit date to shipping options
displayShippingEstimates = function(rateInfo) {
  var $field,
      $target;
  $("#shipping_loader").hide();
  $.each(rateInfo, function (tsepoch, service) {
    var $field = $(".ShipperName[data-ship-service='" + service.service_code + "']"),
        $li,
        $fixField,
        fixedName;

    // IE-proof date conversion
    var dateParts = service.delivery_date.split("T")[0].split("-");
    var arrivalDate = new Date(dateParts[0], parseInt(dateParts[1])-1, dateParts[2]);
    if ($field.length > 0) {

      $field.html(
          DAY_NAMES[arrivalDate.getUTCDay()] + ", " +
          MONTH_NAMES[arrivalDate.getUTCMonth()] + " " +
          arrivalDate.getUTCDate()
      );

      $field.closest("li").show();

    }
  });

  $(".ShippingContinueButton").show();
};
