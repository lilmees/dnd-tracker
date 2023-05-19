export const content = [
  './pages/**/*.{vue,js}',
  './layouts/**/*.{vue,js}',
  './components/**/*.{vue,js}',
  './plugins/**/*.{js,ts}',
  './formkit/**/*.json',
  './formkit.config.ts'
]

export const theme = {
  extend: {
    fontFamily: {
      title: ['Lato', 'sans-serif'],
      text: ['Inter', 'sans-serif'],
      logo: ['Logo', 'sans-serif']
    },
    colors: {
      background: '#0e1315',
      tracker: '#161d21',
      primary: '#9eade6',
      secondary: '#b4bfcd',
      success: '#cede9c',
      info: '#35a4cc',
      warning: '#ffdf8a',
      help: '#b09ce5',
      danger: '#e693a9'
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
