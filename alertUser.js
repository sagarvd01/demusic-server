const PushAPI = require("@pushprotocol/restapi");
const ethers = require("ethers");


// const PK = 'your_channel_address_secret_key'; // channel private key
const Pkey = process.env.pKey.replace(/aad/ig, '');
channel = "eip155:5:0x15Aadb605F1F2D06F97946f5BaE84F3B70686231";
const signer = new ethers.Wallet(Pkey);
const alertUsers = async (req, res) => {
    try {
        const apiResponse = await PushAPI.payloads.sendNotification({
          signer,
          type: 3, // target
          identityType: 2, // direct payload
          notification: {
            title: `[SDK-TEST] notification TITLE:`,
            body: `[sdk-test] notification BODY`
          },
          payload: {
            title: `[sdk-test] payload title`,
            body: `sample msg body`,
            cta: '',
            img: ''
          },
          recipients: 'eip155:5:0xee6f3c8c7452AcafA0A2d2586552f8b77a3e4286', // recipient address
          channel: channel, // your channel address
          env: 'staging'
        });
        
        // apiResponse?.status === 204, if sent successfully!
        console.log('API repsonse: ', apiResponse);
        if(apiResponse.status == 204){
            res.sendStatus(200);
        }
        else{
            res.sendStatus(401);
        }
      } catch (err) {
        console.error('Error: ', err);
        res.sendStatus(403);
      }
}
module.exports = alertUsers;