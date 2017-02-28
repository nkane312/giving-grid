import { Component, OnInit, ElementRef } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { ActivatedRoute } from '@angular/router';

import { Observable, Subscription } from 'rxjs/Rx';
import * as d3 from 'd3';
import 'rxjs/Rx';
import 'classlist-polyfill';

import { ApiService } from '../services/api.service';
import { SocketService } from '../services/socket.service';

import { ThankYouModalComponent } from '../thank-you-modal/thank-you-modal.component';
import { DonateComponent } from '../donate/donate.component';

@Component({
    selector: 'app-grid',
    templateUrl: './grid.component.html',
    styleUrls: ['./grid.component.css']
})
export class GridComponent {
    private grid = {
        svg : undefined,
        image : {
            size: {
                height: undefined,
                width: undefined
            },
            link: undefined,
            naturalSize: function() {
                return Observable.create((observer) => {
                    var naturalImage = new Image();
                    naturalImage.src = this.link;
                    var size = {
                        width: undefined,
                        height: undefined
                    }
                    naturalImage.onload = function() {
                        size.width = naturalImage.width;
                        size.height = naturalImage.height;
                        observer.next(size);
                        observer.complete();
                    }
                    naturalImage.onerror = function(err){
                        observer.error(err);
                    }
                });
            }
        },
        g : undefined,
        cells : [],
        spacers: [],
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
        }, 
        _id: undefined,
        dfId: undefined,
        lvlId: undefined,
        headline: undefined,
        description: undefined,
        selectTotal: 0,
    };

    private modalState = false;
    private showModal(){
        this.modalState = true;
    }
    private modalClosed(e){
        this.modalState = e;
    }

    private totalState = false;


    constructor(private http: Http, private el: ElementRef, private apiService: ApiService, private socketService: SocketService, private route: ActivatedRoute) {
        var params;
        route.params.subscribe(routeParams => {
            params = routeParams;
        });
        
        this.apiService.getGrid(params.campaign, params.version)
            .subscribe(data => {
                if (data){
                    window.onresize = () => {
                        this.grid.setSize();
                        this.grid.rectSize = this.setRectSize(this.grid);
                        this.adjustGrid(this.grid);
                        this.adjustImage(this.grid);
                    };
                    this.grid.cells = data.cells;
                    this.grid.image.link = data.image;
                    this.grid._id = data._id;
                    this.grid.dfId = data.dfId;
                    this.grid.lvlId = data.lvlId;
                    this.grid.description = data.description;
                    this.grid.headline = data.headline;
                    this.grid.setSize();
                    this.grid.rectSize = this.setRectSize(this.grid);
                    this.grid = this.initGrid(this.grid);
                    this.adjustGrid(this.grid);
                    this.adjustImage(this.grid);
                    let between = Math.floor(this.grid.cells.length / ((this.grid.cols * this.grid.rows) - this.grid.cells.length));
                    let spacerCount = 0;
                    let revealCount = 0;
                    this.grid.cells.forEach((cell, i) => {
                        if (cell.class === 'revealed'){
                            this.revealByIndex([i], (revealCount + spacerCount));
                            revealCount += 1;
                        }
                        if (i % between === 0 && i !== 0){
                            this.revealSpacer(spacerCount, revealCount);
                            spacerCount += 1;
                        }
                        if (i+1 === this.grid.cells.length && (i+1) % between === 0){
                            this.revealSpacer(spacerCount, revealCount);
                            spacerCount += 1;
                        }
                    });
                }
            });
    }

    private extractData(res: Response) {
        let body = res.json();
        return body || {};
    }

    private initGrid(grid) {
        grid.svg = this.setArea('grid');
        this.createImage(grid.image.link);
        var self = this;
        d3.select('#gridSvg').append('path')
            .attr('fill', `url(${window.location.href}#pattern)`);
        this.createShadow();
        grid.g = grid.svg.append('g');
        var tempRects;
        var tempValues;
        tempRects = grid.g.selectAll()
            .data(grid.cells)
            .enter()
            .append('rect')
                .attr('id', function(d, i) {
                    return 'rect' + (i + 1);
                })
                .style('filter', `url(${window.location.href}#drop-shadow)`)
                .classed('available', true)
                .classed('cell', true)
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
                .style('value', true)
                .style('display', 'block')
                .style('z-index', '1000')
                .style('stroke-width', 0.25)
                .style('stroke', '#505050')
                .style('text-anchor', 'middle')
                .style('height', 0)
                .style('overflow', 'visible')
                .style('pointer-events', 'none')
                .style('background', 'none')
                .style('dominant-baseline', 'ideographic')
                .text('$')
                .classed('svg-content-responsive', true)
            .append('tspan')
                .classed('available', true)
                .style('font-family', 'Oswald-Light')
                .style('value', true)
                .style('dominant-baseline', 'alphabetic')
                .text((d, i) => {
                    return grid.cells[i].dollarValue;
                });
            
            tempRects._groups[0].forEach((r, i) => {
                grid.cells[i].rect = r;
            });
            tempValues._groups[0].forEach((v, i) => {
                grid.cells[i].value = v;
            });
        var spaces = (grid.cols * grid.rows) - grid.cells.length;
        var i = 0;
        var tempSpacers = [];
        while (i < spaces) {
            var t:any = d3.select('g').append('rect')
                .attr('id', function() { return 'spacer' + i })
                .classed('spacer', true);
            tempSpacers.push(t._groups[0][0]);
            i += 1;
        }
        grid.spacers = tempSpacers;
        return grid;
    }

    private adjustGrid(grid) {
        var spaces = (grid.cols * grid.rows) - grid.cells.length;
        var between = Math.floor(grid.cells.length / spaces);
        var cellSpaceCountX = 0;
        var cellSpaceCountY = 0;
        var textSpaceCountX = 0;
        var textSpaceCountY = 0;
        d3.select('#gridSvg')
            .attr('width', window.innerWidth)
            .attr('height', window.innerHeight)
            .attr('viewBox', `0 0 ${window.innerWidth} ${window.innerHeight}`);
        d3.selectAll('.cell')
            .attr('height', grid.rectSize.height)
            .attr('width', grid.rectSize.width)
            .attr('x', (d, i) => {
                if (i % between === 0 && i !== 0) {
                    d3.select('#spacer' + cellSpaceCountX)
                        .attr('height', grid.rectSize.height)
                        .attr('width', grid.rectSize.width)
                        .attr('x', () => {
                            return (grid.rectSize.width * Math.floor((i + cellSpaceCountX) % grid.cols));
                        });
                    cellSpaceCountX += 1;
                }
                if ((i + 1) === grid.cells.length && (i + 1) % between === 0) {
                    d3.select('#spacer' + cellSpaceCountX)
                        .attr('height', grid.rectSize.height)
                        .attr('width', grid.rectSize.width)
                        .attr('x', () => {
                            return (grid.rectSize.width * Math.floor(((i + 1) + cellSpaceCountX) % grid.cols));
                        });
                }
                return (grid.rectSize.width * Math.floor((i + cellSpaceCountX) % grid.cols));
            })
            .attr('y',(d, i) => {
                if (i % between === 0 && i !== 0) {
                    d3.select('#spacer' + cellSpaceCountY)
                        .attr('y', () => {
                            return Math.floor((i + cellSpaceCountY) / grid.cols) * grid.rectSize.height;
                    });
                    cellSpaceCountY += 1;
                }
                if ((i + 1) === grid.cells.length && (i + 1) % between === 0) {
                    d3.select('#spacer' + cellSpaceCountY)
                        .attr('y', () => {
                            return Math.floor((i + cellSpaceCountY) / grid.cols) * grid.rectSize.height;
                    });
                }
                return Math.floor((i + cellSpaceCountY) / grid.cols) * grid.rectSize.height;
            });
        d3.selectAll('.text')
            .attr('x', (d, i) => {
                if (i % between === 0 && i !== 0) {
                    textSpaceCountX += 1;  
                }
                return (grid.rectSize.width * Math.floor((i + textSpaceCountX) % grid.cols)) + grid.rectSize.width / 2;
            })
            .attr('y', (d, i) => {
                if (i % between === 0 && i !== 0) {
                    textSpaceCountY += 1;  
                }
                return (Math.floor((i + textSpaceCountY) / grid.cols) * grid.rectSize.height) + (grid.rectSize.height /1.5);
            })
            .style('font-size', `${(grid.rectSize.width / 3.5)}px`);
        d3.selectAll('tspan')
            .style('position', 'absolute')
            .style('font-size', `${(grid.rectSize.width / 2)}px`);
    }
    private adjustImage(grid){
        var natSize, xOffset, yOffset;
        grid.image.naturalSize().subscribe(data => {
            natSize = data;
            var ratio = natSize.width / natSize.height;
            var height, width;
            if (grid.width > grid.height) {
                height = grid.height;
                width = height * ratio;
                xOffset = -1 * ((width - grid.width) / 2);
                yOffset = 0;
                if (grid.width > width) {
                    width = grid.width;
                    height = width / ratio;
                    xOffset = 0;
                    yOffset = -1 * ((height - grid.height) / 2);
                } 
            } else {
                width = grid.width;
                height = width / ratio;
                xOffset = 0;
                yOffset = -1 * ((height - grid.height) / 2);
                if (grid.height > height) {
                    height = grid.height;
                    width = height * ratio;
                    xOffset = -1 * ((width - grid.width) / 2);
                    yOffset = 0;
                }
            }
            grid.image.size.height = height;
            grid.image.size.width = width;
            d3.select('#pattern')
                .attr('height', grid.image.size.height + 'px')
                .attr('width', grid.image.size.width + 'px');
            d3.select('#image')
                .attr('x', xOffset)
                .attr('y', yOffset)
                .attr('height', grid.image.size.height + 'px')
                .attr('width', grid.image.size.width + 'px');
            this.createPath(grid.height, grid.width);    

        });
    }
    private cellToggle(cell){
        d3.select(cell.rect)
            .classed('selected', (d, i) => {
                if(cell.selected && cell.class !== 'revealed'){
                    cell.selected = false;
                    this.selectedTotal(cell.dollarValue, false);
                }
                else if (cell.class !== 'revealed'){
                    cell.selected = true;
                    this.selectedTotal(cell.dollarValue, true);
                }
                return !d3.select(cell.rect).classed('selected');
            })
            .classed('available', (d, i) => {
                return !d3.select(cell.rect).classed('available');
            });
        d3.select(cell.value)
            .classed('selectedText', (d, i) => {
                if(cell.selected === true){
                    d3.select('#' + cell.value.parentNode.id)
                        .classed('selectedText', true)
                        .classed('available', false);
                }
                else if (cell.selected === false){
                    d3.select('#' + cell.value.parentNode.id)
                        .classed('selectedText', false)
                        .classed('available', true);
                }
                return !d3.select(cell.value).classed('selectedText');
            })
            .classed('available', (d, i) => {
                return !d3.select(cell.value).classed('available');
            });
        if (this.grid.selectTotal > 0) {
            this.totalState = true;
        } else {
            this.totalState = false;
        }
    }
    private revealSquares(grid) {
        var x = document.getElementsByClassName('selected');
        var y = document.getElementsByClassName('selectedText');
        var selectedArray = Array.prototype.slice.call(x);
        var selectedTextArray = Array.prototype.slice.call(y);
        selectedArray.forEach (function(s, i){
            setTimeout(() => {
                selectedArray[i].classList.remove('selected');
                selectedArray[i].classList.add('revealed');
                selectedTextArray[i].classList.remove('selectedText');
                selectedTextArray[i].classList.add('revealed');
            }, i * 100);
        });
        grid.selectTotal = 0;
        this.modalState = true;
    }
    private revealByIndex(indexes, timing) {
        if (!timing){
            indexes.forEach((index, i) => {
                setTimeout(()=>{
                    if (this.grid.cells[index].rect.attributes.class.value !== 'cell selected') {
                        this.grid.cells[index].rect.classList.remove('available');
                        this.grid.cells[index].rect.classList.add('revealed');
                        this.grid.cells[index].value.classList.remove('available');
                        this.grid.cells[index].value.classList.add('revealed');
                        this.grid.cells[index].value.parentNode.classList.remove('available');
                        this.grid.cells[index].value.parentNode.classList.add('revealed');
                    } 
                }, i * 100);
            });        
        }
        else {
            indexes.forEach((index) => {
                setTimeout(()=>{
                    if (this.grid.cells[index].rect.attributes.class.value !== 'cell selected') {
                        this.grid.cells[index].rect.classList.remove('available');
                        this.grid.cells[index].rect.classList.add('revealed');
                        this.grid.cells[index].value.classList.remove('available');
                        this.grid.cells[index].value.classList.add('revealed');
                        this.grid.cells[index].value.parentNode.classList.remove('available');
                        this.grid.cells[index].value.parentNode.classList.add('revealed');
                    } 
                }, timing * 100);
            });        
        }
    }
    private revealSpacer(s, t){
        setTimeout(() => { this.grid.spacers[s].classList.add('revealed'); }, (t + s) * 100);
    }
    private createImage(imageLink) {
        return d3.select('#gridSvg')
            .append('defs')
            .append('pattern')
                .attr('id', 'pattern')
                .attr('patternUnits', 'userSpaceOnUse')
            .append('image')
                .attr('height', window.innerHeight + 'px')
                .attr('width', window.innerWidth + 'px')
                .attr('id', 'image')
                .attr('preserveAspectRatio', 'none')
                .attr('xlink:href', imageLink);
    }
    private createPath(height, width) {
        return d3.select('path')
        .attr('d', `M0 0 L 0 ${height} L ${width} ${height} L ${width} 0 z`);
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
        var ratio, diff, percentDiff;
        var cellCount = grid.cells.length;
        var c = Math.sqrt(cellCount);
        var r = Math.sqrt(cellCount);

        if (window.innerWidth >= 800){
            ratio = grid.width / grid.height;
        }
        else {
            ratio = grid.height / grid.width;
        }

        if(grid.width - grid.height >= 0){
            diff = grid.width - grid.height;
            percentDiff = (diff / grid.width);
            c = c + (c * percentDiff);
            r = cellCount / c;
        }
        else {
            diff = grid.height - grid.width;
            percentDiff = (diff / grid.height);
            r = r + (r * percentDiff);
            c = cellCount / r;
        }
        if ((Math.floor(c)*Math.floor(r)) > cellCount){
            grid.cols = Math.floor(c);
            grid.rows = Math.floor(r);
        }
        else if ((Math.ceil(c)*Math.floor(r)) > cellCount){
            grid.cols = Math.ceil(c);
            grid.rows = Math.floor(r);
        }
        else if ((Math.floor(c)*Math.ceil(r)) > cellCount){
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
    private selectedTotal(amount, shouldAdd) {
        if(shouldAdd){
            this.grid.selectTotal += +amount;
        }
        else {
            this.grid.selectTotal -= +amount;
        }
    }
}

