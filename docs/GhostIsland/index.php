<!--
    In Progress - EKE 02/03/2018

    Sites used in creation: 
    https://www.w3schools.com/howto/howto_js_form_steps.asp
    https://bl.ocks.org/mbostock/3886208
    http://jsfiddle.net/La8wQ/313/

-->
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="icon" href="https://vignette.wikia.nocookie.net/survivor/images/2/26/Survivor_36_Logo.png/revision/latest?cb=20171221043639">
        <title>Survivor - Ghost Island</title>
	   
        <!-- jQuery -->
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
        
        <!-- D3 -->
        <script src="https://d3js.org/d3.v4.min.js"></script>
        <script src="d3-tip.js"></script>
        
        <!-- Github.js -->
        <!--<script src="https://unpkg.com/github-api/dist/GitHub.min.js"></script>-->
        <script src="https://unpkg.com/github-api/dist/GitHub.bundle.min.js"></script>
        <!--<script src="https://gist.github.com/iktash/31ccc1d8582bd9dcb15ee468c7326f2d.js"></script>-->
        <script src="http://requirejs.org/docs/release/2.2.0/minified/require.js"></script>

        <!-- Stylesheet and Javascript -->
        <link rel="stylesheet" href="GhostIsland.css">
        <script src="GhostIsland.js" type="text/javascript"></script>
        
    </head>
    <body>
        <div id="survivor_form">
            <div id="title">
                <h1>Fantasy Survivor - Ghost Island</h1>
                <img src="https://vignette.wikia.nocookie.net/survivor/images/2/26/Survivor_36_Logo.png/revision/latest?cb=20171221043639"/>
            </div>
            <div class="tab">
                <p>What is your name?</p>
                <form name="name">
                    <select>
                        <option value="">
                            Select One
                        </option>
                        <option value="Anastassia">
                            Anastassia
                        </option>
                        <option value="Colin">
                            Colin
                        </option>
                        <option value="David">
                            David
                        </option>
                        <option value="Emily">
                            Emily
                        </option>
                        <option value="Ethan">
                            Ethan
                        </option>
                        <option value="Ezra">
                            Ezra
                        </option>
                        <option value="Josh">
                            Josh
                        </option>
                        <option value="Lucas">
                            Lucas
                        </option>
                        <option value="Walter">
                            Walter
                        </option>
                    </select>
                </form>
            </div>
            <div class="tab">
                <h3>OUTWIT</h3>
                <p>Who will win REWARD this week?</p>
                <form name="reward"> 
                    <div class="cc-selector">
                        <input id="Angela_Perkins_reward" type="radio" name="reward" value="Angela Perkins" />
                        <label class="survivor-cc Angela_Perkins" for="Angela_Perkins_reward">
                            Angela Perkins
                        </label>
                        <input id="Bradley_Kleihege_reward" type="radio" name="reward" value="Bradley Kleihege" />
                        <label class="survivor-cc Bradley_Kleihege" for="Bradley_Kleihege_reward">
                            Bradley Kleihege
                        </label>
                        <input id="Brendan_Shapiro_reward" type="radio" name="reward" value="Brendan Shapiro" />
                        <label class="survivor-cc Brendan_Shapiro" for="Brendan_Shapiro_reward">
                            Brendan Shapiro
                        </label>
                        <input id="Chelsea_Townsend_reward" type="radio" name="reward" value="Chelsea Townsend" />
                        <label class="survivor-cc Chelsea_Townsend" for="Chelsea_Townsend_reward">
                            Chelsea Townsend
                        </label>
                        <input id="Chris_Noble_reward" type="radio" name="reward" value="Chris Noble" />
                        <label class="survivor-cc Chris_Noble" for="Chris_Noble_reward">
                            Chris Noble
                        </label>
                        <input id="Desiree_Afuye_reward" type="radio" name="reward" value="Desiree Afuye" />
                        <label class="survivor-cc Desiree_Afuye" for="Desiree_Afuye_reward">
                            Desiree Afuye
                        </label>
                        <input id="Domenick_Abbate_reward" type="radio" name="reward" value="Domenick Abbate" />
                        <label class="survivor-cc Domenick_Abbate" for="Domenick_Abbate_reward">
                            Domenick Abbate
                        </label>
                        <input id="Donathan_Hurley_reward" type="radio" name="reward" value="Donathan Hurley" />
                        <label class="survivor-cc Donathan_Hurley" for="Donathan_Hurley_reward">
                            Donathan Hurley
                        </label>
                        <input id="Jacob_Derwin_reward" type="radio" name="reward" value="Jacob Derwin" />
                        <label class="survivor-cc Jacob_Derwin" for="Jacob_Derwin_reward">
                            Jacob Derwin
                        </label>
                        <input id="James_Lim_reward" type="radio" name="reward" value="James Lim" />
                        <label class="survivor-cc James_Lim" for="James_Lim_reward">
                            James Lim
                        </label>
                        <input id="Jenna_Bowman_reward" type="radio" name="reward" value="Jenna Bowman" />
                        <label class="survivor-cc Jenna_Bowman" for="Jenna_Bowman_reward">
                            Jenna Bowman
                        </label>
                        <input id="Kellyn_Bechtold_reward" type="radio" name="reward" value="Kellyn Bechtold" />
                        <label class="survivor-cc Kellyn_Bechtold" for="Kellyn_Bechtold_reward">
                            Kellyn Bechtold
                        </label>
                        <input id="Laurel_Johnson_reward" type="radio" name="reward" value="Laurel Johnson" />
                        <label class="survivor-cc Laurel_Johnson" for="Laurel_Johnson_reward">
                            Laurel Johnson
                        </label>
                        <input id="Libby_Vincek_reward" type="radio" name="reward" value="Libby Vincek" />
                        <label class="survivor-cc Libby_Vincek" for="Libby_Vincek_reward">
                            Libby Vincek
                        </label>
                        <input id="Michael_Yerger_reward" type="radio" name="reward" value="Michael Yerger" />
                        <label class="survivor-cc Michael_Yerger" for="Michael_Yerger_reward">
                            Michael Yerger
                        </label>
                        <input id="Morgan_Ricke_reward" type="radio" name="reward" value="Morgan Ricke" />
                        <label class="survivor-cc Morgan_Ricke" for="Morgan_Ricke_reward">
                            Morgan Ricke
                        </label>
                        <input id="Sebastian_Noel_reward" type="radio" name="reward" value="Sebastian Noel" />
                        <label class="survivor-cc Sebastian_Noel" for="Sebastian_Noel_reward">
                            Sebastian Noel
                        </label>
                        <input id="Stephanie_Gonzalez_reward" type="radio" name="reward" value="Stephanie Gonzalez" />
                        <label class="survivor-cc Stephanie_Gonzalez" for="Stephanie_Gonzalez_reward">
                            Stephanie Gonzalez
                        </label>
                        <input id="Stephanie_Johnson_reward" type="radio" name="reward" value="Stephanie Johnson" />
                        <label class="survivor-cc Stephanie_Johnson" for="Stephanie_Johnson_reward">
                            Stephanie Johnson
                        </label>
                        <input id="Wendell_Holland_reward" type="radio" name="reward" value="Wendell Holland" />
                        <label class="survivor-cc Wendell_Holland" for="Wendell_Holland_reward">
                            Wendell Holland
                        </label>
                    </div>
                </form>
            </div>
            <div class="tab">
                <h3>OUTLAST</h3>
                <p>Who will win IMMUNITY this week?</p>
                <form name="immunity"> 
                    <div class="cc-selector">
                        <input id="Angela_Perkins_immunity" type="radio" name="immunity" value="Angela Perkins" />
                        <label class="survivor-cc Angela_Perkins" for="Angela_Perkins_immunity">
                            Angela Perkins
                        </label>
                        <input id="Bradley_Kleihege_immunity" type="radio" name="immunity" value="Bradley Kleihege" />
                        <label class="survivor-cc Bradley_Kleihege" for="Bradley_Kleihege_immunity">
                            Bradley Kleihege
                        </label>
                        <input id="Brendan_Shapiro_immunity" type="radio" name="immunity" value="Brendan Shapiro" />
                        <label class="survivor-cc Brendan_Shapiro" for="Brendan_Shapiro_immunity">
                            Brendan Shapiro
                        </label>
                        <input id="Chelsea_Townsend_immunity" type="radio" name="immunity" value="Chelsea Townsend" />
                        <label class="survivor-cc Chelsea_Townsend" for="Chelsea_Townsend_immunity">
                            Chelsea Townsend
                        </label>
                        <input id="Chris_Noble_immunity" type="radio" name="immunity" value="Chris Noble" />
                        <label class="survivor-cc Chris_Noble" for="Chris_Noble_immunity">
                            Chris Noble
                        </label>
                        <input id="Desiree_Afuye_immunity" type="radio" name="immunity" value="Desiree Afuye" />
                        <label class="survivor-cc Desiree_Afuye" for="Desiree_Afuye_immunity">
                            Desiree Afuye
                        </label>
                        <input id="Domenick_Abbate_immunity" type="radio" name="immunity" value="Domenick Abbate" />
                        <label class="survivor-cc Domenick_Abbate" for="Domenick_Abbate_immunity">
                            Domenick Abbate
                        </label>
                        <input id="Donathan_Hurley_immunity" type="radio" name="immunity" value="Donathan Hurley" />
                        <label class="survivor-cc Donathan_Hurley" for="Donathan_Hurley_immunity">
                            Donathan Hurley
                        </label>
                        <input id="Jacob_Derwin_immunity" type="radio" name="immunity" value="Jacob Derwin" />
                        <label class="survivor-cc Jacob_Derwin" for="Jacob_Derwin_immunity">
                            Jacob Derwin
                        </label>
                        <input id="James_Lim_immunity" type="radio" name="immunity" value="James Lim" />
                        <label class="survivor-cc James_Lim" for="James_Lim_immunity">
                            James Lim
                        </label>
                        <input id="Jenna_Bowman_immunity" type="radio" name="immunity" value="Jenna Bowman" />
                        <label class="survivor-cc Jenna_Bowman" for="Jenna_Bowman_immunity">
                            Jenna Bowman
                        </label>
                        <input id="Kellyn_Bechtold_immunity" type="radio" name="immunity" value="Kellyn Bechtold" />
                        <label class="survivor-cc Kellyn_Bechtold" for="Kellyn_Bechtold_immunity">
                            Kellyn Bechtold
                        </label>
                        <input id="Laurel_Johnson_immunity" type="radio" name="immunity" value="Laurel Johnson" />
                        <label class="survivor-cc Laurel_Johnson" for="Laurel_Johnson_immunity">
                            Laurel Johnson
                        </label>
                        <input id="Libby_Vincek_immunity" type="radio" name="immunity" value="Libby Vincek" />
                        <label class="survivor-cc Libby_Vincek" for="Libby_Vincek_immunity">
                            Libby Vincek
                        </label>
                        <input id="Michael_Yerger_immunity" type="radio" name="immunity" value="Michael Yerger" />
                        <label class="survivor-cc Michael_Yerger" for="Michael_Yerger_immunity">
                            Michael Yerger
                        </label>
                        <input id="Morgan_Ricke_immunity" type="radio" name="immunity" value="Morgan Ricke" />
                        <label class="survivor-cc Morgan_Ricke" for="Morgan_Ricke_immunity">
                            Morgan Ricke
                        </label>
                        <input id="Sebastian_Noel_immunity" type="radio" name="immunity" value="Sebastian Noel" />
                        <label class="survivor-cc Sebastian_Noel" for="Sebastian_Noel_immunity">
                            Sebastian Noel
                        </label>
                        <input id="Stephanie_Gonzalez_immunity" type="radio" name="immunity" value="Stephanie Gonzalez" />
                        <label class="survivor-cc Stephanie_Gonzalez" for="Stephanie_Gonzalez_immunity">
                            Stephanie Gonzalez
                        </label>
                        <input id="Stephanie_Johnson_immunity" type="radio" name="immunity" value="Stephanie Johnson" />
                        <label class="survivor-cc Stephanie_Johnson" for="Stephanie_Johnson_immunity">
                            Stephanie Johnson
                        </label>
                        <input id="Wendell_Holland_immunity" type="radio" name="immunity" value="Wendell Holland" />
                        <label class="survivor-cc Wendell_Holland" for="Wendell_Holland_immunity">
                            Wendell Holland
                        </label>
                    </div>
                </form>
            </div>
            <div class="tab">
                <h3>OUTPLAY</h3>
                <p>Who will be VOTED OFF this week?</p>
                <form name="eliminated"> 
                    <div class="cc-selector">
                        <input id="Angela_Perkins_eliminated" type="radio" name="eliminated" value="Angela Perkins" />
                        <label class="survivor-cc Angela_Perkins" for="Angela_Perkins_eliminated">
                            Angela Perkins
                        </label>
                        <input id="Bradley_Kleihege_eliminated" type="radio" name="eliminated" value="Bradley Kleihege" />
                        <label class="survivor-cc Bradley_Kleihege" for="Bradley_Kleihege_eliminated">
                            Bradley Kleihege
                        </label>
                        <input id="Brendan_Shapiro_eliminated" type="radio" name="eliminated" value="Brendan Shapiro" />
                        <label class="survivor-cc Brendan_Shapiro" for="Brendan_Shapiro_eliminated">
                            Brendan Shapiro
                        </label>
                        <input id="Chelsea_Townsend_eliminated" type="radio" name="eliminated" value="Chelsea Townsend" />
                        <label class="survivor-cc Chelsea_Townsend" for="Chelsea_Townsend_eliminated">
                            Chelsea Townsend
                        </label>
                        <input id="Chris_Noble_eliminated" type="radio" name="eliminated" value="Chris Noble" />
                        <label class="survivor-cc Chris_Noble" for="Chris_Noble_eliminated">
                            Chris Noble
                        </label>
                        <input id="Desiree_Afuye_eliminated" type="radio" name="eliminated" value="Desiree Afuye" />
                        <label class="survivor-cc Desiree_Afuye" for="Desiree_Afuye_eliminated">
                            Desiree Afuye
                        </label>
                        <input id="Domenick_Abbate_eliminated" type="radio" name="eliminated" value="Domenick Abbate" />
                        <label class="survivor-cc Domenick_Abbate" for="Domenick_Abbate_eliminated">
                            Domenick Abbate
                        </label>
                        <input id="Donathan_Hurley_eliminated" type="radio" name="eliminated" value="Donathan Hurley" />
                        <label class="survivor-cc Donathan_Hurley" for="Donathan_Hurley_eliminated">
                            Donathan Hurley
                        </label>
                        <input id="Jacob_Derwin_eliminated" type="radio" name="eliminated" value="Jacob Derwin" />
                        <label class="survivor-cc Jacob_Derwin" for="Jacob_Derwin_eliminated">
                            Jacob Derwin
                        </label>
                        <input id="James_Lim_eliminated" type="radio" name="eliminated" value="James Lim" />
                        <label class="survivor-cc James_Lim" for="James_Lim_eliminated">
                            James Lim
                        </label>
                        <input id="Jenna_Bowman_eliminated" type="radio" name="eliminated" value="Jenna Bowman" />
                        <label class="survivor-cc Jenna_Bowman" for="Jenna_Bowman_eliminated">
                            Jenna Bowman
                        </label>
                        <input id="Kellyn_Bechtold_eliminated" type="radio" name="eliminated" value="Kellyn Bechtold" />
                        <label class="survivor-cc Kellyn_Bechtold" for="Kellyn_Bechtold_eliminated">
                            Kellyn Bechtold
                        </label>
                        <input id="Laurel_Johnson_eliminated" type="radio" name="eliminated" value="Laurel Johnson" />
                        <label class="survivor-cc Laurel_Johnson" for="Laurel_Johnson_eliminated">
                            Laurel Johnson
                        </label>
                        <input id="Libby_Vincek_eliminated" type="radio" name="eliminated" value="Libby Vincek" />
                        <label class="survivor-cc Libby_Vincek" for="Libby_Vincek_eliminated">
                            Libby Vincek
                        </label>
                        <input id="Michael_Yerger_eliminated" type="radio" name="eliminated" value="Michael Yerger" />
                        <label class="survivor-cc Michael_Yerger" for="Michael_Yerger_eliminated">
                            Michael Yerger
                        </label>
                        <input id="Morgan_Ricke_eliminated" type="radio" name="eliminated" value="Morgan Ricke" />
                        <label class="survivor-cc Morgan_Ricke" for="Morgan_Ricke_eliminated">
                            Morgan Ricke
                        </label>
                        <input id="Sebastian_Noel_eliminated" type="radio" name="eliminated" value="Sebastian Noel" />
                        <label class="survivor-cc Sebastian_Noel" for="Sebastian_Noel_eliminated">
                            Sebastian Noel
                        </label>
                        <input id="Stephanie_Gonzalez_eliminated" type="radio" name="eliminated" value="Stephanie Gonzalez" />
                        <label class="survivor-cc Stephanie_Gonzalez" for="Stephanie_Gonzalez_eliminated">
                            Stephanie Gonzalez
                        </label>
                        <input id="Stephanie_Johnson_eliminated" type="radio" name="eliminated" value="Stephanie Johnson" />
                        <label class="survivor-cc Stephanie_Johnson" for="Stephanie_Johnson_eliminated">
                            Stephanie Johnson
                        </label>
                        <input id="Wendell_Holland_eliminated" type="radio" name="eliminated" value="Wendell Holland" />
                        <label class="survivor-cc Wendell_Holland" for="Wendell_Holland_eliminated">
                            Wendell Holland
                        </label>
                    </div>
                </form>
            </div>
            <div class="tab">
                <h3>OUTPLAY</h3>
                <p>Who will be SAFE this week?</p>
                <form name="safe"> 
                    <div class="cc-selector">
                        <input id="Angela_Perkins_safe" type="radio" name="safe" value="Angela Perkins" />
                        <label class="survivor-cc Angela_Perkins" for="Angela_Perkins_safe">
                            Angela Perkins
                        </label>
                        <input id="Bradley_Kleihege_safe" type="radio" name="safe" value="Bradley Kleihege" />
                        <label class="survivor-cc Bradley_Kleihege" for="Bradley_Kleihege_safe">
                            Bradley Kleihege
                        </label>
                        <input id="Brendan_Shapiro_safe" type="radio" name="safe" value="Brendan Shapiro" />
                        <label class="survivor-cc Brendan_Shapiro" for="Brendan_Shapiro_safe">
                            Brendan Shapiro
                        </label>
                        <input id="Chelsea_Townsend_safe" type="radio" name="safe" value="Chelsea Townsend" />
                        <label class="survivor-cc Chelsea_Townsend" for="Chelsea_Townsend_safe">
                            Chelsea Townsend
                        </label>
                        <input id="Chris_Noble_safe" type="radio" name="safe" value="Chris Noble" />
                        <label class="survivor-cc Chris_Noble" for="Chris_Noble_safe">
                            Chris Noble
                        </label>
                        <input id="Desiree_Afuye_safe" type="radio" name="safe" value="Desiree Afuye" />
                        <label class="survivor-cc Desiree_Afuye" for="Desiree_Afuye_safe">
                            Desiree Afuye
                        </label>
                        <input id="Domenick_Abbate_safe" type="radio" name="safe" value="Domenick Abbate" />
                        <label class="survivor-cc Domenick_Abbate" for="Domenick_Abbate_safe">
                            Domenick Abbate
                        </label>
                        <input id="Donathan_Hurley_safe" type="radio" name="safe" value="Donathan Hurley" />
                        <label class="survivor-cc Donathan_Hurley" for="Donathan_Hurley_safe">
                            Donathan Hurley
                        </label>
                        <input id="Jacob_Derwin_safe" type="radio" name="safe" value="Jacob Derwin" />
                        <label class="survivor-cc Jacob_Derwin" for="Jacob_Derwin_safe">
                            Jacob Derwin
                        </label>
                        <input id="James_Lim_safe" type="radio" name="safe" value="James Lim" />
                        <label class="survivor-cc James_Lim" for="James_Lim_safe">
                            James Lim
                        </label>
                        <input id="Jenna_Bowman_safe" type="radio" name="safe" value="Jenna Bowman" />
                        <label class="survivor-cc Jenna_Bowman" for="Jenna_Bowman_safe">
                            Jenna Bowman
                        </label>
                        <input id="Kellyn_Bechtold_safe" type="radio" name="safe" value="Kellyn Bechtold" />
                        <label class="survivor-cc Kellyn_Bechtold" for="Kellyn_Bechtold_safe">
                            Kellyn Bechtold
                        </label>
                        <input id="Laurel_Johnson_safe" type="radio" name="safe" value="Laurel Johnson" />
                        <label class="survivor-cc Laurel_Johnson" for="Laurel_Johnson_safe">
                            Laurel Johnson
                        </label>
                        <input id="Libby_Vincek_safe" type="radio" name="safe" value="Libby Vincek" />
                        <label class="survivor-cc Libby_Vincek" for="Libby_Vincek_safe">
                            Libby Vincek
                        </label>
                        <input id="Michael_Yerger_safe" type="radio" name="safe" value="Michael Yerger" />
                        <label class="survivor-cc Michael_Yerger" for="Michael_Yerger_safe">
                            Michael Yerger
                        </label>
                        <input id="Morgan_Ricke_safe" type="radio" name="safe" value="Morgan Ricke" />
                        <label class="survivor-cc Morgan_Ricke" for="Morgan_Ricke_safe">
                            Morgan Ricke
                        </label>
                        <input id="Sebastian_Noel_safe" type="radio" name="safe" value="Sebastian Noel" />
                        <label class="survivor-cc Sebastian_Noel" for="Sebastian_Noel_safe">
                            Sebastian Noel
                        </label>
                        <input id="Stephanie_Gonzalez_safe" type="radio" name="safe" value="Stephanie Gonzalez" />
                        <label class="survivor-cc Stephanie_Gonzalez" for="Stephanie_Gonzalez_safe">
                            Stephanie Gonzalez
                        </label>
                        <input id="Stephanie_Johnson_safe" type="radio" name="safe" value="Stephanie Johnson" />
                        <label class="survivor-cc Stephanie_Johnson" for="Stephanie_Johnson_safe">
                            Stephanie Johnson
                        </label>
                        <input id="Wendell_Holland_safe" type="radio" name="safe" value="Wendell Holland" />
                        <label class="survivor-cc Wendell_Holland" for="Wendell_Holland_safe">
                            Wendell Holland
                        </label>
                    </div>
                </form>
            </div>
            <div class="tab">
                <h3>BONUS QUESTIONS</h3>
                <p>This weeks episode is title "...". Who said this?</p>
                <form name="titleQuote">
                    <select>
                        <option value="">
                            Select One
                        </option>
                        <option value="Angela Perkins">
                            Angela Perkins
                        </option>
                        <option value="Bradley Kleihege">
                            Bradley Kleihege
                        </option>
                        <option value="Brendan Shapiro">
                            Brendan Shapiro
                        </option>
                        <option value="Chelsea Townsend">
                            Chelsea Townsend
                        </option>
                        <option value="Chris Noble">
                            Chris Noble
                        </option>
                        <option value="Desiree Afuye">
                            Desiree Afuye
                        </option>
                        <option value="Domenick Abbate">
                            Domenick Abbate
                        </option>
                        <option value="Donathan Hurley">
                            Donathan Hurley
                        </option>
                        <option value="Jacob Derwin">
                            Jacob Derwin
                        </option>
                        <option value="James Lim">
                            James Lim
                        </option>
                        <option value="Jenna Bowman">
                            Jenna Bowman
                        </option>
                        <option value="Kellyn Bechtold">
                            Kellyn Bechtold
                        </option>
                        <option value="Laurel Johnson">
                            Laurel Johnson
                        </option>
                        <option value="Libby Vincek">
                            Libby Vincek
                        </option>
                        <option value="Michael Yerger">
                            Michael Yerger
                        </option>
                        <option value="Morgan Ricke">
                            Morgan Ricke
                        </option>
                        <option value="Sebastian Noel">
                            Sebastian Noel
                        </option>
                        <option value="Stephanie Gonzalez">
                            Stephanie Gonzalez
                        </option>
                        <option value="Stephanie Johnson">
                            Stephanie Johnson
                        </option>
                        <option value="Wendell Holland">
                            Wendell Holland
                        </option>
                        <option value="Jeff Probst">
                            Jeff Probst
                        </option>
                    </select>
                </form>
                
                <p>Will there be nudity this week?</p>
                <form name="nudity">
                    <input name="nudity" type="radio" value="Yes">
                        Yes
                    <br>
                    <input name="nudity" type="radio" value="No">
                        No
                    <br>
                </form>
                
                <p>Will an idol be found this week?</p>
                <form name="idolFound">
                    <input name="idolFound" type="radio" value="Yes">
                        Yes
                    <br>
                    <input name="idolFound" type="radio" value="No">
                        No
                    <br>
                </form>
                
                <p>Will an idol be played this week?</p>
                <form name="idolPlayed">
                    <input name="idolPlayed" type="radio" value="Yes">
                        Yes
                    <br>
                    <input name="idolPlayed" type="radio" value="No">
                        No
                    <br>
                </form>
            </div>
            <br>
            <div id="progress_buttons">
                <div style="display:inline-block">
                    <button type="button" id="prevBtn">Previous</button>
                    <button type="button" id="nextBtn">Next</button>
                </div>
            </div>
            <div id="progress_bar">
                <progress value="0" max="6" color="rebeccapurple"></progress>
            </div>
        </div>
        
    </body>
    
    <script>
        $(document).ready(function(){
           init(); 
        });
    </script>
    
</html>