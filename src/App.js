/*
  Application Base Framework, version 1
  By: Logan Head
*/
(function () {
    var App = App || {};
    App = function () {
        var moduledata = {},
            modules = [],
            cache = {},
            fn = {
                pubbox: function (core) {
                    var init = function () {
                        this.publish = core.publish;
                        this.subscribe = core.subscribe;
                    }
                    return init;
                }
            };
         return {
            register: function (moduleid, creator, options) {
                moduledata[moduleid] = {
                    creator: creator,
                    instance: null,
                    options: options || {}
                };
            },
            start: function (moduleid) {

                if (moduledata[moduleid].instance === null) {
                    moduledata[moduleid].instance = new moduledata[moduleid].creator(new fn.pubbox(this), moduledata[moduleid].options);
                    moduledata[moduleid].instance.init(moduledata[moduleid].options);
                }
            },
            stop: function (moduleid) {
                var data = moduledata[moduleid];
                if (data.instance) {
                    data.instance.destroy();
                    data.instance = null;
                }
            },
            startall: function () {
                for (var moduleid in moduledata) {
                    if (moduledata.hasownproperty(moduleid)) {
                        this.start(moduleid);
                    }
                }
            },
            registered: function () {
                return moduledata;
            },
            addmodule: function (module) {
                modules.push(module);
            },
            modules: function () {
                return modules;
            },
            stopall: function () {
                for (var moduleid in moduledata) {
                    if (moduledata.hasownproperty(moduleid)) {
                        this.stop(moduleid);
                    }
                }
            },
            publish: function (message, args) {
                try {
                    var i;
                    for (i = 0; i < cache[message].length; i++) {
                        if (typeof args === "undefined") {
                            args = [];
                        }
                        if (!(args instanceof array)) {
                            args = [args];
                        }
                        cache[message][i].apply(this, args);
                    };
                } catch (err) { }
            },
            subscribe: function (message, callback) {
                if (!cache[message]) {
                    cache[message] = [];
                }
                cache[message].push(callback);
                return [message, callback];
            },
            unsubscribe: function (handle) {
                var t = handle[0];
                $.each(cache[t], function (idx) {
                    if (this === handle[1]) {
                        cache[t].splice(idx, 1);
                    }
                });
            }
        };
    }();
})();