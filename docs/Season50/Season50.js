/*****************************
 * NOTES/TODO:
 * - figure out if final_three should be in week 1 or week 2, update accordingly
 * - stress test final_three and final_eight scoring logic
 * - [DONE] have flatten_scores() only set up for the actively scored weeks 
 * - [DONE] remove alert from responses.html and show as text
 * - [DONE] update responses.html table to look less janky, same applies to preview table on mobile
 * - [DONE] get players list (using team names?)
 * - [DONE] update and align bonus questions
 * - [DONE] add login functionality --> idea is to have the submit button go to a login page. user can either enter login info
 *   (username/email, password) or sign up. after signing up they are presented with the rules readme as HTML. then the form
 *   is loaded and uses the preset tab progression
 * - validate that signup works without errors. it appears to push data to tables but still throws error, unsure why
 * - [DONE] D3 table not fitting with expanded names (using team_name) maybe can wrap them or something?
 * - clean up the formatting for the rules.html page
 * - clean up init() and code within HTML that is no longer used, especially on the index.html page
 * - decide what to do with the index.html page is still needed as landing page? image takes a while to load on start
 * - force footer with disclaimer to bottom of page
 * - review and clean CSS code
 * - make the survivor-cc images fit within the boxes neatly (evenly cropped)
 * 
 *****************************/

/*****************************
 * VARIABLES 
 *****************************/
const CURRENT_WEEK = 1;
const CURRENT_EP_DATE = '2/25/26'
const EPISODE_NAME = 'Epic Party'
const FINAL_THREE_VOTE_WEEK = 2;
const FINAL_EIGHT_VOTE_WEEK = 11;
const FINAL_VOTE_WEEK = 14;
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
const FINAL_THREE = Object.keys(CONTESTANTS); //['1', '2', '3'];
const QUESTIONS = [
  {
    key: "player_name",
    round: `You are currently voting for<br>Episode ${CURRENT_WEEK}<br>Airing on ${CURRENT_EP_DATE}<br><br>`,
    prompt: "", //"What is your name?",
    details: "",
    type: "dropdown", 
	options: "",
    weeks: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]
  },
  {
    key: "final_three",
    round: "Who will be the final 3 survivors?",
    prompt: "Please pick one from each dropdown.<br>Order does not matter.",
    details: "You will get +30 points for each correct pick at the end of the season.",
    type: "dropdown", 
	options: Object.keys(CONTESTANTS),
    weeks: [FINAL_THREE_VOTE_WEEK]
  },
  {
    key: "final_eight",
    round: "OUTLAST",
    prompt: "Rank the remaining survivors.",
    details: "Please pick one from each dropdown. Order DOES matter.<br> Do not repeat your picks. All eight options should be used once.<br> You will get points for each pick based on the deviation from their final placement.",
    type: "dropdown", 
	options: Object.keys(CONTESTANTS),
    weeks: [FINAL_EIGHT_VOTE_WEEK]
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
		key: "vote_unanimous",
		prompt: "Will the vote be unanimous this week?",
		type: "dropdown",
		options: ["Yes", "No"]
	},
	{
		key: "journey",
		prompt: "Who (if anyone) will go on a journey this week?",
		type: "dropdown",
		options: ["No One", ...Object.keys(CONTESTANTS)]
	},
	{
		key: "nudity",
		prompt: "Will there be nudity (requiring blurring) this week? ",
		type: "dropdown",
		options: ["Yes", "No"]
	},
	{
		key: "fish_catch",
		prompt: "Will someone catch a fish this week?",
		type: "dropdown",
		options: ["Yes", "No"]
	},
	{
		key: "confessionals",
		prompt: "Who will have the most confessionals this episode?",
		type: "dropdown",
		options: Object.keys(CONTESTANTS)
	},
	{
		key: "crying",
		prompt: "Will someone visibly cry this episode?",
		type: "dropdown",
		options: ["Yes", "No"]
	}
];

/*****************************
 * Supabase client init
 *****************************/
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
		} else if (q.key=='player_name') {
			const $tab = $(`<div class="tab"><h1>${q.round}</h1></div>`);
			form.append($tab);
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
	buildReviewTab();
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
function showTab(n) {
	const tabs = $('#survivor_form .tab');
    const progressBar = $('#progress_bar progress');
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
		renderReview();
		$('#nextBtn').addClass('isHidden');
		$('#submitBtn').removeClass('isHidden');
	} else { 
		$('#nextBtn').removeClass('isHidden');
		$('#submitBtn').addClass('isHidden');
	};
};
function initTabs() {
    // Initial display
	let currentTab = 0;
    showTab(currentTab);
	const tabs = $('#survivor_form .tab');
	
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
	initTabs();

	// Move past hero page and enter form on click
	// setupLogin();
	// $('#enterBtn').click(function() {
    //     $('.title_img').addClass('isHidden');
    //     $('#survivor_form').removeClass('isHidden');
    //     $('#advance_form').removeClass('isHidden');
		
    //     // Init tabs and progress bar
    //     initTabs();
    // });
	
	// Move past hero page and go to results on click
    $('#resultsBtn').click(function() {
        window.location = "results.html";
    });
	$('#resultsBtn2').click(function() {
        window.location = "results.html";
    });
	$('#readmeBtn').click(function() {
        window.location = "rules.html";
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

// Functions to build and render the review tab (let users see answers prior to submission)
function buildReviewTab() {
	const form = $('#survivor_form');
	const $tab = $(`
		<div class="tab">
			<h1>REVIEW</h1>
			<h3>Please review your picks before submitting</h3>
			<div id="review-list"></div>
		</div>
	`);
	form.append($tab);
}
function renderReview() {
	const responses = collectResponses();
	const $list = $('#review-list');
	$list.empty();
	const $table = $(`<table id='review_responses_table'><tr><th>Question</th><th>Response</th></tr>`)
	Object.entries(responses).forEach(([key, value]) => {
		$table.append(`<tr><td>${formatLabel(key)}</td><td>${value}</td></tr>`);
	});
	$table.append(`</table>`);
	$list.append($table);
}
function formatLabel(key) {
	return key
		.replace(/_/g, ' ')
		.replace(/\b\w/g, c => c.toUpperCase());
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
	// Get logged in user information
	const { data: { user } } = await supabaseClient.auth.getUser();
	if (!user) {
		alert("You must be logged in to submit.");
		window.location.href = "login.html";
		return;
	};
	// Gather responses (directly from DOM) and user metadata (name, team_name)
	const payload = collectResponses();
	const meta = user.user_metadata || {};
	// Build row for responses table
	const row = {
		week: (typeof CURRENT_WEEK !== 'undefined') ? CURRENT_WEEK : null,
		submit_time: new Date().toISOString(),
		user_id: user.id,
		name: meta.name || null,
		team_name: meta.team_name || null,
		payload
	};
	// Submit responses to supabase
	$('#submitBtn').prop('disabled', true).text('Submitting…');
	try {
		const { error } = await supabaseClient
			.from(SUPABASE_TABLE)
			.insert([row]);
		if (error) {
			console.error('Supabase insert error:', error);
			alert('Sorry, there was a problem saving your picks. Please try again.');
			return;
		}
		$('#success_screen').removeClass('isHidden');
		$('#survivor_form').addClass('isHidden');
		$('#advance_form').addClass('isHidden');
	} catch (e) {
		console.error('Unexpected error:', e);
		$('#success-text').text('Unexpected error submitting. Please try again.');
		$('#success_screen').removeClass('isHidden');
		$('#survivor_form').addClass('isHidden');
		$('#advance_form').addClass('isHidden');
	} finally {
		$('#submitBtn').prop('disabled', false).text('Submit');
	};
};


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
		user_id: row.user_id,
		name: row.name,
		team_name: row.team_name,
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

// Function to get currently logged in user and their profile information
async function getAuthedUserAndProfile() {
	// 1) session/user (who is logged in)
	const { data: { user }, error: userErr } = await supabaseClient.auth.getUser();
	if (userErr) throw userErr;
	if (!user) throw new Error("Not logged in");

	// 2) profile (name/team_name stored in public.profiles)
	const { data: profile, error: profileErr } = await supabaseClient
		.from("profiles")
		.select("name, team_name")
		.eq("id", user.id)
		.single();

	if (profileErr) throw profileErr;

	return {
		user_id: user.id,
		name: profile?.name || "",
		team_name: profile?.team_name || ""
	};
}


/*********************
 * RESPONSES.HTML
 *********************/
function buildResponsesDropdown(responses) {
	// Players
	let container = $(`#past_responses_name-body`);
	let select = $('<select></select>')
		.attr('id', 'past_responses_name')
		.attr('style', 'font-size:18px')
		.append('<option value="">-- Select One --</option>');
	const active_teams = getActivePlayers(responses, 'team_name')
	active_teams.forEach(p => {
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
	if (CURRENT_WEEK >= FINAL_THREE_VOTE_WEEK) {
		select.append(`<option value="final_three"}>Final Three</option>`)
	};
	if (CURRENT_WEEK >= FINAL_EIGHT_VOTE_WEEK) {
		select.append(`<option value="final_eight"}>Final Eight</option>`)
	};
	container.append(select);
}

let scores_responses = {};
async function init_responses() {
    $('#resultsBtn').click(function(e) {
		window.location = "results.html";
    });

	try {
        // wait for responses and results to load from supabase
        const saved_responses = await loadResponses();
		const responses = keepLastBySubmitTime(saved_responses);
        const results = await loadResults();

		// Function to generate dropdown selection menus
		buildResponsesDropdown(responses);

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
				// alert("Please select both a name and a vote/episode"); // clean this up to not be an alert
				$("#past_responses").empty().append(`<br><h3>Please select both a name and a vote/episode</h3>`);
			} else if (curVote === "final_eight") {
				if (!scores_responses[curName][curVote]) { 
					$("#past_responses").empty().append(`<br><h3>Nothing submitted in this category</h3>`);
				} else {
					let scores_filter = scores_responses[curName][curVote];
					let response_filter = responses.filter(s => s.team_name===curName && s.week===FINAL_EIGHT_VOTE_WEEK)[0];
					getWeeklyResults(scores_filter, response_filter, curVote);
				};			
			} else if (curVote === "final_three") {
				if (!scores_responses[curName][curVote]) { 
					$("#past_responses").empty().append(`<br><h3>Nothing submitted in this category</h3>`);
				} else {
					let scores_filter = scores_responses[curName][curVote];
					let response_filter = responses.filter(s => s.team_name===curName && s.week===FINAL_THREE_VOTE_WEEK)[0];
					getWeeklyResults(scores_filter, response_filter, curVote);
				};				
			} else {
				curVote = parseInt(curVote,10);
				if (!scores_responses[curName][curVote]) { 
					$("#past_responses").empty().append(`<br><h3>Nothing submitted in this category</h3>`);
				} else {
					let scores_filter = scores_responses[curName][curVote];
					let response_filter = responses.filter(s => s.team_name===curName && s.week===curVote)[0];
					getWeeklyResults(scores_filter, response_filter, curVote);
				};				
			};
		});

    } catch (err) {
        console.error("Error loading data:", err);
    }
};

function getWeeklyResults(score, response, curVote) {
	$("#past_responses").empty();
	$("#past_responses").append("<h3 id='responses_table_header'></h3>");
	$("#past_responses").append("<table id='responses_table'></table>");
	if (curVote == "final_three") {
		$("#responses_table_header").html("Final Three");
		$("#responses_table").html(
			"<colgroup><col><col></colgroup>" +
			"<tr><th>Pick</th><th>Points Earned</th><th></th></tr>" +
			"<tr><td>" + response.pick_1 + "</td><td>"+ score.pick_1 +"</td><td></td></tr>" +
			"<tr><td>" + response.pick_2 + "</td><td>"+ score.pick_2 +"</td><td></td></tr>" +
			"<tr><td>" + response.pick_3 + "</td><td>"+ score.pick_3 +"</td><td></td></tr>"
		);
	} else if (curVote == "final_eight") {
		$("#responses_table_header").html("Final Eight");
		$("#responses_table").html(
			"<colgroup><col><col></colgroup>" +
			"<tr><th>Rank</th><th>Name</th><th></th></tr>" +
			"<tr><td>1st</td><td>"+ response.place_1 +"</td><td></td></tr>" +
			"<tr><td>2nd</td><td>"+ response.place_2 +"</td><td></td></tr>" +
			"<tr><td>3rd</td><td>"+ response.place_3 +"</td><td></td></tr>" +
			"<tr><td>4th</td><td>"+ response.place_4 +"</td><td></td></tr>" +
			"<tr><td>5th</td><td>"+ response.place_5 +"</td><td></td></tr>" +
			"<tr><td>6th</td><td>"+ response.place_6 +"</td><td></td></tr>" +
			"<tr><td>7th</td><td>"+ response.place_7 +"</td><td></td></tr>" +
			"<tr><td>8th</td><td>"+ response.place_8 +"</td><td></td></tr>"
		);
	} else if (curVote == FINAL_VOTE_WEEK) {
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
			"<tr><td><strong>Most Confessionals</strong></td><td>" + response.confessionals + "</td><td>"+ score.confessionals +"</td></tr>" + 
			"<tr><td><strong>Crying</strong></td><td>" + response.crying + "</td><td>"+ score.crying +"</td></tr>"
		);
	} else if (curVote >= FINAL_THREE_VOTE_WEEK) {
		$("#responses_table_header").html("Episode "+String(curVote));
		$("#responses_table").html(
			"<colgroup><col><col><col></colgroup>" +
			"<tr><th>Question</th><th>Response</th><th>Points Earned</th></tr>" +
			"<tr><td><strong>Wins Reward Challenge</strong></td><td>" + response.reward + "</td><td>"+ score.reward +"</td></tr>" +
			"<tr><td><strong>Wins Immunity</strong></td><td>" + response.immunity + "</td><td>"+ score.immunity +"</td></tr>" +
			"<tr><td><strong>Title Quote</strong></td><td>" + response.title_quote + "</td><td>"+ score.title_quote +"</td></tr>" +
			"<tr><td><strong>Goes on Journey</strong></td><td>" + response.journey + "</td><td>"+ score.journey +"</td></tr>" +
			"<tr><td><strong>Nudity</strong></td><td>" + response.nudity + "</td><td>"+ score.nudity +"</td></tr>" +
			"<tr><td><strong>Idol or Advantage Found</strong></td><td>" + response.idol_found + "</td><td>"+ score.idol_found +"</td></tr>" +
			"<tr><td><strong>Idol or Advantage Played</strong></td><td>" + response.idol_played + "</td><td>"+ score.idol_played +"</td></tr>" +
			"<tr><td><strong>Shot-in-the-Dark Played</strong></td><td>" + response.shot_in_the_dark + "</td><td>"+ score.shot_in_the_dark +"</td></tr>" + 
			"<tr><td><strong>Fish Caught</strong></td><td>" + response.fish_catch + "</td><td>"+ score.fish_catch +"</td></tr>" +
			"<tr><td><strong>Unanimous Vote</strong></td><td>" + response.vote_unanimous + "</td><td>"+ score.vote_unanimous +"</td></tr>" +
			"<tr><td><strong>Most Confessionals</strong></td><td>" + response.confessionals + "</td><td>"+ score.confessionals +"</td></tr>" + 
			"<tr><td><strong>Crying</strong></td><td>" + response.crying + "</td><td>"+ score.crying +"</td></tr>"
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
			"<tr><td><strong>Goes on Journey</strong></td><td>" + response.journey + "</td><td>"+ score.journey +"</td></tr>" +
			"<tr><td><strong>Nudity</strong></td><td>" + response.nudity + "</td><td>"+ score.nudity +"</td></tr>" +
			"<tr><td><strong>Idol or Advantage Found</strong></td><td>" + response.idol_found + "</td><td>"+ score.idol_found +"</td></tr>" +
			"<tr><td><strong>Idol or Advantage Played</strong></td><td>" + response.idol_played + "</td><td>"+ score.idol_played +"</td></tr>" +
			"<tr><td><strong>Shot-in-the-Dark Played</strong></td><td>" + response.shot_in_the_dark + "</td><td>"+ score.shot_in_the_dark +"</td></tr>" + 
			"<tr><td><strong>Fish Caught</strong></td><td>" + response.fish_catch + "</td><td>"+ score.fish_catch +"</td></tr>" +
			"<tr><td><strong>Unanimous Vote</strong></td><td>" + response.vote_unanimous + "</td><td>"+ score.vote_unanimous +"</td></tr>" +
			"<tr><td><strong>Most Confessionals</strong></td><td>" + response.confessionals + "</td><td>"+ score.confessionals +"</td></tr>" + 
			"<tr><td><strong>Crying</strong></td><td>" + response.crying + "</td><td>"+ score.crying +"</td></tr>"
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
        window.location = "results.html";
    });
	$('#readmeBtn').click(function() {
        window.location = "rules.html";
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
		const active_players = getActivePlayers(responses, 'team_name');
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
function getActivePlayers(r, fieldName='name') {
	// fieldName = 'name' || fieldName = 'team_name'
	var players = [];
	for (var i=0; i < r.length; i++) { players.push(r[i][fieldName]) };
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
			total: 0
		};
		const p = scores[player];
		for (let w = 1; w <= CURRENT_WEEK; w++) {
			entry[`Episode ${w}`] = 0;
			if (p[w] && typeof p[w].total === "number") {
				entry[`Episode ${w}`] = p[w].total;
				entry.total += p[w].total;
			}
		}
		if (p.final_eight && CURRENT_WEEK>=FINAL_EIGHT_VOTE_WEEK) {
			entry["Final Eight"] = p.final_eight.total;
			entry.total += p.final_eight.total;
		}
		if (p.final_three && CURRENT_WEEK>=FINAL_THREE_VOTE_WEEK) {
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
		height = (players.length * 80) - margin.top - margin.bottom;

	// Define Scales and Axes
	var x = d3.scaleLinear()
		.range([0, width-100]);
	var y = d3.scaleBand()
		.domain(players)
		.rangeRound([height, 0])
		.padding(0.3);
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
	var yAxisG = chart.append("g")
		.attr("class", "y axis")
		.call(yAxis);
	yAxisG.selectAll(".tick text")
    	.call(wrap, margin.left - 12);


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

// Wrap helper for D3 y-axis labels
function wrap(text, width) {
	if (width <= 10) return;
	text.each(function () {
		var text = d3.select(this);
		var words = (text.text() || "")
			.replace(/\u00A0/g, " ")
			.trim()
			.split(/\s+/)
			.filter(Boolean)
			.reverse();
		var word, line = [];
		var lineHeight = 1.1; // em
		var y = text.attr("y");
		var dy = parseFloat(text.attr("dy")) || 0;
		text.text(null);
		var tspan = text.append("tspan")
			.attr("x", -6)
			.attr("y", y)
			.attr("dy", dy + "em");
		while ((word = words.pop())) {
			if (!word) continue;
			line.push(word);
			tspan.text(line.join(" "));
			if (tspan.node().getComputedTextLength() > width && line.length > 1) {
				line.pop();
				tspan.text(line.join(" "));
				line = [word];

				tspan = text.append("tspan")
				.attr("x", -6)
				.attr("y", y)
				.attr("dy", lineHeight + "em")   // ✅ constant spacing each new line
				.text(word);
			};
		};
	});
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
	var players = getActivePlayers(responses, 'team_name');
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
			var player = response.team_name
			// MAIN QUESTIONS
			// Reward
			if (response.reward && inArray(response.reward, result.reward)) {
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
				if (bq === "journey" && response[bq] && inArray(response[bq], result[bq])) {
					if (result.merge === "Yes") { 
						scores[player][cur_week][bq] += 4;
						scores[player][cur_week].total += 4;
					} else { 
						scores[player][cur_week][bq] += 2;
						scores[player][cur_week].total += 2;
					};
				} else if (response[bq] && result[bq]==response[bq]){
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
		if (castaways['place_'+String([i])] === "-") {			// sole survivor
			sum += Math.pow(Math.abs(i-1),2.25);
			if (i===1) { bonus += 5 };
		} else if (castaways['place_'+String([i])] === "-") {	// runner up
			sum += Math.pow(Math.abs(i-2),2.25);
			if (i===2) { bonus += 5 };
		} else if (castaways['place_'+String([i])] === "-") {	// third
			sum += Math.pow(Math.abs(i-3),2.25);
			if (i===3) { bonus += 5 };
		} else if (castaways['place_'+String([i])] === "-") {	// fourth
			sum += Math.pow(Math.abs(i-4),2.25);
			if (i===4) { bonus += 5 };
		} else if (castaways['place_'+String([i])] === "-") {	// fifth
			sum += Math.pow(Math.abs(i-5),2.25);
			if (i===5) { bonus += 5 };
		} else if (castaways['place_'+String([i])] === "-") {	// sixth
			sum += Math.pow(Math.abs(i-6),2.25);
			if (i===6) { bonus += 5 };
		} else if (castaways['place_'+String([i])] === "-") {	// seventh
			sum += Math.pow(Math.abs(i-7),2.25)
			if (i===7) { bonus += 5 };
		} else if (castaways['place_'+String([i])] === "-") {	// eighth
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
		const player = response.team_name;
		var score8 = which_castaway(response);
		scores[player].final_eight.total += score8;
	};
    return (scores);
};

// FUNCTION TO CALCULATE SCORES FOR FINAL THREE
function final_three_calcV2(scores, responses){
	const submit_week = 1;
	const matched = responses.filter(r => r.week === submit_week);
	for (let i=0; i<matched.length; i++) {
		const response = matched[i];
		const player = response.team_name;
		['pick_1', 'pick_2', 'pick_3'].forEach(x => {
			if (inArray(response[x], FINAL_THREE)) {
				scores[player].final_three[x] += 30;
				scores[player].final_three.total += 30;
			};
		});
	};
	return scores;
};


/*******************************************
 * LOGIN.HTML AND USER AUTHENTICATION LOGIC
 *******************************************/
function setupLogin() {
	// SIGNUP
	$('#signup').on('click', async () => {
		// 0) lock form and get input user info
		$('#signup').prop('disabled', true).text('Submitting…');
		const name = $('#name').val();
		const team_name = $('#team_name').val();
		const email = $('#email').val();
		const password = $('#password').val();

		// 1) check if team_name already taken
		const { data: taken } = await supabaseClient
			.from('team_names')
			.select('team_name')
			.eq('team_name', team_name)
			.maybeSingle();
		if (taken) {
			$('#signup').prop('disabled', false).text('Sign Up');
			return alert('Team name already taken. Pick another.');
		};

		// 2) Register user
		const { error } = await supabaseClient.auth.signUp({
			email,
			password,
			options: { data: { name, team_name } }
		});
		if (error) {
			$('#signup').prop('disabled', false).text('Sign Up');
			// Duplicate email case
			if ((error.message || '').includes('users_email_partial_key') ||
				(error.status === 500 && (error.message || '').toLowerCase().includes('database error saving new user'))) {
				alert('That email is already registered. Please log in.');
				window.location.href = 'login.html';
				return;
			} else {
				return alert(error.message);
			}
		}

		// 3) Reserve team name (now that user exists) in profiles table
		const { error: profileErr } = await supabaseClient.from('profiles').insert({
			id: data.user.id,
			name,
			team_name
		});
		if (reserveErr) { 
			$('#signup').prop('disabled', false).text('Sign Up');
			return alert('Team name just got taken. Pick another.');
		};

		// 4) Done, proceed to login
		window.location.href = 'login.html';
	});

	// LOGIN
	$('#login').on('click', async () => {
		$('#login').prop('disabled', true).text('Loading…');
		const email = $('#email').val();
		const password = $('#password').val();
		const { error } = await supabaseClient.auth.signInWithPassword({
			email,
			password
		});
		if (error) {
			alert(error.message);
			$('#login').prop('disabled', false).text('Login');
			return;
		}
		window.location.href = 'results.html';
	});
};
function setupLogin() {
	// SIGNUP
	$('#signup').on('click', async () => {
		$('#signup').prop('disabled', true).text('Submitting…');
		try {
			// 0) Read + normalize inputs
			const name = ($('#name').val() || '').trim();
			const team_name = ($('#team_name').val() || '').trim();
			const email = ($('#email').val() || '').trim().toLowerCase();
			const password = ($('#password').val() || '');
			if (!name || !team_name || !email || !password) {
				alert('Please fill in all fields.');
				return;
			};

			// 1) Create auth user (capture data)
			const { data, error } = await supabaseClient.auth.signUp({
				email,
				password,
				options: { data: { name, team_name } }
			});
			if (error) {
				alert(error.message);
				return;
			};
			const userId = data?.user?.id;
			if (!userId) {
				// Can happen depending on auth settings (e.g., email confirmation flows)
				alert("Signup completed, but there was an issue finishing profile setup. Please check your email or try logging in.");
				return;
			};

			// 2) Insert into profiles (UNIQUE constraint on team_name enforces exclusivity)
			const { error: profileErr } = await supabaseClient
				.from('profiles')
				.insert({ id: userId, name, team_name });
			if (profileErr) {
				// Unique constraint violation => team_name already taken
				// Supabase/Postgres unique violations are SQLSTATE 23505.
				if (profileErr.code === '23505') {
					alert('Team name already taken. Pick another.');
					return;
				};
				alert(profileErr.message);
				return;
			};

			// 3) Done, return to login page
			window.location.href = 'login.html';

		} catch (err) {
			alert(err?.message || 'Something went wrong.');
		} finally {
			$('#signup').prop('disabled', false).text('Sign Up');
		};
	});

  	// LOGIN
	$('#login').on('click', async () => {
		$('#login').prop('disabled', true).text('Loading…');
		try {
			const email = ($('#email').val() || '').trim().toLowerCase();
			const password = ($('#password').val() || '');
			const { error } = await supabaseClient.auth.signInWithPassword({ email, password });
			if (error) {
				alert(error.message);
				return;
			};
			window.location.href = 'results.html';
		} finally {
			$('#login').prop('disabled', false).text('Login');
		};
	});
};

$(document).ready(function () {
	// Check Login
	const page = (location.pathname.split("/").pop() || "").toLowerCase();
	const protectedPages = ["results.html", "responses.html", "form.html"];
	if (protectedPages.includes(page)) {
		checkLogin();
	}
	
	// Refresh Navigation
	async function refreshNav() {
		const { data, error } = await supabaseClient.auth.getUser();
		if (error) { console.error(error) };
		const user = data?.user;
		if (user && user.id) {
			$(".nav-actions").html(`
				<a class="btn btn-solid-green" href="form.html">Submit Picks</a>
				<a class="nav-link" id="logoutBtn" href="login.html">Log Out</a>
			`);
			$(".nav-list").html(`
				<li><a class="nav-link" href="rules.html">Rules</a></li>
				<li><a class="nav-link" href="results.html">Results</a></li>
				<li><a class="nav-link" href="responses.html">Responses</a></li>
			`);
		} else {
			$(".nav-list").html(`
				<li><a class="nav-link" href="rules.html">Rules</a></li>
			`);
			$(".nav-actions").html(`
				<a class="btn btn-solid" href="login.html">Login</a>
				<a class="btn btn-solid" href="signup.html">Sign Up</a>
			`);
		}
	};
	refreshNav();

	// Hamburger / Mobile Menu Functionality
	const toggle = document.querySelector(".nav-toggle");
    const nav = document.getElementById("primary-nav");
    function setOpen(isOpen) {
		nav.dataset.open = String(isOpen);
		toggle.setAttribute("aria-expanded", String(isOpen));
		document.documentElement.classList.toggle("nav-open", isOpen);
    }
    toggle.addEventListener("click", () => {
		const isOpen = nav.dataset.open === "true";
		setOpen(!isOpen);
    });
    document.addEventListener("keydown", (e) => {
    	if (e.key === "Escape") setOpen(false);
    });
    nav.addEventListener("click", (e) => {
    	if (e.target.matches("a")) setOpen(false);
    });
    const mq = window.matchMedia("(min-width: 821px)");
    mq.addEventListener?.("change", (e) => {
		if (e.matches) setOpen(false);
    });
});

async function checkLogin() {
	const { data: { user } } = await supabaseClient.auth.getUser();
	if (!user) {
		window.location.replace("login.html");
	};
};

$(document).on("click", "#logoutBtn", async (e) => {
	e.preventDefault();
	const { error } = await supabaseClient.auth.signOut();
	if (error) return alert(error.message);
	window.location.href = "login.html";
});
