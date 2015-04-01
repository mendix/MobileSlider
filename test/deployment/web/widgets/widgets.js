dojo.provide("widgets.widgets");
dojo.registerModulePath("AppCloudNavigation", "../../widgets/AppCloudNavigation");
dojo.provide("AppCloudNavigation.AppCloudNavigation");
dojo.require("dojo.io.script");

mendix.widget.declare('AppCloudNavigation.AppCloudNavigation', {
	inputargs: {
		mendixserver : ''
	},

	_hasStarted : false,

	startup : function() {
		if (!this._hasStarted) {
			this._hasStarted = true;

			mxui.dom.addClass(this.domNode, "mx-mendixtoolbar");

			if (!window.mxToolbarSettings || window.mxToolbarSettings.started !== true) {

				var url = this.mendixserver + (this.mendixserver.match(/\/$/) != null ? "" : "/");
				window.mxToolbarSettings = {
					toolbarBaseUrl: url
				};

				dojo.io.script.get({
					url: url + 'mendixtoolbar/js/appcloudservice.js?PP_5.27',
					error : dojo.hitch(this, function (e) {
						console && console.log('Mendix AppCloud Navigation could not load external script: ', e);
					})
				});
			}
		}
		this.actLoaded();
	},

	uninitialize : function() {

	}

});;
dojo.registerModulePath("GreenSock", "../../widgets/GreenSock");
/*jslint white:true, nomen: true, plusplus: true */
/*global mx, define, require, browser, devel, console, window */
/*mendix */
/*
    GreenSock
    ========================

    @file      : GreenSock.js
    @version   : 1.0
    @author    : Gerhard Richard Edens
    @date      : Fri, 27 Feb 2015 08:08:07 GMT
    @copyright : Mendix B.V.
    @license   : Apache 2

    Documentation
    ========================
    Describe your widget here.
*/

// Required module list. Remove unnecessary modules, you can always get them back from the boilerplate.
require([
    'dojo/_base/declare', 'mxui/widget/_WidgetBase', 'dijit/_TemplatedMixin',
    
    'mxui/dom', 'dojo/dom', 'dojo/query', 'dojo/dom-prop', 'dojo/dom-geometry', 'dojo/dom-class', 'dojo/dom-style', 'dojo/dom-construct', 'dojo/_base/array', 'dojo/_base/lang', 'dojo/text',
    
    'GreenSock/lib/jquery-1.11.2.min', 
    
    'dojo/text!GreenSock/widget/template/GreenSock.html', 'GreenSock/lib/TweenMax.min'
], function (declare, _WidgetBase, _TemplatedMixin, dom, dojoDom, domQuery, domProp, domGeom, domClass, domStyle, domConstruct, dojoArray, lang, text, _jQuery, widgetTemplate) {
    'use strict';
    
    var TweenMax = window.TweenMax;
    
    // Declare widget's prototype.
    return declare('GreenSock.widget.GreenSock', [ _WidgetBase, _TemplatedMixin ], {
        // _TemplatedMixin will create our dom node using this HTML template.
        templateString: widgetTemplate,

        // Parameters configured in the Modeler.
        mfToExecute: "",
        messageString: "",
        backgroundColor: "",

        // Internal variables. Non-primitives created in the prototype are shared between all widget instances.
        _handle: null,
        _contextObj: null,
        _objProperty: null,

        // dojo.declare.constructor is called to construct the widget instance. Implement to initialize non-primitive properties.
        constructor: function () {
            this._objProperty = {};
        },

        // dijit._WidgetBase.postCreate is called after constructing the widget. Implement to do extra setup work.
        postCreate: function () {
            console.log(this.id + '.postCreate');
        },

        // mxui.widget._WidgetBase.update is called when context is changed or initialized. Implement to re-render and / or fetch data.
        update: function (obj, callback) {
            console.log(this.id + '.update');

            this._contextObj = obj;
            this._resetSubscriptions();
            this._updateRendering();

            callback();
        },

        // mxui.widget._WidgetBase.enable is called when the widget should enable editing. Implement to enable editing if widget is input widget.
        enable: function () {

        },

        // mxui.widget._WidgetBase.enable is called when the widget should disable editing. Implement to disable editing if widget is input widget.
        disable: function () {

        },

        // mxui.widget._WidgetBase.resize is called when the page's layout is recalculated. Implement to do sizing calculations. Prefer using CSS instead.
        resize: function (box) {

        },

        // mxui.widget._WidgetBase.uninitialize is called when the widget is destroyed. Implement to do special tear-down work.
        uninitialize: function () {
            // Clean up listeners, helper objects, etc. There is no need to remove listeners added with this.connect / this.subscribe / this.own.
        },

        _updateRendering: function () {
            // TODO
        },

        _resetSubscriptions: function () {
            // Release handle on previous object, if any.
            if (this._handle) {
                this.unsubscribe(this._handle);
                this._handle = null;
            }

            if (this._contextObj) {
                this._handle = this.subscribe({
                    guid: this._contextObj.getGuid(),
                    callback: this._updateRendering
                });
            }
        }
    });
});
;
dojo.registerModulePath("MobileSliderBackground", "../../widgets/MobileSliderBackground");
/*jslint white:true, nomen: true, plusplus: true */
/*global mx, define, require, browser, devel, console, location, dojo, MobileSliderBackground, $, document, window, device, setTimeout */
/*mendix */
/*
    MobileSliderBackground
    ========================

    @file      : MobileSliderBackground.js
    @version   : 1.0
    @author    : Gerhard Richard Edens
    @date      : Wed, 25 Mar 2015 10:48:53 GMT
    @copyright : Mendix b.v.
    @license   : Apache 2

    Documentation
    ========================
    Describe your widget here.
*/

// Required module list. Remove unnecessary modules, you can always get them back from the boilerplate.
require([
    'dojo/_base/declare', 'mxui/widget/_WidgetBase', 'dijit/_TemplatedMixin',
    'mxui/dom', 'dojo/dom', 'dojo/query', 'dojo/dom-prop', 'dojo/dom-geometry', 'dojo/dom-class', 'dojo/dom-style', 'dojo/dom-construct', 'dojo/_base/array', 'dojo/_base/lang', 'dojo/text',
    'MobileSliderBackground/lib/jquery-1.11.2.min', 'dojo/text!MobileSliderBackground/widget/template/MobileSliderBackground.html'
], function (declare, _WidgetBase, _TemplatedMixin, dom, dojoDom, domQuery, domProp, domGeom, domClass, domStyle, domConstruct, dojoArray, lang, text, _jQuery, widgetTemplate) {
    'use strict';

    // Declare widget's prototype.
    return declare('MobileSliderBackground.widget.MobileSliderBackground', [_WidgetBase, _TemplatedMixin], {  //'MobileSliderBackground.widget.MobileSliderBackground', 
        // _TemplatedMixin will create our dom node using this HTML template.
        templateString: widgetTemplate,

        // Parameters configured in the Modeler.
        mfToExecute: "",
        messageString: "",
        backgroundColor: "",

        // Internal variables. Non-primitives created in the prototype are shared between all widget instances.
        _handle: null,
        _contextObj: null,
        _objProperty: null,

        // dojo.declare.constructor is called to construct the widget instance. Implement to initialize non-primitive properties.
        constructor: function () {
            this._objProperty = {};
        },

        // dijit._WidgetBase.postCreate is called after constructing the widget. Implement to do extra setup work.
        postCreate: function () {
            console.log(this.id + '.postCreate');

            if ($('#mx-slider-background').length === 0) {
                var backgroundImage = $('<div></div>'),
                    backgroundImageLayer = $('<div></div>');
                backgroundImage.attr('id', 'mx-slider-background');
                backgroundImageLayer.attr('id', 'mx-slider-background-layer');
                backgroundImage.append(backgroundImageLayer);
                $('#content').prepend(backgroundImage.wrapAll('<div>').parent().html());
            }

            this._setupEvents();
        },

        // mxui.widget._WidgetBase.update is called when context is changed or initialized. Implement to re-render and / or fetch data.
        update: function (obj, callback) {
            console.log(this.id + '.update');

            this._contextObj = obj;
            this._resetSubscriptions();
            this._updateRendering();

            callback();
        },

        // mxui.widget._WidgetBase.enable is called when the widget should enable editing. Implement to enable editing if widget is input widget.
        enable: function () {

        },

        // mxui.widget._WidgetBase.enable is called when the widget should disable editing. Implement to disable editing if widget is input widget.
        disable: function () {

        },

        // mxui.widget._WidgetBase.resize is called when the page's layout is recalculated. Implement to do sizing calculations. Prefer using CSS instead.
        resize: function (box) {

        },

        // mxui.widget._WidgetBase.uninitialize is called when the widget is destroyed. Implement to do special tear-down work.
        uninitialize: function () {
            // Clean up listeners, helper objects, etc. There is no need to remove listeners added with this.connect / this.subscribe / this.own.
        },

        _setupEvents: function () {
            $('#mx-slider-background-layer').on('mx.slide.set.background', lang.hitch(this, function(event, data) {
                $('#mx-slider-background-layer').css('background-image', 'url(\'' + mx.appUrl + data.background + '\')');
                $('#mx-slider-background-layer').css('background-size', '100% auto');
                $('#mx-slider-background-layer').css('width', data.width + 'px');
                $('#mx-slider-background-layer').css('height', data.height + 'px');
            }));
            // iOS
            window.addEventListener('resize', lang.hitch(this, this._orientationChanged));
        },

        _orientationChanged: function(){
            $('#mx-slider-background').css('width', window.innerWidth + 'px');
            $('#mx-slider-background').css('height', window.innerHeight + 'px');
            $('#mx-slider-background-layer').css('height', window.innerHeight + 'px');
            $('#mx-slider-background-layer').css('background-size', '100% auto');
        },

        _updateRendering: function () {
        },

        _resetSubscriptions: function () {
            // Release handle on previous object, if any.
            if (this._handle) {
                this.unsubscribe(this._handle);
                this._handle = null;
            }

            if (this._contextObj) {
                this._handle = this.subscribe({
                    guid: this._contextObj.getGuid(),
                    callback: this._updateRendering
                });
            }
        }
    });
});
;
dojo.registerModulePath("SprintrFeedbackWidget", "../../widgets/SprintrFeedbackWidget");
dojo.provide("SprintrFeedbackWidget.SprintrFeedback");
dojo.require("dojo.io.script");

mendix.widget.declare('SprintrFeedbackWidget.SprintrFeedback', {
    inputargs: {

		sprintrapp : '',
		entity : '',
		usernameattr : '',
		emailattr : '',
		allowFile : true,
		allowSshot : false,
		sprintrserver : ''

    },

	postCreate : function(){
		if (!window.sprintrFeedback) {
			var url = this.sprintrserver + (this.sprintrserver.match(/\/$/) != null ? "" : "/");
			dojo.io.script.attach("sprintrfeedbackWrapper", url + "feedback/sprintrfeedback.js");

			this.checkScript(function () { return typeof window.sprintrFeedback != "undefined";}, dojo.hitch(this, function() {
				mx.addOnLoad(dojo.hitch(this, this.loadData));
			}), 0);
		} else {
			mx.addOnLoad(dojo.hitch(this, this.loadData));
		}
		this.actRendered();
	},
	loadData : function () {
		if (this.entity !== '' && !!mx.session.getUserId()) {
			mx.processor.get({
				guid : mx.session.getUserId(),
				callback : dojo.hitch(this, this.startFeedback),
				error: function(e) {
					alert("Error while loading feedback form: " +e);
				}
			});
		} else {
			this.startFeedback(null);
		}
	},
	startFeedback : function (userobj) {
		var data = {
			'sprintrid' : this.sprintrapp,
			'allowFile' : this.allowFile,
			'allowSshot' : this.allowSshot
		};
		var username = '';
		if (userobj != null && this.usernameattr != '' && userobj.hasAttribute(this.usernameattr))
			username = userobj.getAttribute(this.usernameattr)
		else if (mx.session.getUserId() > 0 && mx.session.isGuest && !mx.session.isGuest())
			username = mx.session.getUserName();

		var emailaddr =
			(userobj != null && this.emailattr != '' && userobj.hasAttribute(this.emailattr))
			? userobj.getAttribute(this.emailattr)
			: (username.match(/.+@.+\..+/) ? username : ''); //if it looks like an email address, it is one.

		var roles = mx.session.getUserRoles();
		var rolenames = [];
		for(var i = 0; i < roles.length; i++)
			rolenames.push(roles[i].getAttribute("Name"));

		data.userdata = {
			'username' : username,
			'emailaddress' : emailaddr,
			'userroles' : rolenames.join(" ") + " (account: " + username + ")"
		};
		window.sprintrFeedback.create(data);
	},
	checkScript : function (elem, cb, counter) {
        if (elem()) {
            cb();
        } else {
            if (counter < 30) {
                setTimeout(dojo.hitch(this, function () {
                    this.checkScript(elem, cb, counter+1);
                }), 50);
            }
        }
    },
	uninitialize : function(){
	}
});;
dojo.registerModulePath("MobileSlider", "../../widgets/MobileSlider");
/*jslint white:true, nomen: true, plusplus: true */
/*global mx, define, require, browser, devel, console, Draggable, document, TweenMax, Elastic, $, window, navigator, setTimeout */
/*mendix */
/*
    MobileSlider
    ========================

    @file      : MobileSlider.js
    @version   : 1.0
    @author    : Gerhard Richard Edens
    @date      : Tue, 24 Mar 2015 08:15:20 GMT
    @copyright : Mendix b.v.
    @license   : Apache 2

    Documentation
    ========================
    Describe your widget here.
*/

// Required module list. Remove unnecessary modules, you can always get them back from the boilerplate.
require([

    // Mixins
    'dojo/_base/declare', 'mxui/widget/_WidgetBase', 'dijit/_TemplatedMixin',

    // Dojo
    'mxui/dom', 'dojo/dom', 'dojo/query', 'dojo/dom-prop', 'dojo/dom-geometry', 'dojo/dom-class', 'dojo/dom-style', 'dojo/dom-construct', 'dojo/_base/array', 'dojo/_base/lang', 'dojo/text',

    // jQuery
    'MobileSlider/lib/jquery-1.11.2.min', 

    // Templates
    'dojo/text!MobileSlider/widget/template/MobileSlider.html'

], function (declare, _WidgetBase, _TemplatedMixin, dom, dojoDom, domQuery, domProp, domGeom, domClass, domStyle, domConstruct, dojoArray, lang, text, _jQuery, widgetTemplate) {
    'use strict';

    // Declare widget's prototype.
    return declare('MobileSlider.widget.MobileSlider', [ _WidgetBase, _TemplatedMixin ], {
        // _TemplatedMixin will create our dom node using this HTML template.
        templateString: widgetTemplate,

        // Parameters configured in the Modeler.
        mfToExecute: "",
        messageString: "",
        backgroundColor: "",

        // Internal variables. Non-primitives created in the prototype are shared between all widget instances.
        _handle: null,
        _contextObj: null,
        _objProperty: null,

        // Snap points
        _snapPoints: null,
        _snapCount: null,
        _snapping: null,
        _originalOffset: null,
        _limit: null,

        // Added style for mx-slide.
        _addedStyle: null,

        // dojo.declare.constructor is called to construct the widget instance. Implement to initialize non-primitive properties.
        constructor: function () {
            var slideWidthStyle = $('<style></style>');

            // Properties
            this._snapCount = 0;
            this._snapPoints = [];
            this._objProperty = {};

            // Slide width style set!
            if (this._addedStyle === null) {
                this._addedStyle = true;
                $('head').append('<style type="text/css" id="mx-slides-style">.mx-slide { width: ' + window.innerWidth + 'px; }</style>');
            }
        },

        // dijit._WidgetBase.postCreate is called after constructing the widget. Implement to do extra setup work.
        postCreate: function () {
            var slide = null,
                properties = null,

                documentWidth = null,
                documentHeight = null,

                i = null,
                containerDraggable = null,
                slideClass = 'mx-slide';

            console.log(this.id + '.postCreate');

            // Go through slides
            for(slide in this.slides){
                if (this.slides.hasOwnProperty(slide)){
                    properties = this.slides[slide];
                    this._slides.appendChild(dom.create('div', { 
                        'class': (this.useFixedViewportWidth) ? 'mx-slide-view' : 'mx-slide', 
                        'id': this.id + '_mx_slide_' + properties.number,
                        'data-number': properties.number
                    }, ''));
                }
            }


            // Width
            documentWidth = window.innerWidth; 
            documentHeight = window.innerHeight; 

            // Set viewport and actual widget width!
            this._createSnapPointsAndSizes();

            // Draggable.
            containerDraggable = Draggable.create($('#' + this.id + ' .mx-slides-viewport'), {
                type: 'left',
                maxDuration: 1.25,
                minDuration: 0.75,
                edgeResistance: 0.8,
                onDragStart:lang.hitch(this, function()
                                       {
                    this._originalOffset = $('#' + this.id + ' .mx-slides-viewport').offset().left;
                }),
                onDragEnd: lang.hitch(this, function() {
                    this._slideToNextBestSnapPoint();
                })//function end
            });//draggable end

            //{ type:"x", edgeResistance:0.65, bounds: '#' + this.id, lockAxis: true, throwProps: true });

            this._setupEvents();
        },

        // mxui.widget._WidgetBase.update is called when context is changed or initialized. Implement to re-render and / or fetch data.
        update: function (obj, callback) {
            console.log(this.id + '.update');

            this._contextObj = obj;
            this._resetSubscriptions();
            this._updateRendering();

            callback();
        },

        // mxui.widget._WidgetBase.enable is called when the widget should enable editing. Implement to enable editing if widget is input widget.
        enable: function () {

        },

        // mxui.widget._WidgetBase.enable is called when the widget should disable editing. Implement to disable editing if widget is input widget.
        disable: function () {

        },

        // mxui.widget._WidgetBase.resize is called when the page's layout is recalculated. Implement to do sizing calculations. Prefer using CSS instead.
        resize: function (box) {

        },

        // mxui.widget._WidgetBase.uninitialize is called when the widget is destroyed. Implement to do special tear-down work.
        uninitialize: function () {
            // Clean up listeners, helper objects, etc. There is no need to remove listeners added with this.connect / this.subscribe / this.own.
        },

        _formCallback : function(form) {
            console.log(form.id);
        },

        _setupEvents: function () {
            // iOS
            window.addEventListener('resize', lang.hitch(this, this._orientationChanged));
        },

        _orientationChanged: function(){
            if ($('#mx-slides-style').length === 1) {
                $('#mx-slides-style').html('.mx-slide { width: ' + window.innerWidth + 'px; }');
                this._createSnapPointsAndSizes();
                this._slideToNextBestSnapPoint();
            }
        },

        _createSnapPointsAndSizes: function(){
            var documentWidth = window.innerWidth, 
                documentHeight = window.innerHeight,
                i = null; 

            this._snapPoints = [];

            if (this.useFixedViewportWidth) {

                // Setting the background!
                $('#mx-slider-background-layer').trigger('mx.slide.set.background', [{
                    background: this.slides[0].backgroundImage,
                    width: (this.fixedViewportWidth * documentWidth),
                    height: documentHeight
                }]);

                // Slides
                this._limit = this.fixedViewportWidth - 1;

                $(this._slideDots).html('');

                // Snap points.
                for(i = 0; i < this.fixedViewportWidth; i++)
                {
                    this._snapPoints.push((i === 0) ? 0 : -documentWidth * i);
                    $(this._slideDots).append('<span class="mx-slide-dot-around"><span class="mx-slide-dot" id="mx-slide-image-' + this.id + '-' + i + '"></span></span>');
                }
                $('#mx-slide-image-' + this.id + '-0').attr('class', 'mx-slide-dot active');

                $('#' + this.id).css('width', documentWidth);
                $('#' + this.id + ' .mx-slides-viewport').css('width', documentWidth * this.fixedViewportWidth);

            } else {

                // Setting the background!
                $('#mx-slider-background-layer').trigger('mx.slide.set.background', [{
                    background: this.slides[0].backgroundImage,
                    width: (this.slides.length * documentWidth),
                    height: documentHeight
                }]);

                // Slides
                this._limit = this.slides.length - 1;

                $(this._slideDots).html('');

                // Snap points.
                for(i = 0; i < this.slides.length; i++)
                {
                    this._snapPoints.push((i === 0) ? 0 : -documentWidth * i);
                    $(this._slideDots).append('<span class="mx-slide-dot-around"><span class="mx-slide-dot" id="mx-slide-image-' + this.id + '-' + i + '"></span></span>');
                }
                $('#mx-slide-image-' + this.id + '-0').attr('class', 'mx-slide-dot active');

                $('#' + this.id).css('width', documentWidth);
                $('#' + this.id + ' .mx-slides-viewport').css('width', documentWidth * this.slides.length);

            }
        },

        _slideToNextBestSnapPoint: function() {
            var documentWidth = (window.innerWidth / 2),
                endValue = $('#' + this.id + ' .mx-slides-viewport').position().left,
                originalOffset = this._originalOffset,
                count = null,
                i = null;

            //the las value to be used as a snap point
            this._lastEndValue = this._snapPoints[this._snapCount];

            //going forward
            if(endValue < this._lastEndValue + documentWidth && this._snapCount < this._limit)
            {
                this._snapCount++;
            }

            if(endValue > this._lastEndValue - documentWidth && this._snapCount > 0)
            {
                this._snapCount--;
            }

            // Snap points.
            count = (this.useFixedViewportWidth) ? this.fixedViewportWidth : this.slides.length;
            for(i = 0; i < count; i++)
            {
                $('#mx-slide-image-' + this.id + '-' + i).attr('class', 'mx-slide-dot');
            }
            $('#mx-slide-image-' + this.id + '-' + this._snapCount).attr('class', 'mx-slide-dot active');


            // TweenLite.
            TweenMax.to($('#mx-slider-background-layer')[0], 3,{
                left: (this._snapPoints[this._snapCount] / 2)
            });
            TweenMax.to($('#' + this.id + ' .mx-slides-viewport')[0], 0.1,{
                left: this._snapPoints[this._snapCount]
            });
        },

        _updateRendering: function () {
            var slide = null,
                properties = null;

            for(slide in this.slides){
                if (this.slides.hasOwnProperty(slide)){
                    properties = this.slides[slide];
                    // Add to dojo attach point
                    mx.ui.openForm(properties.slide, {
                        location: "content",
                        domNode: dojoDom.byId(this.id + '_mx_slide_' + properties.number)
                    });
                }
            }
        },

        _resetSubscriptions: function () {
            // Release handle on previous object, if any.
            if (this._handle) {
                this.unsubscribe(this._handle);
                this._handle = null;
            }

            if (this._contextObj) {
                this._handle = this.subscribe({
                    guid: this._contextObj.getGuid(),
                    callback: this._updateRendering
                });
            }
        }
    });
});
;
