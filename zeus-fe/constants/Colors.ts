const tintColorLight = '#2f95dc' //color on bottomNav active tab
const tintColorDark = '#fff' //if dark mode color on bottomNav active tab

export default {
  light: {
    text: '#000',
    background: '#fff',
    tint: tintColorLight,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#fff',
    background: '#000',
    tint: tintColorDark,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorDark,
  },
  black: {
    black30Percent: 'hsla(360, 100%, 0%, 0.30)',
    black50Percent: 'hsla(360, 100%, 0%, 0.50)',
  },
}
