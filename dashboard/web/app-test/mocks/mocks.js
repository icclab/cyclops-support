/*
 * Copyright (c) 2015. Zuercher Hochschule fuer Angewandte Wissenschaften
 *  All Rights Reserved.
 *
 *     Licensed under the Apache License, Version 2.0 (the "License"); you may
 *     not use this file except in compliance with the License. You may obtain
 *     a copy of the License at
 *
 *          http://www.apache.org/licenses/LICENSE-2.0
 *
 *     Unless required by applicable law or agreed to in writing, software
 *     distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 *     WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 *     License for the specific language governing permissions and limitations
 *     under the License.
 */

var restServiceMock = jasmine.createSpyObj(
    'restService',
    [
        'getUdrData', 'sendKeystoneAuthRequest', 'sendLoginRequest',
        'requestSessionToken', 'storeKeystoneId', 'getTokenInfo',
        'updateUdrMeters', 'getKeystoneMeters', 'getUdrMeters',
        'getAdminGroupInfo', 'getAllUsers', 'getRateForMeter',
        'getChargeForUser', 'getActiveRatePolicy', 'setActiveRatePolicy',
        'updateAdmins', 'createBillPDF'
    ]
);

var sessionServiceMock = jasmine.createSpyObj(
    'sessionService',
    [
        'clearSession', 'getSessionId', 'getAccessToken', 'getIdToken',
        'getUsername', 'getTokenType', 'getExpiration', '', 'getKeystoneId',
        'setSessionId', 'setAccessToken', 'setIdToken', 'setUsername',
        'setTokenType', 'setExpiration', 'setKeystoneId', 'setAdmin',
        'isAdmin', 'isAuthenticated'
    ]
);

var usageDataServiceMock = jasmine.createSpyObj(
    'usageDataService',
    [
        'notifyChartDataReady', 'setRawData', 'formatPoints',
        'getFormattedColumns', 'getFormattedData'
    ]
);

var rateDataServiceMock = jasmine.createSpyObj(
    'rateDataService',
    [
        'notifyChartDataReady', 'setRawData', 'formatPoints',
        'getFormattedColumns', 'getFormattedData'
    ]
);

var chargeDataServiceMock = jasmine.createSpyObj(
    'chargeDataService',
    [
        'notifyChartDataReady', 'setRawData', 'formatPoints',
        'getFormattedColumns', 'getFormattedData'
    ]
);

var meterselectionDataServiceMock = jasmine.createSpyObj(
    'meterselectionDataService',
    [
        'setRawUdrData', 'setRawOpenstackData', 'getFormattedUdrData',
        'getFormattedOpenstackData'
    ]
);

var billDataServiceMock = jasmine.createSpyObj(
    'billDataService',
    [
        'setRawData', 'getFormattedData', 'formatPoints',
        'getFormattedColumns'
    ]
);

var chartDataServiceMock = jasmine.createSpyObj(
    'chartDataService',
    [
        'getServiceDelegate', 'setLabelIfSpaceAvailable',
        'getCumulativeMeterData', 'getGaugeMeterData',
    ]
);

var alertServiceMock = jasmine.createSpyObj(
    'alertService',
    [
        'showError', 'showSuccess'
    ]
);

var dateUtilMock = jasmine.createSpyObj(
    'dateUtil',
    [
        'getTimestamp', 'getFormattedTimeNow',
        'getFormattedDateToday', 'getFormattedDateYesterday',
        'formatDate', 'formatTime', 'formatDateTime',
        'formatDateFromTimestamp', 'formatTimeFromTimestamp',
        'formatDateTimeFromTimestamp', 'getFormattedDateTimeNow'
    ]
);

var responseParserMock = jasmine.createSpyObj(
    'responseParser',
    [
        'getStaticRatingListFromResponse', 'getAdminListFromResponse',
        'getUserListFromResponse', 'getAdminStatusFromResponse'
    ]
);
