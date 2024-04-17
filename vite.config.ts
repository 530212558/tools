import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteMockServe } from "vite-plugin-mock";
import fs from 'fs';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    // https: true   // 需要开启https服务
    // https: {
    //   key: fs.readFileSync("./ca/dev.koolearn.com-key.pem"),
    //   cert: fs.readFileSync("./ca/dev.koolearn.com.pem"),
    // },
    host: '0.0.0.0',
  },
  plugins: [
    react(),
    viteMockServe({
      mockPath: "./mock",  // mock文件存放的位置
      enable: true, //在开发环境中启用 mock
    }),
  ],
})
