// 构建时环境变量注入脚本
const fs = require('fs');
const path = require('path');

// 读取环境变量
const envVars = {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY || 'your-openai-api-key-here',
    NODE_ENV: process.env.NODE_ENV || 'production'
};

// 生成环境变量注入脚本
const envScript = `// 环境变量 - 构建时生成
window.ENV = ${JSON.stringify(envVars, null, 2)};
console.log('Environment loaded:', window.ENV.NODE_ENV);`;

// 写入环境变量文件
fs.writeFileSync(path.join(__dirname, 'env-loader.js'), envScript);

console.log('Environment variables injected successfully');
console.log('ENV:', envVars);
