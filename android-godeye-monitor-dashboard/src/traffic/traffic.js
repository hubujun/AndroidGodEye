import React, {Component} from 'react';
import '../App.css';

import Highcharts from '../../node_modules/highcharts/highcharts';
import exporting from '../../node_modules/highcharts/modules/exporting';
import ReactHighcharts from '../../node_modules/react-highcharts'
import {Card} from 'antd'

exporting(Highcharts);

/**
 * Traffic
 */
class Traffic extends Component {

    constructor(props) {
        super(props);
        this.options = {
            chart: {
                spacingLeft: 0,
                spacingRight: 0,
                height: 300,
            },
            title: {
                text: "Traffic(流量)"
            },
            credits: {
                enabled: false
            },
            exporting: {
                chartOptions: {},
            },
            tooltip: {
                shared: true,
                formatter: function () {
                    let tip = "";
                    for (let i = 0; i < this.points.length; i++) {
                        let point = this.points[i].point;
                        let seriesName = this.points[i].series.name;
                        tip = tip + seriesName + ' : ' + point.y.toFixed(3) + ' KB/S <br/>';
                    }
                    return tip;
                }
            },
            xAxis: {
                type: 'category'
            },
            yAxis: {
                title: {
                    text: "Traffic(KB/S)",
                    align: "middle",
                },
                min: 0
            },
            series: [
                {
                    name: 'DeviceRX(设备下行)',
                    data: (Traffic.initSeries())
                },
                {
                    name: 'DeviceTX(设备上行)',
                    data: (Traffic.initSeries())
                },
                {
                    name: 'AppRX(App下行)',
                    data: (Traffic.initSeries())
                },
                {
                    name: 'AppTX(App上行)',
                    data: (Traffic.initSeries())
                }
            ]
        };
        this.index = 0;
    }

    static initSeries() {
        let data = [];
        for (let i = 0; i < 20; i++) {
            data.push({
                x: i,
                y: 0
            });
        }
        return data;
    }

    generateIndex() {
        this.index = this.index + 1;
        return this.index;
    }

    refresh(trafficInfo) {
        if (trafficInfo) {
            let axisData = this.generateIndex() + (new Date()).toLocaleTimeString();
            this.refs.chart.getChart().series[0].addPoint([axisData, trafficInfo.rxTotalRate], false, true, true);
            this.refs.chart.getChart().series[1].addPoint([axisData, trafficInfo.txTotalRate], false, true, true);
            this.refs.chart.getChart().series[2].addPoint([axisData, trafficInfo.rxUidRate], false, true, true);
            this.refs.chart.getChart().series[3].addPoint([axisData, trafficInfo.txUidRate], false, true, true);
            this.refs.chart.getChart().redraw(true);
        }
    }

    render() {
        return (
            <Card>
                <ReactHighcharts
                    ref="chart"
                    config={this.options}
                />
            </Card>);
    }
}

export default Traffic;
