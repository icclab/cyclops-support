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

/*global define, require, window, _*/

/**
 * @author yaromin
 */
define("config/process/CommonConfig", [
    "org/forgerock/commons/ui/common/util/Constants", 
    "org/forgerock/commons/ui/common/main/EventManager"
], function(constants, eventManager) {
    var obj = [
        {
            startEvent: constants.EVENT_APP_INTIALIZED,
            description: "Starting basic components",
            dependencies: [
                "org/forgerock/commons/ui/common/components/Navigation",
                "org/forgerock/commons/ui/common/components/popup/PopupCtrl",
                "org/forgerock/commons/ui/common/components/Breadcrumbs",
                "org/forgerock/commons/ui/common/main/Router",
                "org/forgerock/commons/ui/common/main/Configuration",
                "org/forgerock/commons/ui/common/util/UIUtils",
                "org/forgerock/commons/ui/common/util/CookieHelper",
                "org/forgerock/commons/ui/common/main/SessionManager"
            ],
            processDescription: function(event,
                    navigation,
                    popupCtrl,
                    breadcrumbs,
                    router,
                    conf,
                    uiUtils,
                    cookieHelper,
                    sessionManager) {

                breadcrumbs.init();
                uiUtils.preloadTemplates();

                sessionManager.getLoggedUser(function(user) {
                    conf.setProperty('loggedUser', user);
                    eventManager.sendEvent(constants.EVENT_AUTHENTICATION_DATA_CHANGED, { anonymousMode: false});
                    router.init();
                }, function() {
                    if (!cookieHelper.cookiesEnabled()) {
                        location.href = "#enableCookies/";
                    }
                    eventManager.sendEvent(constants.EVENT_AUTHENTICATION_DATA_CHANGED, { anonymousMode: true});
                    router.init();
                });
            }
        },
        {
            startEvent: constants.EVENT_CHANGE_BASE_VIEW,
            description: "",
            dependencies: [
                "org/forgerock/commons/ui/common/components/Navigation",
                "org/forgerock/commons/ui/common/components/popup/PopupCtrl",
                "org/forgerock/commons/ui/common/components/Breadcrumbs",
                "org/forgerock/commons/ui/common/main/Configuration",
                "org/forgerock/commons/ui/common/LoggedUserBarView",
                "org/forgerock/commons/ui/common/components/Footer"
            ],
            processDescription: function(event, navigation, popupCtrl, breadcrumbs, conf, loggedUserBarView,footer) {
                navigation.init();
                popupCtrl.init();
                
                breadcrumbs.buildByUrl();
                loggedUserBarView.render();
                footer.render();
            }
        },
        {
            startEvent: constants.EVENT_AUTHENTICATION_DATA_CHANGED,
            description: "",
            dependencies: [
                "org/forgerock/commons/ui/common/main/Configuration",
                "org/forgerock/commons/ui/common/components/Navigation",
                "org/forgerock/commons/ui/common/LoggedUserBarView"
            ],
            processDescription: function(event, conf, navigation, loggedUserBarView) {
                var serviceInvokerModuleName, serviceInvokerConfig; 
                serviceInvokerModuleName = "org/forgerock/commons/ui/common/main/ServiceInvoker";
                serviceInvokerConfig = conf.getModuleConfiguration(serviceInvokerModuleName);
                if(!event.anonymousMode) {
                    delete conf.globalData.authorizationFailurePending;
                    delete serviceInvokerConfig.defaultHeaders[constants.HEADER_PARAM_PASSWORD];
                    delete serviceInvokerConfig.defaultHeaders[constants.HEADER_PARAM_USERNAME];
                    delete serviceInvokerConfig.defaultHeaders[constants.HEADER_PARAM_NO_SESSION];
                    
                    eventManager.sendEvent(constants.EVENT_AUTHENTICATED);
                } else {
                    serviceInvokerConfig.defaultHeaders[constants.HEADER_PARAM_PASSWORD] = constants.ANONYMOUS_PASSWORD;
                    serviceInvokerConfig.defaultHeaders[constants.HEADER_PARAM_USERNAME] = constants.ANONYMOUS_USERNAME;
                    serviceInvokerConfig.defaultHeaders[constants.HEADER_PARAM_NO_SESSION]= true; 
                    
                    conf.setProperty('loggedUser', null);
                    loggedUserBarView.render();
                    navigation.reload();
                }
                conf.sendSingleModuleConfigurationChangeInfo(serviceInvokerModuleName);
            }
        },
        {
            startEvent: constants.EVENT_UNAUTHORIZED,
            description: "",
            dependencies: [
                "org/forgerock/commons/ui/common/main/ViewManager",
                "org/forgerock/commons/ui/common/main/Router",
                "org/forgerock/commons/ui/common/main/Configuration",
                "org/forgerock/commons/ui/common/main/SessionManager",
                "org/forgerock/commons/ui/common/util/UIUtils",
                "LoginDialog"
            ],
            processDescription: function(error, viewManager, router, conf, sessionManager, uiUtils, loginDialog) {
                var saveGotoURL = function () {
                    var hash = uiUtils.getCurrentHash();
                    if(!conf.gotoURL && !hash.match(router.configuration.routes.login.url)) {
                        conf.setProperty("gotoURL", "#" + hash);
                    }
                };

                // multiple rest calls that all return authz failures will cause this event to be called multiple times
                if (conf.globalData.authorizationFailurePending !== undefined) {
                    return;
                }

                conf.globalData.authorizationFailurePending = true;

                if(!conf.loggedUser) {
                    saveGotoURL();
                    eventManager.sendEvent(constants.EVENT_AUTHENTICATION_DATA_CHANGED, { anonymousMode: true});
                    eventManager.sendEvent(constants.EVENT_CHANGE_VIEW, {route: router.configuration.routes.login });
                    return;
                }

                if (typeof error !== "object" || error === null || typeof error.error !== "object" || error.error === null || error.error.type === "GET") {
                    saveGotoURL();
                    sessionManager.logout(function() {
                        eventManager.sendEvent(constants.EVENT_AUTHENTICATION_DATA_CHANGED, { anonymousMode: true});
                        eventManager.sendEvent(constants.EVENT_DISPLAY_MESSAGE_REQUEST, "unauthorized");
                        eventManager.sendEvent(constants.EVENT_CHANGE_VIEW, {route: router.configuration.routes.login });
                    });
                } else {
                    viewManager.showDialog(router.configuration.routes.loginDialog.dialog);
                }

            }
        },
        {
            startEvent: constants.EVENT_DIALOG_CLOSE,
            description: "",
            dependencies: [
                "org/forgerock/commons/ui/common/main/Router",
                "org/forgerock/commons/ui/common/main/Configuration",
                "org/forgerock/commons/ui/common/main/ViewManager",
                "org/forgerock/commons/ui/common/components/Navigation"
            ],
            processDescription: function(event, router, conf, viewManager, navigation) {
                viewManager.currentDialog = "null";
                if(conf.baseView) {
                    require(router.configuration.routes[conf.baseView].view).rebind();
                    router.navigate(router.getLink(router.configuration.routes[conf.baseView], conf.baseViewArgs));
                    navigation.reload();
                }
            }
        },
        {
            startEvent: constants.EVENT_REST_CALL_ERROR,
            description: "",
            dependencies: [
                "org/forgerock/commons/ui/common/main/SpinnerManager",
                "org/forgerock/commons/ui/common/main/ErrorsHandler"
            ],
            processDescription: function(event, spinner, errorsHandler) {
                errorsHandler.handleError(event.data, event.errorsHandlers);
                spinner.hideSpinner();
            }
        },
        {
            startEvent: constants.EVENT_START_REST_CALL,
            description: "",
            dependencies: [
                "org/forgerock/commons/ui/common/main/SpinnerManager"
            ],
            processDescription: function(event, spinner) {
                if (!event.suppressSpinner) {
                    spinner.showSpinner();
                }
            }
        },
        {
            startEvent: constants.EVENT_END_REST_CALL,
            description: "",
            dependencies: [
                "org/forgerock/commons/ui/common/main/SpinnerManager"
            ],
            processDescription: function(event, spinner) {
                spinner.hideSpinner();
            }
        },
        {
            startEvent: constants.EVENT_CHANGE_VIEW,
            description: "",
            dependencies: [
                "org/forgerock/commons/ui/common/main/ViewManager",
                "org/forgerock/commons/ui/common/main/Router",
                "org/forgerock/commons/ui/common/main/Configuration",
                "org/forgerock/commons/ui/common/components/Navigation",
                "org/forgerock/commons/ui/common/main/SpinnerManager",
                "org/forgerock/commons/ui/common/SiteConfigurator"
            ],
            processDescription: function(args, viewManager, router, conf, navigation, spinner, siteConfigurator) {
                var route = args.route, params = args.args, callback = args.callback,
                    view = require(route.view);

                if (!router.checkRole(route)) {
                    return;
                }

                view.route = route;

                params = params || route.defaults;
                conf.setProperty("baseView", "");
                conf.setProperty("baseViewArgs", "");

                siteConfigurator.configurePage(route, params).then(function () {
                    spinner.hideSpinner(10);
                    router.routeTo(route, {trigger: true, args: params});
                    viewManager.changeView(route.view, params, callback, route.forceUpdate);
                    navigation.reload();
                });
            }
        },
        {
            startEvent: constants.EVENT_SHOW_DIALOG,
            description: "",
            dependencies: [
                "org/forgerock/commons/ui/common/main/ViewManager",
                "org/forgerock/commons/ui/common/main/Router",
                "org/forgerock/commons/ui/common/main/Configuration",
                "org/forgerock/commons/ui/common/components/Navigation"
            ],
            processDescription: function(args, viewManager, router, conf, navigation) {
                var route = args.route, params = args.args, callback = args.callback;

                if (!router.checkRole(route)) {
                    return;
                }

                conf.setProperty("baseView", args.base);
                conf.setProperty("baseViewArgs", params);
                
                navigation.init();

                if (!_.has(route, "baseView") && _.has(route, "base")) {
                    viewManager.changeView(router.configuration.routes[route.base].view, viewManager.currentViewArgs, function() {
                        viewManager.showDialog(route.dialog, params, callback);
                        router.navigate(router.getLink(route, params));
                    });
                } else {
                    viewManager.changeView(route.baseView.view, viewManager.currentViewArgs, function() {
                        viewManager.showDialog(route.dialog, params, callback);
                        router.navigate(router.getLink(route, params));
                    });
                }
            }
        },
        {
            startEvent: constants.EVENT_SERVICE_UNAVAILABLE,
            description: "",
            dependencies: [
                "org/forgerock/commons/ui/common/main/Router"
            ],
            processDescription: function(error, router) {
                eventManager.sendEvent(constants.EVENT_DISPLAY_MESSAGE_REQUEST, "serviceUnavailable");
            }
        },
        {
            startEvent: constants.ROUTE_REQUEST,
            description: "",
            dependencies: [
                "org/forgerock/commons/ui/common/main/Router",
                "org/forgerock/commons/ui/common/components/Navigation"
            ],
            processDescription: function(event, router, navigation) {
                if(event.trigger === false) {
                    router.routeTo(router.configuration.routes[event.routeName], {trigger: false, args: event.args});
                } else {
                    router.routeTo(router.configuration.routes[event.routeName], {trigger: true, args: event.args});
                }
                navigation.reload();
            }
        },
        {
            startEvent: constants.EVENT_DISPLAY_MESSAGE_REQUEST,
            description: "",
            dependencies: [
                "org/forgerock/commons/ui/common/components/Messages"
            ],
            processDescription: function(event, messagesManager) {
                messagesManager.messages.displayMessageFromConfig(event);
            }
        },
        {
            startEvent: constants.EVENT_LOGIN_REQUEST,
            description: "",
            dependencies: [
                "org/forgerock/commons/ui/common/main/SessionManager",
                "org/forgerock/commons/ui/common/main/Configuration",
                "org/forgerock/commons/ui/common/main/Router",
                "org/forgerock/commons/ui/common/main/ViewManager"
            ],
            processDescription: function(event, sessionManager, conf, router, viewManager) {
                sessionManager.login(event, function(user) {
                    conf.setProperty('loggedUser', user);
                    
                    eventManager.sendEvent(constants.EVENT_AUTHENTICATION_DATA_CHANGED, { anonymousMode: false});
                    
                    if (! conf.backgroundLogin) {
                        if(conf.globalData.auth.urlParams && conf.globalData.auth.urlParams.goto){
                            window.location.href = conf.globalData.auth.urlParams.goto;
                            return false;
                        }
                        if(conf.gotoURL && _.indexOf(["#","","#/","/#"], conf.gotoURL) === -1) {
                            console.log("Auto redirect to " + conf.gotoURL);
                            router.navigate(conf.gotoURL, {trigger: true});
                            delete conf.gotoURL;
                        } else {
                            if (router.checkRole(router.configuration.routes["default"])) {
                                eventManager.sendEvent(constants.ROUTE_REQUEST, {routeName: "default", args: []});
                            } else {
                                eventManager.sendEvent(constants.EVENT_UNAUTHORIZED);
                                return;
                            }
                        }
                    } else if (viewManager.currentDialog !== "null") {
                        require(viewManager.currentDialog).close();
                    }

                    eventManager.sendEvent(constants.EVENT_DISPLAY_MESSAGE_REQUEST, "loggedIn");
                }, function (reason) {
                    if (conf.globalData.auth.urlParams && conf.globalData.auth.urlParams.gotoOnFail) {
                        window.location.href = conf.globalData.auth.urlParams.gotoOnFail;
                        return false;
                    }
                    reason = reason ? reason : "authenticationFailed";
                    eventManager.sendEvent(constants.EVENT_DISPLAY_MESSAGE_REQUEST, reason);
                });
            }
        },
        {
            startEvent: constants.EVENT_LOGOUT,
            description: "",
            dependencies: [
                "org/forgerock/commons/ui/common/main/Router",
                "org/forgerock/commons/ui/common/main/Configuration",
                "org/forgerock/commons/ui/common/main/SessionManager"
            ],
            processDescription: function(event, router, conf, sessionManager) {
                sessionManager.logout(function() {
                    eventManager.sendEvent(constants.EVENT_DISPLAY_MESSAGE_REQUEST, "loggedOut");
                    eventManager.sendEvent(constants.EVENT_AUTHENTICATION_DATA_CHANGED, { anonymousMode: true});
                    eventManager.sendEvent(constants.EVENT_CHANGE_VIEW, {route: router.configuration.routes.login });
                    delete conf.gotoURL;
                });
            }
        }
        
        ];
    return obj;
});
