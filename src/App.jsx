import React, { useEffect, useState, useRef } from 'react';

const SectionDivider = ({ fill }) => (
  <div className="section-divider">
    <svg viewBox="0 0 1440 120" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="wave-fg">
      <path d="M0,60 C80,-20 160,140 240,60 C320,-20 400,140 480,50 C560,-30 640,130 720,50 C800,-30 880,130 960,60 C1040,-20 1120,140 1200,60 C1280,-20 1360,120 1440,50 L1440,120 L0,120 Z" fill={fill} />
    </svg>
  </div>
);

function App() {
  const canvasRef = useRef(null);
  const heroRef = useRef(null);
  const totalFrames = 247;
  const imagesRef = useRef([]);
  const [framesLoaded, setFramesLoaded] = useState(0);
  const [sweetBitesRotation, setSweetBitesRotation] = useState(0);
  const nextSweetBite = () => setSweetBitesRotation(prev => prev + 1);
  const prevSweetBite = () => setSweetBitesRotation(prev => prev - 1);

  const [sweetWorldRotation, setSweetWorldRotation] = useState(0);
  const nextSweetWorld = () => setSweetWorldRotation(prev => prev + 1);
  const prevSweetWorld = () => setSweetWorldRotation(prev => prev - 1);

  const [cookieWorldRotation, setCookieWorldRotation] = useState(0);
  const nextCookieWorld = () => setCookieWorldRotation(prev => prev + 1);
  const prevCookieWorld = () => setCookieWorldRotation(prev => prev - 1);

  // Preload frames for hero section
  useEffect(() => {
    let loaded = 0;
    for (let i = 1; i <= totalFrames; i++) {
      const img = new Image();
      const frameNum = i.toString().padStart(3, '0');
      img.src = `./herosection/ezgif-frame-${frameNum}.jpg`;
      img.onload = () => {
        loaded++;
        if (loaded === 1 || loaded === totalFrames) {
          setFramesLoaded(loaded);
        }
      };
      imagesRef.current[i] = img;
    }
  }, []);

  // Handle scroll animation for Hero
  useEffect(() => {
    let animationFrameId;
    
    const drawFrame = () => {
      if (!heroRef.current || !canvasRef.current || imagesRef.current.length === 0) return;
      
      const rect = heroRef.current.getBoundingClientRect();
      const maxScroll = heroRef.current.offsetHeight - window.innerHeight;
      
      let scrollProgress = -rect.top / maxScroll;
      if (scrollProgress < 0) scrollProgress = 0;
      if (scrollProgress > 1) scrollProgress = 1;

      const frameIndex = Math.min(
        totalFrames,
        Math.max(1, Math.floor(scrollProgress * totalFrames) + 1)
      );

      const img = imagesRef.current[frameIndex];
      if (img && img.complete) {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const cw = canvas.width;
        const ch = canvas.height;
        
        // Use the first frame's dimensions to guarantee consistency and prevent jitter
        const baseImg = imagesRef.current[1];
        const iw = (baseImg && baseImg.width) ? baseImg.width : img.width;
        const ih = (baseImg && baseImg.height) ? baseImg.height : img.height;
        
        // drawImage cover style
        const hRatio = cw / iw;
        const vRatio = ch / ih;
        const ratio = Math.max(hRatio, vRatio);
        const centerShift_x = (cw - iw * ratio) / 2;
        const centerShift_y = (ch - ih * ratio) / 2;
        
        ctx.clearRect(0, 0, cw, ch);
        ctx.drawImage(img, 0, 0, img.width, img.height, centerShift_x, centerShift_y, iw * ratio, ih * ratio);
      }
    };

    const handleScroll = () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(drawFrame);
    };

    const handleResize = () => {
      if (canvasRef.current) {
        const canvas = canvasRef.current;
        const dpr = window.devicePixelRatio || 1;
        canvas.width = window.innerWidth * dpr;
        canvas.height = window.innerHeight * dpr;
        canvas.style.width = `${window.innerWidth}px`;
        canvas.style.height = `${window.innerHeight}px`;
        drawFrame();
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);
    handleResize(); // initial setup

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [framesLoaded]);
  // Simple scroll animation logic
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (entry.target.classList.contains('animate-on-scroll')) {
            entry.target.classList.add('fade-in');
          }
          if (entry.target.classList.contains('animate-slide-left') || entry.target.classList.contains('animate-slide-right')) {
            entry.target.classList.add('slide-visible');
          }
          if (entry.target.classList.contains('puff-card') || entry.target.classList.contains('bestsellers-item')) {
            entry.target.classList.add('visible');
          }
          if (entry.target.classList.contains('atelier-card')) {
            entry.target.classList.add('visible');
          }
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.animate-on-scroll, .animate-slide-left, .animate-slide-right, .puff-card, .atelier-card, .bestsellers-item').forEach(el => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const cakeShowcaseItems = [
    {
      id: 1,
      img: "./images/c1.png",
      name: "Chocolate Cake 🍫",
      desc: "Rich, velvety chocolate layers, freshly baked with love and topped with silky ganache 🤎"
    },
    {
      id: 2,
      img: "./images/c2.png",
      name: "Strawberry Cake 🍓",
      desc: "Light, fluffy layers infused with fresh strawberries and a dreamy berry sweetness 💗"
    },
    {
      id: 3,
      img: "./images/c3.png",
      name: "Butterscotch Cake 🍯",
      desc: "Golden caramel crunch with creamy butterscotch layers — pure indulgence in every bite ✨"
    },
    {
      id: 4,
      img: "./images/c4.png",
      name: "Black Forest Cake 🍒",
      desc: "Classic chocolate sponge layered with cherries and whipped cream — timeless and elegant ❤️"
    },
    {
      id: 5,
      img: "./images/c5.png",
      name: "Pineapple Cake 🍍",
      desc: "Soft vanilla sponge with juicy pineapple freshness — light, tropical and refreshing 🌼"
    }
  ];

  const sweetWorldItems = [
    { 
      id: 1,
      name: "Black Forest", 
      desc: "Rich chocolate layers with cherries & cream 🍒", 
      img: "./images/blackforest.jpg", 
      frameType: "frame-polaroid" 
    },
    { 
      id: 2,
      name: "Red Velvet", 
      desc: "Soft, velvety & perfectly indulgent ❤️", 
      img: "./images/redvelvet.jpg", 
      frameType: "frame-blob" 
    },
    { 
      id: 3,
      name: "Dark Chocolate", 
      desc: "Deep, intense cocoa delight 🍫", 
      img: "./images/darkchocolate.jpg", 
      frameType: "frame-scalloped" 
    },
    { 
      id: 4,
      name: "Chocolate", 
      desc: "Classic sweet chocolate goodness 🍩", 
      img: "./images/chocolate.jpg", 
      frameType: "frame-sticker" 
    },
    { 
      id: 5,
      name: "Jam Roll", 
      desc: "Soft sponge rolled with fruity love 🍓", 
      img: "./images/jamroll.jpg", 
      frameType: "frame-polaroid" 
    },
    { 
      id: 6,
      name: "Pineapple", 
      desc: "Fresh, juicy & tropical sweetness 🍍", 
      img: "./images/pineapple.jpg", 
      frameType: "frame-blob" 
    },
    { 
      id: 7,
      name: "Butterscotch", 
      desc: "Crunchy caramel bliss in every bite ✨", 
      img: "./images/butterscotch.jpg", 
      frameType: "frame-scalloped" 
    },
    { 
      id: 8,
      name: "Brownie", 
      desc: "Fudgy, gooey & irresistibly rich 🤎", 
      img: "./images/brownie.jpg", 
      frameType: "frame-sticker" 
    }
  ];

  const cookieWorldItems = [
    { 
      id: 1,
      name: "Dry Fruit Cookies", 
      desc: "Crunchy, rich & packed with nutty goodness 🌰", 
      img: "./images/dryfruit.jpg", 
      frameType: "frame-polaroid" 
    },
    { 
      id: 2,
      name: "Coconut Cookies", 
      desc: "Light, tropical & delicately sweet 🥥", 
      img: "./images/coconut.jpg", 
      frameType: "frame-scalloped" 
    },
    { 
      id: 3,
      name: "Jeera Cookies", 
      desc: "Savory, crispy & full of classic flavor ✨", 
      img: "./images/jeera.jpg", 
      frameType: "frame-sticker" 
    }
  ];

  return (
    <>
      {/* Header / Navbar */}
      <nav className="navbar fade-in">
        <div className="logo">The Bake House</div>
        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#about">About Us</a>
          <a href="#sweet-bites">Sweet Bites</a>
          <a href="#bestsellers">Bestsellers</a>
          <a href="#contact">Contact</a>
        </div>
        <div className="menu-toggle">☰</div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="hero-scroll-container" ref={heroRef}>
        <div className="hero-sticky">
          <canvas ref={canvasRef} className="hero-canvas"></canvas>
          <div className="hero-overlay"></div>
          
          <div className="hero-sparkle" style={{top: '20%', left: '30%', animationDuration: '2s'}}>✨</div>
          <div className="hero-sparkle" style={{top: '40%', right: '25%', animationDuration: '3s'}}>✨</div>
          <div className="hero-sparkle" style={{top: '60%', left: '20%', animationDuration: '2.5s'}}>✨</div>
          <div className="hero-sparkle" style={{bottom: '25%', right: '35%', animationDuration: '3.5s'}}>✨</div>
          
          <a href="#about" className="center-cloud-btn" onClick={(e) => {
            e.preventDefault();
            document.getElementById('about').scrollIntoView({ behavior: 'smooth' });
          }}>
            <svg className="center-cloud-svg" width="240" height="140" viewBox="0 0 240 140">
              <defs>
                <linearGradient id="neonBorder" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ff7ac6" />
                  <stop offset="100%" stopColor="#ffc48c" />
                </linearGradient>
                <linearGradient id="glassFill" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="rgba(255, 250, 252, 0.85)" />
                  <stop offset="100%" stopColor="rgba(255, 235, 245, 0.65)" />
                </linearGradient>
              </defs>
              <path 
                d="M 65,120 C 30,120 15,90 35,70 C 30,45 65,30 85,50 C 95,20 155,20 165,50 C 185,30 215,45 205,70 C 225,85 210,120 175,120 Q 120,130 65,120 Z" 
                fill="url(#glassFill)" 
                stroke="url(#neonBorder)" 
                strokeWidth="2.5"
              />
            </svg>
            <span className="center-cloud-text">Take a Bite 🍰</span>
          </a>
          <SectionDivider fill="#FFF0DB" />
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="about-section">
        <div className="container about-container">
          <div className="about-left animate-slide-left">
            <div className="polaroid-frame">
              <img src={`./images/image1.jpeg?v=${Date.now()}`} alt="Bake House Storefront" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              <div className="polaroid-caption">🤍🤍🤍</div>
            </div>
          </div>
          <div className="about-right animate-slide-right">
            <h2>About Us</h2>
            <p className="about-subheading">Baked with love, crafted with passion 🎀</p>
            <p className="about-story">
              Welcome to The Bake House — your cozy little corner where every bite feels special ✨
              <br/><br/>
              From fluffy cakes and dreamy pastries to freshly baked breads, golden puffs, and irresistible cookies — we bring together everything you love under one roof 🍰🥐
              <br/><br/>
              Every treat is handcrafted with care, using the finest ingredients and a touch of magic in every layer 💕 Whether it’s a celebration, a quick snack, or just a sweet craving, we’re here to make your moments a little more delicious ✨
            </p>
          </div>
        </div>
        <SectionDivider fill="#FFFEF5" />
      </section>

      {/* Sweet Bites Section - Stacked Deck Flashcards */}
      <section id="sweet-bites" className="cake-showcase-wrapper">
        <div className="container cake-showcase-container">
          
          <div className="cake-text-col">
            <h2 className="showcase-title">Sweet Bites 🍬</h2>
            <div className="cake-text-stack">
              {cakeShowcaseItems.map((cake, idx) => {
                const activeIndex = ((sweetBitesRotation % cakeShowcaseItems.length) + cakeShowcaseItems.length) % cakeShowcaseItems.length;
                const isActive = activeIndex === idx;

                return (
                  <div 
                    key={cake.id} 
                    className="cake-text-content"
                    style={{
                      opacity: isActive ? 1 : 0,
                      transform: isActive ? 'translateY(0)' : 'translateY(20px)',
                      transition: 'all 0.6s cubic-bezier(0.65, 0, 0.35, 1)',
                      pointerEvents: isActive ? 'auto' : 'none',
                      zIndex: isActive ? 10 : 1
                    }}
                  >
                    <h3 className="cake-item-title">{cake.name}</h3>
                    <p className="cake-item-desc">{cake.desc}</p>
                  </div>
                );
              })}
            </div>
            <div className="cake-nav-arrows">
              <button onClick={prevSweetBite} className="cake-arrow left-arrow">←</button>
              <button onClick={nextSweetBite} className="cake-arrow right-arrow">→</button>
            </div>
          </div>

          <div className="cake-deck-col">
            <div className="deck-container">
              {cakeShowcaseItems.map((cake, idx) => {
                const activeIndex = ((sweetBitesRotation % cakeShowcaseItems.length) + cakeShowcaseItems.length) % cakeShowcaseItems.length;
                // Determine position in the 5-card cycle
                const pos = (idx - activeIndex + 5) % 5;
                
                let translateX = "-50%";
                let translateY = "-50%";
                let rotateZ = 0;
                let scale = 1;
                let opacity = 1;
                let blur = 0;
                let zIndex = 5 - pos;

                if (pos === 0) {
                  translateX = "-50%";
                  rotateZ = 0;
                } else if (pos === 1) {
                  translateX = "calc(-50% + 20px)";
                  translateY = "calc(-50% + 15px)";
                  rotateZ = 3;
                  scale = 0.95;
                  blur = 2;
                  opacity = 0.8;
                } else if (pos === 2) {
                  translateX = "calc(-50% + 40px)";
                  translateY = "calc(-50% + 30px)";
                  rotateZ = 6;
                  scale = 0.9;
                  blur = 4;
                  opacity = 0.6;
                } else if (pos === 3) {
                  translateX = "calc(-50% + 60px)";
                  translateY = "calc(-50% + 45px)";
                  rotateZ = 9;
                  scale = 0.85;
                  blur = 6;
                  opacity = 0.4;
                } else if (pos === 4) {
                  translateX = "calc(-50% - 100px)"; 
                  translateY = "calc(-50% + 20px)";
                  rotateZ = -8;
                  scale = 0.95;
                  blur = 4;
                  opacity = 0; 
                }

                return (
                  <div 
                    key={cake.id}
                    className="deck-card"
                    style={{
                      transform: `translate(${translateX}, ${translateY}) scale(${scale}) rotateZ(${rotateZ}deg)`,
                      zIndex: zIndex,
                      opacity: opacity,
                      filter: `blur(${blur}px)`
                    }}
                  >
                    <img src={cake.img} alt={cake.name} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="sweet-bites-btn-container">
          <a href="#showcase" className="sweet-bites-cloud-btn">
            <svg className="sweet-bites-cloud-svg" viewBox="0 0 240 140" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="pastelFill" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FFF0F5" />
                  <stop offset="100%" stopColor="#FFE4E1" />
                </linearGradient>
                <linearGradient id="neonGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ff7ac6" />
                  <stop offset="100%" stopColor="#ffc48c" />
                </linearGradient>
              </defs>
              <path 
                d="M 65,120 C 30,120 15,90 35,70 C 30,45 65,30 85,50 C 95,20 155,20 165,50 C 185,30 215,45 205,70 C 225,85 210,120 175,120 Q 120,130 65,120 Z" 
                fill="url(#pastelFill)" 
                stroke="url(#neonGlow)" 
                strokeWidth="2.5"
              />
            </svg>
            <span className="sweet-bites-cloud-text btn-text">
              Discover<br/>
              More 🍰
            </span>
          </a>
        </div>
        
        <SectionDivider fill="#FFF0DB" />
      </section>

      {/* Bestsellers Section */}
      <section id="bestsellers" className="bestsellers-section">
        <div className="blob-tl"></div>
        <div className="blob-tr"></div>
        <div className="blob-bc"></div>
        <div className="decorative-star" style={{ top: '15%', left: '10%' }}>✨</div>
        <div className="decorative-star" style={{ top: '25%', right: '15%' }}>🌟</div>
        <div className="decorative-star" style={{ top: '50%', left: '5%' }}>✨</div>
        <div className="decorative-star" style={{ bottom: '20%', right: '10%' }}>🌟</div>
        <div className="decorative-star" style={{ bottom: '10%', left: '20%' }}>✨</div>
        
        <div className="container">
          <h2 className="bestsellers-title">Our Bestsellers ✨</h2>
          
          <div className="bestsellers-collage">
            {[
              { name: "🥟 Aloo Puff", desc: "Spiced potato, golden & flaky", color: "#FF6EB4", delay: "0s", img: "./images/aalopuff.jpg" },
              { name: "🧀 Paneer Puff", desc: "Creamy, rich & perfectly baked", color: "#DA70FF", delay: "0.15s", img: "./images/paneerpuff.jpg" }
            ].map((puff, idx) => (
              <div key={idx} className={`bestsellers-item item-${idx+1}`} style={{ transitionDelay: puff.delay }}>
                <div className="bestsellers-frame-wrapper">
                  <div className="bestsellers-frame">
                    <img src={puff.img} alt={puff.name} />
                  </div>
                  <div className="floating-sparkle sparkle-1">✨</div>
                  <div className="floating-sparkle sparkle-2">🤍</div>
                </div>
                <div className="bestsellers-info">
                  <h3 className="bestsellers-name" style={{ color: puff.color }}>{puff.name}</h3>
                  <p className="bestsellers-desc">{puff.desc}</p>
                </div>
              </div>
            ))}
          </div>
          
          <p className="bestsellers-subheading" style={{ textAlign: 'center', fontFamily: 'Nunito, sans-serif', color: '#8B7A75', fontSize: '1.25rem', marginTop: '1rem', marginBottom: '2rem', textShadow: '0 0 8px rgba(255,255,255,0.8)' }}>
            From flaky puffs to freshly baked breads, we bring you a world of warm, comforting delights made with love 🍞✨
          </p>
        </div>
        <SectionDivider fill="#FFF0DB" />
      </section>

      {/* Our Sweet World Section */}
      <section id="showcase" className="sweet-world-section">
        <div className="container sweet-world-container">
          
          <div className="sweet-world-deck-col">
            <div className="sweet-world-deck-container">
              {sweetWorldItems.map((item, idx) => {
                const activeIndex = ((sweetWorldRotation % sweetWorldItems.length) + sweetWorldItems.length) % sweetWorldItems.length;
                const pos = (idx - activeIndex + sweetWorldItems.length) % sweetWorldItems.length;
                
                let translateX = "-50%";
                let translateY = "-50%";
                let rotateZ = 0;
                let scale = 1;
                let opacity = 1;
                let blur = 0;
                let zIndex = 5 - pos;

                if (pos === 0) {
                  translateX = "-50%";
                  scale = 1.04;
                  rotateZ = 0;
                } else if (pos === 1) {
                  translateX = "calc(-50% + 20px)";
                  translateY = "calc(-50% + 15px)";
                  rotateZ = 2;
                  scale = 0.98;
                  blur = 1.5;
                  opacity = 0.85;
                } else if (pos === 2) {
                  translateX = "calc(-50% + 40px)";
                  translateY = "calc(-50% + 30px)";
                  rotateZ = 4;
                  scale = 0.94;
                  blur = 3;
                  opacity = 0.7;
                } else if (pos === 3) {
                  translateX = "calc(-50% - 80px)"; 
                  translateY = "calc(-50% + 10px)";
                  rotateZ = -5;
                  scale = 1;
                  blur = 2;
                  opacity = 0; 
                }

                return (
                  <div 
                    key={item.id}
                    className={`sweet-world-card ${item.frameType} ${pos === 0 ? 'active' : ''}`}
                    onClick={() => { if(pos !== 0) nextSweetWorld() }}
                    style={{
                      transform: `translate(${translateX}, ${translateY}) scale(${scale}) rotateZ(${rotateZ}deg)`,
                      zIndex: zIndex,
                      opacity: opacity,
                      filter: `blur(${blur}px)`
                    }}
                  >
                    <div className="card-inner">
                      <img src={item.img} alt={item.name} />
                      {pos === 0 && <div className="card-sparkle">✨</div>}
                      {item.frameType === 'frame-polaroid' && <div className="card-tape">🎀</div>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="sweet-world-text-col">
            <h2 className="sweet-world-title">Our Pastry World 🍰✨</h2>
            <p className="sweet-world-subtitle">Handpicked treats, made with magic ✨</p>
            
            <div className="sweet-world-text-stack">
              {sweetWorldItems.map((item, idx) => {
                const activeIndex = ((sweetWorldRotation % sweetWorldItems.length) + sweetWorldItems.length) % sweetWorldItems.length;
                const isActive = activeIndex === idx;

                return (
                  <div 
                    key={item.id} 
                    className="sweet-world-text-content"
                    style={{
                      opacity: isActive ? 1 : 0,
                      transform: isActive ? 'translateY(0)' : 'translateY(15px)',
                      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                      pointerEvents: isActive ? 'auto' : 'none',
                    }}
                  >
                    <h3 className="sweet-world-category">{item.name}</h3>
                    <p className="sweet-world-desc">{item.desc}</p>
                  </div>
                );
              })}
            </div>
            
            <div className="sweet-world-nav-arrows">
              <button onClick={prevSweetWorld} className="sweet-world-arrow">←</button>
              <button onClick={nextSweetWorld} className="sweet-world-arrow">→</button>
            </div>
          </div>

        </div>
        <SectionDivider fill="#FFFCF5" />
      </section>

      {/* Cookie Wonderland Section */}
      <section id="cookies" className="sweet-world-section">
        <div className="container sweet-world-container">
          
          <div className="sweet-world-text-col" style={{ gridColumn: 1, order: 1, marginLeft: 0, marginRight: '40px' }}>
            <h2 className="sweet-world-title">Cookie Wonderland 🍪✨</h2>
            <p className="sweet-world-subtitle">Freshly baked cookies, made with love and a sprinkle of magic ✨</p>
            
            <div className="sweet-world-text-stack">
              {cookieWorldItems.map((item, idx) => {
                const activeIndex = ((cookieWorldRotation % cookieWorldItems.length) + cookieWorldItems.length) % cookieWorldItems.length;
                const isActive = activeIndex === idx;

                return (
                  <div 
                    key={item.id} 
                    className="sweet-world-text-content"
                    style={{
                      opacity: isActive ? 1 : 0,
                      transform: isActive ? 'translateY(0)' : 'translateY(15px)',
                      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                      pointerEvents: isActive ? 'auto' : 'none',
                    }}
                  >
                    <h3 className="sweet-world-category">{item.name}</h3>
                    <p className="sweet-world-desc">{item.desc}</p>
                  </div>
                );
              })}
            </div>
            
            <div className="sweet-world-nav-arrows">
              <button onClick={prevCookieWorld} className="sweet-world-arrow">←</button>
              <button onClick={nextCookieWorld} className="sweet-world-arrow">→</button>
            </div>
          </div>

          <div className="sweet-world-deck-col" style={{ gridColumn: 2, order: 2, marginRight: 0, marginLeft: '40px', transform: 'translateX(0)' }}>
            <div className="sweet-world-deck-container">
              {cookieWorldItems.map((item, idx) => {
                const activeIndex = ((cookieWorldRotation % cookieWorldItems.length) + cookieWorldItems.length) % cookieWorldItems.length;
                const pos = (idx - activeIndex + cookieWorldItems.length) % cookieWorldItems.length;
                
                let translateX = "-50%";
                let translateY = "-50%";
                let rotateZ = 0;
                let scale = 1;
                let opacity = 1;
                let blur = 0;
                let zIndex = 5 - pos;

                if (pos === 0) {
                  translateX = "-50%";
                  scale = 1.04;
                  rotateZ = 0;
                } else if (pos === 1) {
                  translateX = "calc(-50% - 20px)";
                  translateY = "calc(-50% + 15px)";
                  rotateZ = -2;
                  scale = 0.98;
                  blur = 1.5;
                  opacity = 0.85;
                } else if (pos === 2) {
                  translateX = "calc(-50% - 40px)";
                  translateY = "calc(-50% + 30px)";
                  rotateZ = -4;
                  scale = 0.94;
                  blur = 3;
                  opacity = 0.7;
                } else if (pos === 3) {
                  translateX = "calc(-50% + 80px)"; 
                  translateY = "calc(-50% + 10px)";
                  rotateZ = 5;
                  scale = 1;
                  blur = 2;
                  opacity = 0; 
                }

                return (
                  <div 
                    key={item.id}
                    className={`sweet-world-card ${item.frameType} ${pos === 0 ? 'active' : ''}`}
                    onClick={() => { if(pos !== 0) nextCookieWorld() }}
                    style={{
                      transform: `translate(${translateX}, ${translateY}) scale(${scale}) rotateZ(${rotateZ}deg)`,
                      zIndex: zIndex,
                      opacity: opacity,
                      filter: `blur(${blur}px)`
                    }}
                  >
                    <div className="card-inner">
                      <img src={item.img} alt={item.name} />
                      {pos === 0 && <div className="card-sparkle">✨</div>}
                      {item.frameType === 'frame-polaroid' && <div className="card-tape">🎀</div>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
        <SectionDivider fill="#FFFCF5" />
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="gallery-section">
        <div className="container">
          <h2 className="gallery-title">Our Gallery 📸</h2>
          <p className="gallery-subtitle">Sweet moments, captured with love 🌸</p>

          <div className="gallery-grid">
            {[
              { name: "🍰 Strawberry Dream", img: "./images/image2.jpeg", class: "bento-1" },
              { name: "🥐 Butter Croissant", img: "./images/image3.jpeg", class: "bento-2" },
              { name: "🧁 Rose Cupcake", img: "./images/final.png", class: "bento-3" },
              { name: "🍪 Choco Cookie", img: "./images/image5.jpeg", class: "bento-4" },
            ].map((photo, idx) => (
              <div key={idx} className={`gallery-bento-card ${photo.class}`}>
                <img src={photo.img} alt={photo.name} />
              </div>
            ))}
          </div>
        </div>
        <SectionDivider fill="#FFFCF5" />
      </section>

      {/* The Atelier Section */}
      <section id="atelier" className="atelier-section">
        <div className="container atelier-container">
          <div className="atelier-left animate-slide-left">
            <h2 className="atelier-title">The Atelier ✨</h2>
            <h3 className="atelier-subtitle">Visit Our Bake House 🤍</h3>
            <p className="atelier-desc">Step into a cozy world of handcrafted delights, where every treat is baked with love and a touch of magic ✨</p>
            
            <div className="atelier-locations-wrapper" style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', width: '100%' }}>
              <div className="atelier-location-block" style={{ flex: '1 1 200px', marginBottom: '0' }}>
                <span className="location-label">📍 LOCATION</span>
                <address className="location-address">
                  Bake House<br/>
                  33, Main Rd, Tagore Nagar<br/>
                  Anupam Nagar, Govindpuri<br/>
                  Gwalior, Madhya Pradesh 474011<br/>
                  India
                </address>
              </div>
              <div className="atelier-location-block" style={{ flex: '1 1 200px', marginBottom: '0' }}>
                <span className="location-label">📍 LOCATION 2</span>
                <address className="location-address">
                  Bake House (Branch 2)<br/>
                  New, Vivek Nagar<br/>
                  Gwalior, Madhya Pradesh 474005<br/>
                  India
                </address>
              </div>
            </div>
            
            <div className="atelier-buttons-wrapper" style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', width: '100%', marginTop: '1.5rem', alignItems: 'center' }}>
              <div style={{ flex: '1 1 200px', display: 'flex', justifyContent: 'center' }}>
                <a href="https://www.google.com/maps/place/BAKE+HOUSE/@26.2071519,78.2002472,17z/data=!3m1!4b1!4m6!3m5!1s0x3976c5d52f8c8e5b:0xc2917a954e5751dd!8m2!3d26.2071519!4d78.2002472!16s%2Fg%2F11s1rjtb23?entry=ttu&g_ep=EgoyMDI2MDQxNS4wIKXMDSoASAFQAw%3D%3D" target="_blank" rel="noopener noreferrer" className="atelier-cta" style={{ textAlign: 'center', width: '100%', maxWidth: 'fit-content' }}>
                  Find Govindpuri Branch 📍
                </a>
              </div>
              <div style={{ flex: '1 1 200px', display: 'flex', justifyContent: 'center' }}>
                <a href="https://www.google.com/maps/place/Cake+house+in+Gwalior/@26.2220907,78.2023493,17z/data=!3m1!4b1!4m6!3m5!1s0x3976c12bb1c67bb1:0x967015e404e330a!8m2!3d26.2220907!4d78.2023493!16s%2Fg%2F11rv5cy0jj?entry=ttu&g_ep=EgoyMDI2MDQxNS4wIKXMDSoASAFQAw%3D%3D" target="_blank" rel="noopener noreferrer" className="atelier-cta" style={{ textAlign: 'center', width: '100%', maxWidth: 'fit-content' }}>
                  Find Vivek Nagar Branch 📍
                </a>
              </div>
            </div>
          </div>

          <div className="atelier-right animate-slide-right">
            <div className="atelier-organic-frame">
              <img src="./images/i1.jpeg" alt="Bake House Interior" />
              <div className="atelier-decor-heart">🤍</div>
              <div className="atelier-decor-sparkle">✨</div>
            </div>
          </div>
        </div>
        <SectionDivider fill="#FFF0DB" />
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact-section">
        <div className="container contact-container">
          <h2 className="contact-heading animate-on-scroll">Let’s Stay in Touch 💌</h2>
          
          <div className="contact-box-wrapper animate-on-scroll delay-1">
            <div className="contact-box">
              <h3 className="contact-box-title">The Bake House ✨</h3>
              
              <div className="contact-info-list">
                <div className="contact-item">
                  <span className="contact-label">PHONE</span>
                  <p className="contact-value">+91 98765 43210</p>
                </div>
                
                <div className="contact-item">
                  <span className="contact-label">EMAIL</span>
                  <p className="contact-value">mncorporation0805@gmail.com</p>
                </div>
                
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', width: '100%', justifyContent: 'center' }}>
                  <div className="contact-item" style={{ flex: '1 1 200px', marginBottom: '0' }}>
                    <span className="contact-label">LOCATION 1</span>
                    <p className="contact-value">
                      Bake House<br/>
                      33, Main Rd, Tagore Nagar<br/>
                      Anupam Nagar, Govindpuri<br/>
                      Gwalior, Madhya Pradesh 474011<br/>
                      India
                    </p>
                  </div>
                  <div className="contact-item" style={{ flex: '1 1 200px', marginBottom: '0' }}>
                    <span className="contact-label">LOCATION 2</span>
                    <p className="contact-value">
                      Bake House (Branch 2)<br/>
                      New, Vivek Nagar<br/>
                      Gwalior, Madhya Pradesh 474005<br/>
                      India
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorations */}
            <div className="floating-sparkle sparkle-contact-1">✨</div>
            <div className="floating-sparkle sparkle-contact-2">🤍</div>
          </div>

          <div className="contact-socials animate-on-scroll delay-2">
            <a href="#" className="social-icon-link" aria-label="Instagram">
              <svg viewBox="0 0 24 24" width="28" height="28" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </a>
            <a href="#" className="social-icon-link" aria-label="WhatsApp">
              <svg viewBox="0 0 24 24" width="28" height="28" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
              </svg>
            </a>
            <a href="#" className="social-icon-link" aria-label="Facebook">
              <svg viewBox="0 0 24 24" width="28" height="28" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
              </svg>
            </a>
          </div>
        </div>
        <SectionDivider fill="#8C6254" />
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-grain"></div>
        <div className="container relative z-10">
          <div className="footer-grid">
            <div className="footer-col brand-col animate-on-scroll delay-1">
              <h3>The Bake House ✨</h3>
              <p>Crafting sweet moments with premium ingredients and endless love baked into every bite 🤍</p>
              <div className="footer-sparkle footer-sparkle-1">✨</div>
            </div>
            <div className="footer-col animate-on-scroll delay-2">
              <h4>Quick Links</h4>
              <ul>
                <li><a href="#home">Home</a></li>
                <li><a href="#about">About Us</a></li>
                <li><a href="#sweet-bites">Sweet Bites</a></li>
                <li><a href="#bestsellers">Bestsellers</a></li>
                <li><a href="#contact">Contact</a></li>
              </ul>
            </div>
            <div className="footer-col brand-col animate-on-scroll delay-3">
              <h4>The Bake House</h4>
              <p>
                📍 Location 1<br/>
                33, Main Rd, Tagore Nagar<br/>
                Anupam Nagar, Govindpuri<br/>
                Gwalior, Madhya Pradesh 474011<br/><br/>
                📍 Location 2<br/>
                Bake House (Branch 2)<br/>
                New, Vivek Nagar<br/>
                Gwalior, Madhya Pradesh 474005<br/><br/>
                +91 98765 43210<br/>
                mncorporation0805@gmail.com
              </p>
              <div className="footer-sparkle footer-sparkle-2">✨</div>
            </div>
          </div>
          
          <div className="footer-divider"></div>
          
          <div className="footer-bottom">
            Crafted with ♥ by MN Corporation<br/>
            © 2026 All Rights Reserved
          </div>
        </div>
      </footer>
    </>
  );
}

export default App;
