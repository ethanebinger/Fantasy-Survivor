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
        if (($("#nextBtn").html() === "Submit" || currentTab >= x.length) && n !== -1) {
            var form_results = get_results();
            PushPullGithub(form_results);
        };
        // Display the correct tab:
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

function PushPullGithub(form_results) {
    // This is SUPER janky and needs help :)
    // http://github-tools.github.io/github/docs/3.1.0/Repository.html#getRef
    // backup option? https://github.com/philschatz/octokat.js/
    $("#nextBtn").addClass("isHidden");
    $("#prevBtn").addClass("isHidden");
    $("progress").addClass("isHidden");
    $("#loading_results").removeClass("isHidden");
    $.ajax({
        type: "GET",
        url: "https://api.github.com/repos/ethanebinger/Fantasy-Survivor/contents/GhostIsland_Responses.json",
        dataType: "json",
        success: function(result) {
            // PULL existing data (saved in 'responses' object)
            var x = result.content;
            var existing_responses = atob(x);
            var responses = JSON.parse(existing_responses);
            // PUSH new data (only following index.html submission)
            if (form_results != 0) {
                responses.push(form_results);
                var responses_str = JSON.stringify(responses);
                var t_a = 'Mzk2Njc0YjdlYWQxMjZhMTFl',
                    t_b = 'NWFmNmVmZTFhMmZjZDA1NDZjZjU0NA==',
                    user = 'ethanebinger',
                    repo = 'Fantasy-Survivor';
                var push_user = form_results.name;
                let api = new GithubAPI({token: atob(t_a)+atob(t_b)});
                api.setRepo(user, repo);
                api.setBranch('master')
                    .then( () => api.pushFiles(
                        'new input from '+push_user,
                        [{
                            content: responses_str, 
                            path: 'GhostIsland_Responses.json'
                        }]
                    ))
                    .then(function() {
                        console.log('Files committed!');
                        window.location = "http://ethanebinger.com/Fantasy-Survivor/GhostIsland/results.html"
                    });
            } else {
                // load results chart
                init_chart(responses);  
            };
        }
    });
    $('#PastResponses').click(function() {
        window.location = "http://ethanebinger.com/Fantasy-Survivor/GhostIsland/responses.html";   
    });
};

function getPastResponses() {
    $("#past_responses_button").click(function() {
        var curName = $("#past_responses_name option:selected").val();
        var curVote = $("#past_responses_vote option:selected").val();
        if (curName.length < 1 || curVote.length < 1) {
            alert("Please select both a name and a vote number");
            $("#past_responses").empty();
        } else if (curVote === "FinalEight") {
            getFinalEight(curName);
        } else if (curVote === "FinalThree") {
            getFinalThree(curName);
        } else {
            getWeeklyResults(curName, +curVote);
        };
    });
    function getWeeklyResults(curName, curVote) {
        $.ajax({
            type: "GET",
            url: "https://api.github.com/repos/ethanebinger/Fantasy-Survivor/contents/GhostIsland_Responses.json",
            dataType: "json",
            success: function(result) {
                // Clear existing html
                $("#past_responses").empty();
                
                // Parse data into readable json
                var responses = JSON.parse(atob(result.content));
                
                // Calc score
                var scores = [
                    {	'name': curName, 
                        'total': 0,
                        'reward': 0,
                        'immunity': 0,
                        'eliminated': 0,
                        'safe': 0,
                        'titleQuote': 0,
                        'nudity': 0,
                        'idolFound': 0,
                        'idolPlayed': 0,
                        'ghostIsland': 0,
                        'ghostIdol': 0,
                        'ghostPlay': 0
                    }
                ];
                //scores = calculateScores(scores, results, responses, "individual");
                
                // Filter for only selected name and vote, then add html to page
                for (var i=0; i<responses.length; i++) {
                    if (responses[i].name === curName) {
                        var cur_vote = determineWeek(responses[i], 11);
                        if (curVote === cur_vote) {
                            for (var j=0; j<results.length; j++) {
                                if (cur_vote === 11 && results[j].vote === cur_vote) {
                                    scores = calculateScores(scores, [results[j], results[j+1]], [responses[i]], "individual");
                                } else if (results[j].vote === cur_vote) {
                                    scores = calculateScores(scores, [results[j]], [responses[i]], "individual");
                                };
                            };
                            $("#past_responses").append("<h3 id='week_"+String(i)+"'></h3>");
                            if (cur_vote===11) {
                                $("#week_"+String(i)).html("Vote #11 and #12");
                            } else {
                                $("#week_"+String(i)).html("Vote #"+String(cur_vote));
                            };
                            $("#past_responses").append("<span id='json_"+String(i)+"'></span>");
                            $("#json_"+String(i)).html(
                                "<tr><th>Question</th><th>Response</th><th>Points Earned</th></tr>" +
                                "<tr><td><strong>Wins Reward Challenge</strong></td><td>" + responses[i].reward + "</td><td>"+ scores[0].reward +"</td></tr>" +
                                "<tr><td><strong>Wins Immunity</strong></td><td>" + responses[i].immunity + "</td><td>"+ scores[0].immunity +"</td></tr>" +
                                "<tr><td><strong>Eliminated</strong></td><td>" + responses[i].eliminated + "</td><td>"+ scores[0].eliminated +"</td></tr>" +
                                "<tr><td><strong>Safe</strong></td><td>" + responses[i].safe + "</td><td>"+ scores[0].safe +"</td></tr>" +
                                "<tr><td><strong>Title Quote</strong></td><td>" + responses[i].titleQuote + "</td><td>"+ scores[0].titleQuote +"</td></tr>" +
                                "<tr><td><strong>Nudity?</strong></td><td>" + responses[i].nudity + "</td><td>"+ scores[0].nudity +"</td></tr>" +
                                "<tr><td><strong>Idol or Secret Advantage Found?</strong></td><td>" + responses[i].idolFound + "</td><td>"+ scores[0].idolFound +"</td></tr>" +
                                "<tr><td><strong>Idol or Secret Advantage Played?</strong></td><td>" + responses[i].idolPlayed + "</td><td>"+ scores[0].idolPlayed +"</td></tr>" +
                                "<tr><td><strong>Ghost Island Inhabitant</strong></td><td>" + responses[i].ghostIsland + "</td><td>"+ scores[0].ghostIsland +"</td></tr>" +
                                "<tr><td><strong>Able to play on Ghost Island?</strong></td><td>" + responses[i].ghostPlay + "</td><td>"+ scores[0].ghostPlay +"</td></tr>" +
                                "<tr><td><strong>Secret Advantage Found on Ghost Island?</strong></td><td>" + responses[i].ghostIdol + "</td><td>"+ scores[0].ghostIdol +"</td></tr>"
                            );  
                        };
                    };
                };
                ifEmptyHTML();
            }
        });
    };
    function getFinalEight(curName) {
        $.ajax({
            type: "GET",
            url: "https://api.github.com/repos/ethanebinger/Fantasy-Survivor/contents/docs/GhostIsland/FinalEightOrder.json",
            dataType: "json",
            success: function(result) {
                // Clear existing html
                $("#past_responses").empty();
                
                // Parse data into readable json
                var finalEight = JSON.parse(atob(result.content));

                // Create table displaying data in order
                var curName = $("#past_responses_name option:selected").val();
                for (var j=0; j<finalEight.length; j++) {
                    if (finalEight[j].name === curName) {
                        $("#past_responses").append("<h3 id='finalEight_title'></h3>");
                        $("#finalEight_title").html("Order of Final Eight Survivors");
                        $("#past_responses").append("<span id='finalEight_table'></span>");
                        $("#finalEight_table").html(
                            "<tr><th>Rank</th><th>Name</th></tr>" +
                            "<tr><td>8th</td><td>"+ finalEight[j].place_8 +"</td></tr>" +
                            "<tr><td>7th</td><td>"+ finalEight[j].place_7 +"</td></tr>" +
                            "<tr><td>6th</td><td>"+ finalEight[j].place_6 +"</td></tr>" +
                            "<tr><td>5th</td><td>"+ finalEight[j].place_5 +"</td></tr>" +
                            "<tr><td>4th</td><td>"+ finalEight[j].place_4 +"</td></tr>" +
                            "<tr><td>3rd</td><td>"+ finalEight[j].place_3 +"</td></tr>" +
                            "<tr><td>2nd</td><td>"+ finalEight[j].place_2 +"</td></tr>" +
                            "<tr><td>1st</td><td>"+ finalEight[j].place_1 +"</td></tr>"
                        );
                    };
                };
                ifEmptyHTML();
            }
        });
    };
    function getFinalThree(curName) {
        $.ajax({
            type: "GET",
            url: "https://api.github.com/repos/ethanebinger/Fantasy-Survivor/contents/docs/GhostIsland/FinalThreePicks.json",
            dataType: "json",
            success: function(result) {
                // Clear existing html
                $("#past_responses").empty();
                
                // Parse data into readable json
                var finalThree = JSON.parse(atob(result.content));

                // Create table displaying data in order
                var curName = $("#past_responses_name option:selected").val();
                for (var j=0; j<finalThree.length; j++) {
                    if (finalThree[j].name === curName) {
                        $("#past_responses").append("<h3 id='finalThree_title'></h3>");
                        $("#finalThree_title").html("Preseason Picks for Final Three Survivors");
                        $("#past_responses").append("<span id='finalThree_table'></span>");
                        $("#finalThree_table").html(
                            "<tr><th>Pick </th><th>Name</th></tr>" +
                            "<tr><td>1</td><td>"+ finalThree[j].pick_1 +"</td></tr>" +
                            "<tr><td>2</td><td>"+ finalThree[j].pick_2 +"</td></tr>" +
                            "<tr><td>3</td><td>"+ finalThree[j].pick_3 +"</td></tr>"
                        );
                    };
                };
                ifEmptyHTML();
            }
        });
    };
    function ifEmptyHTML() {
        var html_length = $("#past_responses").children().length;
        if (html_length === 0) {
            $("#past_responses").append(
                "<h3></h3><span>Nothing submitted in this category, please select again.</span>"
            );
        };
    };
};

function init_chart() {
    // Define temp data
    var scores = [];
    var players = [
        'Walter', 'Vivian', 'Myles', 
        'Lucas', 'Josh', 'Hue', 'Ezra', 
        'Ethan', 'Emily', 'David',
        'Colin', 'Anastassia', 'Aaron'
    ];
    for (var p=0; p<players.length; p++) {
        scores.push({
            'name': players[p], 
            'total': 0, 
            'Vote 1': 0, 
            'Vote 2': 0, 
            'Vote 3': 0,
            'Vote 4': 0, 
            'Vote 5': 0, 
            'Vote 6': 0,
            'Vote 7': 0, 
            'Vote 8': 0, 
            'Vote 9': 0,
            'Vote 10': 0, 
            'Vote 11': 0, 
            'Vote 12': 0,
            'Vote 13': 0,
            'Vote 14': 0, 
            'Vote 15': 0,
            'Vote 16': 0,
            'Vote 17': 0,
            'Final Eight': 0,
            'Final Three': 0
        });
    };

    // Create arrays for players, keys (votes)
    //var players = scores.map(function(d) { return d.name; });
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
    var responses,
        final8,
        final3;
    $.when(
        // Get the Weekly Responses
        $.get("https://api.github.com/repos/ethanebinger/Fantasy-Survivor/contents/GhostIsland_Responses.json", function(result1) {
            responses = result1;
        }),
        // Get the Final Eight Responses
        $.get("https://api.github.com/repos/ethanebinger/Fantasy-Survivor/contents/docs/GhostIsland/FinalEightOrder.json", function(result2) {
            final8 = result2;
        }),
        // Get the Final Three Responses
        $.get("https://api.github.com/repos/ethanebinger/Fantasy-Survivor/contents/docs/GhostIsland/FinalThreePicks.json", function(result3) {
            final3 = result3;
        })
    ).then(function() {
        var BREAK01 = 'break';
        scores = calculateScores(scores, results, responses, null);
        var BREAK02 = 'break';
        scores = final_eight_calc(scores, final8);
        var BREAK03 = 'break';

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
        

    });
};

// Function to check if x in array
var inArray = function(x,y) {
    var i;
    for (i=0; i < y.length; i++) {
        if (y[i] === x) {
            return true;
        };
    };
    return false;
};

// Function to identify week based on date of vote
function determineWeek(responses, results_vote) {
    var cur_vote = 0;
    var submit_time = new Date(responses.submit_time);
    if (submit_time <= new Date(2018,1,28,20)) {
        /*// Extra Loop for Double Episode
        if (inArray(1, iter_ep)) {
            cur_vote = 2;
        } else {
            cur_vote = 1;
            iter_ep.push(cur_vote);
        }//;*/
        cur_vote = 1;
    } else if (submit_time <= new Date(2018,2,7,20)) {
        cur_vote = 3;
    } else if (submit_time <= new Date(2018,2,14,20)) {
        cur_vote = 4;
    } else if (submit_time <= new Date(2018,2,21,20)) {
        cur_vote = 5;
    } else if (submit_time <= new Date(2018,2,28,20)) {
        cur_vote = 6;
    } else if (submit_time <= new Date(2018,3,4,20)) {
        cur_vote = 7;
    } else if (submit_time <= new Date(2018,3,11,20)) {
        cur_vote = 8;
    } else if (submit_time <= new Date(2018,3,18,20)) {
        cur_vote = 9;
    } else if (submit_time <= new Date(2018,3,25,20)) {
        cur_vote = 10;
    } else if (submit_time <= new Date(2018,4,2,20) && results_vote === 11) {
        cur_vote = 11;
    } else if (submit_time <= new Date(2018,4,2,20) && results_vote === 12) {
        cur_vote = 12;
    } else if (submit_time <= new Date(2018,4,9,20)) {
        cur_vote = 13;
    } else if (submit_time <= new Date(2018,4,16,20)) {
        cur_vote = 14;
    } else if (submit_time <= new Date(2018,4,23,20)) {
        cur_vote = 15;
    } else if (submit_time <= new Date(2018,4,24,20)) {
        cur_vote = 16;
    } else if (submit_time <= new Date(2018,4,25,20)) {
        cur_vote = 17;
    };
    return cur_vote;
};

// FUNCTION TO CALCULATE SCORES
function calculateScores(scores, results, responses, calcType) {
    var name_ep_count = [0];
    for (var n=0; n<scores.length; n++) {
        var cur_player = scores[n].name;
        for (var i=0; i<results.length; i++) {
            var malolo = results[i].malolo;
            var naviti = results[i].naviti;
            var yanuya = results[i].yanuya;
            for (var j=0; j<responses.length; j++) {
                // Validate Player
                if (responses[j].name === cur_player) {
                    // Determine Vote Number/Week (and ignore late sumissions)
                    var cur_vote = determineWeek(responses[j], results[i].vote);
                    // Validate Vote Number/Week
                    if (results[i].vote === cur_vote) {
                        var val_vote = 'Vote ' + String(results[i].vote);
                        // Determine by team if before merge but no swap:
                        if (cur_vote === 13 && inArray(cur_player+"_"+String(cur_vote),name_ep_count) === false && calcType !== "individual" && scores[n].total !== 0) {
                            console.log("skipping accidental duplicate of vote 12: "+cur_player);
                            name_ep_count.push(cur_player+"_"+String(cur_vote));
                        } else if (inArray(cur_player+"_"+String(cur_vote),name_ep_count) && cur_vote !== 13) {
                            console.log("duplicate: "+cur_player+"_"+String(cur_vote));
                        } else if (results[i].merge === 'Yes' /*|| results[i].merge === 'Swap'*/) {
                            if (results[i].vote !== 13) {
                                // Reward
                                if (results[i].reward == responses[j].reward && responses[j].reward) {
                                    if (calcType === "individual") { scores[n].reward += 10; }
                                    else { scores[n][val_vote] += 10; };
                                    scores[n].total += 10;
                                } else if (results[i].reward !== null && typeof results[i].reward==="object" && inArray(responses[j].reward,results[i].reward) && responses[j].reward) {
                                    if (calcType === "individual") { scores[n].reward += 10; }
                                    else { scores[n][val_vote] += 10; };
                                    scores[n].total += 10;
                                };
                                // Immunity
                                if (results[i].immunity == responses[j].immunity && responses[j].immunity) {
                                    if (calcType === "individual") { scores[n].immunity += 15; }
                                    else { scores[n][val_vote] += 15; };
                                    scores[n].total += 15;
                                };
                            };
                            if (results[i].vote < 13) {
                                // Eliminated
                                if (results[i].eliminated == responses[j].eliminated && responses[j].eliminated) {
                                    if (calcType === "individual") { scores[n].eliminated += 20; }
                                    else { scores[n][val_vote] += 20; };
                                    scores[n].total += 20;
                                };
                                // Safe
                                if (cur_vote === 11 && results[i].eliminated !== responses[j].safe && results[i].eliminated2 !== responses[j].safe && responses[j].safe) {
                                    if (calcType === "individual") { scores[n].safe += 20; }
                                    else { scores[n][val_vote] += 20; };
                                    scores[n].total += 20;
                                } else if (results[i].eliminated !== responses[j].safe && responses[j].safe && cur_vote !== 12) {
                                    if (calcType === "individual") { scores[n].safe += 20; }
                                    else { scores[n][val_vote] += 20; };
                                    scores[n].total += 20;
                                };
                            };
                            // Title Quote
                            if (results[i].titleQuote == responses[j].titleQuote && responses[j].titleQuote) {
                                if (calcType === "individual") { scores[n].titleQuote += 4; }
                                else { scores[n][val_vote] += 4; };
                                scores[n].total += 4;
                            };
                            // Ghost Island Inhabitant
                            if (results[i].ghostIsland == responses[j].ghostIsland && responses[j].ghostIsland) {
                                if (calcType === "individual") { scores[n].ghostIsland += 4; }
                                else { scores[n][val_vote] += 4; };
                                scores[n].total += 4;
                            };
                            // Ghost Island Play - Y/N/NA
                            if (results[i].ghostPlay == responses[j].ghostPlay && responses[j].ghostPlay) {
                                if (calcType === "individual") { scores[n].ghostPlay += 2; }
                                else { scores[n][val_vote] += 2; };
                                scores[n].total += 2;
                            };
                            // Ghost Island Idol - Y/N/NA
                            if (results[i].ghostIdol == responses[j].ghostIdol && responses[j].ghostIdol) {
                                if (calcType === "individual") { scores[n].ghostIdol += 2; }
                                else { scores[n][val_vote] += 2; };
                                scores[n].total += 2;
                            };
                            // Nudity
                            if (results[i].nudity == responses[j].nudity && responses[j].nudity) {
                                if (calcType === "individual") { scores[n].nudity += 4; }
                                else { scores[n][val_vote] += 4; };
                                scores[n].total += 4;
                            };
                            // Idol Found
                            if (results[i].idolFound == responses[j].idolFound && responses[j].idolFound) {
                                if (calcType === "individual") { scores[n].idolFound += 4; }
                                else { scores[n][val_vote] += 4; };
                                scores[n].total += 4;
                            };
                            // Idol Played
                            if (results[i].idolPlayed == responses[j].idolPlayed && responses[j].idolPlayed) {
                                if (calcType === "individual") { scores[n].idolPlayed += 4; }
                                else { scores[n][val_vote] += 4; };
                                scores[n].total += 4;
                            };
                            name_ep_count.push(cur_player+"_"+String(cur_vote));
                            console.log(responses[j].name, val_vote, scores[n][val_vote]);
                        } else {
                            // Reward
                            if ((results[i].reward === 'Malolo' || results[i].reward2 === 'Malolo') && inArray(responses[j].reward, malolo) && responses[j].reward) {
                                if (calcType === "individual") { scores[n].reward += 5; }
                                else { scores[n][val_vote] += 5; }
                                scores[n].total += 5;
                            } else if ((results[i].reward === 'Naviti' || results[i].reward2 === 'Naviti') && inArray(responses[j].reward, naviti) && responses[j].reward) {
                                if (calcType === "individual") { scores[n].reward += 5; }
                                else { scores[n][val_vote] += 5; };
                                scores[n].total += 5;   
                            } else if ((results[i].reward === 'Yanuya' || results[i].reward2 === 'Yanuya') && inArray(responses[j].reward, yanuya) && responses[j].reward) {
                                if (calcType === "individual") { scores[n].reward += 5; }
                                else { scores[n][val_vote] += 5; };
                                scores[n].total += 5;   
                            };
                            // Immunity
                            if ((results[i].immunity === 'Malolo' || results[i].immunity2 === 'Malolo') && inArray(responses[j].immunity, malolo) && responses[j].immunity) {
                                if (calcType === "individual") { scores[n].immunity += 7.5; }
                                else { scores[n][val_vote] += 7.5; };
                                scores[n].total += 7.5;
                            } else if ((results[i].immunity === 'Naviti' || results[i].immunity2 === 'Naviti')  && inArray(responses[j].immunity, naviti) && responses[j].immunity) {
                                if (calcType === "individual") { scores[n].immunity += 7.5; }
                                else { scores[n][val_vote] += 7.5; };
                                scores[n].total += 7.5;
                            } else if ((results[i].immunity === 'Yanuya' || results[i].immunity2 === 'Yanuya')  && inArray(responses[j].immunity, yanuya) && responses[j].immunity) {
                                if (calcType === "individual") { scores[n].immunity += 7.5; }
                                else { scores[n][val_vote] += 7.5; };
                                scores[n].total += 7.5;
                            };
                            // Eliminated
                            if (results[i].eliminated == responses[j].eliminated && responses[j].eliminated) {
                                if (calcType === "individual") { scores[n].eliminated += 10; }
                                else { scores[n][val_vote] += 10; };
                                scores[n].total += 10;
                            };
                            // Safe
                            if (results[i].eliminated !== responses[j].safe && responses[j].safe) {
                                if (calcType === "individual") { scores[n].safe += 10; }
                                else { scores[n][val_vote] += 10; };
                                scores[n].total += 10;
                            };
                            // Title Quote
                            if (results[i].titleQuote == responses[j].titleQuote && responses[j].titleQuote) {
                                if (calcType === "individual") { scores[n].titleQuote += 2; }
                                else { scores[n][val_vote] += 2; };
                                scores[n].total += 2;
                            };
                            // Ghost Island Inhabitant
                            if (results[i].ghostIsland == responses[j].ghostIsland && responses[j].ghostIsland) {
                                if (calcType === "individual") { scores[n].ghostIsland += 2; }
                                else { scores[n][val_vote] += 2; };
                                scores[n].total += 2;
                            };
                            // Ghost Island Play - Y/N/NA
                            if (results[i].ghostPlay == responses[j].ghostPlay && responses[j].ghostPlay) {
                                if (calcType === "individual") { scores[n].ghostPlay += 1; }
                                else { scores[n][val_vote] += 1; };
                                scores[n].total += 1;
                            };
                            // Ghost Island Idol - Y/N/NA
                            if (results[i].ghostIdol == responses[j].ghostIdol && responses[j].ghostIdol) {
                                if (calcType === "individual") { scores[n].ghostIdol += 1; }
                                else { scores[n][val_vote] += 1; };
                                scores[n].total += 1;
                            };
                            // Nudity
                            if (results[i].nudity == responses[j].nudity && responses[j].nudity) {
                                if (calcType === "individual") { scores[n].nudity += 2; }
                                else { scores[n][val_vote] += 2; };
                                scores[n].total += 2;
                            };
                            // Idol Found
                            if (results[i].idolFound == responses[j].idolFound && responses[j].idolFound) {
                                if (calcType === "individual") { scores[n].idolFound += 2; }
                                else { scores[n][val_vote] += 2; };
                                scores[n].total += 2;
                            };
                            // Idol Played
                            if (results[i].idolPlayed == responses[j].idolPlayed && responses[j].idolPlayed) {
                                if (calcType === "individual") { scores[n].idolPlayed += 2; }
                                else { scores[n][val_vote] += 2; };
                                scores[n].total += 2;
                            };
                            name_ep_count.push(cur_player+"_"+String(cur_vote));
                            console.log(responses[j].name, val_vote, scores[n][val_vote]);
                        };
                    };
                };
            };
        };
    };
    return scores;
};

// FUNCTION TO CALCULATE SCORES FOR FINAL EIGHT
function final_eight_calc(scores, result) {
    for (var n=0; n<scores.length; n++) {
        for (var i=0; i<result.length; i++) {
            if (result[i].name === scores[n].name) {
                var score8 = which_castaway(result[i]);
                scores[n]['Final Eight'] += score8;
                scores[n].total += score8;
            };
        };
    };
    function which_castaway(castaways){
        var sum = 0;
        for (var i=1; i<9; i++){
            if (castaways['place_'+String([i])] === 'Wendell Holland') {
                sum += Math.pow(Math.abs(i-1),1.5)
            } else if (castaways['place_'+String([i])] === 'Domenick Abbate') {
                sum += Math.pow(Math.abs(i-2),1.5)
            } else if (castaways['place_'+String([i])] === 'Laurel Johnson') {
                sum += Math.pow(Math.abs(i-3),1.5)
            } else if (castaways['place_'+String([i])] === 'Angela Perkins') {
                sum += Math.pow(Math.abs(i-4),1.5)
            } else if (castaways['place_'+String([i])] === 'Donathan') {
                sum += Math.pow(Math.abs(i-5),1.5)
            } else if (castaways['place_'+String([i])] === 'Sebastian Noel') {
                sum += Math.pow(Math.abs(i-6),1.5)
            } else if (castaways['place_'+String([i])] === 'Kellyn Bechtold') {
                sum += Math.pow(Math.abs(i-7),1.5)
            } else if (castaways['place_'+String([i])] === 'Chelsea') {
                sum += Math.pow(Math.abs(i-8),1.5)
            };
        };
        var score = 200 - (3 * sum)
        return (score);
    };
    return (scores);
};

var results = [
    {	'vote': 1,
        'date': '2/28/18',
        'merge': 'No',
        'reward': 'Malolo', 
        'immunity': 'Naviti', 
        'eliminated': 'Stephanie Gonzalez',
        'idolFound': 'No',
        'idolPlayed': 'No',
        'titleQuote': 'Jeff Probst',
        'nudity': 'No',
        'ghostIsland': 'Jacob Derwin',
        'ghostIdol': 'Yes',
        'malolo': [
            'Brendan Shapiro',
            'Donathan Hurley',
            'Jacob Derwin',
            'James Lim',
            'Jenna Bowman',
            'Laurel Johnson',
            'Libby Vincek',
            'Michael Yerger',
            'Stephanie Gonzalez',
            'Stephanie Johnson'
        ],
        'naviti': [
            'Angela Perkins',
            'Bradley Kleihege',
            'Chelsea Townsend',
            'Chris Noble',
            'Desiree Afuye',
            'Domenick Abbate',
            'Kellyn Bechtold',
            'Morgan Ricke',
            'Sebastian Noel',
            'Wendell Holland'
        ]
    },
    {	'vote': 2,
        'date': '2/28/18',
        'merge': 'No',
        'reward': null, 
        'immunity': 'Naviti', 
        'eliminated': 'Jacob Derwin',
        'idolFound': 'Yes', //Domenick Abbate
        'idolPlayed': 'No',
        'titleQuote': null,
        'nudity': 'No',
        'ghostIsland': 'Donathan Hurley',
        'ghostIdol': 'No',
        'malolo': [
            'Brendan Shapiro',
            'Donathan Hurley',
            'Jacob Derwin',
            'James Lim',
            'Jenna Bowman',
            'Laurel Johnson',
            'Libby Vincek',
            'Michael Yerger',
            'Stephanie Johnson'
        ],
        'naviti': [
            'Angela Perkins',
            'Bradley Kleihege',
            'Chelsea Townsend',
            'Chris Noble',
            'Desiree Afuye',
            'Domenick Abbate',
            'Kellyn Bechtold',
            'Morgan Ricke',
            'Sebastian Noel',
            'Wendell Holland'
        ]
    },
    {	'vote': 3,
        'date': '3/7/18',
        'merge': 'Swap',
        'reward': null, 
        'immunity': 'Malolo', 
        'eliminated': 'Morgan Ricke',
        'idolFound': 'Yes', //Michael Yerger
        'idolPlayed': 'No',
        'titleQuote': 'Morgan Ricke',
        'nudity': 'No',
        'ghostIsland': 'Chris Noble',
        'ghostIdol': 'No',
        'malolo': [
            'Brendan Shapiro',
            'Jenna Bowman',
            'Michael Yerger',
            'Stephanie Johnson',
            'Bradley Kleihege',
            'Chelsea Townsend',
            'Sebastian Noel',
            'Kellyn Bechtold',
            'Desiree Afuye'
        ],
        'naviti': [
            'Angela Perkins',
            'Donathan Hurley',
            'James Lim',
            'Laurel Johnson',
            'Libby Vincek',
            'Chris Noble',
            'Domenick Abbate',
            'Morgan Ricke',
            'Wendell Holland'
        ]
    },
    {	'vote': 4,
        'date': '3/14/18',
        'merge': 'No',
        'reward': 'Naviti', 
        'immunity': 'Naviti', 
        'eliminated': 'Brendan Shapiro',
        'idolFound': 'No',
        'idolPlayed': 'Yes',
        'titleQuote': 'Kellyn Bechtold',
        'nudity': 'No',
        'ghostIsland': 'Kellyn Bechtold',
        'ghostIdol': 'Yes',
        'malolo': [
            'Brendan Shapiro',
            'Jenna Bowman',
            'Michael Yerger',
            'Stephanie Johnson',
            'Bradley Kleihege',
            'Chelsea Townsend',
            'Sebastian Noel',
            'Kellyn Bechtold',
            'Desiree Afuye'
        ],
        'naviti': [
            'Angela Perkins',
            'Donathan Hurley',
            'James Lim',
            'Laurel Johnson',
            'Libby Vincek',
            'Chris Noble',
            'Domenick Abbate',
            'Wendell Holland'
        ]
    },
    {	'vote': 5,
        'date': '3/21/18',
        'merge': 'No',
        'reward': 'Naviti', 
        'immunity': 'Naviti', 
        'eliminated': 'Stephanie Johnson',
        'idolFound': 'No',
        'idolPlayed': 'No',
        'titleQuote': 'Chris Noble',
        'nudity': 'Yes',
        'ghostIsland': 'Stephanie Johnson',
        'ghostIdol': 'Yes',
        'malolo': [
            'Jenna Bowman',
            'Michael Yerger',
            'Stephanie Johnson',
            'Bradley Kleihege',
            'Chelsea Townsend',
            'Sebastian Noel',
            'Kellyn Bechtold',
            'Desiree Afuye'
        ],
        'naviti': [
            'Angela Perkins',
            'Donathan Hurley',
            'James Lim',
            'Laurel Johnson',
            'Libby Vincek',
            'Chris Noble',
            'Domenick Abbate',
            'Wendell Holland'
        ]
    },
    {	'vote': 6,
        'date': '3/28/18',
        'merge': 'Swap',
        'reward': null, 
        'immunity': 'Yanuya', 
        'immunity2': 'Naviti',
        'eliminated': 'James Lim',
        'idolFound': 'No',
        'idolPlayed': 'No',
        'titleQuote': 'Desiree Afuye',
        'nudity': 'No',
        'ghostIsland': 'No One',
        'ghostPlay': 'NA',
        'ghostIdol': 'NA',
        'malolo': [
            'Michael Yerger',
            'Kellyn Bechtold',
            'Desiree Afuye',
            'James Lim',
            'Angela Perkins',
        ],
        'naviti': [
            'Donathan Hurley',
            'Bradley Kleihege',
            'Chelsea Townsend',                
            'Libby Vincek',
            'Domenick Abbate'
        ],
        'yanuya': [
            'Jenna Bowman',
            'Sebastian Noel',
            'Chris Noble',
            'Wendell Holland',
            'Laurel Johnson',
        ]
    },
    {	'vote': 7,
        'date': '4/4/18',
        'merge': 'No',
        'reward': 'Naviti', 
        'reward2': 'Yanuya', 
        'immunity': 'Yanuya', 
        'immunity2': 'Malolo',
        'eliminated': 'Bradley Kleihege',
        'idolFound': 'Yes',
        'idolPlayed': 'No',
        'titleQuote': 'Kellyn Bechtold',
        'nudity': 'No',
        'ghostIsland': 'Kellyn Bechtold',
        'ghostPlay': 'Yes',
        'ghostIdol': 'Yes',
        'malolo': [
            'Michael Yerger',
            'Kellyn Bechtold',
            'Desiree Afuye',
            'Angela Perkins',
        ],
        'naviti': [
            'Donathan Hurley',
            'Bradley Kleihege',
            'Chelsea Townsend',                
            'Libby Vincek',
            'Domenick Abbate'
        ],
        'yanuya': [
            'Jenna Bowman',
            'Sebastian Noel',
            'Chris Noble',
            'Wendell Holland',
            'Laurel Johnson',
        ]
    },
    {	'vote': 8,
        'date': '4/11/18',
        'merge': 'Yes',
        'reward': null,
        'immunity': 'Kellyn Bechtold', 
        'eliminated': 'Chris Noble',
        'idolFound': 'No',
        'idolPlayed': 'Yes',
        'titleQuote': 'Domenick Abbate',
        'nudity': 'No',
        'ghostIsland': 'Chris Noble',
        'ghostPlay': 'Yes',
        'ghostIdol': 'Yes'
    },
    {	'vote': 9,
        'date': '4/18/18',
        'merge': 'Yes',
        'reward': [
            'Angela Perkins', 
            'Donathan Hurley',
            'Chelsea Townsend',                
            'Libby Vincek',
            'Wendell Holland',
            'Laurel Johnson'],
        'immunity': 'Angela Perkins', 
        'eliminated': 'Libby Vincek',
        'idolFound': 'No',
        'idolPlayed': 'Yes',
        'titleQuote': null,
        'nudity': 'No',
        'ghostIsland': 'Jenna Bowman',
        'ghostPlay': 'No',
        'ghostIdol': 'NA'
    },
    {	'vote': 10,
        'date': '4/25/18',
        'merge': 'Yes',
        'reward': [
            'Michael Yerger',
            'Kellyn Bechtold', 
            'Sebastian Noel',
            'Chelsea Townsend',                
            'Jenna Bowman'],
        'immunity': 'Chelsea Townsend', 
        'eliminated': 'Desiree Afuye',
        'idolFound': 'Yes',
        'idolPlayed': 'No',
        'titleQuote': 'Jeff Probst',
        'nudity': 'No',
        'ghostIsland': 'Angela Perkins',
        'ghostPlay': 'Yes',
        'ghostIdol': 'No'
    },
    {	'vote': 11,
        'date': '5/2/18',
        'merge': 'Yes',
        'reward': null,
        'immunity': 'Chelsea Townsend', 
        'eliminated': 'Jenna Bowman',
        'eliminated2': 'Michael Yerger',
        'idolFound': 'No',
        'idolPlayed': 'Yes',
        'titleQuote': 'Domenick Abbate',
        'nudity': 'No',
        'ghostIsland': 'No One',
        'ghostPlay': 'NA',
        'ghostIdol': 'NA'
    },
    {	'vote': 12,
        'date': '5/2/18',
        'merge': 'Yes',
        'reward': null,
        'immunity': 'Domenick Abbate', 
        'eliminated': 'Michael Yerger',
        'idolFound': null,
        'idolPlayed': null,
        'titleQuote': null,
        'nudity': null,
        'ghostIsland': null,
        'ghostPlay': null,
        'ghostIdol': null
    },
    {	'vote': 13,
        'date': '5/9/18',
        'merge': 'Yes',
        'reward': [ 
            'Sebastian Noel',
            'Domenick Abbate',                
            'Donathan Hurley'
        ],
        'immunity': 'Domenick Abbate', 
        'eliminated': 'Chelsea Townsend',
        'idolFound': 'No',
        'idolPlayed': 'No',
        'titleQuote': 'Chelsea Townsend',
        'nudity': 'No',
        'ghostIsland': 'Wendell Holland',
        'ghostPlay': 'Yes',
        'ghostIdol': 'Yes'
    },
    {	'vote': 14,
        'date': '5/16/18',
        'merge': 'Yes',
        'reward': [ 
            'Wendell Holland',
            'Domenick Abbate',                
            'Laurel Johnson'
        ],
        'immunity': 'Laurel Johnson', 
        'eliminated': 'Kellyn Bechtold',
        'idolFound': 'No',
        'idolPlayed': 'No',
        'titleQuote': 'Domenick Abbate',
        'nudity': 'No',
        'ghostIsland': 'Sebastian Noel',
        'ghostPlay': 'Yes',
        'ghostIdol': 'Yes'
    },
    {	'vote': 15,
        'date': '5/23/18',
        'merge': 'Yes',
        'reward': null,
        'immunity': 'Wendell Holland', 
        'eliminated': 'Sebastian Noel',
        'idolFound': null,
        'idolPlayed': null,
        'titleQuote': null,
        'nudity': null,
        'ghostIsland': null,
        'ghostPlay': null,
        'ghostIdol': null
    },
    {	'vote': 16,
        'date': '5/23/18',
        'merge': 'Yes',
        'reward': null,
        'immunity': 'Wendell Holland', 
        'eliminated': 'Donathan Hurley',
        'idolFound': null,
        'idolPlayed': null,
        'titleQuote': null,
        'nudity': null,
        'ghostIsland': null,
        'ghostPlay': null,
        'ghostIdol': null
    },
    {	'vote': 17,
        'date': '5/23/18',
        'merge': 'Yes',
        'reward': null,
        'immunity': 'Domenick Abbate', 
        'eliminated': 'Angela Perkins',
        'idolFound': 'No',
        'idolPlayed': 'Yes',
        'titleQuote': 'Domenick Abbate',
        'nudity': 'No',
        'ghostIsland': [ 
            'Wendell Holland',
            'Domenick Abbate',                
            'Laurel Johnson',
            'Angela Perkins'
        ],
        'ghostPlay': 'NA',
        'ghostIdol': 'NA'
    }
];