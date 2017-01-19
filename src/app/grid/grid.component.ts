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
    private gridPadding = 25;
    private rectSize = 50;
    private gridCols;
    private rectSpacing;
    private svgContainer;
    private g;
    private svg;
    private htmlElement;
    private image;
    private backgroundImage;
    private imageLink = '../assets/death-star.jpg';
    private lineFunction;


    private cells:Array<any> = [];
    private tempRects: any;
    private tempValues: any;

    constructor(private http: Http, private el: ElementRef) {
        this.htmlElement = this.el.nativeElement;
        this.http.get('/assets/data.json')
            .map(this.extractData)
            .subscribe(data => {
                this.gridData = data[0];
                this.cellData = this.gridData.grid.cells;
                this.gridCols = this.cellData.length / 5;
                this.rectSpacing = this.rectSize;
                this.initGrid();
                this.tempRects._groups[0].forEach((r, i) => {
                    this.cells.push({rect: r});
                    
                });
                this.tempValues._groups[0].forEach((v, i) => {
                    this.cells[i].value = v;
                });

            });
        console.log(this.cells);
    }

    private extractData(res: Response) {
        let body = res.json();
        return body || {};
    }

    
    private initGrid() {
        
        this.svgContainer = d3.select('div')
            .style('width', '50%')
            .style('padding-bottom','100%')
            .style('overflow', 'hidden')
            .style('position', 'relative');
        this.svg = this.svgContainer.append('svg')
            .attr('preserveAspectRatio', 'xMaxYMax meet')
            .attr('viewBox', '0 0 285 300')
            .style('position', 'absolute')
            .style('top', 0)
            .style('left', 0);
        this.image = d3.select('svg').append('svg:defs')
            .append('svg:pattern')
            .attr('id', 'image')
            .attr('x', this.gridPadding)
            .attr('y', this.gridPadding)
            .attr('patternUnits', 'userSpaceOnUse')
            .attr('height', this.gridCols * this.rectSize)
            .attr('width', this.gridCols * this.rectSize)
            .append('svg:image')
            .attr('x', 0)
            .attr('y', 0)
            .attr('height', this.gridCols * this.rectSize)
            .attr('width', this.gridCols * this.rectSize)
            .attr('xlink:href', this.imageLink);
        var self = this;
        this.backgroundImage = d3.select('svg').append('path')
            //.attr('d', (d) => {
            //    self.pathFunction(this.cellData);
            //})
            .attr('d', 'M 25 25, L 25 275, L 275 275, L 275 25 z')
            .attr('fill', 'url(#image)');
        this.backgroundImage.transition().attrTween('transform', function(d, i, a) {
            return d3.interpolateString(a, 'scale(1)');
        });
        this.g = this.svg.append('g')
        
        this.tempRects = this.g.selectAll('.data')
            .data(this.cellData)
            .enter()
            .append('rect')
                .attr('height', this.rectSize)
                .attr('width', this.rectSize)
                .attr('x', (d, i) => {
                    return (this.rectSpacing * (i % this.gridCols)) + this.gridPadding;
                })
                .attr('y',(d, i) => {
                    return Math.floor(i / this.gridCols) * this.rectSpacing + this.gridPadding;
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
                        return (this.rectSpacing * (i % this.gridCols)) + this.gridPadding * 2;
                    })
                .attr("y", (d, i) => {
                        return Math.floor(i / this.gridCols) * this.rectSpacing + this.gridPadding * 2.25;
                    })
                .attr('id', function(d, i) { return 'text' + (i + 1) })
                .classed('open', true)
                .classed('text', true)
                .style('font-size', '18px')
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
                }); 
    }
    ngOnInit() {

    }
    /*gridButton(Id) {
        var rectId = document.getElementById('rect' + Id);
        rectId.style.fill = 'transparent';
        var textId = document.getElementById('text' + Id);
        textId.style.display = 'none';
    }*/
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
        console.log
        console.log(cell.rect);
        console.log(cell.value);
        
    }
    gridButton2() {
        var x = document.getElementsByClassName('selected');
        //console.log(x);
        var y = document.getElementsByClassName('selectedText');
        //console.log(y);
        var selectedArray = Array.prototype.slice.call(x);
        //console.log(selectedArray);
        var selectedTextArray = Array.prototype.slice.call(y);
        //console.log(selectedTextArray);
        var i;
        for (i = 0; i < x.length; i++){
            selectedArray[i].style.fill = 'transparent';
            selectedTextArray[i].style.display = 'none';
        }
    }
    pathFunction(pathData) {
        d3.area()
            .x0(this.gridPadding)
            .x1(function(d) { return this.gridCols * this.rectSize; })
            .y0(this.gridPadding)
            .y1(function(d) { return this.gridCols * this.rectSize; }) 
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
                return (this.rectSpacing * (i % this.gridCols)) + this.gridPadding;
            })
            .attr('y',(d, i) => {
                return Math.floor(i / this.gridCols) * this.rectSpacing + this.gridPadding;
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

