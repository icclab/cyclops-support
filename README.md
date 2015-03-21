# cyclops-support

The **Cyclops Dashboard** is one of the support services as part of CYCLOPS - A Rating, Charging  & Billing solution for cloud being developed by <a href="http://blog.zhaw.ch/icclab/">InIT Cloud Computing Lab</a> at <a href="http://www.zhaw.ch">ZHAW</a>

It is the place for users to check their usage data, connect to cloud providers and manage bills. Admins can use it to configure the different microservices and maintain user accounts.

![](https://github.com/icclab/cyclops-support/blob/master/dashboard/doc/images/dashboard_menu.png)

For more in-depth documentation, see:
* [Installing OpenAM](https://github.com/icclab/cyclops-support/wiki/OpenAM-Installation)
* [Configuring OpenAM](https://github.com/icclab/cyclops-support/wiki/OpenAM-Configuration)
* [Communication Flow](https://github.com/icclab/cyclops-support/wiki/Communication-Flow)
* [Javadoc](https://icclab.github.io/cyclops/javadoc/udrservice/)

Currently, the following features are implemented:
* [User] Authentication / Authorisation via OpenAM
* [User] Linking an account to OpenStack
* [User] Displaying some usage data
* [Admin] Listing users and admins
* [Admin] Displaying list of all available meters
* [Admin] Configuring UDR Microservice to use different set of meters

### Components & Libraries
  * <a href="https://angularjs.org">AngularJS</a>
  * <a href="https://github.com/angular-ui/ui-router">AngularJS ui-router</a>
  * <a href="https://jasmine.github.io">Jasmine</a>
  * <a href="http://getbootstrap.com">Bootstrap</a>
  * <a href="http://startbootstrap.com/template-overviews/sb-admin-2">SB Admin 2 (Bootstrap Theme)</a>
  * <a href="https://tomcat.apache.org">Tomcat7</a>
  * <a href="https://restlet.com">RESTLET</a> 

### Communication
  * Issues/Ideas/Suggestions : <a href="https://github.com/icclab/cyclops-support/issues">GitHub Issue</a>
  * Website : http://blog.zhaw.ch/icclab/ 
  * Tweet us @<a href="https://twitter.com/ICC_Lab">ICC_Lab</a>
   
### Developed @
<img src="http://blog.zhaw.ch/icclab/files/2014/04/icclab_logo.png" alt="ICC Lab" height="180" width="620"></img>

### License
 
      Licensed under the Apache License, Version 2.0 (the "License"); you may
      not use this file except in compliance with the License. You may obtain
      a copy of the License at
 
           http://www.apache.org/licenses/LICENSE-2.0
 
      Unless required by applicable law or agreed to in writing, software
      distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
      WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
      License for the specific language governing permissions and limitations
      under the License.
