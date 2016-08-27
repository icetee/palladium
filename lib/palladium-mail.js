'use babel';

import { Directory } from 'atom';
import { fn } from './components/lib';
import Mailer from './components/mailer';

class PalladiumMail extends Mailer {

    constructor() {
        super();
    }

    sendMail() {
        let self = this;

        if (self.valid()) {
            let path = new Directory(fn.activeFile().getParent().getPath());

            self.setprotocol();
            self.mailoptions.attachments = self.attachments(path, 'img');
            self.mailoptions.html = self.readmail();

            self.transporter.sendMail(self.mailoptions, (error, info) => {
                if (error) {
                    atom.notifications.addError('Failed to send', {
                        detail: error
                    });
                    return false;
                }

                atom.notifications.addSuccess('Message sent', {
                    detail: info.response
                });
            });

        }
    }

    createConfig() {
        if (this.mailconfig.existsSync()) {
            let basename = this.mailconfig.getBaseName();
            atom.notifications.addWarning(`${ basename } already exists.`);

            return false;
        }

        this.mailconfig.write(JSON.stringify(this.config, null, 4)).done(() => {
            atom.workspace.open(this.mailconfig.path);
        });
    }

}

export default new PalladiumMail();
