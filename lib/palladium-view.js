'use babel';

export default class PalladiumView {

    constructor() {
        // Create status-bar element
        this.statusBar = document.createElement('div');
        this.statusBar.classList.add('palladium', 'inline-block', 'busy');

        // Create icon element
        const statusBarIcon = document.createElement('span');
        statusBarIcon.classList.add("icon", "icon-rocket");
        this.statusBar.appendChild(statusBarIcon);
    }

    // Returns an object that can be retrieved when package is activated
    serialize() {}

    // Tear down any state and detach
    destroy() {
        this.element.remove();
    }

    getStatusBar() {
        return this.statusBar;
    }

}
