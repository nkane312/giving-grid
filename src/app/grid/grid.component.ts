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
        imagePath : undefined,
        imageLink: '../assets/freedom-flight-3.jpg',
        g : undefined,
        cells : [],
        selectedCells: [],
        cols: undefined,
        rows: undefined,
        rectSize: undefined,
        rectSpacing: undefined,
        textPadding: undefined
    };

    constructor(private http: Http, private el: ElementRef, private apiService: ApiService, private route: ActivatedRoute) {
        route.params.subscribe(queryString => {
        });
        
        this.apiService.getGrid('WOE', 2)
            .subscribe(data => {
                if (data){
                    window.onresize = () => {
                        this.grid.rectSize = this.setRectSize(this.grid);
                        this.grid.rectSpacing = this.grid.rectSize.width;
                        this.grid.textPadding = this.grid.rectSize.width / 2;
                        this.adjustGrid(this.grid);
                    };
                    this.grid.cells = data.cells;
                    this.grid.rectSize = this.setRectSize(this.grid);
                    this.grid.rectSpacing = this.grid.rectSize.width;
                    this.grid.textPadding = this.grid.rectSize.width / 2;
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
        d3.select('#pattern')
            .attr('height', window.innerHeight)
            .attr('width', (window.innerWidth * 0.75));
        d3.select('#image')
            .attr('height', window.innerHeight)
            .attr('width', (window.innerWidth * 0.75));
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
                return (grid.rectSize.width * Math.floor(i % grid.cols)) + grid.textPadding;
            })
            .attr('y', (d, i) => {
                return Math.floor(i / grid.cols) * grid.rectSize.height + grid.textPadding;
            })
            .style('font-size', grid.textPadding);
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
                .attr('height', height)
                .attr('width', width) 
            .append('svg:image')
                .attr('id', 'image')
                .attr('x', 0)
                .attr('y', 0)
                .attr('height', height)
                .attr('width', width)
                .attr('xlink:href', imageLink);
    }
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
    fillArea(rows, cols) {
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

    setRectSize(grid){
        var height, width, area, ratio, cellArea, diag, cellWidth, cellHeight;

        if(window.innerWidth >= 800){
            height = window.innerHeight;
            width = window.innerWidth * 0.75;
        } else {
            height = window.innerHeight * 0.9;
            width = window.innerWidth;
        }

        area = height * width;
        ratio = width / height;
        cellArea = area / grid.cells.length;
        diag = Math.sqrt(cellArea*(ratio + 1/ratio));

        if(window.innerWidth >= 800){
            cellWidth = diag / (Math.sqrt((1/(ratio*ratio) + 1)));
            cellHeight = diag / Math.sqrt((ratio*ratio)+1);
        }
        else {
            cellWidth = diag / Math.sqrt((ratio*ratio)+1);
            cellHeight = diag / (Math.sqrt((1/(ratio*ratio) + 1)));
        }

        grid.cols = Math.ceil(width / cellWidth);
        grid.rows = Math.ceil(height / cellHeight);

        var size = {width: undefined, height: undefined};
        size.width = width / grid.cols;
        size.height = height / grid.rows;
        return size;
    }
}

