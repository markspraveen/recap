class SlideStories {
  constructor(id) {
    this.slide = document.querySelector(`[data-slide="${id}"]`);
    this.active = 0;
    this.init();
  }
  activeSlide(index) {
    this.active = index;
    this.items.forEach((item) => item.classList.remove('active'));
    this.items[index].classList.add('active');
    this.thumbItems.forEach((item) => item.classList.remove('active'));
    this.thumbItems.forEach((item) => item.classList.remove('last-active'));
    this.thumbItems[index].classList.add('active');
    if (index == this.thumbItems.length - 1) this.thumbItems[index].classList.add('last-active');
    this.autoSlide();
  }
  prev() {
    if (this.active > 0) {
      this.activeSlide(this.active - 1);
    } else {
      // this.activeSlide(this.items.length - 1);
    }
  }
  next() {
    if (this.active < this.items.length - 1) {
      this.activeSlide(this.active + 1);
    } else {
      
    }
  }
  addNavigation() {
    const nextBtn = this.slide.querySelector('.slide-next');
    const prevBtn = this.slide.querySelector('.slide-prev');
    const restartBtn = this.slide.querySelector('#restartBtn');
    nextBtn.addEventListener('click', this.next);
    prevBtn.addEventListener('click', this.prev);
  }
  addThumbItems() {
    this.items.forEach(() => (this.thumb.innerHTML += `<span></span>`));
    this.thumbItems = Array.from(this.thumb.children);
  }
  autoSlide() {
    clearTimeout(this.timeout);
    this.items[this.active].children[1].classList.add('animate__animated');
    this.items[this.active].children[1].classList.add('animate__fadeInLeft');
    if (this.active == this.items.length - 1) this.timeout = setTimeout(this.next, 15000);
    else this.timeout = setTimeout(this.next, 80000);
  }
  init() {
    this.next = this.next.bind(this);
    this.prev = this.prev.bind(this);
    this.items = this.slide.querySelectorAll('.slide-items > *');
    this.thumb = this.slide.querySelector('.slide-thumb');
    this.addThumbItems();
    this.activeSlide(0);
    this.addNavigation();
  }
}

new SlideStories('slide');

function saveImage(id) {
  document.getElementById(id).children[0].children[1].classList.add('d-none');
  document.getElementById(id).children[1].classList.remove('animate__animated');
  document.getElementById(id).children[1].classList.remove('animate__fadeInLeft');
  document.getElementById(id).children[2].children[0].classList.remove('d-none');
  document.getElementById(id).children[2].children[1].classList.add('d-none');
  html2canvas(document.getElementById(id)).then(function (canvas) {
    var anchorTag = document.createElement('a');
    document.body.appendChild(anchorTag);
    anchorTag.download = `MARKS_APP_RECAP_2022_${Date.now()}`;
    anchorTag.href = canvas.toDataURL();
    anchorTag.target = '_blank';
    anchorTag.setAttribute('onclick', `Android.openUrlAsExternal('${anchorTag.href}')`);
    anchorTag.click();
  });
  document.getElementById(id).children[0].children[1].classList.remove('d-none');
  document.getElementById(id).children[1].classList.add('animate__fadeInLeft');
  document.getElementById(id).children[1].classList.add('animate__fadeInLeft');
  document.getElementById(id).children[2].children[0].classList.add('d-none');
  document.getElementById(id).children[2].children[1].classList.remove('d-none');
}
