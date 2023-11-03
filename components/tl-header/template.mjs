const template = document.createElement("template");

template.innerHTML = `
    <link rel="stylesheet" href="/components/tl-header/shadow.css">
    <ul>
        <li><button onclick="this.getRootNode().host.menu(event)"></button></li>
    </ul>
    <nav>
        <h3><button onclick="this.getRootNode().host.menu(event)"></button></h3>
        <select onchange="this.getRootNode().host.page(this)"></select>
    </nav>
`;

export default template;