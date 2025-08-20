"use client";

import { useLanguage } from "@/contexts/LanguageContext";

export default function Footer() {
  const { language } = useLanguage();

  const content = {
    hi: {
      subscribe: "सब्सक्राइब करें",
      newsletter: "न्यूज़लेटर",
      whatsapp: "व्हाट्सऐप",
      twitter: "ट्विटर",
      youtube: "यूट्यूब",
      facebook: "फेसबुक",
      instagram: "इंस्टाग्राम"
    },
    en: {
      subscribe: "Subscribe to",
      newsletter: "Newsletter",
      whatsapp: "WhatsApp",
      twitter: "Twitter",
      youtube: "YouTube",
      facebook: "Facebook",
      instagram: "Instagram"
    }
  };

  const currentContent = content[language];

  return (
    <footer className="bg-[#0d1b2a] text-white py-8 md:py-10">
      <div className="container mx-auto px-4">
        {/* Subscribe to heading */}
        <div className="text-center mb-5 md:mb-6">
          <h3 className="text-2xl md:text-3xl font-semibold">{currentContent.subscribe}</h3>
        </div>

        {/* Social links (icon + label, no boxes) */}
        <div className="flex flex-wrap justify-center items-center gap-6 md:gap-8">
          {/* Newsletter */}
          <a href="#" aria-label="Newsletter" className="flex items-center gap-2 text-base md:text-lg text-gray-200 hover:text-white font-medium">
            <svg className="w-6 h-6 md:w-7 md:h-7" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
            </svg>
            <span>{currentContent.newsletter}</span>
          </a>

          {/* WhatsApp */}
          <a href="#" aria-label="WhatsApp" className="flex items-center gap-2 text-base md:text-lg text-gray-200 hover:text-white font-medium">
            <svg className="w-6 h-6 md:w-7 md:h-7" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.893 3.488"/>
            </svg>
            <span>{currentContent.whatsapp}</span>
          </a>

          {/* Twitter */}
          <a href="#" aria-label="Twitter" className="flex items-center gap-2 text-base md:text-lg text-gray-200 hover:text-white font-medium">
            <svg className="w-6 h-6 md:w-7 md:h-7" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
            </svg>
            <span>{currentContent.twitter}</span>
          </a>

          {/* YouTube */}
          <a href="#" aria-label="YouTube" className="flex items-center gap-2 text-base md:text-lg text-gray-200 hover:text-white font-medium">
            <svg className="w-6 h-6 md:w-7 md:h-7" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
            <span>{currentContent.youtube}</span>
          </a>

          {/* Facebook */}
          <a href="#" aria-label="Facebook" className="flex items-center gap-2 text-base md:text-lg text-gray-200 hover:text-white font-medium">
            <svg className="w-6 h-6 md:w-7 md:h-7" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            <span>{currentContent.facebook}</span>
          </a>

          {/* Instagram */}
          <a href="#" aria-label="Instagram" className="flex items-center gap-2 text-base md:text-lg text-gray-200 hover:text-white font-medium">
            <svg className="w-6 h-6 md:w-7 md:h-7" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.297-3.323C5.902 8.247 7.053 7.757 8.35 7.757s2.448.49 3.323 1.297c.897.897 1.387 2.048 1.387 3.345s-.49 2.448-1.387 3.345c-.875.807-2.026 1.297-3.323 1.297zm7.718 0c-1.297 0-2.448-.49-3.323-1.297-.897-.897-1.387-2.048-1.387-3.345s.49-2.448 1.387-3.345c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.897.897 1.387 2.048 1.387 3.345s-.49 2.448-1.387 3.345c-.875.807-2.026 1.297-3.323 1.297z"/>
            </svg>
            <span>{currentContent.instagram}</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
