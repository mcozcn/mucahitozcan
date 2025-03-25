document.addEventListener('DOMContentLoaded', () => {
    // GSAP ve ScrollTrigger ile parallax efektleri
    gsap.registerPlugin(ScrollTrigger);

    // Her bölüm için katmanlı parallax ve animasyonlar
    document.querySelectorAll('.section').forEach(section => {
        // Arka plan parallax (background layer)
        const background = section.querySelector('.section-background');
        gsap.to(background, {
            scrollTrigger: {
                trigger: section,
                start: 'top top',
                end: 'bottom top',
                scrub: true
            },
            y: '30%',
            scale: 1.1,
            ease: 'none'
        });

        // Orta katman parallax (midground layer)
        const midground = section.querySelector('.midground-layer');
        if (midground) {
            gsap.to(midground, {
                scrollTrigger: {
                    trigger: section,
                    start: 'top top',
                    end: 'bottom top',
                    scrub: true
                },
                y: '15%',
                ease: 'none'
            });
        }

        // Dekoratif elemanlar (yıldızlar) için parallax
        const stars = section.querySelectorAll('.star');
        stars.forEach((star, index) => {
            gsap.to(star, {
                scrollTrigger: {
                    trigger: section,
                    start: 'top top',
                    end: 'bottom top',
                    scrub: true
                },
                y: `${(index + 1) * 20}%`,
                ease: 'none'
            });
        });

        // Başlık animasyonları (panel-content içindeki h1, h2, p)
        // Hero bölümü hariç diğer bölümler için animasyon
        if (section.id !== 'home') {
            gsap.from(section.querySelectorAll('.panel-content h1, .panel-content h2, .panel-content p'), {
                scrollTrigger: {
                    trigger: section,
                    start: 'top 80%',
                    end: 'bottom 20%',
                    toggleActions: 'play none none reverse'
                },
                opacity: 0,
                y: 50,
                duration: 1,
                stagger: 0.3,
                ease: 'power3.out',
                onStart: () => {
                    // Animasyon başlamadan önce görünür yap
                    section.querySelectorAll('.panel-content h1, .panel-content h2, .panel-content p').forEach(el => {
                        el.style.opacity = '1';
                    });
                }
            });
        }
    });

    // Yan Navigasyon Çubuğu - Aktif Bölüm Vurgusu
    const sections = document.querySelectorAll('.section');
    const navDots = document.querySelectorAll('.nav-dot');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navDots.forEach(dot => dot.classList.remove('active'));
                const sectionId = entry.target.getAttribute('id');
                const activeDot = document.querySelector(`.nav-dot[data-section="${sectionId}"]`);
                if (activeDot) {
                    activeDot.classList.add('active');
                }
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });

    // Dil Değiştirme İşlevselliği
    const langButtons = document.querySelectorAll('.lang-btn');
    const elementsToTranslate = document.querySelectorAll('[data-tr][data-en]');
    const inputsToTranslate = document.querySelectorAll('[data-tr-placeholder][data-en-placeholder]');

    const setLanguage = (lang) => {
        elementsToTranslate.forEach(element => {
            const text = element.getAttribute(`data-${lang}`);
            if (text) {
                element.textContent = text;
            } else {
                console.warn(`Missing translation for ${lang} in element:`, element);
            }
        });

        inputsToTranslate.forEach(input => {
            const placeholder = input.getAttribute(`data-${lang}-placeholder`);
            if (placeholder) {
                input.setAttribute('placeholder', placeholder);
            } else {
                console.warn(`Missing placeholder translation for ${lang} in input:`, input);
            }
        });

        document.documentElement.lang = lang;

        const title = document.querySelector('title');
        const titleText = title.getAttribute(`data-${lang}`);
        if (titleText) {
            title.textContent = titleText;
        }

        langButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-lang') === lang) {
                btn.classList.add('active');
            }
        });

        localStorage.setItem('language', lang);
    };

    const savedLang = localStorage.getItem('language') || 'tr';
    setLanguage(savedLang);

    langButtons.forEach(button => {
        button.addEventListener('click', () => {
            const lang = button.getAttribute('data-lang');
            setLanguage(lang);
        });
    });

    // Sayfadaki tüm metinlerin görünür olduğundan emin ol
    document.querySelectorAll('h1, h2, h3, p, li, span, button, input, textarea').forEach(el => {
        if (!el.style.opacity || el.style.opacity === '0') {
            el.style.opacity = '1';
        }
    });
});