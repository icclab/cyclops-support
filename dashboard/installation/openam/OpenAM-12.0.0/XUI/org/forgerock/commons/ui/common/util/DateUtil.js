define("org/forgerock/commons/ui/common/util/DateUtil",["xdate","moment"],function(e,t){var n={};return n.defaultDateFormat="MMMM dd, yyyy",n.formatDate=function(e,t){return t?(new XDate(e)).toString(t):(new XDate(e)).toString(n.defaultDateFormat)},n.isDateValid=function(e){return Object.prototype.toString.call(e)!=="[object Date]"?!1:!isNaN(e.getTime())},n.isDateStringValid=function(e,n){return e.length===n.length&&t(e,n).isValid()},n.parseStringValid=function(e,n){return e.length===n.length&&t(e,n).isValid()},n.getDateFromEpochString=function(e){return(new XDate(parseInt(e,"10"))).toDate()},n.currentDate=function(){return(new XDate).toDate()},n.parseDateString=function(e,n){return n?(n=n.replace(/d/g,"D"),n=n.replace(/y/g,"Y"),t(e,n).toDate()):(new XDate(e)).toDate()},n})