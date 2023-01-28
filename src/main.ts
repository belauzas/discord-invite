enum themeOptions {
    light = 'light',
    dark = 'dark',
}

type webILink = {
    link: string,
    min: number,
    max: number,
}

type webLinks = { [key: string]: webILink }

const web: webLinks = {
    Github: {
        link: 'https://github.com/',
        min: 2,
        max: 30,
    },
    Linkedin: {
        link: 'https://www.linkedin.com/in/',
        min: 2,
        max: 50,
    },
}

const localStorageKey = 'devdev-discord-quiz-theme';
const localStorageTheme = localStorage.getItem(localStorageKey) as themeOptions;
let currentTheme: themeOptions = themeOptions.light;

const themeDOM: HTMLElement = document.querySelector('.theme')!;
const themeOptionsDOM: NodeListOf<HTMLElement> = themeDOM.querySelectorAll('.option')!;

function updateTheme(DOM: HTMLElement, theme: themeOptions) {
    const activeDOM = DOM.querySelector('.option.active');
    if (!activeDOM) {
        return;
    }
    activeDOM.classList.remove('active');

    const themeDOM = DOM.querySelector(`.option[data-theme="${theme}"]`);
    if (!themeDOM) {
        return;
    }
    themeDOM.classList.add('active');

    localStorage.setItem(localStorageKey, theme);
    document.body.dataset.theme = theme;
}

if (localStorageTheme in themeOptions) {
    currentTheme = localStorageTheme;
    updateTheme(themeDOM, currentTheme);
}

for (const themeOptionDOM of themeOptionsDOM) {
    themeOptionDOM.addEventListener('click', () => {
        updateTheme(themeDOM, themeOptionDOM.dataset.theme as themeOptions);
    })
}

const introDOM = document.getElementById('intro')!;
const introContinueDOM = document.getElementById('intro_continue')!;

const contentDOM = document.getElementById('content')!;
const resultDOM = document.getElementById('result')!;
const nameDOM = document.getElementById('name')! as HTMLInputElement;
const reasonDOM = document.getElementById('reason')! as HTMLInputElement;
const levelDOM = document.getElementById('level')! as HTMLInputElement;
const githubDOM = document.getElementById('github')! as HTMLInputElement;
const linkedinDOM = document.getElementById('linkedin')! as HTMLInputElement;
const continueDOM = document.getElementById('continue')!;
const submitDOM = document.getElementById('submit')!;

const hiDOM = document.getElementById('hi')!;
const copyDOM = document.getElementById('copy')!;

const nameErrDOM = document.getElementById('name-err')!;
const reasonErrDOM = document.getElementById('reason-err')!;
const levelErrDOM = document.getElementById('level-err')!;
const githubErrDOM = document.getElementById('github-err')!;
const linkedinErrDOM = document.getElementById('linkedin-err')!;

const abc = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZąčęėįšųūžĄČĘĖĮŠŲŪŽ';

function switchContent(fromDOM: HTMLElement, toDOM: HTMLElement) {
    fromDOM.classList.add('hide');
    toDOM.classList.remove('hide');
    scrollTo({ top: 0, behavior: 'smooth' });
}

introContinueDOM.addEventListener('click', () => {
    switchContent(introDOM, contentDOM);
});

if (navigator.clipboard) {
    copyDOM.addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(hiDOM.innerText);
            copyDOM.innerText = '✅ Copy';
            setTimeout(() => {
                copyDOM.innerText = 'Copy';
            }, 1000);
        } catch (error) {
        }
    })
} else {
    copyDOM.classList.add('hide');
}

function validSingleName(str: string, sentence = 'Vardas'): [boolean, string] {
    const min = 3;
    const max = 30;

    if (str.length < min || str.length > max) {
        return [false, `${sentence} turi būti tarp ${min} ir ${max} simbolių`];
    }
    if (str[0] !== str[0].toUpperCase()) {
        return [false, `${sentence} turi prasidėti didžiąja raide 😬`];
    }
    if (str.slice(1) !== str.slice(1).toLowerCase()) {
        return [false, `Sekančios ${sentence} raidės turi būti mažosios 😬`];
    }

    for (const s of str) {
        if (!abc.includes(s)) {
            return [false, `Varde neleistinas simbolis "${s}"`];
        }
    }

    return [true, 'OK'];
}

function validName(str: string): [boolean, string] {
    str = str.trim();
    const words = str.split(' ');

    if (words.length === 1) {
        const [valid, msg] = validSingleName(words[0]);
        if (!valid) {
            return [valid, msg];
        }
    } else {
        for (const word of words) {
            const [valid, msg] = validSingleName(word, 'vardo dalies');
            if (!valid) {
                return [valid, msg];
            }
        }
    }

    return [true, 'OK'];
}

function validReasonLevel(str: string): [boolean, string] {
    const min = 5;
    const max = 500;

    str = str.trim();

    if (str.length < min || str.length > max) {
        return [false, `Aprašas turi būti tarp ${min} ir ${max} simbolių`];
    }

    return [true, 'OK'];
}

function validLink(str: string, domain: string): [boolean, string] {
    str = str.trim();
    const parts = str.split('?');
    str = parts[0];
    if (str[str.length - 1] === '/') {
        str = str.slice(0, -1);
    }

    const { link, min, max } = web[domain];
    const strParts = str.split(link);

    if (strParts.length !== 2
        || strParts[0] !== ''
        || strParts[1].length < min
        || strParts[1].length > max) {
        return [false, `Nepanašu į tikrą pilną ${domain} paskyros nuorodą`];
    }

    return [true, 'OK'];
}

function validFormName(): boolean {
    nameErrDOM.classList.remove('show');
    const [nameValid, nameMsg] = validName(nameDOM.value);
    if (!nameValid) {
        nameErrDOM.textContent = nameMsg;
        nameErrDOM.classList.add('show');
        return false;
    }
    return true;
}

function validFormReason(): boolean {
    reasonErrDOM.classList.remove('show');
    const [reasonValid, reasonMsg] = validReasonLevel(reasonDOM.value);
    if (!reasonValid) {
        reasonErrDOM.textContent = reasonMsg;
        reasonErrDOM.classList.add('show');
        return false;
    }
    return true;
}

function validFormLevel() {
    levelErrDOM.classList.remove('show');
    const [levelValid, levelMsg] = validReasonLevel(levelDOM.value);
    if (!levelValid) {
        levelErrDOM.textContent = levelMsg;
        levelErrDOM.classList.add('show');
        return false;
    }
    return true;
}

function validFormGithub() {
    githubErrDOM.classList.remove('show');
    const [githubValid, githubMsg] = validLink(githubDOM.value, 'Github');
    if (!githubValid) {
        githubErrDOM.textContent = githubMsg;
        githubErrDOM.classList.add('show');
        return false;
    }
    return true;
}

function validFormLinkedin() {
    linkedinErrDOM.classList.remove('show');
    const [linkedinValid, linkedinMsg] = validLink(linkedinDOM.value, 'Linkedin');
    if (!linkedinValid) {
        linkedinErrDOM.textContent = linkedinMsg;
        linkedinErrDOM.classList.add('show');
        return false;
    }
    return true;
}

function validateForm() {
    continueDOM.classList.remove('disabled');

    let errorCount = 0;

    if (!validFormName()) errorCount++;
    if (!validFormReason()) errorCount++;
    if (!validFormLevel()) errorCount++;
    if (!validFormGithub()) errorCount++;
    if (!validFormLinkedin()) errorCount++;

    if (errorCount) {
        continueDOM.classList.add('disabled');
        setTimeout(() => {
            continueDOM.classList.remove('disabled');
        }, 2000);
    } else {
        switchContent(contentDOM, resultDOM);

        const hi = 'Sveiki, mano vardas ' + nameDOM.value + '\r'
            + '**Mano tikslas**:' + '\r'
            + reasonDOM.value + '\r'
            + '**Mano lygis**:' + '\r'
            + levelDOM.value + '\r'
            + '**Github**:' + '\r'
            + githubDOM.value + '\r'
            + '**Linkedin**:' + '\r'
            + linkedinDOM.value;
        hiDOM.innerText = hi;
    }
}

nameDOM.addEventListener('focusout', validFormName);
reasonDOM.addEventListener('focusout', validFormReason);
levelDOM.addEventListener('focusout', validFormLevel);
githubDOM.addEventListener('focusout', validFormGithub);
linkedinDOM.addEventListener('focusout', validFormLinkedin);
submitDOM.addEventListener('click', validateForm);