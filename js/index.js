/* ===== index.html 전용 스크립트 (인라인 <script>에서 추출) =====
   실행 순서 보존 · </body> 직전 1회 로드 · main.js 다음 ===== */

/* ── iframe 높이 동기화 ── */
        (function() {
          var iframe = document.getElementById('agency-iframe');
          function setH(h) {
            if (h > 200) { iframe.style.minHeight = '0'; iframe.style.height = h + 'px'; }
          }
          // PostMessage: page-agency.html에서 정확한 높이 전달
          window.addEventListener('message', function(e) {
            if (e.data && e.data.type === 'agencyIframeHeight') setH(e.data.height);
            if (e.data && e.data.type === 'agencyShowSuccess') {
              var sm = document.getElementById('hp-success-modal');
              if (sm) sm.classList.add('is-open');
            }
          });
          // 직접 접근 폴백 (body.offsetHeight = 실제 콘텐츠 높이)
          function tryDirect() {
            try { setH(iframe.contentDocument.body.offsetHeight); } catch(e) {}
          }
          [300, 800, 1500, 3000].forEach(function(d) { setTimeout(tryDirect, d); });
        })();

/* ── 라이트박스 ── */
      const lightbox=document.getElementById('lightbox'),lbImg=document.getElementById('lightbox-img');
      function openLightbox(src){lbImg.src=src;lightbox.style.display='flex';requestAnimationFrame(()=>{lbImg.style.opacity='1';lbImg.style.transform='scale(1)'})}
      function closeLightbox(){lbImg.style.opacity='0';lbImg.style.transform='scale(.92)';setTimeout(()=>{lightbox.style.display='none';lbImg.src=''}, 300)}
      lightbox.addEventListener('click',e=>{if(e.target===lightbox)closeLightbox()});
      document.addEventListener('keydown',e=>{if(e.key==='Escape')closeLightbox()});
      document.querySelectorAll('.branding-gallery-item img, .logo-marquee-item img, .tcard img').forEach(img=>{img.style.cursor='zoom-in';img.addEventListener('click',()=>openLightbox(img.src))});

/* ── 새로고침 시 최상단 ── */
      // 새로고침 시 항상 최상단 — 모바일 타이밍 보강 (즉시 + DOMContentLoaded + load)
      // (scrollRestoration='manual'은 <head> 최상단에서 먼저 설정됨)
      // 해시 앵커(#section)로 들어온 경우엔 사용자 의도이므로 강제 스크롤 안 함
      (function() {
        if (location.hash) return;
        var toTop = function() { window.scrollTo(0, 0); };
        toTop();
        document.addEventListener('DOMContentLoaded', toTop);
        window.addEventListener('load', toTop);
      })();

/* ── FAQ 토글 ── */
      // FAQ Toggle
      function toggleFaq(btn){
        var item = btn.closest('.faq-item');
        var isOpen = item.classList.contains('open');
        document.querySelectorAll('.faq-item.open').forEach(function(el){ el.classList.remove('open'); });
        if(!isOpen) item.classList.add('open');
      }

/* ── 후기 슬라이더 ── */
      // Testimonial Slider
      (function(){
        var track = document.querySelector('.testimonial-marquee-track');
        if(!track) return;
        var cards = track.querySelectorAll('.testimonial__card');
        if(!cards.length) return;
        var autoTimer;

        function getStep(){
          return cards[0].offsetWidth + 20;
        }

        function slide(dir){
          var step = getStep();
          var maxScroll = track.scrollWidth - track.clientWidth;
          var target = track.scrollLeft + (step * dir);
          if(target > maxScroll) { track.scrollLeft = 0; return; }
          if(target < 0) { track.scrollLeft = maxScroll; return; }
          track.scrollLeft = target;
        }

        function startAuto(){
          stopAuto();
          autoTimer = setInterval(function(){ slide(1); }, 4000);
        }
        function stopAuto(){ clearInterval(autoTimer); }

        window.testimonialSlide = function(dir){
          stopAuto();
          slide(dir);
          startAuto();
        };

        // 마우스 hover 시에도 슬라이드 계속 자동 회전 (멈추지 않음)
        startAuto();
      })();

/* ── Web3Forms 폼 핸들러 ── */
      // ─── Web3Forms 폼 핸들러 (#quickForm + #agencyForm 공통) ───
      (function() {
        // 연락처 자동 하이픈 포맷 (모든 tel 인풋 대상)
        document.querySelectorAll('input[type="tel"][name="phone"]').forEach(function(inp) {
          inp.addEventListener('input', function(e) {
            var v = e.target.value.replace(/[^0-9]/g, '');
            if (v.length < 4) e.target.value = v;
            else if (v.length < 8) e.target.value = v.slice(0,3) + '-' + v.slice(3);
            else e.target.value = v.slice(0,3) + '-' + v.slice(3,7) + '-' + v.slice(7,11);
          });
        });

        function bindForm(formId, submitBtnSelector) {
          var form = document.getElementById(formId);
          if (!form) {
            console.warn('[bindForm]', formId, 'not found');
            return;
          }
          console.log('[bindForm] bound:', formId, '| action:', form.action, '| method:', form.method);
          form.addEventListener('submit', async function(e) {
            console.log('[bindForm] submit fired:', formId);
            e.preventDefault();

            // 연락처 검증
            var phoneInp = form.querySelector('input[type="tel"][name="phone"]');
            if (phoneInp) {
              var phone = phoneInp.value.replace(/[^0-9]/g, '');
              if (!/^01[0-9]\d{7,8}$/.test(phone)) {
                alert('올바른 연락처를 입력해주세요.\n예: 010-1234-5678');
                phoneInp.focus();
                return;
              }
            }

            var btn = submitBtnSelector ? form.querySelector(submitBtnSelector) : form.querySelector('button[type="submit"]');
            var originalHtml = btn ? btn.innerHTML : '';
            if (btn) { btn.disabled = true; btn.innerHTML = '전송 중...'; }
            try {
              var data = new FormData(form);
              var res = await fetch(form.action, {
                method: 'POST',
                body: data,
                headers: { 'Accept': 'application/json' }
              });
              var json = {};
              try { json = await res.json(); } catch (_) {}
              if (res.ok && json.success !== false) {
                if (window.hpTrack) hpTrack('Lead', 'generate_lead', { form_id: formId });
                form.reset();
                var successModal = document.getElementById('hp-success-modal');
                if (successModal) {
                  successModal.classList.add('is-open');
                  document.body.style.overflow = 'hidden';
                } else {
                  alert('상담 신청이 완료되었습니다.\n24시간 내에 연락드리겠습니다.');
                }
              } else {
                console.error('[Web3Forms] error', res.status, json);
                alert('전송에 실패했습니다 (status: ' + res.status + ').\n' + (json.message || '잠시 후 다시 시도해 주세요.'));
              }
            } catch (err) {
              console.error('[Web3Forms] network error', err);
              alert('네트워크 오류로 전송에 실패했습니다.\n잠시 후 다시 시도해 주세요.');
            } finally {
              if (btn) { btn.disabled = false; btn.innerHTML = originalHtml; }
            }
          });
        }
        bindForm('agencyForm', '.hp-agency-submit');
      })();

/* ── 행동 추적 (메타 픽셀 + GA4) ── */
    (function () {
      // 메타 픽셀과 GA4에 동시에 표준 이벤트 전송
      window.hpTrack = function (metaEvent, gaEvent, params) {
        params = params || {};
        try { if (window.fbq) fbq('track', metaEvent, params); } catch (e) {}
        try { if (window.gtag) gtag('event', gaEvent, params); } catch (e) {}
      };

      document.addEventListener('DOMContentLoaded', function () {
        // ① 폼 입력 시작 (이탈 측정용) — 폼당 첫 입력 1회만
        //    이탈률 = InitiateCheckout(시작) 수 − Lead(제출완료) 수
        document.querySelectorAll('form#quickForm, form#agencyForm').forEach(function (form) {
          form.addEventListener('input', function () {
            hpTrack('InitiateCheckout', 'form_start', { form_id: form.id });
          }, { once: true });
        });

        // ② 카톡 / 바로연결 클릭 = 상담 의향
        document.querySelectorAll('a[href*="pf.kakao.com"], a[href*="open.kakao.com"]').forEach(function (a) {
          a.addEventListener('click', function () {
            hpTrack('Contact', 'contact_click', { method: 'kakao' });
          });
        });

        // ③ 블로그 대행 섹션(iframe) 도달 — iframe 내부는 추적 불가하여 노출만 기록
        var agency = document.getElementById('agency-iframe');
        if (agency && 'IntersectionObserver' in window) {
          var seen = false;
          new IntersectionObserver(function (entries, obs) {
            entries.forEach(function (en) {
              if (en.isIntersecting && !seen) {
                seen = true;
                try { if (window.fbq) fbq('trackCustom', 'ViewAgencyForm'); } catch (e) {}
                try { if (window.gtag) gtag('event', 'view_agency_form'); } catch (e) {}
                obs.disconnect();
              }
            });
          }, { threshold: 0.4 }).observe(agency);
        }

        // ④ 스크롤 깊이 (25/50/75/100%) — 각 1회, GA4 분석 + 메타 커스텀
        var marks = [25, 50, 75, 100];
        var fired = {};
        window.addEventListener('scroll', function () {
          var st = window.pageYOffset || document.documentElement.scrollTop;
          var docH = document.documentElement.scrollHeight - window.innerHeight;
          if (docH <= 0) return;
          var pct = Math.round((st / docH) * 100);
          marks.forEach(function (m) {
            if (pct >= m && !fired[m]) {
              fired[m] = true;
              try { if (window.fbq) fbq('trackCustom', 'ScrollDepth', { percent: m }); } catch (e) {}
              try { if (window.gtag) gtag('event', 'scroll_depth', { percent: m }); } catch (e) {}
            }
          });
        }, { passive: true });
      });
    })();

/* ── 모바일 empathy 폰트 ── */
      (function() {
        if (window.innerWidth <= 768) {
          // PAIN POINT 태그, 레퍼런스 이미지 수준으로
          var tag = document.querySelector('.empathy-tag');
          if (tag) {
            tag.style.setProperty('font-size', '0.75rem', 'important');
            tag.style.setProperty('padding', '0.35rem 1rem', 'important');
          }
          // 타이틀, 한 줄에 들어가도록
          var title = document.querySelector('.empathy-title');
          if (title) title.style.setProperty('font-size', '1.35rem', 'important');
          // "저희도 병원을..." 텍스트
          var sub = document.querySelector('.empathy-sub');
          if (sub) sub.style.setProperty('font-size', '0.88rem', 'important');
          // 카드 텍스트들, 줄바꿈 깨지지 않는 적절한 크기
          var bars = document.querySelectorAll('.empathy-bar p');
          bars.forEach(function(p) {
            p.style.setProperty('font-size', '0.84rem', 'important');
          });
          // "애(Ai)실장은 다른 자동화 툴과는 다릅니다" 한 줄 표시
          var featureTitle = document.querySelector('.ai-feature-title');
          if (featureTitle) featureTitle.style.setProperty('font-size', '1.15rem', 'important');
          // 기능카드: 파란 헤드라인 10% 확대, 설명 텍스트 20% 확대
          var featureHeads = document.querySelectorAll('.ai-feature-grid > div > span[style*="font-weight: 700"]');
          featureHeads.forEach(function(s) { s.style.setProperty('font-size', '1.16rem', 'important'); });
          var featureDescs = document.querySelectorAll('.ai-feature-grid > div > p:not(.feature-note)');
          featureDescs.forEach(function(p) { p.style.setProperty('font-size', '1.02rem', 'important'); });
          // 비용 주석 텍스트 한 줄 표시
          var note = document.querySelector('.feature-note');
          if (note) note.style.setProperty('font-size', '0.72rem', 'important');
        }
      })();

/* ── 기능 카드 모달 ── */
      (function() {
        // 모달 열기 버튼
        document.querySelectorAll('[data-feat-modal]').forEach(btn => {
          btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-feat-modal');
            const modal = document.getElementById(id);
            if (modal) {
              modal.classList.add('is-open');
              document.body.style.overflow = 'hidden';
            }
          });
        });
        // 모달 닫기 (backdrop / X / data-close)
        document.querySelectorAll('.hp-modal').forEach(modal => {
          modal.addEventListener('click', e => {
            if (e.target.matches('[data-close]') || e.target.classList.contains('hp-modal__backdrop')) {
              modal.classList.remove('is-open');
              document.body.style.overflow = '';
            }
          });
        });
        // ESC 키로 닫기
        document.addEventListener('keydown', e => {
          if (e.key === 'Escape') {
            document.querySelectorAll('.hp-modal.is-open').forEach(m => {
              m.classList.remove('is-open');
              document.body.style.overflow = '';
            });
          }
        });
      })();

/* ── 프로모션 팝업 ── */
      (function () {
        var PROMO_KEY = 'hp_promo_2026q3_hide';
        // 프로모션 노출 기간: 2026-06-01 ~ 2026-07-31 (이후 자동 비노출)
        function withinPeriod() {
          var now = new Date();
          var start = new Date('2026-06-01T00:00:00+09:00');
          var end = new Date('2026-08-01T00:00:00+09:00');
          return now >= start && now < end;
        }
        function hiddenToday() {
          var v = localStorage.getItem(PROMO_KEY);
          if (!v) return false;
          return new Date().toDateString() === v;
        }
        window.hpClosePromo = function (hideToday) {
          var p = document.getElementById('hp-promo-popup');
          if (!p) return;
          if (hideToday === true) localStorage.setItem(PROMO_KEY, new Date().toDateString());
          p.style.opacity = '0';
          var panel = p.querySelector('.hp-promo-panel');
          if (panel) panel.style.transform = 'translateY(16px) scale(0.98)';
          document.body.style.overflow = '';
          setTimeout(function () { p.style.display = 'none'; }, 350);
        };
        window.hpPromoCtaClick = function () {
          if (typeof hpTrack === 'function') hpTrack('Contact', 'promo_cta_click', { method: 'kakao', promo: '2026q3' });
        };
        function openPromo() {
          var p = document.getElementById('hp-promo-popup');
          if (!p) return;
          p.style.display = 'flex';
          document.body.style.overflow = 'hidden';
          requestAnimationFrame(function () {
            p.style.opacity = '1';
            var panel = p.querySelector('.hp-promo-panel');
            if (panel) panel.style.transform = 'translateY(0) scale(1)';
          });
          if (typeof hpTrack === 'function') hpTrack('ViewContent', 'promo_view', { promo: '2026q3' });
        }
        // 배경 클릭 시 닫기
        var pop = document.getElementById('hp-promo-popup');
        if (pop) pop.addEventListener('click', function (e) { if (e.target === pop) hpClosePromo(); });
        // ESC 닫기
        document.addEventListener('keydown', function (e) {
          if (e.key === 'Escape' && pop && pop.style.display === 'flex') hpClosePromo();
        });
        if (withinPeriod() && !hiddenToday()) {
          setTimeout(openPromo, 1500);
        }
      })();
