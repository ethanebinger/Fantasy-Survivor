function init() {
    // Move past hero page and enter form on click
    $('#enterBtn').click(function(e) {
		window.location = "https://forms.gle/dedhjs6RQqHfB1QK7"; // Episodes 1-9
		//window.location = ""; // Episode 10
		//window.location = ""; // Episodes 11+
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
        url: "https://api.github.com/repos/ethanebinger/Fantasy-Survivor/contents/docs/Season46/Season46_Responses.json",
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
                        path: 'docs/Season46/Season46_Responses.json'
                    }]
                ))
                .then(function() {
                    console.log('Files committed!');
                    window.location = "http://ethanebinger.com/Fantasy-Survivor/Season46/results.html"
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
			'shotInTheDark':0,
			'liveReunion': 0
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
    var cur_vote = 0;
    var submit_time = new Date(responses.submit_time);
	// datetime constructor: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/Date
	if (submit_time <= new Date('March 3, 2024')) { cur_vote = 1; }
	else if (submit_time <= new Date('March 10, 2024')) { cur_vote = 2; }
	else if (submit_time <= new Date('March 17, 2024')) { cur_vote = 3; }
	else if (submit_time <= new Date('March 24, 2024')) { cur_vote = 4; }
	else if (submit_time <= new Date('March 31, 2024')) { cur_vote = 5; }
	else if (submit_time <= new Date('April 7, 2024')) { cur_vote = 6; }
	else if (submit_time <= new Date('April 14, 2024')) { cur_vote = 7; }
	else if (submit_time <= new Date('April 21, 2024')) { cur_vote = 8; }
	else if (submit_time <= new Date('April 28, 2024')) { cur_vote = 9; }
	else if (submit_time <= new Date('May 5, 2024')) { cur_vote = 10; }
	else if (submit_time <= new Date('May 13, 2024')) { cur_vote = 11; }
	else if (submit_time <= new Date('May 19, 2024')) { cur_vote = 12; }
	else if (submit_time <= new Date('May 26, 2024')) { cur_vote = 13; };
    return cur_vote;
};

// FUNCTION TO CALCULATE SCORES
function calculateScores(scores, results, responses, calcType) {
    var name_ep_count = [0];
    for (var n=0; n<scores.length; n++) {
        var cur_player = scores[n].name;
        for (var i=0; i<results.length; i++) {
            var team_green = results[i].team_green;
            var team_orange = results[i].team_orange;
			var team_purple = results[i].team_purple;
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
                            if ((results[i].reward === 'team_green' || results[i].reward2 === 'team_green') && inArray(responses[j].reward, team_green) && responses[j].reward) {
                                if (calcType === "individual") { scores[n].reward += 5; }
                                else { scores[n][val_vote] += 5; }
                                scores[n].total += 5;
                            } else if ((results[i].reward === 'team_orange' || results[i].reward2 === 'team_orange') && inArray(responses[j].reward, team_orange) && responses[j].reward) {
                                if (calcType === "individual") { scores[n].reward += 5; }
                                else { scores[n][val_vote] += 5; };
                                scores[n].total += 5;
                            } else if ((results[i].reward === 'team_purple' || results[i].reward2 === 'team_purple') && inArray(responses[j].reward, team_purple) && responses[j].reward) {
                                if (calcType === "individual") { scores[n].reward += 5; }
                                else { scores[n][val_vote] += 5; };
                                scores[n].total += 5;
                            };
                            // Immunity
                            if ((results[i].immunity === 'team_green' || results[i].immunity2 === 'team_green') && inArray(responses[j].immunity, team_green) && responses[j].immunity) {
                                if (calcType === "individual") { scores[n].immunity += 5; }
                                else { scores[n][val_vote] += 5; };
                                scores[n].total += 5;
                            } else if ((results[i].immunity === 'team_orange' || results[i].immunity2 === 'team_orange')  && inArray(responses[j].immunity, team_orange) && responses[j].immunity) {
                                if (calcType === "individual") { scores[n].immunity += 5; }
                                else { scores[n][val_vote] += 5; };
                                scores[n].total += 5;
                            } else if ((results[i].immunity === 'team_purple' || results[i].immunity2 === 'team_purple')  && inArray(responses[j].immunity, team_purple) && responses[j].immunity) {
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
            if (castaways['place_'+String([i])] === "Kenzie") {			// sole survivor
                sum += Math.pow(Math.abs(i-1),2.25);
				if (i===1) { bonus += 5 };
            } else if (castaways['place_'+String([i])] === "Charlie") {	// runner up
                sum += Math.pow(Math.abs(i-2),2.25);
				if (i===2) { bonus += 5 };
            } else if (castaways['place_'+String([i])] === "Ben") {	// third
                sum += Math.pow(Math.abs(i-3),2.25);
				if (i===3) { bonus += 5 };
            } else if (castaways['place_'+String([i])] === "Liz") {	// fourth
                sum += Math.pow(Math.abs(i-4),2.25);
				if (i===4) { bonus += 5 };
            } else if (castaways['place_'+String([i])] === "Maria") {	// fifth
                sum += Math.pow(Math.abs(i-5),2.25);
				if (i===5) { bonus += 5 };
            } else if (castaways['place_'+String([i])] === "Q") {	// sixth
                sum += Math.pow(Math.abs(i-6),2.25);
				if (i===6) { bonus += 5 };
            } else if (castaways['place_'+String([i])] === "Venus") {	// seventh
                sum += Math.pow(Math.abs(i-7),2.25)
				if (i===7) { bonus += 5 };
            } else if (castaways['place_'+String([i])] === "Tiffany") {	// eighth
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
		 'Ben', 'Charlie', 'Kenzie'
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
        'date': '2/28/24',
        'merge': 'No',
        'reward': '', 
        'immunity': 'team_orange',
		'immunity2': 'team_green',
        'eliminated': 'David',
        'idolFound': 'Yes',
        'idolPlayed': 'No',
        'titleQuote': 'Tevin',
		'summit': 'Yes',
        'nudity': 'Yes',
		'shotInTheDark': 'No',
        'team_green': ['Ben', 'Charlie', 'Jem', 'Maria', 'Moriah', 'Tim'],
        'team_purple': ['Bhanu', 'David', 'Jess', 'Kenzie', 'Q', 'Tiffany'],
		'team_orange': ['Hunter', 'Liz', 'Randen', 'Soda', 'Tevin', 'Venus']
    },
	{	'vote': 2,
        'date': '3/6/24',
        'merge': 'No',
        'reward': 'team_orange', 
        'immunity': 'team_orange',
		'immunity2': 'team_green',
        'eliminated': 'Jess',
        'idolFound': 'Yes',
        'idolPlayed': 'No',
        'titleQuote': 'Ben',
		'summit': 'No',
        'nudity': 'No',
		'shotInTheDark': 'No',
        'team_green': ['Ben', 'Charlie', 'Jem', 'Maria', 'Moriah', 'Tim'],
        'team_purple': ['Bhanu', 'Jess', 'Kenzie', 'Q', 'Tiffany'],
		'team_orange': ['Hunter', 'Liz', 'Randen', 'Soda', 'Tevin', 'Venus']
    },
	{	'vote': 3,
        'date': '3/13/24',
        'merge': 'No',
        'reward': 'team_orange', 
        'immunity': 'team_orange',
		'immunity2': 'team_green',
        'eliminated': 'Randen',
        'idolFound': 'Yes',
        'idolPlayed': 'No',
        'titleQuote': 'Q',
		'summit': ['Bhanu', 'Liz', 'Ben'],
        'nudity': 'No',
		'shotInTheDark': 'No',
        'team_green': ['Ben', 'Charlie', 'Jem', 'Maria', 'Moriah', 'Tim'],
        'team_purple': ['Bhanu', 'Kenzie', 'Q', 'Tiffany'],
		'team_orange': ['Hunter', 'Liz', 'Randen', 'Soda', 'Tevin', 'Venus']
    },
	{	'vote': 4,
        'date': '3/20/24',
        'merge': 'No',
        'reward': 'team_purple', 
		'reward2': 'team_orange', 
        'immunity': 'team_orange',
		'immunity2': 'team_green',
        'eliminated': 'Bhanu',
        'idolFound': 'No',
        'idolPlayed': 'No',
        'titleQuote': 'Kenzie',
		'summit': 'No',
        'nudity': 'No',
		'shotInTheDark': 'No',
        'team_green': ['Ben', 'Charlie', 'Jem', 'Maria', 'Moriah', 'Tim'],
        'team_purple': ['Bhanu', 'Kenzie', 'Q', 'Tiffany'],
		'team_orange': ['Hunter', 'Liz', 'Soda', 'Tevin', 'Venus']
    },
	{	'vote': 5,
        'date': '3/27/24',
        'merge': 'No',
        'reward': 'team_orange', 
		'reward2': 'team_green', 
        'immunity': 'team_orange',
		'immunity2': 'team_green',
        'eliminated': 'Jem',
        'idolFound': 'Yes',
        'idolPlayed': 'No',
        'titleQuote': 'Tim',
		'summit': ['Q', 'Hunter', 'Tim'],
        'nudity': 'No',
		'shotInTheDark': 'No',
        'team_green': ['Ben', 'Charlie', 'Jem', 'Maria', 'Moriah', 'Tim'],
        'team_purple': ['Kenzie', 'Q', 'Tiffany'],
		'team_orange': ['Hunter', 'Liz', 'Soda', 'Tevin', 'Venus']
    },
	{	'vote': 6,
        'date': '4/3/24',
        'merge': 'Yes',
        'reward': ['Ben', 'Hunter', 'Kenzie', 'Q', 'Tiffany', 'Tevin', 'Tim'],
        'immunity': ['Ben', 'Hunter', 'Kenzie', 'Q', 'Tiffany', 'Tevin', 'Tim'],
        'eliminated': 'Moriah',
        'idolFound': 'Yes',
        'idolPlayed': 'No',
        'titleQuote': 'Q',
		'summit': 'No',
        'nudity': 'No',
		'shotInTheDark': 'No'
    },
	{	'vote': 7,
        'date': '4/10/24',
        'merge': 'Yes',
        'reward': 'Maria',
        'immunity': 'Kenzie',
		'immunity2': 'Maria',
        'eliminated': ['Tim', 'Soda'],
        'idolFound': 'No',
        'idolPlayed': 'No',
        'titleQuote': 'Jeff Probst',
		'summit': 'No',
        'nudity': 'No',
		'shotInTheDark': 'No'
    },
	{	'vote': 8,
        'date': '4/17/24',
        'merge': 'Yes',
        'reward': '',
        'immunity': 'Hunter',
        'eliminated': 'Tevin',
        'idolFound': 'No',
        'idolPlayed': 'No',
        'titleQuote': 'Q',
		'summit': 'No',
        'nudity': 'No',
		'shotInTheDark': 'No'
    },
	{	'vote': 9,
        'date': '4/24/24',
        'merge': 'Yes',
        'reward': '',
        'immunity': 'Charlie',
        'eliminated': 'Hunter',
        'idolFound': 'No',
        'idolPlayed': 'No',
        'titleQuote': 'Ben',
		'summit': 'No',
        'nudity': 'No',
		'shotInTheDark': 'No'
    },
	{	'vote': 10,
        'date': '5/1/24',
        'merge': 'Yes',
        'reward': 'Q',
        'immunity': 'Charlie',
        'eliminated': 'Tiffany',
        'idolFound': 'No',
        'idolPlayed': 'No',
        'titleQuote': 'Maria',
		'summit': 'No',
        'nudity': 'No',
		'shotInTheDark': 'No'
    },
	{	'vote': 11,
        'date': '5/8/24',
        'merge': 'Yes',
        'reward': 'Maria',
        'immunity': 'Maria',
        'eliminated': 'Venus',
        'idolFound': 'Yes',
        'idolPlayed': 'No',
        'titleQuote': 'Kenzie',
		'summit': 'No',
        'nudity': 'No',
		'shotInTheDark': 'No'
    },
	{	'vote': 12,
        'date': '5/15/24',
        'merge': 'Yes',
        'reward': 'Charlie',
        'immunity': 'Maria',
        'eliminated': 'Q',
        'idolFound': 'Yes',
        'idolPlayed': 'No',
        'titleQuote': 'Charlie',
		'summit': 'No',
        'nudity': 'No',
		'shotInTheDark': 'No'
    },
	{	'vote': 13,
        'date': '5/22/24',
        'merge': 'Yes',
        'reward': 'Kenzie',
		'immunity_4': 'Kenzie',
		'immunity_5': 'Ben',
		'fireChallenge': 'Kenzie',
        'eliminated': ['Maria', 'Liz'],
        'idolFound': 'No',
        'idolPlayed': 'No',
        'titleQuote': 'Charlie',
		'summit': 'No',
        'nudity': 'Yes',
		'shotInTheDark': 'No'
    }
	
];

var saved_responses = [
	// WEEK 2
	{'name':'Mark', 'reward':'Q', 'immunity':'Tim', 'eliminated':'Jess', 'safe':'Bhanu', 'titleQuote':'Kenzie', 'summit':'Randen', 'nudity':'No', 'idolFound':'No', 'idolPlayed':'No', 'shotInTheDark':'No', 'submit_time':'2024-03-06T18:18:00.000Z', 'pick_1':'', 'pick_2':'', 'pick_3':''},
	{'name':'Ethan', 'reward':'Hunter', 'immunity':'Hunter', 'eliminated':'Jess', 'safe':'Hunter', 'titleQuote':'Tevin', 'summit':'Kenzie', 'nudity':'No', 'idolFound':'Yes', 'idolPlayed':'No', 'shotInTheDark':'No', 'submit_time':'2024-03-06T18:22:00.000Z', 'pick_1':'Charlie', 'pick_2':'Jem', 'pick_3':'Soda'},
	{'name':'Dan', 'reward':'Q', 'immunity':'Kenzie', 'eliminated':'Maria', 'safe':'Bhanu', 'titleQuote':'Liz', 'summit':'Bhanu', 'nudity':'No', 'idolFound':'Yes', 'idolPlayed':'No', 'shotInTheDark':'No', 'submit_time':'2024-03-06T18:25:00.000Z', 'pick_1':'Kenzie', 'pick_2':'Maria', 'pick_3':'Q'},
	{'name':'Esme', 'reward':'Tevin', 'immunity':'Moriah', 'eliminated':'Liz', 'safe':'Q', 'titleQuote':'Tevin', 'summit':'Kenzie', 'nudity':'Yes', 'idolFound':'Yes', 'idolPlayed':'No', 'shotInTheDark':'No', 'submit_time':'2024-03-06T18:30:00.000Z', 'pick_1':'Kenzie', 'pick_2':'Tevin', 'pick_3':'Venus'},
	{'name':'Wilson', 'reward':'Tim', 'immunity':'Q', 'eliminated':'Liz', 'safe':'Jem', 'titleQuote':'Venus', 'summit':'Bhanu', 'nudity':'No', 'idolFound':'Yes', 'idolPlayed':'No', 'shotInTheDark':'No', 'submit_time':'2024-03-06T18:44:00.000Z', 'pick_1':'Bhanu', 'pick_2':'Jem', 'pick_3':'Moriah'},
	{'name':'Christy', 'reward':'Soda', 'immunity':'Soda', 'eliminated':'Jess', 'safe':'Tim', 'titleQuote':'Tevin', 'summit':'Moriah', 'nudity':'Yes', 'idolFound':'Yes', 'idolPlayed':'No', 'shotInTheDark':'No', 'submit_time':'2024-03-06T20:24:00.000Z', 'pick_1':'Charlie', 'pick_2':'Moriah', 'pick_3':'Soda'},
	{'name':'Josh', 'reward':'Ben', 'immunity':'Ben', 'eliminated':'Randen', 'safe':'Ben', 'titleQuote':'Tevin', 'summit':'Q', 'nudity':'No', 'idolFound':'Yes', 'idolPlayed':'No', 'shotInTheDark':'No', 'submit_time':'2024-03-06T21:06:00.000Z', 'pick_1':'Hunter', 'pick_2':'Kenzie', 'pick_3':'Tiffany'},
	{'name':'Betsy', 'reward':'Maria', 'immunity':'Charlie', 'eliminated':'Bhanu', 'safe':'Maria', 'titleQuote':'Hunter', 'summit':'Kenzie', 'nudity':'No', 'idolFound':'Yes', 'idolPlayed':'No', 'shotInTheDark':'No', 'submit_time':'2024-03-06T21:17:00.000Z', 'pick_1':'Ben', 'pick_2':'Hunter', 'pick_3':'Maria'},
	{'name':'Greg', 'reward':'Tevin', 'immunity':'Hunter', 'eliminated':'Jess', 'safe':'Tevin', 'titleQuote':'Kenzie', 'summit':'Hunter', 'nudity':'No', 'idolFound':'Yes', 'idolPlayed':'No', 'shotInTheDark':'No', 'submit_time':'2024-03-07T02:28:00.000Z', 'pick_1':'Charlie', 'pick_2':'Kenzie', 'pick_3':'Maria'},
	{'name':'Joe', 'reward':'Hunter', 'immunity':'Hunter', 'eliminated':'Tim', 'safe':'Hunter', 'titleQuote':'Moriah', 'summit':'Jem', 'nudity':'No', 'idolFound':'Yes', 'idolPlayed':'No', 'shotInTheDark':'No', 'submit_time':'2024-03-07T18:51:00.000Z', 'pick_1':'Hunter', 'pick_2':'Q', 'pick_3':'Tiffany'},
	{'name':'Abby', 'reward':'Hunter', 'immunity':'Hunter', 'eliminated':'Jess', 'safe':'Randen', 'titleQuote':'Soda', 'summit':'Kenzie', 'nudity':'No', 'idolFound':'Yes', 'idolPlayed':'No', 'shotInTheDark':'No', 'submit_time':'2024-03-07T22:52:00.000Z', 'pick_1':'Hunter', 'pick_2':'Liz', 'pick_3':'Tim'},
	{'name':'Anastassia', 'reward':'Hunter', 'immunity':'Hunter', 'eliminated':'Jess', 'safe':'Hunter', 'titleQuote':'Tevin', 'summit':'Kenzie', 'nudity':'No', 'idolFound':'Yes', 'idolPlayed':'No', 'shotInTheDark':'No', 'submit_time':'2024-03-07T22:52:00.000Z', 'pick_1':'Q', 'pick_2':'Kenzie ', 'pick_3':'Tevin'},
	// WEEK 3
	{'name':'Esme', 'reward':'Charlie', 'immunity':'Ben', 'eliminated':'Liz', 'safe':'Q', 'titleQuote':'Maria', 'summit':'Venus', 'nudity':'No', 'idolFound':'Yes', 'idolPlayed':'No', 'shotInTheDark':'No', 'submit_time':'2024-03-13T18:05:00.000Z'},
	{'name':'Wilson', 'reward':'Jem', 'immunity':'Q', 'eliminated':'Liz', 'safe':'Moriah', 'titleQuote':'Liz', 'summit':'Maria', 'nudity':'No', 'idolFound':'Yes', 'idolPlayed':'No', 'shotInTheDark':'No', 'submit_time':'2024-03-13T18:54:00.000Z'},
	{'name':'Betsy', 'reward':'Q', 'immunity':'Charlie', 'eliminated':'Bhanu', 'safe':'Charlie', 'titleQuote':'Maria', 'summit':'Liz', 'nudity':'No', 'idolFound':'No', 'idolPlayed':'No', 'shotInTheDark':'No', 'submit_time':'2024-03-13T19:56:00.000Z'},
	{'name':'Ethan', 'reward':'Charlie', 'immunity':'Charlie', 'eliminated':'Bhanu', 'safe':'Charlie', 'titleQuote':'Ben', 'summit':'Kenzie', 'nudity':'No', 'idolFound':'Yes', 'idolPlayed':'No', 'shotInTheDark':'No', 'submit_time':'2024-03-13T20:01:00.000Z'},
	{'name':'Christy', 'reward':'Hunter', 'immunity':'Hunter', 'eliminated':'Bhanu', 'safe':'Moriah', 'titleQuote':'Tevin', 'summit':'Kenzie', 'nudity':'No', 'idolFound':'Yes', 'idolPlayed':'No', 'shotInTheDark':'No', 'submit_time':'2024-03-13T20:23:00.000Z'},
	{'name':'Josh', 'reward':'Tiffany', 'immunity':'Tiffany', 'eliminated':'Randen', 'safe':'Hunter', 'titleQuote':'Tevin', 'summit':'Tiffany', 'nudity':'No', 'idolFound':'Yes', 'idolPlayed':'No', 'shotInTheDark':'No', 'submit_time':'2024-03-13T20:41:00.000Z'},
	{'name':'Abby', 'reward':'Hunter', 'immunity':'Hunter', 'eliminated':'Bhanu', 'safe':'Hunter', 'titleQuote':'Maria', 'summit':'Q', 'nudity':'No', 'idolFound':'Yes', 'idolPlayed':'Yes', 'shotInTheDark':'Yes', 'submit_time':'2024-03-13T23:22:00.000Z'},
	{'name':'Joe', 'reward':'Q', 'immunity':'Hunter', 'eliminated':'Bhanu', 'safe':'Charlie', 'titleQuote':'Jeff Probst', 'summit':'Q', 'nudity':'No', 'idolFound':'Yes', 'idolPlayed':'No', 'shotInTheDark':'No', 'submit_time':'2024-03-13T23:22:00.000Z'},
	{'name':'Greg', 'reward':'Tevin', 'immunity':'Tevin', 'eliminated':'Moriah', 'safe':'Tevin', 'titleQuote':'Kenzie', 'summit':'Bhanu', 'nudity':'No', 'idolFound':'Yes', 'idolPlayed':'No', 'shotInTheDark':'No', 'submit_time':'2024-03-14T02:56:00.000Z'},
	{'name':'Anastassia', 'reward':'Hunter', 'immunity':'Hunter', 'eliminated':'Bhanu', 'safe':'Charlie', 'titleQuote':'Ben', 'summit':'Kenzie', 'nudity':'No', 'idolFound':'Yes', 'idolPlayed':'No', 'shotInTheDark':'No', 'submit_time':'2024-03-14T02:56:00.000Z'},
	// WEEK 4
	{'name':'Esme', 'reward':'Hunter', 'immunity':'Hunter', 'eliminated':'Charlie', 'safe':'Q', 'titleQuote':'Soda', 'summit':'Kenzie', 'nudity':'No', 'idolFound':'Yes', 'idolPlayed':'No', 'shotInTheDark':'No', 'submit_time':'2024-03-20T19:40:00.000Z'},
	{'name':'Christy', 'reward':'Hunter', 'immunity':'Moriah', 'eliminated':'Bhanu', 'safe':'Moriah', 'titleQuote':'Tevin', 'summit':'Moriah', 'nudity':'No', 'idolFound':'Yes', 'idolPlayed':'No', 'shotInTheDark':'Yes', 'submit_time':'2024-03-20T20:07:00.000Z'},
	{'name':'Betsy', 'reward':'Tevin', 'immunity':'Jem', 'eliminated':'Bhanu', 'safe':'Charlie', 'titleQuote':'Liz', 'summit':'Maria', 'nudity':'No', 'idolFound':'Yes', 'idolPlayed':'No', 'shotInTheDark':'Yes', 'submit_time':'2024-03-20T20:09:00.000Z'},
	{'name':'Wilson', 'reward':'Bhanu', 'immunity':'Jem', 'eliminated':'Liz', 'safe':'Jem', 'titleQuote':'Q', 'summit':'Q', 'nudity':'No', 'idolFound':'Yes', 'idolPlayed':'No', 'shotInTheDark':'No', 'submit_time':'2024-03-20T20:24:00.000Z'},
	{'name':'Ethan', 'reward':'Hunter', 'immunity':'Hunter', 'eliminated':'Bhanu', 'safe':'Hunter', 'titleQuote':'Bhanu', 'summit':'Tim', 'nudity':'No', 'idolFound':'No', 'idolPlayed':'No', 'shotInTheDark':'No', 'submit_time':'2024-03-21T03:11:00.000Z'},
	{'name':'Anastassia', 'reward':'Hunter', 'immunity':'Hunter', 'eliminated':'Venus', 'safe':'Hunter', 'titleQuote':'Tevin', 'summit':'Tiffany', 'nudity':'No', 'idolFound':'No', 'idolPlayed':'No', 'shotInTheDark':'No', 'submit_time':'2024-03-21T03:11:00.000Z'},
	{'name':'Josh', 'reward':'Hunter', 'immunity':'Hunter', 'eliminated':'Bhanu', 'safe':'Hunter', 'titleQuote':'Q', 'summit':'Hunter', 'nudity':'No', 'idolFound':'No', 'idolPlayed':'No', 'shotInTheDark':'Yes', 'submit_time':'2024-03-22T17:05:00.000Z'},
	// WEEK 5
	{'name':'Betsy', 'reward':'Hunter', 'immunity':'Liz', 'eliminated':'Soda', 'safe':'Charlie', 'titleQuote':'Q', 'summit':'Kenzie', 'nudity':'No', 'idolFound':'No', 'idolPlayed':'No', 'shotInTheDark':'Yes', 'submit_time':'2024-03-27T16:06:00.000Z'},
	{'name':'Ethan', 'reward':'Hunter', 'immunity':'Ben', 'eliminated':'Soda', 'safe':'Ben', 'titleQuote':'Hunter', 'summit':'Jem', 'nudity':'No', 'idolFound':'Yes', 'idolPlayed':'No', 'shotInTheDark':'No', 'submit_time':'2024-03-27T18:00:00.000Z'},
	{'name':'Esme', 'reward':'Maria', 'immunity':'Maria', 'eliminated':'Liz', 'safe':'Ben', 'titleQuote':'Ben', 'summit':'Q', 'nudity':'No', 'idolFound':'No', 'idolPlayed':'No', 'shotInTheDark':'No', 'submit_time':'2024-03-27T19:16:00.000Z'},
	{'name':'Christy', 'reward':'Hunter', 'immunity':'Hunter', 'eliminated':'Liz', 'safe':'Hunter', 'titleQuote':'Tevin', 'summit':'Moriah', 'nudity':'No', 'idolFound':'Yes', 'idolPlayed':'No', 'shotInTheDark':'No', 'submit_time':'2024-03-27T19:51:00.000Z'},
	{'name':'Greg', 'reward':'Hunter', 'immunity':'Hunter', 'eliminated':'Moriah', 'safe':'Tevin', 'titleQuote':'Ben', 'summit':'Ben', 'nudity':'No', 'idolFound':'No', 'idolPlayed':'No', 'shotInTheDark':'No', 'submit_time':'2024-03-28T00:18:00.000Z'},
	{'name':'Wilson', 'reward':'Jem', 'immunity':'Hunter', 'eliminated':'Tim', 'safe':'Tevin', 'titleQuote':'Tim', 'summit':'Q', 'nudity':'No', 'idolFound':'Yes', 'idolPlayed':'No', 'shotInTheDark':'No', 'submit_time':'2024-03-28T08:43:00.000Z'},
	{'name':'Joe', 'reward':'Charlie', 'immunity':'Charlie', 'eliminated':'Soda', 'safe':'Ben', 'titleQuote':'Q', 'summit':'Kenzie', 'nudity':'No', 'idolFound':'Yes', 'idolPlayed':'No', 'shotInTheDark':'No', 'submit_time':'2024-03-28T21:45:00.000Z'},
	// WEEK 6
	{'name':'Joe', 'reward':'Hunter', 'immunity':'Hunter', 'eliminated':'Venus', 'safe':'Tevin', 'titleQuote':'Tevin', 'summit':'Tiffany', 'nudity':'No', 'idolFound':'Yes', 'idolPlayed':'Yes', 'shotInTheDark':'No', 'submit_time':'2024-04-03T07:50:00.000Z'},
	{'name':'Wilson', 'reward':'Q', 'immunity':'Hunter', 'eliminated':'Liz', 'safe':'Charlie', 'titleQuote':'Liz', 'summit':'Moriah', 'nudity':'No', 'idolFound':'Yes', 'idolPlayed':'No', 'shotInTheDark':'No', 'submit_time':'2024-04-03T18:57:00.000Z'},
	{'name':'Esme', 'reward':'Hunter', 'immunity':'Tiffany', 'eliminated':'Venus', 'safe':'Maria', 'titleQuote':'Charlie', 'summit':'Venus', 'nudity':'No', 'idolFound':'Yes', 'idolPlayed':'Yes', 'shotInTheDark':'No', 'submit_time':'2024-04-03T19:03:00.000Z'},
	{'name':'Ethan', 'reward':'Hunter', 'immunity':'Hunter', 'eliminated':'Soda', 'safe':'Charlie', 'titleQuote':'Tevin', 'summit':'Moriah', 'nudity':'No', 'idolFound':'No', 'idolPlayed':'No', 'shotInTheDark':'No', 'submit_time':'2024-04-03T19:57:00.000Z'},
	{'name':'Christy', 'reward':'Tevin', 'immunity':'Hunter', 'eliminated':'Liz', 'safe':'Tevin', 'titleQuote':'Tevin', 'summit':'Tiffany', 'nudity':'No', 'idolFound':'Yes', 'idolPlayed':'No', 'shotInTheDark':'No', 'submit_time':'2024-04-03T20:12:00.000Z'},
	{'name':'Betsy', 'reward':'Ben', 'immunity':'Liz', 'eliminated':'Venus', 'safe':'Liz', 'titleQuote':'Moriah', 'summit':'Soda', 'nudity':'No', 'idolFound':'Yes', 'idolPlayed':'Yes', 'shotInTheDark':'Yes', 'submit_time':'2024-04-03T20:26:00.000Z'},
	{'name':'Greg', 'reward':'Hunter', 'immunity':'Hunter', 'eliminated':'Kenzie', 'safe':'Tevin', 'titleQuote':'Moriah', 'summit':'Venus', 'nudity':'No', 'idolFound':'Yes', 'idolPlayed':'No', 'shotInTheDark':'No', 'submit_time':'2024-04-03T20:46:00.000Z'},
	{'name':'Josh', 'reward':'Hunter', 'immunity':'Hunter', 'eliminated':'Q', 'safe':'Hunter', 'titleQuote':'Hunter', 'summit':'Soda', 'nudity':'No', 'idolFound':'Yes', 'idolPlayed':'Yes', 'shotInTheDark':'No', 'submit_time':'2024-04-03T20:52:00.000Z'},
	{'name':'Abby', 'reward':'Hunter', 'immunity':'Hunter', 'eliminated':'Venus', 'safe':'Maria', 'titleQuote':'Liz', 'summit':'Tiffany', 'nudity':'No', 'idolFound':'No', 'idolPlayed':'Yes', 'shotInTheDark':'Yes', 'submit_time':'2024-04-03T20:52:00.000Z'},
	// WEEK 7
	{'name':'Wilson', 'reward':'Hunter', 'immunity':'Tevin', 'eliminated':'Venus', 'safe':'Ben', 'titleQuote':'Soda', 'summit':'Maria', 'nudity':'No', 'idolFound':'Yes', 'idolPlayed':'Yes', 'shotInTheDark':'No', 'submit_time':'2024-04-10T18:55:00.000Z'},
	{'name':'Esme', 'reward':'Hunter', 'immunity':'Kenzie', 'eliminated':'Tim', 'safe':'Tiffany', 'titleQuote':'Tevin', 'summit':'Maria', 'nudity':'No', 'idolFound':'No', 'idolPlayed':'Yes', 'shotInTheDark':'No', 'submit_time':'2024-04-10T19:07:00.000Z'},
	{'name':'Christy', 'reward':'Hunter', 'immunity':'Kenzie', 'eliminated':'Tim', 'safe':'Kenzie', 'titleQuote':'Tevin', 'summit':'Charlie', 'nudity':'No', 'idolFound':'Yes', 'idolPlayed':'No', 'shotInTheDark':'No', 'submit_time':'2024-04-10T20:01:00.000Z'},
	{'name':'Betsy', 'reward':'Charlie', 'immunity':'Hunter', 'eliminated':'Q', 'safe':'Maria', 'titleQuote':'Charlie', 'summit':'Hunter', 'nudity':'No', 'idolFound':'Yes', 'idolPlayed':'Yes', 'shotInTheDark':'Yes', 'submit_time':'2024-04-10T20:36:00.000Z'},
	{'name':'Abby ', 'reward':'Hunter', 'immunity':'Hunter', 'eliminated':'Venus', 'safe':'Ben', 'titleQuote':'Tevin', 'summit':'Maria', 'nudity':'No', 'idolFound':'Yes', 'idolPlayed':'Yes', 'shotInTheDark':'Yes', 'submit_time':'2024-04-10T21:47:00.000Z'},
	{'name':'Joe', 'reward':'Hunter', 'immunity':'Hunter', 'eliminated':'Q', 'safe':'Maria', 'titleQuote':'Ben', 'summit':'Soda', 'nudity':'No', 'idolFound':'No', 'idolPlayed':'No', 'shotInTheDark':'No', 'submit_time':'2024-04-10T21:55:00.000Z'},
	{'name':'Greg', 'reward':'Hunter', 'immunity':'Hunter', 'eliminated':'Soda', 'safe':'Hunter', 'titleQuote':'Kenzie', 'summit':'Ben', 'nudity':'No', 'idolFound':'No', 'idolPlayed':'No', 'shotInTheDark':'No', 'submit_time':'2024-04-10T22:00:00.000Z'},
	// WEEK 8
	{'name':'Wilson', 'reward':'Hunter', 'immunity':'Tevin', 'eliminated':'Tim', 'safe':'Maria', 'titleQuote':'Soda', 'summit':'Charlie', 'nudity':'No', 'idolFound':'No', 'idolPlayed':'Yes', 'shotInTheDark':'No', 'submit_time':'2024-04-17T20:01:00.000Z'},
	{'name':'Esme', 'reward':'Hunter', 'immunity':'Venus', 'eliminated':'Q', 'safe':'Tiffany', 'titleQuote':'Tevin', 'summit':'Maria', 'nudity':'No', 'idolFound':'No', 'idolPlayed':'Yes', 'shotInTheDark':'No', 'submit_time':'2024-04-17T20:02:00.000Z'},
	{'name':'Christy', 'reward':'Hunter', 'immunity':'Hunter', 'eliminated':'Q', 'safe':'Charlie', 'titleQuote':'Tevin', 'summit':'Kenzie', 'nudity':'No', 'idolFound':'No', 'idolPlayed':'No', 'shotInTheDark':'No', 'submit_time':'2024-04-17T20:10:00.000Z'},
	{'name':'Betsy', 'reward':'Charlie', 'immunity':'Maria', 'eliminated':'Q', 'safe':'Maria', 'titleQuote':'Ben', 'summit':'Hunter', 'nudity':'No', 'idolFound':'No', 'idolPlayed':'Yes', 'shotInTheDark':'No', 'submit_time':'2024-04-17T20:41:00.000Z'},
	{'name':'Greg', 'reward':'Hunter', 'immunity':'Hunter', 'eliminated':'Liz', 'safe':'Hunter', 'titleQuote':'Q', 'summit':'Venus', 'nudity':'No', 'idolFound':'No', 'idolPlayed':'Yes', 'shotInTheDark':'No', 'submit_time':'2024-04-18T15:46:00.000Z'},
	// WEEK 9
	{'name':'Esme', 'reward':'Hunter', 'immunity':'Hunter', 'eliminated':'Q', 'safe':'Kenzie', 'titleQuote':'Tiffany', 'summit':'Maria', 'nudity':'', 'idolFound':'No', 'idolPlayed':'Yes', 'shotInTheDark':'No', 'submit_time':'2024-04-24T20:04:00.000Z'},
	{'name':'Christy', 'reward':'Hunter', 'immunity':'Hunter', 'eliminated':'Q', 'safe':'Charlie', 'titleQuote':'Charlie', 'summit':'Liz', 'nudity':'No', 'idolFound':'Yes', 'idolPlayed':'No', 'shotInTheDark':'No', 'submit_time':'2024-04-24T20:14:00.000Z'},
	{'name':'Greg', 'reward':'Venus', 'immunity':'Venus', 'eliminated':'Ben', 'safe':'Hunter', 'titleQuote':'Q', 'summit':'Q', 'nudity':'No', 'idolFound':'No', 'idolPlayed':'Yes', 'shotInTheDark':'No', 'submit_time':'2024-04-24T22:29:00.000Z'},
	{'name':'Wilson', 'reward':'Hunter', 'immunity':'Kenzie', 'eliminated':'Q', 'safe':'Tiffany', 'titleQuote':'Maria', 'summit':'Charlie', 'nudity':'No', 'idolFound':'Yes', 'idolPlayed':'Yes', 'shotInTheDark':'No', 'submit_time':'2024-04-25T18:55:00.000Z'},
	// WEEK 10
	{'name':'Esme', 'reward':'Kenzie', 'immunity':'Kenzie', 'eliminated':'Q', 'safe':'Ben', 'titleQuote':'Charlie', 'summit':'Maria', 'nudity':'No', 'idolFound':'Yes', 'idolPlayed':'No', 'shotInTheDark':'No', 'submit_time':'2024-05-01T19:46:00.000Z'},
	{'name':'Wilson', 'reward':'Liz', 'immunity':'Tiffany', 'eliminated':'Venus', 'safe':'Ben', 'titleQuote':'Q', 'summit':'Kenzie', 'nudity':'No', 'idolFound':'Yes', 'idolPlayed':'No', 'shotInTheDark':'No', 'submit_time':'2024-05-01T20:04:00.000Z'},
	{'name':'Christy', 'reward':'Q', 'immunity':'Charlie', 'eliminated':'Q', 'safe':'Maria', 'titleQuote':'Kenzie', 'summit':'Liz', 'nudity':'No', 'idolFound':'No', 'idolPlayed':'No', 'shotInTheDark':'No', 'submit_time':'2024-05-01T21:45:00.000Z'},
	// WEEK 11
	{'name':'Ethan', 'reward':'Q', 'immunity':'Q', 'titleQuote':'Venus', 'summit':'Ben', 'nudity':'No', 'idolFound':'Yes', 'idolPlayed':'No', 'shotInTheDark':'No', 'submit_time':'2024-05-08T12:07:00.000Z', 'place_8':'Tiffany', 'place_7':'Maria', 'place_6':'Q', 'place_5':'Liz', 'place_4':'Venus', 'place_3':'Ben', 'place_2':'Kenzie', 'place_1':'Charlie'},
	{'name':'Esme', 'reward':'Kenzie', 'immunity':'Kenzie', 'titleQuote':'Kenzie', 'summit':'Kenzie', 'nudity':'No', 'idolFound':'Yes', 'idolPlayed':'No', 'shotInTheDark':'No', 'submit_time':'2024-05-08T13:59:00.000Z', 'place_8':'Tiffany', 'place_7':'Ben', 'place_6':'Maria', 'place_5':'Venus', 'place_4':'Charlie', 'place_3':'Q', 'place_2':'Liz', 'place_1':'Kenzie'},
	{'name':'Wilson', 'reward':'Maria', 'immunity':'Kenzie', 'titleQuote':'Liz', 'summit':'Venus', 'nudity':'No', 'idolFound':'Yes', 'idolPlayed':'Yes', 'shotInTheDark':'No', 'submit_time':'2024-05-08T15:17:00.000Z', 'place_8':'Tiffany', 'place_7':'Venus', 'place_6':'Q', 'place_5':'Kenzie', 'place_4':'Charlie', 'place_3':'Liz', 'place_2':'Ben', 'place_1':'Maria'},
	{'name':'Christy', 'reward':'Charlie', 'immunity':'Charlie',  'titleQuote':'Venus', 'summit':'Kenzie', 'nudity':'No', 'idolFound':'Yes', 'idolPlayed':'No', 'shotInTheDark':'No', 'submit_time':'2024-05-08T20:14:00.000Z', 'place_8':'Tiffany', 'place_7':'Ben', 'place_6':'Q', 'place_5':'Venus', 'place_4':'Kenzie', 'place_3':'Liz', 'place_2':'Charlie', 'place_1':'Maria'},
	{'name':'Greg', 'reward':'Charlie', 'immunity':'Charlie',  'titleQuote':'Maria', 'summit':'Kenzie', 'nudity':'No', 'idolFound':'Yes', 'idolPlayed':'No', 'shotInTheDark':'No', 'submit_time':'2024-05-08T23:09:00.000Z', 'place_8':'Tiffany', 'place_7':'Kenzie', 'place_6':'Ben', 'place_5':'Maria', 'place_4':'Liz', 'place_3':'Q', 'place_2':'Venus', 'place_1':'Charlie'},
	// WEEK 12
	{'name':'Wilson', 'reward':'Liz', 'immunity':'Charlie', 'eliminated':'', 'safe':'', 'titleQuote':'Maria', 'summit':'Ben', 'nudity':'No', 'idolFound':'Yes', 'idolPlayed':'Yes', 'shotInTheDark':'No', 'submit_time':'2024-05-15T20:13:00.000Z'},
	{'name':'Christy', 'reward':'Charlie', 'immunity':'Charlie', 'eliminated':'', 'safe':'', 'titleQuote':'Maria', 'summit':'Kenzie', 'nudity':'No', 'idolFound':'Yes', 'idolPlayed':'No', 'shotInTheDark':'No', 'submit_time':'2024-05-15T20:16:00.000Z'},
	{'name':'Greg', 'reward':'Charlie', 'immunity':'Charlie', 'eliminated':'', 'safe':'', 'titleQuote':'Charlie', 'summit':'Q', 'nudity':'No', 'idolFound':'Yes', 'idolPlayed':'Yes', 'shotInTheDark':'No', 'submit_time':'2024-05-16T01:33:00.000Z'}
];