const axios = require('axios')
module.exports = async function drrpApiTest({ chai }) {
    const { expect } = chai;
    
    const baseUrl = `http://localhost:3000`;
    describe('Check route', () => {

        it('200', async () => {
            const {status, data} = await  axios.get(`${baseUrl}/test-route`)
            expect(status).to.equal(200);
            expect(data).to.equal('this test')
        });
    })
};