<%--
   DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS HEADER.
  
   Copyright (c) 2006 Sun Microsystems Inc. All Rights Reserved
  
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

   $Id: FederationDone.jsp,v 1.4 2008/06/25 05:48:31 qcheng Exp $

--%>

<%@ page language="java"
import="com.sun.liberty.LibertyManager"
%>
<%@ include file="Header.jsp"%>
<center>

<%
    // Alias processing
    String providerAlias =
        request.getParameter(LibertyManager.getMetaAliasKey());
    if (providerAlias == null || providerAlias.length() < 1) {
        response.sendError(response.SC_INTERNAL_SERVER_ERROR,
            "Provider Alias not found");
        return;
    }

    String realm = LibertyManager.getRealmByMetaAlias(providerAlias);
    String providerId = LibertyManager.getEntityID(providerAlias);
    String providerRole = LibertyManager.getProviderRole(providerAlias);
    String HOME_URI = "";
    if (providerId != null) {
        HOME_URI = LibertyManager.getHomeURL(realm, providerId, providerRole);
    } else {
        response.sendError(response.SC_INTERNAL_SERVER_ERROR,
            "Not able to get Provider ID");
        return;
    }
    if (LibertyManager.isFederationCancelled(request)) {
%>

<p><b>The user has cancelled account federation.</b></p>
<% } else { %>
<p><b>Federation has been successfully completed with the remote provider.</b></p>
<% } if (HOME_URI == null){ %>
    <a href="http://www.sun.com">Continue</a>
<% }else { %>
    <a href="<%=HOME_URI%>">Continue </a>
<% } %>
</center>
<%@ include file="Footer.jsp"%>

