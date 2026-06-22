(function () {
    emailjs.init("ZmY4BqlPCFFown_xD");

    const API = 'https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard';
    const ACC_KEY = 'wc_accs', PRED_PREFIX = 'wc_pred_', SETTINGS_KEY = 'wc_settings';
    const SITE_START = new Date("2026-06-18T00:00:00");

   const countryMap = new Map([
    // A组
    ['mexico', ['墨西哥', '🇲🇽']],
    ['south africa', ['南非', '🇿🇦']],
    ['korea republic', ['韩国', '🇰🇷']],
    ['czech republic', ['捷克', '🇨🇿']],
    // B组
    ['canada', ['加拿大', '🇨🇦']],
    ['bosnia and herzegovina', ['波黑', '🇧🇦']],
    ['qatar', ['卡塔尔', '🇶🇦']],
    ['switzerland', ['瑞士', '🇨🇭']],
    // C组
    ['brazil', ['巴西', '🇧🇷']],
    ['morocco', ['摩洛哥', '🇲🇦']],
    ['haiti', ['海地', '🇭🇹']],
    ['scotland', ['苏格兰', '🏴󠁧󠁢󠁳󠁣󠁴󠁿']],
    // D组
    ['united states', ['美国', '🇺🇸']],
    ['usa', ['美国', '🇺🇸']], // 保留 USA 简写
    ['paraguay', ['巴拉圭', '🇵🇾']],
    ['australia', ['澳大利亚', '🇦🇺']],
    ['turkey', ['土耳其', '🇹🇷']],
    ['türkiye', ['土耳其', '🇹🇷']], // 保留土耳其语拼写
    // E组
    ['germany', ['德国', '🇩🇪']],
    ['curaçao', ['库拉索', '🇨🇼']],
    ['ivory coast', ['科特迪瓦', '🇨🇮']],
    ['côte d\'ivoire', ['科特迪瓦', '🇨🇮']],
    ['ecuador', ['厄瓜多尔', '🇪🇨']],
    // F组
    ['netherlands', ['荷兰', '🇳🇱']],
    ['japan', ['日本', '🇯🇵']],
    ['sweden', ['瑞典', '🇸🇪']],
    ['tunisia', ['突尼斯', '🇹🇳']],
    // G组
    ['belgium', ['比利时', '🇧🇪']],
    ['egypt', ['埃及', '🇪🇬']],
    ['iran', ['伊朗', '🇮🇷']],
    ['islamic republic of iran', ['伊朗', '🇮🇷']],
    ['ir iran', ['伊朗', '🇮🇷']],
    ['new zealand', ['新西兰', '🇳🇿']],
    // H组
    ['spain', ['西班牙', '🇪🇸']],
    ['cape verde', ['佛得角', '🇨🇻']],
    ['saudi arabia', ['沙特阿拉伯', '🇸🇦']],
    ['uruguay', ['乌拉圭', '🇺🇾']],
    // I组
    ['france', ['法国', '🇫🇷']],
    ['senegal', ['塞内加尔', '🇸🇳']],
    ['iraq', ['伊拉克', '🇮🇶']],
    ['norway', ['挪威', '🇳🇴']],
    // J组
    ['argentina', ['阿根廷', '🇦🇷']],
    ['algeria', ['阿尔及利亚', '🇩🇿']],
    ['austria', ['奥地利', '🇦🇹']],
    ['jordan', ['约旦', '🇯🇴']],
    // K组
    ['portugal', ['葡萄牙', '🇵🇹']],
    ['congo democratic republic', ['民主刚果', '🇨🇩']],
    ['dr congo', ['民主刚果', '🇨🇩']],
    ['uzbekistan', ['乌兹别克斯坦', '🇺🇿']],
    ['colombia', ['哥伦比亚', '🇨🇴']],
    // L组
    ['england', ['英格兰', '🏴󠁧󠁢󠁥󠁮󠁧󠁿']],
    ['croatia', ['克罗地亚', '🇭🇷']],
    ['ghana', ['加纳', '🇬🇭']],
    ['panama', ['巴拿马', '🇵🇦']]
]);
    const venueMap = new Map([
        ['metlife stadium', '大都会人寿体育场'], ['at&t stadium', 'AT&T体育场'],
        ['sofi stadium', 'SoFi体育场'], ['levi\'s stadium', '李维斯体育场'],
        ['mercedes-benz stadium', '梅赛德斯-奔驰体育场'], ['nrg stadium', 'NRG体育场'],
        ['arrowhead stadium', '箭头体育场'], ['gillette stadium', '吉列体育场'],
        ['lincoln financial field', '林肯金融体育场'], ['lumen field', '流明体育场'],
        ['hard rock stadium', '硬石体育场'], ['estadio azteca', '阿兹特克体育场'],
        ['estadio bbva', 'BBVA体育场'], ['estadio akron', '阿克伦体育场'],
        ['bmo field', 'BMO球场'], ['bc place', 'BC广场'],
        ['commonwealth stadium', '联邦体育场'], ['olympic stadium', '奥林匹克体育场'],
        ['saputo stadium', '萨普托体育场'], ['tim hortons field', '蒂姆·霍顿斯球场'],
        ['allegiant stadium', '忠诚体育场'], ['state farm stadium', '州立农场体育场'],
        ['bank of america stadium', '美国银行体育场'], ['exploria stadium', '探索体育场'],
        ['inter&co stadium', 'Inter&Co体育场'], ['geodis park', '乔迪斯公园'],
        ['snapdragon stadium', '骁龙体育场'],
    ]);

    function translateVenue(venueObj) {
        if (!venueObj) return '';
        const name = venueObj.fullName || venueObj.displayName || '';
        if (!name) return '';
        const lower = name.toLowerCase().trim();
        if (venueMap.has(lower)) return venueMap.get(lower);
        for (const [key, value] of venueMap) {
            if (lower.includes(key) || key.includes(lower)) return value;
        }
        return '';
    }

    const getCountry = (name) => {
        if (!name) return ['未知', '🏳️'];
        let raw = name.trim().replace(/\s*\(.*?\)\s*/, '').replace(/\s*national\s*team\s*/gi, '').toLowerCase();
        if (countryMap.has(raw)) return countryMap.get(raw);
        for (let [k, v] of countryMap) if (raw.includes(k) || k.includes(raw)) return v;
        return ['⚠️ ' + name, '🏳️'];
    };

    const fmtTime = (iso) => {
        if (!iso) return '';
        const d = new Date(iso);
        if (isNaN(d)) return '';
        const y = d.getFullYear();
        const mo = d.getMonth() + 1;
        const da = d.getDate();
        const h = String(d.getHours()).padStart(2, '0');
        const mi = String(d.getMinutes()).padStart(2, '0');
        return `${y}年${mo}月${da}日 ${h}:${mi}`;
    };

    function getInjuryTime(ev) {
        const details = ev.status?.type?.shortDetail || ev.status?.displayClock || '';
        const match = details.match(/'\+(\d+)'/);
        if (match) return parseInt(match[1]);
        return null;
    }

    const calcDuration = (startISO, statusType, injuryMinutes) => {
        if (!startISO) return { text: '', injury: injuryMinutes || null };
        const start = new Date(startISO);
        if (isNaN(start)) return { text: '', injury: injuryMinutes || null };
        const now = Date.now();
        const diffMs = now - start;
        const diffMinutes = Math.floor(diffMs / 60000);

        if (statusType === 'STATUS_IN_PROGRESS' || statusType === 'STATUS_HALFTIME') {
            if (diffMinutes <= 0) return { text: '⚡ 刚刚开始', injury: injuryMinutes };
            const h = Math.floor(diffMinutes / 60);
            const m = diffMinutes % 60;
            const elapsed = h > 0 ? `⏳ 已开赛 ${h}小时${m}分钟` : `⏳ 已开赛 ${m}分钟`;
            return { text: elapsed, injury: injuryMinutes };
        }
        if (statusType === 'STATUS_FINAL' || statusType === 'STATUS_FULL_TIME') {
            return { text: '🏁 比赛已结束', injury: null };
        }

        const remainingMs = Math.abs(diffMs);
        const totalSec = Math.floor(remainingMs / 1000);
        const days = Math.floor(totalSec / 86400);
        const hours = Math.floor((totalSec % 86400) / 3600);
        const mins = Math.floor((totalSec % 3600) / 60);
        const secs = totalSec % 60;
        return {
            text: `⏰ 距开始 ${days}天${hours}时${mins}分${secs}秒`,
            injury: null
        };
    };

    // ==================== 账号管理 ====================
    let currentAcc = '默认账号';
    const loadAccs = () => { try { return JSON.parse(localStorage.getItem(ACC_KEY)) || { list: ['默认账号'], current: '默认账号' }; } catch (e) { return { list: ['默认账号'], current: '默认账号' }; } };
    const saveAccs = (d) => localStorage.setItem(ACC_KEY, JSON.stringify(d));
    const switchAcc = (name) => {
        const a = loadAccs(); if (!a.list.includes(name)) return;
        a.current = name; saveAccs(a); currentAcc = name;
        updateAccUI(); fetchAndRender();
    };
    const createAcc = (name) => {
        if (!name || !name.trim()) return;
        name = name.trim(); const a = loadAccs();
        if (a.list.includes(name)) return alert('已存在');
        a.list.push(name); a.current = name; saveAccs(a); currentAcc = name;
        updateAccUI(); fetchAndRender();
    };
    const delAcc = (name) => {
        if (name === '默认账号') return;
        const a = loadAccs(); if (!a.list.includes(name)) return;
        if (!confirm(`删除“${name}”及所有竞猜？`)) return;
        localStorage.removeItem(PRED_PREFIX + name);
        a.list = a.list.filter(x => x !== name);
        if (a.current === name) a.current = '默认账号';
        saveAccs(a); currentAcc = a.current;
        updateAccUI(); fetchAndRender();
    };
    const getPreds = () => { try { return JSON.parse(localStorage.getItem(PRED_PREFIX + currentAcc)) || {}; } catch (e) { return {}; } };
    const savePred = (id, data) => {
        const all = getPreds();
        if (!data || Object.keys(data).length === 0) delete all[id];
        else all[id] = data;
        localStorage.setItem(PRED_PREFIX + currentAcc, JSON.stringify(all));
    };
    const clearAllPreds = () => {
        if (!confirm(`⚠️ 确定清空账号“${currentAcc}”的所有竞猜数据吗？此操作不可恢复！`)) return;
        localStorage.removeItem(PRED_PREFIX + currentAcc);
        fetchAndRender();
    };

    // ==================== 通知与设置 ====================
    let lastCorrectCount = 0;
    function loadSettings() { try { return JSON.parse(localStorage.getItem(SETTINGS_KEY)) || { email: '', sendEmail: false, playSound: true }; } catch (e) { return { email: '', sendEmail: false, playSound: true }; } }
    function saveSettings(s) { localStorage.setItem(SETTINGS_KEY, JSON.stringify(s)); }

    function playNotificationSound() {
        try {
            const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            const now = audioCtx.currentTime;
            const osc1 = audioCtx.createOscillator();
            const osc2 = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc1.type = 'sine'; osc1.frequency.setValueAtTime(800, now);
            osc2.type = 'sine'; osc2.frequency.setValueAtTime(1200, now + 0.1);
            gain.gain.setValueAtTime(0.3, now);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);
            osc1.connect(gain); osc2.connect(gain);
            gain.connect(audioCtx.destination);
            osc1.start(now); osc1.stop(now + 0.15);
            osc2.start(now + 0.1); osc2.stop(now + 0.35);
        } catch (e) { console.warn('音效播放失败'); }
    }

    function showDesktopNotification(title, body) {
        if (Notification.permission === 'granted') {
            new Notification(title, { body, icon: '⚽' });
        } else if (Notification.permission !== 'denied') {
            Notification.requestPermission().then(p => {
                if (p === 'granted') new Notification(title, { body, icon: '⚽' });
            });
        }
    }

    function sendEmailNotification(matchInfo) {
        const settings = loadSettings();
        if (!settings.sendEmail || !settings.email) return;
        emailjs.send("service_bv4rkfm", "template_aqf0c2k", {
            to_email: settings.email,
            correct: matchInfo.correct,
            account: currentAcc,
            time: new Date().toLocaleString('zh-CN')
        }).then(() => console.log('邮件已发送'))
          .catch(err => console.warn('邮件发送失败:', err));
    }

    function checkAndNotify(newCorrect) {
        if (newCorrect > lastCorrectCount) {
            const settings = loadSettings();
            if (settings.playSound) playNotificationSound();
            showDesktopNotification('竞猜命中！', `您有 ${newCorrect} 项预测正确`);
            sendEmailNotification({ correct: newCorrect });
        }
        lastCorrectCount = newCorrect;
    }

    function openSettings() {
        const settings = loadSettings();
        const overlay = document.createElement('div');
        overlay.className = 'settings-overlay';
        overlay.innerHTML = `
            <div class="settings-box">
                <h3>⚙️ 通知设置</h3>
                <div class="settings-row">
                    <label>邮箱地址</label>
                    <input type="email" id="setEmail" placeholder="your@email.com" value="${settings.email}">
                </div>
                <div class="settings-row">
                    <label>发送邮件</label>
                    <input type="checkbox" id="setSendEmail" ${settings.sendEmail ? 'checked' : ''}>
                    <span style="color:#94a3b8;font-size:0.7rem;">使用EmailJS</span>
                </div>
                <div class="settings-row">
                    <label>播放声音</label>
                    <input type="checkbox" id="setPlaySound" ${settings.playSound ? 'checked' : ''}>
                </div>
                <div class="settings-actions">
                    <button class="btn" id="saveSettingsBtn">保存</button>
                    <button class="btn" id="closeSettingsBtn">取消</button>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);
        document.getElementById('saveSettingsBtn').onclick = () => {
            const email = document.getElementById('setEmail').value.trim();
            const sendEmail = document.getElementById('setSendEmail').checked;
            const playSound = document.getElementById('setPlaySound').checked;
            saveSettings({ email, sendEmail, playSound });
            document.body.removeChild(overlay);
        };
        document.getElementById('closeSettingsBtn').onclick = () => document.body.removeChild(overlay);
    }

    // ==================== 渲染逻辑 ====================
    const clockEl = document.getElementById('beijingClock');
    const matchContainer = document.getElementById('matchContainer');
    const updateTimeEl = document.getElementById('updateTime');
    const totalEl = document.getElementById('totalPred'), correctEl = document.getElementById('correctPred'), pendingEl = document.getElementById('pendingPred');
    const accSelect = document.getElementById('accountSelect');
    const runTimeEl = document.getElementById('runTime');

    const updateClock = () => {
        const now = new Date();
        clockEl.textContent = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}.${String(now.getMilliseconds()).padStart(3, '0')}`;
    };
    function updateRunTime() {
        const now = new Date();
        let diff = now - SITE_START;
        if (diff < 0) diff = 0;
        const totalSeconds = Math.floor(diff / 1000);
        const sec = totalSeconds % 60;
        const totalMinutes = Math.floor(totalSeconds / 60);
        const min = totalMinutes % 60;
        const totalHours = Math.floor(totalMinutes / 60);
        const hour = totalHours % 24;
        const totalDays = Math.floor(totalHours / 24);
        const year = Math.floor(totalDays / 365);
        const remainingDays = totalDays % 365;
        const month = Math.floor(remainingDays / 30);
        const day = remainingDays % 30;
        runTimeEl.textContent = `${year}年${month}月${day}日 ${hour}时${min}分${sec}秒`;
    }

    let latestEvents = [];

    const openDialog = (matchId, home, away) => {
        const pred = getPreds()[matchId] || {};
        // 兼容旧数据
        if (typeof pred.winner === 'string' && pred.winner) pred.winner = [pred.winner];
        if (typeof pred.totalGoals === 'number') pred.totalGoals = [pred.totalGoals];
        if (pred.handicap && pred.handicap.pick && !pred.handicap.picks) {
            pred.handicap.picks = [pred.handicap.pick];
        }

        const winnerPicks = pred.winner || [];
        const totalGoalPicks = pred.totalGoals || [];
        const handicapLine = pred.handicap?.line ?? '';
        const handicapPicks = pred.handicap?.picks || [];

        const winnerOptions = ['home', 'draw', 'away'];
        const winnerLabels = { home: '主胜', draw: '平局', away: '客胜' };
        const winnerHtml = winnerOptions.map(opt => `
            <label class="handicap-option ${winnerPicks.includes(opt) ? 'active' : ''}">
                <input type="checkbox" value="${opt}" ${winnerPicks.includes(opt) ? 'checked' : ''}>
                ${winnerLabels[opt]}
            </label>
        `).join('');

        const totalGoalsOptions = ['0', '1', '2', '3', '4', '5', '6', '7'];
        const totalHtml = totalGoalsOptions.map(num => `
            <label class="handicap-option ${totalGoalPicks.includes(parseInt(num)) ? 'active' : ''}">
                <input type="checkbox" value="${num}" ${totalGoalPicks.includes(parseInt(num)) ? 'checked' : ''}>
                ${num === '7' ? '7+' : num}
            </label>
        `).join('');

        const handicapOptions = ['home', 'draw', 'away'];
        const handicapLabels = { home: '让球主胜', draw: '让球平', away: '让球客胜' };
        const handicapHtml = handicapOptions.map(opt => `
            <label class="handicap-option ${handicapPicks.includes(opt) ? 'active' : ''}">
                <input type="checkbox" value="${opt}" ${handicapPicks.includes(opt) ? 'checked' : ''}>
                ${handicapLabels[opt]}
            </label>
        `).join('');

        const form = `
            <div style="background:#1a2f3f; padding:1.5rem; border-radius:1.5rem; max-width:420px; margin:2rem auto; color:#fff; box-shadow: 0 25px 50px rgba(0,0,0,0.5);">
                <h3 style="margin-bottom:1rem;">📝 ${home} vs ${away}</h3>
                <div style="margin:0.6rem 0;">
                    <label>比分 (主-客): </label>
                    <input id="ps" type="text" placeholder="2-1" value="${pred.score ? pred.score.home + '-' + pred.score.away : ''}" style="width:90px; background:#0f1e2f; border:1px solid #ffd966; color:#fff; padding:0.3rem; border-radius:0.5rem;">
                </div>
                <div style="margin:0.6rem 0;">
                    <label>总进球 (多选): </label>
                    <div class="handicap-options" id="totalGoalsGroup">${totalHtml}</div>
                </div>
                <div style="margin:0.6rem 0;">
                    <label>胜负 (多选): </label>
                    <div class="handicap-options" id="winnerGroup">${winnerHtml}</div>
                </div>
                <div style="margin:0.6rem 0;">
                    <label>让球数: </label>
                    <input id="phl" type="number" step="0.5" value="${handicapLine}" style="width:70px; background:#0f1e2f; border:1px solid #ffd966; color:#fff; padding:0.3rem; border-radius:0.5rem;" placeholder="例如1">
                    <span style="color:#94a3b8; font-size:0.7rem;">（主队让球，负数=受让）</span>
                </div>
                <div style="margin:0.6rem 0;">
                    <label>让球结果 (多选): </label>
                    <div class="handicap-options" id="handicapGroup">${handicapHtml}</div>
                </div>
                <button id="saveBtn" style="background:#eab308; color:#0b121e; border:none; padding:0.5rem 1.5rem; border-radius:2rem; font-weight:bold; cursor:pointer; margin-right:1rem;">保存</button>
                <button onclick="document.getElementById('predDialog').remove()" style="background:#475569; color:#fff; border:none; padding:0.5rem 1.5rem; border-radius:2rem; cursor:pointer;">取消</button>
            </div>
        `;
        const d = document.createElement('div'); d.id = 'predDialog';
        d.style.cssText = 'position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.7); display:flex; align-items:center; justify-content:center; z-index:9999;';
        d.innerHTML = form;
        document.body.appendChild(d);

        d.querySelectorAll('.handicap-option').forEach(opt => {
            opt.addEventListener('click', function (e) {
                e.preventDefault();
                const cb = this.querySelector('input');
                cb.checked = !cb.checked;
                this.classList.toggle('active', cb.checked);
            });
        });

        document.getElementById('saveBtn').onclick = () => {
            const data = {};
            const s = document.getElementById('ps').value.trim();
            if (s && /^\d+-\d+$/.test(s)) { const [h, a] = s.split('-').map(Number); if (h >= 0 && a >= 0) data.score = { home: h, away: a }; }

            const totalGoals = [];
            document.querySelectorAll('#totalGoalsGroup input:checked').forEach(cb => {
                const val = parseInt(cb.value);
                if (!isNaN(val)) totalGoals.push(val);
            });
            if (totalGoals.length > 0) data.totalGoals = totalGoals;

            const winners = [];
            document.querySelectorAll('#winnerGroup input:checked').forEach(cb => {
                winners.push(cb.value);
            });
            if (winners.length > 0) data.winner = winners;

            const hl = parseFloat(document.getElementById('phl').value);
            const handicapPicks = [];
            document.querySelectorAll('#handicapGroup input:checked').forEach(cb => {
                handicapPicks.push(cb.value);
            });
            if (!isNaN(hl) && handicapPicks.length > 0) {
                data.handicap = { line: hl, picks: handicapPicks };
            }

            savePred(matchId, Object.keys(data).length ? data : null);
            d.remove();
            renderMatches(latestEvents);
        };
    };
    window._openDialog = (id) => {
        const ev = latestEvents.find(e => e.id === id);
        if (!ev) return;
        const comp = ev.competitions?.[0];
        const h = comp?.competitors?.find(c => c.homeAway === 'home');
        const a = comp?.competitors?.find(c => c.homeAway === 'away');
        openDialog(id, getCountry(h?.team?.displayName)[0], getCountry(a?.team?.displayName)[0]);
    };

    const renderMatches = (events) => {
        latestEvents = events || [];
        if (!events || events.length === 0) {
            matchContainer.innerHTML = '<div style="text-align:center;padding:3rem;color:#7f95b0;">📭 暂无比赛</div>';
            totalEl.textContent = '0'; correctEl.textContent = '0'; pendingEl.textContent = '0';
            return;
        }
        const preds = getPreds();
        const frag = document.createDocumentFragment();
        let total = 0, correct = 0, finished = 0;

        events.forEach(ev => {
            const comp = ev.competitions?.[0];
            if (!comp) return;
            const home = comp.competitors?.find(c => c.homeAway === 'home');
            const away = comp.competitors?.find(c => c.homeAway === 'away');
            if (!home || !away) return;
            const matchId = ev.id;
            const [hName, hFlag] = getCountry(home.team?.displayName);
            const [aName, aFlag] = getCountry(away.team?.displayName);
            const hs = home.score ?? '0', as = away.score ?? '0';
            let htH = null, htA = null;
            if (comp.scores?.halftime) { htH = comp.scores.halftime.home; htA = comp.scores.halftime.away; }
            const halfDisp = (htH !== null && htA !== null) ? `${htH} - ${htA}` : '-';
            const halfCls = htH > htA ? 'win' : (htH < htA ? 'loss' : 'draw');
            const halfTxt = htH !== null ? (htH > htA ? '主队半场胜' : (htH < htA ? '主队半场负' : '半场平')) : '暂无';
            const statusT = (() => {
                const s = ev.status; if (!s) return '未知';
                if (s.type?.shortDetail) return s.type.shortDetail;
                const map = { STATUS_SCHEDULED: '未开始', STATUS_IN_PROGRESS: '进行中', STATUS_HALFTIME: '中场', STATUS_FINAL: '已结束', STATUS_FULL_TIME: '已结束' };
                return map[s.type?.name] || s.type?.name || '未知';
            })();
            const statusType = ev.status?.type?.name || '';
            const live = (statusType === 'STATUS_IN_PROGRESS' || statusType === 'STATUS_HALFTIME') ? 'live' : '';
            const pred = preds[matchId];
            if (pred) {
                if (typeof pred.winner === 'string' && pred.winner) pred.winner = [pred.winner];
                if (typeof pred.totalGoals === 'number') pred.totalGoals = [pred.totalGoals];
                if (pred.handicap && pred.handicap.pick && !pred.handicap.picks) pred.handicap.picks = [pred.handicap.pick];
            }

            const venueEn = comp.venue?.fullName || comp.venue?.displayName || '';
            const venueZh = translateVenue(comp.venue);
            const venueDisplay = venueZh ? (venueEn ? `${venueEn} / ${venueZh}` : venueZh) : venueEn;

            const injury = getInjuryTime(ev);
            const { text: durationText, injury: injuryActive } = calcDuration(ev.date, statusType, injury);
            const injuryHtml = injuryActive !== null && statusType === 'STATUS_IN_PROGRESS' ? `<span class="injury-time">伤停补时 +${injuryActive}'</span>` : '';

            let predHtml = '';
            if (!pred) {
                predHtml = `<div class="guess-box"><span style="color:#5a6e85;">🔮 暂无竞猜</span><button class="guess-btn" onclick="window._openDialog('${matchId}')">添加竞猜</button></div>`;
            } else {
                const isEnd = (statusType === 'STATUS_FINAL' || statusType === 'STATUS_FULL_TIME');
                const h = parseInt(hs), a = parseInt(as);
                let rows = '';

                if (pred.score) {
                    const ok = isEnd && pred.score.home === h && pred.score.away === a;
                    rows += `<div class="guess-row"><span class="guess-label">比分</span><span class="${ok ? 'correct' : (isEnd ? 'wrong' : 'pending')}">${pred.score.home}-${pred.score.away} ${isEnd ? (ok ? '✅' : '❌') : ''}</span></div>`;
                    total++;
                }

                if (pred.totalGoals && Array.isArray(pred.totalGoals) && pred.totalGoals.length > 0) {
                    const actualTotal = h + a;
                    const ok = isEnd && pred.totalGoals.includes(actualTotal);
                    const display = pred.totalGoals.map(v => v === 7 ? '7+' : v).join(',');
                    rows += `<div class="guess-row"><span class="guess-label">总进球</span><span class="${ok ? 'correct' : (isEnd ? 'wrong' : 'pending')}">${display} ${isEnd ? (ok ? '✅' : '❌') : ''}</span></div>`;
                    total++;
                    if (isEnd && ok) correct++;
                }

                if (pred.winner && Array.isArray(pred.winner) && pred.winner.length > 0) {
                    const actual = h > a ? 'home' : (h < a ? 'away' : 'draw');
                    const ok = isEnd && pred.winner.includes(actual);
                    const map = { home: '主胜', away: '客胜', draw: '平局' };
                    const display = pred.winner.map(w => map[w]).join('/');
                    rows += `<div class="guess-row"><span class="guess-label">胜负</span><span class="${ok ? 'correct' : (isEnd ? 'wrong' : 'pending')}">${display} ${isEnd ? (ok ? '✅' : '❌') : ''}</span></div>`;
                    total++;
                    if (isEnd && ok) correct++;
                }

                if (pred.handicap && pred.handicap.picks && pred.handicap.picks.length > 0) {
                    const line = pred.handicap.line;
                    const adj = h - line;
                    const actual = adj > a ? 'home' : (adj < a ? 'away' : 'draw');
                    const ok = isEnd && pred.handicap.picks.includes(actual);
                    const pickMap = { home: '让球主胜', away: '让球客胜', draw: '让球平' };
                    const picksText = pred.handicap.picks.map(p => pickMap[p]).join('/');
                    rows += `<div class="guess-row"><span class="guess-label">让球(${line > 0 ? '+' + line : line})</span><span class="${ok ? 'correct' : (isEnd ? 'wrong' : 'pending')}">${picksText} ${isEnd ? (ok ? '✅' : '❌') : ''}</span></div>`;
                    total++;
                    if (isEnd && ok) correct++;
                }

                predHtml = `<div class="guess-box">${rows}<button class="guess-btn" onclick="window._openDialog('${matchId}')">修改竞猜</button></div>`;
            }

            const card = document.createElement('div');
            card.className = `match ${live}`;
            card.innerHTML = `
        <div class="team-row">
          <span class="team"><span class="flag">${hFlag}</span>${hName}</span>
          <span class="vs">VS</span>
          <span class="team"><span class="flag">${aFlag}</span>${aName}</span>
          <div class="time-box">
            ${ev.date ? `<span class="kickoff" data-start="${ev.date}">🕒 ${fmtTime(ev.date)}</span>` : ''}
            <div class="match-time-info">
              <span class="duration" data-start="${ev.date || ''}">${durationText}</span>
              ${injuryHtml}
            </div>
          </div>
        </div>
        <div class="score-area">
          <div class="score-badge"><div class="score-label">全场</div><div class="score-num">${hs} - ${as}</div></div>
          <div class="score-badge"><div class="score-label">半场</div><div class="score-num" style="font-size:1.2rem;">${halfDisp}</div></div>
          <div class="half-badge ${halfCls}">${halfTxt}</div>
          <div class="status-tag">${statusT}</div>
          ${venueDisplay ? `<div class="venue">📍 ${venueDisplay} ${fmtTime(ev.date)}</div>` : ''}
        </div>
        ${predHtml}
      `;
            frag.appendChild(card);
        });

        matchContainer.innerHTML = '';
        matchContainer.appendChild(frag);
        totalEl.textContent = total;
        correctEl.textContent = correct;
        pendingEl.textContent = total - finished;
        checkAndNotify(correct);
    };

    const updateDurations = () => {
        document.querySelectorAll('.duration').forEach(el => {
            const startISO = el.getAttribute('data-start');
            if (!startISO) return;
            const card = el.closest('.match');
            const statusTag = card?.querySelector('.status-tag')?.textContent;
            let status = '';
            if (statusTag?.includes('进行中')) status = 'STATUS_IN_PROGRESS';
            else if (statusTag?.includes('中场')) status = 'STATUS_HALFTIME';
            else if (statusTag?.includes('已结束')) status = 'STATUS_FINAL';
            const injury = getInjuryTime({ status: { type: { shortDetail: statusTag } } });
            const { text } = calcDuration(startISO, status, injury);
            el.textContent = text;
            const injuryEl = card?.querySelector('.injury-time');
            if (injuryEl) {
                if (status === 'STATUS_IN_PROGRESS' && injury) {
                    injuryEl.textContent = `伤停补时 +${injury}'`;
                    injuryEl.style.display = 'inline-block';
                } else {
                    injuryEl.style.display = 'none';
                }
            }
        });
    };

    async function fetchAndRender() {
        try {
            updateTimeEl.textContent = '⏱️ 刷新中…';
            const res = await fetch(API);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();
            renderMatches(data?.events || []);
            updateTimeEl.textContent = `⏱️ 最后更新: ${new Date().toLocaleTimeString('zh-CN', { hour12: false })}`;
        } catch (e) {
            matchContainer.innerHTML = '<div style="text-align:center;padding:2rem;color:#ef4444;">⚠️ 加载失败</div>';
            updateTimeEl.textContent = '⏱️ 更新失败';
        }
    }

    const updateAccUI = () => {
        const a = loadAccs();
        accSelect.innerHTML = a.list.map(x => `<option ${x === currentAcc ? 'selected' : ''}>${x}</option>`).join('');
    };

    const exportData = () => {
        const accs = loadAccs();
        const preds = {};
        accs.list.forEach(acc => {
            try { const d = JSON.parse(localStorage.getItem(PRED_PREFIX + acc)); if (d) preds[acc] = d; } catch (e) {}
        });
        const blob = new Blob([JSON.stringify({ accounts: accs, predictions: preds }, null, 2)], { type: 'application/json' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `wc_predictions_${new Date().toISOString().slice(0, 10)}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    const importData = (file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                if (!data.accounts || !data.predictions) throw new Error('格式错误');
                if (!confirm('导入将覆盖当前所有账号的竞猜数据，确定继续吗？')) return;
                loadAccs().list.forEach(acc => localStorage.removeItem(PRED_PREFIX + acc));
                saveAccs(data.accounts);
                Object.entries(data.predictions).forEach(([acc, pred]) => localStorage.setItem(PRED_PREFIX + acc, JSON.stringify(pred)));
                location.reload();
            } catch (err) { alert('导入失败：' + err.message); }
        };
        reader.readAsText(file);
    };

    // 事件绑定
    accSelect.addEventListener('change', e => switchAcc(e.target.value));
    document.getElementById('newAccountBtn').addEventListener('click', () => {
        const name = prompt('新账号名称'); if (name) createAcc(name);
    });
    document.getElementById('deleteAccountBtn').addEventListener('click', () => {
        if (confirm(`删除账号“${currentAcc}”？`)) delAcc(currentAcc);
    });
    document.getElementById('clearPredBtn').addEventListener('click', clearAllPreds);
    document.getElementById('settingsBtn').addEventListener('click', openSettings);
    document.getElementById('exportBtn').addEventListener('click', exportData);
    document.getElementById('importBtn').addEventListener('click', () => {
        const inp = document.createElement('input'); inp.type = 'file'; inp.accept = '.json';
        inp.onchange = () => { if (inp.files[0]) importData(inp.files[0]); };
        inp.click();
    });
    document.getElementById('refreshBtn').addEventListener('click', fetchAndRender);

    // 初始化
    currentAcc = loadAccs().current;
    updateAccUI();
    updateClock();
    setInterval(updateClock, 50);
    setInterval(fetchAndRender, 60000);
    setInterval(updateDurations, 1000);
    setInterval(updateRunTime, 1000);
    updateRunTime();
    fetchAndRender();
})();
