document.addEventListener('DOMContentLoaded', function() {
  var slides = document.querySelectorAll('.slide');
  var currentSlideIndex = 0;

  // Show the initial slide immediately
  slides[currentSlideIndex].classList.add('visible');

  function showNextSlide() {
    // Hide the current slide
    slides[currentSlideIndex].classList.remove('visible');

    // Move to the next slide
    currentSlideIndex = (currentSlideIndex + 1) % slides.length;

    // Show the next slide
    slides[currentSlideIndex].classList.add('visible');
  }

  // Start the slideshow after 3 seconds
  setInterval(showNextSlide, 3000);
});


  document.addEventListener('DOMContentLoaded', function() {
    var scrollDownArrow = document.querySelector('.scroll-down-arrow');
    scrollDownArrow.addEventListener('click', function(event) {
      event.preventDefault();
      var nextSection = document.querySelector('#next-section');
      nextSection.scrollIntoView({ behavior: 'smooth' });
    });
  });