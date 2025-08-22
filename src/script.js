function copyCode() {
  const codeLines = document.querySelectorAll(".line-content")
  const codeText = Array.from(codeLines)
    .map((line) => line.textContent)
    .join("\n")

  navigator.clipboard
    .writeText(codeText)
    .then(() => {
      showNotification()
      updateCopyButton()
    })
    .catch((err) => {
      console.error("Failed to copy code: ", err)
    })
}

function showNotification() {
  const notification = document.getElementById("notification")
  notification.classList.add("show")

  setTimeout(() => {
    notification.classList.remove("show")
  }, 2000)
}

function updateCopyButton() {
  const button = document.querySelector(".copy-button")
  const originalText = button.textContent

  button.textContent = "Copied!"
  button.classList.add("copied")

  setTimeout(() => {
    button.textContent = originalText
    button.classList.remove("copied")
  }, 2000)
}

// Add keyboard shortcut for copying (Ctrl+C or Cmd+C)
document.addEventListener("keydown", (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === "c" && !window.getSelection().toString()) {
    e.preventDefault()
    copyCode()
  }
})

// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    // Handle navigation link clicks
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Only prevent default for hash links (not for links to other pages)
            const href = this.getAttribute('href');
            
            if (href.includes('#') && !href.startsWith('http')) {
                e.preventDefault();
                
                let targetId;
                let targetElement;
                
                // Handle both direct #section links and page.html#section links
                if (href.includes('#') && href.charAt(0) !== '#') {
                    // For links like "index.html#projects"
                    const parts = href.split('#');
                    
                    // If we're already on the correct page
                    if (window.location.pathname.endsWith(parts[0]) || 
                        (parts[0] === 'index.html' && (window.location.pathname === '/' || window.location.pathname.endsWith('index.html')))) {
                        targetId = parts[1];
                        targetElement = document.getElementById(targetId);
                    } else {
                        // If we need to navigate to another page, let the default behavior happen
                        return;
                    }
                } else if (href.charAt(0) === '#') {
                    // For links like "#projects"
                    targetId = href.substring(1);
                    targetElement = document.getElementById(targetId);
                }
                
                if (targetElement) {
                    const headerHeight = document.querySelector('header').offsetHeight;
                    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Update URL without reloading the page
                    history.pushState(null, null, `#${targetId}`);
                    
                    // Update active state
                    navLinks.forEach(navLink => navLink.classList.remove('active'));
                    this.classList.add('active');
                }
            }
        });
    });
    
    // Update active navigation link based on scroll position
    function updateActiveNavLink() {
        const scrollPosition = window.scrollY;
        const headerHeight = document.querySelector('header').offsetHeight;
        
        // Get all sections with IDs
        const sections = document.querySelectorAll('section[id]');
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - headerHeight - 10;
            const sectionBottom = sectionTop + section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                document.querySelectorAll('.nav-link').forEach(link => {
                    link.classList.remove('active');
                    
                    if (link.getAttribute('href').endsWith(`#${sectionId}`)) {
                        link.classList.add('active');
                    }
                });
            }
        });
        
        // If we're at the top of the page, activate the Home link
        if (scrollPosition < 100) {
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === 'index.html' || link.getAttribute('href') === './') {
                    link.classList.add('active');
                }
            });
        }
    }
    
    // Update active link on scroll
    window.addEventListener('scroll', updateActiveNavLink);
    
    // Set initial active link based on URL hash
    function setInitialActiveLink() {
        const hash = window.location.hash;
        
        if (hash) {
            const targetLink = document.querySelector(`.nav-link[href$="${hash}"]`);
            if (targetLink) {
                document.querySelectorAll('.nav-link').forEach(link => {
                    link.classList.remove('active');
                });
                targetLink.classList.add('active');
                
                // Scroll to the section after a short delay to ensure DOM is ready
                setTimeout(() => {
                    const targetElement = document.querySelector(hash);
                    if (targetElement) {
                        const headerHeight = document.querySelector('header').offsetHeight;
                        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                        
                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                    }
                }, 100);
            }
        } else {
            // If no hash, activate home link
            const homeLink = document.querySelector('.nav-link[href="index.html"]');
            if (homeLink) {
                homeLink.classList.add('active');
            }
        }
    }
    
    // Set initial active link
    setInitialActiveLink();
});

