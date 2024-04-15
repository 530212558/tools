import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteMockServe } from "vite-plugin-mock";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    viteMockServe({
      mockPath: "./mock",  // mock文件存放的位置
      enable: true, //在开发环境中启用 mock
    })

  ],
})
