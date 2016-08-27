'use babel';

import { File } from 'atom';
import { fn } from './lib';
import nodemailer from 'nodemailer';
import smtp from 'nodemailer-smtp-transport';
import cheerio from 'cheerio';
import path from 'path';

export default class Mailer {
    constructor() {
        this.settings = require('./settings.json');
        this.config = require('./mailconfig.json');
        this.mailconfig = new File(fn.getProjectFile('.mailconfig'));
        this.mailoptions = {};
    }

    setprotocol() {
        let self = this;
        let transport = null;

        switch (fn.getCfg('defaultProtocol')) {
            case 'Gmail':
                if (typeof fn.getCfg('gmail') !== 'undefined') {
                    transport = `smtps://${ fn.getCfg('gmail.email').replace("@", "%40") }:${ fn.getCfg('gmail.pass') }@smtp.gmail.com`;
                }
                break;
            case 'SMTP':
                transport = smtp(fn.getCfg('smtp'));
                break;
        }

        self.transporter = nodemailer.createTransport(transport);
    }

    readmail() {
        let file = fn.activeFile();
        let $ = cheerio.load(file.cachedContents, {
            decodeEntities: false
        });

        $('img').each(function() {
            var src = $(this).attr('src');

            $(this).attr('src', 'cid:' + src);
        });

        return $.html();
    }

    valid() {
        let self = this;

        if (!fn.hasProject() || !self.mailconfig.existsSync()) {
            atom.notifications.addWarning('mailconfig not exists!');
            return false;
        }

        try {
            let cfg = JSON.parse(self.mailconfig.readSync(true));
            Object.assign(self.mailoptions, cfg);
        } catch (e) {
            atom.notifications.addError('Palladium configuration file is not valid!');
            return false;
        }

        return true;
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
