
const exportPNG = function () {

    var svg = document.querySelector("svg");
    var svgData = new XMLSerializer().serializeToString(svg);

    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext("2d");

    var dataUri = '';
    try {
        dataUri = 'data:image/svg+xml;base64,' + btoa(svgData);
    } catch (ex) {

        // For browsers that don't have a btoa() method, send the text off to a webservice for encoding
        /* Uncomment if needed (requires jQuery)
        $.ajax({
            url: "http://www.mysite.com/webservice/encodeString",
            data: { svg: svgData },
            type: "POST",
            async: false,
            success: function(encodedSVG) {
                dataUri = 'data:image/svg+xml;base64,' + encodedSVG;
            }
        })
        */

    }

    var img = document.createElement("img");

    img.onload = function () {
        ctx.drawImage(img, 0, 0);

        try {

            // Try to initiate a download of the image
            var a = document.createElement("a");
            a.download = "MDMS_Graph_Export.png";
            a.href = canvas.toDataURL("image/png");
            document.querySelector("body").appendChild(a);
            a.click();
            document.querySelector("body").removeChild(a);

        } catch (ex) {

            // If downloading not possible (as in IE due to canvas.toDataURL() security issue)
            // then display image for saving via right-click

            var imgPreview = document.createElement("div");
            imgPreview.appendChild(img);
            document.querySelector("body").appendChild(imgPreview);

        }
    };

    img.src = dataUri;

}


const data2 = [
    {
        title: "ANTWERPEN",
        numbers: [
            { legend: "17-25", quantity: 207 },
            { legend: "26-30", quantity: 370 },
            { legend: "31-35", quantity: 373 },
            { legend: "36-40", quantity: 373 },

            { legend: "41-45", quantity: 373 },
            { legend: "46-50", quantity: 373 },
            { legend: "51-55", quantity: 373 },
            { legend: "56-60", quantity: 373 },

            { legend: "61-65", quantity: 373 },
            { legend: "66-70", quantity: 373 },
            { legend: "71-75", quantity: 373 },
            { legend: "76-80", quantity: 373 },

            { legend: "81-85", quantity: 373 },
            { legend: "86-90", quantity: 373 },
        ]
    },
    {
        title: "BRABANT-WALLON",
        numbers: [
            { legend: "17-25", quantity: 207 },
            { legend: "26-30", quantity: 370 },
            { legend: "31-35", quantity: 373 },
            { legend: "36-40", quantity: 373 },

            { legend: "41-45", quantity: 373 },
            { legend: "46-50", quantity: 373 },
            { legend: "51-55", quantity: 373 },
            { legend: "56-60", quantity: 373 },

            { legend: "61-65", quantity: 373 },
            { legend: "66-70", quantity: 373 },
            { legend: "71-75", quantity: 373 },
            { legend: "76-80", quantity: 373 },

            { legend: "81-85", quantity: 373 },
            { legend: "86-90", quantity: 373 },
        ]
    },
    {
        title: "BRUXELLES-BRUSSEL",
        numbers: [
            { legend: "17-25", quantity: 207 },
            { legend: "26-30", quantity: 370 },
            { legend: "31-35", quantity: 373 },
            { legend: "36-40", quantity: 373 },

            { legend: "41-45", quantity: 373 },
            { legend: "46-50", quantity: 373 },
            { legend: "51-55", quantity: 373 },
            { legend: "56-60", quantity: 373 },

            { legend: "61-65", quantity: 373 },
            { legend: "66-70", quantity: 373 },
            { legend: "71-75", quantity: 373 },
            { legend: "76-80", quantity: 373 },

            { legend: "81-85", quantity: 373 },
            { legend: "86-90", quantity: 373 },
        ] 
    },
]
var svg_crowbar = function (svg_el, options){

    // TODO: should probably do some checking to make sure that svg_el is
    // actually a <svg> and throw a friendly error otherwise

    // get options passed to svg_crowbar
    var filename = options.filename || "download.png";
    var width = options.width; // TODO: add fallback value based on svg attributes
    var height = options.height; // TODO: add fallback value based on svg attributes
    var crowbar_el = options.crowbar_el; // TODO: element for preparing the canvas element

    // apply the stylesheet to the svg to be sure to capture all of the stylings
    applyStylesheets(svg_el)

    // grab the html from the svg and encode the svg in a data url
    var html = svg_el.outerHTML;
    var imgsrc = 'data:image/svg+xml;base64,' + btoa(html);

    // create a canvas element that has the right dimensions
    crowbar_el.innerHTML = (
        '<canvas width="' + width + '" height="' + height + '"></canvas>'
    )
    var canvas = crowbar_el.querySelector("canvas");
    var context = canvas.getContext("2d");
    var image = new Image;
    image.src = imgsrc;
    image.onload = function() {

        // draw the image in the context of the canvas and then get the
        // image data from the canvas
        //
        // TODO: the resulting canvas image is a little on the grainy side.
        // up until this point the image is lossless, so it definitely has
        // something to do with the imgsrc getting lost when embedding in
        // the canvas. this appears to be a problem with just about
        // anything i've seen
        context.drawImage(image, 0, 0);
        var canvasdata = canvas.toDataURL("image/png");

        // download the data
        var a = document.createElement("a");
        a.download = filename;
        a.href = canvasdata;
        a.click();
    };


    // this is adapted (barely) from svg-crowbar
    // https://github.com/NYTimes/svg-crowbar/blob/gh-pages/svg-crowbar-2.js#L211-L250
    function applyStylesheets(svgEl) {

        // use an empty svg to compute the browser applied stylesheets
        var emptySvg = window.document.createElementNS("http://www.w3.org/2000/svg", 'svg');
        window.document.body.appendChild(emptySvg);
        var emptySvgDeclarationComputed = getComputedStyle(emptySvg);
        emptySvg.parentNode.removeChild(emptySvg);

        // traverse the element tree and explicitly set all stylesheet values
        // on an element. this is ripped from svg-crowbar
        var allElements = traverse(svgEl);
        var i = allElements.length;
        while (i--){
            explicitlySetStyle(allElements[i], emptySvgDeclarationComputed);
        }
    }


    function explicitlySetStyle (element, emptySvgDeclarationComputed) {
        var cSSStyleDeclarationComputed = getComputedStyle(element);
        var i, len, key, value;
        var computedStyleStr = "";
        for (i=0, len=cSSStyleDeclarationComputed.length; i<len; i++) {
            key=cSSStyleDeclarationComputed[i];
            value=cSSStyleDeclarationComputed.getPropertyValue(key);
            if (value!==emptySvgDeclarationComputed.getPropertyValue(key)) {
                computedStyleStr+=key+":"+value+";";
            }
        }
        element.setAttribute('style', computedStyleStr);
    }


    // traverse an svg and append all of the elements to the tree array. This
    // ignores some elements that can appear in <svg> elements but whose
    // children's styles should not be tweaked
    function traverse(obj){
        var tree = [];
        var ignoreElements = {
            'script': undefined,
            'defs': undefined,
        };
        tree.push(obj);
        visit(obj);
        function visit(node) {
            if (node && node.hasChildNodes() && !(node.nodeName.toLowerCase() in ignoreElements)) {
                var child = node.firstChild;
                while (child) {
                    if (child.nodeType === 1) {
                        tree.push(child);
                        visit(child);
                    }
                    child = child.nextSibling;
                }
            }
        }
        return tree;
    }


}
// console.log(data2)

const rowGroup = document.querySelector("#rowGroup");



// function renderTable(regions) {

//     function renderLegend(){
//          for (let age of regions[0].numbers) {
//              console.log(age.legend)
//              return `<tspan x='200'>${age.legend}</tspan>`
//          }
//     }
//     renderLegend()
//     // console.log(regions[0].numbers)

//     return `
//     <text x='30' y='30' font-size='18px' font-weight='bold' fill='crimson' text-anchor='middle'>
//     ${renderLegend()}
    
//     </text>
//     `;

// }
// rowGroup.innerHTML = renderTable(data2)

var svg_crowbar = function (svg_el, options){

    // TODO: should probably do some checking to make sure that svg_el is
    // actually a <svg> and throw a friendly error otherwise

    // get options passed to svg_crowbar
    var filename = options.filename || "download.png";
    var width =  '900px'; // TODO: add fallback value based on svg attributes
    var height = '400px'; // TODO: add fallback value based on svg attributes
    var crowbar_el = options.crowbar_el; // TODO: element for preparing the canvas element

    // apply the stylesheet to the svg to be sure to capture all of the stylings
    applyStylesheets(svg_el)

    // grab the html from the svg and encode the svg in a data url
    var html = svg_el.outerHTML;
    var imgsrc = 'data:image/svg+xml;base64,' + btoa(html);

    // create a canvas element that has the right dimensions
    crowbar_el.innerHTML = (
        '<canvas width="' + width + '" height="' + height + '"></canvas>'
    )
    var canvas = crowbar_el.querySelector("canvas");
    var context = canvas.getContext("2d");
    var image = new Image;
    image.src = imgsrc;
    image.onload = function() {

        // draw the image in the context of the canvas and then get the
        // image data from the canvas
        //
        // TODO: the resulting canvas image is a little on the grainy side.
        // up until this point the image is lossless, so it definitely has
        // something to do with the imgsrc getting lost when embedding in
        // the canvas. this appears to be a problem with just about
        // anything i've seen
        context.drawImage(image, 0, 0);
        var canvasdata = canvas.toDataURL("image/png");

        // download the data
        var a = document.createElement("a");
        a.download = filename;
        a.href = canvasdata;
        a.click();
    };


    // this is adapted (barely) from svg-crowbar
    // https://github.com/NYTimes/svg-crowbar/blob/gh-pages/svg-crowbar-2.js#L211-L250
    function applyStylesheets(svgEl) {

        // use an empty svg to compute the browser applied stylesheets
        var emptySvg = window.document.createElementNS("http://www.w3.org/2000/svg", 'svg');
        window.document.body.appendChild(emptySvg);
        var emptySvgDeclarationComputed = getComputedStyle(emptySvg);
        emptySvg.parentNode.removeChild(emptySvg);

        // traverse the element tree and explicitly set all stylesheet values
        // on an element. this is ripped from svg-crowbar
        var allElements = traverse(svgEl);
        var i = allElements.length;
        while (i--){
            explicitlySetStyle(allElements[i], emptySvgDeclarationComputed);
        }
    }


    function explicitlySetStyle (element, emptySvgDeclarationComputed) {
        var cSSStyleDeclarationComputed = getComputedStyle(element);
        var i, len, key, value;
        var computedStyleStr = "";
        for (i=0, len=cSSStyleDeclarationComputed.length; i<len; i++) {
            key=cSSStyleDeclarationComputed[i];
            value=cSSStyleDeclarationComputed.getPropertyValue(key);
            if (value!==emptySvgDeclarationComputed.getPropertyValue(key)) {
                computedStyleStr+=key+":"+value+";";
            }
        }
        element.setAttribute('style', computedStyleStr);
    }


    // traverse an svg and append all of the elements to the tree array. This
    // ignores some elements that can appear in <svg> elements but whose
    // children's styles should not be tweaked
    function traverse(obj){
        var tree = [];
        var ignoreElements = {
            'script': undefined,
            'defs': undefined,
        };
        tree.push(obj);
        visit(obj);
        function visit(node) {
            if (node && node.hasChildNodes() && !(node.nodeName.toLowerCase() in ignoreElements)) {
                var child = node.firstChild;
                while (child) {
                    if (child.nodeType === 1) {
                        tree.push(child);
                        visit(child);
                    }
                    child = child.nextSibling;
                }
            }
        }
        return tree;
    }


}