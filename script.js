/**
 * Stopwatch & Clock Application
 * 시니어 코딩 파트너 작성
 */

class TimerApp {
    constructor() {
        // DOM 요소 캐싱
        this.timeDisplay = document.getElementById('time-display');
        this.msDisplay = document.getElementById('ms-display');
        this.modeLabel = document.getElementById('mode-label');
        this.startStopBtn = document.getElementById('start-stop-btn');
        this.resetBtn = document.getElementById('reset-btn');

        // 상태 변수
        this.isRunning = false;
        this.startTime = 0;
        this.elapsedTime = 0;
        this.animationFrameId = null;

        // 초기화
        this.init();
    }

    init() {
        this.startStopBtn.addEventListener('click', () => this.toggleTimer());
        this.resetBtn.addEventListener('click', () => this.resetTimer());
        
        // 초기 모드: 실시간 시계 실행
        this.updateClock();
    }

    // 현재 시간 업데이트 (스탑워치가 아닐 때)
    updateClock() {
        if (this.isRunning) return;

        const now = new Date();
        const h = String(now.getHours()).padStart(2, '0');
        const m = String(now.getMinutes()).padStart(2, '0');
        const s = String(now.getSeconds()).padStart(2, '0');
        
        this.timeDisplay.textContent = `${h}:${m}:${s}`;
        this.msDisplay.textContent = ''; // 시계 모드에선 밀리초 숨김 (디자인 선택)
        this.modeLabel.textContent = 'CURRENT TIME';
        
        this.animationFrameId = requestAnimationFrame(() => this.updateClock());
    }

    toggleTimer() {
        if (!this.isRunning) {
            this.start();
        } else {
            this.stop();
        }
    }

    start() {
        this.isRunning = true;
        this.startStopBtn.textContent = 'STOP';
        this.modeLabel.textContent = 'STOPWATCH';
        document.body.classList.add('running');

        // 이전 기록에 이어서 시작 (PAUSE 후 START 고려)
        this.startTime = Date.now() - this.elapsedTime;
        
        cancelAnimationFrame(this.animationFrameId);
        this.runStopwatch();
    }

    stop() {
        this.isRunning = false;
        this.startStopBtn.textContent = 'START';
        document.body.classList.remove('running');
        cancelAnimationFrame(this.animationFrameId);
    }

    resetTimer() {
        this.stop();
        this.elapsedTime = 0;
        this.timeDisplay.textContent = '00:00:00';
        this.msDisplay.textContent = '.00';
        
        // 리셋 후 다시 시계 모드로 전환
        setTimeout(() => {
            if (!this.isRunning && this.elapsedTime === 0) {
                this.updateClock();
            }
        }, 500);
    }

    runStopwatch() {
        if (!this.isRunning) return;

        const now = Date.now();
        this.elapsedTime = now - this.startTime;

        this.displayTime(this.elapsedTime);
        this.animationFrameId = requestAnimationFrame(() => this.runStopwatch());
    }

    displayTime(ms) {
        const totalSeconds = Math.floor(ms / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        const milliseconds = Math.floor((ms % 1000) / 10);

        const h = String(hours).padStart(2, '0');
        const m = String(minutes).padStart(2, '0');
        const s = String(seconds).padStart(2, '0');
        const msStr = String(milliseconds).padStart(2, '0');

        this.timeDisplay.textContent = `${h}:${m}:${s}`;
        this.msDisplay.textContent = `.${msStr}`;
    }
}

// 애플리케이션 인스턴스 생성
document.addEventListener('DOMContentLoaded', () => {
    new TimerApp();
});
