/**
 * DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS HEADER.
 *
 * Copyright (c) 2011-2014 ForgeRock AS. All rights reserved.
 *
 * The contents of this file are subject to the terms
 * of the Common Development and Distribution License
 * (the License). You may not use this file except in
 * compliance with the License.
 *
 * You can obtain a copy of the License at
 * http://forgerock.org/license/CDDLv1.0.html
 * See the License for the specific language governing
 * permission and limitations under the License.
 *
 * When distributing Covered Code, include this CDDL
 * Header Notice in each file and include the License file
 * at http://forgerock.org/license/CDDLv1.0.html
 * If applicable, add the following below the CDDL Header,
 * with the fields enclosed by brackets [] replaced by
 * your own identifying information:
 * "Portions Copyrighted [year] [name of copyright owner]"
 */

/*global define, window, Handlebars, i18n, sessionStorage */
/*jslint regexp: false*/

define("org/forgerock/commons/ui/common/util/UIUtils", [
    "jquery",
    "underscore",
    "org/forgerock/commons/ui/common/util/typeextentions/String",
    "org/forgerock/commons/ui/common/main/AbstractConfigurationAware",
    "handlebars",
    "i18next",
    "org/forgerock/commons/ui/common/main/Router",
    "org/forgerock/commons/ui/common/util/DateUtil"
], function ($, _, String, AbstractConfigurationAware, handlebars, i18next, router, dateUtil) {
    var obj = new AbstractConfigurationAware();

    obj.getUrl = function() {
        return window.location.href;
    };

    obj.getCurrentUrlBasePart = function() {
        return window.location.protocol + "//" + window.location.host;
    };

    obj.getCurrentHash = function() {
        if (window.location.href.indexOf('#') === -1) {
            return "";
        } else {
            // cannot use window.location.hash due to FF which de-encodes this parameter.
            return window.location.href.substring(window.location.href.indexOf('#') + 1);
        }
    };

    obj.getCurrentUrlQueryParameters = function() {
        var hash = obj.getCurrentHash(),
            queries = window.location.search.substr(1,window.location.search.length);
            // location.search will only return a value if there are queries before the hash.
        if (hash && hash.indexOf('&') > -1) {
            queries = hash.substring(hash.indexOf('&') + 1);
        }
        return queries;
    };
 
    obj.getCurrentPathName = function() {
        return window.location.pathname;
    };

    obj.setUrl = function(url) {
        window.location.href = url;
    };

    obj.normalizeSubPath = function(subPath) {
        if(subPath.endsWith('/')) {
            return subPath.removeLastChars();
        }
        return subPath;
    };

    obj.convertCurrentUrlToJSON = function() {
        var result = {}, parsedQueryParams;

        result.url = obj.getCurrentUrlBasePart();
        result.pathName = obj.normalizeSubPath(obj.getCurrentPathName());

        result.params = obj.convertQueryParametersToJSON(obj.getCurrentUrlQueryParameters());
        return result;
    };

    obj.convertQueryParametersToJSON = function(queryParameters) {
        if(queryParameters) {
            //create a json object from a query string
            //by taking a query string and splitting it up into individual key=value strings
            return _.object(
                //queryParameters.match(/([^&]+)/g) returns an array of key value pair strings
                _.map(queryParameters.match(/([^&]+)/g), function (pair) {
                   //convert each string into a an array 0 index being the key and 1 index being the value
                   var keyAndValue = pair.match(/([^=]+)=?(.*)/).slice(1);
                       //decode the value
                       keyAndValue[1] = decodeURIComponent(keyAndValue[1]);
                       return keyAndValue;
                })
            );
        }
        return null;
    };

    obj.commonJQGridFormatters = {
        objectFormatter: function (cellvalue, options, rowObject) {
            if (!cellvalue) {
                return '';
            }

            var result = '<dl>',
                prop;
            for (prop in cellvalue) {

                if (_.isString(cellvalue[prop])){
                    result += '<dt>' + prop + '</dt><dd>' + cellvalue[prop] + '</dd>';
                } else{
                    result += '<dt>' + prop + '</dt><dd>' + JSON.stringify(cellvalue[prop]) + '</dd>';
                }
            }

            result += '</dl>';

            return result;
        },
        arrayFormatter: function (cellvalue, options, rowObject) {
            if (!cellvalue) {
                return '';
            }

            var result = '<ul>',
                i,
                len = cellvalue.length;
            for (i = 0; i < len; i++) {
               
                if (_.isString(cellvalue[i])){
                    result += '<li>' + cellvalue[i] + '</li>';
                } else{
                    result += '<li>' + JSON.stringify(cellvalue[i]) + '</li>';
                }
            }

            result += '</ul>';

            return result;
        },
  
        dateFormatter: function (cellvalue, options, rowObject) {
            if (!cellvalue) {
                return '';
            }

            return Handlebars.helpers.date(cellvalue);
        }
    };

    obj.buildJQGrid = function (view, id, options, additional, callback) {
        options = options ? options : {};

        if (!id || !view || !options.url) {
            return null;
        }

        var grid = view.$el.find('#' + id),
            cm = options.colModel,
            columnStateName = additional.storageKey,
            saveColumnState = function (perm) {
                var colModel = this.jqGrid('getGridParam', 'colModel'), i, l = colModel.length, colItem, cmName,
                    postData = this.jqGrid('getGridParam', 'postData'),
                    columnsState = {
                        search: this.jqGrid('getGridParam', 'search'),
                        page: this.jqGrid('getGridParam', 'page'),
                        sortname: this.jqGrid('getGridParam', 'sortname'),
                        sortorder: this.jqGrid('getGridParam', 'sortorder'),
                        permutation: perm,
                        colStates: {}
                    },
                    colStates = columnsState.colStates;

                for (i = 0; i < l; i++) {
                    colItem = colModel[i];
                    cmName = colItem.name;
                    if (cmName !== 'rn' && cmName !== 'cb' && cmName !== 'subgrid') {
                        colStates[cmName] = {
                            width: colItem.width,
                            hidden: colItem.hidden
                        };
                    }
                }
                sessionStorage.setItem(columnStateName, JSON.stringify(columnsState));
            },
            columnsState,
            restoreColumnState = function (colModel) {
                var colItem, i, l = colModel.length, colStates, cmName,
                    columnsState = JSON.parse(sessionStorage.getItem(columnStateName));

                if (columnsState) {
                    colStates = columnsState.colStates;
                    for (i = 0; i < l; i++) {
                        colItem = colModel[i];
                        cmName = colItem.name;
                        if (cmName !== 'rn' && cmName !== 'cb' && cmName !== 'subgrid') {
                            colModel[i] = $.extend(true, {}, colModel[i], colStates[cmName]);
                        }
                    }
                }
                return columnsState;
            },
            defaultOptions = {
                datatype: "json",
                loadBeforeSend: function (jqXHR) {
                    jqXHR.setRequestHeader('Accept-API-Version', 'protocol=1.0,resource=1.0');
                },
                colNames: [],
                colModel: [],
                height: 'auto',
                width: 'none',
                jsonReader: {
                    root: function (obj) {
                        return obj.result;
                    },
                    total: function (obj) {  // total number of pages
                        var postedData = grid.jqGrid('getGridParam', 'postData'),
                            records = postedData._pagedResultsOffset + obj.remainingPagedResults + obj.resultCount,
                            pageSize = postedData._pageSize,
                            pages = Math.floor(records / pageSize);

                        if (records % pageSize > 0) {
                            pages += 1;
                        }

                        sessionStorage.setItem(additional.storageKey + '-pages-number', pages);
                        return pages;
                    },
                    records: function (obj) {  // total number of records
                        return grid.jqGrid('getGridParam', 'postData')._pagedResultsOffset + obj.remainingPagedResults +
                            obj.resultCount;
                    },
                    userdata: function (obj) {
                        return { remaining: obj.remainingPagedResults };
                    },
                    repeatitems: false
                },
                search: null,
                prmNames: {
                    nd: null,
                    sort: '_sortKeys',
                    search: '_queryFilter',
                    rows: '_pageSize' // number of records to fetch
                },
                serializeGridData: function (postedData) {
                    var i, length, filter = '', colNames;

                    if (additional.serializeGridData) {
                        filter = additional.serializeGridData.call(this, postedData);
                    }

                    colNames = _.pluck(grid.jqGrid('getGridParam', 'colModel'), 'name');
                    _.each(colNames, function (element, index, list) {
                        if (postedData[element]) {
                            if (filter.length > 0) {
                                filter += ' AND ';
                            }
                            filter = filter.concat(element, ' co "', postedData[element], '"');
                        }
                        delete postedData[element];
                    });

                    if (additional.searchFilter) {
                        for (i = 0, length = additional.searchFilter.length; i < length; i++) {
                            if (filter.length > 0) {
                                filter += ' AND ';
                            }
                            filter = filter.concat(additional.searchFilter[i].field, ' ', additional.searchFilter[i].op, ' "', additional.searchFilter[i].val, '"');
                        }
                    }

                    postedData._queryFilter = filter === '' ? true : filter;

                    postedData._pagedResultsOffset = postedData._pageSize * (postedData.page - 1);
                    delete postedData.page;

                    if (postedData._sortKeys) {
                        if (postedData.sord === 'desc') {
                            postedData._sortKeys = '-' + postedData._sortKeys;
                        }
                    }
                    delete postedData.sord;

                    return $.param(postedData);
                },
                loadComplete: function (data) {
                    _.extend(view.data[id], data);
                },
                onPaging: function () {
                    var totalPagesNum = JSON.parse(sessionStorage.getItem(additional.storageKey + '-pages-number')),
                        inputVal = $($(this).jqGrid('getGridParam', 'pager')).find('input').val();
                    if (totalPagesNum !== null && /[0-9]+/.test(inputVal) && totalPagesNum < parseInt(inputVal, 10)) {
                        $(this).trigger('reloadGrid', {page: 1});
                        return 'stop';
                    }
                },
                pager: null,
                rowNum: 10,
                viewrecords: true,
                rowList: [10, 20, 30]
            };
        columnsState = restoreColumnState(cm);

        $.extend(true, defaultOptions, options);
        if (columnsState) {
            $.extend(true, defaultOptions, columnsState);
        }
        grid.jqGrid(defaultOptions);

        if (additional.search) {
            grid.jqGrid('filterToolbar', {searchOnEnter: false, defaultSearch: 'eq'});
        }

        grid.navGrid(options.pager, {edit: false, add: false, del: false, search: false, refresh: false})
            .navButtonAdd(options.pager,{
                caption:"Columns",
                buttonicon:"ui-icon-add",
                position: "first",
                onClickButton: function(){
                    grid.jqGrid('columnChooser', {
                        modal : true,
                        width : additional.columnChooserOptions.width, height : additional.columnChooserOptions.height,
                        done: function (perm){
                            if (perm) {
                                saveColumnState.call(this, perm);
                            }
                            grid.trigger('jqGridAfterLoadComplete.setFrozenColumns');
                        }});
                }
            });

        grid.on("jqGridAfterGridComplete", function () {
            if (callback) {
                callback();
            }
        });

        grid.on('jqGridAfterLoadComplete.setFrozenColumns', function () {
            var table = view.$el.find('#' + id), row, height;
            view.$el.find('#' + id + '_frozen').find('tr').each(function () {
                if ($.jgrid.jqID(this.id)) {
                    row = table.find("#" + $.jgrid.jqID(this.id));
                    height = row.outerHeight();
                    $(this).find('td').height(height);
                    row.find('td').height(height);
                }
            });
        });

        return grid;
    };

    obj.templates = {};

    obj.renderTemplate = function(templateUrl, el, data, clb, mode, validation) {
        obj.fillTemplateWithData(templateUrl, data, function(tpl) {
            // if we were passed a validation function and it returns false, abort
            if (validation && !validation()) {
                return false;
            }

            if(mode === "append") {
                el.append(tpl);
            } else {
                el.html(tpl);
            }

            if(clb) {
                clb();
            }
        });
    };

    obj.fillTemplateWithData = function(templateUrl, data, callback) {
        if(templateUrl) {
            if (obj.templates[templateUrl]) {
                var code = Handlebars.compile(obj.templates[templateUrl])(data);

                if (callback) {
                    callback(code);
                }

                return code;
            } else {
                $.ajax({
                    type: "GET",
                    url: templateUrl,
                    dataType: "html",
                    success: function(template) {
                        if(data === 'unknown' || data === null) {
                            //don't fill the template
                            if (callback) {
                                callback(template);
                            }
                        } else {
                            obj.templates[templateUrl] = template;

                            //fill the template
                            if (callback) {
                                callback(Handlebars.compile(template)(data));
                            }
                        }
                    },
                    error: callback
                });
            }
        }
    };

    obj.reloadTemplate = function(url) {
        $.ajax({
            type: "GET",
            url: url,
            dataType: "html",
            success: function(template) {
                obj.templates[url] = template;
            }
        });
    };

    obj.preloadTemplates = function() {
        var url;

        for(url in obj.configuration.templateUrls) {
            obj.reloadTemplate(obj.configuration.templateUrls[url]);
        }
    };

    $.fn.emptySelect = function() {
        return this.each(function() {
            if (this.tagName === 'SELECT') {
                this.options.length = 0;
            }
        });
    };

    $.fn.loadSelect = function(optionsDataArray) {
        return this.emptySelect().each(function() {
            if (this.tagName === 'SELECT') {
                var i, option, selectElement = this;
                for(i=0;i<optionsDataArray.length;i++){
                    option = new Option(optionsDataArray[i].value, optionsDataArray[i].key);
                    selectElement.options[selectElement.options.length] = option;
                }
            }
        });
    };

    $.event.special.delayedkeyup = {
        setup: function( data, namespaces ) {
            $(this).bind("keyup", $.event.special.delayedkeyup.handler);
        },

        teardown: function( namespaces ) {
            $(this).unbind("keyup", $.event.special.delayedkeyup.handler);
        },

        handler: function( event ) {
            var self = this, args = arguments;

            event.type = "delayedkeyup";

            $.doTimeout('delayedkeyup', 250, function() {
                $.event.handle.apply(self, args);
            });
        }
    };

    Handlebars.registerHelper('t', function(i18nKey) {
        var params = { postProcess: 'sprintf', sprintf: _.map(_.toArray(arguments).slice(1, -1), Handlebars.Utils.escapeExpression)}, result;

        result = i18n.t(i18nKey, params);

        return new Handlebars.SafeString(result);
     });

    Handlebars.registerHelper('url', function(routeKey) {
        var result = "#" + router.getLink(router.configuration.routes[routeKey], _.toArray([arguments[1]]));

        //Don't return a safe string to prevent XSS.
        return result;
    });

    //format ISO8601; example: 2012-10-29T10:49:49.419+01:00
    Handlebars.registerHelper('date', function(unformattedDate, datePattern) {
        var date = dateUtil.parseDateString(unformattedDate), formattedDate;

        if(!dateUtil.isDateValid(date)) {
            return "";
        }

        if (datePattern && _.isString(datePattern)) {
            formattedDate = dateUtil.formatDate(date,datePattern);
        } else {
            formattedDate = dateUtil.formatDate(date);
        }

        return new Handlebars.SafeString(formattedDate);
    });

    //map should have format key : value
    Handlebars.registerHelper('selectm', function(map, elementName, selectedKey, selectedValue, multiple, height) {
        var result, prePart, postPart, content = "", isSelected, entityName;

        prePart = '<select';

        if (elementName && _.isString(elementName)) {
            prePart += ' name="' + elementName + '"';
        }

        if(multiple) {
            prePart += ' multiple="multiple"';
        }

        if(height) {
            prePart += ' style="height: '+ height +'px"';
        }

        prePart += '>';

        postPart = '</select> ';

        for (entityName in map) {
            isSelected = false;
            if (selectedValue && _.isString(selectedValue)) {
                if (selectedValue === map[entityName]) {
                    isSelected = true;
                }
            } else {
                if (selectedKey && selectedKey === entityName) {
                    isSelected = true;
                }
            }

            if (isSelected) {
                content += '<option value="' + entityName + '" selected="true">' + $.t(map[entityName]) + '</option>';
            } else {
                content += '<option value="' + entityName + '">' + $.t(map[entityName]) + '</option>';
            }
        }

        result = prePart + content + postPart;
        return new Handlebars.SafeString(result);
    });

    Handlebars.registerHelper('staticSelect', function(value, options){
        var selected = $('<select />').html(options.fn(this));
        selected.find('[value=' + value + ']').attr({'selected':'selected'});

        return selected.html();
    });

    Handlebars.registerHelper('select', function(map, elementName, selectedKey, selectedValue, additionalParams) {
        var result, prePart, postPart, content = "", isSelected, entityName, entityKey;

        if (map && _.isString(map)) {
            map = JSON.parse(map);
        }

        if (elementName && _.isString(elementName)) {
            prePart = '<select name="' + elementName + '" ' + additionalParams + '>';
        } else{
            prePart = '<select>';
        }

        postPart = '</select> ';

        for (entityName in map) {
            isSelected = false;
            if (selectedValue && _.isString(selectedValue) && selectedValue !== '') {
                if (selectedValue === map[entityName]) {
                    isSelected = true;
                }
            } else {
                if (selectedKey && selectedKey !== '' && selectedKey === entityName) {
                    isSelected = true;
                }
            }

            if (entityName === '__null') {
                entityKey = '';
            } else {
                entityKey = entityName;
            }

            if (isSelected) {
                content += '<option value="' + entityKey + '" selected="true">' + $.t(map[entityName]) + '</option>';
            } else {
                content += '<option value="' + entityKey + '">' + $.t(map[entityName]) + '</option>';
            }
        }

        result = prePart + content + postPart;
        return new Handlebars.SafeString(result);
    });

    Handlebars.registerHelper('p', function(countValue, options) {
        var params, result;
        params = { count: countValue };
        result = i18n.t(options.hash.key, params);
        return new Handlebars.SafeString(result);
     });


    Handlebars.registerHelper('equals', function(val, val2, options) {
        if(val === val2){
            return options.fn(this);
        }
    });

    Handlebars.registerHelper('checkbox', function(map, name, options) {
        var ret = "<div class='checkboxList' id='"+name+"'><ol>", idx,
            sortedMap = _.chain(map)
                            .pairs()
                            .sortBy(function (arr) { return arr[1]; })
                            .value();

        for(idx=0;idx<sortedMap.length;idx++) {
            ret += '<li><input type="checkbox" name="'+ name +'" value="'+ sortedMap[idx][0] +'" id="'+ name +'_'+ encodeURIComponent(sortedMap[idx][0]) +'"><label for="'+ name +'_'+ encodeURIComponent(sortedMap[idx][0]) +'">' + sortedMap[idx][1] + '</label></li>';
        }

        ret += "</ol></div>";

        return new Handlebars.SafeString(ret);
    });

    Handlebars.registerHelper('siteImages', function(images, options) {
        var ret = "", i;

        for(i = 0; i < images.length; i++) {
            ret += '<img class="item" src="' + encodeURI(images[i]) +'" data-site-image="'+ encodeURI(images[i]) +'" />';
        }

        return new Handlebars.SafeString(ret);
    });

    Handlebars.registerHelper("each_with_index", function(array, fn) {
        var buffer = "",
            item,
            k=0,
            i=0,
            j=0;

        for (i = 0, j = array.length; i < j; i++) {
            if (array[i]) {
                item = {};
                item.value = array[i];

                // stick an index property onto the item, starting with 0
                item.index = k;

                item.first = (k === 0);
                item.last = (k === array.length);

                // show the inside of the block
                buffer += fn.fn(item);

                k++;
            }
        }

        // return the finished buffer
        return buffer;

    });

    Handlebars.registerHelper('camelCaseToTitle', function(string) {
        var newString = string.replace(/([a-z])([A-Z])/g, '$1 $2');
        return new Handlebars.SafeString(newString[0].toUpperCase() + newString.slice(1));
    });

    Handlebars.registerHelper('stringify', function(string, spaces) {
        spaces = spaces ? spaces : 0 ;
        var newString = JSON.stringify(string, null, spaces);
        return newString;
    });

    Handlebars.registerHelper('ifObject', function(item, options) {
        if(typeof item === 'object') {
            return options.fn(this);
        } else {
            return options.inverse(this);
        }
    });

    obj.loadSelectOptions = function(data, el, empty, callback) {
        if( empty === undefined || empty === true ) {
            data = [ {
                "key" : "",
                "value" : $.t("common.form.pleaseSelect")
            } ].concat(data);
            }

        el.loadSelect(data);

        if(callback) {
            callback(data);
        }
    };


    obj.jqConfirm = function(message,confirmCallback,width){
        var btns = {};
        btns[$.t('common.form.cancel')] = function(){
            $('#jqConfirm').dialog('close');
        };
        btns[$.t('common.form.ok')] = function(){
            $('#jqConfirm').dialog('close');
            confirmCallback();
        };

        if(_.isUndefined(width)) {
            width = "550px";
        }

        $('<div id="jqConfirm">' + message + '</div>')
            .dialog({
                title: $.t('common.form.confirm'),
                modal: true,
                resizable: false,
                bgiframe: true,
                width: width,
                buttons: btns,
                close: function(){
                    $('#jqConfirm').dialog('destroy').remove();
                }
            })
        ;
    };

    obj.responseMessageMatch = function(error, string){
        var responseMessage = JSON.parse(error).message;
        return responseMessage.indexOf(string) > -1;
    };

    // Registering global mixins

    _.mixin({

        /*  findByValues takes a collection and returns a subset made up of objects where the given property name matches a value in the list.  
            For example:

            var collections = [
                {id: 1, stack: 'am'},
                {id: 2, stack: 'dj'},
                {id: 3, stack: 'idm'},
                {id: 4, stack: 'api'},
                {id: 5, stack: 'rest'}
            ];

            var filtered = _.findByValues(collections, "id", [1,3,4]);

            filtered = [
                {id: 1, stack: 'am'},
                {id: 3, stack: 'idm'},
                {id: 4, stack: 'api'}
            ]

         */

        'findByValues': function(collection, property, values) {
            return _.filter(collection, function(item) {
                return _.contains(values, item[property]);
            });
        },

        /*  removeByValues takes a collection and returns a subset made up of objects where there is no match between the given property name and the values in the list.  
            For example:

            var filtered = _.removeByValues(collections, "id", [1,3,4]);

            filtered = [
                {id: 2, stack: 'dj'},
                {id: 5, stack: 'rest'}
            ]

         */
        'removeByValues': function(collection, property, values) {
            return _.reject(collection, function(item) {
                return _.contains(values, item[property]);
            });
        }
    });

    return obj;
});