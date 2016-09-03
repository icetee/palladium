'use babel';

import { Directory, CompositeDisposable } from 'atom';
import { fn } from './components/lib';
import Mailer from './components/mailer';

class PalladiumMail extends Mailer {

    constructor() {
        super();
        this.subscriptions = new CompositeDisposable();
    }

    initialize(params) {
        this.bar = params.statusBar;
    }

    sendMail() {
        this.bar.classList.add("load");

        this.subscriptions.add(
            atom.workspace.getActiveTextEditor().buffer.onDidChangeText(() => {
                this.bar.classList.remove("load", "failed", "success");
                this.subscriptions.dispose();
            })
        );

        if (!this.valid()) {
            this.bar.classList.add("failed");
            return false;
        }

        let path = new Directory(fn.activeFile().getParent().getPath());

        this.setSettings(() => {
            this.mailoptions.attachments = this.attachments(path, 'img');
            this.mailoptions.html = this.readmail();

            if (atom.inDevMode()) {
                console.log("** No send e-mail in development mode **");
                this.bar.classList.remove("load", "failed", "success");
                return false;
            }

            this.transporter.sendMail(this.mailoptions, (error, info) => {

                if (error) {
                    atom.notifications.addError('Failed to send', {
                        detail: error
                    });
                    return false;
                }

                this.bar.classList.add("success");

                atom.notifications.addSuccess('Message sent', {
                    detail: info.response
                });
            });
        });
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

    serialize() {

    }

}

export default PalladiumMail;
