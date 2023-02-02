const PushAPI = require("@pushprotocol/restapi");
const ethers = require("ethers");
// const { Framework } = require("@superfluid-finance/sdk-core");
const userRegistryAddress = "0xAb49a54Fa02fD8F7D8ae619a4F34Df3da45249ba";//"0xa5f76dF5549F7569E1b418088999F288eF72B535";
const sDAIx = "0xF2d68898557cCb2Cf4C10c3Ef2B034b2a69DAD00";
const userRegistryABI = [
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "svr",
				"type": "address"
			}
		],
		"name": "addServerAddress",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "addUser",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "previousOwner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "OwnershipTransferred",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "renounceOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "transferOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "unSubscribe",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "user",
				"type": "address"
			}
		],
		"name": "checkUserSubsciptionStatus",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getUsers",
		"outputs": [
			{
				"internalType": "address[]",
				"name": "",
				"type": "address[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

const channel = "eip155:5:0x15Aadb605F1F2D06F97946f5BaE84F3B70686231";
const alertUsers = async (req, res) => {
    const pKey = process.env.pKey.replace(/aad/ig, '');
    const provider =  new ethers.providers.StaticJsonRpcProvider("https://goerli.infura.io/v3/" + process.env.infura_api, {chainId: 5, name: "Goerli"});
    const wallet = new ethers.Wallet(pKey, provider);
    const contract = new ethers.Contract(userRegistryAddress, userRegistryABI, wallet.provider.getSigner(wallet.address));
    // const sf = await Framework.create({
    //     chainId: 5,
    //     provider: wallet.provider
    // });
    
    const allUsers = await contract.getUsers();
    // const token = await sf.loadSuperToken(sDAIx);
    const targets = [];
    allUsers.forEach(async (user) => {
        let result = await contract.checkUserSubsciptionStatus(user);
        if(result){
            targets.push(user);
        }
        // let result = await token.getFlow({
        //     sender: user,
        //     receiver: "0x15Aadb605F1F2D06F97946f5BaE84F3B70686231",
        //     providerOrSigner: wallet.provider.getSigner(wallet.address)
        // })
        // if(result.flowRate > 0){
        //     targets.push("eip155:5:" + result);
        // }
    });
    try {
        const apiResponse = await PushAPI.payloads.sendNotification({
            signer: wallet,
            type: 4, // target
            identityType: 2, // direct payload
            notification: {
                title: `Your DeMusic subscription will be auto renewed tomorrow`,
                body: `Your DeMusic subscription of $4/month will be auto renewed tomorrow.`
            },
            payload: {
                title: `Your DeMusic subscription will be auto renewed tomorrow`,
                body: `Your DeMusic subscription of $4/month will be auto renewed tomorrow.`,
                cta: '',
                img: ''
            },
            recipients: targets, // recipient address
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