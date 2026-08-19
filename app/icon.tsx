import { ImageResponse } from 'next/og';

export const size = {
  width: 48,
  height: 48,
};
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'transparent',
        }}
      >
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Terracotta Flame Backing */}
          <path
            d="M17.5 3C17.5 3 23 8 23 15C23 20 19.5 24 15 25C17 22.5 17.5 19 16 16.5C15 15 14 14 14 12C14 12 11 15 11 18.5C11 19.5 11.2 20.5 11.6 21.4C9.4 19.8 8 17.1 8 14C8 8.5 13.5 5 13.5 5C13.5 5 12.5 8 13.5 10C14.5 9 17.5 3 17.5 3Z"
            fill="#C4552D"
          />
          {/* Green Leaf Accent */}
          <path
            d="M8 15C8 22 13 27 19 28C14 27.5 10 24 9 19C8.5 16.5 8 15 8 15Z"
            fill="#3B5842"
          />
          {/* Golden Pulse Wave */}
          <path
            d="M4 17H10L12.5 12L15.5 21L18.5 14L20.5 17H28"
            stroke="#C9822B"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  );
}
