// landing.js

document.addEventListener('DOMContentLoaded', () => {
  // 1. Scroll Reveal
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  
  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  // 2. Count-Up
  const countObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = parseFloat(entry.target.getAttribute('data-target'));
        const suffix = entry.target.getAttribute('data-suffix') || '';
        const duration = 2000;
        let start = 0;
        let startTime = null;

        function easeOutCubic(p) { return 1 - Math.pow(1 - p, 3); }

        function updateCount(timestamp) {
          if (!startTime) startTime = timestamp;
          const progress = Math.min((timestamp - startTime) / duration, 1);
          const current = Math.floor(easeOutCubic(progress) * target);
          
          // formatting with commas if integer
          let displayVal = current;
          if (target % 1 !== 0) displayVal = (easeOutCubic(progress) * target).toFixed(1);
          else displayVal = current.toLocaleString();

          entry.target.innerText = displayVal + suffix;

          if (progress < 1) requestAnimationFrame(updateCount);
          else {
            if (target % 1 !== 0) entry.target.innerText = target.toFixed(1) + suffix;
            else entry.target.innerText = target.toLocaleString() + suffix;
          }
        }
        requestAnimationFrame(updateCount);
        countObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.count-up').forEach(el => countObserver.observe(el));

  // 3. Pipeline Sequential Highlight
  const steps = document.querySelectorAll('.pipeline-step');
  if (steps.length > 0) {
    let currentIndex = 0;
    
    function highlightNext() {
      // Clear all
      steps.forEach(s => s.classList.remove('step-active'));
      
      // Highlight current
      if (currentIndex < steps.length) {
        steps[currentIndex].classList.add('step-active');
        currentIndex++;
        setTimeout(highlightNext, 1000);
      } else {
        // Reset and restart
        currentIndex = 0;
        setTimeout(highlightNext, 800); // 0.8초 대기 후 재시작
      }
    }
    
    // Start sequence when pipeline section is visible
    const pipeObserver = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        setTimeout(highlightNext, 500);
        pipeObserver.disconnect();
      }
    }, { threshold: 0.2 });
    
    pipeObserver.observe(document.getElementById('pipeline'));
  }
});
