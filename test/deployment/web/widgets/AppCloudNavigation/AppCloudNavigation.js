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

});