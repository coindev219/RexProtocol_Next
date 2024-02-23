// Get all the elements you want to show on scroll

export default async function ScrollpositionAnimation(){
const targets = document.querySelectorAll(".js-show-on-scroll");
const observer = new IntersectionObserver(function(entries) {
  entries.forEach(entry => {
    const test = entry.target as HTMLElement
    const animationType = test.dataset.animateType;
    const assertanimation = animationType as string

    // Is the element in the viewport?
    if (entry.isIntersecting) {

      // Add the fadeIn class:
      entry.target.classList.add(assertanimation);
    } else {

      // Otherwise remove the fadein class
      entry.target.classList.add(assertanimation);
    }
  });
});
// Loop through each of the target
targets.forEach(function(target) {
  // Hide the element
  target.classList.add("opacity-0");

  // Add the element to the watcher
  observer.observe(target);
});

// Callback for IntersectionObserver

}