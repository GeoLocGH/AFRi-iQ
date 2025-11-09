import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from '../contexts/I18nContext';
import { WeatherWidget } from './WeatherWidget';

const logoSvg = `
<svg width="64" height="64" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <defs>
        <linearGradient id="shieldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#2dd4bf;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#8b5cf6;stop-opacity:1" />
        </linearGradient>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3.5" result="coloredBlur"/>
            <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
            </feMerge>
        </filter>
    </defs>

    <!-- Background reticle/scope elements -->
    <circle cx="50" cy="50" r="40" fill="none" stroke="#4b5563" stroke-width="1" opacity="0.5"/>
    <circle cx="50" cy="50" r="30" fill="none" stroke="#4b5563" stroke-width="1.5" stroke-dasharray="4 4" opacity="0.7"/>
    <path d="M50 20 V30 M50 80 V70 M20 50 H30 M80 50 H70" stroke="#4b5563" stroke-width="2" opacity="0.7"/>

    <!-- The glowing shield -->
    <path 
        d="M50 5 L93.3 27.5 V72.5 L50 95 L6.7 72.5 V27.5 Z" 
        fill="rgba(17, 24, 39, 0.5)" 
        stroke="url(#shieldGradient)" 
        stroke-width="4"
        filter="url(#glow)"
    />

    <!-- First state-of-the-art drone design (more abstract) -->
    <g transform="translate(50 50) scale(0.8)">
        <path d="M 0 -30 L 20 20 L 0 10 L -20 20 Z" fill="#4b5563" />
        <path d="M 0 -15 L 10 5 L 0 0 L -10 5 Z" fill="#2dd4bf">
            <animate attributeName="opacity" values="0.7;1;0.7" dur="2s" repeatCount="indefinite" />
        </path>
    </g>
</svg>
`;

const logoSrc = `data:image/svg+xml;base64,${btoa(logoSvg)}`;

const LanguageSelector: React.FC = () => {
    const { language, setLanguage, t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const languages = [
        { code: 'en', name: t('settings.language.en') },
        { code: 'fr', name: t('settings.language.fr') },
        { code: 'zh', name: t('settings.language.zh') },
        { code: 'ru', name: t('settings.language.ru') },
    ];

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLanguageChange = (langCode: string) => {
        setLanguage(langCode);
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-center h-10 w-12 bg-gray-700 rounded-md hover:bg-gray-600 transition font-bold text-sm"
                aria-haspopup="true"
                aria-expanded={isOpen}
                aria-label={t('header.language_selector_label')}
            >
                {language.toUpperCase()}
            </button>
            {isOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-gray-800 border border-gray-600 rounded-md shadow-lg z-50">
                    <ul className="py-1">
                        {languages.map(lang => (
                             <li key={lang.code}>
                                <button
                                    onClick={() => handleLanguageChange(lang.code)}
                                    className={`w-full text-left px-4 py-2 text-sm ${language === lang.code ? 'bg-cyan-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}
                                >
                                    {lang.name} ({lang.code.toUpperCase()})
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export const Header: React.FC = () => {
    const { t } = useTranslation();

    return (
        <header className="relative py-4 mb-8">
            <WeatherWidget />
            <div className="absolute top-4 right-4">
                <LanguageSelector />
            </div>
            <div className="flex flex-col items-center justify-center text-center">
                 <img src={logoSrc} alt="AFRi-iQ Defense Scope AI Geo-Scanner Logo" className="h-16 w-auto mb-2" />
                <h1 className="text-4xl font-extrabold tracking-wider text-blue-500" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>AFRi-iQ Defense Scope AI℠</h1>
                <p className="text-base font-medium text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 tracking-widest mt-2 uppercase">{t('header.tagline')}</p>
                 <a href="mailto:ops-control@afri-iq.defense.ai" className="mt-3 flex items-center gap-2 text-sm text-gray-400 hover:text-cyan-400 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                    <span>ops-control@afri-iq.defense.ai</span>
                </a>
            </div>
        </header>
    );
};