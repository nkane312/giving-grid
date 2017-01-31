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
    private grid = {
        svg : undefined,
        image : undefined,
        imageSize: undefined,
        imagePath : undefined,
        imageLink: '../assets/freedom-flight-3.jpg',
        g : undefined,
        cells : [],
        selectedCells: [],
        cols: undefined,
        rows: undefined,
        rectSize: undefined,
    };

    constructor(private http: Http, private el: ElementRef, private apiService: ApiService, private route: ActivatedRoute) {
        route.params.subscribe(queryString => {
        });
        
        this.apiService.getGrid('WOE', 2)
            .subscribe(data => {
                console.log(data);
                if (data){
                    window.onresize = () => {
                        this.grid.rectSize = this.setRectSize(this.grid);
                        this.adjustGrid(this.grid);
                    };
                    this.grid.cells = data.cells;
                    this.grid.rectSize = this.setRectSize(this.grid);
                    this.grid = this.initGrid(this.grid);
                    this.adjustGrid(this.grid);
                }
            });
        
        
    }

    private extractData(res: Response) {
        let body = res.json();
        return body || {};
    }

    private initGrid(grid) {
        grid.svg = this.setArea('grid');
        grid.image = this.createImage(window.innerHeight, window.innerWidth, grid.imageLink);
        var self = this;
        d3.select('#gridSvg').append('path')
        .attr('fill', 'url(#pattern)');
        grid.g = grid.svg.append('g');
        this.createShadow();
        var tempRects;
        var tempValues;
        tempRects = grid.g.selectAll()
            .data(grid.cells)
            .enter()
            .append('rect')
                .attr('id', function(d, i) { return 'rect' + (i + 1) })
                //.attr('data-id', )
                .style('filter', 'url(#drop-shadow)')
                .classed('available', true)
                .classed('cell', true)
                .text((d, i) => {
                    return grid.cells[i].dollarValue;
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
            .data(grid.cells)
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
                    return grid.cells[i].dollarValue;
                })
            .classed('svg-content-responsive', true); 
            tempRects._groups[0].forEach((r, i) => {
                grid.cells[i].rect = r;
            });
            tempValues._groups[0].forEach((v, i) => {
                grid.cells[i].value = v;
            });
        return grid;
    }

    private adjustGrid(grid) {
        d3.select('#gridSvg')
            .attr('width', window.innerWidth)
            .attr('height', window.innerHeight)
            .attr('viewBox', `0 0 ${window.innerWidth} ${window.innerHeight}`);
        grid.imageSize = this.setImageSize(grid.imageLink);
        console.log(grid.imageSize);
        d3.select('#pattern')
            .attr('height', grid.imageSize.height)
            .attr('width', grid.imageSize.width);
        d3.select('#image')
            .attr('height', grid.imageSize.height)
            .attr('width', grid.imageSize.width);
        grid.imagePath = this.createPath(window.innerHeight, (window.innerWidth * 0.75));
        d3.selectAll('rect')
            .attr('height', grid.rectSize.height)
            .attr('width', grid.rectSize.width)
            .attr('x', (d, i) => {
                return (grid.rectSize.width * Math.floor(i % grid.cols));
            })
            .attr('y',(d, i) => {
                return Math.floor(i / grid.cols) * grid.rectSize.height;
            });
        d3.selectAll('text')
            .attr('x', (d, i) => {
                return (grid.rectSize.width * Math.floor(i % grid.cols)) + grid.rectSize.width / 2;
            })
            .attr('y', (d, i) => {
                return (Math.floor(i / grid.cols) * grid.rectSize.height) + (grid.rectSize.height /1.6);
            })
            .style('font-size', (grid.rectSize.width / 2));
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
                //.attr('height', window.innerHeight)
                //.attr('width', (window.innerWidth * 0.75)) 
            .append('svg:image')
                .attr('id', 'image')
                .attr('x', 0)
                .attr('y', 0)
                .attr('preserveAspectRatio', 'none')
                //.attr('height', window.innerHeight)
                //.attr('width', (window.innerWidth * 0.75))
                .attr('xlink:href', imageLink);
    }
    createPath(height, width) {
        return d3.select('path')
        .attr('d', `M 0 0, L 0 ${height}, L ${width} ${height}, L ${width} 0 z`);
    }
    setArea(container) {
        return d3.select(`#${container}`).append('svg')
            .attr('id', 'gridSvg')
            //.attr('preserveAspectRatio', 'xMinYmin meet')
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
    createShadow() {
        var filter = d3.select('defs').append('filter')
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
        
        var currentWidth, currentHeight, adjustedWidth, adjustedHeight;

        //var ratio = 0;
        if (window.innerWidth >= 800) {
            if (window.innerWidth > window.innerHeight) {
                currentWidth = window.innerWidth * 0.75;
                currentHeight = window.innerHeight;
            }
        } else {
            if (window.innerHeight > window.innerWidth) {
                currentHeight = window.innerHeight * 0.9;
                currentWidth = window.innerWidth;
            }
        }

        imageSize = { 
            width: currentWidth,
            height: currentHeight
        };

        return imageSize;
    }   
    setRectSize(grid){
        var height, width, area, ratio, cellArea, diag, cellWidth, cellHeight;

        if(window.innerWidth >= 800){
            height = window.innerHeight;
            width = window.innerWidth * 0.75;
        } else {
            height = window.innerHeight * 0.9;
            width = window.innerWidth;
        }
        if (window.innerWidth >= 800){
            ratio = width / height;
        }
        else {
            ratio = height / width;
        }

        area = height * width;
        
        cellArea = area / grid.cells.length;

        
        
        var c = Math.sqrt(grid.cells.length);
        var r = Math.sqrt(grid.cells.length);
        var diff, percentDiff;

        if(width - height >=0){
            diff = width - height;
            percentDiff = (diff / width);
            c = c + (c * percentDiff);
            r = 200 / c;
        }
        else {
            diff = height - width;
            percentDiff = (diff / height);
            r = r + (r * percentDiff);
            c = 200 / r;
        }
        
        if ((Math.floor(c)*Math.floor(r)) > 200){
            grid.cols = Math.floor(c);
            grid.rows = Math.floor(r);
        }
        else if ((Math.ceil(c)*Math.floor(r)) > 200){
            grid.cols = Math.ceil(c);
            grid.rows = Math.floor(r);
        }
        else if ((Math.floor(c)*Math.ceil(r))>200){
            grid.cols = Math.floor(c);
            grid.rows = Math.ceil(r);
        }
        else {
            grid.cols = Math.ceil(c);
            grid.rows = Math.ceil(r);
        }
        var size = {width: undefined, height: undefined};
        size.width = width / grid.cols;
        size.height = height / grid.rows;
        return size;
    }
}

