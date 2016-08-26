'use babel';
/*
 * palladium
 * https://github.com/icetee/palladium
 *
 * Copyright (c) 2016 icetee
 * Licensed under the MIT license.
 */

import { CompositeDisposable, File, Directory } from 'atom';
import cmp from './components';
import mailer from './mailer';

export default {
    subscriptions: null,
    mailconfig: null,
    config: mailer.cfg,

    activate: function(state) {
        let self = this;

        self.subscriptions = new CompositeDisposable();
        self.subscriptions.add(
            atom.commands.add('atom-text-editor', {
                'palladium:sendMail': self.sendMail
            })
        );

    },
    sendMail: function(state) {
        mailer.sendMail();
    },
    deactivate: function(state) {
        this.subscriptions.dispose();
    },
    serialize: function(state) {

    }
}
