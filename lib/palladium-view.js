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
            let status = {};
            status.scope = editor.getGrammar().scopeName.split('.');
            status.grammer = atom.config.get('palladium.enabledGrammars');
            status.grammers = status.grammer.replace(/\s+/g, '').split(',');
            status.enable = status.grammers.filter(function(elem) {
                return (elem[0] !== "!");
            });
            status.disable = status.grammers.filter(function(elem) {
                return (elem[0] === "!");
            }).map(function(elem){
                return elem.replace(/^!+/g, '');
            });

            status.on = intersection(status.scope, status.enable);
            status.off = intersection(status.scope, status.disable);

            if (status.on.length > 0 && status.off.length <= 0) {
                this.statusBar.classList.remove('hidden');
            } else {
                this.statusBar.classList.add('hidden');
            }

        } else {
            this.statusBar.classList.add('hidden');
        }

    }

}
