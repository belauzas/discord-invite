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