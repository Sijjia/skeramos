'use client';

interface MapProps {
  address?: string;
  className?: string;
}

// 2GIS embed map for Bishkek location
// Using approximate coordinates for Shukurov St. 8
export function Map({ className = '' }: MapProps) {
  // 2GIS widget embed URL for Bishkek
  // Replace with actual coordinates when available
  const mapUrl = 'https://2gis.kg/bishkek/search/%D1%83%D0%BB.%20%D0%A8%D1%83%D0%BA%D1%83%D1%80%D0%BE%D0%B2%D0%B0%208';

  return (
    <div className={`relative w-full h-full ${className}`}>
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2924.1234567890123!2d74.59000001234567!3d42.87460001234567!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDLCsDUyJzI4LjYiTiA3NMKwMzUnMjQuMCJF!5e0!3m2!1sru!2skg!4v1234567890123!5m2!1sru!2skg"
        width="100%"
        height="100%"
        style={{ border: 0, minHeight: '350px' }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Skeramos location"
        className="rounded-xl"
      />

      {/* Fallback link to 2GIS */}
      <a
        href={mapUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg text-sm text-zone-700 hover:bg-white transition-colors shadow-md flex items-center gap-2"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
        2GIS
      </a>
    </div>
  );
}
