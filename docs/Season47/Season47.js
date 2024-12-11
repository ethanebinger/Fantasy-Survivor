function init() {
    // Move past hero page and enter form on click
    $('#enterBtn').click(function(e) {
		window.location = "https://forms.gle/DGJdMQj4WR1gEyNL9";
		//$('.title_img').addClass('isHidden');
        //$('#survivor_form').removeClass('isHidden');
        //$('#advance_form').removeClass('isHidden');
    });
    
	// Move past hero page and go to results on click
	$('#resultsBtn').click(function(e) {
		window.location = "results.html";
    });
    
    function autoResizeDiv() {
        document.getElementById('survivor_form').style.height = window.innerHeight +'px';
    };
    window.onresize = autoResizeDiv;
    autoResizeDiv();
    
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
			'shotInTheDark':0,
			'liveReunion': 0,
			'voteUnanimous': 0,
			'fishCatch': 0,
			'jeffJoke': 0			
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
						"<tr><td><strong>Idol or Advantage Played</strong></td><td>" + responses[i].idolPlayed + "</td><td>"+ scores[0].idolPlayed +"</td></tr>" +
						"<tr><td><strong>Pre-Taped Reunion</strong></td><td>" + responses[i].liveReunion + "</td><td>"+ scores[0].liveReunion +"</td></tr>"
					);
				} else if (cur_vote >= 11) {
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
						"<tr><td><strong>Shot-in-the-Dark Played</strong></td><td>" + responses[i].shotInTheDark + "</td><td>"+ scores[0].shotInTheDark +"</td></tr>" + 
						"<tr><td><strong>Fish Caught</strong></td><td>" + responses[i].fishCatch + "</td><td>"+ scores[0].fishCatch +"</td></tr>" +
						"<tr><td><strong>Unanimous Vote</strong></td><td>" + responses[i].voteUnanimous + "</td><td>"+ scores[0].voteUnanimous +"</td></tr>" +
						"<tr><td><strong>Jeff Laugh at Last Place</strong></td><td>" + responses[i].jeffJoke + "</td><td>"+ scores[0].jeffJoke +"</td></tr>"
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
			if (cur_vote === 11) {	// only submited responses to this question for episode 11
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
    // datetime constructor: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/Date
	// list the dates of episodes in the season, in order
	let episode_dates = [
		'2024-09-18',
		'2024-09-25',
		'2024-10-02',
		'2024-10-09',
		'2024-10-16',
		'2024-10-23',
		'2024-10-30',
		'2024-11-06',
		'2024-11-13',
		'2024-11-20',
		'2024-11-27',
		'2024-12-04',
		'2024-12-11'
	];
	// loop through the episode dates
	// return the episode number if the response date is less than or equal to episode date+3
	let submit_time = new Date(responses.submit_time);
	for (let i = 0; i < episode_dates.length; i++) {
        let date = new Date(episode_dates[i]);
        date.setDate(date.getDate() + 3);
        if (submit_time <= date) {
            return i + 1;
        };
    };
	 // Return 0 if no date matches
    return 0;
};

// FUNCTION TO CALCULATE SCORES
function calculateScores(scores, results, responses, calcType) {
    var name_ep_count = [0];
    for (var n=0; n<scores.length; n++) {
        var cur_player = scores[n].name;
        for (var i=0; i<results.length; i++) {
            var team_red = results[i].team_red;
            var team_yellow = results[i].team_yellow;
			var team_blue = results[i].team_blue;
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
							// Live Reunion or Pre-Taped?
                            if (results[i].liveReunion == responses[j].liveReunion && responses[j].liveReunion) {
                                if (calcType === "individual") { scores[n].liveReunion += 4; }
                                else { scores[n][val_vote] += 4; };
                                scores[n].total += 4;
                            };
							// Was a fish caught during the episode?
                            if (results[i].fishCatch == responses[j].fishCatch && responses[j].fishCatch) {
                                if (calcType === "individual") { scores[n].fishCatch += 4; }
                                else { scores[n][val_vote] += 4; };
                                scores[n].total += 4;
                            };
							// Was the vote unanimous?
                            if (results[i].voteUnanimous == responses[j].voteUnanimous && responses[j].voteUnanimous) {
                                if (calcType === "individual") { scores[n].voteUnanimous += 4; }
                                else { scores[n][val_vote] += 4; };
                                scores[n].total += 4;
                            };
							// Did Jeff laugh at / make fun of the team in last place?
                            if (results[i].jeffJoke == responses[j].jeffJoke && responses[j].jeffJoke) {
                                if (calcType === "individual") { scores[n].jeffJoke += 4; }
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
                            if ((results[i].reward === 'team_red' || results[i].reward2 === 'team_red') && inArray(responses[j].reward, team_red) && responses[j].reward) {
                                if (calcType === "individual") { scores[n].reward += 5; }
                                else { scores[n][val_vote] += 5; }
                                scores[n].total += 5;
                            } else if ((results[i].reward === 'team_yellow' || results[i].reward2 === 'team_yellow') && inArray(responses[j].reward, team_yellow) && responses[j].reward) {
                                if (calcType === "individual") { scores[n].reward += 5; }
                                else { scores[n][val_vote] += 5; };
                                scores[n].total += 5;
                            } else if ((results[i].reward === 'team_blue' || results[i].reward2 === 'team_blue') && inArray(responses[j].reward, team_blue) && responses[j].reward) {
                                if (calcType === "individual") { scores[n].reward += 5; }
                                else { scores[n][val_vote] += 5; };
                                scores[n].total += 5;
                            };
                            // Immunity
                            if ((results[i].immunity === 'team_red' || results[i].immunity2 === 'team_red') && inArray(responses[j].immunity, team_red) && responses[j].immunity) {
                                if (calcType === "individual") { scores[n].immunity += 5; }
                                else { scores[n][val_vote] += 5; };
                                scores[n].total += 5;
                            } else if ((results[i].immunity === 'team_yellow' || results[i].immunity2 === 'team_yellow')  && inArray(responses[j].immunity, team_yellow) && responses[j].immunity) {
                                if (calcType === "individual") { scores[n].immunity += 5; }
                                else { scores[n][val_vote] += 5; };
                                scores[n].total += 5;
                            } else if ((results[i].immunity === 'team_blue' || results[i].immunity2 === 'team_blue')  && inArray(responses[j].immunity, team_blue) && responses[j].immunity) {
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
							// Was a fish caught during the episode?
                            if (results[i].fishCatch == responses[j].fishCatch && responses[j].fishCatch) {
                                if (calcType === "individual") { scores[n].fishCatch += 2; }
                                else { scores[n][val_vote] += 2; };
                                scores[n].total += 2;
                            };
							// Was the vote unanimous?
                            if (results[i].voteUnanimous == responses[j].voteUnanimous && responses[j].voteUnanimous) {
                                if (calcType === "individual") { scores[n].voteUnanimous += 2; }
                                else { scores[n][val_vote] += 2; };
                                scores[n].total += 2;
                            };
							// Did Jeff laugh at / make fun of the team in last place?
                            if (results[i].jeffJoke == responses[j].jeffJoke && responses[j].jeffJoke) {
                                if (calcType === "individual") { scores[n].jeffJoke += 2; }
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
                if (cur_vote === 11) {	// only submited responses to this question during week 10
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
            } else if (castaways['place_'+String([i])] === "Caroline") {	// seventh
                sum += Math.pow(Math.abs(i-7),2.25)
				if (i===7) { bonus += 5 };
            } else if (castaways['place_'+String([i])] === "Kyle") {	// eighth
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
		 //top three!
		'Andy', 'Rachel', 'Sam',
		'Genevieve', 'Teeny',
		'Sue'
	]; 
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
						scores[n]['Final Three'] += 50;
						scores[n].total += 50;
					};
					if (inArray(result[i].pick_2, top_three)){
						scores[n]['Final Three'] += 50;
						scores[n].total += 50;
					};
					if (inArray(result[i].pick_3, top_three)){
						scores[n]['Final Three'] += 50;
						scores[n].total += 50;
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
        'date': '9/18/24',
        'merge': 'No',
        'reward': 'team_red', 
		'reward2': 'team_blue',
        'immunity': 'team_red',
		'immunity2': 'team_blue',
        'eliminated': 'Jon',
        'idolFound': 'Yes',
        'idolPlayed': 'No',
        'titleQuote': 'Jon',
		'summit': ['Aysha', 'TK'],
        'nudity': 'No',
		'shotInTheDark': 'No',
        'team_yellow': ['Andy', 'Anika', 'Jon', 'Rachel', 'Sam', 'Sierra'],
        'team_red': ['Aysha', 'Genevieve', 'Kishan', 'Rome', 'Sol', 'Teeny'],
		'team_blue': ['Caroline', 'Gabe', 'Kyle', 'Sue', 'Tiyana', 'TK']
    },
	{	'vote': 2,
        'date': '9/25/24',
        'merge': 'No',
        'reward': 'team_yellow', 
		'reward2': 'team_red',
        'immunity': 'team_yellow',
		'immunity2': 'team_red',
        'eliminated': 'TK',
        'idolFound': 'Yes',
        'idolPlayed': 'No',
        'titleQuote': 'Jon', // actually Sue but I messed up so have to give folks points
		'summit': '',
        'nudity': 'No',
		'shotInTheDark': 'No',
        'team_yellow': ['Andy', 'Anika', 'Rachel', 'Sam', 'Sierra'],
        'team_red': ['Aysha', 'Genevieve', 'Kishan', 'Rome', 'Sol', 'Teeny'],
		'team_blue': ['Caroline', 'Gabe', 'Kyle', 'Sue', 'Tiyana', 'TK']
    },
	{	'vote': 3,
		'date': '10/2/24',
        'merge': 'No',
        'reward': 'team_yellow',
        'immunity': 'team_yellow',
		'immunity2': 'team_blue',
        'eliminated': 'Aysha',
        'idolFound': 'No',
        'idolPlayed': 'Yes',
        'titleQuote': 'Jeff Probst',
		'summit': ['Rome', 'Kyle', 'Anika'],
        'nudity': 'No',
		'shotInTheDark': 'No',
		'fishCatch': 'Yes',
		'voteUnanimous': 'No',
		'jeffJoke': 'No',
        'team_yellow': ['Andy', 'Anika', 'Rachel', 'Sam', 'Sierra'],
        'team_red': ['Aysha', 'Genevieve', 'Kishan', 'Rome', 'Sol', 'Teeny'],
		'team_blue': ['Caroline', 'Gabe', 'Kyle', 'Sue', 'Tiyana']
    },
	{	'vote': 4,
		'date': '10/9/24',
        'merge': 'No',
        'reward': 'team_yellow',
        'immunity': 'team_yellow',
		'immunity2': 'team_blue',
        'eliminated': 'Kishan',
        'idolFound': 'Yes',
        'idolPlayed': 'No',
        'titleQuote': 'Tiyana',
		'summit': ['Andy', 'Teeny', 'Caroline'],
        'nudity': 'No',
		'shotInTheDark': 'No',
		'fishCatch': 'No',
		'voteUnanimous': 'Yes',
		'jeffJoke': 'Yes',
        'team_yellow': ['Andy', 'Anika', 'Rachel', 'Sam', 'Sierra'],
        'team_red': ['Genevieve', 'Kishan', 'Rome', 'Sol', 'Teeny'],
		'team_blue': ['Caroline', 'Gabe', 'Kyle', 'Sue', 'Tiyana']
    },
	{	'vote': 5,
		'date': '10/16/24',
        'merge': 'No',
        'reward': 'team_yellow',
        'immunity': 'team_red',
		'immunity2': 'team_blue',
        'eliminated': 'Anika',
        'idolFound': 'No',
        'idolPlayed': 'No',
        'titleQuote': 'Genevieve',
		'summit': '',
        'nudity': 'No',
		'shotInTheDark': 'No',
		'fishCatch': 'No',
		'voteUnanimous': 'No',
		'jeffJoke': 'No',
        'team_yellow': ['Rachel', 'Sam', 'Teeny', 'Caroline', 'Kyle', 'Sue', 'Tiyana'],
        'team_red': ['Genevieve', 'Rome', 'Sol', 'Teeny'],
		'team_blue': ['Caroline', 'Gabe', 'Kyle', 'Sue', 'Tiyana']
    },
	{	'vote': 6,
		'date': '10/23/24',
        'merge': 'Yes',
        'reward': 'team_yellow',
        'immunity': 'Kyle',
        'eliminated': 'Rome',
        'idolFound': 'Yes',
        'idolPlayed': 'No',
        'titleQuote': 'Andy',
		'summit': '',
        'nudity': 'No',
		'shotInTheDark': 'No',
		'fishCatch': 'No',
		'voteUnanimous': 'No',
		'jeffJoke': 'No',
        'team_yellow': ['Rachel', 'Sam', 'Teeny', 'Genevieve', 'Kyle', 'Sue', 'Tiyana']
    },
	{	'vote': 7,
		'date': '10/30/24',
        'merge': 'Yes',
        'reward': 'team_yellow',
        'immunity': 'Kyle',
        'eliminated': 'Tiyana',
        'idolFound': 'Yes',
        'idolPlayed': 'Yes',
        'titleQuote': 'Tiyana',
		'summit': '',
        'nudity': 'No',
		'shotInTheDark': 'No',
		'fishCatch': 'No',
		'voteUnanimous': 'Yes',
		'jeffJoke': 'No',
        'team_yellow': ['Sierra', 'Sam', 'Teeny', 'Genevieve', 'Sol', 'Andy']
    },
	{	'vote': 8,
		'date': '11/6/24',
        'merge': 'Yes',
        'reward': 'team_yellow',
        'immunity': 'Kyle',
        'eliminated': 'Sierra',
        'idolFound': 'Yes',
        'idolPlayed': 'No',
        'titleQuote': 'Andy',
		'summit': '',
        'nudity': 'No',
		'shotInTheDark': 'Yes',
		'fishCatch': 'No',
		'voteUnanimous': 'No',
		'jeffJoke': 'No',
        'team_yellow': ['Sierra', 'Rachel', 'Sam', 'Genevieve', 'Sol', 'Teeny', 'Caroline', 'Gabe', 'Kyle', 'Sue']
    },
	{	'vote': 9,
		'date': '11/13/24',
        'merge': 'Yes',
        'reward': 'team_yellow',
        'immunity': 'Gabe',
        'eliminated': 'Sol',
        'idolFound': 'No',
        'idolPlayed': 'No',
        'titleQuote': 'Andy',
		'summit': ['Rachel', 'Sam', 'Caroline', 'Andy'],
        'nudity': 'No',
		'shotInTheDark': 'No',
		'fishCatch': 'No',
		'voteUnanimous': 'No',
		'jeffJoke': 'No',
        'team_yellow': ['Sol', 'Teeny', 'Gabe', 'Kyle']
    },
	{	'vote': 10,
		'date': '11/20/24',
        'merge': 'Yes',
        'reward': ['Kyle', 'Rachel', 'Sam'],
        'immunity': 'Kyle',
        'eliminated': 'Gabe',
        'idolFound': 'No',
        'idolPlayed': 'No',
        'titleQuote': 'Gabe',
		'summit': '',
        'nudity': 'No',
		'shotInTheDark': 'No',
		'fishCatch': 'No',
		'voteUnanimous': 'No',
		'jeffJoke': 'No'
    },
	{	'vote': 11,
		'date': '11/27/24',
        'merge': 'Yes',
        'reward': '',
        'immunity': 'Rachel',
        'eliminated': 'Kyle',
        'idolFound': 'Yes',
        'idolPlayed': 'No',
        'titleQuote': 'Andy',
		'summit': 'Rachel',
        'nudity': 'No',
		'shotInTheDark': 'No',
		'fishCatch': 'No',
		'voteUnanimous': 'No',
		'jeffJoke': 'No'
    },
	{	'vote': 12,
		'date': '12/4/24',
        'merge': 'Yes',
        'reward': 'Sam',
        'immunity': 'Rachel',
        'eliminated': 'Caroline',
        'idolFound': 'No',
        'idolPlayed': 'No',
        'titleQuote': 'Andy',
		'summit': '',
        'nudity': 'No',
		'shotInTheDark': 'No',
		'fishCatch': 'No',
		'voteUnanimous': 'No',
		'jeffJoke': 'No'
    }
];

var saved_responses = [
	// WEEK 2
	{'name':'Abby', 'reward':'Sue', 'immunity':'Sierra', 'eliminated':'Teeny', 'safe':'Kyle', 'titleQuote':'Genevieve', 'summit':'Kyle', 'nudity':'No', 'idolFound':'Yes', 'idolPlayed':'No', 'shotInTheDark':'No', 'submit_time':'2024-09-25T08:55:00.000Z', 'pick_1':'Genevieve', 'pick_2':'Sol', 'pick_3':'Tiyana'},
	{'name':'Christy', 'reward':'Rome', 'immunity':'Aysha', 'eliminated':'Andy', 'safe':'Rome', 'titleQuote':'Andy', 'summit':'Teeny', 'nudity':'No', 'idolFound':'Yes', 'idolPlayed':'No', 'shotInTheDark':'No', 'submit_time':'2024-09-25T09:26:00.000Z', 'pick_1':'Aysha', 'pick_2':'Teeny', 'pick_3':'Sue'},
	{'name':'Betsy', 'reward':'Sam', 'immunity':'Sol', 'eliminated':'Andy', 'safe':'Anika', 'titleQuote':'Jon', 'summit':'Sam', 'nudity':'No', 'idolFound':'Yes', 'idolPlayed':'No', 'shotInTheDark':'No', 'submit_time':'2024-09-25T14:36:00.000Z', 'pick_1':'Sol', 'pick_2':'Caroline', 'pick_3':'Sue'},
	{'name':'Greg', 'reward':'TK', 'immunity':'TK', 'eliminated':'Sierra', 'safe':'Teeny', 'titleQuote':'Jeff Probst', 'summit':'Andy', 'nudity':'No', 'idolFound':'Yes', 'idolPlayed':'No', 'shotInTheDark':'No', 'submit_time':'2024-09-25T16:47:00.000Z', 'pick_1':'Aysha', 'pick_2':'Rome', 'pick_3':'Sue'},
	{'name':'Josh', 'reward':'Andy', 'immunity':'Andy', 'eliminated':'TK', 'safe':'Rachel', 'titleQuote':'Teeny', 'summit':'Gabe', 'nudity':'No', 'idolFound':'Yes', 'idolPlayed':'No', 'shotInTheDark':'No', 'submit_time':'2024-09-25T18:07:00.000Z', 'pick_1':'Rachel', 'pick_2':'Genevieve', 'pick_3':'Sue'},
	{'name':'Anastassia', 'reward':'Sol', 'immunity':'Sol', 'eliminated':'Gabe', 'safe':'Sol', 'titleQuote':'Aysha', 'summit':'Rachel', 'nudity':'No', 'idolFound':'Yes', 'idolPlayed':'No', 'shotInTheDark':'No', 'submit_time':'2024-09-26T11:47:00.000Z', 'pick_1':'Sierra', 'pick_2':'Sol', 'pick_3':'Sue'},
	{'name':'Ethan', 'reward':'Sam', 'immunity':'Sam', 'eliminated':'Rome', 'safe':'Sol', 'titleQuote':'Anika', 'summit':'Rachel', 'nudity':'No', 'idolFound':'Yes', 'idolPlayed':'No', 'shotInTheDark':'No', 'submit_time':'2024-09-26T11:51:00.000Z', 'pick_1':'Sierra', 'pick_2':'Teeny', 'pick_3':'Tiyana'},
	{'name':'Erika', 'reward':'TK', 'immunity':'Aysha', 'eliminated':'Tiyana', 'safe':'Teeny', 'titleQuote':'Jon', 'summit':'Rome', 'nudity':'No', 'idolFound':'Yes', 'idolPlayed':'No', 'shotInTheDark':'No', 'submit_time':'2024-09-26T12:46:00.000Z', 'pick_1':'Rachel', 'pick_2':'Sam', 'pick_3':'Teeny'},
	{'name':'Wilson', 'reward':'Sol', 'immunity':'Kyle', 'eliminated':'Andy', 'safe':'Genevieve', 'titleQuote':'Jon', 'summit':'Kishan', 'nudity':'No', 'idolFound':'Yes', 'idolPlayed':'No', 'shotInTheDark':'No', 'submit_time':'2024-09-26T13:07:00.000Z', 'pick_1':'Genevieve', 'pick_2':'Sol', 'pick_3':'TK'},
	// WEEK 3
	{'name':'Wilson', 'reward':'Sam', 'immunity':'Genevieve', 'eliminated':'Gabe', 'safe':'Anika', 'titleQuote':'Jeff Probst', 'summit':'Rome', 'nudity':'No', 'idolFound':'Yes', 'idolPlayed':'Yes', 'shotInTheDark':'No', 'submit_time':'2024-10-02T17:03:00.000Z', 'fishCatch':'Yes', 'voteUnanimous':'No', 'jeffJoke':'Yes'},
	{'name':'Betsy', 'reward':'Andy', 'immunity':'Sam', 'eliminated':'Rome', 'safe':'Anika', 'titleQuote':'Kyle', 'summit':'Kishan', 'nudity':'No', 'idolFound':'Yes', 'idolPlayed':'Yes', 'shotInTheDark':'No', 'submit_time':'2024-10-03T11:23:00.000Z', 'fishCatch':'Yes', 'voteUnanimous':'No', 'jeffJoke':'Yes'},
	{'name':'Anastassia', 'reward':'Sol', 'immunity':'Kishan', 'eliminated':'Anika', 'safe':'Sol', 'titleQuote':'Sam', 'summit':'Teeny', 'nudity':'No', 'idolFound':'No', 'idolPlayed':'No', 'shotInTheDark':'No', 'submit_time':'2024-10-03T13:23:00.000Z', 'fishCatch':'No', 'voteUnanimous':'No', 'jeffJoke':'No'},
	{'name':'Ethan', 'reward':'Gabe', 'immunity':'Gabe', 'eliminated':'Aysha', 'safe':'Sam', 'titleQuote':'Sam', 'summit':'Teeny', 'nudity':'No', 'idolFound':'No', 'idolPlayed':'Yes', 'shotInTheDark':'No', 'submit_time':'2024-10-03T13:25:00.000Z', 'fishCatch':'Yes', 'voteUnanimous':'No', 'jeffJoke':'No'},
	{'name':'Erika', 'reward':'Sam', 'immunity':'Kyle', 'eliminated':'Aysha', 'safe':'Caroline', 'titleQuote':'Jeff Probst', 'summit':'Teeny', 'nudity':'No', 'idolFound':'Yes', 'idolPlayed':'Yes', 'shotInTheDark':'No', 'submit_time':'2024-10-03T19:14:00.000Z', 'fishCatch':'Yes', 'voteUnanimous':'No', 'jeffJoke':'Yes'},
	{'name':'Greg', 'reward':'Andy', 'immunity':'Andy', 'eliminated':'Kishan', 'safe':'Sue', 'titleQuote':'Gabe', 'summit':'Rome', 'nudity':'No', 'idolFound':'Yes', 'idolPlayed':'No', 'shotInTheDark':'No', 'submit_time':'2024-10-04T11:15:00.000Z', 'fishCatch':'Yes', 'voteUnanimous':'No', 'jeffJoke':'No'},
	{'name':'Josh', 'reward':'Andy', 'immunity':'Andy', 'eliminated':'Aysha', 'safe':'Rachel', 'titleQuote':'Sierra', 'summit':'Sierra', 'nudity':'No', 'idolFound':'No', 'idolPlayed':'No', 'shotInTheDark':'No', 'submit_time':'2024-10-04T17:04:00.000Z', 'fishCatch':'No', 'voteUnanimous':'Yes', 'jeffJoke':'No'},
	// WEEK 4
	{'name':'Wilson', 'reward':'Genevieve', 'immunity':'Tiyana', 'eliminated':'Andy', 'safe':'Sol', 'titleQuote':'Tiyana', 'summit':'Genevieve', 'nudity':'No', 'idolFound':'Yes', 'idolPlayed':'No', 'shotInTheDark':'No', 'submit_time':'2024-10-09T17:04:00.000Z', 'fishCatch':'Yes', 'voteUnanimous':'No', 'jeffJoke':'Yes'},
	{'name':'Ethan', 'reward':'Kyle', 'immunity':'Kyle', 'eliminated':'Rome', 'safe':'Sierra', 'titleQuote':'Sol', 'summit':'Caroline', 'nudity':'No', 'idolFound':'Yes', 'idolPlayed':'No', 'shotInTheDark':'No', 'submit_time':'2024-10-09T19:04:00.000Z', 'fishCatch':'No', 'voteUnanimous':'No', 'jeffJoke':'No'},
	{'name':'Anastassia', 'reward':'Sierra', 'immunity':'Sierra', 'eliminated':'Sol', 'safe':'Sierra', 'titleQuote':'Gabe', 'summit':'Sierra', 'nudity':'No', 'idolFound':'Yes', 'idolPlayed':'No', 'shotInTheDark':'No', 'submit_time':'2024-10-09T20:04:00.000Z', 'fishCatch':'Yes', 'voteUnanimous':'No', 'jeffJoke':'Yes'},
	{'name':'Betsy', 'reward':'Sue', 'immunity':'Sam', 'eliminated':'Sol', 'safe':'Anika', 'titleQuote':'Gabe', 'summit':'Rome', 'nudity':'No', 'idolFound':'Yes', 'idolPlayed':'Yes', 'shotInTheDark':'No', 'submit_time':'2024-10-10T07:04:00.000Z', 'fishCatch':'Yes', 'voteUnanimous':'No', 'jeffJoke':'No'},
	{'name':'Erika', 'reward':'Teeny', 'immunity':'Sam', 'eliminated':'Kishan', 'safe':'Genevieve', 'titleQuote':'Tiyana', 'summit':'Andy', 'nudity':'No', 'idolFound':'Yes', 'idolPlayed':'No', 'shotInTheDark':'No', 'submit_time':'2024-10-10T10:04:00.000Z', 'fishCatch':'No', 'voteUnanimous':'No', 'jeffJoke':'Yes'},
	{'name':'Greg', 'reward':'Sierra', 'immunity':'Andy', 'eliminated':'Gabe', 'safe':'Rachel', 'titleQuote':'Gabe', 'summit':'Sol', 'nudity':'No', 'idolFound':'No', 'idolPlayed':'No', 'shotInTheDark':'No', 'submit_time':'2024-10-10T16:04:00.000Z', 'fishCatch':'Yes', 'voteUnanimous':'No', 'jeffJoke':'Yes'},
	// WEEK 5
	{'name':'Wilson', 'reward':'Sam', 'immunity':'Genevieve', 'eliminated':'Rome', 'safe':'Tiyana', 'titleQuote':'Rome', 'summit':'Andy', 'nudity':'No', 'idolFound':'Yes', 'idolPlayed':'Yes', 'shotInTheDark':'No', 'submit_time':'2024-10-16T16:04:00.000Z', 'fishCatch':'Yes', 'voteUnanimous':'No', 'jeffJoke':'Yes'},
	{'name':'Erika', 'reward':'Sam', 'immunity':'Rachel', 'eliminated':'Kyle', 'safe':'Genevieve', 'titleQuote':'Rome', 'summit':'Caroline', 'nudity':'No', 'idolFound':'No', 'idolPlayed':'Yes', 'shotInTheDark':'No', 'submit_time':'2024-10-16T17:04:00.000Z', 'fishCatch':'No', 'voteUnanimous':'No', 'jeffJoke':'Yes'},
	{'name':'Betsy', 'reward':'Gabe', 'immunity':'Sam', 'eliminated':'Sol', 'safe':'Sam', 'titleQuote':'Jeff Probst', 'summit':'Rachel', 'nudity':'No', 'idolFound':'Yes', 'idolPlayed':'No', 'shotInTheDark':'No', 'submit_time':'2024-10-16T18:04:00.000Z', 'fishCatch':'Yes', 'voteUnanimous':'No', 'jeffJoke':'No'},
	{'name':'Greg', 'reward':'Gabe', 'immunity':'Sam', 'eliminated':'Rome', 'safe':'Andy', 'titleQuote':'Andy', 'summit':'Sol', 'nudity':'No', 'idolFound':'No', 'idolPlayed':'No', 'shotInTheDark':'No', 'submit_time':'2024-10-18T09:04:00.000Z', 'fishCatch':'Yes', 'voteUnanimous':'No', 'jeffJoke':'Yes'},
	{'name':'Anastassia', 'reward':'Sam', 'immunity':'Sierra', 'eliminated':'Kyle', 'safe':'Sierra', 'titleQuote':'Rome', 'summit':'Sue', 'nudity':'No', 'idolFound':'No', 'idolPlayed':'No', 'shotInTheDark':'No', 'submit_time':'2024-10-18T21:04:00.000Z', 'fishCatch':'Yes', 'voteUnanimous':'No', 'jeffJoke':'No'},
	{'name':'Ethan', 'reward':'Sierra', 'immunity':'Sierra', 'eliminated':'Tiyana', 'safe':'Sierra', 'titleQuote':'Rome', 'summit':'Genevieve', 'nudity':'No', 'idolFound':'No', 'idolPlayed':'No', 'shotInTheDark':'No', 'submit_time':'2024-10-18T21:04:00.000Z', 'fishCatch':'No', 'voteUnanimous':'No', 'jeffJoke':'No'},
	// WEEK 6
	{'name':'Betsy', 'reward':'Kyle', 'immunity':'Gabe', 'eliminated':'Teeny', 'safe':'Kyle', 'titleQuote':'Jeff Probst', 'summit':'Sam', 'nudity':'No', 'idolFound':'No', 'idolPlayed':'Yes', 'shotInTheDark':'No', 'submit_time':'2024-10-23T12:04:00.000Z', 'fishCatch':'Yes', 'voteUnanimous':'No', 'jeffJoke':'No'},
	{'name':'Wilson', 'reward':'Sam', 'immunity':'Genevieve', 'eliminated':'Rome', 'safe':'Sol', 'titleQuote':'Sierra', 'summit':'Sam', 'nudity':'No', 'idolFound':'Yes', 'idolPlayed':'Yes', 'shotInTheDark':'No', 'submit_time':'2024-10-23T16:04:00.000Z', 'fishCatch':'No', 'voteUnanimous':'No', 'jeffJoke':'Yes'},
	{'name':'Erika', 'reward':'Rome', 'immunity':'Rome', 'eliminated':'Gabe', 'safe':'Sam', 'titleQuote':'Jeff Probst', 'summit':'Sol', 'nudity':'No', 'idolFound':'Yes', 'idolPlayed':'Yes', 'shotInTheDark':'No', 'submit_time':'2024-10-23T16:04:00.000Z', 'fishCatch':'Yes', 'voteUnanimous':'No', 'jeffJoke':'Yes'},
	{'name':'Anastassia', 'reward':'Sam', 'immunity':'Rachel', 'eliminated':'Tiyana', 'safe':'Kyle', 'titleQuote':'Sam', 'summit':'Sam', 'nudity':'No', 'idolFound':'Yes', 'idolPlayed':'No', 'shotInTheDark':'No', 'submit_time':'2024-10-23T19:04:00.000Z', 'fishCatch':'Yes', 'voteUnanimous':'No', 'jeffJoke':'No'},
	{'name':'Ethan', 'reward':'Sam', 'immunity':'Sam', 'eliminated':'Tiyana', 'safe':'Sam', 'titleQuote':'Sam', 'summit':'Sam', 'nudity':'No', 'idolFound':'No', 'idolPlayed':'No', 'shotInTheDark':'No', 'submit_time':'2024-10-23T19:04:00.000Z', 'fishCatch':'No', 'voteUnanimous':'No', 'jeffJoke':'No'},
	{'name':'Greg', 'reward':'Gabe', 'immunity':'Gabe', 'eliminated':'Teeny', 'safe':'Caroline', 'titleQuote':'Andy', 'summit':'Rachel', 'nudity':'No', 'idolFound':'Yes', 'idolPlayed':'No', 'shotInTheDark':'No', 'submit_time':'2024-10-27T09:04:00.000Z', 'fishCatch':'Yes', 'voteUnanimous':'No', 'jeffJoke':'Yes'},
	// WEEK 7
	{'name':'Greg', 'reward':'Gabe', 'immunity':'Gabe', 'eliminated':'Teeny', 'safe':'Caroline', 'titleQuote':'Andy', 'summit':'Rachel', 'nudity':'No', 'idolFound':'Yes', 'idolPlayed':'No', 'shotInTheDark':'No', 'submit_time':'2024-10-27T09:04:00.000Z', 'fishCatch':'Yes', 'voteUnanimous':'No', 'jeffJoke':'Yes'},
	{'name':'Erika', 'reward':'Sam', 'immunity':'Sierra', 'eliminated':'Gabe', 'safe':'Sue', 'titleQuote':'Teeny', 'summit':'Rachel', 'nudity':'No', 'idolFound':'Yes', 'idolPlayed':'No', 'shotInTheDark':'No', 'submit_time':'2024-10-30T16:04:00.000Z', 'fishCatch':'No', 'voteUnanimous':'No', 'jeffJoke':'Yes'},
	{'name':'Betsy', 'reward':'Andy', 'immunity':'Sue', 'eliminated':'Sam', 'safe':'Sol', 'titleQuote':'Teeny', 'summit':'Sierra', 'nudity':'No', 'idolFound':'Yes', 'idolPlayed':'Yes', 'shotInTheDark':'No', 'submit_time':'2024-10-31T11:04:00.000Z', 'fishCatch':'Yes', 'voteUnanimous':'No', 'jeffJoke':'No'},
	{'name':'Ethan', 'reward':'Kyle', 'immunity':'Kyle', 'eliminated':'Tiyana', 'safe':'Kyle', 'titleQuote':'Andy', 'summit':'Sol', 'nudity':'No', 'idolFound':'Yes', 'idolPlayed':'No', 'shotInTheDark':'No', 'submit_time':'2024-10-31T11:04:00.000Z', 'fishCatch':'No', 'voteUnanimous':'No', 'jeffJoke':'No'},
	{'name':'Anastassia', 'reward':'Tiyana', 'immunity':'Tiyana', 'eliminated':'Kyle', 'safe':'Sierra', 'titleQuote':'Sam', 'summit':'Sol', 'nudity':'No', 'idolFound':'Yes', 'idolPlayed':'No', 'shotInTheDark':'No', 'submit_time':'2024-10-31T11:04:00.000Z', 'fishCatch':'No', 'voteUnanimous':'No', 'jeffJoke':'No'},
	{'name':'Wilson', 'reward':'Sol', 'immunity':'Genevieve', 'eliminated':'Andy', 'safe':'Sierra', 'titleQuote':'Teeny', 'summit':'Sam', 'nudity':'No', 'idolFound':'Yes', 'idolPlayed':'No', 'shotInTheDark':'No', 'submit_time':'2024-10-31T11:04:00.000Z', 'fishCatch':'Yes', 'voteUnanimous':'No', 'jeffJoke':'Yes'},
	// WEEK 8
	{'name':'Erika', 'reward':'Andy', 'immunity':'Sol', 'eliminated':'Sierra', 'safe':'Teeny', 'titleQuote':'Rachel', 'summit':'Kyle', 'nudity':'No', 'idolFound':'Yes', 'idolPlayed':'Yes', 'shotInTheDark':'No', 'submit_time':'2024-11-06T15:04:00.000Z', 'fishCatch':'No', 'voteUnanimous':'No', 'jeffJoke':'Yes'},
	{'name':'Wilson', 'reward':'Sam', 'immunity':'Genevieve', 'eliminated':'Sam', 'safe':'Teeny', 'titleQuote':'Sue', 'summit':'Caroline', 'nudity':'No', 'idolFound':'Yes', 'idolPlayed':'Yes', 'shotInTheDark':'No', 'submit_time':'2024-11-06T16:04:00.000Z', 'fishCatch':'Yes', 'voteUnanimous':'No', 'jeffJoke':'Yes'},
	{'name':'Betsy', 'reward':'Kyle', 'immunity':'Sue', 'eliminated':'Gabe', 'safe':'Rachel', 'titleQuote':'Gabe', 'summit':'Rachel', 'nudity':'No', 'idolFound':'Yes', 'idolPlayed':'Yes', 'shotInTheDark':'No', 'submit_time':'2024-11-06T17:04:00.000Z', 'fishCatch':'No', 'voteUnanimous':'No', 'jeffJoke':'No'},
	{'name':'Ethan', 'reward':'Kyle', 'immunity':'Kyle', 'eliminated':'Sam', 'safe':'Kyle', 'titleQuote':'Sol', 'summit':'Sol', 'nudity':'No', 'idolFound':'No', 'idolPlayed':'No', 'shotInTheDark':'No', 'submit_time':'2024-11-07T10:04:00.000Z', 'fishCatch':'No', 'voteUnanimous':'No', 'jeffJoke':'No'},
	{'name':'Anastassia', 'reward':'Kyle', 'immunity':'Kyle', 'eliminated':'Sam', 'safe':'Kyle', 'titleQuote':'Andy', 'summit':'Andy', 'nudity':'No', 'idolFound':'Yes', 'idolPlayed':'No', 'shotInTheDark':'No', 'submit_time':'2024-11-07T10:04:00.000Z', 'fishCatch':'No', 'voteUnanimous':'No', 'jeffJoke':'No'},
	{'name':'Greg', 'reward':'Kyle', 'immunity':'Kyle', 'eliminated':'Gabe', 'safe':'Andy', 'titleQuote':'Rachel', 'summit':'Caroline', 'nudity':'No', 'idolFound':'Yes', 'idolPlayed':'No', 'shotInTheDark':'No', 'submit_time':'2024-11-07T11:04:00.000Z', 'fishCatch':'No', 'voteUnanimous':'No', 'jeffJoke':'Yes'},
	// WEEK 9
	{'name':'Erika', 'reward':'Sol', 'immunity':'Caroline', 'eliminated':'Kyle', 'safe':'Teeny', 'titleQuote':'Sam', 'summit':'Andy', 'nudity':'No', 'idolFound':'Yes', 'idolPlayed':'Yes', 'shotInTheDark':'No', 'submit_time':'2024-11-13T16:04:00.000Z', 'fishCatch':'No', 'voteUnanimous':'No', 'jeffJoke':'Yes'},
	{'name':'Wilson', 'reward':'Gabe', 'immunity':'Genevieve', 'eliminated':'Kyle', 'safe':'Rachel', 'titleQuote':'Teeny', 'summit':'Sam', 'nudity':'No', 'idolFound':'Yes', 'idolPlayed':'Yes', 'shotInTheDark':'No', 'submit_time':'2024-11-13T17:04:00.000Z', 'fishCatch':'Yes', 'voteUnanimous':'No', 'jeffJoke':'Yes'},
	{'name':'Betsy', 'reward':'Sam', 'immunity':'Sam', 'eliminated':'Andy', 'safe':'Rachel', 'titleQuote':'Genevieve', 'summit':'Sam', 'nudity':'No', 'idolFound':'No', 'idolPlayed':'Yes', 'shotInTheDark':'No', 'submit_time':'2024-11-13T18:04:00.000Z', 'fishCatch':'No', 'voteUnanimous':'No', 'jeffJoke':'No'},
	{'name':'Greg', 'reward':'Kyle', 'immunity':'Kyle', 'eliminated':'Sam', 'safe':'Teeny', 'titleQuote':'Andy', 'summit':'Andy', 'nudity':'No', 'idolFound':'No', 'idolPlayed':'Yes', 'shotInTheDark':'No', 'submit_time':'2024-11-14T20:04:00.000Z', 'fishCatch':'No', 'voteUnanimous':'No', 'jeffJoke':'No'},
	{'name':'Ethan', 'reward':'Sam', 'immunity':'Genevieve', 'eliminated':'Kyle', 'safe':'Rachel', 'titleQuote':'Sam', 'summit':'Sue', 'nudity':'No', 'idolFound':'No', 'idolPlayed':'No', 'shotInTheDark':'No', 'submit_time':'2024-11-14T20:04:00.000Z', 'fishCatch':'No', 'voteUnanimous':'No', 'jeffJoke':'No'},
	{'name':'Anastassia', 'reward':'Sam', 'immunity':'Genevieve', 'eliminated':'Kyle', 'safe':'Rachel', 'titleQuote':'Andy', 'summit':'Sue', 'nudity':'No', 'idolFound':'No', 'idolPlayed':'No', 'shotInTheDark':'No', 'submit_time':'2024-11-14T20:04:00.000Z', 'fishCatch':'No', 'voteUnanimous':'No', 'jeffJoke':'No'},
	// WEEK 10
	{'name':'Erika', 'reward':'Andy', 'immunity':'Kyle', 'eliminated':'Caroline', 'safe':'Teeny', 'titleQuote':'Andy', 'summit':'Sam', 'nudity':'No', 'idolFound':'Yes', 'idolPlayed':'No', 'shotInTheDark':'No', 'submit_time':'2024-11-20T16:04:00.000Z', 'fishCatch':'No', 'voteUnanimous':'No', 'jeffJoke':'Yes'},
	{'name':'Wilson', 'reward':'Gabe', 'immunity':'Genevieve', 'eliminated':'Kyle', 'safe':'Andy', 'titleQuote':'Jeff Probst', 'summit':'Sam', 'nudity':'No', 'idolFound':'Yes', 'idolPlayed':'No', 'shotInTheDark':'No', 'submit_time':'2024-11-21T11:04:00.000Z', 'fishCatch':'No', 'voteUnanimous':'Yes', 'jeffJoke':'Yes'},
	{'name':'Ethan', 'reward':'Sam', 'immunity':'Genevieve', 'eliminated':'Sue', 'safe':'Rachel', 'titleQuote':'Andy', 'summit':'Sue', 'nudity':'No', 'idolFound':'No', 'idolPlayed':'No', 'shotInTheDark':'No', 'submit_time':'2024-11-21T11:04:00.000Z', 'fishCatch':'No', 'voteUnanimous':'No', 'jeffJoke':'No'},
	{'name':'Anastassia', 'reward':'Sam', 'immunity':'Sam', 'eliminated':'Kyle', 'safe':'Rachel', 'titleQuote':'Gabe', 'summit':'Sue', 'nudity':'No', 'idolFound':'No', 'idolPlayed':'No', 'shotInTheDark':'No', 'submit_time':'2024-11-21T11:04:00.000Z', 'fishCatch':'No', 'voteUnanimous':'No', 'jeffJoke':'No'},
	// WEEK 11
	{'name':'Ethan', 'reward':'Kyle', 'immunity':'Sue', 'titleQuote':'Kyle', 'summit':'Sue', 'nudity':'No', 'idolFound':'No', 'idolPlayed':'No', 'shotInTheDark':'No', 'submit_time':'2024-11-26T12:04:00.000Z', 'fishCatch':'No', 'voteUnanimous':'No', 'jeffJoke':'No','place_1':'Rachel','place_2':'Andy','place_3':'Teeny','place_4':'Caroline','place_5':'Genevieve','place_6':'Sam','place_7':'Sue','place_8':'Kyle'},
	{'name':'Wilson', 'reward':'Genevieve', 'immunity':'Kyle', 'titleQuote':'Kyle', 'summit':'Rachel', 'nudity':'No', 'idolFound':'No', 'idolPlayed':'Yes', 'shotInTheDark':'No', 'submit_time':'2024-11-28T11:04:00.000Z', 'fishCatch':'No', 'voteUnanimous':'Yes', 'jeffJoke':'Yes','place_1':'Rachel','place_2':'Caroline','place_3':'Andy','place_4':'Kyle','place_5':'Sam','place_6':'Genevieve','place_7':'Teeny','place_8':'Sue'},
	{'name':'Greg', 'reward':'Kyle', 'immunity':'Kyle', 'titleQuote':'Teeny', 'summit':'Andy', 'nudity':'No', 'idolFound':'No', 'idolPlayed':'Yes', 'shotInTheDark':'No', 'submit_time':'2024-11-28T14:04:00.000Z', 'fishCatch':'No', 'voteUnanimous':'Yes', 'jeffJoke':'No','place_1':'Caroline','place_2':'Teeny','place_3':'Andy','place_4':'Sam','place_5':'Genevieve','place_6':'Kyle','place_7':'Sue','place_8':'Rachel'},
	{'name':'Betsy', 'reward':'Teeny', 'immunity':'Rachel', 'titleQuote':'Jeff Probst', 'summit':'Rachel', 'nudity':'No', 'idolFound':'Yes', 'idolPlayed':'No', 'shotInTheDark':'No', 'submit_time':'2024-11-28T14:04:00.000Z', 'fishCatch':'No', 'voteUnanimous':'No', 'jeffJoke':'No','place_1':'Teeny','place_2':'Sam','place_3':'Sue','place_4':'Caroline','place_5':'Rachel','place_6':'Andy','place_7':'Genevieve','place_8':'Kyle'},
	{'name':'Anastassia', 'reward':'Kyle', 'immunity':'Sam', 'titleQuote':'Andy', 'summit':'Andy', 'nudity':'No', 'idolFound':'No', 'idolPlayed':'No', 'shotInTheDark':'No', 'submit_time':'2024-11-26T12:04:00.000Z', 'fishCatch':'No', 'voteUnanimous':'No', 'jeffJoke':'No','place_1':'Rachel','place_2':'Andy','place_3':'Sue','place_4':'Caroline','place_5':'Teeny','place_6':'Sam','place_7':'Genevieve','place_8':'Kyle'},
	// WEEK 12
	{'name':'Erika', 'reward':'Caroline', 'immunity':'Sue', 'titleQuote':'Andy', 'summit':'Sam', 'nudity':'No', 'idolFound':'Yes', 'idolPlayed':'Yes', 'shotInTheDark':'No', 'submit_time':'2024-12-04T16:04:00.000Z', 'fishCatch':'No', 'voteUnanimous':'No', 'jeffJoke':'Yes'},
];