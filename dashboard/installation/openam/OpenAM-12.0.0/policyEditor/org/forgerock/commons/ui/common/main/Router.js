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

/*global define, Backbone, _, window */

/**
 * @author mbilski
 */
define("org/forgerock/commons/ui/common/main/Router", [
    "org/forgerock/commons/ui/common/main/EventManager", 
    "org/forgerock/commons/ui/common/util/Constants",
    "org/forgerock/commons/ui/common/main/Configuration",
    "org/forgerock/commons/ui/common/main/AbstractConfigurationAware"
], function(eventManager, constants, conf, AbstractConfigurationAware) {
    var obj = new AbstractConfigurationAware();
    
    obj.bindedRoutes = {};
    obj.currentRoute = {};
    
    obj.checkRole = function (route) {
        if(route.role) {
            if(!conf.loggedUser || !_.find(route.role.split(','), function(role) {
                return conf.loggedUser.roles.indexOf(role) !== -1;
            })) {
                eventManager.sendEvent(constants.EVENT_UNAUTHORIZED);
                return false;
            }
        }

        if(route.excludedRole) {
            if(conf.loggedUser && conf.loggedUser.roles.indexOf(route.excludedRole) !== -1) {
                eventManager.sendEvent(constants.EVENT_UNAUTHORIZED);
                return false;
            }
        }
        return true;
    };

    obj.init = function() {
        console.debug("Router init");
        
        var Router = Backbone.Router.extend({
            initialize: function(routes) {
                var route, url;
                
                for(route in routes) {
                    url = routes[route].url;
                    this.route(url, route, _.bind(this.processRoute, {key: route}));
                    obj.bindedRoutes[route] = _.bind(this.processRoute, {key: route});
                }
            },
            processRoute : function() {
                
                var route = obj.configuration.routes[this.key], baseView, i, args;
                
                args = _.toArray(arguments);

                if (!obj.checkRole(route)) {
                    return;
                }

                if(route.event) {
                    eventManager.sendEvent(route.event, args);
                } else if(route.dialog) {
                    route.baseView = obj.configuration.routes[route.base];
                    
                    eventManager.sendEvent(constants.EVENT_SHOW_DIALOG, {route: route, args: args, base: route.base});
                } else if(route.view) {
                    eventManager.sendEvent(constants.EVENT_CHANGE_VIEW, {route: route, args: args});
                }
            }
        });
        
        obj.router = new Router(obj.configuration.routes);
        Backbone.history.start();
    };
    
    obj.routeTo = function(route, params) {
        var link;
        
        if(params && params.args) {
            link = obj.getLink(route, params.args);
        } else {
            link = route.url;
        }

        params.replace = false;
        obj.currentRoute = route;
        obj.router.navigate(link, params);
    };
    
    obj.execRouteHandler = function(routeName) {
        obj.bindedRoutes[routeName]();
    };
    
    obj.navigate = function(link, params) {
        obj.router.navigate(link, params);
    };
    
    obj.getLink = function(route, args) {
        var i,maxArgLength, pattern;
        
        if (typeof route.defaults === "object") {
            if (args) {
                maxArgLength = (args.length >= route.defaults.length) ? args.length : route.defaults.length;
                for (i=0;i<maxArgLength;i++) {
                    if (typeof args[i] !== "string" && route.defaults[i] !== undefined) {
                        args[i] = route.defaults[i];
                    } 
                }
            } else {
                args = route.defaults;
            }
        }

        if (!_.isRegExp(route.url)) {
            pattern = route.url.replace(/:[A-Za-z@.]+/, "?");
        } else {
            pattern = route.pattern;
        }
        
        if (args) {
            for(i = 0; i < args.length; i++) {
                if (args[i] !== undefined) {
                    pattern = pattern.replace("?", args[i]);
                } else {
                    break;
                }
            }
            pattern = pattern.replace(/\?/g, "");
        }

        return pattern;
    };

    return obj;

});
