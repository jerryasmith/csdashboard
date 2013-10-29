var lineChart, barChart; //pulled this out to use it in the renderlet function
var oldWeightedAvg = 0;//holds old value for animation
var q7problemGroup;

/********************************************************
*														*
* 	Step0: Load data from json file						*
*														*
********************************************************/
d3.json("data/data.json", function (data) {


    /********************************************************
    *														*
    * 	Step1: Create the dc.js chart objects & ling to div	*
    *														*
    ********************************************************/
    barChart = dc.barChart("#volume-month-chart");
    lineChart = dc.compositeChart("#dc-line-chart");
    var dataTable = dc.dataTable("#dc-table-graph");
    var problemTable = dc.dataTable("#dc-problem-graph");
    var Q2pieChart = dc.pieChart("#dc-pie-graphQ2");
    var Q3pieChart = dc.pieChart("#dc-pie-graphQ3");
    var Q4pieChart = dc.pieChart("#dc-pie-graphQ4");
    var Q5pieChart = dc.pieChart("#dc-pie-graphQ5");
    var dayOfWeekChart = dc.rowChart("#day-of-week-chart");
    var Q10pieChart = dc.pieChart("#dc-pie-graphQ10");
    var Q11pieChart = dc.pieChart("#dc-pie-graphQ11");
    var Q7pieChart = dc.pieChart("#dc-pie-graphQ7");
    var dateFormat = d3.time.format("%m/%d/%Y");
    var decimalFormat = d3.format(".0f");
    data.forEach(function (e) { e.dd = dateFormat.parse(e.Date); });

    //Get range of data (d3.extent)
    var xrange = new d3.extent(data, function (d) { return d.Date; });

    //Split out dates from the data range
    var x0 = xrange[0];
    var x1 = xrange[1];


    /********************************************************
    *														*
    * 	Step2:	Run data through crossfilter				*
    *														*
    ********************************************************/
    var ndx = crossfilter(data);

    var all = ndx.groupAll();

    /********************************************************
    *														*
    * 	Step3: 	Create Dimension that we'll need			*
    *														*
    ********************************************************/

    // Overall by month2 - top row chart
    var overallByMonth2 = ndx.dimension(function (d) { return d3.time.day(d.dd); }),
        overallByMonthGroup2 = overallByMonth2.group().reduceCount(function (d) {
        });

    // Overall by month - line chart
    var overallByMonth = ndx.dimension(function (d) { return d3.time.day(d.dd); }),
        overallByMonthAdd = function (p, v) {
            p.items++;
            p.total += v.Q1 * 20;
            return p;
        },
        overallByMonthRemove = function (p, v) {
            p.items--;
            p.total -= v.Q1 * 20;
            return p;
        },
        overallByMonthInit = function () {
            return { total: 0, items: 0 };
        };
    overallByMonthGroup = overallByMonth.group().reduce(overallByMonthAdd, overallByMonthRemove, overallByMonthInit);

    // High Low Pie charts
    var q2highLow = ndx.dimension(function (d) {
        return +d.Q2 > 4 ? "5" : "<5";
    }),
        q2highLowGroup = q2highLow.group();

    var q3highLow = ndx.dimension(function (d) {
        return +d.Q3 > 4 ? "5" : "<5";
    }),
        q3highLowGroup = q3highLow.group();

    var q4highLow = ndx.dimension(function (d) {
        return +d.Q4 > 4 ? "5" : "<5";
    }),
        q4highLowGroup = q4highLow.group();

    var q5highLow = ndx.dimension(function (d) {
        return +d.Q5 > 4 ? "5" : "<5";
    }),
        q5highLowGroup = q5highLow.group();

    //Day of week chart
    var dayOfWeek = ndx.dimension(function (d) {
        var day = d.dd.getDay();
        switch (day) {
            case 0:
                return "0.Sun";
            case 1:
                return "1.Mon";
            case 2:
                return "2.Tue";
            case 3:
                return "3.Wed";
            case 4:
                return "4.Thu";
            case 5:
                return "5.Fri";
            case 6:
                return "6.Sat";
        }
    });
    var dayOfWeekGroup = dayOfWeek.group();

    //Gender
    var q10gender = ndx.dimension(function (d) {
        return +d.Q10 > 1 ? "Female " : "Male ";
    }),
        q10genderGroup = q10gender.group();

    //Age
    var age = ndx.dimension(function (d) {
        return d.Q11;
    });
    var ageGroup = age.group();

    //Problem Pie
    var q7problem = ndx.dimension(function (d) {
        return +d.Q7 > 1 ? "No " : "Yes ";
    });
   q7problemGroup = q7problem.group();


    /********************************************************
    *														*
    * 	Step4: Create the Visualisations					*
    *														*
    ********************************************************/




    barChart.width(910) // (optional) define chart width, :default = 200
        .height(90) // (optional) define chart height, :default = 200
        .transitionDuration(500) // (optional) define chart transition duration, :default = 500
        // (optional) define margins
        .margins({ top: 10, right: 50, bottom: 30, left: 20 })
        .dimension(overallByMonth2) // set dimension
        .group(overallByMonthGroup2) // set group
        // (optional) whether chart should rescale y axis to fit data, :default = false
        .elasticY(false)
        // (optional) when elasticY is on whether padding should be applied to y axis domain, :default=0
        .yAxisPadding(0)
        // (optional) whether chart should rescale x axis to fit data, :default = false
        .elasticX(false)
        // (optional) when elasticX is on whether padding should be applied to x axis domain, :default=0
        .xAxisPadding(0)
        // define x scale
        .x(d3.time.scale().domain([new Date(x0), new Date(x1)]))
        // (optional) set filter brush rounding
        .round(d3.time.day.round)
        // define x axis units
        .xUnits(d3.time.days)
        // (optional) whether bar should be center to its x value, :default=false
        .centerBar(true)
        // (optional) set gap between bars manually in px, :default=2
        //.Gap(1)
        // (optional) render horizontal grid lines, :default=false
        .renderHorizontalGridLines(false)
        // (optional) render vertical grid lines, :default=false
        .renderVerticalGridLines(false)
        // (optional) add stacked group and custom value retriever
        //.stack(overallByMonthGroup2, function(d){return d.value;})
        // (optional) you can add multiple stacked group with or without custom value retriever
        // if no custom retriever provided base chart's value retriever will be used
        //.stack(monthlyMoveGroup)
        // (optional) whether this chart should generate user interactive brush to allow range
        // selection, :default=true.
        .brushOn(true)
        // (optional) whether svg title element(tooltip) should be generated for each bar using
        // the given function, :default=no
        .title(function (d) { return "Value: " + d.value; })
        // (optional) whether chart should render titles, :default = false
        .renderTitle(false)

        //// ********** This function runs when we filter items using the brush **********////
        .renderlet(function (chart) {
            var items = lineChart.group().all();
            var filter = chart.filter();
            var f1, f2;
            var x, avg = 0, weightedAvg = 0, denomiator = 0, total = 0;
            var filteredItems;
            var problemPercent, problemArray;
            if (filter) {
                f1 = filter[0].getTime();
                f2 = filter[1].getTime();
            }

            filteredItems = _.filter(items, function (d) {
                x = d.key.getTime();
                return (!filter || (x >= f1 && x <= f2));
            });

            _.each(filteredItems, function (f) {
                avg = f.value.items > 0 ? f.value.total / f.value.items : 0;
                total += (f.value.items * avg);
                denomiator += f.value.items;
            });

            weightedAvg = decimalFormat(total / denomiator);
            weightedAvg = +weightedAvg || 0;
            weightedAvg = weightedAvg || 0;

            problemArray = q7problemGroup.all();
            problemPercent = (problemArray[1].value / (problemArray[0].value + problemArray[1].value)) * 100;
            problemPercent = +problemPercent || 0;
            problemPercent = problemPercent || 0;

            d3.select("#problem-percent-widget")
              .text(Math.round(problemPercent));


            d3.select("#overall-score-widget")
              .text(weightedAvg)
              .transition()
              .duration(1000)
              .ease('linear')
              .tween("text", function () {
                  var i = d3.interpolate(this.textContent, oldWeightedAvg);
                  return function (t) {
                      this.textContent = decimalFormat(i(t));
                  };
              });
            oldWeightedAvg = weightedAvg;
        });
    //// ********** End Renderlet **********////

    lineChart.width(600)
        .height(275)
        .transitionDuration(1000)
        .margins({ top: 10, right: 60, bottom: 25, left: 30 })
        .dimension(overallByMonth)
        .group(overallByMonthGroup)
        .mouseZoomable(false)
        .x(d3.time.scale().domain([new Date(x0), new Date(x1)]))
        .round(d3.time.month.round)
        .xUnits(d3.time.months)
        .elasticY(true)
        .renderHorizontalGridLines(true)
        .brushOn(false)
        .rangeChart(barChart)
        .compose([
            dc.lineChart(lineChart).group(overallByMonthGroup)
                    .valueAccessor(function (d) {
                        return d.value.total / d.value.items;
                    })
                    .renderArea(true)
                    .title(function (d) { return "Date: " + dateFormat(d.key) + "\nOverall Score: " + decimalFormat(d.value.total / d.value.items); })
                    .renderTitle(true)
        ])

        .xAxis();



    //pie charts
    Q2pieChart.width(180)
        .height(180)
        .radius(80)
        .dimension(q2highLow)
        .group(q2highLowGroup)
        .innerRadius(40)
        .label(function (d) {
            if (Q2pieChart.hasFilter() && !Q2pieChart.hasFilter(d.data.key))
                return d.data.key + "(0%)";
            return d.data.key + "(" + Math.floor(d.data.value / all.value() * 100) + "%)";
        });

    Q3pieChart.width(180)
        .height(180)
        .radius(80)
        .dimension(q3highLow)
        .group(q3highLowGroup)
        .innerRadius(40)
        .label(function (d) {
            if (Q3pieChart.hasFilter() && !Q3pieChart.hasFilter(d.data.key))
                return d.data.key + "(0%)";
            return d.data.key + "(" + Math.floor(d.data.value / all.value() * 100) + "%)";
        });

    Q4pieChart.width(180)
        .height(180)
        .radius(80)
        .dimension(q4highLow)
        .group(q4highLowGroup)
        .innerRadius(40)
        .label(function (d) {
            if (Q4pieChart.hasFilter() && !Q4pieChart.hasFilter(d.data.key))
                return d.data.key + "(0%)";
            return d.data.key + "(" + Math.floor(d.data.value / all.value() * 100) + "%)";
        });

    Q5pieChart.width(180)
        .height(180)
        .radius(80)
        .dimension(q5highLow)
        .group(q5highLowGroup)
        .innerRadius(40)
        .label(function (d) {
            if (Q5pieChart.hasFilter() && !Q5pieChart.hasFilter(d.data.key))
                return d.data.key + "(0%)";
            return d.data.key + "(" + Math.floor(d.data.value / all.value() * 100) + "%)";
        }); 

    // Problem table    
    problemTable.width(200).height(200)
        .dimension(overallByMonth2)
        .group(function (d) { return " "; })
        .size(7)
        .order(d3.descending)
        .columns([
            function (d) { return d.Date; },
            function (d) { return d.Q1; },
            function (d) { return d.Q9; },
        ])
        .sortBy(function (d) {
            return d.Date;
        });
    problemTable.dataFilterFunction = function (data) {
        var filtered = _.filter(data, function (d) {return d.Q7 == 1 });
        return filtered;
    };

    dayOfWeekChart.width(180) // (optional) define chart width, :default = 200
        .height(180) // (optional) define chart height, :default = 200
        .dimension(dayOfWeek) // set dimension
        .group(dayOfWeekGroup) // set group
        // (optional) define margins
        .margins({ top: 20, left: 10, right: 10, bottom: 20 })
        //.elasticX(true)
        // (optional) define color array for slices
        .colors(['#3182bd', '#6baed6', '#9ecae1', '#c6dbef', '#dadaeb'])
        // (optional) set gap between rows, default is 5
        .gap(7)
        // (optional) set x offset for labels, default is 10
        //.labelOffSetX(5)
        // (optional) set y offset for labels, default is 15
        //.labelOffSetY(10)
        // (optional) whether chart should render labels, :default = true
        .renderLabel(true)
        // (optional) by default pie chart will use group.key and group.value as its title
        // you can overwrite it with a closure
        //.title(function(d) { return d.data.key + "(" + Math.floor(d.data.value / all.value() * 100) + "%)"; })
        // (optional) whether chart should render titles, :default = false
        .renderTitle(true)
        // (optional) specify the number of ticks for the X axis
        .elasticX(true)
        .label(function (d) {
            return d.key.split(".")[1];
        })
        .title(function (d) { return d.value; })
        .xAxis().ticks(4);


    Q10pieChart.width(180)
        .height(180)
        .radius(80)
        .dimension(q10gender)
        .group(q10genderGroup)
        .innerRadius(0)
        .label(function (d) {
            if (Q10pieChart.hasFilter() && !Q10pieChart.hasFilter(d.data.key))
                return d.data.key + "(0%)";
            return d.data.key + "(" + Math.floor(d.data.value / all.value() * 100) + "%)";
        });

    Q11pieChart.width(180)
        .height(180)
        .radius(80)
        .dimension(age)
        .group(ageGroup)
        .innerRadius(0)
        .label(function (d) {
            if (Q11pieChart.hasFilter() && !Q11pieChart.hasFilter(d.data.key))
                return d.data.key + "(0%)";
            return d.data.key + "(" + Math.floor(d.data.value / all.value() * 100) + "%)";
        });

    Q7pieChart.width(180)
        .height(180)
        .radius(80)
        .dimension(q7problem)
        .group(q7problemGroup)
        .innerRadius(0)
        .label(function (d) {
            if (Q7pieChart.hasFilter() && !Q7pieChart.hasFilter(d.data.key))
                return d.data.key + "(0%)";
            return d.data.key + "(" + Math.round(d.data.value / all.value() * 100) + "%)";
        });

    dc.dataCount("#data-count")
        .dimension(ndx) // set dimension to all data
        .group(all); // set group to ndx.groupAll()

    // Data table    
    dataTable.width(600).height(800)
        .dimension(overallByMonth)
        .group(function (d) { return " "; })
        .size(100)
        .columns([
            function (d) { return d.Date; },
            function (d) { return d.Q1; },
            function (d) { return d.Q2; },
            function (d) { return d.Q3; },
            function (d) { return d.Q4; },
            function (d) { return d.Q5; },
            function (d) { return d.Q6; },
            function (d) { return d.Q7; },
            function (d) { return d.Q8; },
        ])
        .sortBy(function (d) {
            return d.Date;
        })
        // (optional) sort order, :default ascending
        .order(d3.ascending);


    /********************************************************
    *														*
    * 	Step6: 	Render the Charts							*
    *														*
    ********************************************************/

    dc.renderAll();
    dc.redrawAll();


});

$(document).ready(function () {
    var sel = $("#rangeSelector a");
    sel.click(function (t) {
        var that = $(this);
        dc.events.trigger(function () {
            val = that.data("day-range");
            $("#selectedDayRange span.text").text(that.text());
            addDateRange(val);
        });

    });
});

function addDateRange(val) {
    if (val) {
        var start = new moment().subtract('d', val)._d;
        var end = new moment()._d;
        barChart.filter([start, end]);
    }
    else {
        barChart.filterAll();
    }
    barChart.render();
}


