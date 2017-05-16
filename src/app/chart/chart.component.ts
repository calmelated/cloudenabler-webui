import { Component, Input, ViewChild, ViewChildren } from '@angular/core';

import { ApiService, GlobalService } from 'app/service';
import { Ng2Highstocks, Ng2Highcharts } from 'ng2-highcharts';

//highchart libery 需使用下方定義 compiler 才會成功
declare var hs: any;
declare var Highcharts: any;

@Component({
  selector: 'chart',
  styleUrls: [ 'chart.component.css' ],
  templateUrl: 'chart.component.html'
})

export class Chart {
  //判別是否隱藏左方 menu 選單 使用 object 是因為要把值帶入 layout-header 裡面，這樣才能回傳回來
  header: {[key: string]: any} = {collspse : false};

  constructor(
    private api: ApiService,
    private global: GlobalService
  ) {
    this.setData();
  }

  //上限
  data1 = [50,50,50,50,50];
  //目前數值
  data2 = [40,60,70,30,90];

  newData1 = [];
  newData2 = [];
  timeOption: string = "0";

  /*
    重疊長條圖 資料處理 
    依照上限與目前數值顯示不同顏色
    超過上限: 
        目前數值=>紅色
        上限=>紅色 
    沒超過上限:
        目前數值=>綠色
        上限=>白色 
  */
  setData() {
    this.data1.forEach((val, index) => {
      let d1 = val;
      let d2 = this.data2[index];

      //超過上限
      if(d2 > d1) {
        this.newData1.push({ y: d2, color: 'red'});
        this.newData2.push({ y: d1, color: 'red'});

        this.chartOptions.series[0].defaultColor.push('red');
        this.chartOptions.series[1].defaultColor.push('red');
      } else {
        this.newData1.push({ y: d1, color: 'white'});
        this.newData2.push({ y: d2, color: 'green'});

        this.chartOptions.series[0].defaultColor.push('white');
        this.chartOptions.series[1].defaultColor.push('green');
      }
    });

    this.chartOptions.series[0].data = this.newData1;
    this.chartOptions.series[1].data = this.newData2;
  }

  //重疊長條圖
  chartOptions = {
    chart: {
      type: 'column'
    },
    title: {
      text: '長條圖'
    },
    xAxis: {
      categories: [
          'A',
          'B',
          'C',
          'D',
          'E'
      ]
    },
    yAxis: [{
      min: 0,
      title: {
        text: 'Employees'
      },
      labels: {
        formatter: function () {

          return this.value + "dd";
        }
      },
    }],
    legend: {
      shadow: false
    },
    tooltip: {
      shared: true,
      borderColor: "#000",
      formatter: function() {
        var points = this.points;
        var d1 = points[0].y;
        var d2 = points[1].y;
        var d1Color = points[0].color;
        var str = '<b>' + this.x + '</b><br/>';

        str += (d1Color == "white")?"上限: " + d1 + "<br>":"上限: " + d2 + "<br>";
        str += (d1Color == "white")?"目前數值: " + d2:"目前數值: " + d1;

        return  str;
      }
    },
    plotOptions: {
      column: {
        grouping: false,
        shadow: false,
        borderWidth: 1,
        borderColor: '#303030',
      },
        series: {
          cursor: 'pointer',
          events: {
            click: function(event) {
              let reset = this.chart.series[0].data;
              //取得目前選取資料
              let series = this.chart.series;
              //目前點選index
              let index = event.point.index;

              //先把柱狀圖顏色還原
              series.forEach((serie) => {
                let colorList = serie.options.defaultColor;

                serie.data.forEach((point) => {
                  let index = point.index;
                  let color = colorList[point.index];
                  serie.points[index].update({ color: color }, true, false);
                });
              });

              //設定選取的柱狀圖顏色
              series.forEach((serie) => {
                serie.points[index].update({ color: '#fe5800' }, true, false);
              });
            }
          }
        }
    },
    series: [{
      name: '上限',
      data: [],
      pointPadding: 0.3,
      pointPlacement: 0,
      defaultColor: []
    }, {
      name: '目前數值',
      data: [],
      pointPadding: 0.3,
      pointPlacement: 0,
      defaultColor: []
    }]
  }

  @ViewChildren(Ng2Highcharts) allCharts;

  setNewData() {
    let select: number = parseInt(this.timeOption);
    let data = [0,0,0,0,0,2,2,2,2,2,4,4,4,4,4,6,6,6,6,6];
    let adata = [6,6,6,6,6,4,4,4,4,4,2,2,2,2,2,0,0,0,0,0];
    let time = [1491796800000, 1491800400000, 1491804000000, 1491807600000,
                1491811200000, 1491814800000, 1491818400000, 1491822000000,
                1491825600000, 1491829200000, 1491832800000, 1491836400000,
                1491840000000, 1491843600000, 1491847200000, 1491850800000,
                1491854398000, 1491858000000, 1491861600000, 1491865200000];
    let atime = [1491624000000,1491627600000,1491631200000,1491634800000,
                 1491638400000,1491642000000,1491645600000,1491649200000,
                 1491652800000,1491656400000,1491660000000,1491663600000,
                 1491667200000,1491670800000,1491674400000,1491678000000,
                 1491681600000,1491685200000,1491688800000,1491692400000
                ];
    let newData = [];

    if(select === -1) {
      data.forEach((val, index) => {
        newData.push({
            x: time[index],
            y: val
          });
      });
    } else {
      adata.forEach((val, index) => {
        newData.push({
              x: atime[index],
              y: val
          });
      });
    }

    if(select != 0) {
      //更新資料
      this.beforeOptions.series[0].data = newData;
      this.beforeOptions.xAxis = {
        type: 'datetime',
        tickInterval : 3600 * 1000,
        labels: {
          formatter: function () {
            let date = new Date(this.value);
            let month = (date.getMonth() > 10)?date.getMonth():"0" + date.getMonth();
            let day = (date.getDay() > 10)?date.getDay():"0" + date.getDay();
            let h = (date.getHours() > 10)?date.getHours():"0" + date.getHours();
            let m = (date.getMinutes() > 10)?date.getMinutes():"0" + date.getMinutes();
            let s = (date.getSeconds() > 10)?date.getSeconds():"0" + date.getSeconds();
            let time = month + "/" + day + "<br>" + h + ":" + m + ":" + s;;

            return time;
          }
        }
      };

      this.allCharts.forEach( chartRef => {
        let theChart = chartRef.chart;
        let title = chartRef.chart.title.textStr;

        if(title === "可選擇前後區間") {
          theChart.reflow();
        }
      });
    }
 
  }

  //前一周後一周選擇
  beforeOptions = {
    chart: {
      type: 'line',
      spacingBottom: 30
    },
    title: {
      text: '可選擇前後區間'
    },
    legend: {
      layout: 'vertical',
      align: 'left',
      verticalAlign: 'top',
      x: 150,
      y: 100,
      floating: true,
      borderWidth: 1,
      backgroundColor: '#FFFFFF'
    },
    xAxis: {
      type: 'datetime',
      tickInterval: 120,
      labels: {
        formatter: function () {
          let date = new Date(this.value);

          return date.getMonth() + " : " + date.getDay();
        }
      }
    },
    yAxis: {
      labels: {
        formatter: function () {
            return this.value;
        }
      },
      plotLines: [{
          value: 5,
          color: 'green',
          //dashStyle: 'shortdash',
          width: 2,
          zIndex:10,
          label: {
              text: 'limit max'
          }
        }, {
          value: 2,
          color: 'red',
          //dashStyle: 'shortdash',
          width: 2,
          zIndex:10,
          label: {
              text: 'limit min'
          }
      }]
    },
    tooltip: {
      formatter: function () {
        return '<b>' + this.series.name + '</b><br/>' +
                this.x + ': ' + this.y;
      }
    },
    plotOptions: {
      area: {
        fillOpacity: 0.5
      },
      series: {
        cursor: 'pointer',
        point: {
          //點選顯示popup視窗
          events: {
            click: function (e) {
              hs.htmlExpand(null, {
                pageOrigin: {
                    x: e.pageX || e.clientX,
                    y: e.pageY || e.clientY
                },
                headingText: this.series.name,
                maincontentText: Highcharts.dateFormat('%A, %b %e, %Y', this.x) + ':<br/> ' +
                    this.y + ' visits',
                width: 200
              });
            }
          }
        },
      }
    },
    credits: {
      enabled: false
    },
    series: [{
      name: 'John',
      data: (function () {
        // generate an array of random data
        let data = [];
        let time = (new Date()).getTime();
        let i;

        for (i = 19; i >= 0; i--) {
          data.push({
            x: time + i * 1000,
            y: Math.random()
          });
        }
        return data;
      }())
    }]
  };

  //動態更新資料
  dOptions = {
    chart: {
      type: 'spline',
      zoomType: 'x',
      marginRight: 10,
      events: {
        load: function () {
          // set up the updating of the chart each second
          var series = this.series[0];
          setInterval(function () {
            let x = (new Date()).getTime(); // current time
            let y = Math.random();
            series.addPoint([x, y], true, true);
          }, 1000);
        }
      }
    },
    title: {
      text: '動態更新資料'
    },
    xAxis: {
      type: 'datetime',
      tickPixelInterval: 150
    },
    yAxis: {
      title: {
          text: 'Value'
      },
      plotLines: [{
        value: 0,
        width: 1,
        color: '#808080'
      }]
    },
    //修改資料顯示框
    tooltip: {
      backgroundColor: '#FCFFC5',
      formatter: function() {
        return 'value ' + this.series.name + '<br> x: <b style="color:red;">' + this.x + '</b><br> y: <b>' + this.y + '</b>';
      }
    },
    legend: {
        enabled: false
    },
    exporting: {
        enabled: false
    },
    series: [{
        name: 'Random data',
        data: (function () {
            // generate an array of random data
            let data = [];
            let time = (new Date()).getTime();
            let i;

            for (i = -19; i <= 0; i += 1) {
              data.push({
                x: time + i * 1000,
                y: Math.random()
              });
            }
            return data;
        }())
    }]
  };

  //資料中斷
  interruptOptions = {
    chart: {
      type: 'spline',
      spacingBottom: 30
    },
    title: {
      text: '資料中斷'
    },
    legend: {
      enabled: true,
      layout: 'vertical',
      align: 'left',
      verticalAlign: 'top',
      x: 150,
      y: 100,
      floating: true,
      borderWidth: 1,
      backgroundColor: '#FFFFFF'
    },
    xAxis: {
      categories: ['Apples', 'Pears', 'Oranges', 'Bananas', 'Grapes', 'Plums', 'Strawberries', 'Raspberries']
    },
    yAxis: {
      title: {
        text: 'Y-Axis'
      },
      labels: {
        formatter: function () {
          return this.value;
        }
      }
    },
    tooltip: {
      formatter: function () {
        return '<b>' + this.series.name + '</b><br/>' +
               this.x + ': ' + this.y;
      }
    },
    plotOptions: {
      series: {//設定顯示最大最小數值
        dataLabels: {
          enabled: true,
          formatter: function() {
            let maxIndex = this.series.options.maxIndex;
            let minIndex = this.series.options.minIndex
            let pointIndex = this.point.index;

            if(pointIndex == maxIndex || pointIndex == minIndex) {
                return this.y;
            }

            return null;
          }
        }
      }
    },
    credits: {
      enabled: false
    },
    series: [{
      name: 'John',
      data: [0, 1, 4, 4, 5, 2, 3, 7],
      maxIndex: [0, 1, 4, 4, 5, 2, 3, 7].indexOf(Math.max(...[0, 1, 4, 4, 5, 2, 3, 7])),
      minIndex: [0, 1, 4, 4, 5, 2, 3, 7].indexOf(Math.min(...[0, 1, 4, 4, 5, 2, 3, 7])),
    }, {
      name: 'Jane',
      data: [1, 0, 3, null, 3, 1, 2, 1],
      maxIndex: [1, 0, 3, null, 3, 1, 2, 1].indexOf(Math.max(...[1, 0, 3, null, 3, 1, 2, 1])),
      minIndex: [1, 0, 3, null, 3, 1, 2, 1].indexOf(Math.min(...[1, 0, 3, null, 3, 1, 2, 1])),
    }]
  };

  //可選擇區域
  stockOtiopn = {
    chart: {
      events: {
        load: function () {
          // set up the updating of the chart each second
          var series = this.series[0];
          setInterval(() => {
              var x = (new Date()).getTime(), // current time
                  y = Math.round(Math.random() * 100);
              //addPoint (Object options, [Boolean redraw], [Boolean shift], [Mixed animation])
              series.addPoint([x, y], true, false);
          }, 1000);
        }
      }
    },
    rangeSelector: {
      buttons: [{
        count: 1,
        type: 'minute',
        text: '1M'
      }, {
        count: 5,
        type: 'minute',
        text: '5M'
      }, {
        type: 'all',
        text: 'All'
      }],
      inputEnabled: false,
      selected: 0
    },
    title: {
        text: 'Live random data'
    },
    exporting: {
        enabled: false
    },
    navigator: {
        enabled: false
    },
    series: [{
      name: 'Random data',
      data: (function () {
        // generate an array of random data
        let data = [];
        let time = (new Date()).getTime();
        let i;

        for (i = -999; i <= 0; i += 1) {
            data.push([
                time + i * 1000,
                Math.round(Math.random() * 100)
            ]);
        }
        return data;
      }())
    }]
  };

}