'use strict';

var Graph = React.createClass({
	getInitialState: function() {
		return {
			data: []
		};
	},
	componentDidMount: function() {
		var scope = this;
		jQuery.get( '/api', function(data) {
			jQuery(scope.refs.waiter).hide();
			jQuery(scope.refs.graph).show();
			scope.state.data = data;
			scope.draw_graph();
		});
	},
	draw_graph: function() {
		var scope = this;

		/* Data Define */
		var data = [];

		jQuery.each(scope.state.data.rows, function(i, d){
			data.push({
				date : new Date(d.day),
				hour : d.hour,
				count : d.count
			});
		});

		var minDate = data[0].date;
		var maxDate = data[data.length-1].date;

		var margin 	= {top: 100, right: 20, bottom: 30, left: 100},
			_width 	= jQuery("#graph .graph").innerWidth(),
			_height = 500,
			width 	= _width - margin.left - margin.right,
			height 	= _height - margin.top - margin.bottom;

		var svg_container = d3.select("#graph .graph").append("svg")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom);
		var svg = svg_container.append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
		
		var x = d3.scaleLinear()
			.rangeRound([0, width])
			.domain([0, 23]);
		var y = d3.scaleTime()
			.range([0, height])
			.domain([minDate, maxDate]);

		var xAxis = d3.axisTop(x)
			.tickSize(0)
			.tickPadding(20)
			.ticks(24)
			.tickFormat(function(d){
				if (d == 0) {
					return "12a"
				} else {
					if (d == 12) {
						return "12p";
					}
					if (d < 12) {
						return d + "a"
					} else {
						return (d-12) + "p"
					}
				}
			});
		var yAxis = d3.axisLeft(y)
			.tickSize(-width)
  			.tickPadding(20);

		svg.append("g")
			.attr("class", "x axis")
      		.call(xAxis);
  		svg.append("g")
  			.attr("class", "y axis")
  			.call(yAxis);

  		svg.append("g")
  			.attr("class", "count")
  			.selectAll("circle")
  			.data(data)
  			.enter()
    		.append("circle")
  			.attr("cx", function(d){
  				return x(d.hour)
  			})
  			.attr("cy", function(d, i){
  				console.log(i, d.date);
  				return y(d.date)
  			})
  			.style("opacity", 0)
  			.attr("r", 0)
  			.attr("fill", "none")
  			.transition()
    		.duration(1000)
    		.delay(function(d, i) {
    			return y(d.date) + d.hour * 50; 
    		})
    		.style("opacity", 1)
    		.attr("r", function(d){
  				return 15 * d.count / 100
  			})
  			.attr("fill", function(d){
  				return d3.rgb(2.55 * (100-d.count), 2.55 * (100-d.count), 2.55 * (100-d.count));
  			})
	},
	render : function(){
		return (
			<div ref="root">
				<div className="waiter" ref="waiter">
					Fetching data ...
				</div>
				<div className="graph" ref="graph">
				</div>
			</div>
		);
	}
});

ReactDOM.render( <Graph /> , document.getElementById('graph'));