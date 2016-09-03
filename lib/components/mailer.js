'use babel';

import { fn } from './helpers';
import { File } from 'atom';
import mailconfig from '../settings/mailconfig.json';

let Builder = null;

export default class Mailer {

    constructor() {
        this.config = mailconfig;
        this.settings = atom.config.get('palladium');
        this.proto = this.settings.defaultProtocol;
        this.cfg = this.settings[this.proto];

        this.parser = new window.DOMParser();

        this.mailconfig = new File(fn.getProjectFile('.mailconfig'));
        this.mailoptions = {};
        this.mailoptions.html = null;
    }

    initializeMailer() {
        if (Builder === null) {
            this.libs = {
                path: require('path'),
                nodemailer: require('nodemailer'),
                smtp: require('nodemailer-smtp-transport'),
                htmlToText: require('nodemailer-html-to-text').htmlToText,
                plain: require('html-to-text')
            };
            Builder = true;
        }
    }

    changeSettings(newValue) {
        this.settings = newValue;
        this.proto = this.settings.defaultProtocol;
        this.cfg = this.settings[this.proto];
    }

    setSettings(cb) {
        if (typeof this.cfg.email !== 'undefined') {
            this.mailoptions.from = this.cfg.email;
        }

        this.setProtocol();
        if (typeof cb === "function") {
            this.authValid(cb);
        }
    }

    setProtocol() {
        let transport = null;
        let param = this.cfg;

        switch (this.proto) {
            case 'gmail':
                transport = fn.gmail(this.cfg);
                break;
            case 'smtp':
                param.auth = {};
                param.auth.user = this.cfg.user;
                param.auth.pass = this.cfg.pass;
                delete param.user;
                delete param.pass;

                transport = this.libs.smtp(param);
                break;
        }

        this.transporter = this.libs.nodemailer.createTransport(transport);
        this.transporter.use('compile', this.libs.htmlToText({ wordwrap: 77 }));
    }

    authValid(cb) {
        this.transporter.verify((error) => {
            if (error) {
                atom.notifications.addWarning('SMTP connect failed.', {
                    detail: error
                });
                return false;
            }

            cb();
        });
    }

    readmail() {
        let DOM = {};
        DOM.content = fn.activeFile().cachedContents;
        DOM.document = this.parser.parseFromString(DOM.content, "text/html");
        DOM.images = DOM.document.body.querySelectorAll('img');

        for (let i = 0; i < DOM.images.length; i++) {
            let src = DOM.images[i].getAttribute('src');

            src = 'cid:' + src.replace('cid:', '');
        }

        this.html = DOM.document.documentElement.outerHTML;
        this.savePlainText();

        return this.html;
    }

    valid() {
        if (!fn.hasProject() || !this.mailconfig.existsSync()) {
            atom.notifications.addWarning('Mailconfig not exists.');
            return false;
        }

        try {
            let cfg = JSON.parse(this.mailconfig.readSync(true));
            Object.assign(this.mailoptions, cfg);
        } catch (e) {
            atom.notifications.addError('Palladium configuration file is not valid!');
            return false;
        }

        return true;
    }

    savePlainText() {
        if (this.settings.plaintextSaveToFile) {
            let pt = {};
            pt.path = fn.activeFile().path;
            pt.parse = path.parse(pt.path);
            pt.parse.base = pt.parse.base.replace(pt.parse.ext, '.txt');
            pt.parse.ext = '.txt';
            pt.plain_path = path.format(pt.parse);
            pt.text = this.libs.plain.fromString(this.html, { wordwrap: 77 });
            pt.text = pt.text.replace(/(\n)\[cid:.*?\] |\[cid:.*?\]/g, '$1');

            new File(pt.plain_path).write(pt.text);
        }
    }

    attachments(dir, loc) {
        let attachments = [];
        let list = dir.getSubdirectory(loc).getEntriesSync();
        let acceptedExt = ['.jpg', '.png'];

        list.forEach((file) => {
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

}
