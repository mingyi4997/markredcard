# MarkRedCard 部署指南

## 🚀 快速部署（推荐方案）

### 方案1：Vercel（免费 + 最快）⭐推荐

**优势**：
- ✅ 完全免费
- ✅ 自动HTTPS
- ✅ 全球CDN加速
- ✅ 自动构建部署
- ✅ 支持自定义域名
- ✅ 零配置，3分钟完成

**步骤**：

1. **注册Vercel账号**
   - 访问 https://vercel.com
   - 使用GitHub账号登录（推荐）

2. **推送代码到GitHub**
   ```bash
   cd /Users/yangshan/Desktop/项目/小红书排版
   git init
   git add .
   git commit -m "Initial commit"
   # 在GitHub创建新仓库，然后：
   git remote add origin https://github.com/你的用户名/markredcard.git
   git branch -M main
   git push -u origin main
   ```

3. **导入到Vercel**
   - 在Vercel控制台点击 "New Project"
   - 选择你的GitHub仓库 "markredcard"
   - 框架预设选择 "Vite"
   - 构建命令：`npm run build`
   - 输出目录：`dist`
   - 点击 "Deploy"

4. **等待部署完成**
   - 3-5分钟后，获得访问链接
   - 例如：https://markredcard.vercel.app

5. **绑定自定义域名（可选）**
   - 在Vercel项目设置中添加域名
   - 在域名DNS添加CNAME记录
   - 指向：cname.vercel-dns.com

---

### 方案2：Netlify（免费 + 简单）

**优势**：
- ✅ 完全免费
- ✅ 自动HTTPS
- ✅ 拖拽部署
- ✅ 表单处理（如需反馈功能）

**步骤**：

1. **注册Netlify**：https://netlify.com
2. **构建项目**：
   ```bash
   npm run build
   ```
3. **拖拽部署**：
   - 将 `dist` 文件夹拖到 Netlify 部署页面
4. **完成**：获得 `your-site.netlify.app`

---

### 方案3：Cloudflare Pages（免费 + 最快国内访问）

**优势**：
- ✅ 完全免费
- ✅ 国内访问快（部分地区）
- ✅ 无限带宽
- ✅ 自动HTTPS

**步骤**：

1. **注册Cloudflare**：https://dash.cloudflare.com
2. **连接GitHub仓库**
3. **构建配置**：
   - 构建命令：`npm run build`
   - 输出目录：`dist`
4. **部署**

---

## 📋 部署前准备

### 1. 环境检查

```bash
# 检查Node.js版本（需要 >= 16）
node -v

# 检查npm版本
npm -v

# 测试本地构建
npm run build

# 预览构建结果
npm run preview
```

### 2. 优化配置

#### a. 添加 `.gitignore`（如果没有）

```bash
# 创建 .gitignore
cat > .gitignore << 'EOF'
# 依赖
node_modules
.pnpm-store

# 构建产物
dist
dist-ssr
*.local

# 编辑器
.vscode/*
!.vscode/extensions.json
.idea
*.swp
*.swo
*~

# 系统
.DS_Store
Thumbs.db

# 环境变量
.env
.env.local
.env.*.local

# 日志
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*

# Vite
.vite
EOF
```

#### b. 优化 `vite.config.ts`

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    // 生产构建优化
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // 移除console
      },
    },
    rollupOptions: {
      output: {
        // 代码分割
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'tiptap-vendor': ['@tiptap/react', '@tiptap/starter-kit'],
        },
      },
    },
  },
})
```

#### c. 添加 `vercel.json`（Vercel部署配置）

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

### 3. 更新 `package.json`

确保有以下脚本：

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0"
  }
}
```

---

## 🔧 自定义域名配置

### 购买域名（推荐平台）

1. **Namecheap**（便宜）：https://namecheap.com
2. **Cloudflare**（免费WHOIS隐私）：https://cloudflare.com
3. **阿里云**（国内）：https://aliyun.com
4. **腾讯云**（国内）：https://dnspod.cn

### DNS配置

假设你的域名是 `markredcard.com`：

#### Vercel DNS设置

```
类型    名称    值
CNAME   @       cname.vercel-dns.com
CNAME   www     cname.vercel-dns.com
```

#### Cloudflare DNS设置

```
类型    名称    值
CNAME   @       your-project.pages.dev
CNAME   www     your-project.pages.dev
```

---

## 🌐 国内部署方案

### 方案1：阿里云OSS + CDN

**步骤**：

1. **开通OSS**：https://oss.console.aliyun.com
2. **创建Bucket**（公共读）
3. **上传构建文件**：
   ```bash
   npm run build
   # 上传 dist/* 到 OSS
   ```
4. **配置静态网站**：
   - 首页：index.html
   - 404页面：index.html（SPA路由支持）
5. **绑定CDN**（加速访问）
6. **绑定域名**（需备案）

**费用**：约￥10-50/月

---

### 方案2：腾讯云COS + CDN

类似阿里云，步骤相同。

**费用**：约￥10-50/月

---

## 📊 性能优化建议

### 1. 图片优化

```bash
# 安装图片压缩插件
npm install -D vite-plugin-imagemin
```

```typescript
// vite.config.ts
import viteImagemin from 'vite-plugin-imagemin'

export default defineConfig({
  plugins: [
    react(),
    viteImagemin({
      gifsicle: { optimizationLevel: 7 },
      optipng: { optimizationLevel: 7 },
      mozjpeg: { quality: 80 },
      pngquant: { quality: [0.8, 0.9], speed: 4 },
      svgo: { plugins: [{ name: 'removeViewBox', active: false }] },
    }),
  ],
})
```

### 2. 代码分割

已在上面的 `vite.config.ts` 中配置。

### 3. 添加PWA支持（可选）

```bash
npm install -D vite-plugin-pwa
```

```typescript
// vite.config.ts
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'MarkRedCard',
        short_name: 'MRC',
        description: '富文本转小红书卡片工具',
        theme_color: '#ffffff',
        icons: [
          {
            src: '/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
  ],
})
```

---

## 🔍 SEO优化

### 更新 `index.html`

```html
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <!-- SEO Meta -->
    <title>MarkRedCard - 富文本转小红书卡片工具</title>
    <meta name="description" content="快速将富文本内容转换为精美的小红书图片卡片，支持图片、表情、多种主题，一键批量导出PNG。" />
    <meta name="keywords" content="小红书,图片制作,卡片生成,富文本编辑器,内容创作" />

    <!-- Open Graph -->
    <meta property="og:title" content="MarkRedCard - 富文本转小红书卡片工具" />
    <meta property="og:description" content="快速将富文本内容转换为精美的小红书图片卡片" />
    <meta property="og:type" content="website" />

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="MarkRedCard" />
    <meta name="twitter:description" content="富文本转小红书卡片工具" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

---

## 📈 数据分析（可选）

### Google Analytics

```html
<!-- 在 index.html 的 <head> 中添加 -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

### 百度统计（国内）

```html
<script>
var _hmt = _hmt || [];
(function() {
  var hm = document.createElement("script");
  hm.src = "https://hm.baidu.com/hm.js?你的统计ID";
  var s = document.getElementsByTagName("script")[0];
  s.parentNode.insertBefore(hm, s);
})();
</script>
```

---

## ⚠️ 注意事项

### 1. 图片大小限制

当前使用base64存储图片，建议：
- 单张图片 < 5MB
- 提示用户压缩大图
- 考虑后续接入图床服务

### 2. 浏览器兼容性

- Chrome 90+
- Safari 14+
- Firefox 88+
- Edge 90+

### 3. 移动端适配

当前版本主要针对桌面端，移动端体验待优化。

---

## 🎯 部署完成检查清单

- [ ] 本地构建成功 (`npm run build`)
- [ ] 本地预览正常 (`npm run preview`)
- [ ] 代码推送到GitHub
- [ ] 选择部署平台（Vercel/Netlify/Cloudflare）
- [ ] 完成部署，获得访问链接
- [ ] 测试所有功能正常
- [ ] （可选）绑定自定义域名
- [ ] （可选）添加SSL证书（平台自动）
- [ ] （可选）配置SEO和分析

---

## 📞 需要帮助？

如遇问题，可以：
1. 查看Vercel文档：https://vercel.com/docs
2. 查看Vite文档：https://vitejs.dev/
3. GitHub Issues

祝部署顺利！🚀
