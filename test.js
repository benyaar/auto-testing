const Mocha = require('mocha');
const chai = require('chai');
const tests = require('./register')();
/**
 * Main tests module
 */
module.exports = async function startTests() {


    const res = [];
    const date = new Date();
    try {
        
        const tzOffset = date.getTimezoneOffset();
        const currentTimeWithTimezome = date - tzOffset * 60 * 1000;
        const reportDir = `./log/test-reports/html/${new Date(currentTimeWithTimezome).toISOString().split('T')[0]}`
        const reportFilename = `${new Date(currentTimeWithTimezome).toISOString().replace(/:/g, '-')}`
        const mocha = new Mocha({
            timeout: 15000,
            cleanReferencesAfterRun: true,
            reporter: 'mochawesome',
            reporterOptions: {
                reportDir,
                reportFilename,
                quiet: true,
                html: true,
                inline: true,
                json: false,
            }
        });

        mocha.suite.emit('pre-require', global, null, mocha);

        for (const { name, testPath } of tests) {
            testPath({ chai });
        }

        const runner = mocha.run();

        runner.on('pass', function (test) {
            console.log({ title: test.fullTitle(), status: 'passed', duration: test.duration });
        });

        runner.on('fail', function (test, err) {
            console.log({ title: test.fullTitle(), status: 'failed', error: err.message, duration: test.duration });
        });


        await new Promise((resolve) => {
            runner.on('end', function () {
                const stats = runner.stats;
                res.push({
                    total: stats.tests,
                    passed: stats.passes,
                    failed: stats.failures,
                    duration: stats.duration,
                });
                const mochaGlobals = [
                    'describe', 'context', 'it', 'specify',
                    'before', 'after', 'beforeEach', 'afterEach'
                ];
                for (const key of mochaGlobals) {
                    if (global[key]) {
                        delete global[key];
                    }
                }
                resolve();
            });
        });   
        return { link: `${reportDir}/${reportFilename}` };

    } catch (error) {
        
        return { error: error.message.toString(), status: 500 };
    }
};
