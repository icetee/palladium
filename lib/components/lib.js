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
}

export let fn = new Functions();
