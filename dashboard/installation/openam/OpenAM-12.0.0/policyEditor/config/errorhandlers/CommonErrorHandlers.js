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
define("config/errorhandlers/CommonErrorHandlers", [
    "org/forgerock/commons/ui/common/util/Constants", 
    "org/forgerock/commons/ui/common/main/EventManager"
], function(constants, eventManager) {
    
    var obj = {
            "badRequest": {
                status: "400",
                message: "badRequestError"
            },
            "unauthorized": {
                status: "401",
                event: constants.EVENT_UNAUTHORIZED
            },
            "notImplemented": {
                status: "501",
                event: constants.EVENT_UNAUTHORIZED
            },
            "forbidden": {
                status: "403",
                event: constants.EVENT_UNAUTHORIZED,
                message: "forbiddenError"
            },
            "notFound": {
                status: "404",
                message: "notFoundError"
            },
            "conflict": {
                status: "409",
                message: "conflictError"
            },
            "serverError": {
                status: "503",
                event: constants.EVENT_SERVICE_UNAVAILABLE
            },
            "internalServerError": {
                status: "500",
                message: "internalError"
            },
            "incorrectRevision": {
                status: "412",
                message: "incorrectRevisionError"
            }
    };
    
    return obj;
});