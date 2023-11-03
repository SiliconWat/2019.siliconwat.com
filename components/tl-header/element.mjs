import template from './template.mjs';

class TlHeader extends HTMLElement {
    #username = "thonly";

    #public_menu = [
        { title: "Menu: Home", page: "/" },
        { title: "Porch & Front Yard", page: "/public/frontyard/" },
        { title: "Main House", page: "/public/house/" },
        { title: "Master Bedroom", page: "/public/master/", submenu: true },
        { title: "Guest Bedroom", page: "/public/guest/", submenu: true },
        { title: "Living Room", page: "/public/living/", submenu: true },
        { title: "Kitchen", page: "/public/kitchen/", submenu: true },
        { title: "Bathroom", page: "/public/bathroom/", submenu: true },
        { title: "Back Yard", page: "/public/backyard/" }
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

    render() {
        const menu = localStorage.getItem('credential') ? this.#private_menu : this.#public_menu;
        const ul = this.shadowRoot.querySelector('ul')
        const select = this.shadowRoot.querySelector('select')
        
        menu.reverse().forEach(item => {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = item.page; //a.setAttribute('href', item.page);
            a.textContent = item.title;
            li.appendChild(a)
            ul.prepend(li)

            const option = document.createElement('option');
            option.value = item.page;
            option.textContent = item.submenu ? "- " + item.title : item.title;
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
        let username = window.prompt(retry ? "Incorrect username. Please try again:" : "Please enter your username:");
        if (username) {
            if (username.toLowerCase() === this.#username.toLowerCase()) {
                localStorage.setItem('credential', username);
                document.location = this.#private_menu[1].page;
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