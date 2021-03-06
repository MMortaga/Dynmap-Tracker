var radar = document.getElementById('radar'),
    diameter = 220,
    radius = diameter / 2,
    padding = 14,
    ctx = Sketch.create({
        container: radar,
        fullscreen: false,
        width: diameter,
        height: diameter
    }),
    dToR = function (degrees) {
        return degrees * (Math.PI / 180);
    },
    sweepAngle = 270,
    sweepSize = 2,
    sweepSpeed = 1.2,
    rings = 4,
    hueStart = 120,
    hueEnd = 170,
    hueDiff = Math.abs(hueEnd - hueStart),
    saturation = 50,
    lightness = 40,
    lineWidth = 2,
    gradient = ctx.createLinearGradient(radius, 0, 0, 0);


radar.style.marginLeft = radar.style.marginTop = (-diameter / 2) - padding + 'px';
gradient.addColorStop(0, 'hsla( ' + hueStart + ', ' + saturation + '%, ' + lightness + '%, 1 )');
gradient.addColorStop(1, 'hsla( ' + hueEnd + ', ' + saturation + '%, ' + lightness + '%, 0.1 )');

var renderRings = function () {
    var i;
    for (i = 0; i < rings; i++) {
        ctx.beginPath();
        ctx.arc(radius, radius, ((radius - (lineWidth / 2)) / rings) * (i + 1), 0, TWO_PI, false);
        ctx.strokeStyle = 'hsla(' + (hueEnd - (i * (hueDiff / rings))) + ', ' + saturation + '%, ' + lightness + '%, 0.1)';
        ctx.lineWidth = lineWidth;
        ctx.stroke();
    };
};

var renderGrid = function () {
    ctx.beginPath();
    ctx.moveTo(radius - lineWidth / 2, lineWidth);
    ctx.lineTo(radius - lineWidth / 2, diameter - lineWidth);
    ctx.moveTo(lineWidth, radius - lineWidth / 2);
    ctx.lineTo(diameter - lineWidth, radius - lineWidth / 2);
    ctx.strokeStyle = 'hsla( ' + ((hueStart + hueEnd) / 2) + ', ' + saturation + '%, ' + lightness + '%, .03 )';
    ctx.stroke();
};

var renderSweep = function () {
    ctx.save();
    ctx.translate(radius, radius);
    ctx.rotate(dToR(sweepAngle));
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, radius, dToR(-sweepSize), dToR(sweepSize), false);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();
    ctx.restore();
};

var renderScanLines = function () {
    var i;
    var j;
    ctx.beginPath();
    for (i = 0; i < diameter; i += 2) {
        ctx.moveTo(0, i + .5);
        ctx.lineTo(diameter, i + .5);
    };
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'hsla( 0, 0%, 0%, .02 )';
    ctx.globalCompositeOperation = 'source-over';
    ctx.stroke();
};

ctx.clear = function () {
    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillStyle = 'hsla( 0, 0%, 0%, 0.1 )';
    ctx.fillRect(0, 0, diameter, diameter);
};

ctx.update = function () {
    sweepAngle += sweepSpeed;
};

ctx.draw = function () {
    ctx.globalCompositeOperation = 'lighter';
    renderRings();
    renderGrid();
    renderSweep();
    renderScanLines();
};

const audio = new Audio('audio.wav');

document.body.addEventListener('keypress', function (event) {
    if (event.which === 13) {
        document.getElementById('submit').click();
        return false;
    }
});

document.getElementById('submit').addEventListener('click', () => {
    const username = document.getElementById('username').value;
    const danger = document.getElementById('danger').value;
    const phase1 = document.getElementById('phase-1');
    const phase2 = document.getElementById('phase-2');
    const blocks = document.getElementById('blocks');
    const user = document.getElementById('user');
    const located = document.getElementById('located');
    const nearby = document.getElementById('nearby');

    audio.play();
    audio.pause();

    blocks.textContent = danger;
    user.textContent = username;

    phase1.style.display = 'none';
    phase2.hidden = false;

    setInterval(() => {
        fetch(`/track?player_name=${username}&danger_distance=${danger}`)
            .then(data => data.json())
            .then(data => {
                console.log(data);
                const numberFound = data.closest.length;
                located.textContent = numberFound;
                const ul = document.createElement('ul');
                if (numberFound > 0) {
                    located.classList.remove('safe');
                    located.classList.add('found');
                    audio.play();
                    nearby.innerHTML = '';
                    const playersList = data.closest.reduce((acc, player) => {
                        const li = document.createElement('li');
                        li.textContent = `${Object.keys(player)[0]}: is ${Object.values(player)[0]} blocks away from you!`
                        acc.appendChild(li);
                        return acc;
                    }, ul);

                    nearby.appendChild(ul);
                } else {
                    located.classList.remove('found');
                    located.classList.add('safe');
                    nearby.innerHTML = '';
                }
            });
    }, 1000)
});