import { Component, OnInit, ElementRef } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../services/api.service';
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
    private gridRows;
    private rectSpacing;
    private svgContainer;
    private g;
    private svg;
    private htmlElement;
    private image;
    private imagePath;
    private imageSize;
    private imageLink = '../assets/freedom-flight-3.jpg';
    //private imageLink = '../assets/the-death-star.jpg';
    private filter;
    private grid = {
        svg : undefined,
        image : undefined,
        imagePath : undefined,
        g : undefined,
        cells : [],
    };
    private selectedCells = [];

    constructor(private http: Http, private el: ElementRef, private apiService: ApiService, private route: ActivatedRoute) {
        route.params.subscribe(queryString => {
            console.log(queryString);
        });
        
        this.apiService.getGrid('WOE', 1)
            .subscribe(data => {
                console.log(data);
                if (data){
                    window.onresize = () => {
                        this.rectSize = this.cellArea(14, 20);
                        this.rectSpacing = this.rectSize.width;
                        this.textPadding = this.rectSize.width / 2;
                        this.imageSize = this.setImageSize(this.imageLink);
                        this.adjustGrid(this.grid);
                    };
                    this.gridData = data;
                    this.cellData = this.gridData.cells;
                    this.imageSize = this.setImageSize(this.imageLink);
                    //this.gridCols = this.cellData.length / 15;
                    //this.gridRows = this.cellData.length / 10;
                    this.rectSize = this.cellArea(14, 20);
                    this.rectSpacing = this.rectSize.width;
                    this.textPadding = this.rectSize.width / 2;
                    this.initGrid(this.grid);
                    this.adjustGrid(this.grid);
                }
            });
        
        this.htmlElement = this.el.nativeElement;
        /*
        this.http.get('/assets/data.json')
            .map(this.extractData)
            .subscribe(data => {
                window.onresize = () => {
                    this.rectSize = this.fillArea(14, 20);
                    this.rectSpacing = this.rectSize.width;
                    this.textPadding = this.rectSize.width / 2;
                    this.adjustGrid(this.grid);
                };
                this.gridData = data[0];
                this.cellData = this.gridData.grid.cells;
                //this.gridCols = this.cellData.length / 15;
                //this.gridRows = this.cellData.length / 10;
                this.rectSize = this.fillArea(14, 20);
                this.rectSpacing = this.rectSize.width;
                this.textPadding = this.rectSize.width / 2;
                this.initGrid(this.grid);
                this.adjustGrid(this.grid);
            });
            */
    }

    private extractData(res: Response) {
        let body = res.json();
        return body || {};
    }

    private initGrid(grid) {
        //this.isVertical();
        grid.svg = this.setArea('grid');
        grid.image = this.createImage(window.innerHeight, window.innerWidth, this.imageLink);
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
                //.attr('data-id', )
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
        //this.isVertical();
        d3.select('#gridSvg')
            .attr('width', window.innerWidth)
            .attr('height', window.innerHeight)
            .attr('viewBox', `0 0 ${window.innerWidth} ${window.innerHeight}`);
        d3.select('#pattern')
            .attr('height', this.imageSize.height)
            .attr('width', this.imageSize.width);
        d3.select('#image')
            .attr('height', this.imageSize.height)
            .attr('width', this.imageSize.width);
        //grid.imagePath = this.createPath(this.gridCols, this.rectSize.height, this.rectSize.width);
        grid.imagePath = this.createPath(window.innerHeight, (window.innerWidth * 0.75));
        d3.selectAll('rect')
            .attr('height', this.rectSize.height)
            .attr('width', this.rectSize.width)
            .attr('x', (d, i) => {
                return (this.rectSize.width * Math.floor(i % this.gridCols));
            })
            .attr('y',(d, i) => {
            return Math.floor(i / this.gridCols) * this.rectSize.height;
            });
        d3.selectAll('text')
            .attr('x', (d, i) => {
                return (this.rectSize.width * Math.floor(i % this.gridCols)) + this.textPadding;
            })
            .attr('y', (d, i) => {
                return Math.floor(i / this.gridCols) * this.rectSize.height + this.textPadding;
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
        return selectedArray;
    }
    reveal(cells) {

    }
    createImage(height, width, imageLink) {
        return d3.select('#gridSvg')
            .append('svg:defs')
            .append('svg:pattern')
                .attr('id', 'pattern')
                .attr('x', 0)
                .attr('y', 0)
                .attr('patternUnits', 'userSpaceOnUse')
                .attr('height', this.imageSize.height)
                .attr('width', this.imageSize.width) 
            .append('svg:image')
                .attr('id', 'image')
                .attr('x', 0)
                .attr('y', 0)
                .attr('height', this.imageSize.height)
                .attr('width', this.imageSize.width)
                .attr('xlink:href', imageLink);
    }
    /*createPath(gridCols, rectSizeHeight, rectSizeWidth) {
        return d3.select('path')
        .attr('d', `M 0 0, L 0 ${gridCols * rectSizeHeight}, L ${gridCols * rectSizeWidth} ${gridCols * rectSizeHeight}, L ${gridCols * rectSizeWidth} 0 z`); 
    }*/
    createPath(height, width) {
        return d3.select('path')
        .attr('d', `M 0 0, L 0 ${height}, L ${width} ${height}, L ${width} 0 z`);
    }
    setArea(container) {
        return d3.select(`#${container}`).append('svg')
            .attr('id', 'gridSvg')
            .attr('preserveAspectRatio', 'xMinYMin meet')
            .style('position', 'absolute')
            .style('top', 0)
            .style('left', 0);        
    }
    cellArea(rows, cols) {
        var size = {
            height: undefined,
            width: undefined
        };
        size.height = window.innerHeight / rows;
        size.width = (window.innerWidth * 0.75) / cols;
        return size;
    }
    getWindowSize() {
        if (window.innerHeight < window.innerWidth) {
            return window.innerHeight;
        } else {
            return window.innerWidth;
        }
    }
    createFilter(filter) {
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
    isVertical() {
        if (window.innerWidth < 800) {
            return true
        } else if (window.innerWidth < window.innerHeight) {
            return true
        } else {
            return false
        }
        /*if (this.getWindowSize() === window.innerHeight) {
            return this.gridCols = Math.floor(this.cellData.length / 15);
        } else {
            return this.gridCols = Math.floor(this.cellData.length / 20);
        }*/
    }
    fillArea(grid, cells) {
        var width = window.innerWidth * 0.75;
        var height = window.innerHeight;
        var area = width * height;
        var cellArea = area / cells;

    }
    setImageSize(imageLink){
        var imageSize = {};
        var naturalImage = new Image();
        naturalImage.src = imageLink;
        naturalImage.onload = function() {
            var width = naturalImage.width;
            var height = naturalImage.height;
        }
        
        var maxWidth = 1680; 
        var maxHeight = 1050;
        var ratio = 0;
        var currentWidth = window.innerWidth * 0.75;
        var currentHeight = window.innerHeight;
        var adjustedWidth;
        var adjustedHeight;

        
        if (currentWidth < maxWidth) {
            ratio = maxWidth / currentWidth;    
            adjustedHeight = currentHeight * ratio;   
            adjustedWidth = currentWidth * ratio;    
        }

        
        if(currentHeight < maxHeight){
            ratio = maxHeight / currentHeight;
            adjustedWidth = currentWidth * ratio;
            adjustedHeight = currentHeight * ratio; 
        }        

        console.log(adjustedWidth);
        console.log(adjustedHeight);

        if (naturalImage.width > naturalImage.height) {
            imageSize = { 
                width: adjustedWidth,
                height: window.innerHeight
            };
            return imageSize;
        } else {
            imageSize = { 
                width: window.innerWidth * 0.75,
                height: adjustedHeight
            };
            return imageSize;
            
        }
        
    }
}

