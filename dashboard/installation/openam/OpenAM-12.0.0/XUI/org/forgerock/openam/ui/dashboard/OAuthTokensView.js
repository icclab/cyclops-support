define("org/forgerock/openam/ui/dashboard/OAuthTokensView",["org/forgerock/commons/ui/common/main/AbstractView","org/forgerock/openam/ui/dashboard/OAuthTokensDelegate"],function(e,t){var n=e.extend({template:"templates/openam/oauth2/TokensTemplate.html",noBaseTemplate:!0,element:"#myOAuthTokens",events:{"click  a.deleteToken":"deleteToken"},render:function(){var e=this;t.getOAuthTokens().then(function(t){e.data.tokens=t.result,e.parentRender()})},deleteToken:function(e){e.preventDefault();var n=this;t.deleteOAuthToken(e.currentTarget.id).then(function(){console.log("Deleted access token"),n.render()},function(){console.error("Failed to delete access token")})}});return new n})