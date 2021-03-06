window.multigraph.util.namespace("window.multigraph.serializer", function (ns) {
    "use strict";

    ns.mixin.add(function (ns, serialize) {

        var serializeLabels = function (axis, serialize) {

            var labelers = axis.labelers(),
                nlabelers = axis.labelers().size();

            // if this axis has no labelers, output nothing
            if (nlabelers <= 0) { return ""; }

            // if all the Labelers are equal except for spacing, output a single <labels> tag
            var singleLabels = true;
            var i = 1;
            var spacings = [ labelers.at(0).spacing() ];
            while (singleLabels && i<nlabelers) {
                spacings.push(labelers.at(i).spacing());
                singleLabels = labelers.at(0).isEqualExceptForSpacing(labelers.at(i));
                ++i;
            }
            if (singleLabels) {
                return labelers.at(0)[serialize](spacings.join(" "), "labels");
            }
            // otherwise, serialize each individual labeler as a <label> tag,
            // collapsing together consecutive ones that are equal except for
            // spacing:
            var labeltags = [];
            spacings = [];
            for (i = 0; i < nlabelers; ++i) {
                // save the current spacing into the spacings array
                spacings.push(labelers.at(i).spacing().toString());
                if ((i >= nlabelers-1) || !labelers.at(i).isEqualExceptForSpacing(labelers.at(i+1))) {
                    // if this labeler's spacing is not the same as the next one in the list,
                    // output this abeler, with the current set of spacings, and reset the
                    // spacings array
                    labeltags.push( labelers.at(i).serialize( spacings.join(" ") ) );
                    spacings = [];
                }
            }
            return "<labels>" + labeltags.join("") + "</labels>";
        };
        
        ns.core.Axis.prototype[serialize] = function () {
            var attributeStrings = [],
                childStrings,
                output = '<' + this.orientation() + 'axis ';

            if (this.color() !== undefined)          { attributeStrings.push('color="'           + this.color().getHexString()     + '"'); }
            if (this.id() !== undefined)             { attributeStrings.push('id="'              + this.id()                       + '"'); }
            if (this.type() !== undefined)           { attributeStrings.push('type="'            + this.type()                     + '"'); }
            if (this.pregap() !== undefined)         { attributeStrings.push('pregap="'          + this.pregap()                   + '"'); }
            if (this.postgap() !== undefined)        { attributeStrings.push('postgap="'         + this.postgap()                  + '"'); }
            if (this.anchor() !== undefined)         { attributeStrings.push('anchor="'          + this.anchor()                   + '"'); }
            if (this.min() !== undefined)            { attributeStrings.push('min="'             + this.min()                      + '"'); }
            if (this.minoffset() !== undefined)      { attributeStrings.push('minoffset="'       + this.minoffset()                + '"'); }
            if (this.max() !== undefined)            { attributeStrings.push('max="'             + this.max()                      + '"'); }
            if (this.maxoffset() !== undefined)      { attributeStrings.push('maxoffset="'       + this.maxoffset()                + '"'); }
            if (this.positionbase() !== undefined)   { attributeStrings.push('positionbase="'    + this.positionbase()             + '"'); }
            if (this.tickmin() !== undefined)        { attributeStrings.push('tickmin="'         + this.tickmin()                  + '"'); }
            if (this.tickmax() !== undefined)        { attributeStrings.push('tickmax="'         + this.tickmax()                  + '"'); }
            if (this.highlightstyle() !== undefined) { attributeStrings.push('highlightstyle="'  + this.highlightstyle()           + '"'); }
            if (this.linewidth() !== undefined)      { attributeStrings.push('linewidth="'       + this.linewidth()                + '"'); }
            if (this.length() !== undefined)         { attributeStrings.push('length="'          + this.length().serialize()       + '"'); }
            if (this.position() !== undefined)       { attributeStrings.push('position="'        + this.position().serialize()     + '"'); }
            if (this.base() !== undefined)           { attributeStrings.push('base="'            + this.base().serialize()         + '"'); }
            if (this.minposition() !== undefined)    { attributeStrings.push('minposition="'     + this.minposition().serialize()  + '"'); }
            if (this.maxposition() !== undefined)    { attributeStrings.push('maxposition="'     + this.maxposition().serialize()  + '"'); }

            output += attributeStrings.join(' ');

            childStrings = [];
            if (this.title())             { childStrings.push(this.title()[serialize]());        }
            if (this.labelers().size()>0) { childStrings.push(serializeLabels(this, serialize)); }
            if (this.grid())              { childStrings.push(this.grid()[serialize]());         }

            if (this.pan()) {
                // only serialize the pan subobject if it differs from the default
                if (!this.pan().allowed() ||
                    (this.pan().min() !== undefined) ||
                    (this.pan().max() !== undefined)) {
                    childStrings.push(this.pan()[serialize]());
                }
            }

            if (this.zoom()) {
                // only serialize the zoom subobject if it differs from the default
                if (!this.zoom().allowed() ||
                    (this.zoom().anchor() !== undefined) ||
                    (this.zoom().min() !== undefined) ||
                    (this.zoom().max() !== undefined)) {
                childStrings.push(this.zoom()[serialize]());
                }
            }

//            if (this.binding())           { childStrings.push(this.binding()[serialize]());      }


            if (childStrings.length > 0) {
                output += '>' + childStrings.join('') + '</' + this.orientation() + 'axis>';
            } else {
                output += '/>';
            }

            return output;
        };

    });
});
