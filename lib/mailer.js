/*
 * palladium
 * https://github.com/icetee/palladium
 *
 * Copyright (c) 2016 icetee
 * Licensed under the MIT license.
 */

'use babel';

const FS = require('fs-plus');
const nodemailer = require('nodemailer');
const smtp = require('nodemailer-smtp-transport');
const mailconfig = atom.project.getDirectories()[0].resolve('.mailconfig');

class Mailer {
    constructor() {
        this.setProtocol();
        this.cfg = require('./config-schema.json');
    }

    _hasProject() {
        return atom.project && atom.project.getPaths().length;
    }

    _cfg(option) {
        return atom.config.get('palladium.' + option);
    }

    setProtocol() {
        let transport = null;

        switch (this._cfg('defaultProtocol')) {
            case "Gmail":
                if (typeof this._cfg('gmail') !== "undefined") {
                    transport = `smtps://${ this._cfg('gmail.email').replace("@", "%40") }:${ this._cfg('gmail.pass') }@smtp.gmail.com`;
                }
                break;
            case "SMTP":
                transport = smtp(this._cfg('smtp'));
                break;
        }

        this.transporter = nodemailer.createTransport(transport);
    }

    valid() {
        let error = false;
        let selectedProtocol = this._cfg('defaultProtocol').toLowerCase();

        if (typeof this._cfg(selectedProtocol) === "undefined") {
            atom.notifications.addWarning("Please set Gmail Account.");
            error = true;
        }

        return error;
    }

    sendMail() {
        // if (!this.valid()) {
        //     if (this._hasProject() && mailconfig) {
        //         FS.exists(mailconfig, function(exists) {
        //             console.log(mailconfig);
        //         });
        //     }
        // }
    }
}

module.exports = new Mailer();
