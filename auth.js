// Firebase相关变量
let app, auth, googleProvider;
let getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword;
let signInWithPopup, GoogleAuthProvider, sendPasswordResetEmail, onAuthStateChanged;
let signInWithPhoneNumber, RecaptchaVerifier, PhoneAuthProvider, signInWithCredential;

// 初始化Firebase
async function initFirebase() {
    try {
        console.log('开始加载Firebase模块...');
        app = (await import('./firebase-config.js')).default;
        const authModule = await import('firebase/auth');
        
        getAuth = authModule.getAuth;
        createUserWithEmailAndPassword = authModule.createUserWithEmailAndPassword;
        signInWithEmailAndPassword = authModule.signInWithEmailAndPassword;
        signInWithPopup = authModule.signInWithPopup;
        GoogleAuthProvider = authModule.GoogleAuthProvider;
        sendPasswordResetEmail = authModule.sendPasswordResetEmail;
        onAuthStateChanged = authModule.onAuthStateChanged;
        signInWithPhoneNumber = authModule.signInWithPhoneNumber;
        RecaptchaVerifier = authModule.RecaptchaVerifier;
        PhoneAuthProvider = authModule.PhoneAuthProvider;
        signInWithCredential = authModule.signInWithCredential;
        
        // 初始化认证服务
        auth = getAuth(app);
        googleProvider = new GoogleAuthProvider();
        
        console.log('Firebase模块加载成功');
        return true;
    } catch (error) {
        console.error('Firebase模块加载失败:', error);
        return false;
    }
}

// DOM元素变量
let loginForm, registerForm, phoneForm, googleLoginBtn, tabBtns, errorMessage, successMessage;
let loginEmail, loginPassword, registerEmail, registerPassword, confirmPassword, rememberMe, agreeTerms;
let phoneNumber, verificationCode, sendCodeBtn, verificationCodeGroup;
let loginBtn, registerBtn, phoneLoginBtn;
let togglePasswordBtns;

// 电话认证相关变量
let recaptchaVerifier = null;
let confirmationResult = null;
let countdownTimer = null;

// 初始化应用
class AuthApp {
    constructor() {
        this.init();
    }

    async init() {
        this.initDOMElements();
        this.setupEventListeners();
        
        // 等待Firebase初始化完成
        const firebaseReady = await initFirebase();
        if (firebaseReady) {
            this.checkAuthState();
        } else {
            this.showFirebaseError();
        }
    }

    showFirebaseError() {
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:#f8d7da;color:#721c24;padding:20px;border-radius:8px;z-index:9999;max-width:400px;text-align:center;';
        errorDiv.innerHTML = '<h3>初始化失败</h3><p>Firebase模块未正确加载，请刷新页面重试</p><button onclick="location.reload()" style="padding:8px 16px;margin-top:10px;background:#dc3545;color:white;border:none;border-radius:4px;cursor:pointer;">刷新页面</button>';
        document.body.appendChild(errorDiv);
    }

    initDOMElements() {
        // DOM元素
        loginForm = document.getElementById('loginForm');
        registerForm = document.getElementById('registerForm');
        phoneForm = document.getElementById('phoneForm');
        googleLoginBtn = document.getElementById('googleLoginBtn');
        tabBtns = document.querySelectorAll('.tab-btn');
        errorMessage = document.getElementById('errorMessage');
        successMessage = document.getElementById('successMessage');

        // 调试信息
        console.log('DOM元素初始化:', {
            loginForm: !!loginForm,
            registerForm: !!registerForm,
            phoneForm: !!phoneForm,
            googleLoginBtn: !!googleLoginBtn,
            tabBtns: tabBtns.length,
            errorMessage: !!errorMessage,
            successMessage: !!successMessage
        });

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
    }

    setupEventListeners() {
        console.log('设置事件监听器...');
        
        // 标签切换
        if (tabBtns && tabBtns.length > 0) {
            tabBtns.forEach(btn => {
                btn.addEventListener('click', () => this.switchTab(btn.dataset.mode));
            });
            console.log('标签切换事件已设置');
        } else {
            console.error('未找到标签按钮');
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
        
        const email = loginEmail.value.trim();
        const password = loginPassword.value;

        if (!this.validateLoginForm(email, password)) {
            return;
        }

        this.setLoading(loginBtn, true);

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            this.showSuccess('登录成功！正在跳转...');
            
            // 记住我功能
            if (rememberMe.checked) {
                localStorage.setItem('rememberMe', 'true');
            }

            // 跳转到主页面
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
            
            // 跳转到主页面
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
        this.setLoading(googleLoginBtn, true);

        try {
            const result = await signInWithPopup(auth, googleProvider);
            this.showSuccess('Google登录成功！正在跳转...');
            
            // 跳转到主页面
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);

        } catch (error) {
            this.handleAuthError(error);
        } finally {
            this.setLoading(googleLoginBtn, false);
        }
    }

    async sendVerificationCode() {
        const phone = phoneNumber.value.trim();
        
        if (!this.validatePhoneNumber(phone)) {
            return;
        }

        this.setLoading(sendCodeBtn, true);

        try {
            // 初始化reCAPTCHA
            if (!recaptchaVerifier) {
                recaptchaVerifier = new RecaptchaVerifier('sendCodeBtn', {
                    'size': 'invisible',
                    'callback': (response) => {
                        console.log('reCAPTCHA solved');
                    }
                }, auth);
            }

            // 发送验证码
            const phoneNumberWithCountryCode = '+86' + phone;
            confirmationResult = await signInWithPhoneNumber(auth, phoneNumberWithCountryCode, recaptchaVerifier);
            
            this.showSuccess('验证码已发送到您的手机');
            verificationCodeGroup.style.display = 'block';
            this.startCountdown();

        } catch (error) {
            this.handleAuthError(error);
        } finally {
            this.setLoading(sendCodeBtn, false);
        }
    }

    async handlePhoneLogin(e) {
        e.preventDefault();
        
        const phone = phoneNumber.value.trim();
        const code = verificationCode.value.trim();

        if (!this.validatePhoneNumber(phone)) {
            return;
        }

        if (!code) {
            this.showError('请输入验证码');
            return;
        }

        if (!confirmationResult) {
            this.showError('请先发送验证码');
            return;
        }

        this.setLoading(phoneLoginBtn, true);

        try {
            const result = await confirmationResult.confirm(code);
            this.showSuccess('电话登录成功！正在跳转...');
            
            // 跳转到主页面
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);

        } catch (error) {
            this.handleAuthError(error);
        } finally {
            this.setLoading(phoneLoginBtn, false);
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

    validatePhoneNumber(phone) {
        if (!phone) {
            this.showError('请输入手机号码');
            return false;
        }

        // 中国手机号验证
        const phoneRegex = /^1[3-9]\d{9}$/;
        if (!phoneRegex.test(phone)) {
            this.showError('请输入有效的手机号码');
            return false;
        }

        return true;
    }

    startCountdown() {
        let countdown = 60;
        sendCodeBtn.disabled = true;
        
        countdownTimer = setInterval(() => {
            sendCodeBtn.textContent = `重新发送(${countdown}s)`;
            countdown--;
            
            if (countdown < 0) {
                clearInterval(countdownTimer);
                sendCodeBtn.disabled = false;
                sendCodeBtn.textContent = '发送验证码';
            }
        }, 1000);
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
            case 'auth/invalid-phone-number':
                errorMessage = '手机号码格式不正确';
                break;
            case 'auth/too-many-requests':
                errorMessage = '发送验证码过于频繁，请稍后再试';
                break;
            case 'auth/invalid-verification-code':
                errorMessage = '验证码错误，请重新输入';
                break;
            case 'auth/code-expired':
                errorMessage = '验证码已过期，请重新发送';
                break;
            case 'auth/missing-phone-number':
                errorMessage = '请输入手机号码';
                break;
            default:
                errorMessage = error.message || '登录失败，请重试';
        }

        this.showError(errorMessage);
    }

    setLoading(button, isLoading) {
        const btnText = button.querySelector('.btn-text');
        const loadingSpinner = button.querySelector('.loading-spinner');

        if (isLoading) {
            button.disabled = true;
            btnText.style.opacity = '0';
            loadingSpinner.classList.remove('hidden');
        } else {
            button.disabled = false;
            btnText.style.opacity = '1';
            loadingSpinner.classList.add('hidden');
        }
    }

    showError(message) {
        this.hideMessages();
        errorMessage.querySelector('.error-text').textContent = message;
        errorMessage.classList.remove('hidden');
        
        // 自动隐藏错误消息
        setTimeout(() => {
            this.hideMessages();
        }, 5000);
    }

    showSuccess(message) {
        this.hideMessages();
        successMessage.querySelector('.success-text').textContent = message;
        successMessage.classList.remove('hidden');
    }

    hideMessages() {
        errorMessage.classList.add('hidden');
        successMessage.classList.add('hidden');
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
        onAuthStateChanged(auth, (user) => {
            if (user) {
                // 用户已登录，检查是否需要跳转
                const currentPage = window.location.pathname;
                if (currentPage.includes('auth.html')) {
                    // 如果用户已登录且当前在认证页面，跳转到主页
                    window.location.href = 'index.html';
                }
            }
        });
    }
}

// 忘记密码功能
const forgotPasswordLink = document.querySelector('.forgot-password');
if (forgotPasswordLink) {
    forgotPasswordLink.addEventListener('click', async (e) => {
        e.preventDefault();
        
        const email = loginEmail.value.trim();
        if (!email) {
            alert('请先输入邮箱地址');
            return;
        }

        if (!app.validateEmail(email)) {
            alert('请输入有效的邮箱地址');
            return;
        }

        try {
            await sendPasswordResetEmail(auth, email);
            alert('密码重置邮件已发送，请检查您的邮箱');
        } catch (error) {
            alert('发送失败：' + error.message);
        }
    });
}

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM加载完成，开始初始化认证应用');
    new AuthApp();
});

// 导出给其他模块使用
export { auth };
