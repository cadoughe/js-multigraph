if (!window.multigraph) {
    window.multigraph = {};
}

if (!window.multigraph.Axis) {
    window.multigraph.Axis = {};
}

if (!window.multigraph.Axis.Labels) {
    window.multigraph.Axis.Labels = {};
}

(function (ns) {
    "use strict";

    var Label = new ns.ModelTool.Model( 'Label', function () {
        this.hasA("format").which.validatesWith(function (format) {
            return typeof(format) === 'string';
        });
        this.hasA("start").which.validatesWith(function (start) {
            return typeof(start) === 'string';
        });
        this.hasA("angle").which.validatesWith(function (angle) {
            return typeof(angle) === 'string';
        });
        this.hasA("position").which.validatesWith(function (position) {
            return ns.utilityFunctions.validateCoordinatePair(position);
        });
        this.hasA("anchor").which.validatesWith(function (anchor) {
            return ns.utilityFunctions.validateCoordinatePair(anchor);
        });
        this.hasA("spacing").which.validatesWith(function (spacing) {
            return typeof(spacing) === 'string';
        });
        this.hasA("densityfactor").which.validatesWith(function (densityfactor) {
            return typeof(densityfactor) === 'string';
        });

    });

    ns.Axis.Labels.Label = Label;

}(window.multigraph));