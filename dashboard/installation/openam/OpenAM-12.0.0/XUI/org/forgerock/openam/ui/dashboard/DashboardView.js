define("org/forgerock/openam/ui/dashboard/DashboardView",["org/forgerock/commons/ui/common/main/AbstractView","org/forgerock/openam/ui/dashboard/MyApplicationsView","org/forgerock/openam/ui/dashboard/TrustedDevicesView","org/forgerock/openam/ui/dashboard/OAuthTokensView"],function(e,t,n,r){var i=e.extend({template:"templates/openam/DashboardTemplate.html",render:function(){this.parentRender(function(){t.render(),n.render(),r.render()})}});return new i})