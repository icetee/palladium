/*
 * palladium
 * https://github.com/icetee/palladium
 *
 * Copyright (c) 2016 icetee
 * Licensed under the MIT license.
 */

'use babel';

const mailer = require('./mailer');
const CompositeDisposable = require('atom').CompositeDisposable;

const palladium = {
    subscriptions: null,
    config: mailer.cfg,

    activate: function(state) {
        let self = this;

        self.subscriptions = new CompositeDisposable();
        self.subscriptions.add(
            atom.commands.add('atom-text-editor', {
                'palladium:sendMail': mailer.sendMail
            })
        );

        console.log(self.mailer);
    },
    deactivate: function(state) {
        this.subscriptions.dispose();
    },
    serialize: function(state) {

    }
};

module.exports = palladium;
