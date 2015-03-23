/** 
 * DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS HEADER.
 *
 * Copyright (c) 2011-2014 ForgeRock AS. All rights reserved.
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

/*global define*/
/*jslint regexp:false */

/**
 * @author jdabrowski
 */
define("config/routes/CommonRoutesConfig", [
    "org/forgerock/commons/ui/common/util/Constants"
], function(constants) {

    var obj = {
            "404": { //this route must be the first route
                view: "org/forgerock/commons/ui/common/NotFoundView",
                url: /^([\w\W]*)$/,
                pattern: "?"
            },
            "default": {
                event: constants.EVENT_HANDLE_DEFAULT_ROUTE,
                role: "ui-user",
                url: /^$/,
                pattern: ""
            },
            "enableCookies": {
                view: "org/forgerock/commons/ui/common/EnableCookiesView",
                url: "enableCookies/"
            },
            //definitions for the following views here are generic
            //the actual path to each view is defined in config/AppConfiguration.js
            //view files are loaded when the GenericRouteInterfaceMap module is initialized
            "login": {
                view: "LoginView",
                url: /login([^\&]+)?(&.+)?/, 
                pattern: "login??",
                defaults: ["/",""],
                argumentNames: ["realm","additionalParameters"]
            },
            "logout": {
                event: constants.EVENT_LOGOUT,
                url: /logout\/.*/
            },
            "loginDialog": {
                dialog: "LoginDialog",
                url: "loginDialog/"
            }
        };

    return obj;
});