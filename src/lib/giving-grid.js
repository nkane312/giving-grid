var svg = d3.select('svg')
    .attr('preserveAspectRatio', 'xMinYMin meet')
    .attr('viewBox', '0 0 300 500');

var data = './data.grid.cells';
var gridCols = data.length / 5;
var gridPadding = 25;
var rectSize = 50;
var rectSpacing = rectSize;

var g = svg.append('g');

var cells = g.selectAll('.data')
    .data(data)
    .enter();

cells.append('rect')
    .attr({
        height: rectSize,
        width: rectSize,
        x: function(d, i) {
            return (rectSpacing * (i % gridCols)) + gridPadding;
        },
        y: function(d, i) {
            return Math.floor(i / gridCols) * rectSpacing + gridPadding;
        }
    })
    .style('fill', '#a61d26')
    .classed('open', true)
    .text(function(d, i) {
        return data.dollarValue;
    })

.on({
    'click': function(d, i) {
        d3.select(this)
            .style('fill', '#42efef')
            .classed('selected', function(d, i) {
                return !d3.select(this).classed('selected');
            })
            .classed('open', function(d, i) {
                return !d3.select(this).classed('open');
            });
    },
    'mouseover': function(d) {
        d3.select(this).style('cursor', 'pointer');
    },
    'mouseout': function(d) {
        d3.select(this).style('cursor', '');
    }
});

cells
    .append('text')
    .attr({
        x: function(d, i) {
            return (rectSpacing * (i % gridCols)) + gridPadding * 2;
        },
        y: function(d, i) {
            return Math.floor(i / gridCols) * rectSpacing + gridPadding * 2.25;
        }
    })
    .style({
        'font-size': '18px',
        'z-index': '999999999',
        'stroke-width': 0.25,
        'stroke': '#505050',
        'fill': '#fff',
        'text-anchor': 'middle',
        'height': 0,
        'overflow': 'visible',
        'pointer-events': 'none',
        'background': 'none'
    })
    .text(function(d, i) {
        return data[i].dollarValue;
    });
