/* ===================================
   Portfolio Web - Script.js
   Premium 3D Interactive Portfolio
   =================================== */

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
    initHeroReveal();
    initParticles();
    initNavbar();
    initScrollReveal();
    initProfileCard3D();
    initTiltCards();
    initCounterAnimation();
    initSmoothScroll();
    initContactForm();
    initDraggableIDCard();
    initPortfolioTabs();
    initHeroStatCardLinks();
    initProjectModal();
    initCertLightbox();
});

/* ===================================
   Hero Reveal
   (previously gated behind the loading screen; now runs
   right away so the hero content animates in on load)
   =================================== */
function initHeroReveal() {
    setTimeout(() => {
        document.querySelectorAll('.hero .animate-reveal').forEach(el => {
            el.classList.add('revealed');
        });
    }, 200);
}

/* ===================================
   Particle System
   =================================== */
function initParticles() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let particles = [];
    let mousePos = { x: 0, y: 0 };
    let animationId;
    
    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    resize();
    window.addEventListener('resize', resize);
    
    document.addEventListener('mousemove', (e) => {
        mousePos.x = e.clientX;
        mousePos.y = e.clientY;
    });
    
    class Particle {
        constructor() {
            this.reset();
        }
        
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.4;
            this.speedY = (Math.random() - 0.5) * 0.4;
            this.opacity = Math.random() * 0.5 + 0.1;
            this.hue = Math.random() * 40 + 195; // Blue-cyan/steel range
        }
        
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            
            // Mouse interaction - gentle repulsion
            const dx = mousePos.x - this.x;
            const dy = mousePos.y - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < 120) {
                const force = (120 - dist) / 120;
                this.x -= dx * force * 0.02;
                this.y -= dy * force * 0.02;
            }
            
            // Wrap around screen
            if (this.x < 0) this.x = canvas.width;
            if (this.x > canvas.width) this.x = 0;
            if (this.y < 0) this.y = canvas.height;
            if (this.y > canvas.height) this.y = 0;
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${this.hue}, 70%, 70%, ${this.opacity})`;
            ctx.fill();
        }
    }
    
    // Create particles
    const particleCount = Math.min(80, Math.floor(window.innerWidth * window.innerHeight / 15000));
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
    
    function drawConnections() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist < 150) {
                    const opacity = (1 - dist / 150) * 0.15;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(37, 99, 235, ${opacity})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        
        drawConnections();
        animationId = requestAnimationFrame(animate);
    }
    
    animate();
}

/* ===================================
   Navigation
   =================================== */
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('nav-toggle');
    const navLinks = document.getElementById('nav-links');
    const links = document.querySelectorAll('.nav-link');
    
    // Scroll effect
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;
        
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
        
        // Update active nav link based on scroll position
        updateActiveNavLink();
    });
    
    // Mobile toggle
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navLinks.classList.toggle('open');
        });
    }
    
    // Close mobile nav on link click
    links.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navLinks.classList.remove('open');
        });
    });
    
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 200;
        
        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');
            
            if (scrollPos >= top && scrollPos < top + height) {
                links.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('data-section') === id) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
}

/* ===================================
   Scroll Reveal Animations
   =================================== */
function initScrollReveal() {
    const reveals = document.querySelectorAll('.animate-reveal:not(.hero .animate-reveal)');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    reveals.forEach(el => observer.observe(el));
}

/* ===================================
   Interactive Profile Card 3D Effect
   =================================== */
function initProfileCard3D() {
    const wrapper = document.getElementById('profile-card-wrapper');
    const card = document.getElementById('profile-card');
    const spotlight = document.getElementById('profile-spotlight');
    if (!wrapper || !card) return;
    
    const heroSection = document.getElementById('hero');
    let currentRotateX = 0, currentRotateY = 0;
    let targetRotateX = 0, targetRotateY = 0;
    let isHovering = false;
    
    // Mouse move on hero section for 3D tilt
    heroSection.addEventListener('mousemove', (e) => {
        const rect = wrapper.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        // Calculate rotation based on cursor distance from card center
        targetRotateY = ((e.clientX - centerX) / (window.innerWidth / 2)) * 12;
        targetRotateX = -((e.clientY - centerY) / (window.innerHeight / 2)) * 12;
        
        // Clamp values
        targetRotateX = Math.max(-12, Math.min(12, targetRotateX));
        targetRotateY = Math.max(-12, Math.min(12, targetRotateY));
        
        // Update spotlight position
        if (spotlight) {
            const cardRect = card.getBoundingClientRect();
            const spotX = ((e.clientX - cardRect.left) / cardRect.width) * 100;
            const spotY = ((e.clientY - cardRect.top) / cardRect.height) * 100;
            card.style.setProperty('--spotlight-x', spotX + '%');
            card.style.setProperty('--spotlight-y', spotY + '%');
        }
    });
    
    heroSection.addEventListener('mouseleave', () => {
        targetRotateX = 0;
        targetRotateY = 0;
    });
    
    // Hover detection for scale effect
    card.addEventListener('mouseenter', () => { isHovering = true; });
    card.addEventListener('mouseleave', () => { isHovering = false; });
    
    function animate() {
        // Smooth interpolation
        currentRotateX += (targetRotateX - currentRotateX) * 0.08;
        currentRotateY += (targetRotateY - currentRotateY) * 0.08;
        
        const scale = isHovering ? 1.03 : 1;
        
        card.style.transform = `rotateX(${currentRotateX}deg) rotateY(${currentRotateY}deg) scale(${scale})`;
        
        requestAnimationFrame(animate);
    }
    
    animate();
}

/* ===================================
   3D Tilt Effect for Cards
   =================================== */
function initTiltCards() {
    const tiltElements = document.querySelectorAll('[data-tilt]');
    
    tiltElements.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -8;
            const rotateY = ((x - centerX) / centerX) * 8;
            
            el.style.transform = `
                perspective(800px)
                rotateX(${rotateX}deg)
                rotateY(${rotateY}deg)
                translateZ(10px)
                scale(1.02)
            `;
        });
        
        el.addEventListener('mouseleave', () => {
            el.style.transform = '';
            el.style.transition = 'transform 0.5s ease';
            setTimeout(() => {
                el.style.transition = '';
            }, 500);
        });
        
        el.addEventListener('mouseenter', () => {
            el.style.transition = 'none';
        });
    });
}

/* ===================================
   Counter Animation
   =================================== */
function initCounterAnimation() {
    const counters = document.querySelectorAll('.stat-number');
    let animated = false;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !animated) {
                animated = true;
                counters.forEach(counter => {
                    const target = parseInt(counter.getAttribute('data-target'));
                    const duration = 2000;
                    const start = performance.now();
                    
                    function update(currentTime) {
                        const elapsed = currentTime - start;
                        const progress = Math.min(elapsed / duration, 1);
                        
                        // Easing function
                        const eased = 1 - Math.pow(1 - progress, 3);
                        const current = Math.floor(eased * target);
                        
                        counter.textContent = current;
                        
                        if (progress < 1) {
                            requestAnimationFrame(update);
                        } else {
                            counter.textContent = target;
                        }
                    }
                    
                    requestAnimationFrame(update);
                });
            }
        });
    }, { threshold: 0.5 });
    
    const statsContainer = document.querySelector('.hero-stats-cards');
    if (statsContainer) {
        observer.observe(statsContainer);
    }
}

/* ===================================
   Portfolio Showcase Tabs
   =================================== */
function initPortfolioTabs() {
    const tabs = document.querySelectorAll('.portfolio-tab');
    const panels = document.querySelectorAll('.portfolio-panel');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.getAttribute('data-tab');

            tabs.forEach(t => {
                t.classList.remove('active');
                t.setAttribute('aria-selected', 'false');
            });
            tab.classList.add('active');
            tab.setAttribute('aria-selected', 'true');

            panels.forEach(panel => {
                if (panel.id === `panel-${target}`) {
                    panel.classList.add('active');
                    panel.removeAttribute('hidden');
                } else {
                    panel.classList.remove('active');
                    panel.setAttribute('hidden', '');
                }
            });
        });
    });
}

/* ===================================
   Hero Stat Cards -> Portfolio Tab Link
   =================================== */
function initHeroStatCardLinks() {
    const cards = document.querySelectorAll('.hero-stat-card[data-portfolio-tab]');
    cards.forEach(card => {
        card.addEventListener('click', (e) => {
            const tabName = card.getAttribute('data-portfolio-tab');
            const tabBtn = document.getElementById(`tab-btn-${tabName}`);
            if (tabBtn) {
                setTimeout(() => tabBtn.click(), 400);
            }
        });
    });
}

/* ===================================
   Project Detail Modal
   =================================== */
const projectDetails = {
    'sales-performance': {
        eyebrow: 'Excel · Google Looker Studio',
        title: 'E-Commerce Sales & Profitability Dashboard',
        image: 'assets/projects/sales-performance.jpg',
        description: 'Dashboard business intelligence interaktif untuk menganalisis performa penjualan, profitabilitas, segmen pelanggan, produk, dan performa regional sebuah e-commerce sepanjang periode Januari–Desember 2025. Data disiapkan dan dibersihkan di Excel, kemudian divisualisasikan secara interaktif di Google Looker Studio.',
        stats: [
            { value: '82,9 M', label: 'Total Revenue' },
            { value: '23,6 M', label: 'Total Profit' },
            { value: '28,5%', label: 'Profit Margin' },
            { value: '1,1 rb', label: 'Total Customer' }
        ],
        features: [
            'Melacak 6 KPI utama: total revenue, profit, order, customer, average order value, dan profit margin',
            'Filter interaktif berdasarkan region, provinsi, kategori, sub kategori, produk, dan tingkat loyalitas',
            'Segmen Consumer menyumbang 48,4% dari total pendapatan, jadi kontributor terbesar',
            'Jawa Barat mencatat penjualan tertinggi dibanding provinsi lain'
        ],
        tags: ['Microsoft Excel', 'Google Looker Studio', 'Data Cleaning', 'KPI Development'],
        github: 'https://github.com/RizalIndriawan/Salas-Perfomance/tree/main'
    },
    'kopi-tuku': {
        eyebrow: 'Python · Pandas · Looker Studio',
        title: 'Kopi Tuku Campaign Performance',
        image: 'assets/projects/kopi-tuku.jpg',
        description: 'Analisis performa campaign marketing Kopi Tuku sepanjang Januari–Desember 2025, mencakup proses data cleaning, exploratory data analysis, perhitungan KPI bisnis, hingga pembuatan dashboard interaktif untuk mengevaluasi efektivitas channel marketing dan ROAS.',
        stats: [
            { value: 'Rp184,3 Jt', label: 'Net Revenue' },
            { value: '3.868', label: 'Total Transaksi' },
            { value: '55,11%', label: 'Profit Margin' },
            { value: '0,35', label: 'ROAS' }
        ],
        features: [
            'Membersihkan 6.100 baris data mentah (duplikat, record tidak valid, missing values) menjadi 4.064 baris data siap analisis',
            'Menghitung metrik turunan seperti Net Revenue, ROAS, CTR, Conversion Rate, dan AOV',
            'Returning Customer menyumbang 44,4% dari total revenue, menunjukkan loyalitas pelanggan yang kuat',
            'Facebook menghasilkan profit tertinggi, sementara Instagram dan kanal Offline lebih efisien dari sisi ROAS'
        ],
        tags: ['Python (Pandas)', 'Excel', 'Google Looker Studio', 'Data Cleaning'],
        github: 'https://github.com/RizalIndriawan/kopi-tuku-campaign-performance'
    },
    'pizza-sales': {
        eyebrow: 'Excel · Power Query',
        title: 'Pizza Sales Performance',
        image: 'assets/projects/pizza-sales.jpg',
        description: 'Dashboard performa penjualan pizza untuk melacak tren pesanan bulanan, kategori produk terlaris, dan kontribusi pendapatan per ukuran dan kategori pizza, digunakan untuk mendukung keputusan operasional dan menu.',
        stats: [
            { value: '$817.860', label: 'Total Pendapatan' },
            { value: '21.350', label: 'Total Pesanan' },
            { value: '$38,31', label: 'Rata-rata Nilai Pesanan' }
        ],
        features: [
            'Kategori Classic menyumbang 30% dari total pesanan, kategori dengan kontribusi tertinggi',
            'The Classic Deluxe Pizza menjadi menu dengan jumlah pesanan terbanyak (2.453 pesanan)',
            'Tren penjualan bulanan menunjukkan puncak pesanan pada bulan Juli',
            'Breakdown pendapatan per ukuran (S/M/L/XL/XXL) untuk tiap kategori pizza'
        ],
        tags: ['Microsoft Excel', 'Power Query', 'Dashboard Design'],
        github: 'https://github.com/RizalIndriawan/Pizza-Sales-Performance/tree/main'
    },
    'news-clustering': {
        eyebrow: 'Python · NLP',
        title: 'Pemodelan & Klasterisasi Topik Berita',
        images: [
            'assets/projects/news-clustering-1.png',
            'assets/projects/news-clustering-2.png',
            'assets/projects/news-clustering-3.png',
            'assets/projects/news-clustering-4.png',
            'assets/projects/news-clustering-5.png',
            'assets/projects/news-clustering-6.png',
            'assets/projects/news-clustering-7.png',
            'assets/projects/news-clustering-8.png'
        ],
        description: 'Proyek pemodelan topik dan klasterisasi artikel berita seputar KEMENHAM menggunakan pendekatan Natural Language Processing untuk mengelompokkan berita ke dalam klaster berdasarkan kemiripan topik, membantu meringkas pola pemberitaan dalam jumlah artikel yang besar. Dibangun sebagai dashboard interaktif berbasis Django dengan fitur konfigurasi parameter clustering, evaluasi kualitas (Elbow Method, Silhouette Score, Similarity Matrix), visualisasi cluster, serta modul manual labeling untuk validasi hasil.',
        stats: [
            { value: '1.262', label: 'Artikel Berita' },
            { value: '3', label: 'Cluster Topik' },
            { value: '0.750', label: 'Purity Score' }
        ],
        features: [
            'Text preprocessing meliputi cleaning, tokenizing, dan stopword removal pada teks berita',
            'Ekstraksi fitur teks menggunakan TF-IDF dan pengelompokan artikel dengan algoritma K-Means Clustering',
            'Penentuan jumlah cluster optimal secara otomatis menggunakan Elbow Method dan Silhouette Analysis',
            'Dashboard visualisasi interaktif (scatter plot PCA, similarity matrix, distribusi cluster) beserta modul manual labeling untuk validasi hasil',
            'Lihat kode lengkap dan detail metodologi di repository GitHub'
        ],
        tags: ['Python', 'NLP', 'Topic Modeling', 'Clustering'],
        github: 'https://github.com/RizalIndriawan/Pemodelan-Klasterisasi-Topik-Berita-KEMENHAM'
    }
};

function initProjectModal() {
    const modal = document.getElementById('project-modal');
    const modalContent = document.getElementById('project-modal-content');
    const closeBtn = document.getElementById('project-modal-close');
    if (!modal || !modalContent) return;

    document.querySelectorAll('.project-btn-details').forEach(btn => {
        btn.addEventListener('click', () => {
            const key = btn.getAttribute('data-project');
            const data = projectDetails[key];
            if (!data) return;

            const statsHtml = data.stats.length ? `
                <div class="detail-stats">
                    ${data.stats.map(s => `
                        <div class="detail-stat">
                            <strong>${s.value}</strong>
                            <span>${s.label}</span>
                        </div>
                    `).join('')}
                </div>
            ` : '';

            const imageHtml = data.images && data.images.length ? `
                <div class="detail-gallery">
                    <div class="detail-image">
                        <img id="detail-gallery-main" src="${data.images[0]}" alt="${data.title}">
                    </div>
                    ${data.images.length > 1 ? `
                        <div class="detail-gallery-thumbs">
                            ${data.images.map((img, i) => `
                                <button type="button" class="detail-gallery-thumb${i === 0 ? ' active' : ''}" data-img="${img}">
                                    <img src="${img}" alt="${data.title} screenshot ${i + 1}">
                                </button>
                            `).join('')}
                        </div>
                    ` : ''}
                </div>
            ` : data.image ? `
                <div class="detail-image"><img src="${data.image}" alt="${data.title}"></div>
            ` : '';

            modalContent.innerHTML = `
                ${imageHtml}
                <span class="detail-eyebrow">${data.eyebrow}</span>
                <h3 class="detail-title">${data.title}</h3>
                <p class="detail-description">${data.description}</p>
                ${statsHtml}
                <div class="detail-features">
                    <h4>Key Highlights</h4>
                    <ul>${data.features.map(f => `<li>${f}</li>`).join('')}</ul>
                </div>
                <div class="detail-tags-wrap">
                    <h4>Technologies Used</h4>
                    <div class="detail-tags">${data.tags.map(t => `<span class="project-tag">${t}</span>`).join('')}</div>
                </div>
                <div class="detail-actions">
                    <a href="${data.github}" target="_blank" rel="noopener" class="btn btn-primary">
                        <span>View on GitHub</span>
                        <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
                    </a>
                </div>
            `;

            modal.classList.add('open');
            document.body.style.overflow = 'hidden';

            const mainImg = document.getElementById('detail-gallery-main');
            const thumbs = modalContent.querySelectorAll('.detail-gallery-thumb');
            thumbs.forEach(thumb => {
                thumb.addEventListener('click', () => {
                    if (!mainImg) return;
                    mainImg.src = thumb.getAttribute('data-img');
                    thumbs.forEach(t => t.classList.remove('active'));
                    thumb.classList.add('active');
                });
            });
        });
    });

    function closeModal() {
        modal.classList.remove('open');
        document.body.style.overflow = '';
    }

    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });
}

/* ===================================
   Certificate Lightbox
   =================================== */
function initCertLightbox() {
    const modal = document.getElementById('cert-modal');
    const img = document.getElementById('cert-modal-img');
    const caption = document.getElementById('cert-modal-caption');
    const closeBtn = document.getElementById('cert-modal-close');
    if (!modal || !img) return;

    document.querySelectorAll('.cert-card').forEach(card => {
        card.addEventListener('click', () => {
            const srcImg = card.querySelector('.cert-image img');
            const title = card.querySelector('.cert-title');
            const issuer = card.querySelector('.cert-issuer');
            const date = card.querySelector('.cert-date');

            img.src = srcImg.src;
            img.alt = srcImg.alt;
            caption.textContent = `${issuer.textContent} — ${title.textContent} (${date.textContent})`;

            modal.classList.add('open');
            document.body.style.overflow = 'hidden';
        });
    });

    function closeModal() {
        modal.classList.remove('open');
        document.body.style.overflow = '';
    }

    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });
}

/* ===================================
   Smooth Scroll
   =================================== */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);
            
            if (target) {
                const offsetTop = target.offsetTop - 80;
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* ===================================
   Contact Form
   =================================== */
function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    const CONTACT_EMAIL = 'jallindr96@gmail.com';

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const submitBtn = document.getElementById('form-submit');
        const originalText = submitBtn.innerHTML;

        const name = document.getElementById('form-name').value.trim();
        const email = document.getElementById('form-email').value.trim();
        const subjectField = document.getElementById('form-subject').value.trim();
        const message = document.getElementById('form-message').value.trim();

        const subject = subjectField || `Portfolio inquiry from ${name}`;
        const body = `Name: ${name}\nEmail: ${email}\n\n${message}`;

        // Button loading state
        submitBtn.innerHTML = `
            <span style="display: flex; align-items: center; gap: 8px;">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation: loader-spin 1s linear infinite;">
                    <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                </svg>
                Opening email...
            </span>
        `;
        submitBtn.disabled = true;

        // No backend on a static site, so we hand off to the visitor's own
        // email client with everything pre-filled. This is what actually
        // gets the message delivered.
        setTimeout(() => {
            const mailtoUrl = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
            window.location.href = mailtoUrl;

            submitBtn.innerHTML = `
                <span style="display: flex; align-items: center; gap: 8px;">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    Email Client Opened
                </span>
            `;
            submitBtn.style.background = 'linear-gradient(135deg, #10b981, #059669)';

            setTimeout(() => {
                form.reset();
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                submitBtn.style.background = '';
            }, 3000);
        }, 500);
    });
}

/* ===================================
   Draggable ID Card (About Section)
   =================================== */
function initDraggableIDCard() {
    const card = document.getElementById('id-card');
    const container = document.getElementById('id-card-container');
    const area = document.querySelector('.about-card-area');
    const strapPath = document.getElementById('id-card-strap-path');
    const strapEdgeL = document.getElementById('id-card-strap-edge-l');
    const strapEdgeR = document.getElementById('id-card-strap-edge-r');
    const strapTextPath = document.getElementById('id-card-strap-textpath');
    if (!card || !container) return;

    // Update the lanyard/strap so it visually connects the top of the About
    // card area to the ID card, following it wherever it's dragged. Drawn as
    // a wide fabric ribbon (matching the reference "3D CARD" tag) with the
    // label repeating along its length and two faint stitched edges.
    function updateStrap() {
        if (!area || !strapPath) return;

        const areaRect = area.getBoundingClientRect();
        const cardRect = card.getBoundingClientRect();

        const x1 = areaRect.width / 2;
        const y1 = 0;
        const x2 = cardRect.left + cardRect.width / 2 - areaRect.left;
        const y2 = cardRect.top + 10 - areaRect.top; // attaches near the card's hole

        const d = `M ${x1} ${y1} L ${x2} ${y2}`;
        strapPath.setAttribute('d', d);

        // Thin highlight edges offset slightly to either side, giving the
        // ribbon a stitched/woven look instead of a flat fill
        const dx = x2 - x1;
        const dy = y2 - y1;
        const len = Math.hypot(dx, dy) || 1;
        const nx = (-dy / len) * 13; // perpendicular offset ~ half strap width
        const ny = (dx / len) * 13;
        if (strapEdgeL) {
            strapEdgeL.setAttribute('d', `M ${x1 + nx} ${y1 + ny} L ${x2 + nx} ${y2 + ny}`);
        }
        if (strapEdgeR) {
            strapEdgeR.setAttribute('d', `M ${x1 - nx} ${y1 - ny} L ${x2 - nx} ${y2 - ny}`);
        }

        // Repeat the "3D CARD" label along the current strap length so it
        // always fills the ribbon, however long it is dragged out
        if (strapTextPath) {
            const pathLength = strapPath.getTotalLength ? strapPath.getTotalLength() : len;
            const unit = '3D CARD   ';
            const unitWidthEstimate = 92; // approx px per repeated unit at current font/letter-spacing
            const repeats = Math.max(2, Math.ceil(pathLength / unitWidthEstimate) + 1);
            strapTextPath.textContent = unit.repeat(repeats);
        }
    }

    // Keep the strap correctly positioned on load and on resize/reflow
    updateStrap();
    window.addEventListener('resize', updateStrap);
    window.addEventListener('load', updateStrap);
    setTimeout(updateStrap, 300); // after reveal animations settle

    // The About section fades/slides in via .animate-reveal; keep the strap
    // glued to the card while that transition plays out.
    if (area) {
        const revealObserver = new MutationObserver(() => {
            if (area.classList.contains('revealed')) {
                const start = performance.now();
                function syncDuringReveal(t) {
                    updateStrap();
                    if (t - start < 900) requestAnimationFrame(syncDuringReveal);
                }
                requestAnimationFrame(syncDuringReveal);
            }
        });
        revealObserver.observe(area, { attributes: true, attributeFilter: ['class'] });
    }
    
    let isDragging = false;
    let startX, startY;
    let currentX = 0, currentY = 0;
    let velocityX = 0, velocityY = 0;
    let lastX, lastY, lastTime;
    let animationFrame;
    
    function onStart(e) {
        isDragging = true;
        card.classList.add('dragging');
        
        const point = e.touches ? e.touches[0] : e;
        startX = point.clientX - currentX;
        startY = point.clientY - currentY;
        lastX = point.clientX;
        lastY = point.clientY;
        lastTime = Date.now();
        velocityX = 0;
        velocityY = 0;
        
        if (animationFrame) cancelAnimationFrame(animationFrame);
        
        e.preventDefault();
    }
    
    function onMove(e) {
        if (!isDragging) return;
        
        const point = e.touches ? e.touches[0] : e;
        const now = Date.now();
        const dt = Math.max(now - lastTime, 1);
        
        currentX = point.clientX - startX;
        currentY = point.clientY - startY;
        
        // Calculate velocity for physics
        velocityX = (point.clientX - lastX) / dt * 16;
        velocityY = (point.clientY - lastY) / dt * 16;
        
        lastX = point.clientX;
        lastY = point.clientY;
        lastTime = now;
        
        // Rotation based on drag velocity (subtle)
        const rotateY = Math.max(-15, Math.min(15, velocityX * 2));
        const rotateX = Math.max(-15, Math.min(15, -velocityY * 2));
        
        // Dynamic shadow based on position
        const shadowX = -currentX * 0.05;
        const shadowY = Math.max(8, 20 + currentY * 0.1);
        
        card.style.transform = `translate(${currentX}px, ${currentY}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        card.style.boxShadow = `${shadowX}px ${shadowY}px 60px rgba(0,0,0,0.5), 0 0 30px rgba(37,99,235,0.1)`;
        
        updateStrap();
        
        e.preventDefault();
    }
    
    function onEnd() {
        if (!isDragging) return;
        isDragging = false;
        card.classList.remove('dragging');
        
        // Inertia + spring-back animation
        function inertia() {
            // Friction
            velocityX *= 0.92;
            velocityY *= 0.92;
            
            // Spring force toward origin
            const springForce = 0.04;
            velocityX += (0 - currentX) * springForce;
            velocityY += (0 - currentY) * springForce;
            
            // Update position
            currentX += velocityX;
            currentY += velocityY;
            
            // Rotation diminishes with velocity
            const rotateY = Math.max(-15, Math.min(15, velocityX * 1.5));
            const rotateX = Math.max(-15, Math.min(15, -velocityY * 1.5));
            
            const dist = Math.sqrt(currentX * currentX + currentY * currentY);
            const speed = Math.sqrt(velocityX * velocityX + velocityY * velocityY);
            
            // Dynamic shadow follows position
            const shadowIntensity = Math.min(1, dist / 100);
            card.style.transform = `translate(${currentX}px, ${currentY}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            card.style.boxShadow = `0 ${8 + shadowIntensity * 12}px ${32 + shadowIntensity * 28}px rgba(0,0,0,${0.4 + shadowIntensity * 0.2}), 0 0 ${15 + shadowIntensity * 15}px rgba(37,99,235,${0.06 + shadowIntensity * 0.06})`;
            
            updateStrap();
            
            if (dist > 0.5 || speed > 0.5) {
                animationFrame = requestAnimationFrame(inertia);
            } else {
                // Snap back to origin
                currentX = 0;
                currentY = 0;
                card.style.transform = '';
                card.style.boxShadow = '';
                updateStrap();
            }
        }
        
        animationFrame = requestAnimationFrame(inertia);
    }
    
    // Mouse events
    card.addEventListener('mousedown', onStart);
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onEnd);
    
    // Touch events for mobile
    card.addEventListener('touchstart', onStart, { passive: false });
    document.addEventListener('touchmove', onMove, { passive: false });
    document.addEventListener('touchend', onEnd);
}

/* ===================================
   Parallax Effect on Scroll
   =================================== */
// Simplified to avoid conflicts with 3D card transforms

/* ===================================
   Magnetic Button Effect
   =================================== */
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
    });
    
    btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
        btn.style.transition = 'transform 0.3s ease';
        setTimeout(() => btn.style.transition = '', 300);
    });
});

/* ===================================
   Page Visibility - Pause Animations
   =================================== */
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        document.body.style.animationPlayState = 'paused';
    } else {
        document.body.style.animationPlayState = 'running';
    }
});
