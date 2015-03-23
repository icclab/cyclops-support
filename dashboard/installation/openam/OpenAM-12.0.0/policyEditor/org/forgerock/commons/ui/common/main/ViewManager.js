/**
 * DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS HEADER.
 *
 * Copyright (c) 2012 ForgeRock AS. All rights reserved.
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

/*global require, define */

/**
 * @author mbilski
 */
define("org/forgerock/commons/ui/common/main/ViewManager", [
    "underscore",
    "org/forgerock/commons/ui/common/util/UIUtils",
    "org/forgerock/commons/ui/common/components/Messages"
], function(_, uiUtils, msg) {
    var obj = {};
    
    obj.currentView = "null";
    obj.currentDialog = "null";
    obj.currentViewArgs = "null";
    obj.currentDialogArgs = "null";
    
    /**
     * Initializes view if it is not equal to current view.
     * Changes URL without triggering event.
     */
    obj.changeView = function(viewPath, args, callback, forceUpdate) {
        var view;
        
        
        if(obj.currentView !== viewPath || forceUpdate || !_.isEqual(obj.currentViewArgs, args)) {
            if(obj.currentDialog !== "null") {
                require(obj.currentDialog).close();
            }
            
            obj.currentDialog = "null";

            msg.messages.hideMessages();

            view = require(viewPath);
            
            if(view.init) {
                view.init();
            } else {
                view.render(args, callback);
            }
            

        } else {
            view = require(obj.currentView);
            view.rebind();
            
            if(callback) {
                callback();
            }
        }

        obj.currentViewArgs = args;
        obj.currentView = viewPath;
    };
    
    obj.showDialog = function(dialogPath, args, callback) {
        if(obj.currentDialog !== dialogPath || !_.isEqual(obj.currentDialogArgs, args)) {
            require(dialogPath).render(args, callback);
            msg.messages.hideMessages();
        }
        
        if(obj.currentDialog !== "null") {
            require(obj.currentDialog).close();
        }

        obj.currentDialog = dialogPath;
        obj.currentDialogArgs = args;
    };
    
    obj.refresh = function() {
        var cDialog = obj.currentDialog, cDialogArgs = obj.currentDialogArgs;
        
        obj.changeView(obj.currentView, obj.currentViewArgs, function() {}, true);
        if (cDialog && cDialog !== 'null') {
            obj.showDialog(cDialog, cDialogArgs);
        }
    };

    return obj;

});

