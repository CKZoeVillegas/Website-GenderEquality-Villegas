document.addEventListener('DOMContentLoaded', function () {
    try {
        // =========================
        // 1. Navbar highlight on scroll (for index.html)
        // =========================
        const sections = document.querySelectorAll('section#home, section#about, section#importance, section#challenges, section#actions, section#quiz'); // More specific to index.html sections
        const navLinksScroll = document.querySelectorAll('.navbar ul a[href^="#"], .navbar ul a[href^="index.html#"]'); // Links that point to anchors

        function highlightNavLink() {
            let foundActive = false;
            const scrollPosition = window.scrollY;
            sections.forEach((section) => {
                const sectionTop = section.offsetTop - 150; // Adjusted offset
                const sectionBottom = sectionTop + section.offsetHeight;
                const sectionId = section.getAttribute('id');
                const correspondingLink = document.querySelector(`.navbar ul a[href="#${sectionId}"], .navbar ul a[href="index.html#${sectionId}"]`);

                if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                    if (correspondingLink) {
                        navLinksScroll.forEach(link => link.classList.remove('active'));
                        correspondingLink.classList.add('active');
                        foundActive = true;
                    }
                    section.classList.add('visible'); // For title animation
                } else {
                    // Remove visible class if not in view, for sections that rely on it for animation reset
                    // section.classList.remove('visible'); 
                }
            });
            // If no section is active by scroll (e.g., at the very top/bottom or on a different page part not in `sections`)
            // We might not want to remove all active classes if another script handles it (like new_pages.js)
            if (!foundActive && window.location.pathname.endsWith('index.html')) {
                 // Potentially clear all if only on index.html and no section matches.
                 // However, new_pages.js handles active for other pages.
            }
        }

        // Only run scroll-based highlighting if we are on a page that has these sections (likely index.html)
        if (sections.length > 0 && navLinksScroll.length > 0 && (window.location.pathname.endsWith('/') || window.location.pathname.endsWith('index.html'))) {
            window.addEventListener('scroll', highlightNavLink);
            highlightNavLink(); // Initial call
        }

        // =========================
        // 2. Quiz Logic (ONLY IF quiz elements exist)
        // =========================
        const quizForm = document.getElementById('quizForm'); // Check for the form presence

        if (quizForm) { // This ensures quiz logic only runs if quizForm is on the page
            const quizCards = document.querySelectorAll('.quiz-card');
            const prevBtn = document.getElementById('prevBtn');
            const nextBtn = document.getElementById('nextBtn');
            const submitQuizBtn = document.getElementById('submitQuiz');
            const quizResult = document.getElementById('quizResult');
            let currentQuestion = 0;
            const totalQuestions = quizCards.length;

            // Only proceed if all essential quiz elements are found
            if (quizCards.length > 0 && prevBtn && nextBtn && submitQuizBtn && quizResult) {
                showQuestion(currentQuestion);

                const correctAnswers = { q1: 'b', q2: 'c', q3: 'c', q4: 'b', q5: 'c' };

                prevBtn.addEventListener('click', function() {
                    if (currentQuestion > 0) {
                        currentQuestion--;
                        showQuestion(currentQuestion);
                    }
                });

                nextBtn.addEventListener('click', function() {
                    // Check if an answer is selected for the current question
                    const currentQuizCard = quizCards[currentQuestion];
                    const radioButtons = currentQuizCard.querySelectorAll('input[type="radio"]:checked');

                    if (radioButtons.length === 0) {
                        alert('Please select an answer before proceeding.');
                        return; // Stop if no answer is selected
                    }

                    if (currentQuestion < totalQuestions - 1) {
                        currentQuestion++;
                        showQuestion(currentQuestion);
                    }
                });

                submitQuizBtn.addEventListener('click', function() {
                    if (submitQuizBtn.textContent === 'Submit') {
                        // Check if the last question is answered before submitting
                        const lastQuestionCard = quizCards[currentQuestion]; // Should be the last question
                        const radioButtonsLast = lastQuestionCard.querySelectorAll('input[type="radio"]:checked');
                        if (radioButtonsLast.length === 0) {
                            alert('Please select an answer for the current question before submitting.');
                            return; // Stop if no answer is selected
                        }

                        let score = 0;
                        for (let i = 1; i <= totalQuestions; i++) {
                            const questionName = 'q' + i;
                            const options = document.getElementsByName(questionName);
                            let userAnswer = '';
                            for (let option of options) {
                                if (option.checked) {
                                    userAnswer = option.value;
                                    break;
                                }
                            }
                            if (userAnswer === correctAnswers[questionName]) {
                                score++;
                            }
                        }
                        quizResult.innerHTML = `<h3>Your Score: ${score} / ${totalQuestions}</h3><p>${getFeedbackMessage(score, totalQuestions)}</p>`;
                        submitQuizBtn.textContent = 'Try Again';
                        prevBtn.style.display = 'none'; // Hide Prev button
                        nextBtn.style.display = 'none'; // Hide Next button
                    } else {
                        // Handle "Try Again"
                        resetQuiz();
                    }
                });

                function showQuestion(index) {
                    quizCards.forEach(card => card.classList.remove('active'));
                    if (quizCards[index]) {
                        quizCards[index].classList.add('active');
                    }
                    quizResult.innerHTML = ''; // Clear previous results when showing a question
                    prevBtn.style.display = (index === 0) ? 'none' : 'inline-block';
                    nextBtn.style.display = (index === totalQuestions - 1) ? 'none' : 'inline-block';
                    submitQuizBtn.style.display = (index === totalQuestions - 1) ? 'inline-block' : 'none';
                    if (index === totalQuestions -1 ) submitQuizBtn.textContent = 'Submit'; // Ensure submit button text is correct
                }

                function getFeedbackMessage(score, total) {
                    const percentage = (score / total) * 100;
                    if (percentage === 100) return "Outstanding! You really know your Gender Equality facts.";
                    if (percentage >= 60) return "Good job! You have a solid understanding, but there's room to learn more.";
                    return "Don't worry, keep learning! Review the information above and try again.";
                }

                function resetQuiz() {
                    currentQuestion = 0;
                    // Clear all radio button selections
                    quizCards.forEach(card => {
                        const radioButtons = card.querySelectorAll('input[type="radio"]');
                        radioButtons.forEach(rb => rb.checked = false);
                    });
                    submitQuizBtn.textContent = 'Submit'; // Set button text back
                    showQuestion(currentQuestion); // Show the first question
                }

            } else {
                
            }
        } // End of if(quizForm) check

        // =========================
        // Title Animation for Static Content Pages (e.g., success_stories, resources)
        // =========================
        // Check if we are NOT on index.html (where title animation is scroll-dependent)
        if (!window.location.pathname.endsWith('/') && !window.location.pathname.endsWith('index.html')) {
            const animatedTitle = document.querySelector('.animate-title');
            if (animatedTitle) {
                const parentSection = animatedTitle.closest('section');
                if (parentSection) {
                    // Add 'visible' class to trigger animation after a short delay
                    setTimeout(() => {
                        parentSection.classList.add('visible');
                    }, 100); // 100ms delay
                }
            }
        }

        // =========================
        // Mobile Navbar Toggle (Should run on all pages)
        // =========================
        const navbarToggle = document.querySelector('.navbar-toggle');
        const navbarUl = document.querySelector('.navbar ul');

        if (navbarToggle && navbarUl) {
            navbarToggle.addEventListener('click', function (event) {
                event.stopPropagation();
                navbarUl.classList.toggle('navbar-ul-open');
                const isExpanded = navbarUl.classList.contains('navbar-ul-open');
                navbarToggle.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
                navbarToggle.classList.toggle('active'); // For hamburger to X animation
            });

            navbarUl.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', (event) => {
                    if (navbarUl.classList.contains('navbar-ul-open')) {
                        const href = link.getAttribute('href');
                        const isSimpleAnchor = href && href.startsWith('#');
                        const isInternalPageLink = href && !href.startsWith('#') && !href.startsWith('http');
                        if (isSimpleAnchor || isInternalPageLink || (link.pathname !== window.location.pathname || link.hash)) {
                            navbarUl.classList.remove('navbar-ul-open');
                            navbarToggle.setAttribute('aria-expanded', 'false');
                            navbarToggle.classList.remove('active');
                        }
                    }
                });
            });

            document.addEventListener('click', function(event) {
                if (navbarUl.classList.contains('navbar-ul-open') && 
                    !navbarUl.contains(event.target) && 
                    !navbarToggle.contains(event.target)) {
                    navbarUl.classList.remove('navbar-ul-open');
                    navbarToggle.setAttribute('aria-expanded', 'false');
                    navbarToggle.classList.remove('active');
                }
            });
        }

        // =========================
        // Dynamic Footer Year (Should run on all pages)
        // =========================
        const yearSpan = document.getElementById('currentYear');
        if (yearSpan) {
            yearSpan.textContent = new Date().getFullYear();
        }

    } catch (error) {
        
    }
});
  