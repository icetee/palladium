'use babel';
/*
 * palladium
 * https://github.com/icetee/palladium
 *
 * Copyright (c) 2016 icetee
 * Licensed under the MIT license.
 */

class Components {
    hasProject() {
        return atom.project && atom.project.getPaths().length;
    }
    getCfg(option) {
        return atom.config.get('palladium.' + option);
    }
    getProjectFile(filename) {
        return atom.project.resolvePath(filename);
    }
    activeFile() {
        return atom.workspace.getActivePaneItem().buffer.file;
    }
}

export default new Components();
