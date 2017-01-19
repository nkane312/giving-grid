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
    private g;
    private svg;
    private htmlElement;

    private cells;

    constructor(private http: Http, private el: ElementRef) {
        this.htmlElement = this.el.nativeElement;
        console.log('/assets/data.json');
        this.http.get('/assets/data.json')
            .map(this.extractData)
            .subscribe(data => {
                this.gridData = data[0];
                this.cellData = this.gridData.grid.cells;
                this.gridCols = this.cellData.length / 5;
                this.rectSpacing = this.rectSize;
                this.initGrid();
            });
    }

    private extractData(res: Response) {
        let body = res.json();
        return body || {};
    }

    private initGrid() {
        this.svg = d3.select(this.htmlElement).append('svg')
            .attr('preserveAspectRatio', 'xMidYMid meet')
            .attr('viewBox', '0 0 600 400');
        this.g = this.svg.append('g');
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
                .classed('svg-content-responsive', true)
                .text((d, i) => {
                    return this.cellData.dollarValue;
                })
                .on('click', function(d, i) {
                    d3.select(this)
                        .style('fill', '#42efef')
                        .classed('selected', (d, i) => {
                            return !d3.select(this).classed('selected');
                        })
                        .classed('open', (d, i) => {
                            return !d3.select(this).classed('open');
                        });
                })
                .on('mouseover', function(d) {
                    d3.select(this).style('cursor', 'pointer');
                })
                .on('mouseout', function(d) {
                    d3.select(this).style('cursor', '');
                });
        this.g.selectAll('.values')
            .data(this.cellData)
            .enter()
            .append('text')
                .attr("x", (d, i) => {
                        return (this.rectSpacing * (i % this.gridCols)) + this.gridPadding * 2;
                    })
                .attr("y", (d, i) => {
                        return Math.floor(i / this.gridCols) * this.rectSpacing + this.gridPadding * 2.25;
                    })
                .style('font-size', '18px')
                .style('z-index', '999999999')
                .style('stroke-width', 0.25)
                .style('stroke', '#505050')
                .style('fill', '#fff')
                .style('text-anchor', 'middle')
                .style('height', 0)
                .style('overflow', 'visible')
                .style('pointer-events', 'none')
                .style('background', 'none')
                .text((d, i) => {
                    console.log(this.cellData[i].dollarValue);
                    return this.cellData[i].dollarValue;
                })
            .classed('svg-content-responsive', true); 
    }
    ngOnInit() {
    }
}
