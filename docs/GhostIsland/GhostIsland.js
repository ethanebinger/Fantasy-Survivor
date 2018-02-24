function init() {
    // Input button coloring
    $('input').click(function(e) {
        var cur_id = $(e.target).attr('value');
        cur_id = cur_id.replace(" ","_");
        $(e.target).parent().children('label').addClass('greyLabel');
        $(e.target).parent().children('label.'+cur_id).removeClass('greyLabel');
    });
    
    // Collect form results
    function get_results(form) {
        var results = {};
        var val = ""
        $('form').each(function(e) {
            var q = this.name;
            val = $(this).find(":selected").text();
            if (val.length > 0) {
                val = val.trim();
            } else {
                for(var c=0; c<this.length; c++) {
                    if (this[c].checked === true) {
                        val = this[c].value;     
                    };
                };
            };
            results[q] = val;
        });
        results['submit_time'] = new Date();
        return results;
    };

    // Tab switching
    var currentTab = 0;
    showTab(currentTab);

    $("#prevBtn").click(function(e) {
        nextPrev(-1);
        window.scrollTo(0,0);
    });
    $("#nextBtn").click(function(e) {
        nextPrev(1);
    });

    function showTab(n) {
        var x = $(".tab");
        x[n].style.display = "block";
        if (n === 0) {
            $("#prevBtn").addClass("isHidden");
        } else {
            $("#prevBtn").removeClass("isHidden");
        };
        if (n === (x.length - 1)) {
            $("#nextBtn").html("Submit");
        } else {
            $("#nextBtn").html("Next");
        };
        fixStepIndicator(n);
        window.scrollTo(0,0);
    };

    function nextPrev(n) {
        // This function will figure out which tab to display
        var x = $(".tab");
        // Exit the function if any field in the current tab is invalid:
        if (n === 1 && !validateform()) {
            alert("please fill out all questions on page");
            return false;
        };
        // Hide the current tab:
        x[currentTab].style.display = "none";
        // Increase or decrease the current tab by 1:
        currentTab = currentTab + n;
        // if you have reached the end of the form...
        if ($("#nextBtn").html() === "Submit" || currentTab >= x.length) {
            var form_results = get_results();
            /* DEBUG BELOW
            var alert_text = ""
            for (var key in form_results) {
                if (form_results.hasOwnProperty(key)) {
                    alert_text += key + " = " + form_results[key] + "\n";
                };
            };
            alert(alert_text);
            //*/
            PushPullGithub(form_results);
        };
        // Otherwise, display the correct tab:
        showTab(currentTab);
    };

    function fixStepIndicator(n) {
        $("progress").val(n+1);
    };

    // Validate data
    function validateform() {
        var x, y, z, i, valid = true;
        x = $(".tab");
        y = x[currentTab].getElementsByTagName("input");
        if (y.length === 0) {
            z = x[currentTab].getElementsByTagName("option");
            for (i=1; i<z.length; i++) {
                if (z[i].selected) {
                    valid = true;
                    break;
                } else {
                    valid = false;
                };
            };
        } else {
            for (i=0; i<y.length; i++) {
                // If a field is empty...
                if (y[i].checked) {
                    valid = true;
                    break;
                } else {
                    valid = false;
                };
            };
        };
        return valid;
    };
};

var responses;
function PushPullGithub(form_results) {
    // This is SUPER janky and needs help :)
    // http://github-tools.github.io/github/docs/3.1.0/Repository.html#getRef
    // backup option? https://github.com/philschatz/octokat.js/
    $.ajax({
        type: "GET",
        url: "https://api.github.com/repos/ethanebinger/Fantasy-Survivor/contents/GhostIsland_Responses.json",
        dataType: "json",
        success: function(result) {
            // PULL existing data (saved in 'responses' object)
            var x = result.content;
            var existing_responses = atob(x);
            responses = JSON.parse(existing_responses);
            
            // PUSH new data (only following index.html submission)
            if (form_results != 0) {
                responses.push(form_results);
                var responses_str = JSON.stringify(responses);
                var t_a = 'Mzk2Njc0YjdlYWQxMjZhMTFl',
                    t_b = 'NWFmNmVmZTFhMmZjZDA1NDZjZjU0NA==',
                    user = 'ethanebinger',
                    repo = 'Fantasy-Survivor';
                let api = new GithubAPI({token: atob(t_a)+atob(t_b)});
                api.setRepo(user, repo);
                api.setBranch('master')
                    .then( () => api.pushFiles(
                        'test commit',
                        [{
                            content: responses_str, 
                            path: 'GhostIsland_Responses.json'
                        }]
                    ))
                    .then(function() {
                        console.log('Files committed!');
                        window.location = "http://ethanebinger.com/Fantasy-Survivor/GhostIsland/results.html"
                    });
            };
        }
    });
};

function init_chart() {
    // PULL results from Github JSON
    var responses;
    PushPullGithub();
    
    // Define temp data
    var scores = [
        {	'name': 'Walter', 
            'total': 0, 
            'Week 1': 0, 
            'Week 2': 0, 
            'Week 3': 0,
            'Week 4': 0, 
            'Week 5': 0, 
            'Week 6': 0,
            'Week 7': 0, 
            'Week 8': 0, 
            'Week 9': 0,
            'Week 10': 0, 
            'Week 11': 0, 
            'Week 12': 0,
            'Week 13': 0, 
            'Week 14': 0, 
            'Week 15': 0
        },
        {	'name': 'Josh', 
            'total': 0, 
            'Week 1': 0, 
            'Week 2': 0, 
            'Week 3': 0,
            'Week 4': 0, 
            'Week 5': 0, 
            'Week 6': 0,
            'Week 7': 0, 
            'Week 8': 0, 
            'Week 9': 0,
            'Week 10': 0, 
            'Week 11': 0, 
            'Week 12': 0,
            'Week 13': 0, 
            'Week 14': 0, 
            'Week 15': 0
        },
        {	'name': 'Ezra', 
            'total': 0, 
            'Week 1': 0, 
            'Week 2': 0, 
            'Week 3': 0,
            'Week 4': 0, 
            'Week 5': 0, 
            'Week 6': 0,
            'Week 7': 0, 
            'Week 8': 0, 
            'Week 9': 0,
            'Week 10': 0, 
            'Week 11': 0, 
            'Week 12': 0,
            'Week 13': 0, 
            'Week 14': 0, 
            'Week 15': 0
        },
        {	'name': 'Ethan', 
            'total': 0, 
            'Week 1': 0, 
            'Week 2': 0, 
            'Week 3': 0,
            'Week 4': 0, 
            'Week 5': 0, 
            'Week 6': 0,
            'Week 7': 0, 
            'Week 8': 0, 
            'Week 9': 0,
            'Week 10': 0, 
            'Week 11': 0, 
            'Week 12': 0,
            'Week 13': 0, 
            'Week 14': 0, 
            'Week 15': 0
        },
        {	'name': 'Emily', 
            'total': 0, 
            'Week 1': 0, 
            'Week 2': 0, 
            'Week 3': 0,
            'Week 4': 0, 
            'Week 5': 0, 
            'Week 6': 0,
            'Week 7': 0, 
            'Week 8': 0, 
            'Week 9': 0,
            'Week 10': 0, 
            'Week 11': 0, 
            'Week 12': 0,
            'Week 13': 0, 
            'Week 14': 0, 
            'Week 15': 0
        },
        {	'name': 'David', 
            'total': 0, 
            'Week 1': 0, 
            'Week 2': 0, 
            'Week 3': 0,
            'Week 4': 0, 
            'Week 5': 0, 
            'Week 6': 0,
            'Week 7': 0, 
            'Week 8': 0, 
            'Week 9': 0,
            'Week 10': 0, 
            'Week 11': 0, 
            'Week 12': 0,
            'Week 13': 0, 
            'Week 14': 0, 
            'Week 15': 0
        },
        {	'name': 'Colin', 
            'total': 0, 
            'Week 1': 0, 
            'Week 2': 0, 
            'Week 3': 0,
            'Week 4': 0, 
            'Week 5': 0, 
            'Week 6': 0,
            'Week 7': 0, 
            'Week 8': 0, 
            'Week 9': 0,
            'Week 10': 0, 
            'Week 11': 0, 
            'Week 12': 0,
            'Week 13': 0, 
            'Week 14': 0, 
            'Week 15': 0
        },
        {	'name': 'Anastassia', 
            'total': 0, 
            'Week 1': 0, 
            'Week 2': 0, 
            'Week 3': 0,
            'Week 4': 0, 
            'Week 5': 0, 
            'Week 6': 0,
            'Week 7': 0, 
            'Week 8': 0, 
            'Week 9': 0,
            'Week 10': 0, 
            'Week 11': 0, 
            'Week 12': 0,
            'Week 13': 0, 
            'Week 14': 0, 
            'Week 15': 0
        },
    ];
    /*
    // defined above
    var responses = [
        {   'name': 'Ethan', 
            'week': 1, 
            'date': '2/28/18', 
            'reward': '', 
            'immunity': '', 
            'eliminated': '', 
            'safe': ''
        },
    ];
    //*/
    var results = [
        {	'week': 1,
            'date': '2/28/18', 
            'reward': null, 
            'immunity': null, 
            'eliminated': null,
            'safe': null,
            'idolFound': null,
            'idolPlayed': null,
            'titleQuote': null,
            'nudity': null
        }
    ];

    // Create arrays for players, keys (weeks)
    var players = scores.map(function(d) { return d.name; });
    var keys = Object.keys(scores[0]).splice(2,)

    // Define chart elements
    var margin = {top: 20, right: 20, bottom: 30, left: 80},
        width = $('#survivor_form').width() - margin.left - margin.right,
        height = 480 - margin.top - margin.bottom;

    // Define Scales and Axes
    var x = d3.scaleLinear()
        .range([0, width-100]);
    var y = d3.scaleBand()
        .domain(players)
        .rangeRound([height, 0], 0.3);
    var color = d3.scaleOrdinal()
        .domain(keys)
        .range(["#8dd3c7", "#ffffb3", "#bebada", 
                "#fb8072", "#80b1d3", "#fdb462", 
                "#b3de69", "#fccde5", "#d9d9d9", 
                "#bc80bd", "#ccebc5", "#ffed6f",
                "#1f78b4", "#33a02c", "#6a3d9a"]);
    var xAxis = d3.axisBottom(x);
    var yAxis = d3.axisLeft(y);

    // Define tooltip
    var tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-5, 0])
        .html(function(d) {
            return 	"<strong>" + d.data.name + "</strong>" +
                    "<br><span>Weekly Score = " + String(d[1]-d[0]) + "</span>" +
                    "<br><span>Total Score = " + d.data.total + "</span>"
        });

    // Define SVG and associated elements
    var svg = d3.select("#chart")
        .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
    var chart = svg.append("g")
        .attr("transform",  "translate(" + margin.left + "," + margin.top + ")")
        .call(tip);	

    // Calculate scores
    for (var n=0; n<scores.length; n++) {
        var cur_player = scores[n].name;
        for (var i=0; i<results.length; i++) {
            for (var j=0; j<responses.length; j++) {
                // Determine Week
                var cur_week = 0;
                var submit_time = new Date(results[i].submit_time);
                // Determine Week and ignore late sumissions
                if (submit_time <= new Date('2,28,2018')) {
                    cur_week = 1;
                } else if (submit_time <= new Date('3,7,2018')) {
                    cur_week = 2;
                } else if (submit_time <= new Date('3,14,2018')) {
                    cur_week = 3;
                } else if (submit_time <= new Date('3,21,2018')) {
                    cur_week = 4;
                } else if (submit_time <= new Date('3,28,2018')) {
                    cur_week = 5;
                } else if (submit_time <= new Date('4,4,2018')) {
                    cur_week = 6;
                } else if (submit_time <= new Date('4,11,2018')) {
                    cur_week = 7;
                } else if (submit_time <= new Date('4,18,2018')) {
                    cur_week = 8;
                } else if (submit_time <= new Date('4,25,2018')) {
                    cur_week = 9;
                } else if (submit_time <= new Date('5,2,2018')) {
                    cur_week = 10;
                } else if (submit_time <= new Date('5,9,2018')) {
                    cur_week = 11;
                } else if (submit_time <= new Date('5,16,2018')) {
                    cur_week = 12;
                } else if (submit_time <= new Date('5,23,2018')) {
                    cur_week = 13;
                } else if (submit_time <= new Date('5,30,2018')) {
                    cur_week = 14;
                };
                // Validate Player, Week
                if (responses[j].name == cur_player && results[i].week == cur_week) {
                    // Week
                    var cur_week = 'Week ' + String(results[i].week);
                    // Reward
                    if (results[i].reward == responses[j].reward && responses[j].reward) {
                        scores[n][cur_week] += 5;
                        scores[n].total += 5;
                    };
                    // Immunity
                    if (results[i].immunity == responses[j].immunity && responses[j].immunity) {
                        scores[n][cur_week] += 7.5;
                        scores[n].total += 7.5;
                    };
                    // Eliminated
                    if (results[i].eliminated == responses[j].eliminated && responses[j].eliminated) {
                        scores[n][cur_week] += 10;
                        scores[n].total += 10;
                    };
                    // Safe
                    if (results[i].eliminated !== responses[j].safe && responses[j].safe) {
                        scores[n][cur_week] += 10;
                        scores[n].total += 10;
                    };
                    // Title Quote
                    if (results[i].titleQuote !== responses[j].titleQuote && responses[j].titleQuote) {
                        scores[n][cur_week] += 2;
                        scores[n].total += 2;
                    };
                    // Nudity
                    if (results[i].nudity !== responses[j].nudity && responses[j].nudity) {
                        scores[n][cur_week] += 2;
                        scores[n].total += 2;
                    };
                    // Idol Found
                    if (results[i].idolFound !== responses[j].idolFound && responses[j].idolFound) {
                        scores[n][cur_week] += 2;
                        scores[n].total += 2;
                    };
                    // Idol Played
                    if (results[i].idolPlayed !== responses[j].idolPlayed && responses[j].idolPlayed) {
                        scores[n][cur_week] += 2;
                        scores[n].total += 2;
                    };
                };
            };
        };
    };

    // Define X-Scale Domain
    x.domain([0,d3.max(scores, function(d) { return d.total; })]);

    // Render Chart
    chart.append("g")
        .selectAll("g")
        .data(d3.stack().keys(keys)(scores))
        .enter().append("g")
            .attr("fill", function (d){ return color(d.key); })
        .selectAll("rect")
        .data(function(d) { return d; })
        .enter().append("rect")
            .attr("class", "bar")
            .attr("x", function(d) { return x(d[0]); })
            .attr("y", function(d) { return y(d.data.name); })
            .attr("width", function(d) { return x(d[1]) - x(d[0]); })
            .attr("height", y.bandwidth())
            .on("mouseenter", function(d) { 
                tip.show(d); 
                d3.select(this).style("cursor", "pointer")
                               .style("fill-opacity", 0.5);
            })
            .on("mouseleave", function(d) { 
                d3.select(this).style("fill-opacity", 1);
                tip.hide(d);
            });

    // Add Axes
    chart.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);
    chart.append("g")
        .attr("class", "y axis")
        .call(yAxis);

    // Add Legend
    var legend = chart.append("g")
        .attr("font-family", "sans-serif")
        .attr("font-size", 10)
        .attr("text-anchor", "end")
        .selectAll("g")
            .data(keys)
            .enter().append("g")
            .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

    legend.append("rect")
        .attr("x", width - 19)
        .attr("width", 19)
        .attr("height", 19)
        .attr("fill", color);

    legend.append("text")
        .attr("x", width - 24)
        .attr("y", 9.5)
        .attr("dy", "0.32em")
        .text(function(d) { return d; });

};