import { Global } from '@emotion/react';
import React from 'react';
import '@fontsource-variable/open-sans';

export const Fonts: React.FC = () => (
  <Global
    styles={`
      @font-face {
        font-family: 'Century Gothic';
        font-style: normal;
        font-weight: 400;
        src: url('/fonts/centurygothic.ttf') format('truetype');
      }

      @font-face {
        font-family: 'Open Sans Variable';
        font-style: normal;
        font-weight: 400 700;
        src: url(@fontsource-variable/open-sans/files/open-sans-latin-wght-normal.woff2) format('woff2-variations');
      }
    `}
  />
);
