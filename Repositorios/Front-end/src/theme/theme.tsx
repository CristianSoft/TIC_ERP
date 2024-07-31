import { extendTheme } from '@chakra-ui/react';

export const customTheme = extendTheme({
  components: {
    Button: {
      baseStyle: {
        rounded: 'md',
        color: 'white',
      },
      sizes: {
        custom: {
          width: '153px',
          height: '50px',
        },
      },
      variants: {
        primary: {
          bg: 'brand.blue',
          _hover: { bg: 'primary.default' },
          _active: { bg: 'primary.300' },
        },
        cancel: {
          color: 'text.default',
          bg: 'secondary.100',
          _hover: { bg: 'text.200' },
          _active: { bg: 'text.300', color: 'white' },
        },
      },
      defaultProps: {
        variant: 'primary',
        size: 'custom',
      },
    },
    Input: {
      baseStyle: {
        field: {
          rounded: 'md',
          color: 'text.default',
        },
      },
      sizes: {
        custom: {
          field: {
            width: 'full',
            height: '50px',
            px: 'md',
          },
        },
      },
      variants: {
        primary: {
          field: {
            border: '1px solid',
            borderColor: 'text.200',
            _focus: {
              border: '1px solid',
              borderColor: 'brand.blue',
              color: 'brand.blue',
            },
          },
        },
      },
      defaultProps: {
        variant: 'primary',
        size: 'custom',
      },
    },
    Textarea: {
      baseStyle: {
        rounded: 'md',
        color: 'text.default',
      },
      sizes: {
        custom: {
          width: 'full',
          height: '150px',
          px: 'md',
          py: 'sm',
        },
      },
      variants: {
        primary: {
          border: '1px solid',
          borderColor: 'text.200',
          _focus: {
            border: '1px solid',
            borderColor: 'brand.blue',
            color: 'brand.blue',
          },
        },
      },
      defaultProps: {
        variant: 'primary',
        size: 'custom',
      },
    },
  },
  colors: {
    primary: {
      100: '#F1F5FE',
      200: '#7BA2F7',
      300: '#2D63D7',
      400: '#06276D',
      500: '#172951',
      default: '#06276D',
    },
    secondary: {
      100: '#F0F3FA',
      200: '#BEC8DE',
      300: '#95A2BF',
      400: '#57647F',
      500: '#293142',
      default: '#57647F',
    },
    text: {
      100: '#FFFFFF',
      200: '#D1D2D5',
      300: '#9B9C9E',
      400: '#636465',
      500: '#323233',
      default: '#636465',
    },
    surface: {
      100: '#FAF9F9',
      200: '#F9F9FA',
      300: '#EBECED',
      400: '#E0E1E2',
      500: '#D7D7D9',
      default: '#E0E1E2',
    },
    brand: {
      blue: '#1D89CA',
      grey: '#535557',
      yellow: '#F18A00',
    },
  },

  fonts: {
    heading: 'Century Gothic',
    body: `'Open Sans Variable', sans-serif`,
  },

  fontSizes: {
    'xs': '0.75rem',
    'sm': '0.875rem',
    'md': '1rem',
    'lg': '1.125rem',
    'xl': '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
    '5xl': '3rem',
    '6xl': '3.75rem',
    '7xl': '4.5rem',
    '8xl': '6rem',
    '9xl': '8rem',
    'heading': {
      desktop: {
        1: '56px',
        2: '48px',
        3: '40px',
        title: '32px',
        subtitle: '24px',
      },
      mobile: {
        1: '28px',
        2: '24px',
        3: '20px',
        title: '22px',
        subtitle: '18px',
      },
    },
    'text': {
      xs: '10px',
      sm: '14px',
      md: '16px',
      lg: '18px',
    },
  },

  fontWeights: {
    hairline: 100,
    thin: 200,
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
    black: 900,
  },

  letterSpacings: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },

  space: {
    '3xs': '0.25rem',
    '2xs': '0.5rem',
    'xs': '0.75rem',
    'sm': '1rem',
    'md': '1.5rem',
    'lg': '2rem',
    'xl': '2.5rem',
    '2xl': '3rem',
    '3xl': '3.5rem',
  },
});
