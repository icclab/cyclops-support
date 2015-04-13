(function() {

    angular.module('dashboard.filter')
        .filter('xbytes', XBytesFilter);

    function XBytesFilter() {

        /**
         * Converts bytes into kilo / mega / giga / ... bytes. The method
         * can handle SI-units (k = 1000) or binary units (k = 1024).
         *
         * Source: http://stackoverflow.com/a/3758880
         *
         * @param  {int} bytes Amount in bytes to transform
         * @param  {boolean} si    Use SI units
         * @return {String}     Human readable string
         */
        return function(bytes, si) {
            var unit = si ? 1000 : 1024;

            if (bytes < unit) {
                return bytes + " B";
            }

            var exp = Math.floor(Math.log(bytes) / Math.log(unit));
            var pre = (si ? "kMGTPE" : "KMGTPE").charAt(exp-1) + (si ? "" : "i");
            var roundedValue = Math.round((bytes / Math.pow(unit, exp)) * 100) / 100;

            return (roundedValue || 0) + " " + pre + "B";
        };
    }

})();
