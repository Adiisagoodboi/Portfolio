document.addEventListener("DOMContentLoaded", function () {
    const heading = document.getElementById("animated-heading");
    const originalText = heading.innerText;
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
    let iteration = 0;
    
    function scrambleEffect() {
        heading.innerText = originalText
            .split("")
            .map((char, index) => {
                if (index < iteration) {
                    return originalText[index]; 
                }
                return characters[Math.floor(Math.random() * characters.length)];
            })
            .join("");

        if (iteration < originalText.length) {
            iteration++;
            setTimeout(scrambleEffect, 100);
        }
    }

    scrambleEffect(); // Start animation
});


document.querySelector('.explore-click').addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    let navbar = document.querySelector('nav');
    navbar.classList.add('highlight-nav');

    setTimeout(() => {
        navbar.classList.add('fade-out');

        setTimeout(() => {
            navbar.classList.remove('highlight-nav', 'fade-out');
        }, 500);
        
    }, 2000);
});
