'use babel';

import intersection from 'lodash.intersection';

export default class PalladiumView {

    constructor() {
        // Create status-bar element
        this.statusBar = document.createElement('div');
        this.statusBar.classList.add('palladium', 'inline-block', 'hidden');

        // Create icon element
        const statusBarIcon = document.createElement('span');
        statusBarIcon.classList.add("icon", "icon-rocket");
        this.statusBar.appendChild(statusBarIcon);
    }

    // Returns an object that can be retrieved when package is activated
    serialize() {

    }

    // Tear down any state and detach
    destroy() {
        this.element.remove();
    }

    getStatusBar() {
        return this.statusBar;
    }

    displayStatusBar(editor, remove) {

        if (!this.statusBar) {
            return false;
        }

        if (typeof editor !== "undefined" && editor.constructor.name === "TextEditor" && !remove) {
            let grammars = editor.getGrammar().scopeName.split('.');
            let enable = atom.config.get('palladium.enabledGrammers');
            enable = enable.replace(/\s+/g, '').split(',');

            if (intersection(grammars, enable).length > 0) {
                this.statusBar.classList.remove('hidden');
            } else {
                this.statusBar.classList.add('hidden');
            }

        } else {
            this.statusBar.classList.add('hidden');
        }

    }

}
