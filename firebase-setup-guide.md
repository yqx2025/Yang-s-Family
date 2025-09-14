# Firebase Google登录配置指南

## 1. 检查Firebase控制台设置

### 启用Google认证
1. 访问 [Firebase控制台](https://console.firebase.google.com/)
2. 选择你的项目 "real-207a1"
3. 进入 "Authentication" > "Sign-in method"
4. 确保 "Google" 提供商已启用

### 添加授权域名
1. 在 "Authentication" > "Settings" > "Authorized domains"
2. 添加以下域名：
   - `sample58.netlify.app`
   - `localhost` (开发用)
   - `127.0.0.1` (开发用)

## 2. Google Cloud Console设置

### 配置OAuth同意屏幕
1. 访问 [Google Cloud Console](https://console.cloud.google.com/)
2. 选择项目 "real-207a1"
3. 进入 "APIs & Services" > "OAuth consent screen"
4. 确保应用状态为 "Published" 或添加测试用户

### 配置OAuth 2.0客户端ID
1. 进入 "APIs & Services" > "Credentials"
2. 找到Web应用程序的OAuth 2.0客户端ID
3. 在 "Authorized JavaScript origins" 中添加：
   - `https://sample58.netlify.app`
   - `http://localhost:3000`
4. 在 "Authorized redirect URIs" 中添加：
   - `https://sample58.netlify.app`
   - `http://localhost:3000`

## 3. 代码调试

### 检查浏览器控制台
1. 按F12打开开发者工具
2. 查看Console标签页的错误信息
3. 查看Network标签页的网络请求

### 常见错误
- `auth/popup-blocked`: 浏览器阻止了弹窗
- `auth/unauthorized-domain`: 域名未授权
- `auth/operation-not-allowed`: Google认证未启用
