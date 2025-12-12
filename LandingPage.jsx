import React, { useState, useEffect, useRef } from 'react';
import { Leaf, Package, Layers, FileText, CreditCard, Users, Calendar, CheckCircle2, XCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import axios from 'axios';
import { useLanguage } from '../LanguageContext';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8001';

export default function LandingPage() {
  const { t, language, changeLanguage } = useLanguage();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [showDemoForm, setShowDemoForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success', 'error', or null
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const carouselRef = useRef(null);

  // Form data
  const [formData, setFormData] = useState({
    lead_contact_email: '',
    company_name: '',
    company_link: '',
    request_message: ''
  });

  const carouselImagesStatic = [
    {
      key: "mainscreen",
      image: "https://res.cloudinary.com/dzhwsjuxy/image/upload/v1761822761/mainscreen_x9mwqy.png",
      altText: {
        es: "Software de floristería PRIRODA - Pantalla principal para gestión diaria de tienda de flores, control de inventario y facturación electrónica",
        en: "PRIRODA flower shop software - Main dashboard for daily flower shop management, inventory control and electronic invoicing"
      }
    },
    {
      key: "balance",
      image: "https://res.cloudinary.com/dzhwsjuxy/image/upload/v1761822762/itemsbalance_zx5ugk.png",
      altText: {
        es: "Gestión de inventario de flores - Sistema de balance de existencias para control de stock en floristerías",
        en: "Flower inventory management - Stock balance system for flower shop inventory control"
      }
    },
    {
      key: "supplier",
      image: "https://res.cloudinary.com/dzhwsjuxy/image/upload/v1761822762/purchaserequests_o3q0lg.png",
      altText: {
        es: "Software de gestión de proveedores para floristerías - Control de entregas y facturas de suministros",
        en: "Flower supplier management software - Delivery and invoice tracking for flower shop supplies"
      }
    },
    {
      key: "bouquets",
      image: "https://res.cloudinary.com/dzhwsjuxy/image/upload/v1761822764/bouquets_ol6wjm.png",
      altText: {
        es: "Creador de bouquets - Software para floristas para ensamblar y crear ramos con cálculo automático de precios",
        en: "Bouquet builder - Florist software to create and assemble flower arrangements with automatic pricing"
      }
    },
    {
      key: "orders",
      image: "https://res.cloudinary.com/dzhwsjuxy/image/upload/v1761822763/orderactions_i5w181.png",
      altText: {
        es: "Sistema de gestión de pedidos y facturación para floristerías - Facturación VeriFactu y cálculo de impuestos",
        en: "Order and invoicing system for flower shops - VeriFactu invoicing and tax calculation"
      }
    }
  ];

  const carouselImages = carouselImagesStatic.map(item => ({
    title: t(`carousel.${item.key}.title`),
    description: t(`carousel.${item.key}.description`),
    image: item.image,
    altText: item.altText[language]
  }));

  useEffect(() => {
    setIsVisible(true);
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    const handleEscKey = (e) => {
      if (e.key === 'Escape') {
        setIsModalOpen(false);
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('keydown', handleEscKey);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('keydown', handleEscKey);
    };
  }, []);

  // Carousel handlers
  const handleCarouselPrev = () => {
    setCarouselIndex((prev) => (prev === 0 ? carouselImages.length - 1 : prev - 1));
    window.gtag('event', 'carousel_navigation', {
      direction: 'previous'
    });
  };

  const handleCarouselNext = () => {
    setCarouselIndex((prev) => (prev === carouselImages.length - 1 ? 0 : prev + 1));
    window.gtag('event', 'carousel_navigation', {
      direction: 'next'
    });
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart(e.clientX || e.touches?.[0]?.clientX);
  };

  const handleMouseUp = (e) => {
    if (!isDragging) return;
    setIsDragging(false);
    const dragEnd = e.clientX || e.changedTouches?.[0]?.clientX;
    const diff = dragStart - dragEnd;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        handleCarouselNext();
      } else {
        handleCarouselPrev();
      }
    }
  };

  const handleTouchStart = (e) => {
    setIsDragging(true);
    setDragStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    if (!isDragging) return;
    setIsDragging(false);
    const dragEnd = e.changedTouches[0].clientX;
    const diff = dragStart - dragEnd;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        handleCarouselNext();
      } else {
        handleCarouselPrev();
      }
    }
  };

  const openImageModal = (index) => {
    setSelectedImageIndex(index);
    setIsModalOpen(true);
    window.gtag('event', 'image_modal_open', {
      image_index: index
    });
  };

  const closeImageModal = () => {
    setIsModalOpen(false);
  };

  const handleModalBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      closeImageModal();
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await axios.post(`${API_URL}/api/demo-request`, formData);
      
      if (response.data.success) {
        setSubmitStatus('success');
        window.gtag('event', 'demo_request_submitted', {
          company_name: formData.company_name,
          language: language
        });
        setFormData({
          lead_contact_email: '',
          company_name: '',
          company_link: '',
          request_message: ''
        });
        
        setTimeout(() => {
          setShowDemoForm(false);
          setSubmitStatus(null);
        }, 3000);
      }
    } catch (error) {
      console.error('Error submitting demo request:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const iconMap = {
    Package,
    Layers,
    Leaf,
    FileText,
    Users,
    Calendar,
    CreditCard
  };

  const features = t('features').map((feature) => ({
    ...feature,
    icon: iconMap[feature.icon]
  }));

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 relative overflow-hidden">
      <style>{`
        html, body {
          overscroll-behavior: none;
        }

        @keyframes waterWave {
          0% {
            transform: translate(-50%, -50%) scale(0.3) rotate(0deg);
            opacity: 0;
          }
          5% {
            opacity: 0.5;
          }
          15% {
            opacity: 0.7;
          }
          50% {
            opacity: 0.3;
            transform: translate(-50%, -50%) scale(6) rotate(90deg);
          }
          100% {
            transform: translate(-50%, -50%) scale(12) rotate(180deg);
            opacity: 0;
          }
        }
        
        @keyframes waterWaveSoft {
          0% {
            transform: translate(-50%, -50%) scale(0.3) rotate(0deg);
            opacity: 0;
          }
          5% {
            opacity: 0.25;
          }
          15% {
            opacity: 0.4;
          }
          50% {
            opacity: 0.15;
            transform: translate(-50%, -50%) scale(6) rotate(-75deg);
          }
          100% {
            transform: translate(-50%, -50%) scale(12) rotate(-150deg);
            opacity: 0;
          }
        }

        @keyframes fadeInFlowerContainer {
          0% {
            opacity: 0;
            transform: scale(0.5) rotate(0deg);
            filter: blur(25px) brightness(0.2);
          }
          30% {
            filter: blur(15px) brightness(0.5);
          }
          60% {
            filter: blur(5px) brightness(0.8);
          }
          100% {
            opacity: 1;
            transform: scale(1) rotate(0deg);
            filter: blur(0) brightness(1);
          }
        }

        @keyframes rotateFlowerGradual {
          0% {
            transform: scale(1) rotate(0deg);
          }
          100% {
            transform: scale(1) rotate(720deg);
          }
        }

        @keyframes fadeInTextPart {
          0% {
            opacity: 0;
            transform: translateY(25px) scale(0.9);
            filter: blur(20px) brightness(0.3);
          }
          40% {
            transform: translateY(-4px) scale(1.03);
            filter: blur(10px) brightness(0.7);
          }
          70% {
            transform: translateY(2px) scale(0.98);
            filter: blur(3px) brightness(0.9);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: blur(0) brightness(1);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-flower-container {
          position: relative;
          animation: fadeInFlowerContainer 2s cubic-bezier(0.4, 0, 0.2, 1) forwards,
                     rotateFlowerGradual 8s cubic-bezier(0.4, 0, 0.2, 1) 2s forwards;
          transform-origin: center center;
        }

        .animate-text-part-first {
          animation: fadeInTextPart 3s cubic-bezier(0.4, 0, 0.2, 1) 1.5s forwards;
          opacity: 0;
        }

        .animate-text-part-last {
          animation: fadeInTextPart 3s cubic-bezier(0.4, 0, 0.2, 1) 2.5s forwards;
          opacity: 0;
        }

        .water-wave {
          position: absolute;
          width: 200px;
          height: 200px;
          border-radius: 50%;
          background: radial-gradient(
            ellipse 110% 90% at 45% 50%,
            transparent 35%,
            rgba(100, 200, 255, 0.12) 40%,
            rgba(100, 200, 255, 0.25) 50%,
            rgba(100, 200, 255, 0.12) 60%,
            transparent 65%
          );
          animation: waterWave 7s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
          opacity: 0;
          pointer-events: none;
          filter: blur(4px);
          left: 50%;
          top: 50%;
        }
        
        .water-wave-soft {
          position: absolute;
          width: 200px;
          height: 200px;
          border-radius: 50%;
          background: radial-gradient(
            ellipse 90% 110% at 55% 50%,
            transparent 30%,
            rgba(6, 182, 212, 0.08) 35%,
            rgba(6, 182, 212, 0.2) 50%,
            rgba(6, 182, 212, 0.08) 65%,
            transparent 70%
          );
          animation: waterWaveSoft 7s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
          opacity: 0;
          pointer-events: none;
          filter: blur(6px);
          left: 50%;
          top: 50%;
        }

        .cursor-trail {
          pointer-events: none;
          position: fixed;
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, 
            rgba(0, 255, 200, 0.03) 0%,
            rgba(255, 0, 255, 0.02) 50%,
            transparent 70%
          );
          transform: translate(-50%, -50%);
          transition: all 0.2s ease;
          z-index: 0;
        }

        .glass-effect {
          background: rgba(23, 23, 23, 0.5);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .fade-in-up {
          animation: fadeInUp 1s ease-out forwards;
        }

        .glow-button {
          box-shadow: 0 0 20px rgba(0, 255, 200, 0.1);
          transition: all 0.3s ease;
        }

        .glow-button:hover {
          box-shadow: 0 0 30px rgba(0, 255, 200, 0.3),
                      0 0 60px rgba(255, 0, 255, 0.2);
          transform: translateY(-2px);
        }

        .matte-texture {
          background-image: 
            radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.02) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.01) 0%, transparent 50%);
        }

        .letter-spacing-wide {
          letter-spacing: 0.2em;
        }

        .hover-laser {
          position: relative;
          transition: all 0.3s ease;
        }

        .hover-laser::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 1px;
          background: linear-gradient(90deg, 
            #00FFC8 0%,
            #FF00FF 50%,
            #F0FF00 100%
          );
          transition: width 0.3s ease;
        }

        .hover-laser:hover::after {
          width: 100%;
        }

        .branding-with-flower {
          display: inline-flex;
          align-items: center;
          gap: 0;
          filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.8)) drop-shadow(0 0 16px rgba(255, 215, 0, 0.4));
        }

        .branding-text-part {
          font-size: inherit;
          font-weight: inherit;
          letter-spacing: inherit;
        }

        .flower-container {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 90px;
          height: 120px;
          margin: 0;
          margin-right: 10px;
          flex-shrink: 0;
          position: relative;
          overflow: visible;
        }

        .flower-container img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          position: relative;
          z-index: 2;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideOut {
          from {
            opacity: 1;
            transform: translateX(-50px);
          }
          to {
            opacity: 0;
            transform: translateX(0);
          }
        }

        .carousel-container {
          position: relative;
          overflow: hidden;
        }

        .carousel-slide {
          animation: slideIn 0.6s ease-out forwards;
        }

        .carousel-fade-left {
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 100px;
          background: linear-gradient(90deg, rgba(0, 0, 0, 1) 0%, transparent 100%);
          pointer-events: none;
          z-index: 10;
        }

        .carousel-fade-right {
          position: absolute;
          right: 0;
          top: 0;
          bottom: 0;
          width: 100px;
          background: linear-gradient(90deg, transparent 0%, rgba(0, 0, 0, 1) 100%);
          pointer-events: none;
          z-index: 10;
        }

        .carousel-button {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          z-index: 20;
          background: rgba(23, 23, 23, 0.7);
          border: 1px solid rgba(255, 255, 255, 0.1);
          hover:border-color: rgba(0, 255, 200, 0.5);
          color: rgba(255, 255, 255, 0.6);
          padding: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .carousel-button:hover {
          background: rgba(23, 23, 23, 0.9);
          border-color: rgba(0, 255, 200, 0.5);
          color: rgba(0, 255, 200, 0.8);
        }

        .carousel-button-left {
          left: 24px;
        }

        .carousel-button-right {
          right: 24px;
        }

        .carousel-dots {
          display: flex;
          gap: 8px;
          justify-content: center;
          margin-top: 24px;
        }

        .carousel-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.3);
          cursor: pointer;
          transition: all 0.3s ease;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .carousel-dot.active {
          background: rgb(0, 255, 200);
          border-color: rgb(0, 255, 200);
          transform: scale(1.3);
        }

        .carousel-dot:hover {
          background: rgba(0, 255, 200, 0.6);
          border-color: rgba(0, 255, 200, 0.6);
        }

        .carousel-select-none {
          user-select: none;
        }

        .image-modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.95);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          animation: fadeIn 0.3s ease-out;
        }

        .image-modal-content {
          position: relative;
          max-width: 95vw;
          max-height: 95vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .image-modal-img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          animation: zoomIn 0.3s ease-out;
        }

        @media (max-width: 768px) {
          .image-modal-content {
            max-width: 250vw;
            max-height: 250vh;
            overflow: auto;
          }
        }

        .image-modal-close {
          position: absolute;
          top: 20px;
          right: 20px;
          background: rgba(23, 23, 23, 0.8);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: rgba(255, 255, 255, 0.6);
          padding: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1001;
        }

        .image-modal-close:hover {
          background: rgba(23, 23, 23, 0.9);
          border-color: rgba(0, 255, 200, 0.5);
          color: rgba(0, 255, 200, 0.8);
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes zoomIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>

      {/* Subtle cursor trail */}
      <div 
        className="cursor-trail"
        style={{
          left: `${mousePosition.x}px`,
          top: `${mousePosition.y}px`
        }}
      />

      {/* Language Switcher */}
      <div className="fixed top-6 right-6 z-50 flex gap-2">
        <button
          onClick={() => {
            changeLanguage('es');
            window.gtag('event', 'language_change', {
              language: 'es'
            });
          }}
          className={`px-4 py-2 text-sm font-light tracking-wider transition-all ${
            language === 'es'
              ? 'border border-cyan-400/50 text-cyan-400 bg-neutral-900/50'
              : 'border border-neutral-700 text-neutral-400 hover:border-neutral-600 hover:text-neutral-300'
          }`}
        >
          ES
        </button>
        <button
          onClick={() => {
            changeLanguage('en');
            window.gtag('event', 'language_change', {
              language: 'en'
            });
          }}
          className={`px-4 py-2 text-sm font-light tracking-wider transition-all ${
            language === 'en'
              ? 'border border-cyan-400/50 text-cyan-400 bg-neutral-900/50'
              : 'border border-neutral-700 text-neutral-400 hover:border-neutral-600 hover:text-neutral-300'
          }`}
        >
          EN
        </button>
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6 md:px-12 lg:px-24 matte-texture">
        <div className="max-w-4xl w-full text-center relative z-10">
          {/* Content */}
          <div className={`space-y-8 ${isVisible ? 'fade-in-up' : 'opacity-0'}`}>
            <div className="space-y-4">
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-light tracking-widest letter-spacing-wide">
                <div className="branding-with-flower">
                  <span className="branding-text-part animate-text-part-first">PRIR</span>
                  <div className="flower-container animate-flower-container">
                    {/* Multiple water wave layers emanating from flower */}
                    {[...Array(10)].map((_, i) => (
                      <React.Fragment key={i}>
                        {/* Main wave ring */}
                        <span
                          className="water-wave"
                          style={{
                            animationDelay: `${0.5 + i * 0.6}s`,
                          }}
                        />
                        {/* Secondary softer wave for depth */}
                        <span
                          className="water-wave-soft"
                          style={{
                            animationDelay: `${0.5 + i * 0.6 + 0.2}s`,
                          }}
                        />
                      </React.Fragment>
                    ))}
                    <img 
                      src="https://res.cloudinary.com/dzhwsjuxy/image/upload/v1761248731/IMG_5193_otm4t7.png"
                      alt="PRIRODA Flower"
                      style={{ position: 'relative', zIndex: 2 }}
                    />
                  </div>
                  <span className="branding-text-part animate-text-part-last">DA</span>
                </div>
              </h1>
              <div className="h-px w-32 bg-gradient-to-r from-cyan-400/40 via-purple-400/40 to-yellow-400/40 mx-auto" />
            </div>

            <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-light text-neutral-300 px-4 md:px-0 max-w-sm md:max-w-full" style={{ letterSpacing: '0.08em' }}>
              {t('tagline').toUpperCase()}
            </h2>

            <div className="pt-6 flex gap-6 justify-center">
              <button 
                onClick={() => {
                  document.getElementById('features').scrollIntoView({ behavior: 'smooth' });
                  window.gtag('event', 'cta_click', {
                    button: 'see_features'
                  });
                }}
                className="glow-button w-40 px-8 py-4 bg-neutral-900 border border-neutral-700 hover:border-cyan-400/50 rounded-sm text-neutral-100 font-light tracking-wider uppercase text-sm transition-all"
              >
                {t('learnMore')}
              </button>
              <button 
                onClick={() => {
                  setShowDemoForm(true);
                  window.gtag('event', 'cta_click', {
                    button: 'request_demo'
                  });
                }}
                disabled={isSubmitting}
                className="glow-button w-40 px-8 py-4 bg-neutral-900 border border-neutral-700 hover:border-cyan-400/50 rounded-sm text-neutral-100 font-light tracking-wider uppercase text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Loading...' : t('requestDemo')}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="features" className="relative py-24 px-6 md:px-12 lg:px-24 bg-neutral-950/50">
        <div className="max-w-6xl mx-auto">
          {/* Section title */}
          <div className="mb-16 space-y-4 text-center">
            <h3 className="font-light text-neutral-200 tracking-wide" style={{ fontSize: '2.5rem', letterSpacing: '0.15em' }}>
               {' '}
              <span style={{ 
                textShadow: '0 0 8px rgba(255, 255, 255, 0.8), 0 0 16px rgba(255, 215, 0, 0.4), 0 0 24px rgba(255, 215, 0, 0.2)',
                color: '#FFD700',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '2px'
              }}>
                S
                <img 
                  src="https://res.cloudinary.com/dzhwsjuxy/image/upload/v1761248731/IMG_5193_otm4t7.png"
                  alt="O"
                  style={{
                    display: 'inline-block',
                    width: '42px',
                    height: '49px',
                    objectFit: 'contain',
                    verticalAlign: 'middle',
                    margin: '-8px -2px',
                    filter: 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.8)) drop-shadow(0 0 16px rgba(255, 215, 0, 0.4))'
                  }}
                />
                 FTWARE
              </span>
              {' '}
              {language === 'es' ? 'PARA EL' : 'FOR THE'}
              {' '}
              <span style={{ 
                textShadow: '0 0 8px rgba(255, 255, 255, 0.8), 0 0 16px rgba(255, 215, 0, 0.4), 0 0 24px rgba(255, 215, 0, 0.2)',
                color: '#FFD700'
              }}>
                {language === 'es' ? 'NEGOCIO FLORAL' : 'FLORAL BUSINESS'}
              </span>
            </h3>
            <p className="text-xl md:text-2xl text-neutral-400 font-light">{t('whereYouCan')}</p>
            <div className="h-px w-24 bg-gradient-to-r from-cyan-400/40 via-purple-400/40 to-yellow-400/40 mx-auto" />
          </div>

          {/* Features grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="group hover-laser cursor-default p-6 border border-neutral-800/50 hover:border-neutral-700 bg-neutral-900/20 rounded-sm transition-all duration-300"
                  style={{
                    animationDelay: `${index * 0.1}s`
                  }}
                >
                  <Icon className="w-10 h-10 mb-4 text-neutral-600 group-hover:text-cyan-400/70 transition-colors duration-300" strokeWidth={1} />
                  <p className="text-neutral-300 font-light leading-relaxed text-xl">
                    {feature.text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Carousel Section */}
      <section className="relative py-24 px-6 md:px-12 lg:px-24 bg-neutral-950">
        <div className="max-w-6xl mx-auto">
          {/* Section title */}
          <div className="mb-16 space-y-4 text-center">
            <h3 className="font-light text-neutral-200 tracking-wide" style={{ fontSize: '2.5rem', letterSpacing: '0.15em' }}>
              {t('exploreFeatures')}
            </h3>
            <p className="text-lg md:text-xl text-neutral-400 font-light">{t('discoverText')}</p>
            <div className="h-px w-24 bg-gradient-to-r from-cyan-400/40 via-purple-400/40 to-yellow-400/40 mx-auto" />
          </div>

          {/* Carousel */}
          <div 
            className="carousel-container relative bg-neutral-900/30 rounded-lg p-8 md:p-12 border border-neutral-800/50 carousel-select-none"
            ref={carouselRef}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {/* Left fade overlay */}
            <div className="carousel-fade-left" />
            {/* Right fade overlay */}
            <div className="carousel-fade-right" />

            {/* Carousel content */}
            <div className="flex flex-col lg:flex-row gap-8 items-center">
              {/* Image container */}
              <div className="w-full lg:w-1/2 flex justify-center">
                <div className="carousel-slide w-full h-64 md:h-80 lg:h-96 bg-neutral-900/50 rounded-lg border border-neutral-800/50 flex items-center justify-center overflow-hidden cursor-pointer group hover:border-neutral-700 transition-all" onClick={() => openImageModal(carouselIndex)}>
                  <img 
                    src={carouselImages[carouselIndex].image}
                    alt={carouselImages[carouselIndex].altText}
                    className="w-full h-full object-contain p-4 group-hover:opacity-80 transition-opacity"
                    draggable={false}
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <div className="text-cyan-400 text-sm font-light">Click to enlarge</div>
                  </div>
                </div>
              </div>

              {/* Text content */}
              <div className="w-full lg:w-1/2 space-y-6">
                <div className="space-y-2">
                  <h4 className="text-3xl md:text-4xl font-light text-neutral-100 tracking-wide">
                    {carouselImages[carouselIndex].title}
                  </h4>
                  <div className="h-px w-12 bg-gradient-to-r from-cyan-400/60 to-purple-400/60" />
                </div>
                <p className="text-lg md:text-xl text-neutral-300 font-light leading-relaxed">
                  {carouselImages[carouselIndex].description}
                </p>

                {/* Navigation buttons */}
                <div className="flex gap-4 pt-4">
                  <button
                    onClick={handleCarouselPrev}
                    className="carousel-button carousel-button-left relative left-0 top-0 transform-none p-3"
                    aria-label="Previous slide"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button
                    onClick={handleCarouselNext}
                    className="carousel-button carousel-button-right relative right-0 top-0 transform-none p-3"
                    aria-label="Next slide"
                  >
                    <ChevronRight size={24} />
                  </button>
                </div>
              </div>
            </div>

            {/* Left/Right navigation buttons (large screens) */}
            <button
              onClick={handleCarouselPrev}
              className="carousel-button carousel-button-left hidden md:flex"
              aria-label="Previous slide"
            >
              <ChevronLeft size={28} />
            </button>
            <button
              onClick={handleCarouselNext}
              className="carousel-button carousel-button-right hidden md:flex"
              aria-label="Next slide"
            >
              <ChevronRight size={28} />
            </button>
          </div>

          {/* Dots indicator */}
          <div className="carousel-dots">
            {carouselImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCarouselIndex(index)}
                className={`carousel-dot ${index === carouselIndex ? 'active' : ''}`}
                aria-label={`Go to slide ${index + 1}`}
                aria-current={index === carouselIndex}
              />
            ))}
          </div>

          {/* Call to Action Button */}
          <div className="mt-16 flex justify-center">
            <button
              onClick={() => setShowDemoForm(true)}
              className="px-12 py-4 bg-gradient-to-r from-cyan-400/20 to-purple-400/20 border border-cyan-400/50 hover:border-cyan-400 text-neutral-100 font-light tracking-widest transition-all duration-300 hover:shadow-lg hover:shadow-cyan-400/20 hover:from-cyan-400/30 hover:to-purple-400/30 text-lg"
              aria-label="Book a demo"
            >
              BOOK A DEMO
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-neutral-800/50 py-12 px-6 md:px-12 lg:px-24">
        {/* Subtle prism strip at edge */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-400/20 to-transparent" />
        
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-neutral-500 text-sm">
              © PRIRODA {new Date().getFullYear()}
            </div>
            <div className="flex space-x-8">
              <a href="#" className="text-neutral-500 hover:text-neutral-300 text-sm hover-laser transition-colors">
                Privacy
              </a>
              <a href="#" className="text-neutral-500 hover:text-neutral-300 text-sm hover-laser transition-colors">
                Terms
              </a>
              <a 
                href="https://t.me/andriichep"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-500 hover:text-neutral-300 text-sm hover-laser transition-colors"
              >
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Demo Request Modal */}
      {showDemoForm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="glass-effect rounded-sm p-8 md:p-12 space-y-8 max-w-lg w-full">
            {submitStatus === 'success' ? (
              <div className="text-center space-y-4">
                <CheckCircle2 className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
                <p className="text-neutral-300 text-lg font-light">Thank you! We'll be in touch soon.</p>
                <button
                  onClick={() => {
                    setShowDemoForm(false);
                    setSubmitStatus(null);
                  }}
                  className="w-full text-neutral-500 hover:text-neutral-300 text-xs transition-colors mt-4"
                >
                  Close
                </button>
              </div>
            ) : (
              <>
                <div className="text-center space-y-2">
                  <h3 className="text-2xl font-light text-neutral-200 tracking-wide">Request a Demo</h3>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <input
                    type="email"
                    name="lead_contact_email"
                    value={formData.lead_contact_email}
                    onChange={handleInputChange}
                    placeholder={t('contact.email')}
                    required
                    className="w-full px-4 py-2 bg-neutral-900/50 border border-neutral-700 hover:border-neutral-600 focus:border-cyan-400/50 outline-none text-neutral-100 text-sm placeholder-neutral-500 transition-colors"
                  />
                  <input
                    type="text"
                    name="company_name"
                    value={formData.company_name}
                    onChange={handleInputChange}
                    placeholder={t('contact.company')}
                    required
                    className="w-full px-4 py-2 bg-neutral-900/50 border border-neutral-700 hover:border-neutral-600 focus:border-cyan-400/50 outline-none text-neutral-100 text-sm placeholder-neutral-500 transition-colors"
                  />
                  <input
                    type="text"
                    name="company_link"
                    value={formData.company_link}
                    onChange={handleInputChange}
                    placeholder={t('contact.link')}
                    className="w-full px-4 py-2 bg-neutral-900/50 border border-neutral-700 hover:border-neutral-600 focus:border-cyan-400/50 outline-none text-neutral-100 text-sm placeholder-neutral-500 transition-colors"
                  />
                  <textarea
                    name="request_message"
                    value={formData.request_message}
                    onChange={handleInputChange}
                    placeholder={t('contact.message')}
                    rows={4}
                    className="w-full px-4 py-2 bg-neutral-900/50 border border-neutral-700 hover:border-neutral-600 focus:border-cyan-400/50 outline-none text-neutral-100 text-sm placeholder-neutral-500 transition-colors resize-none"
                  />
                  
                  {submitStatus === 'error' && (
                    <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-sm text-red-300 text-sm">
                      {t('contact.error')}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 hover:border-cyan-400/50 text-neutral-100 text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Submitting...' : t('contact.submit')}
                  </button>
                </form>

                {/* Close button */}
                <button
                  onClick={() => {
                    setShowDemoForm(false);
                    setSubmitStatus(null);
                  }}
                  className="w-full text-neutral-500 hover:text-neutral-300 text-xs transition-colors"
                >
                  Close
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Image Enlargement Modal */}
      {isModalOpen && (
        <div 
          className="image-modal-backdrop"
          onClick={handleModalBackdropClick}
        >
          <button
            onClick={closeImageModal}
            className="image-modal-close"
            aria-label="Close enlarged image"
            title="Press ESC to close"
          >
            <XCircle size={24} />
          </button>
          <div className="image-modal-content">
            <img
              src={carouselImages[selectedImageIndex].image}
              alt={carouselImages[selectedImageIndex].altText}
              className="image-modal-img"
            />
          </div>
        </div>
      )}
    </div>
  );
}