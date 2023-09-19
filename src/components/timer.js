export function timer(element, data) {
    const html = `
        <div class="timer">
            <div class="timer__bar"></div>
            <div class="timer__text"></div>
        </div>
    `;
    element.innerHTML = html;

    const bar = element.querySelector('.timer__bar');
    const text = element.querySelector('.timer__text');

    let intervalId = null;

    function startTimer() {
        const startTime = Date.now();
        const endTime = startTime + data.duration * 1000;

        intervalId = setInterval(() => {
            const now = Date.now();
            const remaining = endTime - now;
            const remainingSeconds = Math.round(remaining / 1000);
            const remainingPercent = remaining / (data.duration * 1000);

            bar.style.width = `${remainingPercent * 100}%`;
            text.textContent = remainingSeconds;

            if (remainingSeconds < 0) {
                clearInterval(intervalId);
                element.dispatchEvent(new CustomEvent('timerEnd'));
            }
        }, 100);
    }

    return {
        element,
        hide() {
            element.style.display = 'none';
        },
        start() {
            startTimer();
        },
        stop() {
            clearInterval(intervalId);
            element.dispatchEvent(new CustomEvent('timerEnd'));
        }
    }
};

export function calculateDuration(minDuration, maxDuration, minValue, maxValue, value) {
    const duration = minDuration + (maxDuration - minDuration) * (value - minValue) / (maxValue - minValue);
    return duration;
}