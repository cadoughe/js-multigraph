window.multigraph.util.namespace("window.multigraph.graphics.logger", function (ns) {
    "use strict";

    ns.mixin.add(function (ns) {
        var Multigraph = ns.Multigraph;

        Multigraph.hasA("width").which.isA("number");
        Multigraph.hasA("height").which.isA("number");

        Multigraph.hasA("baseX").which.isA("number");
        Multigraph.hasA("baseY").which.isA("number");
        Multigraph.hasA("mouseLastX").which.isA("number");
        Multigraph.hasA("mouseLastY").which.isA("number");

        Multigraph.hasA("logger");

        Multigraph.respondsTo("redraw", function () {
            var that = this;
            window.requestAnimationFrame(function () {
                that.render();
            });
        });

        Multigraph.respondsTo("init", function () {
            this.width(window.multigraph.jQuery(this.div()).width());
            this.height(window.multigraph.jQuery(this.div()).height());
            this.render();
            console.log(this.dumpLog());
        });

        Multigraph.respondsTo("render", function () {
            var i;
            this.initializeGeometry(this.width(), this.height());
            for (i = 0; i < this.graphs().size(); ++i) {
                this.graphs().at(i).render(this.width(), this.height());
            }
        });

        Multigraph.respondsTo("dumpLog", function () {
            var output = "",
                i;

            for (i = 0; i < this.graphs().size(); ++i) {
                output += this.graphs().at(i).dumpLog();
            }

            output += "\n";

            return output;
        });

    });

    window.multigraph.core.Multigraph.createLoggerGraph = function (options) {
        var muglPromise,
            deferred;

        try {
            window.multigraph.parser.jquery.mixin.apply(window.multigraph, "parseXML");
            ns.mixin.apply(window.multigraph.core);
            window.multigraph.normalizer.mixin.apply(window.multigraph.core);

            muglPromise = window.multigraph.jQuery.ajax({
                "url"      : options.mugl,
                "dataType" : "text"
            }),

            deferred = window.multigraph.jQuery.Deferred();
        } catch (e) {
            options.messageHandler.error(e);
        }

        muglPromise.done(function (data) {
            try {
                var multigraph = window.multigraph.core.Multigraph.parseXML( window.multigraph.parser.jquery.stringToJQueryXMLObj(data), options.messageHandler );
                multigraph.normalize();
                multigraph.div(options.div);
                multigraph.init();
                deferred.resolve(multigraph);
            } catch (e) {
                options.messageHandler.error(e);
            }
        });

        return deferred.promise();

    };

});
