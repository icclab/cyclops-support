define("org/forgerock/commons/ui/common/util/CookieHelper",[],function(){var e={};return e.createCookie=function(e,t,n,r,i,s){var o,u,a,f,l;return o=n?";expires="+n.toGMTString():"",u=e+"="+t,a=r?";path="+r:"",f=i?";domain="+i:"",l=s?";secure":"",u+o+a+f+l},e.setCookie=function(t,n,r,i,s,o){document.cookie=e.createCookie(t,n,r,i,s,o)},e.getCookie=function(e){var t,n,r,i=document.cookie.split(";");for(t=0;t<i.length;t++){n=i[t].substr(0,i[t].indexOf("=")),r=i[t].substr(i[t].indexOf("=")+1),n=n.replace(/^\s+|\s+$/g,"");if(n===e)return unescape(r)}},e.deleteCookie=function(t,n,r){var i=new Date;i.setTime(i.getTime()+ -864e5),e.setCookie(t,"",i,n,r)},e.cookiesEnabled=function(){return this.setCookie("cookieTest","test"),this.getCookie("cookieTest")?(this.deleteCookie("cookieTest"),!0):!1},e})