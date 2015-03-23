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

/*global define unescape*/

define("org/forgerock/commons/ui/common/util/CookieHelper", [
], function () {
    var obj = {};
    
    /**
     * Create a cookie in the browser with given parameters. Only name parameter is mandatory. 
     */
    obj.createCookie = function(cookieName, cookieValue, expirationDate, cookiePath, cookieDomain, secureCookie) {
        var expirationDatePart, nameValuePart, pathPart, domainPart, securePart; 
        expirationDatePart = (expirationDate) ? ";expires=" + expirationDate.toGMTString() : "";
        nameValuePart = cookieName + "=" + cookieValue;
        pathPart = (cookiePath) ? ";path=" + cookiePath : "";
        domainPart = (cookieDomain) ? ";domain=" + cookieDomain : "";
        securePart = (secureCookie) ? ";secure" : "";
    
        return nameValuePart + expirationDatePart + pathPart + domainPart + securePart;
    };
    
    obj.setCookie = function(cookieName, cookieValue, expirationDate, cookiePath, cookieDomain, secureCookie) {
        document.cookie = obj.createCookie(cookieName, cookieValue, expirationDate, cookiePath, cookieDomain, secureCookie);
    };
    
    obj.getCookie = function(c_name) {
        var i, x, y, ARRcookies = document.cookie.split(";");
        for (i=0; i < ARRcookies.length; i++) {
            x = ARRcookies[i].substr(0,ARRcookies[i].indexOf("="));
            y = ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1);
            x = x.replace(/^\s+|\s+$/g,"");
            if ( x === c_name) {
                return unescape(y);
            }
        }
    };
    
    obj.deleteCookie = function(name, path, domain) {
        var date = new Date();
        date.setTime(date.getTime()+(-1*24*60*60*1000));
        obj.setCookie(name, "", date, path, domain);
    };
    
    obj.cookiesEnabled = function(){
        this.setCookie("cookieTest","test");
        if(!this.getCookie("cookieTest")){
            return false;
        }
        this.deleteCookie("cookieTest");
        return true;
    };
    
    return obj;
});