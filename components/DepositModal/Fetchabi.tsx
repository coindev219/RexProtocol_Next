

import  axios  from 'axios'

const ETHERSCAN_KEY = ''

export default async function FetchAbi(token_address: string){
    var TOKEN_ABI_unformatted = `https://api.etherscan.io/api?module=contract&action=getabi&address=${token_address}&apikey=${ETHERSCAN_KEY}`
    var response = await axios.get(TOKEN_ABI_unformatted)
    var format = await JSON.parse(response.data.result)
    var reformat = JSON.stringify(format);
    var TOKEN_ABI = JSON.parse(reformat)
    return TOKEN_ABI;

}