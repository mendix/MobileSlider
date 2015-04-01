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
