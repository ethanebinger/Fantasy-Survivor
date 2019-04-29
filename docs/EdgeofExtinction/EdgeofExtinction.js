function init() {
    // Move past hero page and enter form on click
    $('#enterBtn').click(function(e) {
		$('.title_img').addClass('isHidden');
        $('#survivor_form').removeClass('isHidden');
        $('#advance_form').removeClass('isHidden');
    });
    
	// Move past hero page and go to results on click
	$('#resultsBtn').click(function(e) {
		window.location = "https://ethanebinger.com/Fantasy-Survivor/EdgeofExtinction/results";
    });
	
    // Input button coloring
    $('input').click(function(e) {
        var cur_tab = $(e.target).attr('name');
        $('label.'+cur_tab).addClass('greyLabel');
        $(e.target).parent().children('label').removeClass('greyLabel');
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
        document.body.scrollTop=0;
    });
    $("#nextBtn").click(function(e) {
        nextPrev(1);
    });

    function showTab(n) {
        var x = $(".tab");
        x[n].style.display = "inline-block";
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
        document.body.scrollTop=0;
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
    
    function autoResizeDiv() {
        document.getElementById('survivor_form').style.height = window.innerHeight +'px';
    };
    window.onresize = autoResizeDiv;
    autoResizeDiv();
    
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
        url: "https://api.github.com/repos/ethanebinger/Fantasy-Survivor/contents/docs/EdgeofExtinction/EdgeofExtinction_Responses.json",
        dataType: "json",
        success: function(result) {
            // PULL existing data (saved in 'responses' object)
            var x = result.content;
            var existing_responses = atob(x);
            var responses = JSON.parse(existing_responses);
            // PUSH new data (only following index.html submission)
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
                        path: 'docs/EdgeofExtinction/EdgeofExtinction_Responses.json'
                    }]
                ))
                .then(function() {
                    console.log('Files committed!');
                    window.location = "http://ethanebinger.com/Fantasy-Survivor/EdgeofExtinction/results.html"
                });
        }
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
            url: "https://api.github.com/repos/ethanebinger/Fantasy-Survivor/contents/docs/EdgeofExtinction/EdgeofExtinction_Responses.json",
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
						'returns': 0,
                        'titleQuote': 0,
                        'nudity': 0,
                        'idolFound': 0,
                        'idolPlayed': 0,
						'quitExIsland': 0,
						'feint_vote8': 0
                    }
                ];
                //scores = calculateScores(scores, results, responses, "individual");
                
                // Filter for only selected name and vote, then add html to page
                for (var i=0; i<responses.length; i++) {
                    if (responses[i].name === curName) {
                        var cur_vote = determineWeek(responses[i]);
                        if (curVote === cur_vote) {
                            for (var j=0; j<results.length; j++) {
                                scores = calculateScores(scores, [results[j]], [responses[i]], "individual");
                            };
                            $("#past_responses").append("<h3 id='week_"+String(i)+"'></h3>");
                            $("#past_responses").append("<span id='json_"+String(i)+"'></span>");
							if (cur_vote === 1) {
								$("#week_"+String(i)).html("Vote #"+String(cur_vote));
								$("#json_"+String(i)).html(
									"<tr><th>Question</th><th>Response</th><th>Points Earned</th></tr>" +
									"<tr><td><strong>Title Quote</strong></td><td>" + responses[i].titleQuote + "</td><td>"+ scores[0].titleQuote +"</td></tr>" +
									"<tr><td><strong>Nudity?</strong></td><td>" + responses[i].nudity + "</td><td>"+ scores[0].nudity +"</td></tr>" +
									"<tr><td><strong>Idol or Secret Advantage Found?</strong></td><td>" + responses[i].idolFound + "</td><td>"+ scores[0].idolFound +"</td></tr>" +
									"<tr><td><strong>Idol or Secret Advantage Played?</strong></td><td>" + responses[i].idolPlayed + "</td><td>"+ scores[0].idolPlayed +"</td></tr>"+
									"<tr><td><strong>How many times will Jeff say 'Edge of Extinction'</strong></td><td>" + responses[i].JeffSays + "</td><td>n/a</td></tr>"
								);
							} else if (curVote === 7) {
								$("#week_"+String(i)).html("Vote #"+String(cur_vote));
								$("#json_"+String(i)).html(
									"<tr><th>Question</th><th>Response</th><th>Points Earned</th></tr>" +
									"<tr><td><strong>Wins Reward Challenge</strong></td><td>" + responses[i].reward + "</td><td>"+ scores[0].reward +"</td></tr>" +
									"<tr><td><strong>Wins Immunity</strong></td><td>" + responses[i].immunity + "</td><td>"+ scores[0].immunity +"</td></tr>" +
									"<tr><td><strong>Eliminated</strong></td><td>" + responses[i].eliminated + "</td><td>"+ scores[0].eliminated +"</td></tr>" +
									"<tr><td><strong>Safe</strong></td><td>" + responses[i].safe + "</td><td>"+ scores[0].safe +"</td></tr>" +
									"<tr><td><strong>Returns to Game</strong></td><td>" + responses[i].returns + "</td><td>"+ scores[0].returns +"</td></tr>" +
									"<tr><td><strong>Title Quote</strong></td><td>" + responses[i].titleQuote + "</td><td>"+ scores[0].titleQuote +"</td></tr>" +
									"<tr><td><strong>Nudity?</strong></td><td>" + responses[i].nudity + "</td><td>"+ scores[0].nudity +"</td></tr>" +
									"<tr><td><strong>Idol or Secret Advantage Found?</strong></td><td>" + responses[i].idolFound + "</td><td>"+ scores[0].idolFound +"</td></tr>" +
									"<tr><td><strong>Idol or Secret Advantage Played?</strong></td><td>" + responses[i].idolPlayed + "</td><td>"+ scores[0].idolPlayed +"</td></tr>" + 
									"<tr><td><strong>Will someone quit from Extinction Island?</strong></td><td>" + responses[i].quitExIsland + "</td><td>"+ scores[0].quitExIsland +"</td></tr>"
								);
							} else if (curVote === 8) {
								$("#week_"+String(i)).html("Vote #"+String(cur_vote));
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
									"<tr><td><strong>Will someone quit from Extinction Island?</strong></td><td>" + responses[i].quitExIsland + "</td><td>"+ scores[0].quitExIsland +"</td></tr>" + 
									"<tr><td><strong>Who will pass out during the challenge?</strong></td><td>" + responses[i].feint_vote8 + "</td><td>"+ scores[0].feint_vote8 +"</td></tr>"
								);
							} else if (curVote === 11) {
								$("#week_"+String(i)).html("Vote #"+String(cur_vote));
								$("#json_"+String(i)).html(
									"<tr><th>Question</th><th>Response</th><th>Points Earned</th></tr>" +
									"<tr><td><strong>Wins Immunity</strong></td><td>" + responses[i].immunity + "</td><td>"+ scores[0].immunity +"</td></tr>" +
									"<tr><td><strong>Eliminated</strong></td><td>" + responses[i].eliminated + "</td><td>"+ scores[0].eliminated +"</td></tr>" +
									"<tr><td><strong>Safe</strong></td><td>" + responses[i].safe + "</td><td>"+ scores[0].safe +"</td></tr>" +
									"<tr><td><strong>Idol or Secret Advantage Played?</strong></td><td>" + responses[i].idolPlayed + "</td><td>"+ scores[0].idolPlayed +"</td></tr>"
								);
							} else if (curVote === 13 || curVote === 14) {
								$("#week_"+String(i)).html("Vote #"+String(cur_vote));
								$("#json_"+String(i)).html(
									"<tr><th>Question</th><th>Response</th><th>Points Earned</th></tr>" +
									"<tr><td><strong>Wins Reward Challenge</strong></td><td>" + responses[i].reward + "</td><td>"+ scores[0].reward +"</td></tr>" +
									"<tr><td><strong>Wins Immunity</strong></td><td>" + responses[i].immunity + "</td><td>"+ scores[0].immunity +"</td></tr>" +
									"<tr><td><strong>Title Quote</strong></td><td>" + responses[i].titleQuote + "</td><td>"+ scores[0].titleQuote +"</td></tr>" +
									"<tr><td><strong>Nudity?</strong></td><td>" + responses[i].nudity + "</td><td>"+ scores[0].nudity +"</td></tr>" +
									"<tr><td><strong>Idol or Secret Advantage Found?</strong></td><td>" + responses[i].idolFound + "</td><td>"+ scores[0].idolFound +"</td></tr>" +
									"<tr><td><strong>Idol or Secret Advantage Played?</strong></td><td>" + responses[i].idolPlayed + "</td><td>"+ scores[0].idolPlayed +"</td></tr>" + 
									"<tr><td><strong>Will someone quit from Extinction Island?</strong></td><td>" + responses[i].quitExIsland + "</td><td>"+ scores[0].quitExIsland +"</td></tr>"
								);
							} else if (cur_vote === 15) {
								$("#week_"+String(i)).html("Finale");
								$("#json_"+String(i)).html(
									"<tr><th>Question</th><th>Response</th><th>Points Earned</th></tr>" +
									"<tr><td><strong>Wins Reward Challenge</strong></td><td>" + responses[i].reward + "</td><td>"+ scores[0].reward +"</td></tr>" +
									"<tr><td><strong>Wins Immunity</strong></td><td>" + responses[i].immunity + "</td><td>"+ scores[0].immunity +"</td></tr>" +
									"<tr><td><strong>Wins Fire Making Challenge</strong></td><td>" + responses[i].fireChallenge + "</td><td>"+ scores[0].fireChallenge +"</td></tr>" +
									"<tr><td><strong>Title Quote</strong></td><td>" + responses[i].titleQuote + "</td><td>"+ scores[0].titleQuote +"</td></tr>" +
									"<tr><td><strong>Nudity?</strong></td><td>" + responses[i].nudity + "</td><td>"+ scores[0].nudity +"</td></tr>" +
									"<tr><td><strong>Idol or Secret Advantage Found?</strong></td><td>" + responses[i].idolFound + "</td><td>"+ scores[0].idolFound +"</td></tr>" +
									"<tr><td><strong>Idol or Secret Advantage Played?</strong></td><td>" + responses[i].idolPlayed + "</td><td>"+ scores[0].idolPlayed +"</td></tr>" + 
									"<tr><td><strong>Will someone quit from Extinction Island?</strong></td><td>" + responses[i].quitExIsland + "</td><td>"+ scores[0].quitExIsland +"</td></tr>"
								);
							} else {
								$("#week_"+String(i)).html("Vote #"+String(cur_vote));
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
									"<tr><td><strong>Will someone quit from Extinction Island?</strong></td><td>" + responses[i].quitExIsland + "</td><td>"+ scores[0].quitExIsland +"</td></tr>"
								);
							};
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
            url: "https://api.github.com/repos/ethanebinger/Fantasy-Survivor/contents/docs/EdgeofExtinction/EdgeofExtinction_Responses.json",
			//url: "https://api.github.com/repos/ethanebinger/Fantasy-Survivor/contents/docs/EdgeofExtinction/FinalEightOrder.json",
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
						var cur_vote = determineWeek(finalEight[j]);
                        if (cur_vote === 13) {	// only submited responses to this question during week 13
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
                };
                ifEmptyHTML();
            }
        });
    };
    //*/
    
    function getFinalThree(curName) {
        $.ajax({
            type: "GET",
            url: "https://api.github.com/repos/ethanebinger/Fantasy-Survivor/contents/docs/EdgeofExtinction/EdgeofExtinction_Responses.json",
			//url: "https://api.github.com/repos/ethanebinger/Fantasy-Survivor/contents/docs/EdgeofExtinction/FinalThreePicks.json",
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
						var cur_vote = determineWeek(finalThree[j]);
                        if (cur_vote === 1) {	// only submited responses to this question during week 1
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
                };
                ifEmptyHTML();
            }
        });
    };
    //*/
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
    $('#PastResponses').click(function() {
        window.location = "http://ethanebinger.com/Fantasy-Survivor/EdgeofExtinction/responses.html";
    });
    
    // Define temp data
    var scores = [];
    var players = [
        'Walter', 
        'Vivian',
        'Mitch', 
        'Lucas', 
        'Josh', 
        'Ezra', 
        'Ethan', 
        'Emily', 
        'David',
        'Colin', 
        'Ben', 
        'Anastassia', 
        'Aaron'
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
            'Final Eight': 0,
            'Final Three': 0
        });
    };

    // Create arrays for players, keys (votes)
    //var players = scores.map(function(d) { return d.name; });
    var keys = Object.keys(scores[0]).splice(2,)

    // Define chart elements
    var margin = {top: 20, right: 20, bottom: 30, left: 80},
        width = $('.graph').width() - margin.left - margin.right,
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
                    "<br><span>Weekly Score = " + parseFloat(d[1]-d[0]).toFixed(1) + "</span>" +
                    "<br><span>Total Score = " + parseFloat(d.data.total).toFixed(1) + "</span>"
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
        $.get("https://api.github.com/repos/ethanebinger/Fantasy-Survivor/contents/docs/EdgeofExtinction/EdgeofExtinction_Responses.json", function(result) {
            responses = JSON.parse(atob(result.content));
        }),
        // Get the Final Eight Responses 
        /*
        $.get("https://api.github.com/repos/ethanebinger/Fantasy-Survivor/contents/docs/EdgeofExtinction/FinalEightOrder.json", function(result) {
            final8 = JSON.parse(atob(result.content));
        }),
        //*/
        // Get the Final Three Responses 
		/*
        $.get("https://api.github.com/repos/ethanebinger/Fantasy-Survivor/contents/docs/EdgeofExtinction/FinalThreePicks.json", function(result) {
            final3 = JSON.parse(atob(result.content));
        })
        //*/
    ).then(function() {
        var BREAK01 = 'break';
        scores = calculateScores(scores, results, responses, null);
        //var BREAK02 = 'break';
        //scores = final_eight_calc(scores, final8);
        //var BREAK03 = 'break';
		//scores = final_three_calc(scores, final3);
		//var BREAK04 = 'break';
		
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
function determineWeek(responses) {
    var cur_vote = 0;
    var submit_time = new Date(responses.submit_time);
    if (submit_time <= new Date(2019,1,20,20)) {
        cur_vote = 1;
    } else if (submit_time <= new Date(2019,1,27,20)) {
        cur_vote = 2;
    } else if (submit_time <= new Date(2019,2,6,20)) {
        cur_vote = 3;
    } else if (submit_time <= new Date(2019,2,13,20)) {
        cur_vote = 4;
    } else if (submit_time <= new Date(2019,2,20,20)) {
        cur_vote = 5;
    } else if (submit_time <= new Date(2019,2,21,20)) {
        cur_vote = 6;
    } else if (submit_time <= new Date(2019,2,27,20)) {
        cur_vote = 7;
    } else if (submit_time <= new Date(2019,3,3,20)) {
        cur_vote = 8;
    } else if (submit_time <= new Date(2019,3,10,20)) {
        cur_vote = 9;
	} else if (submit_time <= new Date(2019,3,17,20)) {
        cur_vote = 10;
    } else if (submit_time <= new Date(2019,3,18,20)) {
        cur_vote = 11;
    } else if (submit_time <= new Date(2019,3,24,20)) {
        cur_vote = 12;
    } else if (submit_time <= new Date(2019,4,1,20)) {
        cur_vote = 13;
    } else if (submit_time <= new Date(2019,4,8,20)) {
        cur_vote = 14;
    };
    return cur_vote;
};

// FUNCTION TO CALCULATE SCORES
function calculateScores(scores, results, responses, calcType) {
    var name_ep_count = [0];
    for (var n=0; n<scores.length; n++) {
        var cur_player = scores[n].name;
        for (var i=0; i<results.length; i++) {
            var team_yellow = results[i].team_yellow;
            var team_blue = results[i].team_blue;
			var team_green = results[i].team_green;
            for (var j=0; j<responses.length; j++) {
                // Validate Player
                if (responses[j].name === cur_player) {
                    // Determine Vote Number/Week (and ignore late sumissions)
                    var cur_vote = determineWeek(responses[j]);
                    // Validate Vote Number/Week
                    if (results[i].vote === cur_vote) {
                        var val_vote = 'Vote ' + String(results[i].vote);
                        // Determine by team if before merge but no swap:
                        if (results[i].merge === 'Yes' /*|| results[i].merge === 'Swap'*/) {
                            // Reward
                            if (results[i].reward == responses[j].reward && responses[j].reward) {
                                if (calcType === "individual") { scores[n].reward += 10; }
                                else { scores[n][val_vote] += 10; };
                                scores[n].total += 10;
                            } else if (results[i].reward !== null && typeof results[i].reward==="object" && inArray(responses[j].reward,results[i].reward) && responses[j].reward) {
                                if (calcType === "individual") { scores[n].reward += 5; }
                                else { scores[n][val_vote] += 5; };
                                scores[n].total += 5;
                            };
                            // Immunity
                            if (results[i].immunity == responses[j].immunity && responses[j].immunity) {
                                if (calcType === "individual") { scores[n].immunity += 15; }
                                else { scores[n][val_vote] += 15; };
                                scores[n].total += 15;
                            };
                            // Eliminated
                            if (results[i].eliminated == responses[j].eliminated && responses[j].eliminated) {
                                if (calcType === "individual") { scores[n].eliminated += 20; }
                                else { scores[n][val_vote] += 20; };
                                scores[n].total += 20;
                            };
                            // Safe
                            if (results[i].eliminated !== responses[j].safe && responses[j].safe) {
                                if (calcType === "individual") { scores[n].safe += 10; }
                                else { scores[n][val_vote] += 10; };
                                scores[n].total += 10;
                            };
                            // Title Quote
                            if (results[i].titleQuote == responses[j].titleQuote && responses[j].titleQuote) {
                                if (calcType === "individual") { scores[n].titleQuote += 4; }
                                else { scores[n][val_vote] += 4; };
                                scores[n].total += 4;
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
							// Will someone quit the game from Extinction Island this week?
                            if (results[i].quitExIsland == responses[j].quitExIsland && responses[j].quitExIsland) {
                                if (calcType === "individual") { scores[n].quitExIsland += 4; }
                                else { scores[n][val_vote] += 4; };
                                scores[n].total += 4;
                            };
							// Will someone return to the game from Extinction Island this week?
                            if (results[i].returns == responses[j].returns && responses[j].returns) {
                                if (calcType === "individual") { scores[n].returns += 5; }
                                else { scores[n][val_vote] += 5; };
                                scores[n].total += 5;
                            };
							// Who passes out during the challenge during the 4/3/19 episode?
                            if (results[i].feint_vote8 == responses[j].feint_vote8 && responses[j].feint_vote8) {
                                if (calcType === "individual") { scores[n].feint_vote8 += 2; }
                                else { scores[n][val_vote] += 2; };
                                scores[n].total += 2;
                            };
                            name_ep_count.push(cur_player+"_"+String(cur_vote));
                            console.log(responses[j].name, val_vote, scores[n][val_vote]);
                        } 
						else {
                            // Reward
                            if ((results[i].reward === 'team_yellow' || results[i].reward2 === 'team_yellow') && inArray(responses[j].reward, team_yellow) && responses[j].reward) {
                                if (calcType === "individual") { scores[n].reward += 5; }
                                else { scores[n][val_vote] += 5; }
                                scores[n].total += 5;
                            } else if ((results[i].reward === 'team_blue' || results[i].reward2 === 'team_blue') && inArray(responses[j].reward, team_blue) && responses[j].reward) {
                                if (calcType === "individual") { scores[n].reward += 5; }
                                else { scores[n][val_vote] += 5; };
                                scores[n].total += 5;
                            } else if ((results[i].reward === 'team_green' || results[i].reward2 === 'team_green') && inArray(responses[j].reward, team_green) && responses[j].reward) {
                                if (calcType === "individual") { scores[n].reward += 5; }
                                else { scores[n][val_vote] += 5; };
                                scores[n].total += 5;
                            };
                            // Immunity
                            if ((results[i].immunity === 'team_yellow' || results[i].immunity2 === 'team_yellow') && inArray(responses[j].immunity, team_yellow) && responses[j].immunity) {
                                if (calcType === "individual") { scores[n].immunity += 5; }
                                else { scores[n][val_vote] += 5; };
                                scores[n].total += 5;
                            } else if ((results[i].immunity === 'team_blue' || results[i].immunity2 === 'team_blue')  && inArray(responses[j].immunity, team_blue) && responses[j].immunity) {
                                if (calcType === "individual") { scores[n].immunity += 5; }
                                else { scores[n][val_vote] += 5; };
                                scores[n].total += 5;
                            } else if ((results[i].immunity === 'team_green' || results[i].immunity2 === 'team_green')  && inArray(responses[j].immunity, team_green) && responses[j].immunity) {
                                if (calcType === "individual") { scores[n].immunity += 5; }
                                else { scores[n][val_vote] += 5; };
                                scores[n].total += 5;
                            };
                            // Eliminated
                            if (results[i].eliminated == responses[j].eliminated && responses[j].eliminated) {
                                if (calcType === "individual") { scores[n].eliminated += 10; }
                                else { scores[n][val_vote] += 10; };
                                scores[n].total += 10;
                            };
                            // Safe
							if (results[i].eliminated !== responses[j].safe && responses[j].safe) {
								// Aubry voted out ep5 but available for vote ep6 --> skip
                                if (cur_vote === 6 && responses[j].safe === 'Aubry') {
									console.log("RIP Aubry - Vote 6 - " + cur_player);
								} else {
								// all other scenarios give points
									if (calcType === "individual") { scores[n].safe += 5; }
									else { scores[n][val_vote] += 5; };
									scores[n].total += 5;
								};
                            };
                            // Title Quote
                            if (results[i].titleQuote == responses[j].titleQuote && responses[j].titleQuote) {
                                if (calcType === "individual") { scores[n].titleQuote += 2; }
                                else { scores[n][val_vote] += 2; };
                                scores[n].total += 2;
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
							// Will someone quit the game from Extinction Island this week?
                            if (results[i].quitExIsland == responses[j].quitExIsland && responses[j].quitExIsland) {
                                if (calcType === "individual") { scores[n].quitExIsland += 2; }
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
				var cur_vote = determineWeek(result[i]);
                if (cur_vote === 13) {	// only submited responses to this question during week 13
					var score8 = which_castaway(result[i]);
					scores[n]['Final Eight'] += score8;
					scores[n].total += score8;
				};
            };
        };
    };
    function which_castaway(castaways){
        var sum = 0,
			bonus = 0;
        for (var i=1; i<9; i++){
            if (castaways['place_'+String([i])] === "") {			// sole survivor
                sum += Math.pow(Math.abs(i-1),2.25);
				if (i===1) { bonus += 5 };
            } else if (castaways['place_'+String([i])] === "") {	// runner up
                sum += Math.pow(Math.abs(i-2),2.25);
				if (i===1) { bonus += 5 };
            } else if (castaways['place_'+String([i])] === "") {	// third
                sum += Math.pow(Math.abs(i-3),2.25);
				if (i===1) { bonus += 5 };
            } else if (castaways['place_'+String([i])] === "") {	// fourth
                sum += Math.pow(Math.abs(i-4),2.25);
				if (i===1) { bonus += 5 };
            } else if (castaways['place_'+String([i])] === "") {	// fifth
                sum += Math.pow(Math.abs(i-5),2.25);
				if (i===1) { bonus += 5 };
            } else if (castaways['place_'+String([i])] === "") {	// sixth
                sum += Math.pow(Math.abs(i-6),2.25);
				if (i===1) { bonus += 5 };
            } else if (castaways['place_'+String([i])] === "") {	// seventh
                sum += Math.pow(Math.abs(i-7),2.25);
				if (i===1) { bonus += 5 };
            } else if (castaways['place_'+String([i])] === "") {	// eighth
                sum += Math.pow(Math.abs(i-8),2.25);
				if (i===1) { bonus += 5 };
            };
        };
        var score = 100 - (0.75 * sum) + bonus;
		if (score < 0) { score = 0 };
        return (score);
    };
    return (scores);
};
//*/

// FUNCTION TO CALCULATE SCORES FOR FINAL THREE

function final_three_calc(scores, result) {
    var top_three = ["", "", ""];									//top three!
	for (var n=0; n<scores.length; n++) {
        for (var i=0; i<result.length; i++) {
            var cur_vote = determineWeek(result[i]);
			if (cur_vote === 1) {	// only submited responses to this question during week 1
				if ((result[i].name === scores[n].name) && (inArray(result[i].pick_1, top_three))){
					scores[n]['Final Three'] += 20;
					scores[n].total += 20;
				};
				if ((result[i].name === scores[n].name) && (inArray(result[i].pick_2, top_three))){
					scores[n]['Final Three'] += 20;
					scores[n].total += 20;
				};
				if ((result[i].name === scores[n].name) && (inArray(result[i].pick_3, top_three))){
					scores[n]['Final Three'] += 20;
					scores[n].total += 20;
				};
			};
        };
    };
    return (scores);
};
//*/

var results = [
    {	'vote': 1,
        'date': '2/20/19',
        'merge': 'No',
        'reward': 'team_yellow', 
        'immunity': 'team_yellow', 
        'eliminated': 'Reem',
        'idolFound': 'Yes',
        'idolPlayed': 'No',
        'titleQuote': 'Joe',
        'nudity': 'No',
		'JeffSays': 3,
        'team_yellow': [
            'Aubry',
			'Aurora',
			'Eric',
			'Gavin',
			'Joe',
			'Julia',
			'Julie',
			'Ron',
			'Victoria'
        ],
        'team_blue': [
            'Chris',
			'Wardog',
			'David',
			'Keith',
			'Kelley',
			'Lauren',
			'Reem',
			'Rick',
			'Wendy'
        ]
    },
	{	'vote': 2,
        'date': '2/27/19',
        'merge': 'No',
        'reward': 'team_yellow', 
        'immunity': 'team_yellow', 
        'eliminated': 'Keith',
        'idolFound': 'Yes',
        'idolPlayed': 'No',
        'titleQuote': 'Kelley',
        'nudity': 'No',
        'team_yellow': [
            'Aubry',
			'Aurora',
			'Eric',
			'Gavin',
			'Joe',
			'Julia',
			'Julie',
			'Ron',
			'Victoria'
        ],
        'team_blue': [
            'Chris',
			'Wardog',
			'David',
			'Keith',
			'Kelley',
			'Lauren',
			'Rick',
			'Wendy'
        ]
    },
	{	'vote': 3,
        'date': '3/6/19',
        'merge': 'No',
        'reward': 'team_blue', 
        'immunity': 'team_yellow', 
        'eliminated': 'Chris',
        'idolFound': 'Yes',
        'idolPlayed': 'No',
        'titleQuote': 'David',
        'nudity': 'No',
        'team_yellow': [
            'Aubry',
			'Aurora',
			'Eric',
			'Gavin',
			'Joe',
			'Julia',
			'Julie',
			'Ron',
			'Victoria'
        ],
        'team_blue': [
            'Chris',
			'Wardog',
			'David',
			'Kelley',
			'Lauren',
			'Rick',
			'Wendy'
        ]
    },
	{	'vote': 4,
        'date': '3/13/19',
        'merge': 'No',
        'reward': null,
        'immunity': 'team_yellow', 
		'immunity2': 'team_blue',
        'eliminated': 'Rick',
        'idolFound': 'No',
        'idolPlayed': 'No',
        'titleQuote': 'Wardog',
        'nudity': 'No',
        'team_yellow': [
            'Ron',
			'Aurora',
			'Joe',
			'Julia',
			'Julie'
        ],
        'team_blue': [
			'Wendy',
			'Victoria',
			'Eric',
			'Gavin',
			'Aubry'
        ],
		'team_green': [
			'Rick',
			'Wardog',
			'David',
			'Kelley',
			'Lauren'
		]
    },
	{	'vote': 5,
        'date': '3/20/19',
        'merge': 'No',
        'reward': 'team_yellow', 
		'reward2': 'team_blue',
        'immunity': 'team_yellow', 
		'immunity2': 'team_green',
        'eliminated': 'Aubry',
        'idolFound': 'Yes',
        'idolPlayed': 'No',
        'titleQuote': null,
        'nudity': 'Yes',
		'quitExIsland': 'No',
        'team_yellow': [
            'Ron',
			'Aurora',
			'Joe',
			'Julia',
			'Julie'
        ],
        'team_blue': [
			'Wendy',
			'Victoria',
			'Eric',
			'Gavin',
			'Aubry'
        ],
		'team_green': [
			'Wardog',
			'David',
			'Kelley',
			'Lauren'
		]
    },
	{	'vote': 6,
        'date': '3/21/19',
        'merge': 'No',
        'reward': 'team_yellow', 
		'reward2': 'team_blue',
        'immunity': 'team_yellow',
        'eliminated': 'Wendy',
        'idolFound': 'Yes',
        'idolPlayed': 'No',
        'titleQuote': 'David',
        'nudity': 'No',
		'quitExIsland': 'No',
        'team_yellow': [
            'Ron',
			'Aurora',
			'Joe',
			'Julia',
			'Julie'
        ],
        'team_blue': [
			'Wendy',
			'Victoria',
			'Eric',
			'Gavin'
        ],
		'team_green': [
			'Wardog',
			'David',
			'Kelley',
			'Lauren'
		]
    },
	{	'vote': 7,
        'date': '3/27/19',
        'merge': 'Yes',
        'reward': null,
        'immunity': 'Julie',
        'eliminated': 'Joe',
        'idolFound': 'Yes',
        'idolPlayed': 'No',
        'titleQuote': 'Ron',
        'nudity': 'No',
		'returns': 'Rick',
		'quitExIsland': 'Yes'
    },
	{	'vote': 8,
        'date': '4/3/19',
        'merge': 'Yes',
        'reward': ['Eric', 'Wardog', 'Victoria', 'Julia', 'Aurora', 'Rick'],
        'immunity': 'Aurora',
        'eliminated': 'Eric',
        'idolFound': 'Yes',
        'idolPlayed': 'No',
        'titleQuote': 'Ron',
        'nudity': 'No',
		'feint_vote8': 'Lauren',
		'quitExIsland': 'No'
    },
	{	'vote': 9,
        'date': '4/10/19',
        'merge': 'Yes',
        'reward': null,
        'immunity': 'Gavin',
        'eliminated': 'Julia',
        'idolFound': 'No',
        'idolPlayed': 'Yes',
        'titleQuote': 'Kelley',
        'nudity': 'No',
		'quitExIsland': 'No'
    },
	{	'vote': 10,
        'date': '4/17/19',
        'merge': 'Yes',
        'reward': null,
        'immunity': 'Aurora',
        'eliminated': 'David',
        'idolFound': 'Yes',
        'idolPlayed': 'No',
        'titleQuote': 'Ron',
        'nudity': 'No',
		'quitExIsland': 'No'
    },
	{	'vote': 11,
        'date': '4/17/19',
        'merge': 'Yes',
        'reward': null,
        'immunity': 'Rick',
        'eliminated': 'Kelley',
        'idolFound': null,
        'idolPlayed': 'No',
        'titleQuote': null,
        'nudity': null,
		'quitExIsland': null
    },
	{	'vote': 12,
        'date': '4/24/19',
        'merge': 'Yes',
        'reward': ['Wardog', 'Lauren', 'Rick', 'Julie'],
        'immunity': 'Rick',
        'eliminated': 'Wardog',
        'idolFound': 'No',
        'idolPlayed': 'No',
        'titleQuote': 'Joe',
        'nudity': 'No',
		'quitExIsland': 'No'
    }
];
