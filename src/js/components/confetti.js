var confetti = {
    maxCount: 150,
    speed: 2,
    frameInterval: 15,
    alpha: 1.0,
    gradient: false,
    start: null,
    stop: null,
};

(function () {
    confetti.start = startConfetti;
    confetti.stop = stopConfetti;

    var supportsAnimationFrame =
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame;
    var colors = [
        "rgba(0, 120, 212, ", // Azul
        "rgba(255, 208, 0, ", // Amarelo
        "rgba(0, 0, 0, ",     // Preto
        "rgba(35, 161, 77, ", // Verde
        "rgba(237, 41, 57, ", // Vermelho
    ];
    var streamingConfetti = false;
    var animationTimer = null;
    var lastFrameTime = Date.now();
    var particles = [];
    var waveAngle = 0;
    var context = null;

    function resetParticle(particle, width, height) {
        particle.color =
            colors[(Math.random() * colors.length) | 0] +
            (confetti.alpha + ")");
        particle.x = Math.random() * width;
        particle.y = Math.random() * height - height;
        particle.diameter = Math.random() * 10 + 5;
        particle.tiltAngleIncrement = Math.random() * 0.07 + 0.05;
        particle.tiltAngle = Math.random() * Math.PI;
        return particle;
    }

    function runAnimation() {
        if (particles.length === 0) {
            context.clearRect(0, 0, window.innerWidth, window.innerHeight);
            animationTimer = null;
        } else {
            var now = Date.now();
            var delta = now - lastFrameTime;
            if (!supportsAnimationFrame || delta > confetti.frameInterval) {
                context.clearRect(0, 0, window.innerWidth, window.innerHeight);
                updateParticles();
                drawParticles(context);
                lastFrameTime = now - (delta % confetti.frameInterval);
            }
            animationTimer = requestAnimationFrame(runAnimation);
        }
    }

    function startConfetti(timeout) {
        var width = window.innerWidth;
        var height = window.innerHeight;
        window.requestAnimationFrame = (function () {
            return (
                window.requestAnimationFrame ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame ||
                window.oRequestAnimationFrame ||
                window.msRequestAnimationFrame ||
                function (callback) {
                    return window.setTimeout(callback, confetti.frameInterval);
                }
            );
        })();
        var canvas = document.getElementById("confetti-canvas");
        if (canvas === null) {
            canvas = document.createElement("canvas");
            canvas.setAttribute("id", "confetti-canvas");
            canvas.setAttribute(
                "style",
                "display:block;z-index:999999;pointer-events:none;position:fixed;top:0"
            );
            document.body.prepend(canvas);
            canvas.width = width;
            canvas.height = height;
            window.addEventListener(
                "resize",
                function () {
                    canvas.width = window.innerWidth;
                    canvas.height = window.innerHeight;
                },
                true
            );
            context = canvas.getContext("2d");
        } else if (context === null) context = canvas.getContext("2d");

        while (particles.length < confetti.maxCount)
            particles.push(resetParticle({}, width, height));
        streamingConfetti = true;
        runAnimation();

        if (timeout) {
            window.setTimeout(stopConfetti, timeout);
        }
    }

    function stopConfetti() {
        streamingConfetti = false;
    }

    function drawParticles(context) {
        var particle;
        for (var i = 0; i < particles.length; i++) {
            particle = particles[i];
            context.beginPath();
            context.fillStyle = particle.color;
            context.arc(particle.x, particle.y, particle.diameter / 2, 0, 2 * Math.PI);
            context.fill();
        }
    }

    function updateParticles() {
        var width = window.innerWidth;
        var height = window.innerHeight;
        var particle;
        waveAngle += 0.01;
        for (var i = 0; i < particles.length; i++) {
            particle = particles[i];
            if (!streamingConfetti && particle.y < -15) particle.y = height + 100;
            else {
                particle.tiltAngle += particle.tiltAngleIncrement;
                particle.x += Math.sin(waveAngle) - 0.5;
                particle.y +=
                    (Math.cos(waveAngle) + particle.diameter + confetti.speed) * 0.5;
            }
            if (particle.x > width + 20 || particle.x < -20 || particle.y > height) {
                if (streamingConfetti && particles.length <= confetti.maxCount)
                    resetParticle(particle, width, height);
                else {
                    particles.splice(i, 1);
                    i--;
                }
            }
        }
    }
})();