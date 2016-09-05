'use babel';

import { CompositeDisposable } from 'atom';
import PalladiumView from './palladium-view';
import PalladiumMail from './palladium-mail';
import settings from './settings/config.json';

export default {

    palladiumView: null,
    palladiumMail: null,
    subscriptions: null,
    config: settings,

    activate(state) {
        this.palladiumView = new PalladiumView(state.palladiumViewState);
        this.palladiumMail = new PalladiumMail(state.palladiumMailState);
        this.palladiumMail.initialize({
            statusBar : this.palladiumView.getStatusBar()
        });

        // Init Commands
        this.subscriptions = new CompositeDisposable();
        this.subscriptions.add(
            atom.commands.add('atom-text-editor', {
                'palladium:send-mail': () => this.palladiumMail.sendMail()
            }),
            atom.commands.add('atom-workspace', {
                'palladium:create-config': () => this.palladiumMail.createConfig()
            })
        );

        // Init Events
        this.subscriptions.add(
            atom.config.onDidChange('palladium', ({ newValue }) => {
                this.palladiumMail.changeSettings(newValue);
            })
        );

        this.renderStatusBar();
    },

    renderStatusBar() {
        if (atom.config.get('palladium.showStatusbarIcon')) {
            this.subscriptions.add(
                atom.workspace.observeActivePaneItem((editor) => {
                    this.palladiumView.displayStatusBar(editor);
                }),
                atom.workspace.observeTextEditors((editor) => {
                    editor.onDidChangeGrammar(() => {
                        this.palladiumView.displayStatusBar(editor);
                    });
                })
            );

        } else {
            this.subscriptions.remove(
                atom.workspace.observeActivePaneItem((editor) => {
                    this.palladiumView.displayStatusBar(editor, true);
                }),
                atom.workspace.observeTextEditors((editor) => {
                    editor.onDidChangeGrammar(() => {
                        this.palladiumView.displayStatusBar(editor, true);
                    });
                })
            );
        }
    },

    consumeStatusBar(statusBar) {
        return statusBar.addRightTile({
            item: this.palladiumView.getStatusBar(),
            priority: 0
        });
    },

    deactivate() {
        this.subscriptions.dispose();
        this.palladiumView.destroy();
    },

    serialize() {
        return {
            palladiumViewState: this.palladiumView.serialize(),
            palladiumMailState: this.palladiumMail.serialize()
        };
    }

};
