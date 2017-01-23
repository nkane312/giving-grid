import { Component, OnInit, ElementRef } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
//import { BehaviorSubject, Observable, Subscription } from 'rxjs/Rx';
import * as d3 from 'd3';
import 'rxjs/Rx';

@Component({
    selector: 'app-grid',
    templateUrl: './grid.component.html',
    styleUrls: ['./grid.component.css']
})
export class GridComponent {
    private cellData;
    private gridData;
    private textPadding;
    private rectSize;
    private gridCols;
    private rectSpacing;
    private svgContainer;
    private g;
    private svg;
    private htmlElement;
    private image;
    private imagePath;
    private imageLink = '../assets/death-star.jpg';
    private filter;
    private grid = {
        svg : undefined,
        image : undefined,
        imagePath : undefined,
        g : undefined,
        cells : [],

    };

    constructor(private http: Http, private el: ElementRef) {
        this.htmlElement = this.el.nativeElement;
        this.http.get('/assets/data.json')
            .map(this.extractData)
            .subscribe(data => {
                window.onresize = () => {
                    this.rectSize = this.fillArea(this.getWindowSize(), 10);
                    this.textPadding = this.rectSize / 2;
                    this.rectSpacing = this.rectSize;
                    this.adjustGrid(this.grid);
                };
                this.gridData = data[0];
                this.cellData = this.gridData.grid.cells;
                this.gridCols = this.cellData.length / 10;
                this.rectSize = this.fillArea(this.getWindowSize(), 10);
                this.rectSpacing = this.rectSize;
                this.textPadding = this.rectSize / 2;
                this.initGrid(this.grid);
                this.adjustGrid(this.grid);
            });
    }

    private extractData(res: Response) {
        let body = res.json();
        return body || {};
    }

    private initGrid(grid) {
        grid.svg = this.setArea('grid');
        grid.image = this.createImage(this.gridCols, this.rectSize, this.imageLink);
        var self = this;
        d3.select('#gridSvg').append('path')
        .attr('fill', 'url(#pattern)');
        grid.g = grid.svg.append('g');
        this.createFilter(this.filter);
        var tempRects;
        var tempValues;
        tempRects = grid.g.selectAll()
            .data(this.cellData)
            .enter()
            .append('rect')
                .attr('id', function(d, i) { return 'rect' + (i + 1) })
                .style('filter', 'url(#drop-shadow)')
                .classed('available', true)
                .classed('cell', true)
                .text((d, i) => {
                    return this.cellData.dollarValue;
                })
                .on('click', (d, i) => {
                    self.cellToggle(grid.cells[i]);
                })
                .on('mouseover', function(d) {
                    d3.select(this).style('cursor', 'pointer');
                })
                .on('mouseout', function(d) {
                    d3.select(this).style('cursor', '');
                });
        
        tempValues = grid.g.selectAll('.values')
            .data(this.cellData)
            .enter()
            .append('text')
                .attr('id', function(d, i) { return 'text' + (i + 1) })
                .classed('available', true)
                .classed('text', true)
                .style('z-index', '999999999')
                .style('stroke-width', 0.25)
                .style('stroke', '#505050')
                .style('text-anchor', 'middle')
                .style('height', 0)
                .style('overflow', 'visible')
                .style('pointer-events', 'none')
                .style('background', 'none')
                .text((d, i) => {
                    return this.cellData[i].dollarValue;
                })
            .classed('svg-content-responsive', true); 
            tempRects._groups[0].forEach((r, i) => {
                grid.cells.push({rect: r});
            });
            tempValues._groups[0].forEach((v, i) => {
                grid.cells[i].value = v;
            });

    }

    private adjustGrid(grid) {
        d3.select('#gridSvg')
            .attr('width', window.innerWidth)
            .attr('height', window.innerHeight)
            .attr('viewBox', `0 0 ${window.innerWidth} ${window.innerHeight}`);
        d3.select('#pattern')
            .attr('height', this.gridCols * this.rectSize)
            .attr('width', this.gridCols * this.rectSize);
        d3.select('#image')
            .attr('height', this.gridCols * this.rectSize)
            .attr('width', this.gridCols * this.rectSize);
        grid.imagePath = this.createPath(this.gridCols, this.rectSize);
        d3.selectAll('rect')
            .attr('height', this.rectSize)
            .attr('width', this.rectSize)
            .attr('x', (d, i) => {
                return (this.rectSpacing * (i % this.gridCols));
            })
            .attr('y',(d, i) => {
                return Math.floor(i / this.gridCols) * this.rectSpacing;
            });
        d3.selectAll('text')
            .attr('x', (d, i) => {
                return (this.rectSpacing * (i % this.gridCols)) + this.textPadding;
            })
            .attr('y', (d, i) => {
                return Math.floor(i / this.gridCols) * this.rectSpacing + this.textPadding * 1.25;
            })
            .style('font-size', this.textPadding);
    }

    ngOnInit() {
        
    }
    cellToggle(cell){
        d3.select(cell.rect)
            .classed('selected', (d, i) => {
                return !d3.select(cell.rect).classed('selected');
            })
            .classed('available', (d, i) => {
                return !d3.select(cell.rect).classed('available');
            });
        d3.select(cell.value)
            .classed('selectedText', (d, i) => {
                return !d3.select(cell.value).classed('selectedText');
            })
            .classed('available', (d, i) => {
                return !d3.select(cell.value).classed('available');
            });        
    }
    gridButton2() {
        var x = document.getElementsByClassName('selected');
        var y = document.getElementsByClassName('selectedText');
        var selectedArray = Array.prototype.slice.call(x);
        var selectedTextArray = Array.prototype.slice.call(y);
        var i;
        for (i = 0; i < x.length; i++){
            selectedArray[i].style.fill = 'transparent';
            selectedArray[i].style.transition = '2s ease-in-out';
            selectedTextArray[i].style.opacity = '0';
            selectedTextArray[i].style.transition = '2s ease-in-out';
        }
    }
    /*

    */
    createImage(gridCols, rectSize, imageLink) {
        return d3.select('#gridSvg')
            .append('svg:defs')
            .append('svg:pattern')
                .attr('id', 'pattern')
                .attr('x', 0)
                .attr('y', 0)
                .attr('patternUnits', 'userSpaceOnUse')
                .attr('height', gridCols * rectSize)
                .attr('width', gridCols * rectSize) 
            .append('svg:image')
                .attr('id', 'image')
                .attr('x', 0)
                .attr('y', 0)
                .attr('height', gridCols * rectSize)
                .attr('width', gridCols * rectSize)
                .attr('xlink:href', imageLink);
    }
    createPath(gridCols, rectSize) {
        return d3.select('path')
        .attr('d', `M 0 0, L 0 ${gridCols * rectSize}, L ${gridCols * rectSize} ${gridCols * rectSize}, L ${gridCols * rectSize} 0 z`); 
    }
    setArea(container) {
        return d3.select(`#${container}`).append('svg')
            .attr('id', 'gridSvg')
            .attr('preserveAspectRatio', 'xMinYMin meet')
            .style('position', 'absolute')
            .style('top', 0)
            .style('left', 0);        
    }
    fillArea(area, squares) {
        return area / squares
    }
    getWindowSize() {
        if (window.innerHeight < window.innerWidth) {
            return window.innerHeight;
        } else {
            return window.innerWidth;
        }
    }
    createFilter(filter){
        filter = d3.select('defs').append('filter')
            .attr('id', 'drop-shadow')
            .attr('height', '130%');
        filter.append('feGaussianBlur')
            .attr('in', 'SourceAlpha')
            .attr('stdDeviation', 3)
            .attr('result', 'blur');
        filter.append('feOffset')
            .attr('in', 'blur')
            .attr('dx', 2)
            .attr('dy', 2)
            .attr('result', 'offsetBlur');
        var feMerge = filter.append('feMerge');
        feMerge.append('feMergeNode')
            .attr('in', 'offsetBlur')
        feMerge.append('feMergeNode')
            .attr('in', 'SourceGraphic');
    }
}

