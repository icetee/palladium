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

        const dir = new Directory(path.normalize(fn.activeFile().getParent().getPath()));

        this.initializeMailer(); //Load once dependencies
        this.setSettings(() => {
            this.mailoptions.attachments = this.attachments(dir, 'img');
            this.mailoptions.html = this.readmail();

            if (!this.mailinglist.existsSync()) {
                this.transport();
                return true;
            }

            // Read .maillinglist
            let list = [];
            if (typeof this.mailoptions.bcc === "undefined") {
                list = fn.lineByLine(this.mailinglist.readSync(true));
            } else {
                let bcc = this.mailoptions.bcc.split(', ');
                list = bcc.concat(fn.lineByLine(this.mailinglist.readSync(true)));
            }

            // Check email validations
            let invalids = [];
            for (let i = 0; i < list.length; i++) {
                if (!this.libs.validator.validate(list[i])) {
                    if (list[i] === "") {
                        break;
                    }
                    invalids.push({
                        line: i + 1,
                        email: list[i]
                    });
                }
            }

            // Remove duplicate
            let emails = fn.uniq(list);

            this.mailoptions.bcc = emails;

            if (invalids.length > 0) {
                let error = atom.notifications.addError("Invalid email address", {
                    buttons: [{
                        text: "Open .mailinglist",
                        onDidClick: () => {
                            atom.workspace.open(path.normalize(this.mailinglist.path));
                        }
                    },{
                        text: "Close",
                        className: "btn btn-warning",
                        onDidClick: () => {
                            error.dismiss();
                        }
                    }],
                    detail: invalids.map(function(r) {
                        return "Line: " + r.line + " => " + r.email;
                    }).join('\n'),
                    dismissable: true
                });
                return false;
            }

            // Check email duplications
            if (fn.hasDuplicates(this.mailoptions.bcc)) {
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
                    detail: "Please chek .maillinglist and .mailconfig files",
                    dismissable: true
                });
            } else {
                this.transport();
            }

        });
    }

    transport() {
        if (atom.inDevMode() && atom.config.get('palladium.enableDeveloperMode')) {
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

        this.mailconfig.write(JSON.stringify(this.config, null, 4)).then(() => {
            atom.workspace.open(path.normalize(this.mailconfig.path));
        }).catch((error) => {
            atom.notifications.addWarning(error.reason);
        });
    }

    serialize() {

    }

}

export default PalladiumMail;
