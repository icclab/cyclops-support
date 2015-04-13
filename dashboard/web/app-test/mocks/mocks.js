var restServiceMock = jasmine.createSpyObj(
    'restService',
    [
        'getUdrData', 'sendKeystoneAuthRequest', 'sendLoginRequest',
        'requestSessionToken', 'storeKeystoneId', 'getTokenInfo',
        'updateUdrMeters', 'getKeystoneMeters', 'getUdrMeters',
        'getAdminGroupInfo', 'getAllUsers', 'getRateForMeter',
        'getChargeForUser', 'getActiveRatePolicy', 'setActiveRatePolicy',
        'updateAdmins'
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
        'formatColumns', 'getFormattedData'
    ]
);

var rateDataServiceMock = jasmine.createSpyObj(
    'rateDataService',
    [
        'notifyChartDataReady', 'setRawData', 'formatPoints',
        'formatColumns', 'getFormattedData'
    ]
);

var chargeDataServiceMock = jasmine.createSpyObj(
    'chargeDataService',
    [
        'notifyChartDataReady', 'setRawData', 'formatPoints',
        'formatColumns', 'getFormattedData'
    ]
);

var meterselectionDataServiceMock = jasmine.createSpyObj(
    'meterselectionDataService',
    [
        'setRawUdrData', 'setRawOpenstackData', 'getFormattedUdrData',
        'getFormattedOpenstackData'
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
        'getTimestamp', 'fromTimestamp', 'getFormattedTimeNow',
        'getFormattedTime6HoursAgo', 'getFormattedDateTimeNow',
        'getFormattedDateToday', 'getFormattedDateYesterday',
        'getFormattedDate3DaysAgo', 'getFormattedDate1WeekAgo',
        'getFormattedDate1MonthAgo', 'getFormattedDate1YearAgo'
    ]
);

var responseParserMock = jasmine.createSpyObj(
    'responseParser',
    [
        'getStaticRatingListFromResponse', 'getAdminListFromResponse',
        'getUserListFromResponse', 'getAdminStatusFromResponse'
    ]
);
