/*****************************
 * NOTES:
 * 
 *  
 *****************************/

/*****************************
 * VARIABLES 
 *****************************/
const CURRENT_WEEK = 1;
const CURRENT_EP_DATE = '2/25/26'
const EPISODE_NAME = 'In the hands of the fans'
const CONTESTANTS = {
	// Orange Cila Tribe
	"Christian": "Cila",
	"Cirie": "Cila",
	"Emily": "Cila",
	"Jenna": "Cila",
	"Joe": "Cila",
	"Ozzy": "Cila",
	"Devens": "Cila",
	"Savannah": "Cila",
	
	// Teal Kalo Tribe
	"Charlie": "Kalo",
	"Chrissy": "Kalo",
	"Coach": "Kalo",
	"Dee": "Kalo",
	"Jonathan": "Kalo",
	"Kamilla": "Kalo",
	"Mike": "Kalo",
	"Tiffany": "Kalo",
	
	// Purple Vatu Tribe
	"Angelina": "Vatu",
	"Aubry": "Vatu",
	"Colby": "Vatu",
	"Genevieve": "Vatu",
	"Kyle": "Vatu",
	"Q": "Vatu",
	"Rizo": "Vatu",
	"Stephanie": "Vatu"
};
const PLAYERS = [
	"Ethan",
	"Anastassia"
]
const QUESTIONS = [
  {
    key: "player_name",
    round: `You are currently voting for<br>Episode ${CURRENT_WEEK}<br>Airing on ${CURRENT_EP_DATE}<br><br>`,
    prompt: "What is your name?",
    details: "",
    type: "dropdown", 
	options: PLAYERS,
    weeks: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]
  },
  {
    key: "final_three",
    round: "Who will be the final 3 survivors?",
    prompt: "Please pick one from each dropdown.<br>Order does not matter.",
    details: "You will get +30 points for each correct pick at the end of the season.",
    type: "dropdown", 
	options: Object.keys(CONTESTANTS),
    weeks: [1]
  },
  {
    key: "final_eight",
    round: "OUTLAST",
    prompt: "Rank the remaining survivors.",
    details: "Please pick one from each dropdown. Order DOES matter.<br> Do not repeat your picks. All eight options should be used once.<br> You will get points for each pick based on the deviation from their final placement.",
    type: "dropdown", 
	options: Object.keys(CONTESTANTS),
    weeks: [11]
  },
  {
    key: "reward",
    round: "OUTWIT",
    prompt: "Who will win REWARD this week?",
    details: "(select one)<br>(+5 if group) (+10 if individual)",
    type: "contestant-radio",
    weeks: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]
  },
  {
    key: "immunity",
    round: "OUTPLAY",
    prompt: "Who will win IMMUNITY this week?",
    details: "(select one)<br>(+5 if group) (+15 if individual)",
    type: "contestant-radio",
    weeks: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]
  },
  {
    key: "eliminated",
    round: "OUTLAST I",
    prompt: "Who will be ELIMINATED this week?",
    details: "(select one)<br>(+10 if group) (+20 if individual)",
    type: "contestant-radio",
    weeks: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  },
  {
    key: "safe",
    round: "OUTLAST II",
    prompt: "Who will be SAFE this week?",
    details: "(select one)<br>(+10)",
    type: "contestant-radio",
    weeks: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  }
];
const ACTIVE_QUESTIONS = QUESTIONS.filter(q => q.weeks.includes(CURRENT_WEEK));
const BONUS_QUESTIONS = [
	{
		key: "title_quote",
		prompt: `This episode is titled: '${EPISODE_NAME}' ...who said this?`,
		type: "dropdown",
		options: ["Jeff Probst", ...Object.keys(CONTESTANTS)]
	},
	{
		key: "idol_found",
		prompt: "Will an idol or advantage be found/earned this week?",
		type: "dropdown",
		options: ["Yes", "No"]
	},
	{
		key: "idol_played",
		prompt: "Will an idol or advantage be played this week?",
		type: "dropdown",
		options: ["Yes", "No"]
	},
	{
		key: "shot_in_the_dark",
		prompt: "Will someone play their Shot-in-the-Dark this week?",
		type: "dropdown",
		options: ["Yes", "No"]
	},
	{
		key: "nudity",
		prompt: "Will there be nudity (requiring blurring) this week? ",
		type: "dropdown",
		options: ["Yes", "No"]
	},
	{
		key: "crying",
		prompt: "Will someone cry this week?",
		type: "dropdown",
		options: ["Yes", "No"]
	}
];

// ------------- Supabase client init -------------
const SUPABASE_URL = 'https://vbqyvyocwoqatmjytysy.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_9vCZvZxuWp0hO9G7aCzSkg_Nie5BdIw';
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const SUPABASE_TABLE = 'season_50';
const SUPABASE_TABLE_RESULTS = 'season_50_results';

/*****************************
 * MAIN PAGE INITIALIZATION 
 *****************************/
// Function to build tabs for submission form
function buildTabs() {
    const form = $('#survivor_form');
    form.empty();
    ACTIVE_QUESTIONS.forEach(q => {
		if (q.key=='final_three'){
			buildFinalQuestionTabs(q, 3);
		} else if (q.key=='final_eight') {
			buildFinalQuestionTabs(q, 8);
		} else {
			const $tab = $(`
				<div class="tab">
					<h1>${q.round}</h1>
					<h3>${q.prompt}<br>${q.details || ''}</h3>
					<form name="${q.key}">
						<div class="contestants" id="${q.key}-body"></div>
					</form>
				</div>
			`);
			form.append($tab);
			buildQuestionBody(q);
		}
    });
	buildBonusQuestionTabs();
}

// Functions to create question body html
function buildQuestionBody(q) {
    const $container = $(`#${q.key}-body`);
    if (q.type === "contestant-radio") {
        buildContestantRadios({
            containerId: `${q.key}-body`,
            questionName: q.key
        });
    }
    if (q.type === "dropdown") {
        const $select = $('<select></select>')
            .attr('name', q.key)
            .append('<option value="">-- Select --</option>');
        q.options.forEach(opt => {
            $select.append(`<option value="${opt}">${opt}</option>`);
        });
        $container.append($select);
    }
}
function buildBonusQuestionTabs(){
	const form = $('#survivor_form');
	const tab = $(`
		<div class="tab">
			<h1>BONUS QUESTIONS</h1>
			<h3>Each question +2 if pre-merge<br>+4 if post-merge</h3>
			<br><br>
	`);
	BONUS_QUESTIONS.forEach(q => {
		const subtab = $(`
			<h3>${q.prompt}</h3>
			<form name="${q.key}">
				<div class="contestants" id="${q.key}-body"></div>
			</form>
			<br><br>
		`);
		tab.append(subtab);
	});
	tab.append($(`</div>`));
	form.append(tab);
	BONUS_QUESTIONS.forEach(q => {
		buildQuestionBody(q);
	});
}
function buildFinalQuestionTabs(q, n){
	const form = $('#survivor_form');
	const tab = $(`
		<div class="tab">
			<h1>${q.round}</h1>
			<h3>${q.prompt}<br>${q.details || ''}</h3>
			<br><br>
	`);
	let prefix = 'pick_';
	if (n === 8) { 
		prefix = 'place_';
	}
	for (let i = 1; i <= n; i++) {
		const $subtab = $(`
			<form name="${prefix}${i}">
				<div class="contestants" id="${prefix}${i}-body">
					<h3>${i}:</h3>
				</div>
			</form>
			<br><br>
		`);
		tab.append($subtab);
	}
	tab.append($(`</div>`));
	form.append(tab);
	for (let i = 1; i <= n; i++) {
		const $container = $(`#${prefix}${i}-body`);
		const $select = $(`<select></select>`)
			.attr('name', `${prefix}${i}`)
			.append('<option value="">-- Select --</option>');
		q.options.forEach(opt => {
			$select.append(`<option value="${opt}">${opt}</option>`);
		});
		$container.append($select);
	};
}
function buildContestantRadios({containerId, questionName}) {
	const container = document.getElementById(containerId);
	if (!container) return;
	container.innerHTML = "";
	Object.entries(CONTESTANTS).forEach(([name, tribe]) => {
		const id = `${name.toLowerCase()}_${questionName}`;
		const wrapper = document.createElement("div");
		wrapper.className = "cc-selector";
		wrapper.innerHTML = `
			<p class="name">${name}</p>
			<img src="images/flag_${tribe.toLowerCase()}.jpg" />
			<input id="${id}" type="radio" name="${questionName}" value="${name}" />
			<label class="survivor-cc ${name} ${questionName}" for="${id}"></label>
		`;
		container.appendChild(wrapper);
	});
};

// Function to form tabs logic
function initTabs() {
    const tabs = $('#survivor_form .tab');
    const progressBar = $('#progress_bar progress');
    let currentTab = 0;

    function showTab(n) {
        tabs.hide();
        $(tabs[n]).show();
        const progressValue = ((n + 1) / tabs.length) * 100;
        progressBar.val(progressValue);
		if (n==0) { 
			$('#prevBtn').addClass('isHidden'); 
		} else { 
			$('#prevBtn').removeClass('isHidden'); 
		};
		if (n==tabs.length-1) { 
			$('#nextBtn').addClass('isHidden');
			$('#submitBtn').removeClass('isHidden');
		} else { 
			$('#nextBtn').removeClass('isHidden');
			$('#submitBtn').addClass('isHidden');
		};
    }
	
    // Initial display
    showTab(currentTab);
	
	// Previous and Next buttons
    $('#prevBtn').click(function() {
        if (currentTab > 0) {
            currentTab--;
            showTab(currentTab);
        }
		scrollToTop();
    });
    $('#nextBtn').click(function() {
        if (currentTab < tabs.length - 1) {
            currentTab++;
            showTab(currentTab);
        }
		scrollToTop();
    });
	
	// Submit button
	$('#submitBtn').on('click', async function (e) {
		e.preventDefault();
		await submitToSupabase();
	});
}

// Function to initialize index.html (hero page and submission form)
function init() {
    // Dynamic form creation
	buildTabs();

	// Move past hero page and enter form on click
	$('#enterBtn').click(function() {
        $('.title_img').addClass('isHidden');
        $('#survivor_form').removeClass('isHidden');
        $('#advance_form').removeClass('isHidden');
		
        // Init tabs and progress bar
        initTabs();
    });
	
	// Move past hero page and go to results on click
    $('#resultsBtn').click(function() {
        window.location = "results.html";
    });
	$('#resultsBtn2').click(function() {
        window.location = "results.html";
    });
	$('#readmeBtn').click(function() {
        window.location = "https://github.com/ethanebinger/Fantasy-Survivor/blob/master/README.md";
    });

	// Home button reset
	$('#homeBtn').click(function() {
        window.location = "index.html";
    });

    // Responsive height
    function autoResizeDiv() {
        document.getElementById('survivor_form').style.height = window.innerHeight + 'px';
    }
    window.onresize = autoResizeDiv;
    autoResizeDiv();
}

// Grey-out functionality for contestant buttons
$(document).on("change", ".contestants input[type='radio']", function () {
    const $input = $(this);
    const $contestants = $input.closest(".contestants");
    $contestants.find("label.survivor-cc").addClass("greyLabel");
    $input.next("label.survivor-cc").removeClass("greyLabel");
});

// Function to scroll to top after clicking Next/Previous (smooth if supported, otherwise it will jump)
function scrollToTop() {
	window.scrollTo({ top: 0, behavior: 'smooth' });
}


/***************************************
 * PUSH RESPONSES TO SUPABASE
 ***************************************/
function collectResponses() {
	const responses = {};

	// Find all forms that have a name
	$('form[name]').each(function () {
		const formName = this.getAttribute('name');
		const $form = $(this);

		// Check for dropdowns
		const $select = $form.find('select');
		if ($select.length > 0) {
			responses[formName] = $select.val() || null;
			return;
		}

		// Check for radio groups
		const $checked = $form.find('input[type="radio"]:checked');
		if ($checked.length > 0) {
			responses[formName] = $checked.val() || null;
			return;
		}

		// If nothing found, store null
		responses[formName] = null;
	});

	return responses;
}
async function submitToSupabase() {
	// Gather responses directly from DOM
	const payload = collectResponses();
	console.log(payload);

	// Add optional metadata
	const row = {
		week: (typeof CURRENT_WEEK !== 'undefined') ? CURRENT_WEEK : null,
		submit_time: new Date().toISOString(),
		player: payload['player_name'] || null,
		payload
	};

	// Update UI: disable submit, show progress text
	$('#submitBtn').prop('disabled', true).text('Submitting…');
	try {
		const { data, error } = await supabaseClient
			.from(SUPABASE_TABLE)       // table name
			.insert([row])       // array of rows
			.select();           // optional: return inserted rows

		if (error) {
			console.error('Supabase insert error:', error);
			alert('Sorry, there was a problem saving your picks. Please try again.');
			$('#submitBtn').prop('disabled', false).text('Submit');
			return;
		}

		// Success UI
		$('#success_screen').removeClass('isHidden');
		$('#survivor_form').addClass('isHidden');
		$('#advance_form').addClass('isHidden');

	} catch (e) {
		// Error UI
		console.error('Unexpected error:', e);
		$('#success-text').text('Unexpected error submitting. Please try again.');
		$('#success_screen').removeClass('isHidden');
		$('#survivor_form').addClass('isHidden');
		$('#advance_form').addClass('isHidden');
	}
}

/********************************************
 * LOAD RESULTS AND RESPONSES FROM SUPABASE
 ********************************************/
async function requestFromSupabase(table) {
	let query = supabaseClient.from(table).select('*');
	if (table === SUPABASE_TABLE) {
		query = query.order('submit_time', { ascending: true });
	}
	const { data, error } = await query;
	if (error) {
		console.error('Error loading picks:', error);
		return [];
	}
	return data;
}

// Function to get player responses
async function loadResponses() {
  const rows = await requestFromSupabase(SUPABASE_TABLE);
  return rows.map(row => ({
    name: row.player,
    submit_time: new Date(row.submit_time),
    week: row.week,
    ...row.payload
  }));
}

// Function to get results to score against
async function loadResults() {
  const rawResults = await requestFromSupabase(SUPABASE_TABLE_RESULTS);
  return rawResults.map(r => ({
    ...r,
    air_time: r.air_time ? new Date(r.air_time) : null
  }));
}


/*********************
 * RESPONSES.HTML
 *********************/
function buildResponsesDropdown() {
	// Players
	let container = $(`#past_responses_name-body`);
	let select = $('<select></select>')
		.attr('id', 'past_responses_name')
		.attr('style', 'font-size:18px')
		.append('<option value="">-- Select One --</option>');
	PLAYERS.forEach(p => {
		select.append(`<option value="${p}">${p}</option>`);
	});
	container.append(select);

	// Episodes/Votes
    container = $(`#past_responses_vote-body`);
	select = $('<select></select>')
		.attr('id', 'past_responses_vote')
		.attr('style', 'font-size:18px')
		.append('<option value="">-- Select One --</option>');
	const weeks = Array.from({ length: CURRENT_WEEK }, (_, i) => i + 1);
	weeks.forEach(w => {
		select.append(`<option value=${w}>Episode ${w}</option>`);
	});
	select.append(`<option value="final_three"}>Final Three</option>`)
	if (CURRENT_WEEK >= 11) {
		select.append(`<option value="final_eight"}>Final Eight</option>`)
	}
	container.append(select);
}

let scores_responses = {};
async function init_responses() {
    $('#resultsBtn').click(function(e) {
		window.location = "results.html";
    });

	// Function to generate dropdown selection menus
	buildResponsesDropdown();

	try {
        // wait for responses and results to load from supabase
        const saved_responses = await loadResponses();
		const responses = keepLastBySubmitTime(saved_responses);
        const results = await loadResults();

		// calculate scores once data is ready
        scores_responses = calculateScoresV2(results, responses);
		scores_responses = final_three_calcV2(scores_responses, responses);
		scores_responses = final_eight_calcV2(scores_responses, responses);

		// filter past responses on click
        $("#past_responses_button").click(function() {
			$("#past_responses").empty();
			let curName = $("#past_responses_name option:selected").val();
			let curVote = $("#past_responses_vote option:selected").val();
			if (curName.length < 1 || curVote.length < 1) {
				alert("Please select both a name and a vote/episode"); // clean this up to not be an alert
			} else if (curVote === "final_eight") {
				if (!scores_responses[curName][curVote]) { 
					ifEmptyHTML();
				} else {
					let scores_filter = scores_responses[curName][curVote];
					let response_filter = responses.filter(s => s.name===curName && s.week===11)[0];
					//console.log("CALCULATE FINAL EIGHT SCORE")
					getWeeklyResults(scores_filter, response_filter, curVote);
				};			
			} else if (curVote === "final_three") {
				if (!scores_responses[curName][curVote]) { 
					ifEmptyHTML();
				} else {
					let scores_filter = scores_responses[curName][curVote];
					let response_filter = responses.filter(s => s.name===curName && s.week===1)[0];
					//console.log("CALCULATE FINAL THREE SCORE")
					getWeeklyResults(scores_filter, response_filter, curVote);
				};				
			} else {
				curVote = parseInt(curVote,10);
				if (!scores_responses[curName][curVote]) { 
					ifEmptyHTML();
				} else {
					let scores_filter = scores_responses[curName][curVote];
					let response_filter = responses.filter(s => s.name===curName && s.week===curVote)[0];
					getWeeklyResults(scores_filter, response_filter, curVote);
				};				
			};
		});

    } catch (err) {
        console.error("Error loading data:", err);
    }
};

function getWeeklyResults(score, response, curVote) {
	$("#past_responses").append("<h3 id='responses_table_header'></h3>");
	$("#past_responses").append("<table id='responses_table'></table>");
	if (curVote == "final_three") {
		// NEED TO VERIFY THAT THIS WORKS
		$("#responses_table_header").html("Final Three");
		$("#responses_table").html(
			"<colgroup><col><col></colgroup>" +
			"<tr><th>Pick</th><th>Points Earned</th></tr>" +
			"<tr><td>" + response.pick_1 + "</td><td>"+ score.pick_1 +"</td></tr>" +
			"<tr><td>" + response.pick_2 + "</td><td>"+ score.pick_2 +"</td></tr>" +
			"<tr><td>" + response.pick_3 + "</td><td>"+ score.pick_3 +"</td></tr>"
		);
	} else if (curVote == "final_eight") {
		// NEED TO VERIFY THAT THIS WORKS
		$("#responses_table_header").html("Final Eight");
		$("#responses_table").html(
			"<colgroup><col><col></colgroup>" +
			"<tr><th>Rank</th><th>Name</th></tr>" +
			"<tr><td>1st</td><td>"+ response.place_1 +"</td></tr>" +
			"<tr><td>2nd</td><td>"+ response.place_2 +"</td></tr>" +
			"<tr><td>3rd</td><td>"+ response.place_3 +"</td></tr>" +
			"<tr><td>4th</td><td>"+ response.place_4 +"</td></tr>" +
			"<tr><td>5th</td><td>"+ response.place_5 +"</td></tr>" +
			"<tr><td>6th</td><td>"+ response.place_6 +"</td></tr>" +
			"<tr><td>7th</td><td>"+ response.place_7 +"</td></tr>" +
			"<tr><td>8th</td><td>"+ response.place_8 +"</td></tr>"
		);
	} else if (curVote == 14) {
		$("#responses_table_header").html("Finale");
		$("#responses_table").html(
			"<colgroup><col><col><col></colgroup>" +
			"<tr><th>Question</th><th>Response</th><th>Points Earned</th></tr>" +
			"<tr><td><strong>Wins Reward Challenge</strong></td><td>" + response.reward + "</td><td>"+ score.reward +"</td></tr>" +
			"<tr><td><strong>Wins 1st Immunity Challenge</strong></td><td>" + response.immunity_5 + "</td><td>"+ score.immunity_5 +"</td></tr>" +
			"<tr><td><strong>Wins Immunity Challenge</strong></td><td>" + response.immunity_4 + "</td><td>"+ score.immunity_4 +"</td></tr>" +
			"<tr><td><strong>Wins Fire Making Challenge</strong></td><td>" + response.fire_challenge + "</td><td>"+ score.fire_challenge +"</td></tr>" +
			"<tr><td><strong>Title Quote</strong></td><td>" + response.title_quote + "</td><td>"+ score.title_quote +"</td></tr>" +
			"<tr><td><strong>Nudity</strong></td><td>" + response.nudity + "</td><td>"+ score.nudity +"</td></tr>" +
			"<tr><td><strong>Idol or Advantage Found</strong></td><td>" + response.idol_found + "</td><td>"+ score.idol_found +"</td></tr>" +
			"<tr><td><strong>Idol or Advantage Played</strong></td><td>" + response.idol_played + "</td><td>"+ score.idol_played +"</td></tr>" +
			"<tr><td><strong>Shot-in-the-Dark Played</strong></td><td>" + response.shot_in_the_dark + "</td><td>"+ score.shot_in_the_dark +"</td></tr>" + 
			"<tr><td><strong>Fish Caught</strong></td><td>" + response.fish_catch + "</td><td>"+ score.fish_catch +"</td></tr>" +
			"<tr><td><strong>Unanimous Vote</strong></td><td>" + response.vote_unanimous + "</td><td>"+ score.vote_unanimous +"</td></tr>" +
			"<tr><td><strong>Jeff Laugh at Last Place</strong></td><td>" + response.jeff_joke + "</td><td>"+ score.jeff_joke +"</td></tr>"
		);
	} else if (curVote >= 11) {
		$("#responses_table_header").html("Episode "+String(curVote));
		$("#responses_table").html(
			"<colgroup><col><col><col></colgroup>" +
			"<tr><th>Question</th><th>Response</th><th>Points Earned</th></tr>" +
			"<tr><td><strong>Wins Reward Challenge</strong></td><td>" + response.reward + "</td><td>"+ score.reward +"</td></tr>" +
			"<tr><td><strong>Wins Immunity</strong></td><td>" + response.immunity + "</td><td>"+ score.immunity +"</td></tr>" +
			"<tr><td><strong>Title Quote</strong></td><td>" + response.title_quote + "</td><td>"+ score.title_quote +"</td></tr>" +
			"<tr><td><strong>Goes on Journey</strong></td><td>" + response.summit + "</td><td>"+ score.summit +"</td></tr>" +
			"<tr><td><strong>Nudity</strong></td><td>" + response.nudity + "</td><td>"+ score.nudity +"</td></tr>" +
			"<tr><td><strong>Idol or Advantage Found</strong></td><td>" + response.idol_found + "</td><td>"+ score.idol_found +"</td></tr>" +
			"<tr><td><strong>Idol or Advantage Played</strong></td><td>" + response.idol_played + "</td><td>"+ score.idol_played +"</td></tr>" +
			"<tr><td><strong>Shot-in-the-Dark Played</strong></td><td>" + response.shot_in_the_dark + "</td><td>"+ score.shot_in_the_dark +"</td></tr>" + 
			"<tr><td><strong>Fish Caught</strong></td><td>" + response.fish_catch + "</td><td>"+ score.fish_catch +"</td></tr>" +
			"<tr><td><strong>Unanimous Vote</strong></td><td>" + response.vote_unanimous + "</td><td>"+ score.vote_unanimous +"</td></tr>" +
			"<tr><td><strong>Jeff Laugh at Last Place</strong></td><td>" + response.jeff_joke + "</td><td>"+ score.jeff_joke +"</td></tr>"
		);
	} else {
		$("#responses_table_header").html("Episode "+String(curVote));
		$("#responses_table").html(
			"<colgroup><col><col><col></colgroup>" +
			"<tr><th>Question</th><th>Response</th><th>Points Earned</th></tr>" +
			"<tr><td><strong>Wins Reward Challenge</strong></td><td>" + response.reward + "</td><td>"+ score.reward +"</td></tr>" +
			"<tr><td><strong>Wins Immunity</strong></td><td>" + response.immunity + "</td><td>"+ score.immunity +"</td></tr>" +
			"<tr><td><strong>Eliminated</strong></td><td>" + response.eliminated + "</td><td>"+ score.eliminated +"</td></tr>" +
			"<tr><td><strong>Safe</strong></td><td>" + response.safe + "</td><td>"+ score.safe +"</td></tr>" +
			"<tr><td><strong>Title Quote</strong></td><td>" + response.title_quote + "</td><td>"+ score.title_quote +"</td></tr>" +
			"<tr><td><strong>Goes on Journey</strong></td><td>" + response.summit + "</td><td>"+ score.summit +"</td></tr>" +
			"<tr><td><strong>Nudity</strong></td><td>" + response.nudity + "</td><td>"+ score.nudity +"</td></tr>" +
			"<tr><td><strong>Idol or Advantage Found</strong></td><td>" + response.idol_found + "</td><td>"+ score.idol_found +"</td></tr>" +
			"<tr><td><strong>Idol or Advantage Played</strong></td><td>" + response.idol_played + "</td><td>"+ score.idol_played +"</td></tr>" +
			"<tr><td><strong>Shot-in-the-Dark Played</strong></td><td>" + response.shot_in_the_dark + "</td><td>"+ score.shot_in_the_dark +"</td></tr>" + 
			"<tr><td><strong>Fish Caught</strong></td><td>" + response.fish_catch + "</td><td>"+ score.fish_catch +"</td></tr>" +
			"<tr><td><strong>Unanimous Vote</strong></td><td>" + response.vote_unanimous + "</td><td>"+ score.vote_unanimous +"</td></tr>" +
			"<tr><td><strong>Jeff Laugh at Last Place</strong></td><td>" + response.jeff_joke + "</td><td>"+ score.jeff_joke +"</td></tr>"
		);
	};
};
    
function ifEmptyHTML() {
	var html_length = $("#past_responses").children().length;
	if (html_length === 0) {
		$("#past_responses").append(
			"<h3></h3><span>Nothing submitted in this category, please select again.</span>"
		);
	};
};

/*********************
 * RESULTS.HTML
 *********************/
// Function to intialize results.html
async function init_results() {
    // button functionality
    $('#PastResponses').click(function() {
        window.location = "responses.html";
    });
    $('#LandingPage').click(function() {
        window.location = "index.html";
    });

    try {
        // wait for responses and results to load from supabase
        const saved_responses = await loadResponses();
		const responses = keepLastBySubmitTime(saved_responses);
        const results = await loadResults();

		// calculate scores once data is ready
        let scores = calculateScoresV2(results, responses);
		scores = final_three_calcV2(scores, responses);
		scores = final_eight_calcV2(scores, responses);

        // create D3 chart
		const active_players = getActivePlayers(responses);
        const scores_flat = flattenScores(scores, active_players);
		createD3chart(scores_flat);

    } catch (err) {
        console.error("Error loading data:", err);
    }
};

// Functions to get unique list of active players (people who have submitted a response)
function onlyUnique(value, index, self) {
	return self.indexOf(value) === index;
};
function getActivePlayers(r) {
	var players = [];
	for (var i=0; i < r.length; i++) { players.push(r[i].name) };
	players = players.filter(onlyUnique).sort().reverse();
	return players;
};

// Function to de-duplicate responses by (week, name), keeping only the last timestamp
function keepLastBySubmitTime(items) {
	const sorted = [...items].sort((a, b) => new Date(a.submit_time) - new Date(b.submit_time));
	const map = new Map();
	for (const it of sorted) {
		const key = `${it.week}||${it.name}`;
		map.set(key, it);
	}
	return Array.from(map.values());
};

// Function to create score array from players
function createScoreArrayV2(weeks, players){
	var scores = {};
	var questions = [
		...QUESTIONS.map(item => item.key), 
		...BONUS_QUESTIONS.map(item => item.key)
	];
	for (let p=0; p<players.length; p++) {
		var player = players[p];
		scores[player] = {};
		for (let w=0; w<weeks.length; w++) {
			var week = weeks[w];		
			scores[player][week] = {'total':0};
			for (let q=0; q<questions.length; q++) {
				var question = questions[q];
				if (question!='player_name' && question!='final_three' && question!='final_eight') { 
					scores[player][week][question] = 0 
				};
			};
		};
		scores[player]['final_three'] = {'total':0, 'pick_1':0, 'pick_2':0, 'pick_3':0};
		scores[player]['final_eight'] = {'total':0};
	}
	return scores;
};
function createScoreArrayV3(weeks, players) {
	const scores = {};
	const excluded = new Set(['player_name', 'final_three', 'final_eight']);
	const questions = [
		...QUESTIONS.map(item => item.key),
		...BONUS_QUESTIONS.map(item => item.key),
	].filter(k => !excluded.has(k));
	for (const player of players) {
		const perPlayer = {};
		for (const week of weeks) {
			const bucket = { total: 0 };
		for (const q of questions) bucket[q] = 0;
			perPlayer[week] = bucket;
		}
		perPlayer.final_three = {total: 0, pick_1: 0, pick_2: 0, pick_3: 0,};
		perPlayer.final_eight = {total: 0};
		scores[player] = perPlayer;
	}
	return scores;
}

// Function to flatten scores for D3 chart
function flattenScores(scores, players) {
	const output = [];
	for (const player of players) {
		const entry = {
			name: player,
			total: 0,
			"Episode 1": 0,
			"Episode 2": 0,
			"Episode 3": 0,
			"Episode 4": 0,
			"Episode 5": 0,
			"Episode 6": 0,
			"Episode 7": 0,
			"Episode 8": 0,
			"Episode 9": 0,
			"Episode 10": 0,
			"Episode 11": 0,
			"Episode 12": 0,
			"Episode 13": 0,
			"Episode 14": 0,
			"Final Eight": 0,
			"Final Three": 0
		};

		// Fill values from the scores schema
		const p = scores[player];
		for (let w = 1; w <= 13; w++) {
			if (p[w] && typeof p[w].total === "number") {
				entry[`Episode ${w}`] = p[w].total;
				entry.total += p[w].total;
			}
		}
		if (p.final_eight) {
			entry["Final Eight"] = p.final_eight.total;
			entry.total += p.final_eight.total;
		}
		if (p.final_three) {
			entry["Final Three"] = p.final_three.total;
			entry.total += p.final_three.total;
		}
		output.push(entry);
	}
	return output;
};

// Function to create D3 chart on results.html
function createD3chart(scores) {
	// Create arrays for players, keys (votes)
	var players = scores.map(item => item.name);
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
			var seriesKey = (this.parentNode && this.parentNode.__data__) ? this.parentNode.__data__.key : '';
			return 	"<strong>" + d.data.name + "</strong>"
					+ "<br><span>" + formatSeriesLabel(seriesKey) + " Score = " + parseFloat(d[1]-d[0]).toFixed(0) + "</span>"
					+ "<br><span>Total Score = " + parseFloat(d.data.total).toFixed(0) + "</span>";
		});
	function formatSeriesLabel(key) {
		// keys could be "Episode 1", "Final Eight", "Final Three"
		return key && key.startsWith('Episode') ? key : key;
	};

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
				tip.show.call(this, d); // ensure `this` is available to tip.html
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

// FUNCTION TO CALCULATE SCORES FOR WEEKLY RESPONSES
function calculateScoresV2(results, responses) {
	// create empty score array using active players within responses array
	var players = getActivePlayers(responses);
	var weeks = results.map(item => item.week).filter(onlyUnique).sort();
	var scores = createScoreArrayV3(weeks, players);
	// iterate through results
	for (let i=0; i<results.length; i++){
		// results for currently selected week
		const result = results[i];
		const cur_week = result.week
		// match responses by week - can update later to match on datetime
		const matched = responses.filter(r => r.week === cur_week);
		// iterate through responses
		for (let j=0; j<matched.length; j++) {
			// responses for currently selected week and player
			var response = matched[j];
			var player = response.name
			// MAIN QUESTIONS
			// Reward
			if (response.reward && inArray(response.reward, result.reward)) {			// there is a probably smarter way to do this
				if (result.merge === "Yes") { 
					scores[player][cur_week].reward += 10;
					scores[player][cur_week].total += 10;
				} else { 
					scores[player][cur_week].reward += 5;
					scores[player][cur_week].total += 5;
				};				
			};
			// Immunity
			if (response.immunity && inArray(response.immunity, result.immunity)) {
				if (result.merge === "Yes") { 
					scores[player][cur_week].immunity += 15;
					scores[player][cur_week].total += 15;
				} else { 
					scores[player][cur_week].immunity += 5;
					scores[player][cur_week].total += 5;
				};				
			};
			// Eliminated
			if (response.eliminated && inArray(response.eliminated, result.eliminated)) {
				if (result.merge === "Yes") { 
					scores[player][cur_week].eliminated += 20;
					scores[player][cur_week].total += 20;
				} else { 
					scores[player][cur_week].eliminated += 10;
					scores[player][cur_week].total += 10;
				};				
			};
			// Safe
			if (inArray(response.safe, result.eliminated)) {
				continue
			} else if (response.safe) {
				scores[player][cur_week].safe += 10;
				scores[player][cur_week].total += 10;		
			};
			// Bonus Questions
			for (let k=0; k<BONUS_QUESTIONS.length; k++){
				var bq = BONUS_QUESTIONS[k].key
				if (response[bq] && result[bq]==response[bq]){
					if (result.merge === "Yes") { 
						scores[player][cur_week][bq] += 4;
						scores[player][cur_week].total += 4;
					} else { 
						scores[player][cur_week][bq] += 2;
						scores[player][cur_week].total += 2;
					};
				};
			};
		};
	};
	return scores;
};

// FUNCTION TO CALCULATE SCORES FOR FINAL EIGHT
function which_castaway(castaways){
	var sum = 0,
		bonus = 0;
	for (var i=1; i<9; i++){
		if (castaways['place_'+String([i])] === "Rachel") {			// sole survivor
			sum += Math.pow(Math.abs(i-1),2.25);
			if (i===1) { bonus += 5 };
		} else if (castaways['place_'+String([i])] === "Sam") {	// runner up
			sum += Math.pow(Math.abs(i-2),2.25);
			if (i===2) { bonus += 5 };
		} else if (castaways['place_'+String([i])] === "Sue") {	// third
			sum += Math.pow(Math.abs(i-3),2.25);
			if (i===3) { bonus += 5 };
		} else if (castaways['place_'+String([i])] === "Teeny") {	// fourth
			sum += Math.pow(Math.abs(i-4),2.25);
			if (i===4) { bonus += 5 };
		} else if (castaways['place_'+String([i])] === "Genevieve") {	// fifth
			sum += Math.pow(Math.abs(i-5),2.25);
			if (i===5) { bonus += 5 };
		} else if (castaways['place_'+String([i])] === "Andy") {	// sixth
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
function final_eight_calcV2(scores, responses) {
    const submit_week = 1;
	const matched = responses.filter(r => r.week === submit_week);
	for (let i=0; i<matched.length; i++) {
		const response = matched[i];
		const player = response.name;
		var score8 = which_castaway(response);
		scores[player].final_eight.total += score8;
	};
    return (scores);
};

// FUNCTION TO CALCULATE SCORES FOR FINAL THREE
function final_three_calcV2(scores, responses){
	const FINAL_THREE = ['Rachel', 'Sam', 'Sue'];
	const submit_week = 1;
	const matched = responses.filter(r => r.week === submit_week);
	for (let i=0; i<matched.length; i++) {
		const response = matched[i];
		const player = response.name;
		['pick_1', 'pick_2', 'pick_3'].forEach(x => {
			if (inArray(response[x], FINAL_THREE)) {
				scores[player].final_three[x] += 30;
				scores[player].final_three.total += 30;
			};
		});
	};
	return scores;
};
//*/