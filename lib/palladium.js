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

        // Init Commands
        this.subscriptions = new CompositeDisposable();
        this.subscriptions.add(
            atom.commands.add('atom-text-editor', {
                'palladium:send-mail': () => this.palladiumMail.sendMail(),
                'palladium:create-config': () => this.palladiumMail.createConfig()
            })
        );

        // Init Events
        this.subscriptions.add(
          atom.config.onDidChange('palladium', ({ newValue }) => {
              this.palladiumMail.changeSettings(newValue);
          })
        );

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
