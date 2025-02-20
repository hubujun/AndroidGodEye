import React, {Component} from 'react';
import '../App.css';
// import '../../node_modules/bootstrap/dist/css/bootstrap-theme.min.css';
// import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
// import {Row, Col, Clearfix, Grid, Panel} from 'react-bootstrap'

import Highcharts from '../../node_modules/highcharts/highstock';
import ReactHighcharts from '../../node_modules/react-highcharts'
import {Card} from 'antd'

/**
 * PSS信息
 */
class Pss extends Component {

    constructor(props) {
        super(props);
        this.options = {
            chart: {
                height: 200,
                spacing: [0, 0, 0, 0]
            },
            title: {
                floating: true,
                text: 'Pss',
                align: 'center',
                verticalAlign: 'middle',
                style: {
                    fontSize: 13
                }
            },
            credits: {
                enabled: false
            },
            tooltip: {
                formatter: function () {
                    return '<div style="text-align:center"><span style="font-size:18px;color:' +
                        ((Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black') + '">' +
                        this.point.name + ":" +
                        (this.point.y / 1024).toFixed(2) + 'M,' +
                        this.point.percentage.toFixed(1) + "%"
                        + '</span></div>'
                }
            },
            plotOptions: {
                pie: {
                    dataLabels: {
                        enabled: false,
                        format: '<b>{point.name}</b>',
                        style: {
                            color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                        }
                    },
                }
            },
            series: [{
                type: 'pie',
                name: 'pss',
                innerSize: '80%',
                data: []
            }]
        };
    }

    static createSeriresData(name, value) {
        return {
            name: name,
            y: value
        }
    }

    refresh(info) {
        let datas = [];
        if (info) {
            let unknownPssKb = info.totalPssKb - info.dalvikPssKb - info.nativePssKb - info.otherPssKb;
            datas.push(Pss.createSeriresData("dalvik", info.dalvikPssKb));
            datas.push(Pss.createSeriresData("native", info.nativePssKb));
            datas.push(Pss.createSeriresData("other", info.otherPssKb));
            datas.push(Pss.createSeriresData("unknown", unknownPssKb));
            let title = "Pss(共享比例物理内存)<br/>" + (info.totalPssKb / 1024).toFixed(2) + "M";
            this.options.title.text = title;
        } else {
            this.options.title.text = "**";
        }
        this.options.series[0].data = datas;
        this.refs.chart.getChart().update(this.options);
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

export default Pss;
