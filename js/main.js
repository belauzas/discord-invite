const themeOptions = ['light', 'dark'];
const localStorageKey = 'devdev-discord-quiz-theme';
const localStorageTheme = localStorage.getItem(localStorageKey);
let currentTheme = themeOptions[0];

const themeDOM = document.querySelector('.theme');
const themeOptionsDOM = themeDOM.querySelectorAll('.option');

function updateTheme(theme) {
    themeDOM.querySelector('.option.active').classList.remove('active');
    themeDOM.querySelector(`.option[data-theme="${theme}"]`).classList.add('active');
    localStorage.setItem(localStorageKey, theme);
    document.body.dataset.theme = theme;
}

if (themeOptions.includes(localStorageTheme)) {
    currentTheme = localStorageTheme;
    updateTheme(currentTheme);
}

for (const themeOptionDOM of themeOptionsDOM) {
    themeOptionDOM.addEventListener('click', () => {
        updateTheme(themeOptionDOM.dataset.theme);
    })
}

const nameDOM = document.getElementById('name');
const reasonDOM = document.getElementById('reason');
const levelDOM = document.getElementById('level');
const githubDOM = document.getElementById('github');
const linkedinDOM = document.getElementById('linkedin');
const submitDOM = document.getElementById('submit');

const abc = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZąčęėįšųūžĄČĘĖĮŠŲŪŽ';

function validSingleName(str, sentence = 'Vardas') {
    const min = 3;
    const max = 30;

    if (word.length < min || word.length > max) {
        return [false, `${sentence} turi būti tarp ${min} ir ${max} simbolių`];
    }
    if (word[0] !== word[0].toUpperCase()) {
        return [false, `${sentence} turi prasidėti didžiąja raide 😬`];
    }
    if (word.slice(1) !== word.slice(1).toLowerCase()) {
        return [false, `Sekančios ${sentence} raidės turi būti mažosios 😬`];
    }

    for (const s of str) {
        if (!abc.includes(s)) {
            return [false, `Varde neleistinas simbolis "${s}"`];
        }
    }

    return [true, 'OK'];
}

function validName(str) {
    str = str.trim();
    const words = str.split(' ');

    if (words.length === 1) {
        const [err, msg] = validSingleName(word);
        if (err) {
            return [err, msg];
        }
    } else {
        for (const word of words) {
            const [err, msg] = validSingleName(word, 'vardo dalies');
            if (err) {
                return [err, msg];
            }
        }
    }

    return [true, 'OK'];
}

function validReasonLevel(str) {
    const min = 5;
    const max = 500;

    str = str.trim();

    if (str.length < min || str.length > max) {
        return [false, `Aprašas turi būti tarp ${min} ir ${max} simbolių`];
    }

    return [true, 'OK'];
}

function validLink(str) {
    str = str.trim();
    if (false) {
        return [false, 'Error'];
    }
    return [true, 'OK'];
}