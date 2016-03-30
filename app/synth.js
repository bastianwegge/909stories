
var keyboardBig = {
    element: 'keyboardbig',
    width: 795,
    height: 200,
    octaves: 2,
    startNote: 'C3'
};
var keyboardSmall = {
    element: 'keyboardsmall',
    width: 400,
    height: 200,
    octaves: 1,
    startNote: 'C3'
};

var synths = [keyboardBig, keyboardSmall];

synths.forEach(function(element) {

    var attrs = {
        id: element.element,
        width: element.width,
        height: element.height,
        octaves: element.octaves,
        startNote: element.startNote
    };

    var keyboard = new QwertyHancock(attrs);

    var context = new AudioContext(),
        masterVolume = context.createGain(),
        oscillators = {};

    masterVolume.gain.value = 0.2;

    masterVolume.connect(context.destination);

    keyboard.keyDown = function(note, frequency) {
        var osc = context.createOscillator(),
            osc2 = context.createOscillator();

        osc.frequency.value = frequency;
        osc.type = 'sawtooth';
        osc.detune.value = -10;

        osc2.frequency.value = frequency;
        osc2.type = 'triangle';
        osc2.detune.value = 10;

        osc.connect(masterVolume);
        osc2.connect(masterVolume);

        masterVolume.connect(context.destination);

        oscillators[frequency] = [osc, osc2];

        osc.start(context.currentTime);
        osc2.start(context.currentTime);
    };

    keyboard.keyUp = function(note, frequency) {
        oscillators[frequency].forEach(function(oscillator) {
            oscillator.stop(context.currentTime);
        });
    };
});