// 导入Firebase配置和认证服务
import app from './firebase-config.js';
import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    sendPasswordResetEmail,
    onAuthStateChanged,
    signInWithPhoneNumber,
    RecaptchaVerifier,
    PhoneAuthProvider,
    signInWithCredential
} from 'firebase/auth';

console.log('认证脚本开始加载');

// 初始化Firebase认证服务
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
let firebaseReady = true;

console.log('Firebase认证服务初始化完成');

// DOM元素变量
let loginForm, registerForm, phoneForm, googleLoginBtn, tabBtns, errorMessage, successMessage;
let loginEmail, loginPassword, registerEmail, registerPassword, confirmPassword, rememberMe, agreeTerms;
let phoneNumber, verificationCode, sendCodeBtn, verificationCodeGroup;
let loginBtn, registerBtn, phoneLoginBtn;
let togglePasswordBtns;

// 认证应用类
class AuthApp {
    constructor() {
        this.init();
    }

    init() {
        console.log('初始化认证应用');
        this.initDOMElements();
        this.setupEventListeners();
        
        if (firebaseReady) {
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
        phoneForm = document.getElementById('phoneForm');
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
        rememberMe = document.getElementById('rememberMe');
        agreeTerms = document.getElementById('agreeTerms');
        phoneNumber = document.getElementById('phoneNumber');
        verificationCode = document.getElementById('verificationCode');
        sendCodeBtn = document.getElementById('sendCodeBtn');
        verificationCodeGroup = document.getElementById('verificationCodeGroup');

        // 按钮元素
        loginBtn = document.getElementById('loginBtn');
        registerBtn = document.getElementById('registerBtn');
        phoneLoginBtn = document.getElementById('phoneLoginBtn');

        // 密码显示/隐藏切换
        togglePasswordBtns = document.querySelectorAll('.toggle-password');

        console.log('DOM元素初始化完成:', {
            loginForm: !!loginForm,
            registerForm: !!registerForm,
            phoneForm: !!phoneForm,
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
        if (phoneForm) {
            phoneForm.addEventListener('submit', (e) => this.handlePhoneLogin(e));
            console.log('电话表单事件已设置');
        }

        // Google登录
        if (googleLoginBtn) {
            googleLoginBtn.addEventListener('click', () => this.handleGoogleLogin());
            console.log('Google登录事件已设置');
        }

        // 发送验证码
        if (sendCodeBtn) {
            sendCodeBtn.addEventListener('click', () => this.sendVerificationCode());
            console.log('发送验证码事件已设置');
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
        if (phoneForm) {
            phoneForm.classList.toggle('active', mode === 'phone');
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
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
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
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
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
            const result = await signInWithPopup(auth, googleProvider);
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

    async handlePhoneLogin(e) {
        e.preventDefault();
        console.log('处理电话登录');
        
        if (!firebaseReady) {
            this.showError('Firebase未就绪，请稍后重试');
            return;
        }

        this.showError('电话登录功能需要Firebase配置，请使用邮箱登录');
    }

    async sendVerificationCode() {
        console.log('发送验证码');
        this.showError('电话登录功能需要Firebase配置，请使用邮箱登录');
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
        
        onAuthStateChanged(auth, (user) => {
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
        errorDiv.innerHTML = '<h3>Firebase加载失败</h3><p>部分功能可能不可用，但基本界面功能正常</p><button onclick="this.parentElement.remove()" style="padding:8px 16px;margin-top:10px;background:#dc3545;color:white;border:none;border-radius:4px;cursor:pointer;">确定</button>';
        document.body.appendChild(errorDiv);
    }
}

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM加载完成，开始初始化认证应用');
    new AuthApp();
});

// 导出给其他模块使用
export { auth };

