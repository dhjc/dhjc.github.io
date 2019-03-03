var ajax = new XMLHttpRequest();
ajax.open("GET", "https://exoplanetarchive.ipac.caltech.edu/cgi-bin/nstedAPI/nph-nstedAPI?table=exoplanets&select=distinct%20pl_hostname&format=json", true);
ajax.onload = function() {
var list = JSON.parse(ajax.responseText).map(function(i) { return i.pl_hostname; });
new Awesomplete(document.querySelector("#system"),{ list: list });
};
ajax.send();

document.addEventListener('DOMContentLoaded',function(){
    // Link pressing of enter with clicking on visualise
    document.getElementById("system").addEventListener("keyup", function(event) {
    // Number 13 is the "Enter" key on the keyboard
    if (event.keyCode === 13) {
        // Cancel the default action, if needed
        event.preventDefault();
        // Trigger the button element with a click
        document.getElementById("getMessage").click();
    }
    });


    document.getElementById('getMessage').onclick=function(){
    req=new XMLHttpRequest();
    system_input = document.getElementById("system").value;
    url = "https://exoplanetarchive.ipac.caltech.edu/cgi-bin/nstedAPI/nph-nstedAPI?table=exoplanets&select=pl_hostname,pl_radj,pl_name,pl_letter,pl_orbsmax&order=dec&format=json&where=pl_hostname%20like%20%27" + system_input + "%27";
    req.open("GET",url,true);
    req.send();
    req.onload=function(){
        json=JSON.parse(req.responseText);
        var html = "";
        var names = [];
        var dists = [];
        var radii = [];
        var dataset = [];
        // Add your code below this line
        json.forEach(function(val) {
        var keys = Object.keys(val);
        html += "<div class = 'planet'>";
        keys.forEach(function(key) {
            html += "<strong>" + key + "</strong>: " + val[key] + "<br>";
            switch(key) {
            case 'pl_name':
                names.push(val[key])
                break;
            case 'pl_orbsmax':
                dists.push(val[key])
                break;
            case 'pl_radj':
                if (val[key] === null) {
                radii.push(0.15)
                } else {
                radii.push(val[key])
                }

                break;

            default:
                // code block
            }
            


        });
        html += "</div><br>";

        });
        var i;
        for (i = 0; i < names.length; i++) {
                dataset.push([dists[i], 250, names[i], radii[i]])

        }

        
        // Add your code above this line
        d3.select(".info").html(html);
        const w = 1000;
        const h = 500;
        const padding = 60;
    
        const xScale = d3.scaleLinear()
                    .domain([0, d3.max(dataset, (d) => d[0])])
                    .range([padding, w - padding]);
    
        const yScale = d3.scaleLinear()
                    .domain([0, d3.max(dataset, (d) => d[1])])
                    .range([h - padding, padding]);
        
        d3.select(".graph").select("svg").remove();
        
        const svg = d3.select(".graph")
                .append("svg")
                .attr("width", w)
                .attr("height", h);
        
            svg.append("text")
                .attr("x", w / 2 )
                .attr("y", 20)
                .attr("class","whitetext")
                .style("text-anchor", "middle")
                .text(system_input);
        
            svg.append("text")
                .attr("x", w / 2 )
                .attr("y", h - 20)
                .attr("class","whitetext")
                .style("text-anchor", "middle")
                .text("Distance from " + system_input + " in AU (1 AU = Earth-Sun distance)");

        svg.selectAll("circle")
            .data(dataset)
            .enter()
            .append("circle")
            .attr("cx", (d) => xScale(d[0]))
            .attr("cy",(d) => (d[1]))
            .attr("r", (d) => 50 * d[3])
            .append("svg:title")
            .text(function(d) { if(d[3] != 0.15) {return d[2] + ': radius of ' + d[3] + ' Jupiter radii and ' + d[0] + 'AU from ' + system_input; } else {
        return d[2] + ': unknown radius and ' + d[0] + 'AU from ' + system_input;
        }});



        const xAxis = d3.axisBottom(xScale);
        // Add your code below this line
        const yAxis = undefined;
        // Add your code above this line

        svg.append("g")
            .attr("transform", "translate(0," + (h - padding) + ")")
        .attr("class","axisWhite")
            .call(xAxis);
    };
    }; 
});