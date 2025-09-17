// 简化认证脚本 - 使用Firebase CDN，无模块依赖
console.log('认证脚本开始加载');

// Firebase相关变量
let app, auth, db, googleProvider;
let firebaseReady = false;

// Firebase配置
const firebaseConfig = {
    apiKey: "AIzaSyAj7oel9oxDn_ehVoHQK6VspLk6QOgrGhM",
    authDomain: "real-207a1.firebaseapp.com",
    projectId: "real-207a1",
    storageBucket: "real-207a1.firebasestorage.app",
    messagingSenderId: "515418801001",
    appId: "1:515418801001:web:ef0ff22d8e1e584b6b73f8"
};

// DOM元素变量
let loginForm, registerForm, googleLoginBtn, tabBtns, errorMessage, successMessage;
let loginEmail, loginPassword, registerEmail, registerPassword, confirmPassword, agreeTerms;
let loginBtn, registerBtn;
let togglePasswordBtns;

// 等待Firebase SDK加载完成
function waitForFirebase() {
    return new Promise((resolve) => {
        const checkFirebase = () => {
            if (window.firebase && window.firebase.auth) {
                console.log('Firebase SDK已加载');
                resolve(true);
            } else {
                setTimeout(checkFirebase, 100);
            }
        };
        checkFirebase();
    });
}

// 初始化Firebase
async function initFirebase() {
    try {
        await waitForFirebase();
        
        // 初始化Firebase应用
        app = firebase.initializeApp(firebaseConfig);
        auth = firebase.auth();
        db = firebase.firestore();
        googleProvider = new firebase.auth.GoogleAuthProvider();
        
        firebaseReady = true;
        console.log('Firebase认证服务初始化完成');
        return true;
    } catch (error) {
        console.error('Firebase初始化失败:', error);
        firebaseReady = false;
        return false;
    }
}

// 认证应用类
class AuthApp {
    constructor() {
        this.init();
    }

    async init() {
        console.log('初始化认证应用');
        this.initDOMElements();
        this.setupEventListeners();
        
        // 初始化Firebase
        const firebaseInitialized = await initFirebase();
        
        if (firebaseInitialized) {
            this.checkAuthState();
        } else {
            this.showFirebaseError();
        }
    }

    initDOMElements() {
        console.log('初始化DOM元素');
        
        // DOM元素
        loginForm = document.getElementById('loginForm');
        registerForm = document.getElementById('registerForm');
        googleLoginBtn = document.getElementById('googleLoginBtn');
        tabBtns = document.querySelectorAll('.tab-btn');
        errorMessage = document.getElementById('errorMessage');
        successMessage = document.getElementById('successMessage');

        // 表单元素
        loginEmail = document.getElementById('loginEmail');
        loginPassword = document.getElementById('loginPassword');
        registerEmail = document.getElementById('registerEmail');
        registerPassword = document.getElementById('registerPassword');
        confirmPassword = document.getElementById('confirmPassword');
        agreeTerms = document.getElementById('agreeTerms');

        // 按钮元素
        loginBtn = document.getElementById('loginBtn');
        registerBtn = document.getElementById('registerBtn');

        // 密码显示/隐藏切换
        togglePasswordBtns = document.querySelectorAll('.toggle-password');

        console.log('DOM元素初始化完成:', {
            loginForm: !!loginForm,
            registerForm: !!registerForm,
            googleLoginBtn: !!googleLoginBtn,
            tabBtns: tabBtns.length
        });
    }

    setupEventListeners() {
        console.log('设置事件监听器');
        
        // 标签切换
        if (tabBtns && tabBtns.length > 0) {
            tabBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    console.log('点击标签:', btn.dataset.mode);
                    this.switchTab(btn.dataset.mode);
                });
            });
            console.log('标签切换事件已设置');
        }

        // 表单提交
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
            console.log('登录表单事件已设置');
        }
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => this.handleRegister(e));
            console.log('注册表单事件已设置');
        }

        // Google登录
        if (googleLoginBtn) {
            googleLoginBtn.addEventListener('click', () => this.handleGoogleLogin());
            console.log('Google登录事件已设置');
        }

        // 密码显示/隐藏
        if (togglePasswordBtns && togglePasswordBtns.length > 0) {
            togglePasswordBtns.forEach(btn => {
                btn.addEventListener('click', (e) => this.togglePassword(e));
            });
            console.log('密码切换事件已设置');
        }

        // 实时验证
        if (registerPassword) {
            registerPassword.addEventListener('input', () => this.validatePasswordMatch());
        }
        if (confirmPassword) {
            confirmPassword.addEventListener('input', () => this.validatePasswordMatch());
        }

        console.log('所有事件监听器设置完成');
    }

    switchTab(mode) {
        console.log('切换到标签:', mode);
        
        // 更新标签状态
        if (tabBtns && tabBtns.length > 0) {
            tabBtns.forEach(btn => {
                btn.classList.toggle('active', btn.dataset.mode === mode);
            });
        }

        // 更新表单显示
        if (loginForm) {
            loginForm.classList.toggle('active', mode === 'login');
        }
        if (registerForm) {
            registerForm.classList.toggle('active', mode === 'register');
        }

        // 清除消息
        this.hideMessages();
    }

    async handleLogin(e) {
        e.preventDefault();
        console.log('处理登录');
        
        if (!firebaseReady) {
            this.showError('Firebase未就绪，请稍后重试');
            return;
        }

        const email = loginEmail.value.trim();
        const password = loginPassword.value;

        if (!this.validateLoginForm(email, password)) {
            return;
        }

        this.setLoading(loginBtn, true);

        try {
            const userCredential = await auth.signInWithEmailAndPassword(email, password);
            try {
                await this.saveUserProfile(userCredential.user, { created: false });
            } catch (e) { console.warn('保存用户资料失败(登录)：', e); }
            this.showSuccess('登录成功！正在跳转...');
            
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);

        } catch (error) {
            this.handleAuthError(error);
        } finally {
            this.setLoading(loginBtn, false);
        }
    }

    async handleRegister(e) {
        e.preventDefault();
        console.log('处理注册');
        
        if (!firebaseReady) {
            this.showError('Firebase未就绪，请稍后重试');
            return;
        }

        const email = registerEmail.value.trim();
        const password = registerPassword.value;
        const confirmPass = confirmPassword.value;

        if (!this.validateRegisterForm(email, password, confirmPass)) {
            return;
        }

        this.setLoading(registerBtn, true);

        try {
            const userCredential = await auth.createUserWithEmailAndPassword(email, password);
            try {
                await this.saveUserProfile(userCredential.user, { created: true });
            } catch (e) { console.warn('保存用户资料失败(注册)：', e); }
            this.showSuccess('注册成功！正在跳转...');
            
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);

        } catch (error) {
            this.handleAuthError(error);
        } finally {
            this.setLoading(registerBtn, false);
        }
    }

    async handleGoogleLogin() {
        console.log('处理Google登录');
        
        if (!firebaseReady) {
            this.showError('Firebase未就绪，请稍后重试');
            return;
        }

        this.setLoading(googleLoginBtn, true);

        try {
            const result = await auth.signInWithPopup(googleProvider);
            try {
                await this.saveUserProfile(result.user, { created: false });
            } catch (e) { console.warn('保存用户资料失败(Google)：', e); }
            this.showSuccess('Google登录成功！正在跳转...');
            
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);

        } catch (error) {
            this.handleAuthError(error);
        } finally {
            this.setLoading(googleLoginBtn, false);
        }
    }

    validateLoginForm(email, password) {
        if (!email) {
            this.showError('请输入邮箱地址');
            return false;
        }

        if (!this.isValidEmail(email)) {
            this.showError('请输入有效的邮箱地址');
            return false;
        }

        if (!password) {
            this.showError('请输入密码');
            return false;
        }

        return true;
    }

    validateRegisterForm(email, password, confirmPass) {
        if (!email) {
            this.showError('请输入邮箱地址');
            return false;
        }

        if (!this.isValidEmail(email)) {
            this.showError('请输入有效的邮箱地址');
            return false;
        }

        if (!password) {
            this.showError('请输入密码');
            return false;
        }

        if (password.length < 6) {
            this.showError('密码至少需要6位字符');
            return false;
        }

        if (password !== confirmPass) {
            this.showError('两次输入的密码不一致');
            return false;
        }

        if (!agreeTerms.checked) {
            this.showError('请同意服务条款和隐私政策');
            return false;
        }

        return true;
    }

    validatePasswordMatch() {
        const password = registerPassword.value;
        const confirmPass = confirmPassword.value;

        if (confirmPass && password !== confirmPass) {
            confirmPassword.setCustomValidity('密码不匹配');
            confirmPassword.style.borderColor = '#e53e3e';
        } else {
            confirmPassword.setCustomValidity('');
            confirmPassword.style.borderColor = '#e2e8f0';
        }
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    handleAuthError(error) {
        let errorMessage = '';

        switch (error.code) {
            case 'auth/user-not-found':
                errorMessage = '该邮箱地址未注册';
                break;
            case 'auth/wrong-password':
                errorMessage = '密码错误';
                break;
            case 'auth/email-already-in-use':
                errorMessage = '该邮箱地址已被注册';
                break;
            case 'auth/weak-password':
                errorMessage = '密码强度不够，请使用更复杂的密码';
                break;
            case 'auth/invalid-email':
                errorMessage = '邮箱地址格式不正确';
                break;
            case 'auth/too-many-requests':
                errorMessage = '尝试次数过多，请稍后再试';
                break;
            case 'auth/network-request-failed':
                errorMessage = '网络连接失败，请检查网络设置';
                break;
            case 'auth/popup-closed-by-user':
                errorMessage = '登录被取消';
                break;
            case 'auth/cancelled-popup-request':
                errorMessage = '登录被取消';
                break;
            default:
                errorMessage = error.message || '登录失败，请重试';
        }

        this.showError(errorMessage);
    }

    setLoading(button, isLoading) {
        if (!button) return;
        
        const btnText = button.querySelector('.btn-text');
        const loadingSpinner = button.querySelector('.loading-spinner');

        if (isLoading) {
            button.disabled = true;
            if (btnText) btnText.style.opacity = '0';
            if (loadingSpinner) loadingSpinner.classList.remove('hidden');
        } else {
            button.disabled = false;
            if (btnText) btnText.style.opacity = '1';
            if (loadingSpinner) loadingSpinner.classList.add('hidden');
        }
    }

    showError(message) {
        this.hideMessages();
        if (errorMessage) {
            errorMessage.querySelector('.error-text').textContent = message;
            errorMessage.classList.remove('hidden');
            setTimeout(() => this.hideMessages(), 5000);
        }
    }

    showSuccess(message) {
        this.hideMessages();
        if (successMessage) {
            successMessage.querySelector('.success-text').textContent = message;
            successMessage.classList.remove('hidden');
        }
    }

    hideMessages() {
        if (errorMessage) errorMessage.classList.add('hidden');
        if (successMessage) successMessage.classList.add('hidden');
    }

    togglePassword(e) {
        const button = e.currentTarget;
        const targetId = button.dataset.target;
        const input = document.getElementById(targetId);
        const icon = button.querySelector('.material-icons');

        if (input.type === 'password') {
            input.type = 'text';
            icon.textContent = 'visibility_off';
        } else {
            input.type = 'password';
            icon.textContent = 'visibility';
        }
    }

    checkAuthState() {
        if (!firebaseReady || !auth) return;
        
        auth.onAuthStateChanged((user) => {
            if (user) {
                const currentPage = window.location.pathname;
                if (currentPage.includes('auth.html')) {
                    window.location.href = 'index.html';
                }
            }
        });
    }

    showFirebaseError() {
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:#f8d7da;color:#721c24;padding:20px;border-radius:8px;z-index:9999;max-width:400px;text-align:center;';
        errorDiv.innerHTML = '<h3>Firebase加载失败</h3><p>请检查网络连接并刷新页面</p><button onclick="location.reload()" style="padding:8px 16px;margin-top:10px;background:#dc3545;color:white;border:none;border-radius:4px;cursor:pointer;">刷新页面</button>';
        document.body.appendChild(errorDiv);
    }

    // 将用户信息存储到 Firestore（users/{uid}），重复调用会合并更新
    async saveUserProfile(user, { created }) {
        if (!firebaseReady || !db || !user) return;
        const uid = user.uid;
        const userRef = db.collection('users').doc(uid);

        const providerId = (user.providerData && user.providerData[0] && user.providerData[0].providerId) || 'password';
        const now = firebase.firestore.FieldValue.serverTimestamp();

        const baseData = {
            uid: uid,
            email: (user.email || '').trim(),
            emailLower: (user.email || '').trim().toLowerCase(),
            displayName: user.displayName || (user.email ? user.email.split('@')[0] : ''),
            photoURL: user.photoURL || '',
            emailVerified: !!user.emailVerified,
            providerId: providerId,
            lastLoginAt: now,
            updatedAt: now
        };

        if (created) {
            baseData.createdAt = now;
        }

        await userRef.set(baseData, { merge: true });
    }
}

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM加载完成，开始初始化认证应用');
    new AuthApp();
});
