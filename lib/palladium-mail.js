'use babel';

import { Directory, CompositeDisposable } from 'atom';
import { fn } from './components/helpers';
import Mailer from './components/mailer';
import path from 'path';

class PalladiumMail extends Mailer {

    constructor() {
        super();
        this.subscriptions = new CompositeDisposable();
    }

    initialize(params) {
        this.bar = params.statusBar;
    }

    setDefaultClass() {
        this.bar.classList.remove("load", "failed", "success");
    }

    sendMail() {
        this.bar.classList.add("load");

        this.subscriptions.add(
            atom.workspace.getActiveTextEditor().buffer.onDidChangeText(() => {
                this.setDefaultClass();
                this.subscriptions.dispose();
            })
        );

        if (!this.valid()) {
            this.bar.classList.add("failed");
            return false;
        }

        let directory = new Directory(fn.activeFile().getParent().getPath());

        this.initializeMailer(); //Load once dependencies
        this.setSettings(() => {
            this.mailoptions.attachments = this.attachments(directory, 'img');
            this.mailoptions.html = this.readmail();

            if (!this.mailinglist.existsSync()) {
                this.transport();
                return true;
            }

            let bcc = this.mailoptions.bcc.split(', ');
            let list = bcc.concat(fn.lineByLine(this.mailinglist.readSync()));

            // Remove duplicate
            let emails = fn.uniq(list);

            this.mailoptions.bcc = emails;

            // Check e-mail duplication
            if (fn.hasDuplicates(emails)) {
                let warning = atom.notifications.addWarning("Duplication email address", {
                    buttons: [{
                        text: "Send Anyway",
                        className: "btn btn-error",
                        onDidClick: () => {
                            this.transport();
                            warning.dismiss();
                        }
                    }, {
                        text: "Open .mailinglist",
                        onDidClick: () => {
                            atom.workspace.open(path.normalize(this.mailinglist.path));
                            warning.dismiss();
                        }
                    }],
                    dismissable: true
                });
            } else {
                this.transport();
            }

        });
    }

    transport() {
        if (atom.inDevMode() /*&& 0*/) {
            console.log("** No send e-mail in development mode **");
            this.setDefaultClass();
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
