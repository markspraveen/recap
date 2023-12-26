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
const TOKEN = urlParams.get("token") || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzYzZhOTU4NTBhOGEwMmRhMWNkN2YxYiIsImlhdCI6MTcwMzIzNTIxOCwiZXhwIjoxNzA1ODI3MjE4fQ.8JgeF6BXTprNS9IBa7yW1LtN3E13fCuBo9LiYMLy4A8';
const YEAR = "2022" // urlParams.get("year");

const API_ENDPOINT = `https://production.getmarks.app/api/v1/recap?token=${TOKEN}&year=${YEAR}`;
let yearData = {};
fetch(API_ENDPOINT)
  .then((res) => res.json())
  .then((data) => {
    yearData = data?.data;
    modifyUserData();
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

addStartSlide();
addSlidesV2();
// generateSlides();
function generateSlides() {
  Object.keys(slidesObject).forEach((key) => {
    addSlide(slidesObject[key]);
  });
  addEndSlide();
}

function addSlide({
  color = "bg-orange",
  icon = "assets/img/ic_question.svg",
  titleTop = "You solved",
  title = "",
  titleBottom = "questions this year.",
  subTitle = "",
}) {
  const slidesContainer = document.getElementById("slide-items");
  const endSlide = document.createElement("div");
  endSlide.classList.add("wrapper");
  endSlide.classList.add(color);
  endSlide.innerHTML = `
        <header class="page-header">
        <a class="text-white fs-18 fw-700" href="#">
            <img src="assets/img/brand-mark.svg" alt="Logo" class="brand">
            #2022Recap
        </a>
        <a href="#!" class="close-button">
            <img src="assets/img/ic_times.svg" alt="Close Icon">
        </a>
        </header>
        <main class="page-main">
        <img src="${icon}" alt="Question Icon" class="mb-24">
        <p class="text-white fw-500 fs-18 pb-8">${titleTop}</p>
        <h2 class="text-white fw-900 fs-48 pb-8">${title}</h2>
        <p class="text-white fw-500 fs-18 mb-32">${titleBottom}</p>
        <p class="text-white fw-700 fs-24">${subTitle}</p>
        </main>
        <footer class="page-footer">
        <p class="footer-link" style="text-align: center; display: block;">Take a screenshot and share with others!
            https://getmarks.app</p>
        <a href="#!" class="button" onclick="saveImage('slide-2')">
            Save This
        </a>
        </footer>
    `;
  slidesContainer.appendChild(endSlide);
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
  return `
    <div class="share">
      <div class="share-container">
        <img src="assets/img/ic_share.svg" alt="Share Icon" class="share-icon">
        <p class="share-content">Share This</p>
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
      <p>
        <img src="assets/img/recap.svg" alt="Logo" class="brand">
        Marks Recap 2023
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
      <p class=" pb-8 start-slide-text" style="text-align: center;">
        Let’s see what we achieved together in year 2023
      </p>
      <img src="assets/img/marks-bg.svg" alt="marks bg" class="start-marks-bg" />
    </main>
  `);
  slidesContainer.appendChild(startSlide);
}

function addSlidesV2 () {
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
        <div class="diff-text">
          <h1 class="download-count-text text-stroke">500K+</h1>
          <h1 class="download-count-text diff" style="color: rgba(105, 211, 245, 1);">500K+</h1>
        </div>
        <div class="diff-text">
          <h1 class="downloads-text text-stroke">DOWNLOADS</h1>
          <h1 class="downloads-text diff" style="color: rgba(105, 211, 245, 1);">Downloads</h1>
        </div>
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
        <div class="diff-text">
          <h1 class="download-count-text text-stroke" style="font-size: 65px;">4&nbsp;MILLION+</h1>
          <h1 class="download-count-text diff" style="color: #FBFF41; font-size: 65px;">4&nbsp;MILLION+</h1>
        </div>
        <div class="diff-text">
          <h1 class="download-count-text text-stroke" style="font-size: 75px;">QUESTIONS</h1>
          <h1 class="download-count-text diff" style="color: #FBFF41; font-size: 75px;">QUESTIONS</h1>
        </div>
        <div class="diff-text">
          <h1 class="download-count-text text-stroke" style="font-size: 108px;">SOLVED</h1>
          <h1 class="download-count-text diff" style="color: #FBFF41; font-size: 108px;">SOLVED</h1>
        </div>
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
      <div class="stat-card">
        <div class="stat-card-header"></div>
        <div>
          <h3 style="font-size: 46px; text-align: center; color: #000; font-family: 'Gilroy'; line-height: 100%; font-weight: 800;">This year, you solved</h3>
          <div class="diff-text">
            <h1 class="download-count-text" style="font-size: 125px; color: #000; font-family: 'Gilroy'; line-height: 100%; font-weight: 800;">1125</h1>
            <h1 class="download-count-text diff text-stroke" style="color: transparent; font-size: 125px; -webkit-text-stroke-width: 2px; font-family: 'Gilroy'; line-height: 100%; font-weight: 800;">1125</h1>
          </div>
          <h3 style="font-size: 44px; text-align: center; color: #000;  font-family: 'Gilroy'; line-height: 100%; font-weight: 800;">questions.</h3>
          <div class="small-divider" ></div>
          <h5 style="font-size: 22px; text-align: center; color: #000; font-family: 'Gilroy';">that’s put you in top 56% of our students</h5>
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
        <div class="diff-text">
          <h1 class="download-count-text text-stroke" style="font-size: 92px;">6&nbsp;LAKH+</h1>
          <h1 class="download-count-text diff" style="color: #C869F5; font-size: 92px;">6&nbsp;LAKH+</h1>
        </div>
        <div class="diff-text">
          <h1 class="download-count-text text-stroke" style="font-size: 65px;">CHALLENGES</h1>
          <h1 class="download-count-text diff" style="color: #C869F5; font-size: 65px;">CHALLENGES</h1>
        </div>
        <div class="diff-text">
          <h1 class="download-count-text text-stroke" style="font-size: 70px;">COMPLETED</h1>
          <h1 class="download-count-text diff" style="color: #C869F5; font-size: 70px;">COMPLETED</h1>
        </div>
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
    <main class="screen-footer" style="bottom: 50px; left: 5%; height: 70vh; width: 90%; z-index: 1;">
      <div class="stat-card" style="background-color: #C869F5;">
        <div class="stat-card-header" style="background-color: rgba(200, 105, 245, .2);"></div>
        <div>
          <h3 style="font-size: 44px; text-align: center; color: #000; font-family: 'Gilroy'; line-height: 100%; font-weight: 800;">In 2023, you took</h3>
          <div class="diff-text" style="left: 75%; top: 0px;transform: translate(-50%);">
            <h1 class="download-count-text" style="font-size: 125px; color: #000; font-family: 'Gilroy'; line-height: 100%; font-weight: 800;">56</h1>
            <h1 class="download-count-text diff text-stroke" style="color: transparent; font-size: 125px; -webkit-text-stroke-width: 2px; font-family: 'Gilroy'; line-height: 100%; font-weight: 800;">56</h1>
          </div>
          <h3 style="font-size: 44px; text-align: center; color: #000; font-family: 'Gilroy'; line-height: 100%; font-weight: 800;">challenges.</h3>
          <div class="small-divider" ></div>
          <h5 style="font-size: 25px; text-align: center; color: #000; font-family: 'Gilroy'; line-height: 100%; font-weight: 800;">you’re among the top 43% of our students</h5>
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
        <div class="diff-text">
          <h1 class="download-count-text text-stroke" style="font-size: 200px;">45K</h1>
          <h1 class="download-count-text diff" style="color: #69F599; font-size: 200px;">45K</h1>
        </div>
        <div class="diff-text">
          <h1 class="download-count-text text-stroke" style="font-size: 60px;">Custom&nbsp;test</h1>
          <h1 class="download-count-text diff" style="color: #69F599; font-size: 60px;">Custom&nbsp;test</h1>
        </div>
        <div class="diff-text">
          <h1 class="download-count-text text-stroke" style="font-size: 70px;">Attempted</h1>
          <h1 class="download-count-text diff" style="color: #69F599; font-size: 70px;">Attempted</h1>
        </div>
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
    <main class="screen-footer" style="bottom: 50px; left: 5%; height: 70vh; width: 90%; z-index: 1;">
      <div class="stat-card" style="background-color: #69F599;">
        <div class="stat-card-header" style="background-color: rgba(105, 245, 153, .2);"></div>
        <div>
          <div class="diff-text" style="top: 0; left: 8%;">
            <h1 class="download-count-text" style="font-size: 125px; color: #000; font-family: 'Gilroy'; line-height: 100%; font-weight: 800;">356</h1>
            <h1 class="download-count-text diff text-stroke" style="color: transparent; font-size: 125px; -webkit-text-stroke-width: 2px; font-family: 'Gilroy'; line-height: 100%; font-weight: 800;">356</h1>
          </div>
          <h3 style="font-size: 34px; text-align: center; color: #000; margin-top: 0; font-family: 'Gilroy'; line-height: 100%; font-weight: 800;">custom tests were attempted by you.</h3>
          <div class="small-divider" style="margin-top: 50px;"></div>
          <h5 style="font-size: 25px; text-align: center; color: #000; font-family: 'Gilroy'; line-height: 100%; font-weight: 800;">kudos! you’re in top 12% club.</h5>
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
        <div class="diff-text">
          <h1 class="download-count-text text-stroke" style="font-size: 70px;">4&nbsp;MILLION+</h1>
          <h1 class="download-count-text diff" style="color: #69D3F5; font-size: 70px;">4&nbsp;MILLION+</h1>
        </div>
        <div class="diff-text">
          <h1 class="download-count-text text-stroke" style="font-size: 65px;">DAILY&nbsp;GOALS</h1>
          <h1 class="download-count-text diff" style="color: #69D3F5; font-size: 65px;">DAILY&nbsp;GOALS</h1>
        </div>
        <div class="diff-text">
          <h1 class="download-count-text text-stroke" style="font-size: 70px;">Completed</h1>
          <h1 class="download-count-text diff" style="color: #69D3F5; font-size: 70px;">Completed</h1>
        </div>
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
    <main class="screen-footer" style="bottom: 50px; left: 5%; height: 70vh; width: 90%; z-index: 1;">
      <div class="stat-card" style="background-color: #69D3F5;">
        <div class="stat-card-header" style="background-color: rgba(105, 211, 245, .2);"></div>
        <div>
          <div class="diff-text" style="top: 0; left: 8%;">
            <h1 class="download-count-text" style="font-size: 125px; color: #000; font-family: 'Gilroy'; line-height: 100%; font-weight: 800;">102</h1>
            <h1 class="download-count-text diff text-stroke" style="color: transparent; font-size: 125px; -webkit-text-stroke-width: 2px; font-family: 'Gilroy'; line-height: 100%; font-weight: 800;">102</h1>
          </div>
          <h3 style="font-size: 34px; text-align: center; color: #000; margin-top: 0; max-width: 70%; margin-inline: auto; font-family: 'Gilroy'; line-height: 100%; font-weight: 800;">daily goals completed by you.</h3>
          <div class="small-divider" style="margin-top: 50px;"></div>
          <h5 style="font-size: 25px; text-align: center; color: #000;">kudos! you’re in top 12% club.</h5>
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
    <main class="screen-footer" style="bottom: 50px; left: 5%; height: 67vh; width: 90%; z-index: 1;">
      <h1 class="text-center" style="position: fixed; top: 0; margin-top: -75px; left: 50px;">John Doe’s 2023</h1>
      <div class="stat-card" style="background-color: rgba(251, 255, 65, 1);">
        <div class="icon-container">
          <div style="height: 24px; width: 24px;">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M9.08765 20.0266C9.08765 18.577 10.2222 17.4238 11.6001 17.4238C12.9781 17.4238 14.1126 18.577 14.1126 20.0266C14.1126 21.4761 12.9781 22.6293 11.6001 22.6293C10.2222 22.6293 9.08765 21.4761 9.08765 20.0266Z" stroke="#0F1729" stroke-width="0.75"/>
              <path d="M19.3292 7.6C19.3292 12.5844 14.1084 12.6617 14.1084 14.5008V14.75C14.1084 15.3215 13.6625 15.7812 13.1084 15.7812H10.0875C9.53336 15.7812 9.08753 15.3215 9.08753 14.75V14.3289C9.08753 11.6734 11.0417 10.6121 12.5167 9.75703C13.7834 9.02656 14.5584 8.52813 14.5584 7.55703C14.5584 6.27656 12.975 5.42578 11.6917 5.42578C10.0625 5.42578 9.28336 6.20352 8.24169 7.54844C7.90419 7.98672 7.28753 8.06406 6.85419 7.72461L5.05836 6.31953C4.62919 5.98438 4.53336 5.36133 4.84169 4.90586C6.53753 2.40508 8.69169 1 12.0167 1C15.5542 1 19.3292 3.84883 19.3292 7.6Z" fill="#0F1729"/>
            </svg>
          </div>
          <div>
            <h5>2.3L</h5>
            <p>question solved</p>
          </div>
        </div>
      </div>

      <div class="stat-card" style="background-color: rgba(200, 105, 245, 1); top: 20%; z-index: 1; position: fixed;">
        <div class="icon-container">
          <div style="height: 24px; width: 24px;">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <g clip-path="url(#clip0_22870_20987)">
                <path d="M5.99117 11.5912L4.25995 13.3224L3.9064 13.676L3.55285 13.3224L2.58851 12.3581L5.99117 11.5912ZM5.99117 11.5912L8.40906 14.0091L6.67785 15.7403L6.32458 16.0936L6.67756 16.4471L7.64045 17.4116L7.64062 17.4117C7.66405 17.4352 7.6772 17.467 7.6772 17.5001C7.6772 17.5332 7.66405 17.565 7.64062 17.5885L6.95596 18.2735C6.93698 18.2925 6.9124 18.3049 6.88586 18.3088C6.85931 18.3127 6.8322 18.308 6.80854 18.2953L4.50403 17.0595L4.17676 16.884L3.91417 17.1466L1.59738 19.4634L1.59734 19.4634C1.58573 19.475 1.57195 19.4842 1.55678 19.4905C1.54162 19.4968 1.52536 19.5 1.50894 19.5C1.49252 19.5 1.47626 19.4968 1.4611 19.4905C1.44593 19.4842 1.43215 19.475 1.42054 19.4634L1.4205 19.4634L0.536906 18.5798L0.536867 18.5797C0.525254 18.5681 0.516045 18.5543 0.509762 18.5392C0.503478 18.524 0.500244 18.5077 0.500244 18.4913C0.500244 18.4749 0.503478 18.4586 0.509762 18.4435C0.516047 18.4283 0.525257 18.4145 0.536861 18.4029L0.537026 18.4028L2.85382 16.0844L3.11623 15.8218L2.94079 15.4947L1.70494 13.1902C1.70492 13.1901 1.70489 13.1901 1.70487 13.19C1.70486 13.19 1.70486 13.19 1.70485 13.19C1.69225 13.1664 1.68756 13.1393 1.69147 13.1128C1.69539 13.0863 1.70772 13.0618 1.72665 13.0428L1.72674 13.0427L2.41179 12.3581C2.4118 12.3581 2.4118 12.3581 2.41181 12.3581C2.43524 12.3346 2.46702 12.3215 2.50015 12.3215C2.53323 12.3215 2.56497 12.3346 2.58839 12.358L5.99117 11.5912ZM11.5932 5.98995L16.5955 0.987614L19.4792 0.500304C19.4817 0.500195 19.4842 0.500545 19.4866 0.501344C19.4896 0.502361 19.4924 0.504075 19.4947 0.506343C19.497 0.50862 19.4987 0.511396 19.4997 0.514449C19.5005 0.516853 19.5008 0.519373 19.5007 0.521885L19.0134 3.40551L14.0111 8.40784L11.5932 5.98995Z" stroke="#0F1729"/>
                <path d="M15.2098 12.0853L3.64734 0.52276L0.594602 0.0055723C0.514571 -0.00593415 0.432958 0.00136943 0.356241 0.0269036C0.279524 0.0524377 0.209813 0.0954996 0.15264 0.152673C0.0954672 0.209846 0.0524053 0.279556 0.0268711 0.356273C0.001337 0.432991 -0.00596658 0.514603 0.00553988 0.594635L0.521165 3.64581L12.0837 15.2103L15.2098 12.0853ZM19.8169 18.0493L17.5001 15.7325L18.736 13.4278C18.7994 13.3096 18.823 13.174 18.8034 13.0413C18.7837 12.9085 18.7219 12.7856 18.627 12.6907L17.9419 12.006C17.8838 11.9479 17.8149 11.9019 17.7391 11.8704C17.6632 11.839 17.582 11.8229 17.4999 11.8229C17.4178 11.8229 17.3365 11.839 17.2607 11.8704C17.1848 11.9019 17.1159 11.9479 17.0579 12.006L12.0044 17.0583C11.8872 17.1755 11.8215 17.3344 11.8215 17.5001C11.8215 17.6658 11.8872 17.8247 12.0044 17.9419L12.6891 18.6271C12.784 18.7219 12.9069 18.7838 13.0397 18.8034C13.1724 18.823 13.308 18.7994 13.4262 18.736L15.7309 17.5001L18.0477 19.8169C18.1058 19.875 18.1747 19.921 18.2505 19.9524C18.3263 19.9838 18.4076 20 18.4897 20C18.5718 20 18.6531 19.9838 18.7289 19.9524C18.8048 19.921 18.8737 19.875 18.9317 19.8169L19.8153 18.9333C19.8735 18.8754 19.9196 18.8065 19.9512 18.7308C19.9827 18.655 19.9991 18.5737 19.9992 18.4916C19.9993 18.4096 19.9833 18.3282 19.952 18.2523C19.9207 18.1765 19.8748 18.1075 19.8169 18.0493Z" fill="#0F1729"/>
              </g>
              <defs>
                <clipPath id="clip0_22870_20987">
                  <rect width="20" height="20" fill="white"/>
                </clipPath>
              </defs>
            </svg>
          </div>
          <div>
            <h5>143</h5>
            <p>challenges conquered</p>
          </div>
        </div>
      </div>

      <div class="stat-card" style="background-color: rgba(105, 245, 153, 1); top: 40%; z-index: 1; position: fixed;">
        <div class="icon-container">
          <div style="height: 24px; width: 24px;">
           <svg xmlns="http://www.w3.org/2000/svg" width="18" height="24" viewBox="0 0 18 24" fill="none">
            <g clip-path="url(#clip0_22870_21001)">
              <path d="M15 6.375H15.375V6C15.375 5.10489 15.0194 4.24645 14.3865 3.61351C14.302 3.529 14.2134 3.44944 14.1213 3.375H15.75C16.2473 3.375 16.7242 3.57254 17.0758 3.92417C17.4275 4.27581 17.625 4.75272 17.625 5.25V21.75C17.625 22.2473 17.4275 22.7242 17.0758 23.0758C16.7242 23.4275 16.2473 23.625 15.75 23.625H2.25C1.75272 23.625 1.27581 23.4275 0.924175 23.0758C0.572544 22.7242 0.375 22.2473 0.375 21.75V5.25C0.375 4.75272 0.572544 4.27581 0.924175 3.92417C1.27581 3.57254 1.75272 3.375 2.25 3.375H3.87866C3.78656 3.44944 3.69803 3.529 3.61351 3.61351C2.98058 4.24645 2.625 5.10489 2.625 6V6.375H3H15ZM7.95951 13.2336L7.3121 13.875H8.22344H14.55C14.9392 13.875 15.375 13.599 15.375 13.125V12.375C15.375 11.901 14.9392 11.625 14.55 11.625H9.7375H9.58319L9.47357 11.7336L7.95951 13.2336ZM15.1553 18.1553C15.296 18.0147 15.375 17.8239 15.375 17.625V16.875C15.375 16.6761 15.296 16.4853 15.1553 16.3447C15.0147 16.204 14.8239 16.125 14.625 16.125H7.875C7.67609 16.125 7.48532 16.204 7.34467 16.3447C7.20402 16.4853 7.125 16.6761 7.125 16.875V17.625C7.125 17.8239 7.20402 18.0147 7.34467 18.1553C7.48532 18.296 7.67609 18.375 7.875 18.375H14.625C14.8239 18.375 15.0147 18.296 15.1553 18.1553Z" stroke="#0F1729" stroke-width="0.75"/>
              <path d="M4.5 16.125C4.2775 16.125 4.05999 16.191 3.87498 16.3146C3.68998 16.4382 3.54578 16.6139 3.46064 16.8195C3.37549 17.025 3.35321 17.2512 3.39662 17.4695C3.44002 17.6877 3.54717 17.8882 3.7045 18.0455C3.86184 18.2028 4.06229 18.31 4.28052 18.3534C4.49875 18.3968 4.72495 18.3745 4.93052 18.2894C5.13609 18.2042 5.31179 18.06 5.4354 17.875C5.55902 17.69 5.625 17.4725 5.625 17.25C5.62537 17.1022 5.59653 16.9557 5.54012 16.819C5.48372 16.6824 5.40086 16.5582 5.29632 16.4537C5.19178 16.3491 5.06762 16.2663 4.93096 16.2099C4.7943 16.1535 4.64784 16.1246 4.5 16.125ZM7.57969 9.4875C7.55631 9.46409 7.52854 9.44551 7.49798 9.43284C7.46741 9.42016 7.43465 9.41364 7.40156 9.41364C7.36847 9.41364 7.33571 9.42016 7.30515 9.43284C7.27458 9.44551 7.24682 9.46409 7.22344 9.4875L4.99219 11.7L4.02656 10.725C4.00318 10.7016 3.97542 10.683 3.94485 10.6703C3.91429 10.6577 3.88153 10.6511 3.84844 10.6511C3.81535 10.6511 3.78259 10.6577 3.75202 10.6703C3.72146 10.683 3.69369 10.7016 3.67031 10.725L3.075 11.3156C3.05159 11.339 3.03301 11.3668 3.02034 11.3973C3.00766 11.4279 3.00114 11.4607 3.00114 11.4937C3.00114 11.5268 3.00766 11.5596 3.02034 11.5902C3.03301 11.6207 3.05159 11.6485 3.075 11.6719L4.80469 13.4203C4.82807 13.4437 4.85583 13.4623 4.8864 13.475C4.91696 13.4876 4.94972 13.4942 4.98281 13.4942C5.0159 13.4942 5.04866 13.4876 5.07923 13.475C5.10979 13.4623 5.13756 13.4437 5.16094 13.4203L8.17031 10.4391C8.19373 10.4157 8.2123 10.3879 8.22498 10.3574C8.23765 10.3268 8.24417 10.294 8.24417 10.2609C8.24417 10.2278 8.23765 10.1951 8.22498 10.1645C8.2123 10.134 8.19373 10.1062 8.17031 10.0828L7.57969 9.4875ZM12 3C12 2.20435 11.6839 1.44129 11.1213 0.87868C10.5587 0.316071 9.79565 0 9 0C8.20435 0 7.44129 0.316071 6.87868 0.87868C6.31607 1.44129 6 2.20435 6 3C5.20435 3 4.44129 3.31607 3.87868 3.87868C3.31607 4.44129 3 5.20435 3 6H15C15 5.20435 14.6839 4.44129 14.1213 3.87868C13.5587 3.31607 12.7956 3 12 3ZM9 4.125C8.7775 4.125 8.55999 4.05902 8.37498 3.9354C8.18998 3.81179 8.04578 3.63609 7.96064 3.43052C7.87549 3.22495 7.85321 2.99875 7.89662 2.78052C7.94002 2.56229 8.04717 2.36184 8.2045 2.2045C8.36184 2.04717 8.56229 1.94003 8.78052 1.89662C8.99875 1.85321 9.22495 1.87549 9.43052 1.96064C9.63609 2.04578 9.81179 2.18998 9.9354 2.37498C10.059 2.55999 10.125 2.7775 10.125 3C10.1254 3.14784 10.0965 3.2943 10.0401 3.43096C9.98372 3.56762 9.90086 3.69178 9.79632 3.79632C9.69178 3.90086 9.56762 3.98372 9.43096 4.04012C9.2943 4.09653 9.14784 4.12537 9 4.125Z" fill="#0F1729"/>
            </g>
            <defs>
              <clipPath id="clip0_22870_21001">
                <rect width="18" height="24" fill="white"/>
              </clipPath>
            </defs>
          </svg>
          </div>
          <div>
            <h5>74</h5>
            <p>custom tests attempted</p>
          </div>
        </div>
      </div>

      <div class="stat-card" style="background-color: rgba(105, 211, 245, 1); top: 60%; z-index: 1; position: fixed;">
        <div class="icon-container">
          <div style="height: 24px; width: 24px;">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="21" viewBox="0 0 20 21" fill="none">
              <g clip-path="url(#clip0_22860_19762)">
                <path d="M10 13.125C9.3158 13.1242 8.65984 12.8474 8.17603 12.3553C7.69223 11.8632 7.4201 11.196 7.41935 10.5C7.41935 9.3126 8.20363 8.31838 9.26935 7.99518L11.4919 5.73357L11.4065 5.4719C10.9569 5.34188 10.4911 5.25 10 5.25C8.97919 5.25 7.98131 5.55791 7.13254 6.13478C6.28377 6.71166 5.62224 7.5316 5.23159 8.49091C4.84094 9.45022 4.73873 10.5058 4.93788 11.5242C5.13703 12.5426 5.6286 13.4781 6.35042 14.2123C7.07224 14.9465 7.99189 15.4466 8.99308 15.6491C9.99427 15.8517 11.032 15.7477 11.9751 15.3504C12.9182 14.953 13.7243 14.2801 14.2915 13.4167C14.8586 12.5534 15.1613 11.5384 15.1613 10.5C15.1613 10.0004 15.071 9.5267 14.9427 9.06896L14.6859 8.98242L12.4625 11.244C12.3061 11.7856 11.9819 12.2613 11.5382 12.6003C11.0945 12.9392 10.5549 13.1233 10 13.125ZM19.5335 7.42793L18.102 8.88398C17.8831 9.10464 17.6193 9.27365 17.329 9.37904C17.9702 13.5294 15.1823 17.4222 11.102 18.0744C7.02177 18.7265 3.19476 15.8903 2.55363 11.7403C1.9125 7.59035 4.70081 3.69715 8.78064 3.045C9.55393 2.92161 10.3414 2.9223 11.1145 3.04705C11.214 2.75218 11.3759 2.48309 11.5887 2.25873L13.0202 0.802676C12.0433 0.48795 11.0247 0.327896 10 0.328125C4.47581 0.328125 0 4.88086 0 10.5C0 16.1191 4.47581 20.6719 10 20.6719C15.5242 20.6719 20 16.1191 20 10.5C20.0002 9.4577 19.8429 8.42157 19.5335 7.42793Z" fill="#0F1729"/>
                <path d="M12.8563 3.53766L12.8565 3.53738L15.4237 0.92531C15.4237 0.925239 15.4238 0.925167 15.4239 0.925096C15.464 0.884521 15.5128 0.855741 15.5654 0.840577C15.618 0.825398 15.6733 0.824136 15.7265 0.836854C15.7796 0.849581 15.8296 0.876086 15.8713 0.914741C15.913 0.953332 15.9451 1.00282 15.9638 1.05898C15.9639 1.05915 15.9639 1.05931 15.964 1.05948L16.7115 3.34056L16.7893 3.57813L17.0261 3.65839L19.269 4.41872C19.2692 4.41879 19.2693 4.41885 19.2695 4.41891C19.3213 4.43676 19.3687 4.46801 19.4069 4.51065C19.4452 4.55348 19.4728 4.60631 19.4863 4.66443C19.4997 4.72257 19.4984 4.78332 19.4824 4.84069C19.4664 4.89804 19.4365 4.94939 19.3965 4.99027L19.3964 4.99029L16.8327 7.60666C16.8327 7.60672 16.8326 7.60678 16.8326 7.60685C16.7889 7.65125 16.7349 7.68159 16.6769 7.69561C16.6192 7.70959 16.5589 7.70709 16.5023 7.68826C16.502 7.68818 16.5018 7.68811 16.5016 7.68803L14.4992 7.00897L14.2021 6.90821L13.9822 7.13189L10.3289 10.8467L10.3289 10.8467C10.2402 10.937 10.1217 10.9861 9.99994 10.9861C9.87822 10.9861 9.75972 10.937 9.67101 10.8467C9.58201 10.7562 9.53052 10.6316 9.53052 10.5C9.53052 10.3684 9.58201 10.2438 9.67101 10.1533L13.3238 6.43766L13.5373 6.22053L13.4423 5.93123L12.7739 3.89436C12.7739 3.89415 12.7738 3.89394 12.7737 3.89373C12.7539 3.83215 12.7511 3.76589 12.7659 3.70262C12.7808 3.63918 12.8124 3.58221 12.8563 3.53766Z" stroke="#0F1729"/>
              </g>
              <defs>
                <clipPath id="clip0_22860_19762">
                  <rect width="20" height="21" fill="white"/>
                </clipPath>
              </defs>
            </svg>
          </div>
          <div>
            <h5>102</h5>
            <p>daily goals completed</p>
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
    <p style="text-align: center; max-width: 90%; font-size: 28px; font-weight: 600;">May your MARKS increase more in 2024 with MARKS!</p>
      <div>
        <div class="diff-text">
          <h1 class="download-count-text text-stroke" style="font-size: 93px;">HAPPY</h1>
          <h1 class="download-count-text diff text-stroke" style="color: rgba(15, 23, 41, 1); font-size: 93px; -webkit-text-stroke-color: #fff;">HAPPY</h1>
        </div>
        <div class="diff-text">
          <h1 class="download-count-text text-stroke" style="font-size: 123px;">2024</h1>
          <h1 class="download-count-text diff" style="color: #69D3F5; font-size: 123px;">2024</h1>
        </div>
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
  new SlideStories("slide");
}
