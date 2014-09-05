"use strict";

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

  var request = new XMLHttpRequest();
  request.open('GET', url, true);

  request.onload = function() {
    if (request.status >= 200 && request.status < 400) {
      // Success!
      var data = JSON.parse(request.responseText);

      var venue = data.response.venue;

      var links = document.getElementsByClassName("venueLink");
      for (var i = 0; i < links.length; i++) {
        links[i].href = venue.canonicalUrl;
        links[i].target = "_blank";
      }

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
      for (i = 0; i < venue.categories.length; i++) {
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

      if (venue.url) {
        websiteEle.href = venue.url;
        websiteEle.textContent = websiteEle.host;
      }
      else
      {
        // Some venues don't have urls. Delete the element
        websiteEle.parentNode.removeChild(websiteEle);
      }

      // Add the photos
      if (pageParams.photos == "true" && venue.photos && venue.photos.groups.length > 0) {
        var photoWrapper = gid("photos");
        photoWrapper.classList.remove("hidden");

        var photos = venue.photos.groups[0].items;

        // Don't try to load more pictures than will fit on one line.
        // 160 is the width of the image + margin
        var maxPhotos = Math.floor(photoWrapper.offsetWidth / 160);

        for (var i = 0; i < Math.min(maxPhotos, photos.length); i++) {
          var ele = document.createElement("img");
          ele.src = photos[i].prefix+"150x150"+photos[i].suffix;
          photoWrapper.appendChild(ele);

        }
      }


    } else {
      // We reached our target server, but it returned an error
      console.error("an error occurred");
    }
  };

  request.send();

   // @if ENV=='PRODUCTION'
  setUpGoogleAnalytics();
  /* @endif */

  // setUpRollbar();
}

if (document.readyState === "interactive" || document.readyState === "complete") {
  init();
} else {
  document.addEventListener("DOMContentLoaded", init, false);
}

function setUpGoogleAnalytics() {
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-8909900-5', 'auto');
  ga('send', 'pageview');
}

/*
function setUpRollbar() {
var _rollbarConfig = {
    accessToken: "e1c9b4d6f6064fa0b5ff13825fc44c31",
    captureUncaught: true,
    payload: {
        environment: "production"
    }
};
!function(a,b){function c(b){this.shimId=++h,this.notifier=null,this.parentShim=b,this.logger=function(){},a.console&&void 0===a.console.shimId&&(this.logger=a.console.log)}function d(b,c,d){!d[4]&&a._rollbarWrappedError&&(d[4]=a._rollbarWrappedError,a._rollbarWrappedError=null),b.uncaughtError.apply(b,d),c&&c.apply(a,d)}function e(b){var d=c;return g(function(){if(this.notifier)return this.notifier[b].apply(this.notifier,arguments);var c=this,e="scope"===b;e&&(c=new d(this));var f=Array.prototype.slice.call(arguments,0),g={shim:c,method:b,args:f,ts:new Date};return a._rollbarShimQueue.push(g),e?c:void 0})}function f(a,b){if(b.hasOwnProperty&&b.hasOwnProperty("addEventListener")){var c=b.addEventListener;b.addEventListener=function(b,d,e){c.call(this,b,a.wrap(d),e)};var d=b.removeEventListener;b.removeEventListener=function(a,b,c){d.call(this,a,b&&b._wrapped?b._wrapped:b,c)}}}function g(a,b){return b=b||this.logger,function(){try{return a.apply(this,arguments)}catch(c){b("Rollbar internal error:",c)}}}var h=0;c.init=function(a,b){var e=b.globalAlias||"Rollbar";if("object"==typeof a[e])return a[e];a._rollbarShimQueue=[],a._rollbarWrappedError=null,b=b||{};var h=new c;return g(function(){if(h.configure(b),b.captureUncaught){var c=a.onerror;a.onerror=function(){var a=Array.prototype.slice.call(arguments,0);d(h,c,a)};var g,i,j="EventTarget,Window,Node,ApplicationCache,AudioTrackList,ChannelMergerNode,CryptoOperation,EventSource,FileReader,HTMLUnknownElement,IDBDatabase,IDBRequest,IDBTransaction,KeyOperation,MediaController,MessagePort,ModalWindow,Notification,SVGElementInstance,Screen,TextTrack,TextTrackCue,TextTrackList,WebSocket,WebSocketWorker,Worker,XMLHttpRequest,XMLHttpRequestEventTarget,XMLHttpRequestUpload".split(",");for(g=0;g<j.length;++g)i=j[g],a[i]&&a[i].prototype&&f(h,a[i].prototype)}return a[e]=h,h},h.logger)()},c.prototype.loadFull=function(a,b,c,d){var e=g(function(){var a=b.createElement("script"),e=b.getElementsByTagName("script")[0];a.src=d.rollbarJsUrl,a.async=!c,a.onload=f,e.parentNode.insertBefore(a,e)},this.logger),f=g(function(){if(void 0===a._rollbarPayloadQueue)for(var b,c,d,e,f=new Error("rollbar.js did not load");b=a._rollbarShimQueue.shift();)for(d=b.args,e=0;e<d.length;++e)if(c=d[e],"function"==typeof c){c(f);break}},this.logger);g(function(){c?e():a.addEventListener?a.addEventListener("load",e,!1):a.attachEvent("onload",e)},this.logger)()},c.prototype.wrap=function(b){try{if("function"!=typeof b)return b;if(b._isWrap)return b;if(!b._wrapped){b._wrapped=function(){try{return b.apply(this,arguments)}catch(c){throw a._rollbarWrappedError=c,c}},b._wrapped._isWrap=!0;for(var c in b)b.hasOwnProperty(c)&&(b._wrapped[c]=b[c])}return b._wrapped}catch(d){return b}};for(var i="log,debug,info,warn,warning,error,critical,global,configure,scope,uncaughtError".split(","),j=0;j<i.length;++j)c.prototype[i[j]]=e(i[j]);var k="//d37gvrvc0wt4s1.cloudfront.net/js/v1.1/rollbar.min.js";_rollbarConfig.rollbarJsUrl=_rollbarConfig.rollbarJsUrl||k;var l=c.init(a,_rollbarConfig);l.loadFull(a,b,!1,_rollbarConfig)}(window,document);

}
*/