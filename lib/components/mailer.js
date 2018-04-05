'use babel';

import { fn } from './helpers';
import { File } from 'atom';
import mailconfig from '../settings/mailconfig.json';

let Builder = null;

export default class Mailer {

    constructor() {
        this.config = mailconfig;
        this.settings = atom.config.get('palladium');

        this.parser = new window.DOMParser();

        this.mailinglist = null;
        this.mailconfig = null;

        fn.getProjectFile('.mailinglist').then(path => {
            this.mailinglist = new File(path);
        });

        fn.getProjectFile('.mailconfig').then(path => {
            this.mailconfig = new File(path);
        });

        this.mailoptions = {
            html: null
        };
    }

    getPalladiumConfing(option) {
        if (typeof this.mailoptions.palladium !== 'object') return null;

        return this.mailoptions.palladium[option];
    }

    initializeMailer() {
        if (Builder === null) {
            this.libs = {
                path: require('path'),
                plain: require('html-to-text'),
                nodemailer: require('nodemailer'),
                validator: require('email-validator'),
                htmlToText: require('nodemailer-html-to-text').htmlToText
            };
            Builder = true;
        }
    }

    changeSettings(newValue) {
        this.settings = newValue;
    }

    setSettings(cb) {
        this.initTransport();
        if (typeof cb === "function") {
            this.authValid(cb);
        }
    }

    initTransport() {
        this.transporter = this.libs.nodemailer.createTransport(this.mailoptions.smtp);
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
        DOM.content = fn.activeContent();
        DOM.document = this.parser.parseFromString(DOM.content, "text/html");

        if (!this.getPalladiumConfing('disableImageEncode')) {
            DOM = this.imageEncode(DOM);
        }

        this.html = DOM.document.documentElement.outerHTML;

        this.savePlainText();

        return this.html;
    }

    imageEncode(DOM) {
        DOM.images = DOM.document.body.querySelectorAll('img');

        for (let i = 0; i < DOM.images.length; i++) {
            let src = DOM.images[i].getAttribute('src');

            src = 'cid:' + src.replace('cid:', '').split('/').slice(-1)[0];
            DOM.images[i].setAttribute('src', src);
        }

        return DOM;
    }

    valid() {
        if (this.mailconfig === null) {
            atom.notifications.addWarning('Mailconfig not ready to access to the project folder.');
            return false;
        }

        if (!fn.hasProject()) {
            atom.notifications.addWarning('The email can be sent only in project.');
            return false;
        }

        if (!this.mailconfig.existsSync()) {
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
            pt.parse = this.libs.path.parse(pt.path);
            pt.parse.base = pt.parse.base.replace(pt.parse.ext, '.txt');
            pt.parse.ext = '.txt';
            pt.plain_path = this.libs.path.format(pt.parse);
            pt.text = this.libs.plain.fromString(this.html, { wordwrap: 77 });
            pt.text = pt.text.replace(/(\n)\[cid:.*?\] |\[cid:.*?\]/g, '$1');

            new File(pt.plain_path).write(pt.text);
        }
    }

    attachments(dir, loc) {
        let attachments = [];
        let list = dir.getSubdirectory(loc).getEntriesSync();
        let acceptedExt = ['.jpg', '.png', '.gif'];

        list.forEach((file) => {
            if (acceptedExt.indexOf(this.libs.path.extname(file.getPath())) > -1) {
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
