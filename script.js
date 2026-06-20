(function () {
    emailjs.init("ZmY4BqlPCFFown_xD");

    const API = 'https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard';
    const ACC_KEY = 'wc_accs', PRED_PREFIX = 'wc_pred_', SETTINGS_KEY = 'wc_settings';
    const SITE_START = new Date("2026-06-18T00:00:00");

    // ... 国家队映射、场馆映射保持不变 ...

    // ==================== 工具函数（略，保持原有） ====================
    // translateVenue, getCountry, fmtTime, getInjuryTime, calcDuration 等同上

    // ... 省略部分重复代码，实际使用时请保留原有所有工具函数 ...

    // ==================== 账号管理、通知设置（保持不变） ====================

    // ==================== 竞猜对话框（核心修改） ====================
    const openDialog = (matchId, home, away) => {
        const pred = getPreds()[matchId] || {};
        // 兼容旧数据：winner 字符串 -> 数组
        if (typeof pred.winner === 'string' && pred.winner) {
            pred.winner = [pred.winner];
        }
        // 兼容旧数据：totalGoals 数字 -> 数组
        if (typeof pred.totalGoals === 'number') {
            pred.totalGoals = [pred.totalGoals];
        }
        // 兼容旧数据：handicap.pick -> picks
        if (pred.handicap && pred.handicap.pick && !pred.handicap.picks) {
            pred.handicap.picks = [pred.handicap.pick];
        }

        const winnerPicks = pred.winner || [];
        const totalGoalPicks = pred.totalGoals || [];
        const handicapLine = pred.handicap?.line ?? '';
        const handicapPicks = pred.handicap?.picks || [];

        // 生成胜负多选按钮HTML
        const winnerOptions = ['home', 'draw', 'away'];
        const winnerLabels = { home: '主胜', draw: '平局', away: '客胜' };
        const winnerHtml = winnerOptions.map(opt => `
            <label class="handicap-option ${winnerPicks.includes(opt) ? 'active' : ''}">
                <input type="checkbox" value="${opt}" ${winnerPicks.includes(opt) ? 'checked' : ''}>
                ${winnerLabels[opt]}
            </label>
        `).join('');

        // 生成总进球多选按钮 (0-6, 7+)
        const totalGoalsOptions = ['0', '1', '2', '3', '4', '5', '6', '7'];
        const totalHtml = totalGoalsOptions.map(num => `
            <label class="handicap-option ${totalGoalPicks.includes(parseInt(num)) ? 'active' : ''}">
                <input type="checkbox" value="${num}" ${totalGoalPicks.includes(parseInt(num)) ? 'checked' : ''}>
                ${num === '7' ? '7+' : num}
            </label>
        `).join('');

        // 让球结果多选按钮
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

        // 绑定多选按钮的点击切换效果
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
            // 比分
            const s = document.getElementById('ps').value.trim();
            if (s && /^\d+-\d+$/.test(s)) {
                const [h, a] = s.split('-').map(Number);
                if (h >= 0 && a >= 0) data.score = { home: h, away: a };
            }

            // 总进球多选
            const totalGoals = [];
            document.querySelectorAll('#totalGoalsGroup input:checked').forEach(cb => {
                const val = parseInt(cb.value);
                if (!isNaN(val)) totalGoals.push(val);
            });
            if (totalGoals.length > 0) data.totalGoals = totalGoals;

            // 胜负多选
            const winners = [];
            document.querySelectorAll('#winnerGroup input:checked').forEach(cb => {
                winners.push(cb.value);
            });
            if (winners.length > 0) data.winner = winners;

            // 让球
            const hl = parseFloat(document.getElementById('phl').value);
            const handicapPicks = [];
            document.querySelectorAll('#handicapGroup input:checked').forEach(cb => {
                handicapPicks.push(cb.value);
            });
            if (!isNaN(hl) && handicapPicks.length > 0) {
                data.handicap = { line: hl, picks: handicapPicks };
            }

            // 保存
            if (Object.keys(data).length === 0) {
                // 如果所有项都未选，相当于删除预测
                savePred(matchId, null);
            } else {
                savePred(matchId, data);
            }
            d.remove();
            renderMatches(latestEvents);
        };
    };

    // ==================== 渲染函数（核心修改：预测展示和命中判断） ====================
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
            // ... 省略比赛数据提取（home, away, score等），保持原有逻辑 ...

            const pred = preds[matchId];
            if (pred) {
                // 兼容旧数据
                if (typeof pred.winner === 'string' && pred.winner) pred.winner = [pred.winner];
                if (typeof pred.totalGoals === 'number') pred.totalGoals = [pred.totalGoals];
                if (pred.handicap && pred.handicap.pick && !pred.handicap.picks) {
                    pred.handicap.picks = [pred.handicap.pick];
                }
            }

            let predHtml = '';
            if (!pred) {
                predHtml = `<div class="guess-box"><span style="color:#5a6e85;">🔮 暂无竞猜</span><button class="guess-btn" onclick="window._openDialog('${matchId}')">添加竞猜</button></div>`;
            } else {
                const isEnd = (statusType === 'STATUS_FINAL' || statusType === 'STATUS_FULL_TIME');
                const h = parseInt(hs), a = parseInt(as);
                let rows = '';

                // 比分（单预测，不变）
                if (pred.score) {
                    const ok = isEnd && pred.score.home === h && pred.score.away === a;
                    rows += `<div class="guess-row"><span class="guess-label">比分</span><span class="${ok ? 'correct' : (isEnd ? 'wrong' : 'pending')}">${pred.score.home}-${pred.score.away} ${isEnd ? (ok ? '✅' : '❌') : ''}</span></div>`;
                    total++;
                }

                // 总进球（多选）
                if (pred.totalGoals && Array.isArray(pred.totalGoals) && pred.totalGoals.length > 0) {
                    const actualTotal = h + a;
                    const ok = isEnd && pred.totalGoals.includes(actualTotal);
                    const display = pred.totalGoals.map(v => v === 7 ? '7+' : v).join(',');
                    rows += `<div class="guess-row"><span class="guess-label">总进球</span><span class="${ok ? 'correct' : (isEnd ? 'wrong' : 'pending')}">${display} ${isEnd ? (ok ? '✅' : '❌') : ''}</span></div>`;
                    total++;
                    if (isEnd && ok) correct++;
                }

                // 胜负（多选）
                if (pred.winner && Array.isArray(pred.winner) && pred.winner.length > 0) {
                    const actual = h > a ? 'home' : (h < a ? 'away' : 'draw');
                    const ok = isEnd && pred.winner.includes(actual);
                    const map = { home: '主胜', away: '客胜', draw: '平局' };
                    const display = pred.winner.map(w => map[w]).join('/');
                    rows += `<div class="guess-row"><span class="guess-label">胜负</span><span class="${ok ? 'correct' : (isEnd ? 'wrong' : 'pending')}">${display} ${isEnd ? (ok ? '✅' : '❌') : ''}</span></div>`;
                    total++;
                    if (isEnd && ok) correct++;
                }

                // 让球（多选，原有逻辑基本不变，只是 picks 数组）
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

                // 统计逻辑已内嵌在上面的判断中
            }

            // 生成卡片，其余保持不变...
        });

        // ... 清空容器、插入卡片、更新统计数字等，保持原样 ...
    };

    // ... 其余函数（updateDurations, fetchAndRender, 导出导入等）保持不变 ...
})();
