(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (factory((global.vegaThemes = {})));
}(this, (function (exports) { 'use strict';

    const markColor = '#4572a7';
    const excelTheme = {
        background: '#fff',
        arc: { fill: markColor },
        area: { fill: markColor },
        line: { stroke: markColor, strokeWidth: 2 },
        path: { stroke: markColor },
        rect: { fill: markColor },
        shape: { stroke: markColor },
        symbol: { fill: markColor, strokeWidth: 1.5, size: 50 },
        axis: {
            bandPosition: 0.5,
            grid: true,
            gridColor: '#000000',
            gridOpacity: 1,
            gridWidth: 0.5,
            labelPadding: 10,
            tickSize: 5,
            tickWidth: 0.5,
        },
        axisBand: {
            grid: false,
            tickExtra: true,
        },
        legend: {
            labelBaseline: 'middle',
            labelFontSize: 11,
            symbolSize: 50,
            symbolType: 'square',
        },
        range: {
            category: [
                '#4572a7',
                '#aa4643',
                '#8aa453',
                '#71598e',
                '#4598ae',
                '#d98445',
                '#94aace',
                '#d09393',
                '#b9cc98',
                '#a99cbc',
            ],
        },
    };

    const markColor$1 = '#000';
    const ggplot2Theme = {
        group: {
            fill: '#e5e5e5',
        },
        arc: { fill: markColor$1 },
        area: { fill: markColor$1 },
        line: { stroke: markColor$1 },
        path: { stroke: markColor$1 },
        rect: { fill: markColor$1 },
        shape: { stroke: markColor$1 },
        symbol: { fill: markColor$1, size: 40 },
        axis: {
            domain: false,
            grid: true,
            gridColor: '#FFFFFF',
            gridOpacity: 1,
            labelColor: '#7F7F7F',
            labelPadding: 4,
            tickColor: '#7F7F7F',
            tickSize: 5.67,
            titleFontSize: 16,
            titleFontWeight: 'normal',
        },
        legend: {
            labelBaseline: 'middle',
            labelFontSize: 11,
            symbolSize: 40,
        },
        range: {
            category: [
                '#000000',
                '#7F7F7F',
                '#1A1A1A',
                '#999999',
                '#333333',
                '#B0B0B0',
                '#4D4D4D',
                '#C9C9C9',
                '#666666',
                '#DCDCDC',
            ],
        },
    };

    const markColor$2 = '#ab5787';
    const axisColor = '#979797';
    const quartzTheme = {
        background: '#f9f9f9',
        arc: { fill: markColor$2 },
        area: { fill: markColor$2 },
        line: { stroke: markColor$2 },
        path: { stroke: markColor$2 },
        rect: { fill: markColor$2 },
        shape: { stroke: markColor$2 },
        symbol: { fill: markColor$2, size: 30 },
        axis: {
            domainColor: axisColor,
            domainWidth: 0.5,
            gridWidth: 0.2,
            labelColor: axisColor,
            tickColor: axisColor,
            tickWidth: 0.2,
            titleColor: axisColor,
        },
        axisBand: {
            grid: false,
        },
        axisX: {
            grid: true,
            tickSize: 10,
        },
        axisY: {
            domain: false,
            grid: true,
            tickSize: 0,
        },
        legend: {
            labelFontSize: 11,
            padding: 1,
            symbolSize: 30,
            symbolType: 'square',
        },
        range: {
            category: [
                '#ab5787',
                '#51b2e5',
                '#703c5c',
                '#168dd9',
                '#d190b6',
                '#00609f',
                '#d365ba',
                '#154866',
                '#666666',
                '#c4c4c4',
            ],
        },
    };

    const markColor$3 = '#3e5c69';
    const voxTheme = {
        background: '#fff',
        arc: { fill: markColor$3 },
        area: { fill: markColor$3 },
        line: { stroke: markColor$3 },
        path: { stroke: markColor$3 },
        rect: { fill: markColor$3 },
        shape: { stroke: markColor$3 },
        symbol: { fill: markColor$3 },
        axis: {
            domainWidth: 0.5,
            grid: true,
            labelPadding: 2,
            tickSize: 5,
            tickWidth: 0.5,
            titleFontWeight: 'normal',
        },
        axisBand: {
            grid: false,
        },
        axisX: {
            gridWidth: 0.2,
        },
        axisY: {
            gridDash: [3],
            gridWidth: 0.4,
        },
        legend: {
            labelFontSize: 11,
            padding: 1,
            symbolType: 'square',
        },
        range: {
            category: [
                '#3e5c69',
                '#6793a6',
                '#182429',
                '#0570b0',
                '#3690c0',
                '#74a9cf',
                '#a6bddb',
                '#e2ddf2',
            ],
        },
    };

    const lightColor = '#fff';
    const medColor = '#aaa';
    const darkTheme = {
        background: '#333',
        title: { color: lightColor },
        style: {
            'guide-label': {
                fill: lightColor,
            },
            'guide-title': {
                fill: lightColor,
            },
        },
        axis: {
            domainColor: lightColor,
            gridColor: medColor,
            tickColor: lightColor,
        },
    };

    const markColor$4 = '#30a2da';
    const axisColor$1 = '#cbcbcb';
    const backgroundColor = '#f0f0f0';
    const blackTitle = '#1c1c1c';
    const fiveThirtyEightTheme = {
        arc: { fill: markColor$4 },
        area: { fill: markColor$4 },
        axisBand: {
            grid: false,
        },
        axisBottom: {
            domain: false,
            domainColor: blackTitle,
            domainWidth: 3,
            grid: true,
            gridColor: axisColor$1,
            gridWidth: 1,
            labelColor: axisColor$1,
            labelFontSize: 10,
            labelPadding: 4,
            tickColor: axisColor$1,
            tickSize: 10,
            titleFontSize: 14,
            titlePadding: 10,
        },
        axisLeft: {
            domainColor: axisColor$1,
            domainWidth: 1,
            grid: true,
            gridColor: axisColor$1,
            gridWidth: 1,
            labelColor: axisColor$1,
            labelFontSize: 10,
            labelPadding: 4,
            tickColor: axisColor$1,
            tickSize: 10,
            ticks: true,
            titleFontSize: 14,
            titlePadding: 10,
        },
        axisRight: {
            domainColor: blackTitle,
            domainWidth: 1,
            grid: true,
            gridColor: axisColor$1,
            gridWidth: 1,
            labelColor: axisColor$1,
            labelFontSize: 10,
            labelPadding: 4,
            tickColor: axisColor$1,
            tickSize: 10,
            ticks: true,
            titleFontSize: 14,
            titlePadding: 10,
        },
        axisTop: {
            domain: false,
            domainColor: blackTitle,
            domainWidth: 3,
            grid: true,
            gridColor: axisColor$1,
            gridWidth: 1,
            labelColor: axisColor$1,
            labelFontSize: 10,
            labelPadding: 4,
            tickColor: axisColor$1,
            tickSize: 10,
            titleFontSize: 14,
            titlePadding: 10,
        },
        background: backgroundColor,
        group: {
            fill: backgroundColor,
        },
        legend: {
            labelColor: blackTitle,
            labelFontSize: 11,
            padding: 1,
            symbolSize: 30,
            symbolType: 'square',
            titleColor: blackTitle,
            titleFontSize: 14,
            titlePadding: 10,
        },
        line: {
            stroke: markColor$4,
            strokeWidth: 2,
        },
        path: { stroke: markColor$4, strokeWidth: 0.5 },
        rect: { fill: markColor$4 },
        range: {
            category: [
                '#30a2da',
                '#fc4f30',
                '#e5ae38',
                '#6d904f',
                '#8b8b8b',
                '#b96db8',
                '#ff9e27',
                '#56cc60',
                '#52d2ca',
                '#52689e',
                '#545454',
                '#9fe4f8',
            ],
            diverging: [
                '#cc0020',
                '#e77866',
                '#f6e7e1',
                '#d6e8ed',
                '#91bfd9',
                '#1d78b5',
            ],
            heatmap: ['#d6e8ed', '#cee0e5', '#91bfd9', '#549cc6', '#1d78b5'],
        },
        symbol: {
            filled: true,
            opacity: 0.5,
            shape: 'circle',
            size: 40,
        },
        shape: { stroke: markColor$4 },
        style: {
            bar: {
                binSpacing: 2,
                fill: markColor$4,
                stroke: null,
            },
        },
        title: {
            anchor: 'start',
            fontSize: 24,
            fontWeight: 600,
            offset: 20,
        },
    };

    exports.excel = excelTheme;
    exports.ggplot2 = ggplot2Theme;
    exports.quartz = quartzTheme;
    exports.vox = voxTheme;
    exports.dark = darkTheme;
    exports.fivethirtyeight = fiveThirtyEightTheme;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=vega-themes.js.map
