document.addEventListener('DOMContentLoaded', function () {
    // =========================
    // Active Nav Link for New Pages
    // =========================
    const navLinksNewPages = document.querySelectorAll('nav .navbar ul li a');
    const currentPagePath = window.location.pathname.split('/').pop(); // Gets 'success_stories.html' or 'resources.html'

    navLinksNewPages.forEach(link => {
        const linkPath = link.getAttribute('href').split('/').pop();
        if (linkPath === currentPagePath) {
            link.classList.add('active');
        }

        // Special handling for anchor links on index.html from other pages
        // This ensures 'Home', 'About' etc. are not 'active' when on success_stories.html or resources.html
        // unless explicitly navigated to an anchor on index.html (which is less common for separate page navs)
        if (currentPagePath === 'success_stories.html' || currentPagePath === 'resources.html') {
            if (link.getAttribute('href').includes('index.html#')) {
                link.classList.remove('active');
            }
        }
    });

    // This re-uses the concept from your main script.js but ensures it runs on new pages.
    const animatedTitle = document.querySelector('.animate-title');
    if (animatedTitle) {
        // Simple way to trigger animation on page load for new pages
        // You might want a more sophisticated check if these pages also have sections to scroll to.
        setTimeout(() => {
            animatedTitle.style.opacity = '1';
            animatedTitle.style.transform = 'translateY(0)';
        }, 200); // Small delay to ensure it's visible
    }
}); 