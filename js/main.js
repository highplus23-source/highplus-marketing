document.addEventListener('DOMContentLoaded', () => {
    // 1. Header Scroll Effect
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            
            if (window.scrollY === 0) header.classList.remove('scrolled');
        }
    });

    // 2. Intersection Observer for Fade-Up Animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');

                // If the element has a counter, trigger it
                if (entry.target.classList.contains('stats-container')) {
                    runCounters(entry.target);
                }

                // Stop observing after animating once
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const fadeElements = document.querySelectorAll('.fade-up');
    fadeElements.forEach(el => observer.observe(el));

    // Stats Observer logic
    const statsContainer = document.querySelector('.stats-container');
    if (statsContainer) observer.observe(statsContainer);

    // 3. Number Counter Animation function
    function runCounters(container) {
        const counters = container.querySelectorAll('.counter');
        const speed = 200; // The lower the slower

        counters.forEach(counter => {
            const updateCount = () => {
                const target = +counter.getAttribute('data-target');
                const count = +counter.innerText;
                const inc = target / speed;

                if (count < target) {
                    counter.innerText = Math.ceil(count + inc);
                    setTimeout(updateCount, 15);
                } else {
                    counter.innerText = target;
                }
            };
            updateCount();
        });
    }

    // 4. Form Submission handling via Formspree API (AJAX)
    const leadForm = document.getElementById('leadForm');
    if (leadForm) {
        leadForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // Prevent default redirect

            const btn = leadForm.querySelector('.btn-submit');
            const originalBtnText = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 처리중...';
            btn.disabled = true;

            const data = new FormData(leadForm);

            try {
                const response = await fetch(e.target.action, {
                    method: leadForm.method,
                    body: data,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    alert('상담 신청이 완료되었습니다! 영업일 기준 24시간 내에 연락드리겠습니다.');
                    leadForm.reset();
                } else {
                    const responseData = await response.json();
                    if (Object.hasOwn(responseData, 'errors')) {
                        alert(responseData.errors.map(error => error.message).join(", "));
                    } else {
                        alert('앗! 전송에 문제가 발생했습니다. 다시 시도해 주세요.');
                    }
                }
            } catch (error) {
                alert('앗! 네트워크 통신에 문제가 발생했습니다.');
            } finally {
                btn.innerHTML = originalBtnText;
                btn.disabled = false;
            }
        });
    }

    // 5. Dark Mode Toggle Logic
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = themeToggleBtn?.querySelector('i');
    
    // Check saved theme or system preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Apply initial theme
    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
        document.documentElement.setAttribute('data-theme', 'dark');
        if (themeIcon) {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        }
    }
    
    // Toggle Event
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            if (currentTheme === 'dark') {
                document.documentElement.removeAttribute('data-theme');
                localStorage.setItem('theme', 'light');
                themeIcon.classList.remove('fa-sun');
                themeIcon.classList.add('fa-moon');
            } else {
                document.documentElement.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
                themeIcon.classList.remove('fa-moon');
                themeIcon.classList.add('fa-sun');
            }
        });
    }
});
