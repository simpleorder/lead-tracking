jQuery(document).ready(function() {
    function getURLParam(name) {
        return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(window.location.search) || [null, ''])[1].replace(/\+/g, '%20')) || null;
    }

    function referrerIsExternal(referrer) {
        return referrer && referrer.indexOf(window.location.hostname) === -1;
    }

    var storeLeadSource = function(e) {

        SOLeadOriginCookie = function() {
            var cookieName = 'LeadOrigin';
            var attributes = {
                domain: "." + window.location.hostname,
                expires: 30,
            };

            var InternalCookies = Cookies.noConflict();
            return {
                get: function() {
                    return InternalCookies.getJSON(cookieName);
                },
                set: function(value) {
                    InternalCookies.set(cookieName, value, attributes);
                },
                remove: function() {
                    InternalCookies.remove(cookieName, attributes);
                }
            };
        }();

        var cook = SOLeadOriginCookie.get();
        var referrer = document.referrer || null;

        if (cook === undefined) {
            // Collect values from query params
            var queryParams = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content'];
            var cookieValue = {};
            for (var i=0; i < queryParams.length; i++) {
                var paramName = queryParams[i];
                cookieValue[paramName] = getURLParam(paramName);
            }

            // Collect referrer
            cookieValue.referrer = referrer;

            SOLeadOriginCookie.set(cookieValue);
        }

        if (referrerIsExternal()) {
            var cookieValue = SOLeadOriginCookie.get();
            var referrers = cookieValue.referrers || [];

            if (referrers.slice(-1) == referrer) {
                var maxReferrersToSave = 5;
                var updatedReferrers = referrers.slice(-1 * (maxReferrersToSave - 1)).concat(referrer);

                window.intercomSettings = {
                    referrers: JSON.stringify(updatedReferrers)
                };
            }
        }
    };

    var s = document.createElement("script");
    s.src = "https://cdn.jsdelivr.net/npm/js-cookie@2/src/js.cookie.min.js";
    s.onload = storeLeadSource;
    document.head.appendChild(s);
});