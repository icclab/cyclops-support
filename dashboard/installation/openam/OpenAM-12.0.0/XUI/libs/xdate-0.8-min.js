var XDate=function(e,t,n,r){function i(){var t=this instanceof i?this:new i,n=arguments,r=n.length,u;typeof n[r-1]=="boolean"&&(u=n[--r],n=N(n,0,r));if(r)if(r==1){if(r=n[0],r instanceof e||typeof r=="number")t[0]=new e(+r);else if(r instanceof i){var n=t,a=new e(+r[0]);s(r)&&(a.toString=D),n[0]=a}else if(typeof r=="string"){t[0]=new e(0);e:{for(var n=r,r=u||!1,a=i.parsers,f=0,l;f<a.length;f++)if(l=a[f](n,r,t)){t=l;break e}t[0]=new e(n)}}}else t[0]=new e(_.apply(e,n)),u||(t[0]=E(t[0]));else t[0]=new e;return typeof u=="boolean"&&o(t,u),t}function s(e){return e[0].toString===D}function o(t,n,r){return n?s(t)||(r&&(t[0]=new e(_(t[0].getFullYear(),t[0].getMonth(),t[0].getDate(),t[0].getHours(),t[0].getMinutes(),t[0].getSeconds(),t[0].getMilliseconds()))),t[0].toString=D):s(t)&&(t[0]=r?E(t[0]):new e(+t[0])),t}function u(e,t,n,r,i){var s=T(b,e[0],i),e=T(w,e[0],i),i=!1;r.length==2&&typeof r[1]=="boolean"&&(i=r[1],r=[n]),n=t==1?(n%12+12)%12:s(1),e(t,r),i&&s(1)!=n&&(e(1,[s(1)-1]),e(2,[S(s(0),s(1))]))}function a(e,n,r,i){var r=Number(r),s=t.floor(r);e["set"+L[n]](e["get"+L[n]]()+s,i||!1),s!=r&&n<6&&a(e,n+1,(r-s)*O[n],i)}function f(e,n,r){var e=e.clone().setUTCMode(!0,!0),n=i(n).setUTCMode(!0,!0),s=0;if(r==0||r==1){for(var o=6;o>=r;o--)s/=O[o],s+=b(n,!1,o)-b(e,!1,o);r==1&&(s+=(n.getFullYear()-e.getFullYear())*12)}else r==2?(r=e.toDate().setUTCHours(0,0,0,0),s=n.toDate().setUTCHours(0,0,0,0),s=t.round((s-r)/864e5)+(n-s-(e-r))/864e5):s=(n-e)/[36e5,6e4,1e3,1][r-3];return s}function l(n){var r=n(0),i=n(1),s=n(2),n=new e(_(r,i,s)),r=h(c(r,i,s));return t.floor(t.round((n-r)/864e5)/7)+1}function c(t,n,r){return n=new e(_(t,n,r)),n<h(t)?t-1:n>=h(t+1)?t+1:t}function h(t){return t=new e(_(t,0,4)),t.setUTCDate(t.getUTCDate()-(t.getUTCDay()+6)%7),t}function p(e,t,n,i){var s=T(b,e,i),o=T(w,e,i);n===r&&(n=c(s(0),s(1),s(2))),n=h(n),i||(n=E(n)),e.setTime(+n),o(2,[s(2)+(t-1)*7])}function d(e,t,n,r,s){var o=i.locales,u=o[i.defaultLocale]||{},a=T(b,e,s),n=(typeof n=="string"?o[n]:n)||{};return v(e,t,function(e){if(r)for(var t=(e==7?2:e)-1;t>=0;t--)r.push(a(t));return a(e)},function(e){return n[e]||u[e]},s)}function v(e,t,n,i,s){for(var o,u,a="";o=t.match(M);){a+=t.substr(0,o.index);if(o[1]){u=a;for(var a=e,f=o[1],l=n,c=i,h=s,p=f.length,d=void 0,g="";p>0;)d=m(a,f.substr(0,p),l,c,h),d!==r?(g+=d,f=f.substr(p),p=f.length):p--;a=u+(g+f)}else o[3]?(u=v(e,o[4],n,i,s),parseInt(u.replace(/\D/g,""),10)&&(a+=u)):a+=o[7]||"'";t=t.substr(o.index+o[0].length)}return a+t}function m(e,n,r,s,o){var u=i.formatters[n];if(typeof u=="string")return v(e,u,r,s,o);if(typeof u=="function")return u(e,o||!1,s);switch(n){case"fff":return k(r(6),3);case"s":return r(5);case"ss":return k(r(5));case"m":return r(4);case"mm":return k(r(4));case"h":return r(3)%12||12;case"hh":return k(r(3)%12||12);case"H":return r(3);case"HH":return k(r(3));case"d":return r(2);case"dd":return k(r(2));case"ddd":return s("dayNamesShort")[r(7)]||"";case"dddd":return s("dayNames")[r(7)]||"";case"M":return r(1)+1;case"MM":return k(r(1)+1);case"MMM":return s("monthNamesShort")[r(1)]||"";case"MMMM":return s("monthNames")[r(1)]||"";case"yy":return(r(0)+"").substring(2);case"yyyy":return r(0);case"t":return g(r,s).substr(0,1).toLowerCase();case"tt":return g(r,s).toLowerCase();case"T":return g(r,s).substr(0,1);case"TT":return g(r,s);case"z":case"zz":case"zzz":return o?n="Z":(s=e.getTimezoneOffset(),e=s<0?"+":"-",r=t.floor(t.abs(s)/60),s=t.abs(s)%60,o=r,n=="zz"?o=k(r):n=="zzz"&&(o=k(r)+":"+k(s)),n=e+o),n;case"w":return l(r);case"ww":return k(l(r));case"S":return n=r(2),n>10&&n<20?"th":["st","nd","rd"][n%10-1]||"th"}}function g(e,t){return e(3)<12?t("amDesignator"):t("pmDesignator")}function y(e){return!isNaN(+e[0])}function b(e,t,n){return e["get"+(t?"UTC":"")+L[n]]()}function w(e,t,n,r){e["set"+(t?"UTC":"")+L[n]].apply(e,r)}function E(t){return new e(t.getUTCFullYear(),t.getUTCMonth(),t.getUTCDate(),t.getUTCHours(),t.getUTCMinutes(),t.getUTCSeconds(),t.getUTCMilliseconds())}function S(t,n){return 32-(new e(_(t,n,32))).getUTCDate()}function x(e){return function(){return e.apply(r,[this].concat(N(arguments)))}}function T(e){var t=N(arguments,1);return function(){return e.apply(r,t.concat(N(arguments)))}}function N(e,t,i){return n.prototype.slice.call(e,t||0,i===r?e.length:i)}function C(e,t){for(var n=0;n<e.length;n++)t(e[n],n)}function k(e,t){t=t||2;for(e+="";e.length<t;)e="0"+e;return e}var L="FullYear,Month,Date,Hours,Minutes,Seconds,Milliseconds,Day,Year".split(","),A=["Years","Months","Days"],O=[12,31,24,60,60,1e3,1],M=/(([a-zA-Z])\2*)|(\((('.*?'|\(.*?\)|.)*?)\))|('(.*?)')/,_=e.UTC,D=e.prototype.toUTCString,P=i.prototype;return P.length=1,P.splice=n.prototype.splice,P.getUTCMode=x(s),P.setUTCMode=x(o),P.getTimezoneOffset=function(){return s(this)?0:this[0].getTimezoneOffset()},C(L,function(e,t){P["get"+e]=function(){return b(this[0],s(this),t)},t!=8&&(P["getUTC"+e]=function(){return b(this[0],!0,t)}),t!=7&&(P["set"+e]=function(e){return u(this,t,e,arguments,s(this)),this},t!=8&&(P["setUTC"+e]=function(e){return u(this,t,e,arguments,!0),this},P["add"+(A[t]||e)]=function(e,n){return a(this,t,e,n),this},P["diff"+(A[t]||e)]=function(e){return f(this,e,t)}))}),P.getWeek=function(){return l(T(b,this,!1))},P.getUTCWeek=function(){return l(T(b,this,!0))},P.setWeek=function(e,t){return p(this,e,t,!1),this},P.setUTCWeek=function(e,t){return p(this,e,t,!0),this},P.addWeeks=function(e){return this.addDays(Number(e)*7)},P.diffWeeks=function(e){return f(this,e,2)/7},i.parsers=[function(t,n,r){if(t=t.match(/^(\d{4})(-(\d{2})(-(\d{2})([T ](\d{2}):(\d{2})(:(\d{2})(\.(\d+))?)?(Z|(([-+])(\d{2})(:?(\d{2}))?))?)?)?)?$/)){var i=new e(_(t[1],t[3]?t[3]-1:0,t[5]||1,t[7]||0,t[8]||0,t[10]||0,t[12]?Number("0."+t[12])*1e3:0));return t[13]?t[14]&&i.setUTCMinutes(i.getUTCMinutes()+(t[15]=="-"?1:-1)*(Number(t[16])*60+(t[18]?Number(t[18]):0))):n||(i=E(i)),r.setTime(+i)}}],i.parse=function(e){return+i(""+e)},P.toString=function(e,t,n){return e===r||!y(this)?this[0].toString():d(this,e,t,n,s(this))},P.toUTCString=P.toGMTString=function(e,t,n){return e===r||!y(this)?this[0].toUTCString():d(this,e,t,n,!0)},P.toISOString=function(){return this.toUTCString("yyyy-MM-dd'T'HH:mm:ss(.fff)zzz")},i.defaultLocale="",i.locales={"":{monthNames:"January,February,March,April,May,June,July,August,September,October,November,December".split(","),monthNamesShort:"Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec".split(","),dayNames:"Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday".split(","),dayNamesShort:"Sun,Mon,Tue,Wed,Thu,Fri,Sat".split(","),amDesignator:"AM",pmDesignator:"PM"}},i.formatters={i:"yyyy-MM-dd'T'HH:mm:ss(.fff)",u:"yyyy-MM-dd'T'HH:mm:ss(.fff)zzz"},C("getTime,valueOf,toDateString,toTimeString,toLocaleString,toLocaleDateString,toLocaleTimeString,toJSON".split(","),function(e){P[e]=function(){return this[0][e]()}}),P.setTime=function(e){return this[0].setTime(e),this},P.valid=x(y),P.clone=function(){return new i(this)},P.clearTime=function(){return this.setHours(0,0,0,0)},P.toDate=function(){return new e(+this[0])},i.now=function(){return+(new e)},i.today=function(){return(new i).clearTime()},i.UTC=_,i.getDaysInMonth=S,typeof module!="undefined"&&module.exports&&(module.exports=i),typeof define=="function"&&define.amd&&define([],function(){return i}),i}(Date,Math,Array)