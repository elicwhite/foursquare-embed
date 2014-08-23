function gid(id) {
  return document.getElementById(id);
}

function getQueryVariables() {
  var obj = {};

  var query = window.location.search.substring(1);
  var vars = query.split('&');
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split('=');
    obj[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
  }

  return obj;
}

var pageParams = getQueryVariables();

function init() {
  var venueId = "4d52f677253d6a314aa77629";

  if (pageParams["venue"]) {
    venueId = pageParams["venue"];
  }

  var clientId = "V4AP0ACTWURP5EPUN1MTBUGRPHS0DADWBXE5F33CIU4MZ24C";
  var clientSecret = "LGDJS2YQXBY4YPBY30QCP2F1CL2O5KQUUCFYYZAS4NUDPMUZ";

  var prefix = "https://api.foursquare.com/v2";
  var suffix = "?client_id=" + clientId + "&client_secret=" + clientSecret + "&v=20140823";

  var url = prefix + "/venues/" + venueId + suffix;

  request = new XMLHttpRequest();
  request.open('GET', url, true);

  request.onload = function() {
    if (request.status >= 200 && request.status < 400) {
      // Success!
      data = JSON.parse(request.responseText);

      var venue = data.response.venue;
      console.log(venue);

      // debugger;

      var firstIcon = venue.categories[0].icon;

      var photoUrl = firstIcon.prefix + "bg_88" + firstIcon.suffix;
      var homeCity = venue.location.city + ", " + venue.location.state;

      if (venue.page) {
        var photo = venue.page.user.photo;
        photoUrl = photo.prefix + "88x88" + photo.suffix;

        homeCity = venue.page.user.homeCity;
      }



      gid("image").src = photoUrl;
      gid("venueName").textContent = venue.name;

      var temp = document.createElement("div");
      for (var i = 0; i < venue.categories.length; i++) {
        var category = venue.categories[i];

        var ele = document.createElement("a");
        ele.className = "categoryLink";
        ele.href = "/explore?q=" + category.name + "&amp;near=" + homeCity;
        ele.textContent = category.name;

        temp.appendChild(ele);

        if (i < venue.categories.length - 1) {
          temp.appendChild(document.createTextNode(", "));
        }
      }

      gid("categories").innerHTML = temp.innerHTML;

      var address = venue.location.formattedAddress.join(", ");

      gid("address").textContent = address;

      var websiteEle = gid("website");
      websiteEle.href = website.textContent = venue.url;


    } else {
      // We reached our target server, but it returned an error
      console.error("an error occurred");
    }
  };

  request.send();
}

if (document.readyState === "interactive" || document.readyState === "complete") {
  init();
} else {
  document.addEventListener("DOMContentLoaded", init, false);
}