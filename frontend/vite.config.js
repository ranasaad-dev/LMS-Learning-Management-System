import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
 server: {
    allowedHosts: [
      'lms-production-62a6.up.railway.app', // add your host here
      // you can also add more hosts if needed
    ],
  },
})
