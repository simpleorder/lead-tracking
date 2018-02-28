jQuery(document).ready(function() {
    function getURLParam(name) {
        return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(window.location.search) || [null, ''])[1].replace(/\+/g, '%20')) || null;
    }
        
    var storeLeadSource = function(e) {

        SOLeadOriginCookie = function() {
            var cookieName = 'LeadOrigin';
            var attributes = {
                domain: "dev-so.com",
                // domain: "simpleorder.com" // TODO: uncomment
                expires: 30,
            };

            InternalCookies = Cookies.noConflict();
            return {
                get: function() {
                    return InternalCookies.getJSON(cookieName);
                },
                set: function(value) {
                    InternalCookies.set(cookieName, value);
                },
                remove: function() {
                    InternalCookies.remove(cookieName);
                }
            };
        }();

        var cook = SOLeadOriginCookie.get();

        if (cook === undefined) {
            // Collect values from query params
            var queryParams = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content'];
            var cookieValue = {};
            for (var i=0; i < queryParams.length; i++) {
                var paramName = queryParams[i];
                cookieValue[paramName] = getURLParam(paramName);
            }

            // Collect referrer
            cookieValue.referrer = document.referrer || null;

            SOLeadOriginCookie.set(cookieValue);
        }
    };

    var s = document.createElement("script");
    s.src = "https://cdn.jsdelivr.net/npm/js-cookie@2/src/js.cookie.min.js";
    s.onload = storeLeadSource;
    document.head.appendChild(s);
});