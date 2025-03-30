/** @type {import('tailwindcss').Config} */
import { skeleton } from '@skeletonlabs/tw-plugin';

export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      animation: {
        'pulse-success': 'pulse-success 2s infinite',
        'pulse-info': 'pulse-info 2s infinite',
      },
      keyframes: {
        'pulse-success': {
          '0%': {
            'box-shadow': '0 0 0 0 rgba(46, 213, 115, 0.4)',
            transform: 'scale(1)',
          },
          '70%': {
            'box-shadow': '0 0 0 10px rgba(46, 213, 115, 0)',
            transform: 'scale(1.05)',
          },
          '100%': {
            'box-shadow': '0 0 0 0 rgba(46, 213, 115, 0)',
            transform: 'scale(1)',
          },
        },
        'pulse-info': {
          '0%': {
            'box-shadow': '0 0 0 0 rgba(52, 152, 219, 0.4)',
            transform: 'scale(1)',
          },
          '70%': {
            'box-shadow': '0 0 0 10px rgba(52, 152, 219, 0)',
            transform: 'scale(1.05)',
          },
          '100%': {
            'box-shadow': '0 0 0 0 rgba(52, 152, 219, 0)',
            transform: 'scale(1)',
          },
        },
      },
    },
  },
  plugins: [
    skeleton({
      themes: { preset: ['skeleton'] }
    }),
  ],
}