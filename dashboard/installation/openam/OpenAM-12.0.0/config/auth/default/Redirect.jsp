<%--
   DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS HEADER.
  
   Copyright (c) 2005 Sun Microsystems Inc. All Rights Reserved
  
   The contents of this file are subject to the terms
   of the Common Development and Distribution License
   (the License). You may not use this file except in
   compliance with the License.
                                                                                
   You can obtain a copy of the License at
   https://opensso.dev.java.net/public/CDDLv1.0.html or
   opensso/legal/CDDLv1.0.txt
   See the License for the specific language governing
   permission and limitations under the License.
                                                                                
   When distributing Covered Code, include this CDDL
   Header Notice in each file and include the License file
   at opensso/legal/CDDLv1.0.txt.
   If applicable, add the following below the CDDL Header,
   with the fields enclosed by brackets [] replaced by
   your own identifying information:
   "Portions Copyrighted [year] [name of copyright owner]"
                                                                                
   $Id: Redirect.jsp,v 1.8 2008/08/19 19:09:44 veiming Exp $
                                                                                
--%>
<%--
   Portions Copyrighted 2012 ForgeRock AS
--%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
    <%@page info="Redirect" language="java"%>
    <%@taglib uri="/WEB-INF/jato.tld" prefix="jato"%>
    <%@taglib uri="/WEB-INF/auth.tld" prefix="auth"%>
    <jato:useViewBean className="com.sun.identity.authentication.UI.LoginViewBean">
        <%@ page contentType="text/html" %>
        <head>
            <title><jato:text name="htmlTitle_Redirect" /></title>
            <%
            String ServiceURI = (String) viewBean.getDisplayFieldValue(viewBean.SERVICE_URI);
            %>
            <link href="<%= ServiceURI%>/css/new_style.css" rel="stylesheet" type="text/css" />
            <!--[if IE 9]> <link href="<%= ServiceURI %>/css/ie9.css" rel="stylesheet" type="text/css"> <![endif]-->
            <!--[if lte IE 7]> <link href="<%= ServiceURI %>/css/ie7.css" rel="stylesheet" type="text/css"> <![endif]-->
        </head>
        <body>
            <div class="container_12">
                <div class="grid_4 suffix_8">
                    <a class="logo" href="<%= ServiceURI%>"></a>
                </div>
                <div class="box box-spaced clear-float">
                    <div class="grid_3">
                        <div class="product-logo"></div>
                    </div>
                    <div class="grid_9">
                        <div class="box-content clear-float">
                            <div class="message">
                                <span class="icon info"></span>
                                <p>
                                    <auth:resBundle bundleName="amAuthUI" resourceKey="movenew.location.1" />
                                    <auth:href name="RedirectURL" fireDisplayEvents='true'>
                                        <auth:resBundle bundleName="amAuthUI" resourceKey="movenew.location.2" />
                                    </auth:href>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="footer alt-color">
                    <div class="grid_6 suffix_3">
                        <p><auth:resBundle bundleName="amAuthUI" resourceKey="copyright.notice" /></p>
                    </div>
                </div>
            </div>
        </body>
    </jato:useViewBean>
</html>
