let slidesCount = 6;
let currentSlide = 1;
let slideInterval = 800;
let playing = true;
let pauseButton = document.getElementById("pause");
let nextButton = document.getElementById("next");
let previousButton = document.getElementById("previous");
let playSlideshow = document.getElementById("playSlideshow");

// get token and year from url
const urlParams = new URLSearchParams(window.location.search);
const TOKEN = urlParams.get("token");
const YEAR = "2023" // urlParams.get("year");

const API_ENDPOINT = `https://production.getmarks.app/api/v1/recap?token=${TOKEN}&year=${YEAR}`;
let yearData = {};
fetch(API_ENDPOINT)
  .then((res) => res.json())
  .then((data) => {
    yearData = data?.data;
    // modifyUserData();
    // generateSlides();
    startSliding();
  })
  .catch((err) => {
    console.log(err);
  });

const slidesObject = {
  solved: {
    color: "bg-orange",
    icon: "assets/img/ic_question.svg",
    titleTop: "You solved",
    title: "",
    titleBottom: "questions this year.",
    subTitle: "",
  },
  subject: {
    color: "bg-purple",
    icon: "assets/img/ic_heart.svg",
    titleTop: "Your favorite subject was",
    title: "",
    titleBottom: "with most number of attempted questions.",
  },
  chapter: {
    color: "bg-blue",
    icon: "assets/img/ic_pen.svg",
    titleTop: "You practiced",
    title: "",
    titleBottom: "more than any chapter.",
  },
  conquered: {
    color: "bg-green",
    icon: "assets/img/ic_swords.svg",
    titleTop: "You conquered",
    title: "",
    titleBottom: "challenges this year.",
    subTitle: "",
  },
  attempted: {
    color: "bg-orange",
    icon: "assets/img/ic_clipboard_list_check.svg",
    titleTop: "You attempted",
    title: "",
    titleBottom: "custom tests this year.",
    subTitle: "",
  },
  completed: {
    color: "bg-purple",
    icon: "assets/img/ic_bullseye_arrow.svg",
    titleTop: "You completed",
    title: "",
    titleBottom: "daily goals this year.",
    subTitle: "",
  },
};

function modifyUserData() {
  const {
    totalQuestionsAttempted,
    favoriteSubject,
    favoriteChapter,
    totalChallengesAttempted,
    totalCustomTestsAttempted,
    totalGoalsCompleted,
  } = yearData?.result;
  slidesObject.solved.title = totalQuestionsAttempted?.count;
  slidesObject.solved.subTitle = `You're ahead of ${totalQuestionsAttempted?.percentage}% of students 🥳`;

  slidesObject.subject.title = favoriteSubject;
  slidesObject.chapter.title = favoriteChapter;

  if (totalChallengesAttempted) {
    slidesObject.conquered.title = totalChallengesAttempted?.count;
    slidesObject.conquered.subTitle = `You're ahead of ${totalChallengesAttempted?.percentage}% of students 🎉`;
  } else {
    delete slidesObject.conquered;
    slidesCount--;
  }

  if (totalCustomTestsAttempted) {
    slidesObject.attempted.title = totalCustomTestsAttempted?.count;
    slidesObject.attempted.subTitle = `You're ahead of ${totalCustomTestsAttempted?.percentage}% of students 👏`;
  } else {
    delete slidesObject.attempted;
    slidesCount--;
  }

  if (totalGoalsCompleted) {
    slidesObject.completed.title = totalGoalsCompleted?.count;
    slidesObject.completed.subTitle = `You're ahead of ${totalGoalsCompleted?.percentage}% of students 😎`;
  } else {
    delete slidesObject.completed;
    slidesCount--;
  }
}

function getFooterElement() {
  return `
    <footer class="screen-footer">
      <div class="footer-container">
      <a href="https://play.google.com/store/apps/details?id=com.scoremarks.marks&hl=en&gl=US">
        <img src="assets/img/ic_google_play.svg" alt="Logo" class="brand">
      </a>

        <a href="https://web.getmarks.app" class="">
          <img src="assets/img/ic_globe.svg" alt="Logo" class="brand" />
          web.getmarks.app
        </a>
      </div>
    </footer>
  `;
}

function getShareElement() {
  return ``;
  return `
    <div class="share">
      <div class="share-container">
        <img src="assets/img/ic_share.svg" alt="Share Icon" class="share-icon">
        <p class="share-content" style="padding-right: 8px;">Save This</p>
      </div>
    </div>
  `;
}

function getLayout (element) {
  const header = `
    <header class="page-header">
      <a class="text-white fs-18 fw-700" href="#">
        <img src="assets/img/brand-mark.svg" alt="Logo" class="brand">
      </a>
      <p class="header-text">
        <img src="assets/img/recap.svg" alt="Logo" class="brand">
        MARKS Recap 2023
      </p>
      <a href="#!" class="close-button">
        <img src="assets/img/ic_times.svg" alt="Close Icon">
      </a>
    </header>
  `

  const footer = ``;

  const layout = `
      ${header}
      ${element}
      ${footer}
  `;

  return layout;
}

function addStartSlide() {
  const slidesContainer = document.getElementById("slide-items");
  const startSlide = document.createElement("div");
  startSlide.classList.add("wrapper");
  startSlide.classList.add("bg-dark");
  startSlide.innerHTML = getLayout(`
    <main class="page-main" style="padding-top: 120px;">
      <p class="start-slide-text" style="text-align: center;">
        Let’s see what we achieved together in year 2023
      </p>
      <img src="assets/img/marks-bg.svg" alt="marks bg" class="start-marks-bg" />
    </main>
  `);
  slidesContainer.appendChild(startSlide);
}

function noDataSlide() {
  const slidesContainer = document.getElementById("slide-items");
  const startSlide = document.createElement("div");
  startSlide.classList.add("wrapper");
  startSlide.classList.add("bg-dark");
  startSlide.innerHTML = getLayout(`
    <main class="page-main" style="padding-top: 120px;">
      <p class="pb-8 start-slide-text" style="text-align: center;">
        Oopsy! We do not have any Recap Data for you for 2023.
      </p>
      <img src="assets/img/marks-bg.svg" alt="marks bg" class="start-marks-bg" />
    </main>
  `);
  slidesContainer.appendChild(startSlide);
}

function addSlidesV2 () {
  addStartSlide();
  downloadSlide();
  questionsSolvedSlide();
  userQuestionSolvedSlide();
  challengesSolvedSlide();
  userChallengeSolvedSlide();
  customTestSolvedSlide();
  userCustomTestSolvedSlide();
  goalsCompletedSlide();
  userGoalsSolvedSlide();
  userOverviewSlide();
  happyEndSlide();
}

function getNonZeroData(template, value) {
  if (value > 0) return template;
  return "";
}

// 01
function downloadSlide() {
  const slidesContainer = document.getElementById("slide-items");
  const downloadSlide = document.createElement("div");
  downloadSlide.classList.add("wrapper");
  downloadSlide.classList.add("bg-dark");

  downloadSlide.innerHTML = getLayout(`
    <main class="center-slide-main">
      <p class="subtitle-text">This year MARKS crossed</p>
      <div>
        <h1 class="download-count-text text-stroke" style="text-shadow: 5px 5px #69D3F5;">500K+</h1>
        <h1 class="downloads-text text-stroke" style="text-shadow: 5px 5px #69D3F5;">DOWNLOADS</h1>
      </div>
    </main>
    ${getShareElement()}
    ${getFooterElement()}
  `);

  slidesContainer.appendChild(downloadSlide);
}

// 02
function questionsSolvedSlide() {
  const slidesContainer = document.getElementById("slide-items");
  const downloadSlide = document.createElement("div");
  downloadSlide.classList.add("wrapper");
  downloadSlide.classList.add("bg-dark");

  downloadSlide.innerHTML = getLayout(`
    <main class="center-slide-main">
      <div>
        <h1 class="download-count-text text-stroke" style="font-size: 65px; text-shadow: 5px 5px #FBFF41;">16.1MILLION+</h1>
        <h1 class="download-count-text text-stroke" style="font-size: 75px; text-shadow: 5px 5px #FBFF41;">QUESTIONS</h1>
        <h1 class="download-count-text text-stroke" style="font-size: 108px; text-shadow: 5px 5px #FBFF41;">SOLVED</h1>
      </div>
    </main>
    ${getShareElement()}
    ${getFooterElement()}
  `);

  slidesContainer.appendChild(downloadSlide);
}

// 03
function userQuestionSolvedSlide() {
  const slidesContainer = document.getElementById("slide-items");
  const downloadSlide = document.createElement("div");
  downloadSlide.classList.add("wrapper");
  downloadSlide.classList.add("bg-dark");

  downloadSlide.innerHTML = getLayout(`
    <main class="screen-footer" style="bottom: 50px; left: 5%; height: 70vh; width: 90%; z-index: 1;">
    <div class="center-content">
        <div class="stats-container">
      <div class="stat-card">
        <div class="stat-card-header"></div>
        <div>
          <h3 style="font-size: 46px; text-align: center; color: #000; font-family: 'Gilroy'; line-height: 100%; font-weight: 800;">This year, you solved</h3>
          <h1 class="stat-number" style="text-shadow: 5px 5px #ececee">${yearData?.result?.totalQuestionsAttempted?.count}</h1>
          <h3 style="font-size: 44px; text-align: center; color: #000;  font-family: 'Gilroy'; line-height: 100%; font-weight: 800;">questions.</h3>
          ${yearData?.result?.totalQuestionsAttempted?.count > 0 ? `<div class="small-divider" ></div><h5 style="font-size: 22px; text-align: center; color: #000; font-family: 'Gilroy';">that’s put you in top ${yearData?.result?.totalQuestionsAttempted?.percentage}% of our students</h5>` : "" }
        </div>
        </div>
        </div>
      </div>
    </main>
    ${getShareElement()}
    ${getFooterElement()}
  `);

  slidesContainer.appendChild(downloadSlide);
}

// 04
function challengesSolvedSlide() {
  const slidesContainer = document.getElementById("slide-items");
  const downloadSlide = document.createElement("div");
  downloadSlide.classList.add("wrapper");
  downloadSlide.classList.add("bg-dark");

  downloadSlide.innerHTML = getLayout(`
    <main class="center-slide-main">
      <div>
        <h1 class="download-count-text text-stroke" style="font-size: 92px; text-shadow: 5px 5px #C869F5;">8.46&nbsp;L+</h1>
        <h1 class="download-count-text text-stroke" style="font-size: 65px; text-shadow: 5px 5px #C869F5;">CHALLENGES</h1>
        <h1 class="download-count-text text-stroke" style="font-size: 70px; text-shadow: 5px 5px #C869F5;">COMPLETED</h1>
      </div>
    </main>
    ${getShareElement()}
    ${getFooterElement()}
  `);

  slidesContainer.appendChild(downloadSlide);
}

// 05
function userChallengeSolvedSlide() {
  const slidesContainer = document.getElementById("slide-items");
  const downloadSlide = document.createElement("div");
  downloadSlide.classList.add("wrapper");
  downloadSlide.classList.add("bg-dark");

  downloadSlide.innerHTML = getLayout(`
    <main class="screen-footer" style="bottom: 50px; left: 5%; height: 70vh; width: 90%;">
    <div class="center-content">
        <div class="stats-container">
      <div class="stat-card" style="background-color: #C869F5;">
        <div class="stat-card-header" style="background-color: rgba(200, 105, 245, .2);"></div>
        <div>
          <h3 style="font-size: 44px; text-align: center; color: #000; font-family: 'Gilroy'; line-height: 100%; font-weight: 800; ">In 2023, you took</h3>
          <h1 class="stat-number" style="font-size: 125px; color: #000; font-family: 'Gilroy'; line-height: 100%; font-weight: 800; text-shadow: 5px 5px #ececee;">${yearData?.result?.totalChallengesAttempted?.count}</h1>
          <h3 style="font-size: 44px; text-align: center; color: #000; font-family: 'Gilroy'; line-height: 100%; font-weight: 800;">challenges.</h3>
          
          ${yearData?.result?.totalChallengesAttempted?.count > 0 ? `<div class="small-divider" ></div><h5 style="font-size: 25px; text-align: center; color: #000; font-family: 'Gilroy'; line-height: 100%; font-weight: 800;">you’re among the top ${yearData?.result?.totalChallengesAttempted?.percentage}% of our students</h5>`: ``}
        </div>
      </div>
        </div>
      </div>
    </main>
    ${getShareElement()}
    ${getFooterElement()}
  `);

  slidesContainer.appendChild(downloadSlide);
}

// 06
function customTestSolvedSlide() {
  const slidesContainer = document.getElementById("slide-items");
  const downloadSlide = document.createElement("div");
  downloadSlide.classList.add("wrapper");
  downloadSlide.classList.add("bg-dark");

  downloadSlide.innerHTML = getLayout(`
    <main class="center-slide-main">
      <div>
        <h1 class="download-count-text text-stroke" style="font-size: 125px; text-shadow: 5px 5px #69F599;">10.4L</h1>
        <h1 class="download-count-text text-stroke" style="font-size: 50px; text-shadow: 5px 5px #69F599;">Custom&nbsp;tests</h1>
        <h1 class="download-count-text text-stroke" style="font-size: 70px; text-shadow: 5px 5px #69F599;">Attempted</h1>
      </div>
    </main>
    ${getShareElement()}
    ${getFooterElement()}
  `);

  slidesContainer.appendChild(downloadSlide);
}

// 07
function userCustomTestSolvedSlide() {
  const slidesContainer = document.getElementById("slide-items");
  const downloadSlide = document.createElement("div");
  downloadSlide.classList.add("wrapper");
  downloadSlide.classList.add("bg-dark");

  downloadSlide.innerHTML = getLayout(`
    <main class="screen-footer" style="bottom: 50px; left: 5%; height: 70vh; width: 90%;">
    <div class="center-content">
        <div class="stats-container">
      <div class="stat-card" style="background-color: #69F599;">
        <div class="stat-card-header" style="background-color: rgba(105, 245, 153, .2);"></div>
        <div>
          <h1 class="download-count-text" style="font-size: 125px; color: #000; font-family: 'Gilroy'; line-height: 100%; font-weight: 800; text-shadow: 5px 5px #ececee;">${yearData?.result?.totalCustomTestsAttempted?.count}</h1>
          <h3 style="font-size: 34px; text-align: center; color: #000; margin-top: 0; font-family: 'Gilroy'; line-height: 100%; font-weight: 800;">custom tests were attempted by you.</h3>
          
          ${yearData?.result?.totalCustomTestsAttempted?.count > 0 ? `<div class="small-divider" style="margin-top: 50px;"></div><h5 style="font-size: 25px; text-align: center; color: #000; font-family: 'Gilroy'; line-height: 100%; font-weight: 800;">kudos! you’re in top ${yearData?.result?.totalCustomTestsAttempted?.percentage}% club.</h5>`: ``}
        </div>
      </div>
        </div>
      </div>
    </main>
    ${getShareElement()}
    ${getFooterElement()}
  `);

  slidesContainer.appendChild(downloadSlide);
}

// 08
function goalsCompletedSlide() {
  const slidesContainer = document.getElementById("slide-items");
  const downloadSlide = document.createElement("div");
  downloadSlide.classList.add("wrapper");
  downloadSlide.classList.add("bg-dark");

  downloadSlide.innerHTML = getLayout(`
    <main class="center-slide-main">
      <div>
        <h1 class="download-count-text text-stroke" style="font-size: 90px; text-shadow: 5px 5px #69D3F5;">7.54&nbsp;M+</h1>
        <h1 class="download-count-text text-stroke" style="font-size: 60px; text-shadow: 5px 5px #69D3F5;">DAILY&nbsp;GOALS</h1>
        <h1 class="download-count-text text-stroke" style="font-size: 70px; text-shadow: 5px 5px #69D3F5;">Completed</h1>
      </div>
    </main>
    ${getShareElement()}
    ${getFooterElement()}
  `);

  slidesContainer.appendChild(downloadSlide);
}

// 09
function userGoalsSolvedSlide() {
  const slidesContainer = document.getElementById("slide-items");
  const downloadSlide = document.createElement("div");
  downloadSlide.classList.add("wrapper");
  downloadSlide.classList.add("bg-dark");

  downloadSlide.innerHTML = getLayout(`
    <main class="screen-footer" style="bottom: 50px; left: 5%; height: 70vh; width: 90%;">
    <div class="center-content">
        <div class="stats-container">
      <div class="stat-card" style="background-color: #69D3F5;">
        <div class="stat-card-header" style="background-color: rgba(105, 211, 245, .2);"></div>
        <div>
          <h1 class="download-count-text" style="font-size: 125px; color: #000; font-family: 'Gilroy'; line-height: 100%; font-weight: 800; text-shadow: 5px 5px #ececee;">${yearData?.result?.totalGoalsCompleted?.count}</h1>
          <h3 style="font-size: 34px; text-align: center; color: #000; margin-top: 0; max-width: 70%; margin-inline: auto; font-family: 'Gilroy'; line-height: 100%; font-weight: 800;">daily goals completed by you.</h3>
          ${yearData?.result?.totalGoalsCompleted?.count > 0 ? `<div class="small-divider" style="margin-top: 50px;"></div><h5 style="font-size: 25px; text-align: center; color: #000;">kudos! you’re in top ${yearData?.result?.totalGoalsCompleted?.percentage}% club.</h5>`: ``}
        </div>
      </div>
        </div>
      </div>
    </main>
    ${getShareElement()}
    ${getFooterElement()}
  `);

  slidesContainer.appendChild(downloadSlide);
}

// 010
function userOverviewSlide() {
  const slidesContainer = document.getElementById("slide-items");
  const downloadSlide = document.createElement("div");
  downloadSlide.classList.add("wrapper");
  downloadSlide.classList.add("bg-dark");

  downloadSlide.innerHTML = getLayout(`
    <main class="screen-footer">
      <h1 class="text-center" style=" margin-top: -75px; margin-bottom: 40px;">${yearData?.user?.name}’s 2023</h1>
      <div class="center-content">
        <div class="stats-container">
          <div class="stat-card" style="background-color: rgba(251, 255, 65, 1);">
            <div class="icon-container">
              <img src="assets/img/ic_stat_question.svg" style="height:40px; width:40px;" />
              <div>
                <h5>${yearData?.result?.totalQuestionsAttempted?.count}</h5>
                <p>question solved</p>
              </div>
            </div>
          </div>

          <div class="stat-card" style="background-color: rgba(200, 105, 245, 1); margin-top: -100px;">
            <div class="icon-container">
              <img src="assets/img/ic_stat_challenge.svg" style="height:40px; width:40px;" />
              <div>
                <h5>${yearData?.result?.totalChallengesAttempted?.count}</h5>
                <p>challenges conquered</p>
              </div>
            </div>
          </div>

          <div class="stat-card" style="background-color: rgba(105, 245, 153, 1); margin-top: -100px;">
            <div class="icon-container">
              <img src="assets/img/ic_stat_tests.svg" style="height:40px; width:40px;" />
              <div>
                <h5>${yearData?.result?.totalCustomTestsAttempted?.count}</h5>
                <p>custom tests attempted</p>
              </div>
            </div>
          </div>

          <div class="stat-card" style="background-color: rgba(105, 211, 245, 1); margin-top: -100px;">
            <div class="icon-container">
              <img src="assets/img/ic_stat_goal.svg" style="height:40px; width:40px;" />
              <div>
                <h5>${yearData?.result?.totalGoalsCompleted?.count}</h5>
                <p>daily goals completed</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
    ${getShareElement()}
    ${getFooterElement()}
  `);

  slidesContainer.appendChild(downloadSlide);
}

// 011
function happyEndSlide() {
  const slidesContainer = document.getElementById("slide-items");
  const downloadSlide = document.createElement("div");
  downloadSlide.classList.add("wrapper");
  downloadSlide.classList.add("bg-dark");

  downloadSlide.innerHTML = getLayout(`
    <main class="center-slide-main">
      <p style="text-align: center; max-width: 90%; font-size: 28px; font-weight: 600; margin-bottom: 40px; font-family: 'Gilroy'">
        May your <span style="color: #69D3F5;">M</span><span style="color: #69F599;">A</span><span style="color: #C869F5;">R</span><span style="color: #FBFF40;">K</span><span style="color: #69D3F5;">S</span>
        increase more in 2024 with MARKS!
      </p>
      <div>
        <div class="diff-text">
          <h1 class="download-count-text text-stroke" style="font-size: 93px;">HAPPY</h1>
          <h1 class="download-count-text diff text-stroke" style="color: rgba(15, 23, 41, 1); font-size: 93px; -webkit-text-stroke-color: #fff;">HAPPY</h1>
        </div>
        <h1 class="download-count-text text-center text-stroke" style="font-size: 123px; font-family: 'Barlow Condensed' ;"><span style="text-shadow: 5px 5px #69D3F5;">2</span><span style="text-shadow: 5px 5px #69F599;">0</span><span style="text-shadow: 5px 5px #C869F5;">2</span><span style="text-shadow: 5px 5px #FBFF40;">4</span></h1>
      </div>
    </main>
    ${getShareElement()}
    ${getFooterElement()}
  `);

  slidesContainer.appendChild(downloadSlide);
}

function addEndSlide() {
  const slidesContainer = document.getElementById("slide-items");
  const endSlide = document.createElement("div");
  endSlide.classList.add("wrapper");
  endSlide.classList.add("bg-dark");
 
  endSlide.innerHTML = `
        <header class="page-header">
        <a class="text-white fs-18 fw-700" href="#">
            <img src="assets/img/brand-mark.svg" alt="Logo" class="brand">
            
        </a>
        <p>#2022Recap</p>
        <a href="#!">
            <img src="assets/img/ic_times.svg" alt="Close Icon" class="close-button">
        </a>
        </header>
        <main class="page-main">
        <p class="text-white fw-700 fs-18 mb-24">
            ${yearData?.user?.name}'s ${yearData?.year}
        </p>

        <div class="card">
            <img src="${slidesObject.solved.icon}" alt="Question Icon" height="32px">
            <div class="data">
            <h2 class="fw-900 fs-24">
                ${slidesObject?.solved.title}
            </h2>
            <p class="fw-500 fs-16">
                question solved
            </p>
            </div>
        </div>
        <div class="card">
            <img src="${slidesObject.conquered.icon}" alt="Question Icon" height="32px">
            <div class="data">
            <h2 class="fw-900 fs-24">${slidesObject?.conquered.title}</h2>
            <p class="fw-500 fs-16">challenges conquered</p>
            </div>
        </div>
        <div class="card">
            <img src="${slidesObject.attempted.icon}" alt="Question Icon" height="32px">
            <div class="data">
              <h2 class="fw-900 fs-24">${slidesObject?.attempted.title}</h2>
              <p class="fw-500 fs-16">custom tests attempted</p>
            </div>
        </div>
        <div class="card">
            <img src="${slidesObject.completed.icon}" alt="Question Icon" height="32px">
            <div class="data">
              <h2 class="fw-900 fs-24">${slidesObject?.completed.title}</h2>
              <p class="fw-500 fs-16">daily goals completed</p>
            </div>
        </div>

        <p class="text-white fw-500 fs-16" style="margin-top: 48px;">
            Hope you had a great 2022. Wishing you all the very best for 2023. Have a nice one!
        </p>
        </main>
        <footer class="page-footer">
        <p class="footer-link" style="text-align: center;">Take a screenshot and share with others!
            https://getmarks.app</p>
        <button onClick="location.reload()" class="button restart-button">
          Restart
        </button>
        </footer>
    `;
  slidesContainer.appendChild(endSlide);
}

function startSliding() {
  if (!yearData?.result || !TOKEN) {
    noDataSlide();
  } else {
    addSlidesV2();
  }
  new SlideStories("slide");
}
