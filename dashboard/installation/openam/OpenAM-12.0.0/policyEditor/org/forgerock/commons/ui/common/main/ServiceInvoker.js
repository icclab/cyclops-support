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
 * @author yaromin
 */
define("org/forgerock/commons/ui/common/main/ServiceInvoker", [
    "jquery",
    "org/forgerock/commons/ui/common/util/Constants",
    "org/forgerock/commons/ui/common/main/EventManager",
    "org/forgerock/commons/ui/common/util/ObjectUtil",
    "org/forgerock/commons/ui/common/main/AbstractConfigurationAware"
], function($, constants, em, objUtil, AbstractConfigurationAware) {

    var obj = new AbstractConfigurationAware();

    obj.restCall = function(callParamsParam) {
        var current = this, callParams, realSuccess, realError, nonJsonRequest = false;
        
        nonJsonRequest = (callParamsParam.hasOwnProperty('dataType') && callParamsParam.dataType !== "json");
        
        if (!nonJsonRequest) {
            callParamsParam.contentType = 'application/json';
        }
        callParams = callParamsParam;
        obj.applyDefaultHeadersIfNecessary(callParams, obj.configuration.defaultHeaders);

        //TODO This line can be deleted when the bug https://bugster.forgerock.org/jira/browse/OPENIDM-568 is fixed
        if(callParams.headers[constants.HEADER_PARAM_NO_SESSION] === false) {
            delete callParams.headers[constants.HEADER_PARAM_NO_SESSION];
        }

        em.sendEvent(constants.EVENT_START_REST_CALL, {suppressSpinner: callParamsParam.suppressSpinner});
        realSuccess = callParams.success;
        realError = callParams.error;
        callParams.success = function (data,textStatus, jqXHR) {
            if(data && data.error) {
                em.sendEvent(constants.EVENT_REST_CALL_ERROR, { data: $.extend({}, data, {type: this.type}), textStatus: textStatus, jqXHR: jqXHR, errorsHandlers: callParams.errorsHandlers});
                if(realError) {
                    realError(data);
                }
            } else {            
                em.sendEvent(constants.EVENT_END_REST_CALL, { data: data, textStatus: textStatus, jqXHR: jqXHR});
                if(realSuccess) {
                    realSuccess(data);
                }
            }
        };
        callParams.error = function (jqXHR, textStatus, errorThrown ) {
            //TODO try to handle error
            em.sendEvent(constants.EVENT_REST_CALL_ERROR, { data: $.extend({}, jqXHR, {type: this.type}), textStatus: textStatus, errorThrown: errorThrown, errorsHandlers: callParams.errorsHandlers});
            if(realError) {
                realError(jqXHR);
            }
        };
        if (!nonJsonRequest) {
            callParams.dataType = "json";
            callParams.contentType = "application/json";
        }

        callParams.xhrFields = {
            // Useful for CORS requests, should we be accessing a remote endpoint
            // http://www.html5rocks.com/en/tutorials/cors/#toc-withcredentials
            withCredentials: true
        };
        
        // this is the jQuery default value for this header, but unless manually specified (like so) it won't be included in CORS requests
        callParams.headers["X-Requested-With"] = "XMLHttpRequest";
        
        return $.ajax(callParams); 
    };

    /**
     * Test TODO create test using below formula
     * var x = {headers:{"a": "a"},b:"b"};
     * require("org/forgerock/commons/ui/common/main/ServiceInvoker").applyDefaultHeadersIfNecessary(x, {a:"x",b:"b"});
     * y ={};
     * require("org/forgerock/commons/ui/common/main/ServiceInvoker").applyDefaultHeadersIfNecessary(y, {a:"c",d:"c"});
     */
    obj.applyDefaultHeadersIfNecessary = function(callParams, defaultHeaders) {
        var oneHeaderName;
        if(!defaultHeaders) {
            return;
        }
        if(!callParams.headers) {
            callParams.headers = defaultHeaders;
        } else {
            for(oneHeaderName in defaultHeaders) {
                if(callParams.headers[oneHeaderName] === undefined) {
                    callParams.headers[oneHeaderName] = defaultHeaders[oneHeaderName];
                }
            }
        }
    };

    return obj;
});