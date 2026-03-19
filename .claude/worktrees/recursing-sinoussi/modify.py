import codecs
import re

with codecs.open("index_backup_final.html", "r", "utf-8") as f:
    html = f.read()

css = """
    <!-- Dark AI Template UI Overrides -->
    <style>
        /* Base Dark Theme */
        body {
            background-color: #05091a !important;
            color: #f8fafc !important;
            font-family: 'Pretendard', sans-serif !important;
        }
        p {
            color: #94a3b8 !important;   
        }
        h1, h2, h3, h4, h5, h6 {
            color: #ffffff !important;
            font-weight: 900 !important;
            letter-spacing: -0.02em !important;
        }
        section {
            padding: 120px 0 !important;
            position: relative;
        }

        /* Background Blue Radial Gradients */
        body::before {
            content: '';
            position: fixed;
            top: -20%;
            left: 50%;
            transform: translateX(-50%);
            width: 80%;
            height: 600px;
            background: radial-gradient(ellipse at center, rgba(37, 99, 235, 0.15) 0%, rgba(5, 9, 26, 0) 70%);
            z-index: -1;
            pointer-events: none;
        }
        .hero-section {
            padding-top: 180px !important;
        }
        .hero-section::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 80%;
            height: 600px;
            background: radial-gradient(ellipse at center, rgba(59, 130, 246, 0.2) 0%, rgba(5, 9, 26, 0) 70%);
            z-index: 0;
            pointer-events: none;
        }

        /* Nav Menu */
        #header {
            background: rgba(5, 9, 26, 0.8) !important;
            backdrop-filter: blur(20px) !important;
            -webkit-backdrop-filter: blur(20px) !important;
            border-bottom: 1px solid rgba(255,255,255,0.05) !important;
        }
        @media (min-width: 769px) {
            .header-container {
                display: flex !important;
                justify-content: space-between !important;
                align-items: center !important;
                position: relative;
            }
            .nav-links {
                position: absolute;
                left: 50%;
                transform: translateX(-50%);
                display: flex;
                gap: 40px;
            }
        }
        .nav-links a {
            color: #cbd5e1 !important;
            font-size: 0.95rem !important;
            transition: color 0.3s;
        }
        .nav-links a:hover {
            color: #ffffff !important;
        }
        #theme-toggle {
            display: none !important;
        }

        /* Primary Colors and Buttons */
        :root {
            --primary-color: #2563eb !important;
            --primary-color-hover: #3b82f6 !important;
        }
        .btn {
            border-radius: 999px !important;
        }
        .btn-primary, .btn-submit, .btn-kakao {
            background: var(--primary-color) !important;
            color: #ffffff !important;
            border: none !important;
            border-radius: 999px !important;
            padding: 14px 32px !important;
            font-weight: 600 !important;
            box-shadow: 0 4px 14px rgba(37, 99, 235, 0.4) !important;
            transition: all 0.3s ease !important;
        }
        .btn-primary:hover, .btn-submit:hover, .btn-kakao:hover {
            background: var(--primary-color-hover) !important;
            box-shadow: 0 6px 20px rgba(59, 130, 246, 0.6) !important;
            transform: translateY(-2px);
        }
        .text-gradient {
            background: linear-gradient(135deg, #60a5fa, #3b82f6) !important;
            -webkit-background-clip: text !important;
            -webkit-text-fill-color: transparent !important;
        }

        /* Hero Modifications */
        .hero-content {
            text-align: center !important;
            position: relative;
            z-index: 2;
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        .hero-badge {
            background: rgba(255,255,255,0.08) !important;
            color: #e2e8f0 !important;
            border: 1px solid rgba(255,255,255,0.1) !important;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2) !important;
            font-size: 0.95rem !important;
            padding: 8px 24px !important;
            border-radius: 999px !important;
            backdrop-filter: blur(10px);
            margin-bottom: 30px !important;
            display: inline-block;
        }
        .hero-badge[style] {
            /* Override inline styles */
            background: rgba(255,255,255,0.08) !important;
            color: #e2e8f0 !important;
            border: 1px solid rgba(255,255,255,0.1) !important;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2) !important;
        }
        .hero-buttons {
            display: flex;
            justify-content: center;
            gap: 16px;
            margin-top: 10px;
        }

        /* Cards (Features, Sections) */
        .pain-card, .phi-card, .service-item, .process-step, .testimonial-card, .stat-box, .faq-item {
            background: rgba(255,255,255,0.04) !important;
            border: 1px solid rgba(59,130,246,0.15) !important;
            border-radius: 16px !important;
            box-shadow: 0 8px 32px rgba(0,0,0,0.2) !important;
            backdrop-filter: blur(10px);
            transition: transform 0.3s, border-color 0.3s;
            overflow: hidden;
        }
        .pain-card:hover, .phi-card:hover, .service-item:hover {
            transform: translateY(-5px);
            border-color: rgba(59,130,246,0.5) !important;
        }

        /* 3-Column Grid setup */
        .pain-points-grid {
            display: grid !important;
            grid-template-columns: repeat(3, 1fr) !important;
            gap: 30px !important;
        }
        .philosophy-grid {
            display: grid !important;
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 30px !important;
        }
        @media (min-width: 1024px) {
            .philosophy-grid {
                grid-template-columns: repeat(4, 1fr) !important;
            }
        }
        @media (max-width: 768px) {
            .pain-points-grid, .philosophy-grid {
                grid-template-columns: 1fr !important;
            }
            .nav-links { display: none !important; }
        }

        /* Top Visual Image for Cards */
        .pain-card, .phi-card { padding: 0 !important; text-align: center; }
        .pain-card .icon, .phi-card .phi-icon {
            width: 100% !important;
            max-width: none !important;
            height: 160px !important;
            background: linear-gradient(135deg, rgba(37,99,235,0.2), rgba(5,9,26,0.8)) !important;
            border-bottom: 1px solid rgba(59,130,246,0.1) !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            margin-bottom: 24px !important;
            margin-top: 0 !important;
            border-radius: 0 !important;
        }
        .pain-card .icon i, .phi-card .phi-icon i {
            font-size: 3.5rem !important;
            color: #60a5fa !important;
            filter: drop-shadow(0 0 15px rgba(59,130,246,0.6)) !important;
            background: transparent !important;
            -webkit-text-fill-color: #60a5fa !important;
        }

        .pain-card h3, .phi-card h4 { padding: 0 24px !important; }
        .pain-card p, .phi-card p { padding: 0 24px 32px !important; }

        /* CTA Section Centered */
        #contact { padding-top: 60px !important; }
        .cta-container {
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            text-align: center !important;
        }
        .cta-text {
            width: 100% !important;
            max-width: 800px;
            margin-bottom: 40px !important;
            padding-right: 0 !important;
        }
        .cta-form-box {
            width: 100% !important;
            max-width: 600px;
            background: rgba(255,255,255,0.02) !important;
            padding: 40px !important;
        }
        .contact-info-direct {
            justify-content: center !important;
            text-align: center !important;
        }
        .contact-info-direct p {
            justify-content: center !important;
        }

        /* Form Controls */
        .form-group label {
            color: #cbd5e1 !important;
        }
        input, textarea {
            background: rgba(0,0,0,0.3) !important;
            border: 1px solid rgba(255,255,255,0.1) !important;
            color: #fff !important;
            border-radius: 8px !important;
        }
        input:focus, textarea:focus {
            border-color: #3b82f6 !important;
            outline: none !important;
        }
        
        /* General layout additions */
        .bg-light { background-color: transparent !important; }
        .section-title h2, .section-title p { text-align: center !important; }
        .service-list li { color: #cbd5e1 !important; }
        .service-list li i { color: #3b82f6 !important; }
        .step-number { color: #3b82f6 !important; background: rgba(59,130,246,0.1) !important; }
        
        /* Custom Button tweaks */
        .btn-outline {
            border-color: rgba(255,255,255,0.2) !important;
            color: #fff !important;
            border-radius: 999px !important;
        }
        .btn-outline:hover {
            background: rgba(255,255,255,0.1) !important;
            border-color: rgba(255,255,255,0.5) !important;
        }
        
        /* Testimonials texts */
        .quote { color: #f1f5f9 !important; }
        
        /* Stats */
        .stat-box h3, .stat-box span { color: #60a5fa !important; }
        
        /* Links */
        a { color: #60a5fa; text-decoration: none; }
        
        /* Header Logo */
        .logo a { color: #fff !important; }
        .logo span { color: #3b82f6 !important; }
        
        /* Process Step Icon Reset */
        .step-number { border: 1px solid rgba(59,130,246,0.3) !important; }
        .timeline-line { background: rgba(59,130,246,0.2) !important; }
    </style>
</head>
"""

html = html.replace('</head>', css)

# Replace Hero section's buttons block and append the mockup & brands
hero_buttons_original = r'<div class="hero-buttons fade-up delay-3">.*?</div>'
hero_mockup = """
            <div class="hero-buttons fade-up delay-3">
                <a href="#contact" class="btn btn-primary btn-large">무료 컨설팅 신청하기 <i class="fas fa-arrow-right"></i></a>
                <a href="#services" class="btn btn-outline btn-large">서비스 자세히 보기</a>
            </div>

            <!-- Dashboard Mockup Image -->
            <div class="hero-mockup fade-up delay-4" style="margin-top: 80px; width: 100%;">
                <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1400&q=80" alt="Dashboard Mockup" style="width: 100%; max-width: 1100px; border-radius: 16px; border: 1px solid rgba(59,130,246,0.3); box-shadow: 0 30px 60px rgba(0,0,0,0.5), 0 0 40px rgba(37,99,235,0.2); object-fit: cover; aspect-ratio: 16/9; display: block; margin: 0 auto;">
            </div>

            <!-- Trusted Brands -->
            <div class="trusted-brands fade-up delay-5" style="margin-top: 100px; text-align: center; width: 100%;">
                <p style="color: #64748b; font-size: 0.9rem; margin-bottom: 24px; font-weight: 600; text-transform: uppercase;">Trusted by 10,000+ Teams Worldwide</p>
                <div class="brand-logos" style="display: flex; justify-content: center; gap: 40px; opacity: 0.6; flex-wrap: wrap; align-items: center;">
                    <span style="color: white; font-weight: bold; font-size: 1.3rem; display: flex; align-items: center; gap: 8px;"><i class="fas fa-circle-notch"></i> Logoipsum</span>
                    <span style="color: white; font-weight: bold; font-size: 1.3rem; display: flex; align-items: center; gap: 8px;"><i class="fas fa-cubes"></i> Logoipsum</span>
                    <span style="color: white; font-weight: 800; font-size: 1.4rem; display: flex; align-items: center; gap: 8px;">IPSUM</span>
                    <span style="color: white; font-weight: bold; font-size: 1.3rem; display: flex; align-items: center; gap: 8px;"><i class="fas fa-globe"></i> logoipsum</span>
                    <span style="color: white; font-weight: 900; font-size: 1.5rem; display: flex; align-items: center; gap: 8px;"><i class="fas fa-infinity"></i> LOGO</span>
                </div>
            </div>
"""

html = re.sub(hero_buttons_original, hero_mockup, html, flags=re.DOTALL)

with codecs.open("index.html", "w", "utf-8") as f:
    f.write(html)
