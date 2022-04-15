# Graces

### 使用说明
- 配置

    进到 graces-web 目录下，修改 `.env.development` 文件中 base api 下的 `localhost:9999` 为 `graces-server` 所在机器的 IP 端口号或域名端口号，如果不修改则默认使用 `localhost:9999` 。
   
    ```shell
      # base api
      VUE_APP_BASE_API = 'http://localhost:9999/api'
      VUE_APP_BASE_WS = 'ws://localhost:9999/api'
    ```
        
    注意：如果 graces-server 和 graces-web 不是部署在同一机器上，则 graces-web 访问 graces-server 可能会出现跨域问题，这时候请参照 graces-server 使用文档中的【关于跨域问题的处理】进行操作。
    
- 启动
    ```shell
    npm install 
    npm run dev
    ```

### 打包说明
  - npm run build 后  将 dist文件夹中  config.json 移动到 static文件夹下
    - 可在外部配置 BASE_URL  BASE_WS