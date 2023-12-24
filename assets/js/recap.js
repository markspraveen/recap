let slidesCount = 6;
let currentSlide = 1;
let slideInterval = 8000;
let playing = true;
let pauseButton = document.getElementById("pause");
let nextButton = document.getElementById("next");
let previousButton = document.getElementById("previous");
let playSlideshow = document.getElementById("playSlideshow");

// get token and year from url
const urlParams = new URLSearchParams(window.location.search);
const TOKEN = urlParams.get("token");
const YEAR = "2022" // urlParams.get("year");

const API_ENDPOINT = `https://production.getmarks.app/api/v1/recap?token=${TOKEN}&year=${YEAR}`;
let yearData = {};
fetch(API_ENDPOINT)
  .then((res) => res.json())
  .then((data) => {
    yearData = data?.data;
    modifyUserData();
    generateSlides();
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

// addStartSlide();
downloadSlide();
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
        <img src="assets/img/ic_google_play.svg" alt="Logo" class="brand">

        <a href="#!" class="">
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

      ${getShareElement()}
      ${getFooterElement()}
    </main>
  `);
  slidesContainer.appendChild(startSlide);
}

function downloadSlide() {
  const slidesContainer = document.getElementById("slide-items");
  const downloadSlide = document.createElement("div");
  downloadSlide.classList.add("wrapper");
  downloadSlide.classList.add("bg-dark");

  downloadSlide.innerHTML = getLayout(`
    <main class="center-slide-main">
      <p>This year Marks crossed</p>
      <h1 class="download-count-text">500K+</h1>
      <h4>Downloads</h4>
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
