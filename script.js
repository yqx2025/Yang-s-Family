// Firebase配置
const firebaseConfig = {
    apiKey: "AIzaSyAj7oel9oxDn_ehVoHQK6VspLk6QOgrGhM",
    authDomain: "real-207a1.firebaseapp.com",
    projectId: "real-207a1",
    storageBucket: "real-207a1.firebasestorage.app",
    messagingSenderId: "515418801001",
    appId: "1:515418801001:web:ef0ff22d8e1e584b6b73f8"
};

// 初始化Firebase
let app, auth, db;
let firebaseReady = false;

// 等待Firebase SDK加载并初始化
function initFirebase() {
    try {
        if (window.firebase && window.firebase.auth && window.firebase.firestore) {
            app = firebase.initializeApp(firebaseConfig);
            auth = firebase.auth();
            db = firebase.firestore();
            firebaseReady = true;
            console.log('Firebase初始化成功');
            return true;
        }
        return false;
    } catch (error) {
        console.error('Firebase初始化失败:', error);
        return false;
    }
}

// 小六壬卜卦系统
class XiaoLiuRen {
    constructor() {
        // 十二地支
        this.diZhi = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
        
        // 六神
        this.liuShen = ['大安', '留连', '速喜', '赤口', '小吉', '空亡'];
        
        // 六神对应的地支位置（从大安开始）
        this.liuShenPosition = {
            '大安': 0,  // 寅位
            '留连': 1,  // 卯位  
            '速喜': 2,  // 辰位
            '赤口': 3,  // 巳位
            '小吉': 4,  // 午位
            '空亡': 5   // 未位
        };
        
        // 月将对应关系（农历月份对应地支）
        this.yueJiang = {
            1: '寅',   // 正月建寅
            2: '卯',   // 二月建卯
            3: '辰',   // 三月建辰
            4: '巳',   // 四月建巳
            5: '午',   // 五月建午
            6: '未',   // 六月建未
            7: '申',   // 七月建申
            8: '酉',   // 八月建酉
            9: '戌',   // 九月建戌
            10: '亥',  // 十月建亥
            11: '子',  // 十一月建子
            12: '丑'   // 十二月建丑
        };
        
        // 时辰对应地支
        this.shiChen = {
            23: '子', 1: '丑', 3: '寅', 5: '卯',
            7: '辰', 9: '巳', 11: '午', 13: '未',
            15: '申', 17: '酉', 19: '戌', 21: '亥'
        };
        
        // 六神解释
        this.liuShenMeaning = {
            '大安': {
                title: '大安',
                description: '诸事平安，吉祥如意。所问之事多能顺利，宜静不宜动。',
                fortune: '大吉',
                advice: '保持现状，稳中求进，不宜急躁冒进。'
            },
            '留连': {
                title: '留连',
                description: '事有阻滞，进展缓慢。需要耐心等待，不可强求。',
                fortune: '平',
                advice: '耐心等待时机，多做准备工作，不宜强行推进。'
            },
            '速喜': {
                title: '速喜',
                description: '好消息将至，事情发展迅速。适合行动，多有收获。',
                fortune: '吉',
                advice: '抓住机会，积极行动，但需注意细节。'
            },
            '赤口': {
                title: '赤口',
                description: '口舌是非，易有争执。需要谨言慎行，避免冲突。',
                fortune: '凶',
                advice: '谨言慎行，避免争执，化解矛盾为上策。'
            },
            '小吉': {
                title: '小吉',
                description: '小有收获，吉中带忧。整体较好，但需注意细节。',
                fortune: '小吉',
                advice: '把握小机会，注意细节处理，积小成大。'
            },
            '空亡': {
                title: '空亡',
                description: '所求落空，徒劳无功。不宜行动，宜守不宜攻。',
                fortune: '凶',
                advice: '暂缓行动，重新规划，寻找新的方向。'
            }
        };
    }

    // 获取当前农历月份（简化处理，实际应该用农历算法）
    getCurrentLunarMonth() {
        const now = new Date();
        const month = now.getMonth() + 1;
        // 简化处理，实际应该转换为农历
        return month;
    }

    // 获取当前时辰
    getCurrentShiChen() {
        const now = new Date();
        let hour = now.getHours();
        
        // 处理子时的特殊情况
        if (hour === 0) hour = 23;
        
        // 找到对应的时辰
        const timeRanges = [23, 1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21];
        let shiChenHour = 23;
        
        for (let i = 0; i < timeRanges.length; i++) {
            if (hour >= timeRanges[i] && (i === timeRanges.length - 1 || hour < timeRanges[i + 1])) {
                shiChenHour = timeRanges[i];
                break;
            }
        }
        
        return this.shiChen[shiChenHour];
    }

    // 小六壬起课算法（随机化）
    qiKe() {
        // 随机选择月将（1-12月）
        const randomMonth = Math.floor(Math.random() * 12) + 1;
        const yueJiangZhi = this.yueJiang[randomMonth];
        const yueJiangIndex = this.diZhi.indexOf(yueJiangZhi);
        
        // 随机选择时辰
        const randomShiChenIndex = Math.floor(Math.random() * 12);
        const currentShiChen = this.diZhi[randomShiChenIndex];
        
        // 计算月将加时辰的位置
        const totalIndex = (yueJiangIndex + randomShiChenIndex) % 12;
        
        // 转换为六神位置（大安在寅位，即索引2）
        const daAnIndex = 2; // 寅位
        let liuShenIndex;
        
        if (totalIndex >= daAnIndex) {
            liuShenIndex = (totalIndex - daAnIndex) % 6;
        } else {
            liuShenIndex = (totalIndex + 12 - daAnIndex) % 6;
        }
        
        const result = this.liuShen[liuShenIndex];
        
        return {
            yueJiang: yueJiangZhi,
            shiChen: currentShiChen,
            result: result,
            meaning: this.liuShenMeaning[result],
            timestamp: new Date().toLocaleString('zh-CN')
        };
    }
}

// AI驱动的八字系统（删除所有本地计算逻辑）
class BaZi {
    constructor() {
        // 只保留基本的天干地支数组用于显示
        this.tianGan = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
        this.diZhi = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
    }

    // 不再进行本地计算，完全依赖AI
    async calculateWithAI(year, month, day, hour, name, gender, birthPlace) {
        // 构建完整的出生信息
        const birthInfo = {
            name: name || '用户',
            gender: gender || '未知',
            year: year,
            month: month,
            day: day,
            hour: hour,
            birthPlace: birthPlace || '未知地点'
        };

        // 调用AI进行八字计算和分析
        return await this.requestAIForBaziCalculation(birthInfo);
    }

    // 请求AI进行八字计算
    async requestAIForBaziCalculation(birthInfo) {
        const prompt = `请根据以下出生信息进行专业的八字排盘计算：

姓名：${birthInfo.name}
性别：${birthInfo.gender}
出生时间：${birthInfo.year}年${birthInfo.month}月${birthInfo.day}日 ${this.getShiChenName(birthInfo.hour)}
出生地点：${birthInfo.birthPlace}

请严格按照传统八字排盘规则计算，并返回以下格式的JSON结果：

{
  "bazi": {
    "year": {"gan": "年干", "zhi": "年支"},
    "month": {"gan": "月干", "zhi": "月支"},
    "day": {"gan": "日干", "zhi": "日支"},
    "hour": {"gan": "时干", "zhi": "时支"}
  },
  "wuxing": {
    "count": {"金": 数量, "木": 数量, "水": 数量, "火": 数量, "土": 数量},
    "analysis": "五行分析文字"
  },
  "shishen": "十神分析文字",
  "personality": "性格特征分析文字",
  "career": "事业财运分析文字",
  "relationship": "感情婚姻分析文字",
  "health": "健康运势分析文字",
  "dayun": "大运流年分析文字",
  "comprehensive": "综合建议文字"
}

请确保八字计算准确，分析专业且温和，强调娱乐性质。`;

        try {
            const response = await this.callOpenAI(prompt);
            return this.parseAIResponse(response);
        } catch (error) {
            console.error('AI八字计算失败:', error);
            throw new Error('八字计算失败，请稍后再试');
        }
    }

    // 调用OpenAI API
    async callOpenAI(prompt) {
        const apiKey = "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";
        
        const payload = {
            model: 'gpt-4o',
            messages: [
                { role: 'system', content: '你是一个专业的八字命理师，精通传统八字排盘和命理分析。请严格按照传统规则计算八字，并提供专业、温和、娱乐性的分析建议。' },
                { role: 'user', content: prompt }
            ],
            max_tokens: 2000
        };

        const resp = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify(payload)
        });

        if (!resp.ok) {
            throw new Error('AI服务请求失败');
        }

        const data = await resp.json();
        return data.choices[0].message.content;
    }

    // 解析AI响应
    parseAIResponse(response) {
        try {
            // 尝试解析JSON
            const jsonMatch = response.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }
            
            // 如果不是标准JSON，返回默认结构
            return {
                bazi: {
                    year: { gan: '甲', zhi: '子' },
                    month: { gan: '乙', zhi: '丑' },
                    day: { gan: '丙', zhi: '寅' },
                    hour: { gan: '丁', zhi: '卯' }
                },
                wuxing: {
                    count: { '金': 1, '木': 2, '水': 1, '火': 2, '土': 2 },
                    analysis: response
                },
                shishen: response,
                personality: response,
                career: response,
                relationship: response,
                health: response,
                dayun: response,
                comprehensive: response
            };
        } catch (error) {
            console.error('解析AI响应失败:', error);
            return {
                bazi: {
                    year: { gan: '甲', zhi: '子' },
                    month: { gan: '乙', zhi: '丑' },
                    day: { gan: '丙', zhi: '寅' },
                    hour: { gan: '丁', zhi: '卯' }
                },
                wuxing: {
                    count: { '金': 1, '木': 2, '水': 1, '火': 2, '土': 2 },
                    analysis: 'AI分析生成中，请稍候...'
                },
                shishen: 'AI分析生成中，请稍候...',
                personality: 'AI分析生成中，请稍候...',
                career: 'AI分析生成中，请稍候...',
                relationship: 'AI分析生成中，请稍候...',
                health: 'AI分析生成中，请稍候...',
                dayun: 'AI分析生成中，请稍候...',
                comprehensive: 'AI分析生成中，请稍候...'
            };
        }
    }

    // 获取时辰名称
    getShiChenName(hour) {
        const shiChenMap = {
            '23': '子时', '1': '丑时', '3': '寅时', '5': '卯时',
            '7': '辰时', '9': '巳时', '11': '午时', '13': '未时',
            '15': '申时', '17': '酉时', '19': '戌时', '21': '亥时'
        };
        return shiChenMap[hour] || '未知时辰';
    }
}

// 主应用逻辑
class FortuneApp {
    constructor() {
        this.xiaoLiuRen = new XiaoLiuRen();
        this.baZi = new BaZi();
        this.init();
    }

    init() {
        this.bindEvents();
        this.showTab('xiaoliuren');
    }

    bindEvents() {
        // 导航切换
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tabName = e.target.dataset.tab;
                this.showTab(tabName);
            });
        });

        // 小六壬卜卦
        document.getElementById('startDivination').addEventListener('click', () => {
            this.startDivination();
        });

        document.getElementById('resetDivination').addEventListener('click', () => {
            this.resetDivination();
        });

        // 八字计算
        document.getElementById('calculateBazi').addEventListener('click', () => {
            this.calculateBazi();
        });

        // 回车键触发卜卦
        document.getElementById('question').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.startDivination();
            }
        });

        // （移除 AI 设置弹窗逻辑）
    }

    showTab(tabName) {
        // 隐藏所有标签页
        document.querySelectorAll('.tab-content').forEach(tab => {
            tab.classList.remove('active');
        });
        
        // 移除所有导航按钮的活动状态
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // 显示选中的标签页
        document.getElementById(tabName).classList.add('active');
        
        // 设置对应导航按钮为活动状态
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        
        // 如果切换到个人档案页面，初始化个人档案管理
        if (tabName === 'profile' && window.profileManager) {
            console.log('切换到个人档案页面，准备初始化...');
            // 延迟确保DOM完全渲染
            setTimeout(() => {
                console.log('延迟执行个人档案初始化...');
                window.profileManager.initializeEvents();
                window.profileManager.loadUserInfo();
                window.profileManager.showProfileSection('people');
            }, 300);
        }
    }

    startDivination() {
        const question = document.getElementById('question').value.trim();
        
        if (!question) {
            alert('请输入您要询问的问题');
            return;
        }

        // 显示卜卦过程
        const processDiv = document.getElementById('divinationProcess');
        processDiv.classList.remove('hidden');

        // 执行卜卦
        const result = this.xiaoLiuRen.qiKe();

        // 模拟卜卦过程动画
        this.animateDivinationProcess(result);

        // 延迟显示结果，增加仪式感
        setTimeout(() => {
            this.showDivinationResult(result);
        }, 3000);
    }

    // 模拟卜卦过程动画
    animateDivinationProcess(result) {
        const elements = ['yuejiang', 'shichen', 'qike'];
        const values = [result.yueJiang, result.shiChen, result.result];
        
        elements.forEach((id, index) => {
            const element = document.getElementById(id);
            element.textContent = '';
            element.style.opacity = '0.3';
            
            // 随机显示一些过程文字
            const processTexts = ['计算中...', '推算中...', '分析中...', '起课中...'];
            let textIndex = 0;
            
            const interval = setInterval(() => {
                element.textContent = processTexts[textIndex % processTexts.length];
                textIndex++;
            }, 200);
            
            // 2秒后显示最终结果
            setTimeout(() => {
                clearInterval(interval);
                element.textContent = values[index];
                element.style.opacity = '1';
                element.style.transition = 'opacity 0.5s ease';
            }, 2000 + (index * 300));
        });
    }

    showDivinationResult(result) {
        const resultDiv = document.getElementById('divinationResult');
        
        // 只显示AI解读，隐藏传统解读内容
        resultDiv.classList.remove('hidden');
        
        // 滚动到结果位置
        resultDiv.scrollIntoView({ behavior: 'smooth' });
        
        // 保存算命结果到Firestore
        this.saveFortuneResult('xiaoliuren', result);

        // 显示卦象信息
        this.displayDivinationSymbol(result);

        // 调用AI解读
        this.requestAIAnswer({
            type: 'xiaoliuren',
            prompt: `根据小六壬起课结果进行简洁友善的解读：\n月将：${result.yueJiang}\n时辰：${result.shiChen}\n主课：${result.result}\n吉凶：${result.meaning.fortune}\n建议：${result.meaning.advice}\n请给出面向普通用户的中文建议，包含主课、吉凶和建议的解读，50-120字。`,
            targetId: 'aiDivination'
        });
    }

    // 显示卦象信息
    displayDivinationSymbol(result) {
        const symbolDiv = document.getElementById('divinationSymbol');
        if (!symbolDiv) return;

        // 创建卦象显示
        const symbolHTML = `
            <div class="divination-symbol">
                <h3>卦象信息</h3>
                <div class="symbol-grid">
                    <div class="symbol-item">
                        <span class="symbol-label">月将</span>
                        <span class="symbol-value">${result.yueJiang}</span>
                    </div>
                    <div class="symbol-item">
                        <span class="symbol-label">时辰</span>
                        <span class="symbol-value">${result.shiChen}</span>
                    </div>
                    <div class="symbol-item">
                        <span class="symbol-label">主课</span>
                        <span class="symbol-value">${result.result}</span>
                    </div>
                    <div class="symbol-item">
                        <span class="symbol-label">吉凶</span>
                        <span class="symbol-value ${result.meaning.fortune.includes('吉') ? 'fortune-good' : 'fortune-bad'}">${result.meaning.fortune}</span>
                    </div>
                </div>
            </div>
        `;
        
        symbolDiv.innerHTML = symbolHTML;
        symbolDiv.classList.remove('hidden');
    }

    async saveFortuneResult(type, result) {
        if (!firebaseReady || !auth.currentUser) return;
        
        try {
            const user = auth.currentUser;
            const fortuneData = {
                userId: user.uid,
                type: type,
                question: document.getElementById('question').value || '',
                result: result,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                createdAt: new Date().toISOString()
            };
            
            await db.collection('fortune_results').add(fortuneData);
            console.log('算命结果已保存');
        } catch (error) {
            console.error('保存算命结果失败:', error);
            if (error && (error.code === 'permission-denied' || /Missing or insufficient permissions/i.test(error.message || ''))) {
                console.warn('Firestore 规则拒绝了写入 fortune_results');
            }
        }
    }

    resetDivination() {
        // 清空问题
        document.getElementById('question').value = '';
        
        // 隐藏过程和结果
        document.getElementById('divinationProcess').classList.add('hidden');
        document.getElementById('divinationResult').classList.add('hidden');
        
        // 隐藏卦象信息
        const symbolDiv = document.getElementById('divinationSymbol');
        if (symbolDiv) {
            symbolDiv.classList.add('hidden');
        }
        
        // 重置过程动画元素
        const elements = ['yuejiang', 'shichen', 'qike'];
        elements.forEach(id => {
            const element = document.getElementById(id);
            element.textContent = '';
            element.style.opacity = '1';
            element.style.transition = '';
        });
    }

    async calculateBazi() {
        // 获取输入值
        const year = parseInt(document.getElementById('birthYear').value);
        const month = parseInt(document.getElementById('birthMonth').value);
        const day = parseInt(document.getElementById('birthDay').value);
        const hour = parseInt(document.getElementById('birthHour').value);
        const name = document.getElementById('baziName').value.trim();
        const gender = document.getElementById('baziGender').value;
        const birthPlace = document.getElementById('birthPlace').value.trim();

        // 验证输入
        if (!year || !month || !day || !hour) {
            alert('请填写完整的出生信息');
            return;
        }

        if (year < 1900 || year > 2100) {
            alert('请输入有效的年份（1900-2100）');
            return;
        }

        if (month < 1 || month > 12) {
            alert('请输入有效的月份（1-12）');
            return;
        }

        if (day < 1 || day > 31) {
            alert('请输入有效的日期（1-31）');
            return;
        }

        if (!gender) {
            alert('请选择性别');
            return;
        }

        if (!birthPlace) {
            alert('请填写出生地点');
            return;
        }

        // 显示加载状态
        this.showBaziLoading();

        try {
            // 使用AI计算八字
            const aiResult = await this.baZi.calculateWithAI(year, month, day, hour, name, gender, birthPlace);
            
            // 显示AI结果
            this.showAIBaziResult(aiResult, name, gender, year, month, day, hour, birthPlace);
        } catch (error) {
            console.error('八字计算失败:', error);
            this.showBaziError(error.message);
        }
    }

    // 显示八字加载状态
    showBaziLoading() {
        const resultDiv = document.getElementById('baziResult');
        resultDiv.classList.remove('hidden');
        resultDiv.innerHTML = `
            <h3>八字排盘分析</h3>
            <div style="text-align: center; padding: 40px;">
                <div style="font-size: 18px; color: #667eea; margin-bottom: 20px;">AI 正在计算八字排盘...</div>
                <div style="font-size: 14px; color: #666;">请稍候，这可能需要几秒钟时间</div>
            </div>
        `;
        resultDiv.scrollIntoView({ behavior: 'smooth' });
    }

    // 显示AI八字结果
    showAIBaziResult(aiResult, name, gender, year, month, day, hour, birthPlace) {
        const resultDiv = document.getElementById('baziResult');
        
        // 构建基本信息
        const birthTime = `${year}年${month}月${day}日 ${this.baZi.getShiChenName(hour)}`;
        
        // 构建HTML内容
        resultDiv.innerHTML = `
            <h3>八字排盘分析</h3>
            
            <!-- 基本信息 -->
            <div class="bazi-basic-info">
                <div class="info-item">
                    <span class="info-label">姓名：</span>
                    <span class="info-value">${name || '用户'}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">性别：</span>
                    <span class="info-value">${gender}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">出生时间：</span>
                    <span class="info-value">${birthTime}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">出生地点：</span>
                    <span class="info-value">${birthPlace}</span>
                </div>
            </div>

            <!-- 四柱排盘 -->
            <div class="bazi-pillars-section">
                <h4>四柱排盘</h4>
                <div class="bazi-pillars">
                    <div class="pillar">
                        <div class="pillar-title">年柱</div>
                        <div class="pillar-content">
                            <div class="gan">${aiResult.bazi.year.gan}</div>
                            <div class="zhi">${aiResult.bazi.year.zhi}</div>
                        </div>
                    </div>
                    <div class="pillar">
                        <div class="pillar-title">月柱</div>
                        <div class="pillar-content">
                            <div class="gan">${aiResult.bazi.month.gan}</div>
                            <div class="zhi">${aiResult.bazi.month.zhi}</div>
                        </div>
                    </div>
                    <div class="pillar">
                        <div class="pillar-title">日柱</div>
                        <div class="pillar-content">
                            <div class="gan">${aiResult.bazi.day.gan}</div>
                            <div class="zhi">${aiResult.bazi.day.zhi}</div>
                        </div>
                    </div>
                    <div class="pillar">
                        <div class="pillar-title">时柱</div>
                        <div class="pillar-content">
                            <div class="gan">${aiResult.bazi.hour.gan}</div>
                            <div class="zhi">${aiResult.bazi.hour.zhi}</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 五行分析 -->
            <div class="wuxing-analysis">
                <h4>五行分析</h4>
                <div id="wuxingChart" class="wuxing-chart"></div>
                <div class="analysis-content">${aiResult.wuxing.analysis}</div>
            </div>

            <!-- 十神分析 -->
            <div class="shishen-analysis">
                <h4>十神分析</h4>
                <div class="analysis-content">${aiResult.shishen}</div>
            </div>

            <!-- 性格特征 -->
            <div class="personality-analysis">
                <h4>性格特征</h4>
                <div class="analysis-content">${aiResult.personality}</div>
            </div>

            <!-- 事业财运 -->
            <div class="career-analysis">
                <h4>事业财运</h4>
                <div class="analysis-content">${aiResult.career}</div>
            </div>

            <!-- 感情婚姻 -->
            <div class="relationship-analysis">
                <h4>感情婚姻</h4>
                <div class="analysis-content">${aiResult.relationship}</div>
            </div>

            <!-- 健康运势 -->
            <div class="health-analysis">
                <h4>健康运势</h4>
                <div class="analysis-content">${aiResult.health}</div>
            </div>

            <!-- 大运流年 -->
            <div class="dayun-analysis">
                <h4>大运流年</h4>
                <div class="analysis-content">${aiResult.dayun}</div>
            </div>

            <!-- 综合建议 -->
            <div class="comprehensive-analysis">
                <h4>综合建议</h4>
                <div class="analysis-content">${aiResult.comprehensive}</div>
            </div>
        `;

        // 显示五行图表
        this.showWuXingChart(aiResult.wuxing.count);
        
        // 滚动到结果位置
        resultDiv.scrollIntoView({ behavior: 'smooth' });
        
        // 保存结果到Firestore
        this.saveAIBaziResult(aiResult, name, gender, year, month, day, hour, birthPlace);
    }

    // 显示八字错误
    showBaziError(message) {
        const resultDiv = document.getElementById('baziResult');
        resultDiv.innerHTML = `
            <h3>八字排盘分析</h3>
            <div style="text-align: center; padding: 40px; color: #e53e3e;">
                <div style="font-size: 18px; margin-bottom: 10px;">计算失败</div>
                <div style="font-size: 14px;">${message}</div>
            </div>
        `;
    }

    // 保存AI八字结果到Firestore
    async saveAIBaziResult(aiResult, name, gender, year, month, day, hour, birthPlace) {
        if (!firebaseReady || !auth.currentUser) return;
        
        try {
            const user = auth.currentUser;
            const baziData = {
                userId: user.uid,
                name: name || '用户',
                gender: gender,
                birthYear: year,
                birthMonth: month,
                birthDay: day,
                birthHour: hour,
                birthPlace: birthPlace,
                bazi: aiResult.bazi,
                wuxing: aiResult.wuxing,
                analysis: {
                    shishen: aiResult.shishen,
                    personality: aiResult.personality,
                    career: aiResult.career,
                    relationship: aiResult.relationship,
                    health: aiResult.health,
                    dayun: aiResult.dayun,
                    comprehensive: aiResult.comprehensive
                },
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                createdAtIso: new Date().toISOString()
            };

            await db.collection('fortune_results').add(baziData);
            console.log('AI八字结果已保存到 Firestore');
        } catch (error) {
            console.warn('保存AI八字结果失败:', error);
        }
    }

    showBaziResult(baZi, wuXingAnalysis) {
        // 显示八字结果
        document.getElementById('baziResult').classList.remove('hidden');
        
        // 滚动到结果位置
        document.getElementById('baziResult').scrollIntoView({ behavior: 'smooth' });
        
        // 保存八字结果到Firestore
        this.saveBaziResult(baZi, wuXingAnalysis);

        // 填充基本信息
        this.fillBaziBasicInfo(baZi);
        
        // 填充四柱信息
        this.fillBaziPillars(baZi);
        
        // 显示五行图表
        this.showWuXingChart(wuXingAnalysis.count);

        // 调用AI分析各个章节
        this.requestComprehensiveBaziAnalysis(baZi, wuXingAnalysis);
    }

    // 填充基本信息
    fillBaziBasicInfo(baZi) {
        const year = document.getElementById('birthYear').value;
        const month = document.getElementById('birthMonth').value;
        const day = document.getElementById('birthDay').value;
        const hour = document.getElementById('birthHour').value;
        
        const birthTime = `${year}年${month}月${day}日 ${this.getShiChenName(hour)}`;
        
        document.getElementById('baziName').textContent = '用户';
        document.getElementById('baziGender').textContent = '待选择';
        document.getElementById('baziBirthTime').textContent = birthTime;
        document.getElementById('baziBirthPlace').textContent = '待填写';
    }

    // 填充四柱信息
    fillBaziPillars(baZi) {
        document.getElementById('yearGan').textContent = baZi.year.gan;
        document.getElementById('yearZhi').textContent = baZi.year.zhi;
        document.getElementById('monthGan').textContent = baZi.month.gan;
        document.getElementById('monthZhi').textContent = baZi.month.zhi;
        document.getElementById('dayGan').textContent = baZi.day.gan;
        document.getElementById('dayZhi').textContent = baZi.day.zhi;
        document.getElementById('hourGan').textContent = baZi.hour.gan;
        document.getElementById('hourZhi').textContent = baZi.hour.zhi;
    }

    // 获取时辰名称
    getShiChenName(hour) {
        const shiChenMap = {
            '23': '子时', '1': '丑时', '3': '寅时', '5': '卯时',
            '7': '辰时', '9': '巳时', '11': '午时', '13': '未时',
            '15': '申时', '17': '酉时', '19': '戌时', '21': '亥时'
        };
        return shiChenMap[hour] || '未知时辰';
    }

    // 请求综合八字分析
    async requestComprehensiveBaziAnalysis(baZi, wuXingAnalysis) {
        const basePrompt = `根据以下八字信息进行专业分析：\n年柱：${baZi.year.gan}${baZi.year.zhi}\n月柱：${baZi.month.gan}${baZi.month.zhi}\n日柱：${baZi.day.gan}${baZi.day.zhi}\n时柱：${baZi.hour.gan}${baZi.hour.zhi}\n五行统计：${JSON.stringify(wuXingAnalysis.count)}\n\n请以专业、温和的语调提供娱乐性建议，不涉及医疗、法律、金融等严肃结论。`;

        // 并行请求各个分析章节
        const analyses = [
            { section: '十神分析', prompt: `${basePrompt}\n\n请分析十神关系，包括比肩、劫财、食神、伤官、偏财、正财、七杀、正官、偏印、正印的含义和影响。`, targetId: 'shishenContent' },
            { section: '五行分析', prompt: `${basePrompt}\n\n请分析五行强弱、生克制化关系，以及五行对性格和运势的影响。`, targetId: 'wuxingContent' },
            { section: '大运流年', prompt: `${basePrompt}\n\n请分析大运流年的基本规律和注意事项。`, targetId: 'dayunContent' },
            { section: '性格特征', prompt: `${basePrompt}\n\n请分析基于八字的性格特征，包括优点和需要注意的方面。`, targetId: 'personalityContent' },
            { section: '事业财运', prompt: `${basePrompt}\n\n请分析事业发展和财运方面的特点和建议。`, targetId: 'careerContent' },
            { section: '感情婚姻', prompt: `${basePrompt}\n\n请分析感情婚姻方面的特点和注意事项。`, targetId: 'relationshipContent' },
            { section: '健康运势', prompt: `${basePrompt}\n\n请分析健康方面的特点和养生建议。`, targetId: 'healthContent' },
            { section: '综合建议', prompt: `${basePrompt}\n\n请提供综合性的生活建议和人生指导。`, targetId: 'comprehensiveContent' }
        ];

        // 为每个分析添加加载状态
        analyses.forEach(analysis => {
            const target = document.getElementById(analysis.targetId);
            if (target) {
                target.innerHTML = '<div style="padding:10px;border-left:3px solid #667eea;color:#4a5568;">AI 分析生成中...</div>';
            }
        });

        // 并行执行所有AI分析
        const promises = analyses.map(analysis => 
            this.requestAIAnswer({
                type: 'bazi',
                prompt: analysis.prompt,
                targetId: analysis.targetId
            }).catch(error => {
                console.warn(`${analysis.section} 分析失败:`, error);
                const target = document.getElementById(analysis.targetId);
                if (target) {
                    target.innerHTML = '<div style="padding:10px;border-left:3px solid #e53e3e;color:#c53030;">分析生成失败，请稍后再试。</div>';
                }
            })
        );

        await Promise.all(promises);
    }

    async saveBaziResult(baZi, wuXingAnalysis) {
        if (!firebaseReady || !auth.currentUser) return;
        
        try {
            const user = auth.currentUser;
            const baziData = {
                userId: user.uid,
                type: 'bazi',
                birthInfo: {
                    year: parseInt(document.getElementById('birthYear').value),
                    month: parseInt(document.getElementById('birthMonth').value),
                    day: parseInt(document.getElementById('birthDay').value),
                    hour: parseInt(document.getElementById('birthHour').value)
                },
                baZi: baZi,
                wuXingAnalysis: wuXingAnalysis,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                createdAt: new Date().toISOString()
            };
            
            await db.collection('fortune_results').add(baziData);
            console.log('八字结果已保存');
        } catch (error) {
            console.error('保存八字结果失败:', error);
            if (error && (error.code === 'permission-denied' || /Missing or insufficient permissions/i.test(error.message || ''))) {
                console.warn('Firestore 规则拒绝了写入 fortune_results');
            }
        }
    }

    showWuXingChart(wuXingCount) {
        const chartDiv = document.getElementById('wuxingChart');
        const wuXingColors = {
            '木': '#2ecc71',
            '火': '#e74c3c',
            '土': '#f39c12',
            '金': '#f1c40f',
            '水': '#3498db'
        };

        let chartHTML = '<div style="display: flex; justify-content: space-around; align-items: end; height: 100px; padding: 20px;">';
        
        Object.keys(wuXingCount).forEach(element => {
            const count = wuXingCount[element];
            const height = Math.max(count * 15, 10); // 最小高度10px
            
            chartHTML += `
                <div style="text-align: center;">
                    <div style="
                        width: 40px; 
                        height: ${height}px; 
                        background: ${wuXingColors[element]}; 
                        margin-bottom: 5px;
                        border-radius: 5px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        color: white;
                        font-weight: bold;
                    ">${count}</div>
                    <div style="font-weight: 500; color: #2c3e50;">${element}</div>
                </div>
            `;
        });
        
        chartHTML += '</div>';
        chartDiv.innerHTML = chartHTML;
    }
}

// AI 请求封装（直接在前端调用，需要在“AI设置”中保存 API Key）
// 固定在代码中的 API Key（用户要求）
const OPENAI_API_KEY = "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";

FortuneApp.prototype.requestAIAnswer = async function({ type, prompt, targetId }) {
    try {
        const target = document.getElementById(targetId);
        if (target) {
            target.innerHTML = '<div style="padding:10px;border-left:3px solid #667eea;color:#4a5568;">AI 解读生成中...</div>';
        }

        const apiKey = OPENAI_API_KEY;

        // 直接使用 chat.completions 接口（更稳定）
        const callChatCompletions = async () => {
            const payload = {
                model: 'gpt-4o', // 改用稳定的 gpt-4o
                messages: [
                    { role: 'system', content: '你是一个精通传统文化的小六壬与八字解读助手，请以温和、简洁、尊重的语气提供娱乐性建议，不涉及医疗、法律、金融等严肃结论。' },
                    { role: 'user', content: prompt }
                ],
                max_tokens: 600
            };
            const resp = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify(payload)
            });
            if (!resp.ok) {
                const txt = await resp.text();
                throw new Error(txt || 'chat.completions 接口失败');
            }
            const data = await resp.json();
            console.log('AI chat raw:', data);
            let text = '';
            if (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) {
                text = data.choices[0].message.content;
            }
            console.log('AI extracted text:', text);
            return text;
        };

        let answer = '';
        try {
            answer = await callChatCompletions();
        } catch (e) {
            throw e;
        }

        if (target) {
            const finalText = (answer || '').trim();
            target.innerHTML = finalText ? `<div style="padding:10px;border-left:3px solid #667eea;color:#2d3748;white-space:pre-wrap;">${finalText}</div>` : '<div style="padding:10px;border-left:3px solid #e53e3e;color:#c53030;">AI 解读为空，请稍后再试。</div>';
        }
    } catch (e) {
        const target = document.getElementById(targetId);
        if (target) {
            target.innerHTML = '<div style="padding:10px;border-left:3px solid #e53e3e;color:#c53030;">AI 解读失败，请稍后再试。</div>';
        }
        console.warn('AI 请求失败', e);
    }
};

// 个人档案管理
class ProfileManager {
    constructor() {
        this.currentUser = null;
        this.eventsInitialized = false;
        this.init();
    }

    init() {
        if (auth.currentUser) {
            this.loadUserInfo();
        }
        // 立即尝试绑定全局事件委托
        this.bindGlobalEvents();
        // 兜底：直接绑定按钮点击，确保在部分环境下也能弹出
        const addBtn = document.getElementById('addPersonBtn');
        if (addBtn) {
            addBtn.addEventListener('click', (e) => {
                console.log('直接绑定捕获到添加按钮点击');
                e.preventDefault();
                e.stopPropagation();
                this.showAddPersonModal();
            });
            // 再兜底：内联 onclick，避免捕获/冒泡异常
            if (!addBtn.getAttribute('onclick')) {
                addBtn.setAttribute('onclick', 'try{window.profileManager && window.profileManager.showAddPersonModal();}catch(e){console.error(e)} return false;');
            }
        }
    }

    // 使用事件委托来处理点击事件
    bindGlobalEvents() {
        document.addEventListener('click', (e) => {
            // 处理添加新对象按钮
            if (
                (e.target && e.target.id === 'addPersonBtn') ||
                (e.target && e.target.closest && (e.target.closest('#addPersonBtn') || e.target.closest('.add-person-btn')))
            ) {
                console.log('通过事件委托捕获到添加按钮点击');
                e.preventDefault();
                e.stopPropagation();
                this.showAddPersonModal();
                return;
            }

            // 处理个人档案导航按钮
            if (e.target.classList.contains('profile-nav-btn')) {
                console.log('通过事件委托捕获到导航按钮点击:', e.target.dataset.section);
                const section = e.target.dataset.section;
                this.showProfileSection(section);
                
                // 更新导航状态
                document.querySelectorAll('.profile-nav-btn').forEach(btn => btn.classList.remove('active'));
                e.target.classList.add('active');
                return;
            }

            // 处理弹窗关闭按钮
            if (e.target.id === 'closeModal' || e.target.closest('#closeModal')) {
                console.log('通过事件委托捕获到关闭弹窗点击');
                e.preventDefault();
                this.hideAddPersonModal();
                return;
            }

            // 处理取消按钮
            if (e.target.id === 'cancelAddPerson' || e.target.closest('#cancelAddPerson')) {
                console.log('通过事件委托捕获到取消按钮点击');
                e.preventDefault();
                this.hideAddPersonModal();
                return;
            }
        });

        // 处理表单提交
        document.addEventListener('submit', (e) => {
            if (e.target.id === 'addPersonForm') {
                console.log('通过事件委托捕获到表单提交');
                e.preventDefault();
                this.handleAddPerson(e);
            }
        });

        console.log('全局事件委托已设置');
    }

    // 延迟绑定事件，在切换到个人档案页面时调用（现在主要用于数据加载）
    initializeEvents() {
        console.log('initializeEvents被调用（现在使用事件委托，无需重复绑定）');
        // 事件委托已经在构造函数中设置，这里只需要确保数据加载
        if (!this.eventsInitialized) {
            console.log('标记事件已初始化');
            this.eventsInitialized = true;
        }
    }

    loadUserInfo() {
        const user = auth.currentUser;
        if (user) {
            document.getElementById('userDisplayName').textContent = 
                user.displayName || user.email.split('@')[0];
            document.getElementById('userEmail').textContent = user.email;
        }
    }

    showProfileSection(section) {
        // 隐藏所有内容区域
        const sections = document.querySelectorAll('.profile-content-section');
        sections.forEach(s => s.classList.remove('active'));

        // 显示选中的区域
        const targetSection = document.getElementById(`${section}-section`);
        if (targetSection) {
            targetSection.classList.add('active');
        }

        // 根据选中的区域加载数据
        if (section === 'people') {
            this.loadPeopleList();
        } else if (section === 'history') {
            this.loadHistoryList();
        }
    }

    async loadPeopleList() {
        if (!auth.currentUser) return;

        try {
            // 为避免索引问题，去掉服务端排序，改为客户端排序
            const snapshot = await db.collection('fortune_people')
                .where('userId', '==', auth.currentUser.uid)
                .get();

            const peopleList = document.getElementById('peopleList');
            if (snapshot.empty) {
                peopleList.innerHTML = `
                    <div class="empty-state">
                        <span class="material-icons">person_add</span>
                        <h4>还没有添加算命对象</h4>
                        <p>点击上方按钮添加新的算命对象</p>
                    </div>
                `;
                return;
            }

            // 将结果转为数组并按创建时间降序排序
            const records = [];
            snapshot.forEach(doc => {
                const data = doc.data();
                records.push({ id: doc.id, ...data });
            });

            records.sort((a, b) => {
                const dateA = a.createdAtIso ? new Date(a.createdAtIso).getTime() : (a.createdAt && a.createdAt.toDate ? a.createdAt.toDate().getTime() : 0);
                const dateB = b.createdAtIso ? new Date(b.createdAtIso).getTime() : (b.createdAt && b.createdAt.toDate ? b.createdAt.toDate().getTime() : 0);
                return dateB - dateA;
            });

            let html = '';
            records.forEach(person => {
                html += `
                    <div class="person-card" data-id="${person.id}">
                        <h4>${person.name}</h4>
                        <div class="person-info">
                            出生：${person.birthYear}年${person.birthMonth}月${person.birthDay}日
                            ${this.getShiChenName(person.birthHour)}
                        </div>
                        <div class="person-actions">
                            <button class="btn-small btn-edit" onclick="profileManager.editPerson('${person.id}')">
                                编辑
                            </button>
                            <button class="btn-small btn-delete" onclick="profileManager.deletePerson('${person.id}')">
                                删除
                            </button>
                        </div>
                    </div>
                `;
            });

            peopleList.innerHTML = html;
        } catch (error) {
            console.error('加载人员列表失败:', error);
        }
    }

    async loadHistoryList() {
        if (!auth.currentUser) return;

        try {
            const snapshot = await db.collection('fortune_results')
                .where('userId', '==', auth.currentUser.uid)
                .orderBy('createdAt', 'desc')
                .limit(50)
                .get();

            const historyList = document.getElementById('historyList');
            if (snapshot.empty) {
                historyList.innerHTML = `
                    <div class="empty-state">
                        <span class="material-icons">history</span>
                        <h4>还没有算命记录</h4>
                        <p>开始使用算命功能后，历史记录会显示在这里</p>
                    </div>
                `;
                return;
            }

            let html = '';
            snapshot.forEach(doc => {
                const record = doc.data();
                const date = new Date(record.createdAt).toLocaleString('zh-CN');
                
                let title = '';
                let content = '';
                
                if (record.type === 'xiaoliuren') {
                    title = '小六壬卜卦';
                    content = `问题：${record.question}<br>结果：${record.result.result}`;
                } else if (record.type === 'bazi') {
                    title = '五行八字';
                    content = `出生：${record.birthInfo.year}年${record.birthInfo.month}月${record.birthInfo.day}日`;
                }

                html += `
                    <div class="history-item">
                        <div class="history-header">
                            <h5 class="history-title">${title}</h5>
                            <span class="history-date">${date}</span>
                        </div>
                        <div class="history-type">${record.type === 'xiaoliuren' ? '小六壬' : '八字'}</div>
                        <div class="history-content">${content}</div>
                    </div>
                `;
            });

            historyList.innerHTML = html;
        } catch (error) {
            console.error('加载历史记录失败:', error);
        }
    }

    showAddPersonModal() {
        const modal = document.getElementById('addPersonModal');
        if (!modal) {
            console.warn('未找到 addPersonModal');
            return;
        }
        // 将弹窗移到 body，避免被父容器的样式（如 overflow/backdrop-filter）影响
        if (modal.parentElement !== document.body) {
            console.log('将弹窗节点移到 body 以避免样式影响');
            document.body.appendChild(modal);
        }
        modal.classList.remove('hidden');
        console.log('已显示添加对象弹窗');
    }

    hideAddPersonModal() {
        const modal = document.getElementById('addPersonModal');
        if (modal) {
            modal.classList.add('hidden');
        }
        const form = document.getElementById('addPersonForm');
        if (form) {
            form.reset();
        }
        console.log('已关闭添加对象弹窗');
    }

    async handleAddPerson(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const personData = {
            userId: auth.currentUser.uid,
            name: document.getElementById('personName').value,
            birthYear: parseInt(document.getElementById('personBirthYear').value),
            birthMonth: parseInt(document.getElementById('personBirthMonth').value),
            birthDay: parseInt(document.getElementById('personBirthDay').value),
            birthHour: parseInt(document.getElementById('personBirthHour').value),
            // 同时写 serverTimestamp 和 ISO 字符串，便于排序与审计
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            createdAtIso: new Date().toISOString()
        };

        try {
            await db.collection('fortune_people').add(personData);
            this.hideAddPersonModal();
            this.loadPeopleList();
            console.log('算命对象已添加');
        } catch (error) {
            console.error('添加算命对象失败:', error);
            if (error && (error.code === 'permission-denied' || /Missing or insufficient permissions/i.test(error.message || ''))) {
                alert('添加失败：没有权限。请在 Firestore 规则中允许访问 fortune_people。');
            } else {
                alert('添加失败，请重试');
            }
        }
    }

    async deletePerson(personId) {
        if (!confirm('确定要删除这个算命对象吗？')) return;

        try {
            await db.collection('fortune_people').doc(personId).delete();
            this.loadPeopleList();
            console.log('算命对象已删除');
        } catch (error) {
            console.error('删除算命对象失败:', error);
            alert('删除失败，请重试');
        }
    }

    getShiChenName(hour) {
        const shiChenMap = {
            23: '子时', 1: '丑时', 3: '寅时', 5: '卯时',
            7: '辰时', 9: '巳时', 11: '午时', 13: '未时',
            15: '申时', 17: '酉时', 19: '戌时', 21: '亥时'
        };
        return shiChenMap[hour] || '';
    }
}

// 认证管理
class AuthManager {
    constructor() {
        this.auth = auth;
        this.init();
    }

    init() {
        if (firebaseReady) {
            this.checkAuthState();
            this.addLogoutButton();
        } else {
            // 如果Firebase未就绪，跳转到认证页面
            window.location.href = 'auth.html';
        }
    }

    checkAuthState() {
        this.auth.onAuthStateChanged((user) => {
            if (!user) {
                // 用户未登录，跳转到认证页面
                window.location.href = 'auth.html';
            } else {
                // 登录/注册后确保用户档案写入 Firestore
                this.upsertUserProfile(user).catch((e) => console.warn('写入用户档案失败(index)：', e));
            }
        });
    }

    addLogoutButton() {
        // 优先在导航栏中添加“退出登录”按钮，更醒目
        const nav = document.querySelector('.navigation');
        if (nav) {
            const logoutBtn = document.createElement('button');
            logoutBtn.className = 'nav-btn';
            logoutBtn.title = '退出并清除缓存';
            logoutBtn.innerHTML = '退出登录';
            logoutBtn.addEventListener('click', () => this.handleLogout());
            nav.appendChild(logoutBtn);
            return;
        }

        // 兜底：加到header中，并使用深色样式避免看不见
        const header = document.querySelector('.header');
        if (header) {
            const logoutBtn = document.createElement('button');
            logoutBtn.innerHTML = '<span class="material-icons">logout</span> 退出登录';
            logoutBtn.className = 'logout-btn';
            logoutBtn.style.cssText = `
                background: #ecf0f1;
                border: 1px solid #d0d7de;
                color: #2c3e50;
                padding: 8px 16px;
                border-radius: 8px;
                cursor: pointer;
                font-size: 14px;
                display: inline-flex;
                align-items: center;
                gap: 6px;
                transition: all 0.3s ease;
                position: relative;
            `;
            logoutBtn.addEventListener('click', () => this.handleLogout());
            header.appendChild(logoutBtn);
        }
    }

    async handleLogout() {
        try {
            // 先清理客户端缓存与本地数据
            await this.clearClientCaches();
            // 退出登录
            await this.auth.signOut();
            // 最稳妥的跳转
            window.location.replace('auth.html');
        } catch (error) {
            console.error('登出失败:', error);
        }
    }

    // 清理所有可能的本地缓存：localStorage、sessionStorage、CacheStorage、IndexedDB
    async clearClientCaches() {
        // localStorage / sessionStorage
        try { localStorage.clear(); } catch (e) { console.warn('清理localStorage失败', e); }
        try { sessionStorage.clear(); } catch (e) { console.warn('清理sessionStorage失败', e); }

        // Cache Storage（若存在 Service Worker 或预缓存）
        try {
            if ('caches' in window && caches.keys) {
                const keys = await caches.keys();
                await Promise.all(keys.map((key) => caches.delete(key)));
            }
        } catch (e) { console.warn('清理Cache Storage失败', e); }

        // IndexedDB（Firebase/Firestore/安装信息等都会用）
        try {
            const deleteDb = (name) => new Promise((resolve) => {
                try {
                    const request = indexedDB.deleteDatabase(name);
                    request.onsuccess = () => resolve();
                    request.onerror = () => resolve();
                    request.onblocked = () => resolve();
                } catch (_) { resolve(); }
            });

            if (indexedDB && indexedDB.databases) {
                const dbs = await indexedDB.databases();
                await Promise.all((dbs || []).map((db) => db && db.name ? deleteDb(db.name) : Promise.resolve()));
            } else {
                // Fallback: 常见的Firebase相关数据库名
                const commonDbNames = [
                    'firebaseLocalStorageDb',
                    'firebase-installations-database',
                    'firebase-messaging-database',
                    'firebase-heartbeat-database',
                    'firebase-auth-database',
                    'firestore/[DEFAULT]/real-207a1'
                ];
                await Promise.all(commonDbNames.map(deleteDb));
            }
        } catch (e) { console.warn('清理IndexedDB失败', e); }
    }

    // 写入/合并更新用户档案到 Firestore users/{uid}
    async upsertUserProfile(user) {
        try {
            if (!firebaseReady || !db || !user) return;
            const uid = user.uid;
            const userRef = db.collection('users').doc(uid);
            const now = firebase.firestore.FieldValue.serverTimestamp();
            const providerId = (user.providerData && user.providerData[0] && user.providerData[0].providerId) || 'password';

            const data = {
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

            await userRef.set(data, { merge: true });
            console.log('用户档案已同步到 Firestore');
        } catch (error) {
            console.warn('同步用户档案到 Firestore 失败：', error);
        }
    }
}

// 调试函数
window.debugAddButton = function() {
    console.log('=== 调试添加按钮 ===');
    const btn = document.getElementById('addPersonBtn');
    console.log('按钮元素:', btn);
    if (btn) {
        console.log('按钮可见:', btn.offsetParent !== null);
        console.log('按钮位置:', btn.getBoundingClientRect());
        console.log('父容器:', btn.parentElement);
        console.log('点击测试...');
        btn.click();
    } else {
        console.log('按钮不存在');
    }
};

// 强制显示弹窗的调试函数
window.forceShowModal = function() {
    console.log('=== 强制显示弹窗 ===');
    if (window.profileManager) {
        window.profileManager.showAddPersonModal();
        console.log('弹窗应该已显示');
    } else {
        console.log('ProfileManager不存在');
    }
};

// 测试事件委托的函数
window.testEventDelegation = function() {
    console.log('=== 测试事件委托 ===');
    const btn = document.getElementById('addPersonBtn');
    if (btn) {
        // 创建并派发点击事件
        const event = new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window
        });
        btn.dispatchEvent(event);
        console.log('已派发点击事件');
    } else {
        console.log('按钮不存在');
    }
};

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
    // 等待Firebase加载并初始化
    const checkFirebase = () => {
        if (initFirebase()) {
            new AuthManager();
            new FortuneApp();
            window.profileManager = new ProfileManager();
            
            // 在控制台中添加调试提示
            console.log('应用已初始化！');
            console.log('可用的调试命令:');
            console.log('- debugAddButton() - 调试添加按钮');
            console.log('- forceShowModal() - 强制显示弹窗');
            console.log('- testEventDelegation() - 测试事件委托');
        } else {
            // 如果Firebase未加载，等待一下再试
            setTimeout(checkFirebase, 100);
        }
    };
    
    checkFirebase();
});
