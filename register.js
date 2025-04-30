const fs = require('fs');
const path = require('path');

/**
 * Recursive get all file from test dir 
 */
function collectTestsFromDir(dir, tests = new Set()) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
            collectTestsFromDir(fullPath, tests);
        } else if (
            entry.isFile() &&
            entry.name.endsWith('.test.js') &&
            fs.statSync(fullPath).size > 0 
        ) {
            try {
                const testPath = require(fullPath);
                if (typeof testPath === 'function') {
                    const name = entry.name.replace('.test.js', '');
                    tests.add({ name, testPath });
                }
            } catch (err) {
               console.log(err);
            }
        }
    }

    return tests;
}

module.exports = () => {
    const controllerDir = path.join(__dirname, 'tests');
    return collectTestsFromDir(controllerDir);
};
