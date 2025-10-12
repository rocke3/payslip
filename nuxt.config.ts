import { defineNuxtConfig } from 'nuxt/config'

// https://nuxt.com/docs/api/configuration/nuxt-config
// Fix: The 'defineNuxtConfig' helper is used without being imported, causing a reference error.
export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: [
    '@nuxtjs/tailwindcss'
  ],

  app: {
    head: {
      title: 'Interactive Professional Payslip',
      script: [
        { src: 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js', defer: true },
        { src: 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js', defer: true }
      ],
      style: [
        {
          innerHTML: `
            @media print {
              body * { visibility: hidden; }
              #payslip-container, #payslip-container * { visibility: visible; }
              #payslip-container { position: absolute; left: 0; top: 0; width: 100%; margin: 0; padding: 0; box-shadow: none; border-radius: 0; }
              .no-print { display: none !important; }
            }
            .editable-field:hover { background-color: rgba(241, 245, 249, 0.5); }
            .editable-field:focus { background-color: rgba(254, 249, 195, 0.5); outline: 1px solid rgba(250, 204, 21, 0.5); }
            .bg-primary { background-color: var(--theme-primary); }
            .text-primary { color: var(--theme-primary); }
            .bg-primary-light { background-color: var(--theme-primary-light); }
            .hover\\:bg-primary-dark:hover { filter: brightness(0.9); }
            .hover\\:bg-primary-lighter:hover { background-color: var(--theme-primary-lighter); }
          `
        }
      ]
    }
  }
})