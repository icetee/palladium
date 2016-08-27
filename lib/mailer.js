'use babel';
/*
 * palladium
 * https://github.com/icetee/palladium
 *
 * Copyright (c) 2016 icetee
 * Licensed under the MIT license.
 */

import path from 'path';
import { CompositeDisposable, File, Directory } from 'atom';
import cmp from './components';
import nodemailer from 'nodemailer';
import smtp from 'nodemailer-smtp-transport';

class Mailer {
    constructor() {
        this.cfg = require('./config-schema.json');
        this.mailcfg = new File(cmp.getProjectFile('.mailconfig'));
        this.mailoptions = {};
    }

    _setprotocol() {
        let self = this;
        let transport = null;

        switch (cmp.getCfg('defaultProtocol')) {
            case "Gmail":
                if (typeof cmp.getCfg('gmail') !== "undefined") {
                    transport = `smtps://${ cmp.getCfg('gmail.email').replace("@", "%40") }:${ cmp.getCfg('gmail.pass') }@smtp.gmail.com`;
                }
                break;
            case "SMTP":
                transport = smtp(cmp.getCfg('smtp'));
                break;
        }

        console.log(transport);
        self.transporter = nodemailer.createTransport(transport);
    }

    _valid() {
        let self = this;

        if (!cmp.hasProject() || !self.mailcfg.existsSync()) {
            atom.notifications.addWarning("Mailconfig not exists!");
            return false;
        }

        try {
            let cfg = JSON.parse(self.mailcfg.readSync(true));
            Object.assign(self.mailoptions, cfg);
        } catch (e) {
            atom.notifications.addError("Palladium configuration file is not valid!");
            return false;
        }

        return true;
    }

    _readmail() {
        let cheerio = require('cheerio');
        let file = cmp.activeFile();
        let $ = cheerio.load(file.cachedContents, {
            decodeEntities: false
        });

        $('img').each(function() {
            var src = $(this).attr('src');

            $(this).attr('src', 'cid:' + src);
        });

        return $.html();
    }

    _attachments(dir, loc) {
        let attachments = [];
        let list = dir.getSubdirectory(loc).getEntriesSync();
        let acceptedExt = ['.jpg', '.png'];

        list.forEach((file, index) => {
            if (acceptedExt.indexOf(path.extname(file.getPath())) > -1) {
                let attachment = {};
                attachment.filename = file.getBaseName();
                attachment.cid = file.getBaseName();
                attachment.path = file.getPath();
                attachments.push(attachment);
            }
        });

        return attachments;
    }

    sendMail() {
        let self = this;

        if (self._valid()) {
            let path = new Directory(cmp.activeFile().getParent().getPath());

            self._setprotocol();
            self.mailoptions.attachments = self._attachments(path, 'img');
            self.mailoptions.html = self._readmail();

            self.transporter.sendMail(self.mailoptions, (error, info) => {
                if (error) {
                    atom.notifications.addError('Failed to send', {
                        detail: error
                    })
                    return false;
                }

                atom.notifications.addSuccess('Message sent', {
                    detail: info.response
                })
            });

        } else {
            atom.notifications.addError("Palladium fail.");
        }

    }
}

export default new Mailer();
