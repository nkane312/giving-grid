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
    private backgroundImage;
    private imageLink = '../assets/death-star.jpg';
    private extraHeight;
    

    private cells:Array<any> = [];
    private tempRects: any;
    private tempValues: any;

    constructor(private http: Http, private el: ElementRef) {
        this.htmlElement = this.el.nativeElement;
        this.http.get('/assets/data.json')
            .map(this.extractData)
            .subscribe(data => {
                window.onresize = () => {
                    this.rectSize = this.fillHeight(window.innerHeight, 5);
                    this.textPadding = this.rectSize / 2;
                    this.initGrid();
                };
                this.gridData = data[0];
                this.cellData = this.gridData.grid.cells;
                this.gridCols = this.cellData.length / 5;
                this.rectSize = this.fillHeight(window.innerHeight, 5);
                this.rectSpacing = this.rectSize;
                this.textPadding = this.rectSize / 2;
                this.initGrid();
                this.tempRects._groups[0].forEach((r, i) => {
                    this.cells.push({rect: r});
                });
                this.tempValues._groups[0].forEach((v, i) => {
                    this.cells[i].value = v;
                });
            
            });
    }

    private extractData(res: Response) {
        let body = res.json();
        return body || {};
    }

    
    private initGrid() {
        /*this.svgContainer = d3.select('div')
            .style('width', '100%')
            .style('padding-bottom','100%')
            .style('overflow', 'hidden')
            .style('position', 'relative');*/
        this.svg = this.setArea(this.cellData, 'div');
        this.image = this.createImage(this.gridCols, this.rectSize, this.imageLink);
        var self = this;
        this.backgroundImage = this.createPath(this.gridCols, this.rectSize);
        /*this.backgroundImage.transition().attrTween('transform', function(d, i, a) {
            return d3.interpolateString(a, 'scale(1)');
        });*/
        this.g = this.svg.append('g');
        
        this.tempRects = this.g.selectAll('.data')
            .data(this.cellData)
            .enter()
            .append('rect')
                .attr('height', this.rectSize)
                .attr('width', this.rectSize)
                .attr('x', (d, i) => {
                    return (this.rectSpacing * (i % this.gridCols));
                })
                .attr('y',(d, i) => {
                    return Math.floor(i / this.gridCols) * this.rectSpacing;
                })
                .classed('open', true)
                .classed('cell', true)
                .attr('id', function(d, i) { return 'rect' + (i + 1) })
                .text((d, i) => {
                    return this.cellData.dollarValue;
                })
                .on('click', (d, i) => {
                    self.cellToggle(this.cells[i]);
                })
                .on('mouseover', function(d) {
                    d3.select(this).style('cursor', 'pointer');
                })
                .on('mouseout', function(d) {
                    d3.select(this).style('cursor', '');
                });
        
        this.tempValues = this.g.selectAll('.values')
            .data(this.cellData)
            .enter()
            .append('text')
                .attr("x", (d, i) => {
                        return (this.rectSpacing * (i % this.gridCols)) + this.textPadding;
                    })
                .attr("y", (d, i) => {
                return Math.floor(i / this.gridCols) * this.rectSpacing + this.textPadding * 1.25;
                    })
                .attr('id', function(d, i) { return 'text' + (i + 1) })
                .classed('open', true)
                .classed('text', true)
                .style('font-size', this.textPadding)
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
    }
    ngOnInit() {
        
    }
    cellToggle(cell){
        d3.select(cell.rect)
            .classed('selected', (d, i) => {
                return !d3.select(cell.rect).classed('selected');
            })
            .classed('open', (d, i) => {
                return !d3.select(cell.rect).classed('open');
            });
        d3.select(cell.value)
            .classed('selectedText', (d, i) => {
                return !d3.select(cell.value).classed('selectedText');
            })
            .classed('open', (d, i) => {
                return !d3.select(cell.value).classed('open');
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
            selectedTextArray[i].style.display = 'none';
        }
    }
    createImage(gridCols, rectSize, imageLink) {
        return d3.select('svg').append('svg:defs')
            .append('svg:pattern')
            .attr('id', 'image')
            .attr('x', 0)
            .attr('y', 0)
            .attr('patternUnits', 'userSpaceOnUse')
            .attr('height', gridCols * rectSize)
            .attr('width', gridCols * rectSize)
            .append('svg:image')
            .attr('x', 0)
            .attr('y', 0)
            .attr('height', gridCols * rectSize)
            .attr('width', gridCols * rectSize)
            .attr('xlink:href', imageLink);
    }
    createPath(gridCols, rectSize) {
        return d3.select('svg').append('path')
        .attr('d', `M 0 0, L 0 ${gridCols * rectSize}, L ${gridCols * rectSize} ${gridCols * rectSize}, L ${gridCols * rectSize} 0 z`)
        .attr('fill', 'url(#image)'); 
    }
    setArea(areaData, container) {
        //this.extraHeight = window.outerHeight - window.innerHeight;
        return d3.select(container).append('svg')
            .attr('width', window.innerWidth)
            .attr('height', window.innerHeight)
            .attr('preserveAspectRatio', 'xMinYMin meet')
            .attr('viewBox', `0 0 ${window.innerWidth} ${window.innerHeight}`)
            .style('position', 'absolute')
            .style('top', 0)
            .style('left', 0);
    }
    fillHeight(height, squares) {
        return height / squares
    }

    /*update() {
        var self = this;
        this.cells = this.g.selectAll('.data')
        .data(this.cellData)
        .enter()
        .append('rect')
            .attr('height', this.rectSize)
            .attr('width', this.rectSize)
            .attr('x', (d, i) => {
                return (this.rectSpacing * (i % this.gridCols)) + this.textPadding;
            })
            .attr('y',(d, i) => {
                return Math.floor(i / this.gridCols) * this.rectSpacing + this.textPadding;
            })
            .style('fill', '#a61d26')
            .classed('open', true)
            .attr('id', function(d, i) { return 'rect' + (i + 1) })
            .text((d, i) => {
                return this.cellData.dollarValue;
            })
            .on('click', function(d, i) {
                self.cellToggle(i);

            })
            .on('mouseover', function(d) {
                d3.select(this).style('cursor', 'pointer');
            })
            .on('mouseout', function(d) {
                d3.select(this).style('cursor', '');
            })
            .on("click", function(e, i){
                this.cellData.splice(i, 1);
                this.update();
        });
    this.cells.exit()
    }*/
}

