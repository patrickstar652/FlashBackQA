import React from "react";

/**
 * FlashBackQA Logo - 可愛的復古相機圖案
 * @param {string} size - Logo 尺寸，預設 "40px"
 */
const Logo = ({ size = "40px" }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* 漸層定義 */}
      <defs>
        <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#f97316" />
        </linearGradient>
        <linearGradient id="lensGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1e293b" />
          <stop offset="100%" stopColor="#334155" />
        </linearGradient>
        {/* 陰影效果 */}
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.2" />
        </filter>
      </defs>

      {/* 相機主體 */}
      <rect
        x="12"
        y="28"
        width="76"
        height="52"
        rx="12"
        fill="url(#bodyGradient)"
        filter="url(#shadow)"
      />

      {/* 觀景窗凸起 */}
      <path
        d="M32 28 L36 18 H54 L58 28"
        fill="#f59e0b"
      />

      {/* 閃光燈 */}
      <rect x="68" y="20" width="12" height="8" rx="2" fill="#fef3c7" />
      <rect x="70" y="22" width="8" height="4" rx="1" fill="#fde047" />

      {/* 鏡頭外圈 */}
      <circle cx="50" cy="54" r="22" fill="#f5f5f4" />
      
      {/* 鏡頭中圈 */}
      <circle cx="50" cy="54" r="18" fill="url(#lensGradient)" />
      
      {/* 鏡頭內圈 - 眼睛效果 */}
      <circle cx="50" cy="54" r="12" fill="#0f172a" />
      
      {/* 鏡頭反光 - 大 */}
      <ellipse
        cx="44"
        cy="48"
        rx="5"
        ry="4"
        fill="white"
        opacity="0.9"
        transform="rotate(-30 44 48)"
      />
      
      {/* 鏡頭反光 - 小 */}
      <circle cx="56" cy="60" r="2" fill="white" opacity="0.6" />

      {/* 可愛腮紅 - 左 */}
      <ellipse cx="22" cy="58" rx="6" ry="4" fill="#fda4af" opacity="0.7" />
      
      {/* 可愛腮紅 - 右 */}
      <ellipse cx="78" cy="58" rx="6" ry="4" fill="#fda4af" opacity="0.7" />

      {/* 微笑嘴巴 */}
      <path
        d="M42 68 Q50 74 58 68"
        stroke="#92400e"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />

      {/* 回憶閃爍星星 - 右上 */}
      <g transform="translate(82, 12)">
        <path
          d="M4 0 L5 3 L8 4 L5 5 L4 8 L3 5 L0 4 L3 3 Z"
          fill="#fbbf24"
        />
      </g>

      {/* 回憶閃爍星星 - 左上小 */}
      <g transform="translate(8, 18)">
        <path
          d="M3 0 L3.75 2.25 L6 3 L3.75 3.75 L3 6 L2.25 3.75 L0 3 L2.25 2.25 Z"
          fill="#fcd34d"
        />
      </g>
    </svg>
  );
};

export default Logo;
