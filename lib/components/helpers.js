'use babel';

class Functions {
    hasProject() {
        return atom.project && atom.project.getPaths().length;
    }
    getCfg(option) {
        return atom.config.get('palladium.' + option);
    }
    getProjectFolder() {
        return atom.project.getPaths()[0];
    }
    getProjectFile(filename) {
        return atom.project.resolvePath(filename);
    }
    activeFile() {
        return atom.workspace.getActivePaneItem().buffer.file;
    }
    activeFileGrammar() {
        return atom.workspace.getActiveTextEditor().getGrammar().scopeName;
    }
    gmail(auth) {
        return  `smtps://${ auth.email.replace("@", "%40") }:${ auth.pass }@smtp.gmail.com`;
    }
    lineByLine(string) {
        // Replace \r\n to \n and split
        return string.replace(/(?:\\[rn]|[\r\n]+)+/g, "\n").split('\n');
    }
    uniq(array) {
        return array.filter(function(item, pos) {
            return array.indexOf(item) == pos && item !== "";
        });
    }
    emailParse(array, findMail = new RegExp('\<(.*)\>', 'i')) {
        // Get text from < ... > tags
        return array.map(function(value){
            return (findMail.test(value)) ? require('lodash.words')(value, findMail)[1] : value;
        });
    }
    hasDuplicates(array, findMail = new RegExp('\<(.*)\>', 'i')) {
        let emails = this.emailParse(array, findMail);
        return (new Set(emails)).size !== emails.length;
    }
}

export let fn = new Functions();
