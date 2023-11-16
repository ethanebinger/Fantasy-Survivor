function init() {
    // Move past hero page and enter form on click
    $('#enterBtn').click(function(e) {
		window.location = "https://forms.gle/qo7zAxLx1kZ9B7HK9";
		//$('.title_img').addClass('isHidden');
        //$('#survivor_form').removeClass('isHidden');
        //$('#advance_form').removeClass('isHidden');
    });
    
	// Move past hero page and go to results on click
	$('#resultsBtn').click(function(e) {
		window.location = "results.html";
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
		if (x[n]) {
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
		};
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
        url: "https://api.github.com/repos/ethanebinger/Fantasy-Survivor/contents/docs/Season45/Season45_Responses.json",
        dataType: "json",
        success: function(result) {
            // PULL existing data (saved in 'responses' object)
            var x = result.content;
            var existing_responses = atob(x);
            var responses = JSON.parse(existing_responses);
            // PUSH new data (only following index.html submission)
            responses.push(form_results);
            var responses_str = JSON.stringify(responses);
			// make sure to follow oauth steps here: https://docs.github.com/en/developers/apps/building-oauth-apps/authorizing-oauth-apps
            // var token = "Z2hvX0g3dllhbmlNclZ4cnJXS05pd0FLYkhROWNEaWwzMzJSSnRJcQ==",
			var token = "YmI2YWQ4NjJjOWExZTVlZGYwNjUzNmU1NzhjZGM2MDVjMTVmOTMzZQ==",
			//var token = "Z2l0aHViX3BhdF8xMUFGSVZIVUEwSGpGclUzMWNIRnFqX1BQTTgxMXN4WEZVbjR3bmV2OURVRXZGMU5ieTJrTEZuclZzUUc2cG52b3g0Q0dQWU9aS0Q5QmhDRnBZ",
                username = 'ethanebinger',
                reponame = 'Fantasy-Survivor';
            var push_user = form_results.name;
			// method from: https://gist.github.com/iktash/31ccc1d8582bd9dcb15ee468c7326f2d
            let api = new GithubAPI({token: atob(token)});
            api.setRepo(username, reponame);
            api.setBranch('master')
                .then( () => api.pushFiles(
                    'new input from '+push_user,
                    [{
                        content: responses_str, 
                        path: 'docs/Season45/Season45_Responses.json'
                    }]
                ))
                .then(function() {
                    console.log('Files committed!');
                    window.location = "http://ethanebinger.com/Fantasy-Survivor/Season45/results.html"
                });
		}
	});
};

function getPastResponses() {
    $('#resultsBtn').click(function(e) {
		window.location = "results.html";
    });
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
            getWeeklyResults(curName, curVote);
        };
    });
};

function getWeeklyResults(curName, curVote) {
	// Clear existing html
	$("#past_responses").empty();
	
	// Parse data into readable json
	var responses = saved_responses;
	
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
			'summit': 0,
			'nudity': 0,
			'idolFound': 0,
			'idolPlayed': 0,
			'immunity1': 0,
			'immunity2': 0,
			'immunity3': 0,
			'edgeReturn': 0,
			'immunity_5': 0,
			'immunity_4': 0,
			'fireChallenge': 0,
			'hourglass': 0,
			'shotInTheDark':0
		}
	];
	
	// Filter for only selected name and vote, then add html to page
	// Looping backwards to select most recent submission, then break on success
	for (var i=responses.length-1; i>=0; i--) {
		if (responses[i].name === curName) {
			var cur_vote = determineWeek(responses[i]);
			if (curVote == cur_vote) {
				for (var j=0; j<results.length; j++) {
					scores = calculateScores(scores, [results[j]], [responses[i]], "individual");
				};
				$("#past_responses").append("<h3 id='week_"+String(i)+"'></h3>");
				$("#past_responses").append("<span id='json_"+String(i)+"'></span>");
				if (cur_vote == 13) {
					$("#week_"+String(i)).html("Finale");
					$("#json_"+String(i)).html(
						"<tr><th>Question</th><th>Response</th><th>Points Earned</th></tr>" +
						"<tr><td><strong>Wins Reward Challenge</strong></td><td>" + responses[i].reward + "</td><td>"+ scores[0].reward +"</td></tr>" +
						"<tr><td><strong>Wins 1st Immunity Challenge</strong></td><td>" + responses[i].immunity_5 + "</td><td>"+ scores[0].immunity_5 +"</td></tr>" +
						"<tr><td><strong>Wins 2nd Immunity Challenge</strong></td><td>" + responses[i].immunity_4 + "</td><td>"+ scores[0].immunity_4 +"</td></tr>" +
						"<tr><td><strong>Wins Fire Making Challenge</strong></td><td>" + responses[i].fireChallenge + "</td><td>"+ scores[0].fireChallenge +"</td></tr>" +
						"<tr><td><strong>Title Quote</strong></td><td>" + responses[i].titleQuote + "</td><td>"+ scores[0].titleQuote +"</td></tr>" +
						"<tr><td><strong>Nudity</strong></td><td>" + responses[i].nudity + "</td><td>"+ scores[0].nudity +"</td></tr>" +
						"<tr><td><strong>Idol or Advantage Found</strong></td><td>" + responses[i].idolFound + "</td><td>"+ scores[0].idolFound +"</td></tr>" +
						"<tr><td><strong>Idol or Advantage Played</strong></td><td>" + responses[i].idolPlayed + "</td><td>"+ scores[0].idolPlayed +"</td></tr>"
					);
				} else if (cur_vote >= 10) {
					$("#week_"+String(i)).html("Episode #"+String(cur_vote));
					$("#json_"+String(i)).html(
						"<tr><th>Question</th><th>Response</th><th>Points Earned</th></tr>" +
						"<tr><td><strong>Wins Reward Challenge</strong></td><td>" + responses[i].reward + "</td><td>"+ scores[0].reward +"</td></tr>" +
						"<tr><td><strong>Wins Immunity</strong></td><td>" + responses[i].immunity + "</td><td>"+ scores[0].immunity +"</td></tr>" +
						"<tr><td><strong>Title Quote</strong></td><td>" + responses[i].titleQuote + "</td><td>"+ scores[0].titleQuote +"</td></tr>" +
						"<tr><td><strong>Goes on Journey</strong></td><td>" + responses[i].summit + "</td><td>"+ scores[0].summit +"</td></tr>" +
						"<tr><td><strong>Nudity</strong></td><td>" + responses[i].nudity + "</td><td>"+ scores[0].nudity +"</td></tr>" +
						"<tr><td><strong>Idol or Advantage Found</strong></td><td>" + responses[i].idolFound + "</td><td>"+ scores[0].idolFound +"</td></tr>" +
						"<tr><td><strong>Idol or Advantage Played</strong></td><td>" + responses[i].idolPlayed + "</td><td>"+ scores[0].idolPlayed +"</td></tr>" +
						"<tr><td><strong>Shot-in-the-Dark Played</strong></td><td>" + responses[i].shotInTheDark + "</td><td>"+ scores[0].shotInTheDark +"</td></tr>"
					);
				} else {
					$("#week_"+String(i)).html("Episode #"+String(cur_vote));
					$("#json_"+String(i)).html(
						"<tr><th>Question</th><th>Response</th><th>Points Earned</th></tr>" +
						"<tr><td><strong>Wins Reward Challenge</strong></td><td>" + responses[i].reward + "</td><td>"+ scores[0].reward +"</td></tr>" +
						"<tr><td><strong>Wins Immunity</strong></td><td>" + responses[i].immunity + "</td><td>"+ scores[0].immunity +"</td></tr>" +
						"<tr><td><strong>Eliminated</strong></td><td>" + responses[i].eliminated + "</td><td>"+ scores[0].eliminated +"</td></tr>" +
						"<tr><td><strong>Safe</strong></td><td>" + responses[i].safe + "</td><td>"+ scores[0].safe +"</td></tr>" +
						"<tr><td><strong>Title Quote</strong></td><td>" + responses[i].titleQuote + "</td><td>"+ scores[0].titleQuote +"</td></tr>" +
						"<tr><td><strong>Goes on Journey</strong></td><td>" + responses[i].summit + "</td><td>"+ scores[0].summit +"</td></tr>" +
						"<tr><td><strong>Nudity</strong></td><td>" + responses[i].nudity + "</td><td>"+ scores[0].nudity +"</td></tr>" +
						"<tr><td><strong>Idol or Advantage Found</strong></td><td>" + responses[i].idolFound + "</td><td>"+ scores[0].idolFound +"</td></tr>" +
						"<tr><td><strong>Idol or Advantage Played</strong></td><td>" + responses[i].idolPlayed + "</td><td>"+ scores[0].idolPlayed +"</td></tr>" +
						"<tr><td><strong>Shot-in-the-Dark Played</strong></td><td>" + responses[i].shotInTheDark + "</td><td>"+ scores[0].shotInTheDark +"</td></tr>"
					);
				};
			break;
			};
		};
	};
	ifEmptyHTML();
};
    
function getFinalEight(curName) {
	// Clear existing html
	$("#past_responses").empty();
	
	// Parse data into readable json
	var finalEight = saved_responses;

	// Create table displaying data in order
	var curName = $("#past_responses_name option:selected").val();
	for (var j=0; j<finalEight.length; j++) {
		if (finalEight[j].name === curName) {
			var cur_vote = determineWeek(finalEight[j]);
			if (cur_vote === 10) {	// only submited responses to this question for episode 10
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
};
    
function getFinalThree(curName) {
	// Clear existing html
	$("#past_responses").empty();
	
	// Parse data into readable json
	var finalThree = saved_responses;

	// Create table displaying data in order
	var curName = $("#past_responses_name option:selected").val();
	for (var j=0; j<finalThree.length; j++) {
		if (finalThree[j].name === curName) {
			var cur_vote = determineWeek(finalThree[j]);
			if (cur_vote === 2) {	// submited responses to this question during episode 2
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
};
    
function ifEmptyHTML() {
	var html_length = $("#past_responses").children().length;
	if (html_length === 0) {
		$("#past_responses").append(
			"<h3></h3><span>Nothing submitted in this category, please select again.</span>"
		);
	};
};

function init_chart() {
    $('#PastResponses').click(function() {
        window.location = "responses.html";
    });
	$('#LandingPage').click(function() {
        window.location = "index.html";
    });
    
	// Function to get players
	function getActivePlayers(r) {
		var players = [];
		var i;
		for (i=0; i < r.length; i++) {
			players.push(r[i].name)
		};
		function onlyUnique(value, index, self) {
			return self.indexOf(value) === index;
		}
		var players = players.filter(onlyUnique).sort().reverse();
		return players;
	};
	
	// Function to create score array from players
	function createScoreArray(players) {
		var scores = [];
		for (var p=0; p<players.length; p++) {
			scores.push({
				'name': players[p], 
				'total': 0, 
				'Episode 1': 0, 
				'Episode 2': 0,
				'Episode 3': 0,
				'Episode 4': 0,
				'Episode 5': 0,
				'Episode 6': 0,
				'Episode 7': 0,
				'Episode 8': 0,
				'Episode 9': 0,
				'Episode 10': 0,
				'Episode 11': 0,
				'Episode 12': 0,
				'Episode 13': 0,
				'Final Eight': 0,
				'Final Three': 0
			});
		};
		return scores;
	};
	

    // Calculate scores
	var responses = saved_responses;
	
	// Create an array of active players from the people who have submitted a response
	players = getActivePlayers(responses);
	scores = createScoreArray(players);
	
	// Calculate scores
	scores = calculateScores(scores, results, responses, null);
	scores = final_eight_calc(scores, responses);
	scores = final_three_calc(scores, responses);

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

// Function to check if x in array y
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
	// datetime constructor: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/Date
    if (submit_time <= new Date(2023,9,2,0)) { // Sep 27, 2023
        cur_vote = 1;
    }
	else if (submit_time <= new Date(2023,9,9,0)) { // Oct 4, 2023
        cur_vote = 2;
    }
	else if (submit_time <= new Date(2023,9,16,0)) { // Oct 11, 2023
        cur_vote = 3;
    }
	else if (submit_time <= new Date(2023,9,23,0)) { // Oct 18, 2023
        cur_vote = 4;
    }
	else if (submit_time <= new Date(2023,9,30,0)) { // Oct 25, 2023
        cur_vote = 5;
    }
	else if (submit_time <= new Date(2023,10,6,0)) { // Nov 1, 2023
        cur_vote = 6;
    }
	else if (submit_time <= new Date(2023,10,13,0)) { // Nov 8, 2023
        cur_vote = 7;
    }
	else if (submit_time <= new Date(2023,10,20,0)) { // Nov 15, 2023
        cur_vote = 8;
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
			var team_red = results[i].team_red;
			var swapped_ep_4 = results[i].team_swap_win;
            for (var j=0; j<responses.length; j++) {
                // Validate Player
                if (responses[j].name === cur_player) {
                    // Determine Episode Number/Week (and ignore late sumissions)
                    var cur_vote = determineWeek(responses[j]);
                    // Validate Episode Number/Week
                    if (results[i].vote === cur_vote) {
                        var val_vote = 'Episode ' + String(results[i].vote);
						// zero out contestant score if they have multiple submissions, this will only count the most recent one
						if (inArray(cur_player+"_"+String(cur_vote), name_ep_count)) {
							scores[n].total -= scores[n][val_vote];
							scores[n][val_vote] = 0;
						};
                        // Determine by team if before merge (where 'Yes' is after merge):
                        if (results[i].merge === 'Yes') {
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
							if (results[i].immunity !== null && typeof results[i].immunity==="object" && inArray(responses[j].immunity,results[i].immunity) && responses[j].immunity) {
                                if (calcType === "individual") { scores[n].immunity += 5; }
                                else { scores[n][val_vote] += 5; };
                                scores[n].total += 5;
                            } else if (results[i].immunity == responses[j].immunity && responses[j].immunity) {
                                if (calcType === "individual") { scores[n].immunity += 15; }
                                else { scores[n][val_vote] += 15; };
                                scores[n].total += 15;
                            } else if (results[i].immunity2 == responses[j].immunity && responses[j].immunity) {
                                if (calcType === "individual") { scores[n].immunity += 15; }
                                else { scores[n][val_vote] += 15; };
                                scores[n].total += 15;
                            } else if (results[i].immunity3 == responses[j].immunity && responses[j].immunity) {
                                if (calcType === "individual") { scores[n].immunity += 15; }
                                else { scores[n][val_vote] += 15; };
                                scores[n].total += 15;
                            };
                            // Eliminated
                            if (results[i].eliminated !== null && typeof results[i].eliminated==="object" && inArray(responses[j].eliminated,results[i].eliminated) && responses[j].eliminated) {
                                if (calcType === "individual") { scores[n].eliminated += 20; }
                                else { scores[n][val_vote] += 20; };
                                scores[n].total += 20;
                            } else if (results[i].eliminated == responses[j].eliminated && responses[j].eliminated) {
                                if (calcType === "individual") { scores[n].eliminated += 20; }
                                else { scores[n][val_vote] += 20; };
                                scores[n].total += 20;
							};
							if (results[i].safe !== null && typeof results[i].eliminated==="object" && responses[j].safe) {
								// do something
                            };
                            // Safe
							if (inArray(responses[j].safe, results[i].eliminated)) {
								// no points, person marked safe was voted out
								continue;
							} else if (results[i].eliminated !== responses[j].safe && responses[j].safe) {
                                if (calcType === "individual") { scores[n].safe += 10; }
                                else { scores[n][val_vote] += 10; };
                                scores[n].total += 10;
							} else {
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
							// Risk/Reward
                            if (results[i].summit !== null && typeof results[i].summit==="object" && inArray(responses[j].summit,results[i].summit) && responses[j].summit) {
                                if (calcType === "individual") { scores[n].summit += 4; }
                                else { scores[n][val_vote] += 4; };
                                scores[n].total += 4;
                            } else if (results[i].summit == responses[j].summit && responses[j].summit) {
                                if (calcType === "individual") { scores[n].summit += 4; }
                                else { scores[n][val_vote] += 4; };
                                scores[n].total += 4;
                            };
                            // Erika's hourglass smash
                            if (results[i].hourglass == responses[j].hourglass && responses[j].hourglass) {
                                if (calcType === "individual") { scores[n].hourglass += 5; }
                                else { scores[n][val_vote] += 5; };
                                scores[n].total += 5;
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
							// Shot-in-the-Dark Played
                            if (results[i].shotInTheDark == responses[j].shotInTheDark && responses[j].shotInTheDark) {
                                if (calcType === "individual") { scores[n].shotInTheDark += 4; }
                                else { scores[n][val_vote] += 4; };
                                scores[n].total += 4;
                            };
                            // Return from the Edge of Extinction
                            if (results[i].edgeReturn == responses[j].edgeReturn && responses[j].edgeReturn) {
                            	if (calcType === "individual") { scores[n].edgeReturn += 4; }
                                else { scores[n][val_vote] += 4; };
                                scores[n].total += 4;
                            };
                            // Finale Immunity - 5 left
                            if (results[i].immunity_5 == responses[j].immunity_5 && responses[j].immunity_5) {
                                if (calcType === "individual") { scores[n].immunity_5 += 10; }
                                else { scores[n][val_vote] += 10; };
                                scores[n].total += 10;
                            };
							// Finale Immunity - 4 left
                            if (results[i].immunity_4 == responses[j].immunity_4 && responses[j].immunity_4) {
                                if (calcType === "individual") { scores[n].immunity_4 += 10; }
                                else { scores[n][val_vote] += 10; };
                                scores[n].total += 10;
                            };
							// Finale Fire Making Challenge
                            if (results[i].fireChallenge == responses[j].fireChallenge && responses[j].fireChallenge) {
                                if (calcType === "individual") { scores[n].fireChallenge += 10; }
                                else { scores[n][val_vote] += 10; };
                                scores[n].total += 10;
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
                            } else if ((results[i].reward === 'team_red' || results[i].reward2 === 'team_red') && inArray(responses[j].reward, team_red) && responses[j].reward) {
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
                            } else if ((results[i].immunity === 'team_red' || results[i].immunity2 === 'team_red')  && inArray(responses[j].immunity, team_red) && responses[j].immunity) {
                                if (calcType === "individual") { scores[n].immunity += 5; }
                                else { scores[n][val_vote] += 5; };
                                scores[n].total += 5;
                            } else if ((results[i].immunity === 'team_swap_win')  && inArray(responses[j].immunity, swapped_ep_4) && responses[j].immunity) {
                                if (calcType === "individual") { scores[n].immunity += 5; }
                                else { scores[n][val_vote] += 5; };
                                scores[n].total += 5;
                            };
                            // Eliminated
                            if (results[i].eliminated !== null && typeof results[i].eliminated==="object" && inArray(responses[j].eliminated,results[i].eliminated) && responses[j].eliminated) {
                                if (calcType === "individual") { scores[n].eliminated += 10; }
                                else { scores[n][val_vote] += 10; };
                                scores[n].total += 10;
                            } else if (results[i].eliminated == responses[j].eliminated && responses[j].eliminated) {
                                if (calcType === "individual") { scores[n].eliminated += 10; }
                                else { scores[n][val_vote] += 10; };
                                scores[n].total += 10;
                            };
                            // Safe
							if (results[i].eliminated !== responses[j].safe && responses[j].safe) {
								if (calcType === "individual") { scores[n].safe += 5; }
								else { scores[n][val_vote] += 5; };
								scores[n].total += 5;
                            };
                            // Title Quote
                            if (results[i].titleQuote == responses[j].titleQuote && responses[j].titleQuote) {
                                if (calcType === "individual") { scores[n].titleQuote += 2; }
                                else { scores[n][val_vote] += 2; };
                                scores[n].total += 2;
                            };							
                            // Erika's hourglass smash
                            if (results[i].hourglass == responses[j].hourglass && responses[j].hourglass) {
                                if (calcType === "individual") { scores[n].hourglass += 5; }
                                else { scores[n][val_vote] += 5; };
                                scores[n].total += 5;
                            };
							// Risk/Reward
                            if (results[i].summit !== null && typeof results[i].summit==="object" && inArray(responses[j].summit,results[i].summit) && responses[j].summit) {
                                if (calcType === "individual") { scores[n].summit += 2; }
                                else { scores[n][val_vote] += 2; };
                                scores[n].total += 2;
                            } else if (results[i].summit == responses[j].summit && responses[j].summit) {
                                if (calcType === "individual") { scores[n].summit += 2; }
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
							if (cur_vote == 3) { // hard code yes to all for vote 3 because of the poor editing where Matt GM found idol
								if (calcType === "individual") { scores[n].idolFound += 2; }
                                else { scores[n][val_vote] += 2; };
                                scores[n].total += 2;
                            } else if (results[i].idolFound == responses[j].idolFound && responses[j].idolFound) {
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
							// Shot-in-the-Dark Played
                            if (results[i].shotInTheDark == responses[j].shotInTheDark && responses[j].shotInTheDark) {
                                if (calcType === "individual") { scores[n].shotInTheDark += 2; }
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
                if (cur_vote === 10) {	// only submited responses to this question during week 10
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
				if (i===2) { bonus += 5 };
            } else if (castaways['place_'+String([i])] === "") {	// third
                sum += Math.pow(Math.abs(i-3),2.25);
				if (i===3) { bonus += 5 };
            } else if (castaways['place_'+String([i])] === "") {	// fourth
                sum += Math.pow(Math.abs(i-4),2.25);
				if (i===4) { bonus += 5 };
            } else if (castaways['place_'+String([i])] === "") {	// fifth
                sum += Math.pow(Math.abs(i-5),2.25);
				if (i===5) { bonus += 5 };
            } else if (castaways['place_'+String([i])] === "") {	// sixth
                sum += Math.pow(Math.abs(i-6),2.25);
				if (i===6) { bonus += 5 };
            } else if (castaways['place_'+String([i])] === "") {	// seventh
                sum += Math.pow(Math.abs(i-7),2.25)
				if (i===7) { bonus += 5 };
            } else if (castaways['place_'+String([i])] === "") {	// eighth
                sum += Math.pow(Math.abs(i-8),2.25);
				if (i===8) { bonus += 5 };
            };
        };
        var score = 100 - (0.75 * sum);
		if (score < 0) { score = 0 };
        return (score + bonus);
    };
    return (scores);
};

// FUNCTION TO CALCULATE SCORES FOR FINAL THREE
function final_three_calc(scores, result) {
    var top_three = [
		'Emily', 
		'Bruce', 'Jake', 'Katurah', 'Kendra',
		'Austin', 'Dee', 'Drew', 'Julie',
	];  //top three!
	var name_ep_count = [0];
	for (var n=0; n<scores.length; n++) {
        for (var i=0; i<result.length; i++) {
			if (result[i].name === scores[n].name) {
				var cur_vote = determineWeek(result[i]);
				if (cur_vote === 2) {	// submited responses to this question during week 2
					if (inArray(result[i].name, name_ep_count)) {
						console.log("duplicate final three -",result[i].name, cur_vote);
						scores[n].total -= scores[n]['Final Three'];
						scores[n]['Final Three'] = 0;						
					};
					if (inArray(result[i].pick_1, top_three)){
						scores[n]['Final Three'] += 30;
						scores[n].total += 30;
					};
					if (inArray(result[i].pick_2, top_three)){
						scores[n]['Final Three'] += 30;
						scores[n].total += 30;
					};
					if (inArray(result[i].pick_3, top_three)){
						scores[n]['Final Three'] += 30;
						scores[n].total += 30;
					};
					name_ep_count.push(result[i].name);
				};
			};
        };
    };
    return (scores);
};
//*/

var results = [
    {	'vote': 1,
        'date': '9/27/23',
        'merge': 'No',
        'reward': 'team_blue', 
        'immunity': 'team_blue',
		'immunity2': 'team_yellow',
        'eliminated': 'Hannah',
        'idolFound': 'Yes',
        'idolPlayed': 'No',
        'titleQuote': 'Hannah',
		'summit': 'NONE',
        'nudity': 'No',
		'shotInTheDark': 'No',
        'team_yellow': ['Brandon', 'Emily', 'Hannah', 'Kaleb', 'Sabiyah', 'Sean'],
        'team_blue': ['Brando', 'Bruce', 'Jake', 'Katurah', 'Kellie', 'Kendra'],
		'team_red': ['Austin', 'Dee', 'Drew', 'J', 'Julie', 'Sifu']
    },
	{	'vote': 2,
        'date': '10/04/23',
        'merge': 'No',
        'reward': 'team_blue', 
		'reward2': 'team_red', 
        'immunity': 'team_blue',
		'immunity2': 'team_red',
        'eliminated': 'Brandon',
        'idolFound': 'Yes',
        'idolPlayed': 'No',
        'titleQuote': 'Emily',
		'summit': ['Bruce', 'Drew', 'Brandon'],
        'nudity': 'No',
		'shotInTheDark': 'No',
        'team_yellow': ['Brandon', 'Emily', 'Kaleb', 'Sabiyah', 'Sean'],
        'team_blue': ['Brando', 'Bruce', 'Jake', 'Katurah', 'Kellie', 'Kendra'],
		'team_red': ['Austin', 'Dee', 'Drew', 'J', 'Julie', 'Sifu']
    },
	{	'vote': 3,
        'date': '10/11/23',
        'merge': 'No',
        'reward': 'team_yellow', 
		'reward2': 'team_red', 
        'immunity': 'team_blue',
		'immunity2': 'team_red',
        'eliminated': 'Sabiyah',
        'idolFound': 'Yes',
        'idolPlayed': 'No',
        'titleQuote': 'Sabiyah',
		'summit': 'NONE',
        'nudity': 'No',
		'shotInTheDark': 'No',
        'team_yellow': ['Emily', 'Kaleb', 'Sabiyah', 'Sean'],
        'team_blue': ['Brando', 'Bruce', 'Jake', 'Katurah', 'Kellie', 'Kendra'],
		'team_red': ['Austin', 'Dee', 'Drew', 'J', 'Julie', 'Sifu']
    },
	{	'vote': 4,
        'date': '10/18/23',
        'merge': 'No',
        'reward': '', 
		'reward2': '', 
        'immunity': 'team_yellow',
		'immunity2': 'team_blue',
        'eliminated': 'Sean',
        'idolFound': 'No',
        'idolPlayed': 'No',
        'titleQuote': 'Emily',
		'summit': 'NONE',
        'nudity': 'No',
		'shotInTheDark': 'No',
        'team_yellow': ['Kaleb', 'Bruce', 'Jake', 'Katurah', 'Kellie'],
        'team_blue': ['Emily', 'Austin', 'Drew', 'Brando', 'Kendra'],
		'team_red': ['Dee', 'J', 'Julie', 'Sifu', 'Sean']
    },
	{	'vote': 5,
        'date': '10/25/23',
        'merge': 'No',
        'reward': 'team_red', 
		'reward2': 'team_yellow', 
        'immunity': 'team_red',
		'immunity2': 'team_yellow',
        'eliminated': 'Brando',
        'idolFound': 'Yes',
        'idolPlayed': 'Yes',
        'titleQuote': 'Kendra',
		'summit': ['J', 'Kellie', 'Austin'],
        'nudity': 'No',
		'shotInTheDark': 'No',
        'team_yellow': ['Kaleb', 'Bruce', 'Jake', 'Katurah', 'Kellie'],
        'team_blue': ['Emily', 'Austin', 'Drew', 'Brando', 'Kendra'],
		'team_red': ['Dee', 'J', 'Julie', 'Sifu']
    },
	{	'vote': 6,
        'date': '11/1/23',
        'merge': 'Yes',
        'reward': 'team_blue', 
        'immunity': 'team_blue',
        'eliminated': 'J',
        'idolFound': 'Yes',
        'idolPlayed': 'No',
        'titleQuote': 'Kaleb',
		'summit': 'NONE',
        'nudity': 'No',
		'shotInTheDark': 'Yes',
        'team_blue': ['Sifu', 'Austin', 'Drew', 'Julie', 'Kendra', 'Katurah', 'Bruce'],
		'team_red': ['Kaleb', 'Emily', 'Dee', 'J', 'Jake', 'Kellie']
    },
	{	'vote': 7,
        'date': '11/8/23',
        'merge': 'Yes',
        'reward': ['Austin', 'Dee', 'Jake', 'Julie', 'Kaleb', 'Katurah'], 
        'immunity': 'Dee', 
		'immunity2': 'Kellie',
        'eliminated': ['Sifu', 'Kaleb'],
        'idolFound': 'No',
        'idolPlayed': 'No',
        'titleQuote': 'Kendra',
		'summit': 'NONE',
        'nudity': 'No',
		'shotInTheDark': 'No',
        'team_blue': ['Bruce', 'Drew', 'Emily', 'Kellie', 'Kendra', 'Sifu'],
		'team_red': ['Austin', 'Dee', 'Jake', 'Julie', 'Kaleb', 'Katurah']
    },
	{	'vote': 8,
        'date': '11/8/23',
        'merge': 'Yes',
        'reward': ['Drew', 'Emily', 'Kellie', 'Kendra', 'Sifu', 'Austin', 'Dee', 'Jake', 'Julie', 'Kaleb', 'Katurah'], 
        'immunity': 'Bruce',
        'eliminated': 'Kellie',
        'idolFound': 'No',
        'idolPlayed': 'No',
        'titleQuote': '',
		'summit': 'NONE',
        'nudity': 'No',
		'shotInTheDark': 'Yes'
    }
];

var saved_responses = [
	// WEEK 2
	{'name':'Jonathan', 'reward':'Katurah', 'immunity':'Sifu', 'eliminated':'Emily', 'safe':'Kendra', 'titleQuote':'Austin', 'summit':'Kellie', 'nudity':'No', 'idolFound':'Yes', 'idolPlayed':'No', 'shotInTheDark':'No', 'submit_time':'2023-10-02T14:05:00.000Z', 'pick_1':'Katurah', 'pick_2':'Kendra', 'pick_3':'Kaleb'},
	{'name':'Marcy', 'reward':'Brando', 'immunity':'Austin', 'eliminated':'Brandon', 'safe':'Julie', 'titleQuote':'Drew', 'summit':'Bruce', 'nudity':'No', 'idolFound':'Yes', 'idolPlayed':'No', 'shotInTheDark':'No', 'submit_time':'2023-10-02T22:24:00.000Z', 'pick_1':'Austin', 'pick_2':'Jake', 'pick_3':'Katurah'},
	{'name':'Erika', 'reward':'Austin', 'immunity':'Katurah', 'eliminated':'Brandon', 'safe':'Julie', 'titleQuote':'Jake', 'summit':'Julie', 'nudity':'No', 'idolFound':'', 'idolPlayed':'', 'shotInTheDark':'', 'submit_time':'2023-10-04T14:15:00.000Z', 'pick_1':'Katurah', 'pick_2':'Sabiyah', 'pick_3':'Sean'},
	{'name':'Abby', 'reward':'Dee', 'immunity':'Sean', 'eliminated':'Brandon', 'safe':'Sifu', 'titleQuote':'Emily', 'summit':'Kellie', 'nudity':'No', 'idolFound':'No', 'idolPlayed':'Yes', 'shotInTheDark':'Yes', 'submit_time':'2023-10-04T14:17:00.000Z', 'pick_1':'Drew', 'pick_2':'Julie', 'pick_3':'Bruce'},
	{'name':'Wilson', 'reward':'J', 'immunity':'Kellie', 'eliminated':'Emily', 'safe':'Sifu', 'titleQuote':'J', 'summit':'Bruce', 'nudity':'No', 'idolFound':'Yes', 'idolPlayed':'No', 'shotInTheDark':'No', 'submit_time':'2023-10-04T19:23:00.000Z', 'pick_1':'Bruce', 'pick_2':'Kellie', 'pick_3':'Sabiyah'},
	{'name':'Esme', 'reward':'Austin', 'immunity':'Austin', 'eliminated':'Brandon', 'safe':'Austin', 'titleQuote':'Jake', 'summit':'Katurah', 'nudity':'No', 'idolFound':'Yes', 'idolPlayed':'No', 'shotInTheDark':'No', 'submit_time':'2023-10-04T19:38:00.000Z', 'pick_1':'Katurah', 'pick_2':'Kendra', 'pick_3':'Sabiyah'},
	{'name':'Mitch', 'reward':'Bruce', 'immunity':'Bruce', 'eliminated':'Brandon', 'safe':'Dee', 'titleQuote':'Kellie', 'summit':'Kellie', 'nudity':'No', 'idolFound':'Yes', 'idolPlayed':'No', 'shotInTheDark':'No', 'submit_time':'2023-10-04T19:41:00.000Z', 'pick_1':'Dee', 'pick_2':'Katurah', 'pick_3':'Kendra'},
	{'name':'Christy', 'reward':'Austin', 'immunity':'Drew', 'eliminated':'Bruce', 'safe':'Austin', 'titleQuote':'Bruce', 'summit':'Kaleb', 'nudity':'No', 'idolFound':'Yes', 'idolPlayed':'No', 'shotInTheDark':'No', 'submit_time':'2023-10-04T19:49:00.000Z', 'pick_1':'Dee', 'pick_2':'Brando', 'pick_3':'Katurah'},
	{'name':'Dan M', 'reward':'Sifu', 'immunity':'J', 'eliminated':'Sean', 'safe':'Drew', 'titleQuote':'Dee', 'summit':'Julie', 'nudity':'Yes', 'idolFound':'Yes', 'idolPlayed':'Yes', 'shotInTheDark':'Yes', 'submit_time':'2023-10-04T19:55:00.000Z', 'pick_1':'Sifu', 'pick_2':'Bruce', 'pick_3':'Katurah'},
	{'name':'Greg', 'reward':'Bruce', 'immunity':'Austin', 'eliminated':'Brandon', 'safe':'Sifu', 'titleQuote':'Sifu', 'summit':'Emily', 'nudity':'No', 'idolFound':'Yes', 'idolPlayed':'No', 'shotInTheDark':'No', 'submit_time':'2023-10-04T23:30:00.000Z', 'pick_1':'Julie', 'pick_2':'Brando', 'pick_3':'Sean'},
	{'name':'Ethan', 'reward':'Katurah', 'immunity':'Katurah', 'eliminated':'Emily', 'safe':'Katurah', 'titleQuote':'Brandon', 'summit':'Julie', 'nudity':'No', 'idolFound':'Yes', 'idolPlayed':'No', 'shotInTheDark':'No', 'submit_time':'2023-10-05T00:59:00.000Z', 'pick_1':'Drew', 'pick_2':'Katurah', 'pick_3':'Sean'},
	{'name':'Anastassia', 'reward':'Sifu', 'immunity':'Sifu', 'eliminated':'Bruce', 'safe':'Austin', 'titleQuote':'Austin', 'summit':'Emily', 'nudity':'No', 'idolFound':'Yes', 'idolPlayed':'No', 'shotInTheDark':'No', 'submit_time':'2023-10-05T01:01:00.000Z', 'pick_1':'Katurah', 'pick_2':'Kaleb', 'pick_3':'Sean'},
	{'name':'Betsy', 'reward':'Austin', 'immunity':'Sifu', 'eliminated':'Emily', 'safe':'Katurah', 'titleQuote':'Brandon', 'summit':'Drew', 'nudity':'No', 'idolFound':'Yes', 'idolPlayed':'No', 'shotInTheDark':'Yes', 'submit_time':'2023-10-05T11:39:00.000Z', 'pick_1':'Bruce', 'pick_2':'Katurah', 'pick_3':'Sabiyah'},
	{'name':'Josh S', 'reward':'Austin', 'immunity':'Austin', 'eliminated':'Brandon', 'safe':'Austin', 'titleQuote':'Kaleb', 'summit':'Emily', 'nudity':'No', 'idolFound':'Yes', 'idolPlayed':'No', 'shotInTheDark':'Yes', 'submit_time':'2023-10-05T16:10:00.000Z', 'pick_1':'Dee', 'pick_2':'Jake', 'pick_3':'Katurah'},
	{'name':'Joe', 'reward':'Bruce', 'immunity':'Austin', 'eliminated':'Brandon', 'safe':'Austin', 'titleQuote':'Jeff Probst', 'summit':'Bruce', 'nudity':'Yes', 'idolFound':'No', 'idolPlayed':'No', 'shotInTheDark':'No', 'submit_time':'2023-10-05T20:15:00.000Z', 'pick_1':'Austin', 'pick_2':'Bruce', 'pick_3':'Kellie'},
	// WEEK 3
	{'name':'Betsy', 'reward':'Austin', 'immunity':'Bruce', 'eliminated':'Jake', 'safe':'Sifu', 'titleQuote':'Jeff Probst', 'summit':'Jake', 'nudity':'No', 'idolFound':'Yes', 'idolPlayed':'No', 'shotInTheDark':'No', 'submit_time':'2023-10-10T15:07:00.000Z'},
	{'name':'Abby', 'reward':'Drew', 'immunity':'Katurah', 'eliminated':'Emily', 'safe':'Bruce', 'titleQuote':'Drew', 'summit':'Katurah', 'nudity':'No', 'idolFound':'Yes', 'idolPlayed':'No', 'shotInTheDark':'Yes', 'submit_time':'2023-10-10T15:52:00.000Z'},
	{'name':'Joe', 'reward':'Austin', 'immunity':'Austin', 'eliminated':'Emily', 'safe':'Austin', 'titleQuote':'Bruce', 'summit':'Austin', 'nudity':'No', 'idolFound':'No', 'idolPlayed':'No', 'shotInTheDark':'Yes', 'submit_time':'2023-10-10T21:41:00.000Z'},
	{'name':'Erika', 'reward':'Julie', 'immunity':'Brando', 'eliminated':'J', 'safe':'Austin', 'titleQuote':'Jeff Probst', 'summit':'Kellie', 'nudity':'No', 'idolFound':'Yes', 'idolPlayed':'No', 'shotInTheDark':'No', 'submit_time':'2023-10-11T11:58:00.000Z'},
	{'name':'Wilson', 'reward':'Bruce', 'immunity':'Sifu', 'eliminated':'Emily', 'safe':'Kellie', 'titleQuote':'Bruce', 'summit':'Katurah', 'nudity':'No', 'idolFound':'Yes', 'idolPlayed':'No', 'shotInTheDark':'No', 'submit_time':'2023-10-11T17:33:00.000Z'},
	{'name':'Mitch', 'reward':'Kaleb', 'immunity':'Bruce', 'eliminated':'Sabiyah', 'safe':'Bruce', 'titleQuote':'Kaleb', 'summit':'Kaleb', 'nudity':'No', 'idolFound':'Yes', 'idolPlayed':'No', 'shotInTheDark':'No', 'submit_time':'2023-10-11T18:01:00.000Z'},
	{'name':'Esme', 'reward':'Bruce', 'immunity':'Austin', 'eliminated':'Sean', 'safe':'Katurah', 'titleQuote':'Bruce', 'summit':'Julie', 'nudity':'No', 'idolFound':'Yes', 'idolPlayed':'No', 'shotInTheDark':'Yes', 'submit_time':'2023-10-11T18:09:00.000Z'},
	{'name':'Christy', 'reward':'Austin', 'immunity':'Austin', 'eliminated':'Emily', 'safe':'Dee', 'titleQuote':'Bruce', 'summit':'Kendra', 'nudity':'No', 'idolFound':'Yes', 'idolPlayed':'No', 'shotInTheDark':'No', 'submit_time':'2023-10-11T18:13:00.000Z'},
	{'name':'Dan M', 'reward':'Dee', 'immunity':'Brando', 'eliminated':'Katurah', 'safe':'Jake', 'titleQuote':'J', 'summit':'Brando', 'nudity':'Yes', 'idolFound':'Yes', 'idolPlayed':'Yes', 'shotInTheDark':'Yes', 'submit_time':'2023-10-11T20:05:00.000Z'},
	{'name':'Greg', 'reward':'Austin', 'immunity':'Austin', 'eliminated':'Emily', 'safe':'Julie', 'titleQuote':'Sifu', 'summit':'Kaleb', 'nudity':'No', 'idolFound':'Yes', 'idolPlayed':'No', 'shotInTheDark':'Yes', 'submit_time':'2023-10-11T20:52:00.000Z'},
	{'name':'Ethan', 'reward':'Austin', 'immunity':'Austin', 'eliminated':'Sabiyah', 'safe':'Kendra', 'titleQuote':'Jeff Probst', 'summit':'Julie', 'nudity':'No', 'idolFound':'Yes', 'idolPlayed':'No', 'shotInTheDark':'No', 'submit_time':'2023-10-13T00:36:00.000Z'},
	{'name':'Anastassia', 'reward':'Austin', 'immunity':'Austin', 'eliminated':'Sabiyah', 'safe':'Katurah', 'titleQuote':'Kaleb', 'summit':'Julie', 'nudity':'No', 'idolFound':'Yes', 'idolPlayed':'No', 'shotInTheDark':'No', 'submit_time':'2023-10-13T00:42:00.000Z'},
	{'name':'Marcy', 'reward':'Brando', 'immunity':'Austin', 'eliminated':'Sean', 'safe':'Kellie', 'titleQuote':'Jake', 'summit':'Jake', 'nudity':'No', 'idolFound':'Yes', 'idolPlayed':'No', 'shotInTheDark':'No', 'submit_time':'2023-10-13T22:14:00.000Z'},
	// WEEK 4
	{'name':'Esme', 'reward':'Austin', 'immunity':'Austin', 'eliminated':'J', 'safe':'Katurah', 'titleQuote':'Emily', 'summit':'Dee', 'nudity':'No', 'idolFound':'Yes', 'idolPlayed':'No', 'shotInTheDark':'No', 'submit_time':'2023-10-18T13:55:00.000Z'},
	{'name':'Betsy', 'reward':'Kaleb', 'immunity':'Austin', 'eliminated':'Kaleb', 'safe':'Julie', 'titleQuote':'J', 'summit':'Katurah', 'nudity':'No', 'idolFound':'No', 'idolPlayed':'No', 'shotInTheDark':'No', 'submit_time':'2023-10-18T15:39:00.000Z'},
	{'name':'Erika', 'reward':'Austin', 'immunity':'Julie', 'eliminated':'Sean', 'safe':'Brando', 'titleQuote':'Emily', 'summit':'Jake', 'nudity':'No', 'idolFound':'No', 'idolPlayed':'No', 'shotInTheDark':'No', 'submit_time':'2023-10-18T19:29:00.000Z'},
	{'name':'Wilson', 'reward':'Austin', 'immunity':'Kellie', 'eliminated':'Emily', 'safe':'Katurah', 'titleQuote':'Emily', 'summit':'Brando', 'nudity':'No', 'idolFound':'Yes', 'idolPlayed':'Yes', 'shotInTheDark':'No', 'submit_time':'2023-10-18T19:33:00.000Z'},
	{'name':'Joe', 'reward':'Austin', 'immunity':'Kaleb', 'eliminated':'Sifu', 'safe':'Dee', 'titleQuote':'Dee', 'summit':'Kaleb', 'nudity':'No', 'idolFound':'Yes', 'idolPlayed':'No', 'shotInTheDark':'No', 'submit_time':'2023-10-18T19:49:00.000Z'},
	{'name':'Dan M', 'reward':'Sean', 'immunity':'Dee', 'eliminated':'J', 'safe':'Drew', 'titleQuote':'Kellie', 'summit':'Bruce', 'nudity':'Yes', 'idolFound':'Yes', 'idolPlayed':'Yes', 'shotInTheDark':'Yes', 'submit_time':'2023-10-18T19:53:00.000Z'},
	{'name':'Mitch', 'reward':'Bruce', 'immunity':'Bruce', 'eliminated':'Sean', 'safe':'Bruce', 'titleQuote':'Sean', 'summit':'Sifu', 'nudity':'No', 'idolFound':'Yes', 'idolPlayed':'No', 'shotInTheDark':'Yes', 'submit_time':'2023-10-18T19:55:00.000Z'},
	{'name':'Christy', 'reward':'Austin', 'immunity':'Austin', 'eliminated':'Bruce', 'safe':'Katurah', 'titleQuote':'Brando', 'summit':'Katurah', 'nudity':'No', 'idolFound':'Yes', 'idolPlayed':'No', 'shotInTheDark':'No', 'submit_time':'2023-10-18T20:03:00.000Z'},
	{'name':'Greg', 'reward':'Austin', 'immunity':'Austin', 'eliminated':'Kaleb', 'safe':'Julie', 'titleQuote':'Brando', 'summit':'Julie', 'nudity':'No', 'idolFound':'No', 'idolPlayed':'Yes', 'shotInTheDark':'No', 'submit_time':'2023-10-18T22:47:00.000Z'},
	{'name':'Abby', 'reward':'Drew', 'immunity':'Austin', 'eliminated':'Bruce', 'safe':'Kaleb', 'titleQuote':'Drew', 'summit':'Katurah', 'nudity':'No', 'idolFound':'Yes', 'idolPlayed':'Yes', 'shotInTheDark':'Yes', 'submit_time':'2023-10-18T22:53:00.000Z'},
	{'name':'Anastassia', 'reward':'Jake', 'immunity':'Sean', 'eliminated':'Jake', 'safe':'Drew', 'titleQuote':'Emily', 'summit':'Katurah', 'nudity':'No', 'idolFound':'Yes', 'idolPlayed':'No', 'shotInTheDark':'No', 'submit_time':'2023-10-19T22:34:00.000Z'},
	{'name':'Ethan', 'reward':'Austin', 'immunity':'Austin', 'eliminated':'Bruce', 'safe':'Drew', 'titleQuote':'Emily', 'summit':'J', 'nudity':'No', 'idolFound':'Yes', 'idolPlayed':'No', 'shotInTheDark':'No', 'submit_time':'2023-10-19T22:38:00.000Z'},
	{'name':'Marcy', 'reward':'Emily', 'immunity':'Katurah', 'eliminated':'Drew', 'safe':'Emily', 'titleQuote':'Sean', 'summit':'Dee', 'nudity':'No', 'idolFound':'No', 'idolPlayed':'No', 'shotInTheDark':'No', 'submit_time':'2023-10-19T19:46:00.000Z'},
	// WEEK 5
	{'name':'Betsy', 'reward':'Austin', 'immunity':'Austin', 'eliminated':'Sifu', 'safe':'Drew', 'titleQuote':'Brando', 'summit':'J', 'nudity':'No', 'idolFound':'No', 'idolPlayed':'No', 'shotInTheDark':'No', 'submit_time':'2023-10-24T19:05:00.000Z'},
	{'name':'Esme', 'reward':'Dee', 'immunity':'Dee', 'eliminated':'Brando', 'safe':'Katurah', 'titleQuote':'Emily', 'summit':'Katurah', 'nudity':'No', 'idolFound':'Yes', 'idolPlayed':'No', 'shotInTheDark':'No', 'submit_time':'2023-10-25T17:57:00.000Z'},
	{'name':'Erika', 'reward':'Austin', 'immunity':'Bruce', 'eliminated':'Sifu', 'safe':'Austin', 'titleQuote':'Brando', 'summit':'Katurah', 'nudity':'No', 'idolFound':'Yes', 'idolPlayed':'No', 'shotInTheDark':'No', 'submit_time':'2023-10-25T18:07:00.000Z'},
	{'name':'Christy', 'reward':'Austin', 'immunity':'Austin', 'eliminated':'Sifu', 'safe':'Kendra', 'titleQuote':'Emily', 'summit':'Katurah', 'nudity':'No', 'idolFound':'No', 'idolPlayed':'No', 'shotInTheDark':'No', 'submit_time':'2023-10-25T18:28:00.000Z'},
	{'name':'Wilson', 'reward':'Kellie', 'immunity':'Dee', 'eliminated':'Emily', 'safe':'Kendra', 'titleQuote':'Brando', 'summit':'Jake', 'nudity':'No', 'idolFound':'Yes', 'idolPlayed':'Yes', 'shotInTheDark':'No', 'submit_time':'2023-10-25T18:51:00.000Z'},
	{'name':'Dan M', 'reward':'Kellie', 'immunity':'Brando', 'eliminated':'Kendra', 'safe':'Kendra', 'titleQuote':'Emily', 'summit':'Dee', 'nudity':'No', 'idolFound':'No', 'idolPlayed':'Yes', 'shotInTheDark':'Yes', 'submit_time':'2023-10-25T20:02:00.000Z'},
	{'name':'Greg', 'reward':'Austin', 'immunity':'Drew', 'eliminated':'Sifu', 'safe':'Julie', 'titleQuote':'Emily', 'summit':'Katurah', 'nudity':'No', 'idolFound':'No', 'idolPlayed':'No', 'shotInTheDark':'No', 'submit_time':'2023-10-25T20:19:00.000Z'},
	{'name':'Marcy', 'reward':'Bruce', 'immunity':'Bruce', 'eliminated':'Sifu', 'safe':'Emily', 'titleQuote':'Kendra', 'summit':'J', 'nudity':'No', 'idolFound':'Yes', 'idolPlayed':'No', 'shotInTheDark':'No', 'submit_time':'2023-10-26T20:02:00.000Z'},
	{'name':'Joe', 'reward':'Kaleb', 'immunity':'Kaleb', 'eliminated':'Sifu', 'safe':'Kaleb', 'titleQuote':'Sifu', 'summit':'Dee', 'nudity':'No', 'idolFound':'No', 'idolPlayed':'No', 'shotInTheDark':'Yes', 'submit_time':'2023-10-26T21:35:00.000Z'},
	{'name':'Anastassia', 'reward':'Kaleb', 'immunity':'Kaleb', 'eliminated':'Sifu', 'safe':'Drew', 'titleQuote':'Drew', 'summit':'Kendra', 'nudity':'No', 'idolFound':'Yes', 'idolPlayed':'No', 'shotInTheDark':'No', 'submit_time':'2023-10-26T23:38:00.000Z'},
	{'name':'Ethan', 'reward':'Kaleb', 'immunity':'Kaleb', 'eliminated':'Sifu', 'safe':'Kaleb', 'titleQuote':'Dee', 'summit':'Katurah', 'nudity':'No', 'idolFound':'Yes', 'idolPlayed':'No', 'shotInTheDark':'No', 'submit_time':'2023-10-26T23:40:00.000Z'},
	// WEEK 6
	{'name':'Betsy', 'reward':'Austin', 'immunity':'Austin', 'eliminated':'Bruce', 'safe':'Austin', 'titleQuote':'Kaleb', 'summit':'Katurah', 'nudity':'No', 'idolFound':'Yes', 'idolPlayed':'Yes', 'shotInTheDark':'Yes', 'submit_time':'2023-10-31T20:23:00.000Z'},
	{'name':'Erika', 'reward':'Kaleb', 'immunity':'Julie', 'eliminated':'J', 'safe':'Kellie', 'titleQuote':'Kaleb', 'summit':'Kaleb', 'nudity':'No', 'idolFound':'No', 'idolPlayed':'No', 'shotInTheDark':'No', 'submit_time':'2023-11-01T19:06:00.000Z'},
	{'name':'Mitch', 'reward':'Sifu', 'immunity':'Sifu', 'eliminated':'J', 'safe':'Sifu', 'titleQuote':'Kaleb', 'summit':'Bruce', 'nudity':'No', 'idolFound':'No', 'idolPlayed':'No', 'shotInTheDark':'Yes', 'submit_time':'2023-11-01T19:09:00.000Z'},
	{'name':'Abby', 'reward':'Katurah', 'immunity':'Kaleb', 'eliminated':'Sifu', 'safe':'Drew', 'titleQuote':'Drew', 'summit':'J', 'nudity':'No', 'idolFound':'Yes', 'idolPlayed':'Yes', 'shotInTheDark':'Yes', 'submit_time':'2023-11-01T19:38:00.000Z'},
	{'name':'Christy', 'reward':'Kaleb', 'immunity':'Jake', 'eliminated':'Kendra', 'safe':'Kellie', 'titleQuote':'Kaleb', 'summit':'Katurah', 'nudity':'No', 'idolFound':'Yes', 'idolPlayed':'No', 'shotInTheDark':'No', 'submit_time':'2023-11-01T19:44:00.000Z'},
	{'name':'Esme', 'reward':'Austin', 'immunity':'Emily', 'eliminated':'Sifu', 'safe':'Julie', 'titleQuote':'Kaleb', 'summit':'Kaleb', 'nudity':'No', 'idolFound':'Yes', 'idolPlayed':'No', 'shotInTheDark':'No', 'submit_time':'2023-11-01T19:58:00.000Z'},
	{'name':'Wilson', 'reward':'Kellie', 'immunity':'Austin', 'eliminated':'Emily', 'safe':'Kendra', 'titleQuote':'J', 'summit':'Katurah', 'nudity':'No', 'idolFound':'Yes', 'idolPlayed':'Yes', 'shotInTheDark':'No', 'submit_time':'2023-11-01T20:02:00.000Z'},
	{'name':'Joe', 'reward':'Kaleb', 'immunity':'Austin', 'eliminated':'J', 'safe':'Austin', 'titleQuote':'Kaleb', 'summit':'Dee', 'nudity':'No', 'idolFound':'Yes', 'idolPlayed':'No', 'shotInTheDark':'No', 'submit_time':'2023-11-01T21:06:00.000Z'},
	{'name':'Greg', 'reward':'Dee', 'immunity':'Austin', 'eliminated':'Drew', 'safe':'Julie', 'titleQuote':'Drew', 'summit':'Katurah', 'nudity':'No', 'idolFound':'Yes', 'idolPlayed':'Yes', 'shotInTheDark':'No', 'submit_time':'2023-11-02T00:30:00.000Z'},
	{'name':'Marcy', 'reward':'J', 'immunity':'Kellie', 'eliminated':'Sifu', 'safe':'Emily', 'titleQuote':'Kaleb', 'summit':'Emily', 'nudity':'No', 'idolFound':'No', 'idolPlayed':'No', 'shotInTheDark':'No', 'submit_time':'2023-11-05T12:00:00.000Z'},
	{'name':'Ethan', 'reward':'Kaleb', 'immunity':'Kaleb', 'eliminated':'Bruce', 'safe':'Kaleb', 'titleQuote':'Kaleb', 'summit':'Julie', 'nudity':'No', 'idolFound':'No', 'idolPlayed':'No', 'shotInTheDark':'No', 'submit_time':'2023-11-02T00:30:00.000Z'},
	{'name':'Anastassia', 'reward':'Kaleb', 'immunity':'Kaleb', 'eliminated':'Bruce', 'safe':'Kaleb', 'titleQuote':'Kaleb', 'summit':'Julie', 'nudity':'No', 'idolFound':'Yes', 'idolPlayed':'No', 'shotInTheDark':'No', 'submit_time':'2023-11-02T00:30:00.000Z'},
	// WEEK 7
	{'name':'Christy', 'reward':'Kellie', 'immunity':'Kellie', 'eliminated':'Dee', 'safe':'Jake', 'titleQuote':'Bruce', 'summit':'Katurah', 'nudity':'No', 'idolFound':'Yes', 'idolPlayed':'No', 'shotInTheDark':'No', 'submit_time':'2023-11-08T18:47:00.000Z'},
	{'name':'Joe', 'reward':'Austin', 'immunity':'Austin', 'eliminated':'Bruce', 'safe':'Austin', 'titleQuote':'Emily', 'summit':'Dee', 'nudity':'No', 'idolFound':'No', 'idolPlayed':'Yes', 'shotInTheDark':'Yes', 'submit_time':'2023-11-08T18:51:00.000Z'},
	{'name':'Erika', 'reward':'Kendra', 'immunity':'Austin', 'eliminated':'Julie', 'safe':'Jake', 'titleQuote':'Dee', 'summit':'Kellie', 'nudity':'No', 'idolFound':'Yes', 'idolPlayed':'No', 'shotInTheDark':'No', 'submit_time':'2023-11-08T19:14:00.000Z'},
	{'name':'Mitch', 'reward':'Dee', 'immunity':'Dee', 'eliminated':'Sifu', 'safe':'Austin', 'titleQuote':'Katurah', 'summit':'Austin', 'nudity':'No', 'idolFound':'No', 'idolPlayed':'No', 'shotInTheDark':'No', 'submit_time':'2023-11-08T19:20:00.000Z'},
	{'name':'Esme', 'reward':'Dee', 'immunity':'Austin', 'eliminated':'Sifu', 'safe':'Emily', 'titleQuote':'Drew', 'summit':'Julie', 'nudity':'No', 'idolFound':'No', 'idolPlayed':'No', 'shotInTheDark':'No', 'submit_time':'2023-11-08T19:24:00.000Z'},
	{'name':'Betsy', 'reward':'Austin', 'immunity':'Austin', 'eliminated':'Kellie', 'safe':'Austin', 'titleQuote':'Jake', 'summit':'Sifu', 'nudity':'No', 'idolFound':'No', 'idolPlayed':'Yes', 'shotInTheDark':'No', 'submit_time':'2023-11-08T19:38:00.000Z'},
	{'name':'Abby', 'reward':'Drew', 'immunity':'Drew', 'eliminated':'Bruce', 'safe':'Jake', 'titleQuote':'Jake', 'summit':'Dee', 'nudity':'No', 'idolFound':'No', 'idolPlayed':'Yes', 'shotInTheDark':'Yes', 'submit_time':'2023-11-08T19:38:00.000Z'},
	{'name':'Wilson', 'reward':'Kellie', 'immunity':'Austin', 'eliminated':'Drew', 'safe':'Kaleb', 'titleQuote':'Katurah', 'summit':'Emily', 'nudity':'No', 'idolFound':'Yes', 'idolPlayed':'Yes', 'shotInTheDark':'No', 'submit_time':'2023-11-08T23:11:00.000Z'},
	{'name':'Greg', 'reward':'Drew', 'immunity':'Dee', 'eliminated':'Jake', 'safe':'Julie', 'titleQuote':'Jake', 'summit':'Sifu', 'nudity':'No', 'idolFound':'No', 'idolPlayed':'Yes', 'shotInTheDark':'No', 'submit_time':'2023-11-08T23:28:00.000Z'},
	{'name':'Marcy', 'reward':'Jake', 'immunity':'Kellie', 'eliminated':'Bruce', 'safe':'Emily', 'titleQuote':'Katurah', 'summit':'Drew', 'nudity':'No', 'idolFound':'Yes', 'idolPlayed':'No', 'shotInTheDark':'No', 'submit_time':'2023-11-10T18:58:00.000Z'},
	{'name':'Ethan', 'reward':'Austin', 'immunity':'Austin', 'eliminated':'Julie', 'safe':'Austin', 'titleQuote':'Kaleb', 'summit':'Katurah', 'nudity':'No', 'idolFound':'No', 'idolPlayed':'No', 'shotInTheDark':'No', 'submit_time':'2023-11-11T23:34:00.000Z'},
	{'name':'Anastassia', 'reward':'Austin', 'immunity':'Austin', 'eliminated':'Julie', 'safe':'Austin', 'titleQuote':'Austin', 'summit':'Emily', 'nudity':'No', 'idolFound':'No', 'idolPlayed':'No', 'shotInTheDark':'No', 'submit_time':'2023-11-11T23:38:00.000Z'},
	// WEEK 8
	{'name':'Esme', 'reward':'Bruce', 'immunity':'Julie', 'eliminated':'Kellie', 'safe':'Drew', 'titleQuote':'Drew', 'summit':'Katurah', 'nudity':'No', 'idolFound':'No', 'idolPlayed':'Yes', 'shotInTheDark':'No', 'submit_time':'2023-11-15T13:25:00.000Z'},
	{'name':'Wilson', 'reward':'Kellie', 'immunity':'Austin', 'eliminated':'Drew', 'safe':'Emily', 'titleQuote':'Emily', 'summit':'Dee', 'nudity':'No', 'idolFound':'Yes', 'idolPlayed':'Yes', 'shotInTheDark':'No', 'submit_time':'2023-11-15T15:08:00.000Z'},
	{'name':'Christy', 'reward':'Austin', 'immunity':'Kellie', 'eliminated':'Jake', 'safe':'Kellie', 'titleQuote':'Bruce', 'summit':'Katurah', 'nudity':'No', 'idolFound':'Yes', 'idolPlayed':'No', 'shotInTheDark':'No', 'submit_time':'2023-11-15T15:09:00.000Z'},
	{'name':'Ethan', 'reward':'Julie', 'immunity':'Kellie', 'eliminated':'Bruce', 'safe':'Drew', 'titleQuote':'Bruce', 'summit':'Julie', 'nudity':'No', 'idolFound':'Yes', 'idolPlayed':'No', 'shotInTheDark':'No', 'submit_time':'2023-11-15T18:02:00.000Z'},
	{'name':'Mitch', 'reward':'Emily', 'immunity':'Austin', 'eliminated':'Kellie', 'safe':'Austin', 'titleQuote':'Bruce', 'summit':'Bruce', 'nudity':'No', 'idolFound':'Yes', 'idolPlayed':'Yes', 'shotInTheDark':'No', 'submit_time':'2023-11-15T18:13:00.000Z'},
	{'name':'Erika', 'reward':'Dee', 'immunity':'Kellie', 'eliminated':'Bruce', 'safe':'Kellie', 'titleQuote':'Bruce', 'summit':'Drew', 'nudity':'No', 'idolFound':'Yes', 'idolPlayed':'Yes', 'shotInTheDark':'No', 'submit_time':'2023-11-15T19:57:00.000Z'},
	{'name':'Betsy', 'reward':'Kellie', 'immunity':'Kendra', 'eliminated':'Jake', 'safe':'Drew', 'titleQuote':'Emily', 'summit':'Jake', 'nudity':'No', 'idolFound':'Yes', 'idolPlayed':'Yes', 'shotInTheDark':'No', 'submit_time':'2023-11-15T20:40:00.000Z'},
	{'name':'Greg', 'reward':'Kellie', 'immunity':'Kellie', 'eliminated':'Jake', 'safe':'Dee', 'titleQuote':'Drew', 'summit':'Katurah', 'nudity':'No', 'idolFound':'Yes', 'idolPlayed':'Yes', 'shotInTheDark':'No', 'submit_time':'2023-11-15T20:41:00.000Z'},
	{'name':'Anastassia', 'reward':'Austin', 'immunity':'Dee', 'eliminated':'Bruce', 'safe':'Austin', 'titleQuote':'Jake', 'summit':'Kendra', 'nudity':'No', 'idolFound':'Yes', 'idolPlayed':'No', 'shotInTheDark':'No', 'submit_time':'2023-11-15T21:03:00.000Z'},
	{'name':'Joe', 'reward':'Austin', 'immunity':'Drew', 'eliminated':'Jake', 'safe':'Austin', 'titleQuote':'Jeff Probst', 'summit':'Jake', 'nudity':'No', 'idolFound':'Yes', 'idolPlayed':'No', 'shotInTheDark':'Yes', 'submit_time':'2023-11-15T20:41:00.000Z'}
];