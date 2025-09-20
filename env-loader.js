// 环境变量加载器 - 用于本地开发
// 注意：这个文件只在开发环境使用，生产环境不会包含

// 简单的环境变量解析器（避免依赖 Node.js 模块）
function loadEnvVars() {
    // 在浏览器环境中，我们需要手动设置环境变量
    // 或者通过构建工具注入
    
    // 检查是否在本地开发环境
    const isLocalDev = window.location.hostname === 'localhost' || 
                      window.location.hostname === '127.0.0.1';
    
    if (isLocalDev) {
        // 本地开发时的配置
        window.ENV = {
            OPENAI_API_KEY: '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', // 你的真实API Key
            NODE_ENV: 'development'
        };
    } else {
        // 生产环境的配置（Netlify会自动注入环境变量）
        window.ENV = {
            OPENAI_API_KEY: window.ENV?.OPENAI_API_KEY || 'fallback-key',
            NODE_ENV: 'production'
        };
    }
    
    console.log('Environment loaded:', window.ENV.NODE_ENV);
}

// 加载环境变量
loadEnvVars();
