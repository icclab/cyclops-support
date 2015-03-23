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

/*global define*/

/**
 * @author jdabrowski
 */
define("config/messages/CommonMessages", [
], function() {
    
    var obj = {
            "authenticationFailed": {
                msg: "config.messages.CommonMessages.authenticationFailed",
                type: "error"
            },
            "loginFailureLockout": {
                msg: "config.messages.CommonMessages.loginFailureLockout",
                type: "error"
            },
            "maxSessionsLimitOrSessionQuota": {
                msg: "config.messages.CommonMessages.maxSessionsLimitOrSessionQuota",
                type: "error"
            },
            "invalidRealm": {
                msg: "config.messages.CommonMessages.invalidRealm",
                type: "error"
            },   
            "serviceUnavailable": {
                msg: "config.messages.CommonMessages.serviceUnavailable",
                type: "error"
            },
            "unknown": {
                msg: "config.messages.CommonMessages.unknown",
                type: "error"
            },
            "loggedIn": {
                msg: "config.messages.CommonMessages.loggedIn",
                type: "info"
            },
            "errorFetchingData": {
                msg: "config.messages.CommonMessages.errorFetchingData",
                type: "error"
            },
            "loggedOut": {
                msg: "config.messages.CommonMessages.loggedOut",
                type: "info"
            },
            "loginTimeout": {
                msg: "config.messages.CommonMessages.loginTimeout",
                type: "info"
            },
            "unauthorized": {
                msg: "config.messages.CommonMessages.unauthorized",
                type: "error"
            },
            "internalError": {
                msg: "config.messages.CommonMessages.internalError",
                type: "error"
            },
            "forbiddenError": {
                msg: "config.messages.CommonMessages.forbiddenError",
                type: "error"
            },
            "notFoundError": {
                msg: "config.messages.CommonMessages.notFoundError",
                type: "error"
            },
            "badRequestError": {
                msg: "config.messages.CommonMessages.badRequestError",
                type: "error"
            },
            "conflictError": {
                msg: "config.messages.CommonMessages.conflictError",
                type: "error"
            },
            "incorrectRevisionError": {
                msg: "config.messages.CommonMessages.incorrectRevisionError",
                type: "error"
            },
            "tokenNotFound": {
                msg: "config.messages.CommonMessages.tokenNotFound",
                type: "error"
            },
            "securityDataChanged": {
                msg: "config.messages.CommonMessages.securityDataChanged",
                type: "info"
            }
    };
    
    return obj;
});