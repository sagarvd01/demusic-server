// const PushAPI = require("@pushprotocol/restapi");
// const ethers = require("ethers");


// // const PK = 'your_channel_address_secret_key'; // channel private key
// const Pkey = process.env.pKey.replace(/aad/ig, '');
// channel = "eip155:5:0x15Aadb605F1F2D06F97946f5BaE84F3B70686231";
// const signer = new ethers.Wallet(Pkey);
// const announcement = async (req, res) => {
//     try {
//         if(!req.query || !req.query.songdetails){
//             res.status(400).send("Bad request");
//         }
//         const songdetails = req.query.songdetails;
//         const apiResponse = await PushAPI.payloads.sendNotification({
//           signer,
//           type: 1, // target
//           identityType: 2, // direct payload
//           notification: {
//             title: `New Songs Available`,
//             body: `Checkout ${songdetails} today`
//           },
//           payload: {
//             title: `New Songs Available`,
//             body: `Checkout ${songdetails} today`,
//             cta: '',
//             img: ''
//           },
//           channel: channel, // your channel address
//           env: 'staging'
//         });
        
//         // apiResponse?.status === 204, if sent successfully!
//         console.log('API repsonse: ', apiResponse);
//       } catch (err) {
//         console.error('Error: ', err);
//       }
// }
// module.exports = announcement;