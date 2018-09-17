//code.iamkate.com
var Cookies = {
  set: function(b, c, a) {
    b = [encodeURIComponent(b) + "=" + encodeURIComponent(c)];
    a && ("expiry" in a && ("number" == typeof a.expiry && (a.expiry = new Date(1E3 * a.expiry + +new Date)), b.push("expires=" + a.expiry.toGMTString())), "domain" in a && b.push("domain=" + a.domain), "path" in a && b.push("path=" + a.path), "secure" in a && a.secure && b.push("secure"));
    document.cookie = b.join("; ")
  },
  get: function(b, c) {
    for (var a = [], e = document.cookie.split(/; */), d = 0; d < e.length; d++) {
      var f = e[d].split("=");
      f[0] == encodeURIComponent(b) && a.push(decodeURIComponent(f[1].replace(/\+/g, "%20")))
    }
    return c ? a : a[0]
  },
  clear: function(b, c) {
    c || (c = {});
    c.expiry = -86400;
    this.set(b, "", c)
  }
};


(function($) {
  "use strict";


  /*==================================================================
  [ Validate ]*/
  var input = $('.validate-input .input100');

  $('.validate-form').on('submit', function() {
    var check = true;

    for (var i = 0; i < input.length; i++) {
      if (validate(input[i]) == false) {
        showValidate(input[i]);
        check = false;
      }
    }

    return check;
  });


  $('.validate-form .input100').each(function() {
    $(this).focus(function() {
      hideValidate(this);
    });
  });

  function validate(input) {
    if ($(input).attr('type') == 'email' || $(input).attr('name') == 'email') {
      if ($(input).val().trim().match(/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/) == null) {
        return false;
      }
    } else {
      if ($(input).val().trim() == '') {
        return false;
      }
    }
  }

  function showValidate(input) {
    var thisAlert = $(input).parent();

    $(thisAlert).addClass('alert-validate');
  }

  function hideValidate(input) {
    var thisAlert = $(input).parent();

    $(thisAlert).removeClass('alert-validate');
  }


  var authCode = Cookies.get('authCode');
  var jwt = Cookies.get('smoochJwt');
  var userId = Cookies.get('userId');
  var initPromise;

  if ($("#appId").text()) {
    if (authCode && jwt) {
      initPromise = Smooch.init({
        appId: $("#appId").text(),
        embedded: true,
        authCode: authCode
      });
      console.log(initPromise);
    } else {
      initPromise = Smooch.init({
        appId: $("#appId").text(),
        embedded: true
      });
    }

    Smooch.render(document.getElementById('hiddenElement'));

    initPromise.then(function() {
      if (jwt) {
        Smooch.login(userId, jwt).then(function() {
          Smooch.updateUser({
            properties: {
              "name": $("#userName").text(),
              "jobTitle": $("#userJob").text(),
              "phone": $("#userPhone").text()
            }
          }).then(function() {
            if(window.WebviewSdk.hasFeature('close')) {
              window.WebviewSdk.close();
            }
          });
        });
      }
    });
  }

})(jQuery);
