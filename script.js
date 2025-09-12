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

    // 小六壬起课算法
    qiKe() {
        const lunarMonth = this.getCurrentLunarMonth();
        const currentShiChen = this.getCurrentShiChen();
        
        // 获取月将
        const yueJiangZhi = this.yueJiang[lunarMonth];
        const yueJiangIndex = this.diZhi.indexOf(yueJiangZhi);
        
        // 获取时辰索引
        const shiChenIndex = this.diZhi.indexOf(currentShiChen);
        
        // 计算月将加时辰的位置
        const totalIndex = (yueJiangIndex + shiChenIndex) % 12;
        
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

// 五行八字系统
class BaZi {
    constructor() {
        // 天干
        this.tianGan = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
        
        // 地支
        this.diZhi = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
        
        // 五行对应
        this.wuXing = {
            '甲': '木', '乙': '木',
            '丙': '火', '丁': '火',
            '戊': '土', '己': '土',
            '庚': '金', '辛': '金',
            '壬': '水', '癸': '水',
            '子': '水', '丑': '土', '寅': '木', '卯': '木',
            '辰': '土', '巳': '火', '午': '火', '未': '土',
            '申': '金', '酉': '金', '戌': '土', '亥': '水'
        };
        
        // 六十甲子
        this.liuShiJiaZi = this.generateLiuShiJiaZi();
    }

    // 生成六十甲子
    generateLiuShiJiaZi() {
        const jiaZi = [];
        for (let i = 0; i < 60; i++) {
            const gan = this.tianGan[i % 10];
            const zhi = this.diZhi[i % 12];
            jiaZi.push(gan + zhi);
        }
        return jiaZi;
    }

    // 根据年份计算年柱
    getYearPillar(year) {
        // 以1984年甲子年为基准
        const baseYear = 1984;
        const index = (year - baseYear) % 60;
        const adjustedIndex = index < 0 ? index + 60 : index;
        const ganIndex = adjustedIndex % 10;
        const zhiIndex = adjustedIndex % 12;
        
        return {
            gan: this.tianGan[ganIndex],
            zhi: this.diZhi[zhiIndex]
        };
    }

    // 根据年月计算月柱（简化算法）
    getMonthPillar(year, month) {
        const yearGanIndex = this.tianGan.indexOf(this.getYearPillar(year).gan);
        // 简化的月干计算公式
        let monthGanIndex = (yearGanIndex * 2 + month - 1) % 10;
        if (monthGanIndex < 0) monthGanIndex += 10;
        
        // 月支固定对应
        const monthZhiMap = [
            '寅', '卯', '辰', '巳', '午', '未',
            '申', '酉', '戌', '亥', '子', '丑'
        ];
        
        return {
            gan: this.tianGan[monthGanIndex],
            zhi: monthZhiMap[month - 1]
        };
    }

    // 计算日柱（简化算法）
    getDayPillar(year, month, day) {
        // 简化的日柱计算，实际应该用更精确的算法
        const date = new Date(year, month - 1, day);
        const baseDate = new Date(1900, 0, 1); // 1900年1月1日
        const daysDiff = Math.floor((date - baseDate) / (1000 * 60 * 60 * 24));
        const index = (daysDiff + 12) % 60; // 调整基准
        
        const ganIndex = index % 10;
        const zhiIndex = index % 12;
        
        return {
            gan: this.tianGan[ganIndex],
            zhi: this.diZhi[zhiIndex]
        };
    }

    // 根据日干和时辰计算时柱
    getHourPillar(dayGan, hour) {
        const dayGanIndex = this.tianGan.indexOf(dayGan);
        
        // 时辰对应地支
        const hourZhiMap = {
            23: 0, 1: 1, 3: 2, 5: 3, 7: 4, 9: 5,
            11: 6, 13: 7, 15: 8, 17: 9, 19: 10, 21: 11
        };
        
        const zhiIndex = hourZhiMap[hour];
        
        // 时干计算公式
        let ganIndex = (dayGanIndex * 2 + zhiIndex) % 10;
        if (ganIndex < 0) ganIndex += 10;
        
        return {
            gan: this.tianGan[ganIndex],
            zhi: this.diZhi[zhiIndex]
        };
    }

    // 计算八字
    calculateBaZi(year, month, day, hour) {
        const yearPillar = this.getYearPillar(year);
        const monthPillar = this.getMonthPillar(year, month);
        const dayPillar = this.getDayPillar(year, month, day);
        const hourPillar = this.getHourPillar(dayPillar.gan, hour);

        return {
            year: yearPillar,
            month: monthPillar,
            day: dayPillar,
            hour: hourPillar
        };
    }

    // 分析五行
    analyzeWuXing(baZi) {
        const wuXingCount = { '木': 0, '火': 0, '土': 0, '金': 0, '水': 0 };
        
        // 统计八字中各五行的数量
        const elements = [
            baZi.year.gan, baZi.year.zhi,
            baZi.month.gan, baZi.month.zhi,
            baZi.day.gan, baZi.day.zhi,
            baZi.hour.gan, baZi.hour.zhi
        ];
        
        elements.forEach(element => {
            const wuXingElement = this.wuXing[element];
            wuXingCount[wuXingElement]++;
        });
        
        // 分析结果
        const analysis = this.getWuXingAnalysis(wuXingCount);
        
        return {
            count: wuXingCount,
            analysis: analysis
        };
    }

    // 五行分析
    getWuXingAnalysis(wuXingCount) {
        const total = Object.values(wuXingCount).reduce((a, b) => a + b, 0);
        const dominant = Object.keys(wuXingCount).reduce((a, b) => 
            wuXingCount[a] > wuXingCount[b] ? a : b
        );
        const weak = Object.keys(wuXingCount).filter(key => wuXingCount[key] === 0);
        
        let analysis = `您的五行中${dominant}最旺，`;
        
        if (weak.length > 0) {
            analysis += `缺少${weak.join('、')}。`;
        } else {
            analysis += `五行较为均衡。`;
        }
        
        // 添加性格分析
        const personality = this.getPersonalityByWuXing(dominant);
        analysis += personality;
        
        return analysis;
    }

    // 根据主要五行分析性格
    getPersonalityByWuXing(dominant) {
        const personalities = {
            '木': '您性格温和，有同情心，具有向上发展的能力，喜欢自然和艺术。',
            '火': '您性格热情活泼，有领导能力，富有创造力，但有时可能急躁。',
            '土': '您性格稳重踏实，忠诚可靠，有很强的责任心和组织能力。',
            '金': '您性格坚毅果断，有正义感，喜欢公平，但有时可能过于刚硬。',
            '水': '您性格聪明灵活，适应能力强，有智慧，但有时可能过于变化多端。'
        };
        
        return personalities[dominant] || '';
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

        // 显示过程信息
        document.getElementById('yuejiang').textContent = result.yueJiang;
        document.getElementById('shichen').textContent = result.shiChen;
        document.getElementById('qike').textContent = result.result;

        // 延迟显示结果，增加仪式感
        setTimeout(() => {
            this.showDivinationResult(result);
        }, 1500);
    }

    showDivinationResult(result) {
        const resultDiv = document.getElementById('divinationResult');
        
        // 填充结果
        document.getElementById('resultTitle').textContent = result.meaning.title;
        document.getElementById('resultDescription').textContent = result.meaning.description;
        document.getElementById('mainCourse').textContent = result.result;
        document.getElementById('fortune').textContent = result.meaning.fortune;
        document.getElementById('advice').textContent = result.meaning.advice;
        document.getElementById('divinationTime').textContent = result.timestamp;

        // 显示结果
        resultDiv.classList.remove('hidden');
        
        // 滚动到结果位置
        resultDiv.scrollIntoView({ behavior: 'smooth' });
    }

    resetDivination() {
        // 清空问题
        document.getElementById('question').value = '';
        
        // 隐藏过程和结果
        document.getElementById('divinationProcess').classList.add('hidden');
        document.getElementById('divinationResult').classList.add('hidden');
    }

    calculateBazi() {
        // 获取输入值
        const year = parseInt(document.getElementById('birthYear').value);
        const month = parseInt(document.getElementById('birthMonth').value);
        const day = parseInt(document.getElementById('birthDay').value);
        const hour = parseInt(document.getElementById('birthHour').value);

        // 验证输入
        if (!year || !month || !day || !hour) {
            alert('请完整填写出生信息');
            return;
        }

        if (year < 1900 || year > 2100) {
            alert('请输入有效的年份（1900-2100）');
            return;
        }

        if (day < 1 || day > 31) {
            alert('请输入有效的日期');
            return;
        }

        // 计算八字
        const baZi = this.baZi.calculateBaZi(year, month, day, hour);
        const wuXingAnalysis = this.baZi.analyzeWuXing(baZi);

        // 显示结果
        this.showBaziResult(baZi, wuXingAnalysis);
    }

    showBaziResult(baZi, wuXingAnalysis) {
        // 填充四柱
        document.getElementById('yearGan').textContent = baZi.year.gan;
        document.getElementById('yearZhi').textContent = baZi.year.zhi;
        document.getElementById('monthGan').textContent = baZi.month.gan;
        document.getElementById('monthZhi').textContent = baZi.month.zhi;
        document.getElementById('dayGan').textContent = baZi.day.gan;
        document.getElementById('dayZhi').textContent = baZi.day.zhi;
        document.getElementById('hourGan').textContent = baZi.hour.gan;
        document.getElementById('hourZhi').textContent = baZi.hour.zhi;

        // 显示五行分析
        this.showWuXingChart(wuXingAnalysis.count);
        document.getElementById('wuxingDescription').textContent = wuXingAnalysis.analysis;

        // 显示结果区域
        document.getElementById('baziResult').classList.remove('hidden');
        
        // 滚动到结果位置
        document.getElementById('baziResult').scrollIntoView({ behavior: 'smooth' });
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

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
    new FortuneApp();
});
