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
        threshold: 0.05
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

    // Reveal 애니메이션
    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach(el => observer.observe(el));

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

    // ─── 마감 카운트다운 ───
    (function initCountdown() {
        var now = new Date();
        var endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
        var monthEl = document.getElementById('cd-month');
        if (monthEl) monthEl.textContent = now.getMonth() + 1;

        function tick() {
            var diff = endOfMonth - new Date();
            if (diff <= 0) return;
            var d = Math.floor(diff / 86400000);
            var h = Math.floor((diff % 86400000) / 3600000);
            var m = Math.floor((diff % 3600000) / 60000);
            var s = Math.floor((diff % 60000) / 1000);
            var el = function(id) { return document.getElementById(id); };
            if (el('cd-days')) el('cd-days').textContent = d + '일';
            if (el('cd-hours')) el('cd-hours').textContent = h + '시간';
            if (el('cd-mins')) el('cd-mins').textContent = m + '분';
            if (el('cd-secs')) el('cd-secs').textContent = s + '초';
        }
        tick();
        setInterval(tick, 1000);
    })();

    // ─── 실시간 접수현황 ───
    (function initReceptionList() {
        const list = document.getElementById('reception-list');
        if (!list) return;

        const names = [
            '김**원장님', '이**원장님', '박**원장님', '최**원장님', '정**원장님',
            '강**원장님', '조**원장님', '윤**원장님', '한**원장님', '오**원장님',
            '서**원장님', '신**원장님', '권**원장님', '황**원장님', '안**원장님',
            '송**원장님', '류**원장님', '홍**원장님', '전**원장님', '임**원장님'
        ];
        const regions = [
            '서울 강남', '서울 서초', '경기 분당', '부산 해운대', '대구 수성',
            '인천 연수', '서울 마포', '경기 일산', '서울 송파', '대전 유성',
            '광주 서구', '서울 종로', '경기 수원', '서울 강동', '제주시'
        ];
        const statuses = [
            { label: '상담완료', cls: 'badge-done' },
            { label: '상담중', cls: 'badge-progress' },
            { label: '접수완료', cls: 'badge-consulting' }
        ];

        function formatDate(d) {
            return (d.getMonth() + 1) + '.' + String(d.getDate()).padStart(2, '0');
        }

        function createRow(daysAgo, animate) {
            const name = names[Math.floor(Math.random() * names.length)];
            const region = regions[Math.floor(Math.random() * regions.length)];
            // 최근일수록 상담중/접수완료, 오래될수록 상담완료
            var status;
            if (daysAgo === 0) {
                status = statuses[Math.random() < 0.5 ? 1 : 2]; // 상담중 or 접수완료
            } else if (daysAgo <= 2) {
                status = statuses[Math.floor(Math.random() * 3)];
            } else {
                status = statuses[0]; // 상담완료
            }
            const d = new Date();
            d.setDate(d.getDate() - daysAgo);
            const date = formatDate(d);

            const row = document.createElement('div');
            row.className = 'reception-row' + (animate ? ' new-entry' : '');
            row.innerHTML =
                '<span class="badge ' + status.cls + '">' + status.label + '</span>' +
                '<span class="rec-name">' + name + ' · ' + region + '</span>' +
                '<span class="rec-date">' + date + '</span>';
            return row;
        }

        // 초기 6개: 오늘(0일전)부터 과거순으로 정렬
        var initialDays = [0, 1, 2, 3, 5, 7];
        for (var i = 0; i < initialDays.length; i++) {
            list.appendChild(createRow(initialDays[i], false));
        }

        // 주기적으로 오늘 날짜의 새 항목이 맨 위에 추가 (8~15초 간격)
        function addNewEntry() {
            var row = createRow(0, true);
            list.insertBefore(row, list.firstChild);
            if (list.children.length > 8) {
                list.removeChild(list.lastChild);
            }
            setTimeout(addNewEntry, 8000 + Math.random() * 7000);
        }
        setTimeout(addNewEntry, 6000);
    })();
});
