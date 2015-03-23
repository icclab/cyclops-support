define("org/forgerock/openam/ui/user/login/RESTLoginView",["org/forgerock/commons/ui/common/main/AbstractView","org/forgerock/openam/ui/user/delegates/AuthNDelegate","org/forgerock/commons/ui/common/main/ValidatorsManager","org/forgerock/commons/ui/common/main/EventManager","org/forgerock/commons/ui/common/util/Constants","org/forgerock/commons/ui/common/main/Configuration","org/forgerock/commons/ui/common/main/SessionManager","org/forgerock/commons/ui/common/main/Router","org/forgerock/commons/ui/common/util/CookieHelper","org/forgerock/commons/ui/common/util/UIUtils","org/forgerock/commons/ui/common/main/i18nManager","org/forgerock/openam/ui/user/login/RESTLoginHelper"],function(e,t,n,r,i,s,o,u,a,f,l,c,h){var p=e.extend({template:"templates/openam/RESTLoginTemplate.html",genericTemplate:"templates/openam/RESTLoginTemplate.html",unavailableTemplate:"templates/openam/RESTLoginUnavailableTemplate.html",baseTemplate:"templates/common/LoginBaseTemplate.html",data:{},events:{"click input[type=submit]":"formSubmit","click #forgotPassword":"selfServiceClick","click #register":"selfServiceClick"},selfServiceClick:function(e){e.preventDefault();var t=new Date,n=s.globalData.auth.realm;s.globalData.auth.urlParams&&(n+=c.filterUrlParams(s.globalData.auth.urlParams)),t.setDate(t.getDate()+1),a.setCookie("loginUrlParams",n,t),location.href=e.target.href+s.globalData.auth.realm},autoLogin:function(){var e,t={};_.each(_.keys(s.globalData.auth.urlParams),function(n){n.indexOf("IDToken")>-1&&(e=parseInt(n.substring(7),10)-1,t["callback_"+e]=s.globalData.auth.urlParams["IDToken"+n.substring(7)])}),s.globalData.auth.autoLoginAttempts=1,r.sendEvent(i.EVENT_LOGIN_REQUEST,t)},isZeroPageLoginAllowed:function(){var e=document.referrer,t=s.globalData.zeroPageLogin.refererWhitelist;return s.globalData.zeroPageLogin.enabled?e?!t||!t.length||t.indexOf(e)>-1:s.globalData.zeroPageLogin.allowedWithoutReferer:!1},formSubmit:function(e){var t,n;e.preventDefault(),t=form2js(this.$el[0]),t[$(e.target).attr("name")]=$(e.target).attr("index"),this.$el.find("[name=loginRemember]:checked").length!==0?(n=new Date,n.setDate(n.getDate()+20),a.setCookie("login",this.$el.find("input[type=text]:first").val(),n)):this.$el.find("[name=loginRemember]").length!==0&&a.deleteCookie("login"),r.sendEvent(i.EVENT_LOGIN_REQUEST,t)},render:function(e,n){var f={},l=$.Deferred();e&&e.length&&(s.globalData.auth.realm=e[0],s.globalData.auth.additional=e[1],s.globalData.auth.urlParams=f,e[1]&&(f=this.handleUrlParams()),f.realm&&e[0]==="/"&&(f.realm.substring(0,1)!=="/"&&(f.realm="/"+f.realm),s.globalData.auth.realm=f.realm),f.IDToken1&&this.isZeroPageLoginAllowed()&&!s.globalData.auth.autoLoginAttempts&&this.autoLogin()),t.getRequirements().done(_.bind(function(e){var t=this;e.hasOwnProperty("tokenId")&&f.arg==="newsession"&&(c.removeSession(),s.setProperty("loggedUser",null)),e.hasOwnProperty("tokenId")&&f.ForceAuth!=="true"?(s.globalData.auth.passedInRealm=s.globalData.auth.realm,o.getLoggedUser(function(t){String(s.globalData.auth.passedInRealm).toLowerCase()===s.globalData.auth.realm.toLowerCase()?(s.setProperty("loggedUser",t),delete s.globalData.auth.passedInRealm,c.setSuccessURL(e.tokenId).then(function(){if(s.globalData.auth.urlParams&&s.globalData.auth.urlParams.goto)return window.location.href=s.globalData.auth.urlParams.goto,$("body").empty(),!1;r.sendEvent(i.EVENT_AUTHENTICATION_DATA_CHANGED,{anonymousMode:!1}),s.gotoURL&&_.indexOf(["#","","#/","/#"],s.gotoURL)===-1?(console.log("Auto redirect to "+s.gotoURL),u.navigate(s.gotoURL,{trigger:!0}),delete s.gotoURL):u.navigate("",{trigger:!0})})):location.href="#confirmLogin/"},function(){c.removeSession(),s.setProperty("loggedUser",null)})):(this.renderForm(e,f),l.resolve())},this)).fail(_.bind(function(){this.template=this.unavailableTemplate,this.parentRender()},this)),l.done(function(){a.getCookie("invalidRealm")&&(a.deleteCookie("invalidRealm"),r.sendEvent(i.EVENT_DISPLAY_MESSAGE_REQUEST,"invalidRealm"))})},renderForm:function(e,t){var n=_.clone(e),r=!0,i=$.Deferred();return n.callbacks=[],_.each(e.callbacks,function(e){e.type==="RedirectCallback"&&window.location.replace(e.output[0].value),e.type==="ConfirmationCallback"&&(r=!1),n.callbacks.push({input:{index:n.callbacks.length,name:e.input?e.input[0].name:null,value:e.input?e.input[0].value:null},output:e.output,type:e.type,isSubmit:e.type==="ConfirmationCallback"})}),r&&n.callbacks.push({input:{index:n.callbacks.length,name:"loginButton",value:0},output:[{name:"options",value:[$.t("common.user.login")]}],type:"ConfirmationCallback",isSubmit:!0}),this.reqs=e,this.data.reqs=n,t.IDToken1&&s.globalData.auth.autoLoginAttempts===1?s.globalData.auth.autoLoginAttempts++:f.fillTemplateWithData("templates/openam/authn/"+e.stage+".html",_.extend(s.globalData,this.data),_.bind(function(t){typeof t=="string"?this.template="templates/openam/authn/"+e.stage+".html":this.template=this.genericTemplate,this.data.showForgotPassword=!1,this.data.showRegister=!1,this.data.showSpacer=!1,s.globalData.forgotPassword==="true"&&(this.data.showForgotPassword=!0),s.globalData.selfRegistration==="true"&&(this.data.showForgotPassword&&(this.data.showSpacer=!0),this.data.showRegister=!0),this.parentRender(_.bind(function(){this.reloadData(),i.resolve()},this))},this)),i},reloadData:function(){var e=a.getCookie("login");this.$el.find("[name=loginRemember]").length!==0&&e?(this.$el.find("input[type=text]:first").val(e),this.$el.find("[name=loginRemember]").attr("checked","true"),this.$el.find("[type=password]").focus()):this.$el.find(":input:first").focus()},handleUrlParams:function(){var e=f.convertCurrentUrlToJSON().params;return _.each(["authlevel","module","service","user"],function(t){e[t]&&(e.authIndexType=t==="authlevel"?"level":t,e.authIndexValue=e[t],s.globalData.auth.additional+="&authIndexType="+(t==="authlevel"?"level":t)+"&authIndexValue="+e[t])}),e.goto&&e.goto.indexOf("/SSORedirect")===0&&(e.goto="/"+i.context+e.goto,s.globalData.auth.additional.replace("&goto=","&goto=/"+i.context)),s.globalData.auth.urlParams=e,e}});return Handlebars.registerHelper("callbackRender",function(){var e="",t=this,n,r,i;n=_.find(t.output,function(e){return e.name==="prompt"}),n&&n.value!==undefined&&n.value.length&&(t.type==="ChoiceCallback"?e="<label>"+n.value+"</label>":e='<label class="short">'+n.value+"</label>");switch(t.type){case"PasswordCallback":e+='<input type="password" name="callback_'+t.input.index+'" value="'+t.input.value+'" data-validator="required" required data-validator-event="keyup" />';break;case"TextInputCallback":e+='<textarea name="callback_'+t.input.index+'" data-validator="required" required data-validator-event="keyup">'+t.input.value+"</textarea>";break;case"TextOutputCallback":r=[],r.message=_.find(t.output,function(e){return e.name==="message"}),r.type=_.find(t.output,function(e){return e.name==="messageType"}),r.type.value==="4"?(i="if(document.getElementsByClassName('button')[0] != undefined){document.getElementsByClassName('button')[0].style.visibility = 'hidden';}",e+="<script type='text/javascript'>"+i+r.message.value+"</script>"):e+='<div id="callback_'+t.input.index+'" class="textOutputCallback '+r.type.value+'">'+r.message.value+"</div>";break;case"ConfirmationCallback":r=_.find(t.output,function(e){return e.name==="options"}),r&&r.value!==undefined&&_.each(r.value,function(n,r){e+='<input name="callback_'+t.input.index+'" type="submit" class="button" index="'+r+'" value="'+n+'">'});break;case"ChoiceCallback":r=_.find(t.output,function(e){return e.name==="choices"}),r&&r.value!==undefined&&(e+="<ul>",_.each(r.value,function(n,r){var i=t.input.value===r?" checked":"";e+='<li><label class="short light" for="callback_'+t.input.index+"_"+r+'">'+n+": </label><input "+i+' id="callback_'+t.input.index+"_"+r+'" name="callback_'+t.input.index+'" type="radio" value="'+r+'"></li>'}),e+="</ul>");break;case"HiddenValueCallback":e+='<input type="hidden" id="'+t.input.value+'" name="callback_'+t.input.index+'" value="" data-validator="required" required data-validator-event="keyup" />';break;case"RedirectCallback":e+="Redirecting...";break;default:e+='<input type="text" name="callback_'+t.input.index+'" value="'+t.input.value+'" data-validator="required" required data-validator-event="keyup" />'}return new Handlebars.SafeString(e)}),new p})