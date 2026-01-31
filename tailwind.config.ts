import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                "primary": "#0062ff",
                "background-light": "#f5f6f8",
                "background-dark": "#0f1723",
                "charcoal": "#101318",
                "slate-custom": "#5e708d"
            },
            fontFamily: {
                "display": ["Inter", "sans-serif"]
            },
            borderRadius: {
                "lg": "1rem",
                "xl": "1.5rem",
            },
            boxShadow: {
                'soft': '0 8px 24px rgba(0, 0, 0, 0.04)',
            }
        },
    },
    plugins: [],
};
export default config;
