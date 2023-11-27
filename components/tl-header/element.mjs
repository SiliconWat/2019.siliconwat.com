import template from './template.mjs';

class TlHeader extends HTMLElement {
    #usernames = ["thonly", "pan"];

    #public_menu = [
        { title: "Menu: Home", page: "/" },
        { title: "Porch & Front Yard", page: "/public/frontyard/" },
        { title: "Main House", page: "/public/house/" },
        { title: "Master Bedroom", page: "/public/master/", submenu: true },
        { title: "Guest Bedroom", page: "/public/guest/", submenu: true },
        { title: "Living Room", page: "/public/living/", submenu: true },
        { title: "Kitchen", page: "/public/kitchen/", submenu: true },
        { title: "Bathroom", page: "/public/bathroom/", submenu: true }
    ];

    #private_menu = [
        { title: "Menu: Home", page: "/" },
        { title: "Vacay", page: "/private/vacay/" },
        { title: "To Pack", page: "/private/pack/", submenu: true },
        { title: "To Lock", page: "/private/lock/", submenu: true }
    ];

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    connectedCallback() {
        this.render();
        this.shadowRoot.querySelectorAll('button').forEach(button => button.textContent = localStorage.getItem('credential') ? "Logout" : "Login");

        const option = this.shadowRoot.querySelector(`option[value="${document.location.pathname}"]`);
        if (option) option.selected = true
        else this.shadowRoot.querySelector("option:first-child").selected = true;

        const a = this.shadowRoot.querySelector(`a[href="${document.location.pathname}"]`);
        if (a) a.style.color = "black";
    }

    get #menu() {
        switch (localStorage.getItem('credential')) {
            case "thonly": 
                return this.#private_menu;
            case "pan":
                return [ ...this.#public_menu, { title: "Back Yard", page: "/private/backyard/", bold: true }, { title: "Study Plan", page: "/private/studyplan/", bold: true } ];
            default:
                return this.#public_menu;
        }
    }

    render() {
        //const menu = localStorage.getItem('credential') ? this.#private_menu : this.#public_menu;
        const ul = this.shadowRoot.querySelector('ul')
        const select = this.shadowRoot.querySelector('select')
        
        this.#menu.reverse().forEach(item => {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = item.page; //a.setAttribute('href', item.page);
            a.textContent = item.title;
            a.style.fontWeight = item.bold ? "bold" : "normal";
            li.appendChild(a)
            ul.prepend(li)

            const option = document.createElement('option');
            option.value = item.page;
            option.textContent = item.submenu ? "- " + item.title : item.title;
            option.style.fontWeight = item.bold ? "bold" : "normal";
            select.prepend(option);
        });
    }

    page(select) {
        document.location = select.value;
    }

    menu(event) {
        const credential = localStorage.getItem('credential');
        if (credential) this.logout(event.target)
        else this.login(event.target);
    }

    login(button, retry=false) {
        button.disabled = true;
        let username = window.prompt(retry ? "Incorrect username. Please try again:" : "Please enter your username:").trim().toLowerCase();
        if (username) {
            if (this.#usernames.includes(username)) {
                localStorage.setItem('credential', username);
                document.location = username === this.#usernames[0] ? this.#private_menu[1].page : this.#menu[this.#menu.length - 1].page;
            } else this.login(button, true)
        } else button.disabled = false;
    }

    logout(button) {
        button.disabled = true;
        localStorage.removeItem('credential');
        document.location = this.#public_menu[0].page;
    }
}

customElements.define("tl-header", TlHeader);