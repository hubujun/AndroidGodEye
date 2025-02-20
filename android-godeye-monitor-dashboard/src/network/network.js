import React, {Component} from 'react';
import '../App.css';
import JSONPretty from '../../node_modules/react-json-pretty';

import Highcharts from '../../node_modules/highcharts/highcharts';
import exporting from '../../node_modules/highcharts/modules/exporting';
import ReactHighcharts from '../../node_modules/react-highcharts'
import {toast} from 'react-toastify';
import {Card, Modal} from 'antd'

exporting(Highcharts);

/**
 * Network
 */
class Network extends Component {

    constructor(props) {
        super(props);
        this.handleClose = this.handleClose.bind(this);
        this.handleClick = this.handleClick.bind(this);
        Network.isRedirect = Network.isRedirect.bind(this);
        Network.isSuccessful = Network.isSuccessful.bind(this);
        this.options = {
            chart: {
                type: 'column',
                spacingLeft: 0,
                spacingRight: 0,
            },
            title: {
                text: null
            },
            credits: {
                enabled: false
            },
            tooltip: {
                shared: true,
                formatter: function () {
                    let point = this.points[0].point;
                    if (point.networkInfo) {
                        return point.networkInfo.requestId + '<br/>' + point.networkInfo.networkSimplePerformance.totalTimeMillis.toFixed(1) + ' ms <br/>';
                    }
                    return "";
                }
            },
            xAxis: {
                type: 'category'
            },
            yAxis: {
                title: {
                    text: "Request time(ms)",
                    align: "middle",
                },
                min: 0
            },
            plotOptions: {
                series: {
                    point: {
                        events: {
                            click: this.handleClick
                        }
                    }
                }
            },
            series: [
                {
                    name: 'DNS(域名解析)',
                    stacking: 'normal',
                    color: '#4586F3',
                    data: (Network.initSeries())
                }, {
                    name: 'Connect(连接)',
                    stacking: 'normal',
                    color: '#35AA53',
                    data: (Network.initSeries())
                }, {
                    name: 'SendRequestHead(发送请求头信息)',
                    stacking: 'normal',
                    color: '#FBBD06',
                    data: (Network.initSeries())
                }, {
                    name: 'SendRequestBody(发送请求体)',
                    stacking: 'normal',
                    color: '#a0bb00',
                    data: (Network.initSeries())
                }, {
                    name: 'ReceiveResponseHead(接收响应头信息)',
                    stacking: 'normal',
                    color: '#E0a0ff',
                    data: (Network.initSeries())
                }, {
                    name: 'ReceiveResponseBody(接收响应体)',
                    stacking: 'normal',
                    color: '#aa8877',
                    data: (Network.initSeries())
                }, {
                    name: 'Other(其他耗时)',
                    stacking: 'normal',
                    color: '#999999',
                    data: (Network.initSeries())
                }, {
                    name: 'Error(错误)',
                    stacking: 'normal',
                    color: '#EB4334',
                    data: (Network.initSeries())
                }
            ]
        };
        this.state = {
            show: false,
            networkInfo: {}
        };
        this.index = 0;
    }

    handleClick(e) {
        if (e.point.networkInfo) {
            this.setState({networkInfo: e.point.networkInfo, show: true});
        }
    }

    handleClose() {
        this.setState({show: false});
    }

    static initSeries() {
        let data = [];
        for (let i = 0; i < 30; i++) {
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

    static isRedirect(resultCode) {
        return resultCode === 307 || resultCode === 308 || resultCode === 300 || resultCode === 301 || resultCode === 302 || resultCode === 303
    }

    static isSuccessful(resultCode) {
        return resultCode >= 200 && resultCode < 300;
    }

    refresh(networkInfo) {
        if (networkInfo) {
            const resultCode = parseInt(networkInfo.resultCode);
            let axisData = this.generateIndex() + (new Date()).toLocaleTimeString();
            if (!isNaN(resultCode) && (Network.isSuccessful(resultCode) || Network.isRedirect(resultCode))) {//request success
                this.refs.chart.getChart().series[0].addPoint({//dns
                    name: axisData,
                    y: networkInfo.networkSimplePerformance.dnsTimeMillis,
                    networkInfo: networkInfo
                }, false, true, true);
                this.refs.chart.getChart().series[1].addPoint({//connect
                    name: axisData,
                    y: networkInfo.networkSimplePerformance.connectTimeMillis,
                    networkInfo: networkInfo
                }, false, true, true);
                this.refs.chart.getChart().series[2].addPoint({//sendreqheader
                    name: axisData,
                    y: networkInfo.networkSimplePerformance.sendHeaderTimeMillis,
                    networkInfo: networkInfo
                }, false, true, true);
                this.refs.chart.getChart().series[3].addPoint({//sendreqbody
                    name: axisData,
                    y: networkInfo.networkSimplePerformance.sendBodyTimeMillis,
                    networkInfo: networkInfo
                }, false, true, true);
                this.refs.chart.getChart().series[4].addPoint({//recvhead
                    name: axisData,
                    y: networkInfo.networkSimplePerformance.receiveHeaderTimeMillis,
                    networkInfo: networkInfo
                }, false, true, true);
                this.refs.chart.getChart().series[5].addPoint({//recvbody
                    name: axisData,
                    y: networkInfo.networkSimplePerformance.receiveBodyTimeMillis,
                    networkInfo: networkInfo
                }, false, true, true);
                this.refs.chart.getChart().series[6].addPoint({//other
                    name: axisData,
                    y: (networkInfo.networkSimplePerformance.totalTimeMillis -
                        (networkInfo.networkSimplePerformance.dnsTimeMillis
                            + networkInfo.networkSimplePerformance.connectTimeMillis
                            + networkInfo.networkSimplePerformance.sendHeaderTimeMillis
                            + networkInfo.networkSimplePerformance.sendBodyTimeMillis
                            + networkInfo.networkSimplePerformance.receiveHeaderTimeMillis
                            + networkInfo.networkSimplePerformance.receiveBodyTimeMillis)),
                    networkInfo: networkInfo
                }, false, true, true);
                this.refs.chart.getChart().series[7].addPoint({//error
                    name: axisData,
                    y: 0,
                    networkInfo: networkInfo
                }, false, true, true);
            } else {//request fail
                for (let i = 0; i < 7; i++) {
                    this.refs.chart.getChart().series[i].addPoint({//error
                        name: axisData,
                        y: 0,
                        networkInfo: networkInfo
                    }, false, true, true);
                }
                this.refs.chart.getChart().series[7].addPoint({//error
                    name: axisData,
                    y: 1000,
                    networkInfo: networkInfo
                }, false, true, true);
                toast.error("Network fail.(请求失败)");
            }
            this.refs.chart.getChart().redraw(true);
        }
    }

    render() {
        return (
            <Card title="Network(网络)">
                <ReactHighcharts
                    ref="chart"
                    config={this.options}
                />
                <Modal visible={this.state.show} onCancel={this.handleClose} title="Network detail" closable={true}
                       onOk={this.handleClose}>
                    <JSONPretty id="json-pretty" json={this.state.networkInfo}/>
                </Modal>
            </Card>);
    }
}

export default Network;
