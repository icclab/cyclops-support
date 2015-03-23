/**
 * DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS HEADER.
 *
 * Copyright (c) 2014 ForgeRock AS. All rights reserved.
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

/*global define */

/**
 * @author jkigwana
 */

define( "org/forgerock/commons/ui/common/main/i18nManager", [
    "jquery",
    "org/forgerock/commons/ui/common/util/Constants",
    "org/forgerock/commons/ui/common/util/UIUtils"
], function($, consts, uiUtils) {

    /*
     * i18nManger with i18next try to detect the user language and load the corresponding translation in the following order:
     * 1) The query string parameter (&locale=fr)
     * 2) lang, a 2 digit language code passed in from server.
     * 3) The default language set inside consts.DEFAULT_LANGUAGE
     */

    var obj = {};

    obj.init = function(lang) {

        var locales = [], opts = { }, params = uiUtils.convertCurrentUrlToJSON().params;

        if (params && params.locale) {
            lang = params.locale;
        }    

        // return if the stored lang matches the new one.
        if (obj.lang !== undefined && obj.lang === lang) {
           return;
        }
        obj.lang = lang;

   
        opts = { fallbackLng: consts.DEFAULT_LANGUAGE, detectLngQS: 'locale', useCookie:false, getAsync: false, lng:lang, load: 'unspecific' };

        $.i18n.init(opts);

    };
    
    return obj;

});
