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
        height: undefined,
        width: undefined,
        setSize: function(){
            if(window.innerWidth >= 800){
                this.height = window.innerHeight;
                this.width = window.innerWidth * 0.75;
            } else {
                this.height = window.innerHeight * 0.9;
                this.width = window.innerWidth;
            }
        }
    };

    constructor(private http: Http, private el: ElementRef, private apiService: ApiService, private route: ActivatedRoute) {
        route.params.subscribe(queryString => {
        });
        
        this.apiService.getGrid('WOE', 2)
            .subscribe(data => {
                if (data){
                    window.onresize = () => {
                        this.grid.setSize();
                        this.grid.rectSize = this.setRectSize(this.grid);
                        this.adjustGrid(this.grid);
                        this.adjustImage(this.grid);
                    };
                    this.grid.cells = data.cells;
                    this.grid.setSize();
                    this.grid.rectSize = this.setRectSize(this.grid);
                    this.grid = this.initGrid(this.grid);
                    this.adjustGrid(this.grid);
                    this.adjustImage(this.grid);
                }
            });
        
        
    }

    private extractData(res: Response) {
        let body = res.json();
        return body || {};
    }

    private initGrid(grid) {
        grid.svg = this.setArea('grid');
        grid.image = this.createImage(grid.imageLink);
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
    private adjustImage(grid){
        if (grid.height > grid.width) {

        } else {}
        d3.select('#pattern')
            .attr('height', grid.height)
            .attr('width', grid.width);
        d3.select('#image')
            .attr('height', grid.height)
            .attr('width', grid.width);
        grid.imagePath = this.createPath(grid.height, grid.width);    
    }

    private ngOnInit() {
        
    }
    private cellToggle(cell){
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
    private gridButton2() {
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
    private reveal(cells) {

    }
    private createImage(imageLink) {
        return d3.select('#gridSvg')
            .append('svg:defs')
            .append('svg:pattern')
                .attr('id', 'pattern')
                .attr('patternUnits', 'userSpaceOnUse')
            .append('svg:image')
                .attr('id', 'image')
                .attr('preserveAspectRatio', 'none')
                .attr('xlink:href', imageLink);
    }
    private createPath(height, width) {
        return d3.select('path')
        .attr('d', `M 0 0, L 0 ${height}, L ${width} ${height}, L ${width} 0 z`);
    }
    private setArea(container) {
        return d3.select(`#${container}`).append('svg')
            .attr('id', 'gridSvg')
            .style('position', 'absolute')
            .style('top', 0)
            .style('left', 0);        
    }
    private createShadow() {
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

    private setRectSize(grid){
        var area, ratio, cellArea, diag, cellWidth, cellHeight;


        if (window.innerWidth >= 800){
            ratio = grid.width / grid.height;
        }
        else {
            ratio = grid.height / grid.width;
        }

        area = grid.height * grid.width;
        
        cellArea = area / grid.cells.length;
        
        var c = Math.sqrt(grid.cells.length);
        var r = Math.sqrt(grid.cells.length);
        var diff, percentDiff;

        if(grid.width - grid.height >=0){
            diff = grid.width - grid.height;
            percentDiff = (diff / grid.width);
            c = c + (c * percentDiff);
            r = 200 / c;
        }
        else {
            diff = grid.height - grid.width;
            percentDiff = (diff / grid.height);
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
        size.width = grid.width / grid.cols;
        size.height = grid.height / grid.rows;
        return size;
    }
}

