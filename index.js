const express = require('express')
const app = express()
const port = 3000
const test = require('./test')
const path = require('path')
const fs = require('fs')

app.use(express.static(path.join(__dirname, 'log')));


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'))
});


app.get('/test-route', (req, res) => {
    res.status(200).send('this test')
})

app.get('/start-test', async (req, res) => {
    const { link } = await test(); 

    const maxWait = 5000;
    const interval = 200;
    let waited = 0;

    while (waited < maxWait) {
        try {
            if (!fs.existsSync(path.join(__dirname, link + '.html'))) {
                throw Error('not file')
            }

            return res.redirect(`/${link.replace('log', '')}.html`);
        } catch (err) {
            console.log(err);
            await new Promise(resolve => setTimeout(resolve, interval));
            waited += interval;
        }
    }

    res.status(500).send('Not found');
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});
