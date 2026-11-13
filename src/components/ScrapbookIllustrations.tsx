import React from 'react';

export function PandaKitKatIllustration({ className = 'w-28 h-28' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 140 140"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Cute panda holding a KitKat chocolate bar"
    >
      {/* Soft warm halo */}
      <circle cx="70" cy="74" r="54" fill="#F8E9E8" opacity="0.7" />
      <circle cx="70" cy="74" r="50" stroke="#C98D9D" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />

      {/* Panda Ears */}
      <circle cx="42" cy="40" r="13" fill="#4A3B3D" />
      <circle cx="42" cy="40" r="6" fill="#C98D9D" opacity="0.5" />
      <circle cx="98" cy="40" r="13" fill="#4A3B3D" />
      <circle cx="98" cy="40" r="6" fill="#C98D9D" opacity="0.5" />

      {/* Panda Body */}
      <ellipse cx="70" cy="100" rx="32" ry="26" fill="#FFFDF9" stroke="#59484A" strokeWidth="2.2" />
      {/* Panda Head */}
      <ellipse cx="70" cy="62" rx="34" ry="29" fill="#FFFDF9" stroke="#59484A" strokeWidth="2.2" />

      {/* Eye Patches */}
      <ellipse cx="56" cy="60" rx="9" ry="11" transform="rotate(-12 56 60)" fill="#4A3B3D" />
      <ellipse cx="84" cy="60" rx="9" ry="11" transform="rotate(12 84 60)" fill="#4A3B3D" />

      {/* Eyes */}
      <circle cx="57" cy="58" r="3" fill="#FFFDF9" />
      <circle cx="83" cy="58" r="3" fill="#FFFDF9" />
      <circle cx="58.5" cy="57" r="1.2" fill="#FFFDF9" />
      <circle cx="84.5" cy="57" r="1.2" fill="#FFFDF9" />

      {/* Rosy Cheeks */}
      <ellipse cx="46" cy="69" rx="6" ry="3.5" fill="#E8A5B2" opacity="0.75" />
      <ellipse cx="94" cy="69" rx="6" ry="3.5" fill="#E8A5B2" opacity="0.75" />

      {/* Nose & Happy Mouth */}
      <ellipse cx="70" cy="66" rx="4" ry="2.8" fill="#4A3B3D" />
      <path d="M65 71C66.8 74 70 73.5 70 70.5C70 73.5 73.2 74 75 71" stroke="#4A3B3D" strokeWidth="2" strokeLinecap="round" />

      {/* KitKat Bar with tiny message slip in Panda's paws */}
      <g transform="rotate(-6 70 98)">
        {/* Chocolate Wafer Fingers */}
        <rect x="44" y="85" width="52" height="24" rx="4" fill="#B84A4A" stroke="#59484A" strokeWidth="1.8" />
        {/* Exposed Chocolate Corner */}
        <path d="M84 85H92C94.2 85 96 86.8 96 89V105C96 107.2 94.2 109 92 109H84V85Z" fill="#6D4C41" stroke="#59484A" strokeWidth="1.5" />
        <line x1="84" y1="97" x2="96" y2="97" stroke="#4E342E" strokeWidth="1.5" />
        {/* Tiny paper slip tied to the KitKat */}
        <rect x="50" y="88" width="30" height="18" rx="2" fill="#FFF7EB" stroke="#8C7771" strokeWidth="1.2" />
        <line x1="55" y1="94" x2="74" y2="94" stroke="#C98D9D" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="55" y1="99" x2="69" y2="99" stroke="#8C7771" strokeWidth="1.2" strokeLinecap="round" />
      </g>

      {/* Panda Paws holding the chocolate */}
      <ellipse cx="44" cy="96" rx="9" ry="7" fill="#4A3B3D" />
      <ellipse cx="96" cy="96" rx="9" ry="7" fill="#4A3B3D" />
    </svg>
  );
}

export function CapybaraBouquetBadge({ className = 'w-20 h-20' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Cute Capybara illustration holding a tiny chocolate bouquet"
    >
      <circle cx="60" cy="60" r="52" fill="#FFF7EB" stroke="#8C7771" strokeWidth="1.5" strokeDasharray="4 4" />
      {/* Capybara Ears */}
      <ellipse cx="38" cy="36" rx="6" ry="8" transform="rotate(-20 38 36)" fill="#8C6D58" stroke="#59484A" strokeWidth="1.8" />
      <ellipse cx="74" cy="36" rx="6" ry="8" transform="rotate(15 74 36)" fill="#8C6D58" stroke="#59484A" strokeWidth="1.8" />
      {/* Capybara Head & Snout */}
      <rect x="32" y="36" width="54" height="44" rx="22" fill="#B59279" stroke="#59484A" strokeWidth="2" />
      <ellipse cx="64" cy="58" rx="18" ry="14" fill="#9E7B64" />
      {/* Calm Capybara Eyes */}
      <path d="M44 50C46 48.5 49 48.5 51 50" stroke="#4A3B3D" strokeWidth="2.2" strokeLinecap="round" />
      {/* Nostrils & Mouth */}
      <circle cx="62" cy="54" r="2" fill="#4A3B3D" />
      <circle cx="71" cy="54" r="2" fill="#4A3B3D" />
      <path d="M64 62C66 64 69 64 71 62" stroke="#4A3B3D" strokeWidth="1.8" strokeLinecap="round" />
      {/* Rosy Cheek */}
      <ellipse cx="47" cy="58" rx="4.5" ry="2.5" fill="#E8A5B2" opacity="0.75" />
      {/* Tiny leaf on Capy's head */}
      <path d="M56 36C56 29 63 26 66 30C63 34 58 36 56 36Z" fill="#B9C9B0" stroke="#59484A" strokeWidth="1.4" />
      {/* Mini Chocolate Bouquet Wrapper */}
      <path d="M46 82L60 104L74 82H46Z" fill="#F8E9E8" stroke="#C98D9D" strokeWidth="1.6" strokeLinejoin="round" />
      <circle cx="55" cy="80" r="5" fill="#7B4B3A" stroke="#59484A" strokeWidth="1.3" />
      <circle cx="65" cy="80" r="5" fill="#9E5A47" stroke="#59484A" strokeWidth="1.3" />
      <circle cx="60" cy="76" r="5" fill="#6D3F30" stroke="#59484A" strokeWidth="1.3" />
    </svg>
  );
}

export function PressedFlowerSprig({ className = 'w-24 h-24' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Pressed dried botanical flower sprig taped to paper"
    >
      {/* Stems */}
      <path
        d="M52 104C55 82 61 58 72 26"
        stroke="#8C7771"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M58 78C48 70 42 60 40 48"
        stroke="#8C7771"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      <path
        d="M63 62C73 56 80 48 84 38"
        stroke="#8C7771"
        strokeWidth="1.3"
        strokeLinecap="round"
      />

      {/* Sage Leaves */}
      <path
        d="M56 84C46 83 41 76 45 71C50 71 55 77 56 84Z"
        fill="#B9C9B0"
        fillOpacity="0.7"
        stroke="#8C7771"
        strokeWidth="1.1"
      />
      <path
        d="M61 69C71 68 77 61 73 56C68 56 62 62 61 69Z"
        fill="#B9C9B0"
        fillOpacity="0.7"
        stroke="#8C7771"
        strokeWidth="1.1"
      />

      {/* Pressed Muted Rose Petals */}
      <circle cx="72" cy="24" r="7" fill="#C98D9D" fillOpacity="0.45" stroke="#C98D9D" strokeWidth="1.2" />
      <circle cx="67" cy="28" r="6" fill="#C98D9D" fillOpacity="0.55" stroke="#C98D9D" strokeWidth="1.2" />
      <circle cx="77" cy="29" r="6" fill="#C98D9D" fillOpacity="0.55" stroke="#C98D9D" strokeWidth="1.2" />
      <circle cx="72" cy="28" r="3" fill="#8C7771" />

      <circle cx="39" cy="45" r="5.5" fill="#C98D9D" fillOpacity="0.45" stroke="#C98D9D" strokeWidth="1.1" />
      <circle cx="43" cy="48" r="4.5" fill="#F8E9E8" stroke="#C98D9D" strokeWidth="1.1" />

      <circle cx="85" cy="36" r="5" fill="#C98D9D" fillOpacity="0.4" stroke="#C98D9D" strokeWidth="1.1" />

      {/* Translucent Washi Tape holding the stem */}
      <rect
        x="40"
        y="84"
        width="34"
        height="11"
        rx="1.5"
        transform="rotate(-14 40 84)"
        fill="#F8E9E8"
        fillOpacity="0.85"
        stroke="#C98D9D"
        strokeWidth="0.9"
        strokeDasharray="2 2"
      />
    </svg>
  );
}

export function WaxSealIcon({ className = 'w-14 h-14' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M40 6C47 6 52 10 58 13C64 16 71 21 73 28C75 35 72 42 71 49C70 56 68 64 62 68C56 72 48 73 40 74C32 75 24 72 18 67C12 62 8 55 7 47C6 39 8 31 12 24C16 17 22 12 28 9C34 6 35 6 40 6Z"
        fill="#C98D9D"
        stroke="#8C7771"
        strokeWidth="1.8"
      />
      <circle cx="40" cy="40" r="24" stroke="#FFF7EB" strokeWidth="1.2" strokeDasharray="3 2" opacity="0.85" />
      <path
        d="M40 49.5C40 49.5 29 42.2 29 34.8C29 31.2 31.8 28.5 35.2 28.5C37.3 28.5 39.1 29.6 40 31.2C40.9 29.6 42.7 28.5 44.8 28.5C48.2 28.5 51 31.2 51 34.8C51 42.2 40 49.5 40 49.5Z"
        fill="#FFF7EB"
        opacity="0.92"
      />
    </svg>
  );
}
