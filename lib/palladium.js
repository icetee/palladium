'use babel';

import { CompositeDisposable } from 'atom';
import PalladiumView from './palladium-view';
import palladiumMail from './palladium-mail';

export default {

    palladiumView: null,
    subscriptions: null,
    config: palladiumMail.settings,

    activate(state) {
        this.palladiumView = new PalladiumView(state.palladiumViewState);

        this.subscriptions = new CompositeDisposable();
        this.subscriptions.add(
            atom.commands.add('atom-text-editor', {
                'palladium:send-mail': () => palladiumMail.sendMail(),
                'palladium:create-config': () => palladiumMail.createConfig()
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
            palladiumViewState: this.palladiumView.serialize()
        };
    }

};
