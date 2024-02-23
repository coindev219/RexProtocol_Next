import Whitepaper from './Whitepaper';

export default function Howwork() {
    return (
      <div id="howworks" className="bg-[#1C1924] py-24 sm:py-28 text-white relative">
        <img src="../../img/rexellipse1.png" className='absolute top-0 left-0'></img>
        <div className="text-center mx-auto max-w-7xl px-6 lg:px-8">
            <div className="text-[#9A6FC7] text-base font-medium">How To Start</div>
            <div className="text-3xl font-medium">How it works</div>
            {/* <div className="w-full flex justify-center">
                <div className="max-w-xl tracking-wide">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed quis accumsan nisi Ut ut felis congue nisl hendrerit commodo.</div>
            </div> */}
            <div className="mt-16 grid grid-cols-1 gap-x-8 gap-y-16 text-center lg:grid-cols-3">
                <div className="bg-[#3D3551] p-5 rounded-2xl">
                    <div className="flex justify-center mt-3">
                        <div className="bg-[#1C1924] p-12 rounded-full relative">
                            <img src="../../img/howwork03.png" className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"></img>
                            <div className="bg-[#9A6FC7] px-3 py-2 rounded-full absolute left-20 top-2 flex justify-center items-center font-medium">01</div>
                        </div>
                    </div>
                    <div className="font-medium text-xl mt-7">Connect Wallet via zkEVM</div>
                    <div className="text-[#A9A2BC] mt-3">Make sure you have the Polygon zkEVM network on your wallet. If you need help adding it, click here to learn how.
                    </div>
                </div>
                <div className="bg-[#3D3551] p-5 rounded-2xl shadow-[#9A6FC7]">
                    <div className="flex justify-center mt-3">
                        <div className="bg-[#1C1924] p-12 rounded-full relative">
                            <img src="../../img/howwork02.png" className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"></img>
                            <div className="bg-[#9A6FC7] px-3 py-2 rounded-full absolute left-20 top-2 flex justify-center items-center font-medium">02</div>
                        </div>
                    </div>
                    <div className="font-medium text-xl mt-7">Deposit Funds</div>
                    <div className="text-[#A9A2BC] mt-3">Deposit any token you would like to trade into our DEX smart contract. Once there you can trade them fee and hassle free!
                    </div>
                </div>
                <div className="bg-[#3D3551] p-5 rounded-2xl">
                    <div className="flex justify-center mt-3">
                        <div className="bg-[#1C1924] p-12 rounded-full relative">
                            <img src="../../img/howwork01.png" className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"></img>
                            <div className="bg-[#9A6FC7] px-3 py-2 rounded-full absolute left-20 top-2 flex justify-center items-center font-medium">03</div>
                        </div>
                    </div>
                    <div className="font-medium text-xl mt-7">Trade and Earn</div>
                    <div id="whitepaper" className="text-[#A9A2BC] mt-3">Place limit, market, spot, margin, or short orders and trades easily on our exchange. Just like on a CEX! You also earn a funding rate from any deposits held on the exchange!
                    </div>
                </div>
            </div>
        </div>
        <div className='mt-20 flex justify-center md:px-0 px-2'>
            <div className='bg-[#3D3551] p-3 rounded-2xl mx-4'>
                <Whitepaper />
            </div>
        </div>
      </div>
    )
}
