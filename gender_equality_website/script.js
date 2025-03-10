document.addEventListener('DOMContentLoaded', function () {
    // =========================
    // 1. Navbar highlight on scroll
    // =========================
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('nav a');
  
    function highlightNavLink() {
      const scrollPosition = window.scrollY;
  
      sections.forEach((section, index) => {
        const sectionTop = section.offsetTop - 100;
        const sectionBottom = sectionTop + section.offsetHeight;
  
        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
          navLinks.forEach(link => link.classList.remove('active'));
          navLinks[index].classList.add('active');
          section.classList.add('visible');
        }
      });
    }
  
    window.addEventListener('scroll', highlightNavLink);
    highlightNavLink();
  
    // =========================
    // 2. Quiz Logic: One Question at a Time
    // =========================
    const quizCards = document.querySelectorAll('.quiz-card');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const submitQuizBtn = document.getElementById('submitQuiz');
    const quizResult = document.getElementById('quizResult');
  
    // Keep track of the current question index
    let currentQuestion = 0;
    // Total questions
    const totalQuestions = quizCards.length;
  
    // Show the first question card
    showQuestion(currentQuestion);
  
    // Correct answers key
    const correctAnswers = {
      q1: 'b',
      q2: 'c',
      q3: 'c',
      q4: 'b',
      q5: 'c'
    };
  
    // -----------------------
    // Button Event Listeners
    // -----------------------
    prevBtn.addEventListener('click', function() {
      if (currentQuestion > 0) {
        currentQuestion--;
        showQuestion(currentQuestion);
      }
    });
  
    nextBtn.addEventListener('click', function() {
      if (currentQuestion < totalQuestions - 1) {
        currentQuestion++;
        showQuestion(currentQuestion);
      }
    });
  
    submitQuizBtn.addEventListener('click', function() {
      // Calculate score
      let score = 0;
  
      // For each question name (q1, q2, etc.)
      for (let i = 1; i <= totalQuestions; i++) {
        const questionName = 'q' + i;
        const options = document.getElementsByName(questionName);
        let userAnswer = '';
  
        // Check which option is selected
        for (let option of options) {
          if (option.checked) {
            userAnswer = option.value;
            break;
          }
        }
  
        // Compare userAnswer with the correct answer
        if (userAnswer === correctAnswers[questionName]) {
          score++;
        }
      }
  
      // Display the result
      quizResult.innerHTML = `
        <h3>Your Score: ${score} / ${totalQuestions}</h3>
        <p>${getFeedbackMessage(score, totalQuestions)}</p>
      `;
    });
  
    // -----------------------
    // Show/Hide Questions
    // -----------------------
    function showQuestion(index) {
      // Hide all quiz cards
      quizCards.forEach(card => {
        card.classList.remove('active');
      });
  
      // Show the current quiz card
      quizCards[index].classList.add('active');
  
      // Handle button visibility
      if (index === 0) {
        prevBtn.style.display = 'none'; // Hide prev on first question
      } else {
        prevBtn.style.display = 'inline-block';
      }
  
      if (index === totalQuestions - 1) {
        nextBtn.style.display = 'none';  // Hide next on last question
        submitQuizBtn.style.display = 'inline-block'; // Show submit
      } else {
        nextBtn.style.display = 'inline-block';
        submitQuizBtn.style.display = 'none';
      }
    }
  
    // -----------------------
    // Feedback Function
    // -----------------------
    function getFeedbackMessage(score, total) {
      const percentage = (score / total) * 100;
      if (percentage === 100) {
        return "Outstanding! You really know your Gender Equality facts.";
      } else if (percentage >= 60) {
        return "Good job! You have a solid understanding, but there's room to learn more.";
      } else {
        return "Don’t worry, keep learning! Review the information above and try again.";
      }
    }
  });
  
