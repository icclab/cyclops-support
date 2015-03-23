/**
 * DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS HEADER.
 *
 * Copyright (c) 2011-2012 ForgeRock AS. All rights reserved.
 *
 * The contents of this file are subject to the terms
 * of the Common Development and Distribution License
 * (the License). You may not use this file except in
 * compliance with the License.
 *
 * You can obtain a copy of the License at
 * http://forgerock.org/license/CDDLv1.0.html
 * See the License for the specific language governing
 * permission and limitations under the License.
 *
 * When distributing Covered Code, include this CDDL
 * Header Notice in each file and include the License file
 * at http://forgerock.org/license/CDDLv1.0.html
 * If applicable, add the following below the CDDL Header,
 * with the fields enclosed by brackets [] replaced by
 * your own identifying information:
 * "Portions Copyrighted [year] [name of copyright owner]"
 */

/*global define, XDate*/

define("org/forgerock/commons/ui/common/util/DateUtil", [
    "xdate", "moment"
], function (xdate, moment) {
    
    var obj = {};
    
    obj.defaultDateFormat = "MMMM dd, yyyy";
    
    obj.formatDate = function (date, datePattern) {
        if (datePattern){
            return new XDate(date).toString(datePattern);
        } else {
            return new XDate(date).toString(obj.defaultDateFormat);
        }
    };
    
    obj.isDateValid = function(date) {
        if ( Object.prototype.toString.call(date) !== "[object Date]" ) {
            return false;
        }
        return !isNaN(date.getTime());
    };
    
    obj.isDateStringValid = function(dateString, datePattern) {
        return dateString.length === datePattern.length && moment(dateString, datePattern).isValid();
    };
    
    obj.parseStringValid = function(dateString, datePattern) {
        return dateString.length === datePattern.length && moment(dateString, datePattern).isValid();
    };
    
    obj.getDateFromEpochString = function(stringWithMilisFromEpoch) {
        return new XDate(parseInt(stringWithMilisFromEpoch, "10")).toDate();
    };
    
    obj.currentDate = function() {
        return new XDate().toDate();
    };
    
    obj.parseDateString = function(dateString, datePattern) {
        if (datePattern) {
            datePattern = datePattern.replace(/d/g,'D');
            datePattern = datePattern.replace(/y/g,'Y');
            return moment(dateString, datePattern).toDate();
        } else {
            return new XDate(dateString).toDate();
        }
    };
    
    return obj;
});
