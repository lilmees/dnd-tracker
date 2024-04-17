export const content = [
  './pages/**/*.{vue,js}',
  './layouts/**/*.{vue,js}',
  './components/**/*.{vue,js}',
  './plugins/**/*.{js,ts}',
  './formkit/theme.ts'
]

export const theme = {
  extend: {
    fontFamily: {
      title: ['Geist', 'sans-serif'],
      text: ['GeistMono', 'sans-serif']
    },
    colors: {
      background: '#121111',
      tracker: '#21252E',
      primary: '#7333E0',
      secondary: '#D926AA',
      success: '#36D399',
      info: '#3ABFF8',
      warning: '#FBBD23',
      help: '#1FB2A5',
      danger: '#F87272'
    }
  },
  container: {
    center: true,
    padding: {
      DEFAULT: '1rem',
      sm: '2rem',
      lg: '4rem',
      xl: '5rem',
      '2xl': '6rem'
    }
  },
  screens: {
    sm: '768px',
    md: '1024px',
    lg: '1440px',
    xl: '1920px'
  }
}

export const plugins = []
