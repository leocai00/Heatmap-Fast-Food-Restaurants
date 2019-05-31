(function () {

    const width = 960;
    const height = 500;
    // let statesLivedData = [];
    // let citiesLivedData = [];
    let statesGeoJSONData = [];
    let restaurants = [];
    window.onload = function () {
        // load states lived data
        d3.csv("data/Datafiniti_Fast_Food_Restaurants.csv")
            .then((data) => {
                restaurants = data;
                loadStatesGeoJSONData();
            });
    }

    // load GeoJSON states data
    function loadStatesGeoJSONData() {
        d3.json("data/us-states.json").then((data) => {
            statesGeoJSONData = data
            makeMapPlot(); // all data should be loaded
        });
    }

    function makeMapPlot() {
        /*
        console.log(statesLivedData);
        console.log(citiesLivedData);
        console.log(statesGeoJSONData);
        */
        // console.log(restaurants);

        var expensesByprovince = d3.nest()
            .key(function (d) { return d.province; })
            .rollup(function (v) {
                return {
                    count: v.length
                };
            })
            .object(restaurants);

        let states = Object.keys(expensesByprovince);
        states = states.map(e => convertRegion(e));
        let counts = Object.values(expensesByprovince);
        counts = counts.map(function (obj) {
            return obj.count;
        });
        let range = d3.extent(counts);
        console.log(states);
        console.log(counts);

        // define the projection type we want
        let projection = d3.geoAlbersUsa()
            .translate([width / 2, height / 2]) // translate to center of svg
            .scale([1000]); // scale down to see the whole US

        // path generator
        let path = d3.geoPath() // converts geoJSON to SVG paths
            // each state is represented by a path element
            .projection(projection); // use AlbersUSA projection

        let color = d3.scaleLinear()
            .domain([range[0], range[1]])
            .range(["white", "red"]);

        // let legendText = ["Cities Lived", "States Lived", "States Visited", "Nada"];

        let svg = d3.select("body").append("svg")
            .attr("width", width)
            .attr("height", height);

        // append a div to the body for the tooltip
        let tooltip = d3.select("body")
            .append("div")
            .attr("class", "tooltip")
            .style("opacity", 0)
            .style("width", "100px")
            .style("height", "30px");


        // Loop through each state data value in the .csv file
        for (let i = 0; i < states.length; i++) {

            // Grab State Name
            let dataState = states[i];

            // Grab data value 
            let dataValue = counts[i];

            // Find the corresponding state inside the GeoJSON
            for (let j = 0; j < statesGeoJSONData.features.length; j++) {
                let jsonState = statesGeoJSONData.features[j].properties.name;

                if (dataState == jsonState) {

                    // Copy the data value into the JSON
                    statesGeoJSONData.features[j].properties.count = dataValue;

                    // Stop looking through the JSON
                    break;
                }
            }
        }
        console.log(statesGeoJSONData);

        // Bind the data to the SVG and create one path per GeoJSON feature
        svg.selectAll("path")
            .data(statesGeoJSONData.features)
            .enter()
            .append("path")
            .attr("d", path)
            .style("stroke", "#fe5f55")
            .style("stroke-width", "1")
            .style("fill", function (d) {

                // Get data value
                var value = d.properties.count;
                // console.log(d);
                if (value) {
                    //If value exists…
                    return color(value);
                } else {
                    //If value is undefined…
                    return "rgb(213,222,217)";
                }
            })
            .on("mouseover", function (d) {
                tooltip.transition()
                    .duration(200)
                    .style("opacity", .9);
                tooltip.text(d.properties.name + ": " + d.properties.count)
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY - 28) + "px")
                    .style();
            })

            // fade out tooltip on mouse out               
            .on("mouseout", function (d) {
                tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
            });

        svg.append('text')
        .attr('x', 275)
        .attr('y', 15)
        .style('font-size', '15pt')
        .text("Heapmap of U.S. Fast Food Restaurants");
    }

    function convertRegion(input) {
        var states = [
            ['Alabama', 'AL'],
            ['Alaska', 'AK'],
            ['American Samoa', 'AS'],
            ['Arizona', 'AZ'],
            ['Arkansas', 'AR'],
            ['Armed Forces Americas', 'AA'],
            ['Armed Forces Europe', 'AE'],
            ['Armed Forces Pacific', 'AP'],
            ['California', 'CA'],
            ['Colorado', 'CO'],
            ['Connecticut', 'CT'],
            ['Delaware', 'DE'],
            ['District Of Columbia', 'DC'],
            ['Florida', 'FL'],
            ['Georgia', 'GA'],
            ['Guam', 'GU'],
            ['Hawaii', 'HI'],
            ['Idaho', 'ID'],
            ['Illinois', 'IL'],
            ['Indiana', 'IN'],
            ['Iowa', 'IA'],
            ['Kansas', 'KS'],
            ['Kentucky', 'KY'],
            ['Louisiana', 'LA'],
            ['Maine', 'ME'],
            ['Marshall Islands', 'MH'],
            ['Maryland', 'MD'],
            ['Massachusetts', 'MA'],
            ['Michigan', 'MI'],
            ['Minnesota', 'MN'],
            ['Mississippi', 'MS'],
            ['Missouri', 'MO'],
            ['Montana', 'MT'],
            ['Nebraska', 'NE'],
            ['Nevada', 'NV'],
            ['New Hampshire', 'NH'],
            ['New Jersey', 'NJ'],
            ['New Mexico', 'NM'],
            ['New York', 'NY'],
            ['North Carolina', 'NC'],
            ['North Dakota', 'ND'],
            ['Northern Mariana Islands', 'NP'],
            ['Ohio', 'OH'],
            ['Oklahoma', 'OK'],
            ['Oregon', 'OR'],
            ['Pennsylvania', 'PA'],
            ['Puerto Rico', 'PR'],
            ['Rhode Island', 'RI'],
            ['South Carolina', 'SC'],
            ['South Dakota', 'SD'],
            ['Tennessee', 'TN'],
            ['Texas', 'TX'],
            ['US Virgin Islands', 'VI'],
            ['Utah', 'UT'],
            ['Vermont', 'VT'],
            ['Virginia', 'VA'],
            ['Washington', 'WA'],
            ['West Virginia', 'WV'],
            ['Wisconsin', 'WI'],
            ['Wyoming', 'WY'],
        ];

        for (state of states) {
            if (state[1] == input) {
                return (state[0]);
            }
        }
    }
})();