const tokens = [
    {
      name: 'REXE',
      content: 'Polygon zkEVM ERC20',
      ringColor:
        'border-[#EFAA58]',
    },
    // {
    //     name: 'Token Soft cap',
    //     content: 'TBD',
    //     ringColor:
    //       'border-[#BFEF58]',
    // },
    // {
    //     name: 'ICO Pre-sale starts in',
    //     content: 'Dec 15-30, 2023',
    //     ringColor:
    //       'border-[#58DDEF]',
    // },
    {
        name: 'Total Supply',
        content: '1,000,000,000 Tokens',
        ringColor:
            'border-[#EF58CE]',
    },
    // {
    //     name: 'Pre ICO price',
    //     content: 'TBD',
    //     ringColor:
    //         'border-[#5882EF]',
    // },
    // {
    //     name: 'Price in ICO',
    //     content: 'TBD',
    //     ringColor:
    //         'border-[#EF587C]',
    // },
    {
        name: 'Profit Share',
        content: 'Exchange profits distributed',
        ringColor:
            'border-[#58EFB0]',
    },
    {
        name: 'Governance Rights',
        content: 'Control REX Exchange',
        ringColor:
            'border-[#58EF67]',
    },
]

export default function TokenInfo() {
    return (
      <div id="tokenomics" className="bg-[#1C1924] pt-24 sm:pt-28 text-white relative">
        <img src="../../img/rexellipse1.png" className='absolute top-[-50px] right-0 rotate-180'></img>
        <div className="text-center mx-auto max-w-7xl px-6 lg:px-8">
            <div className="text-[#9A6FC7] text-base font-medium">About Our Token</div>
            <div className="text-3xl font-medium">Our Token Info</div>
            <div className="w-full flex justify-center">
                <div className="max-w-xl tracking-wide">REXE, REX Exchange’s token is a governance, utility, and profit share token! You can read all about it on our whitepaper!</div>
            </div>

            <div className="mt-10 mx-auto grid grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
                <div className='w-full justify-center items-center flex'>
                    <img
                        src="../../img/rexexchange4.png"
                        alt="Product screenshot"
                        className="w-full max-w-none rounded-xl md:w-[28rem] md:-ml-4 lg:-ml-0"
                        width={2432}
                        height={1442}
                    />
                </div>

                <div className="lg:pl-8 lg:pt-4 text-left flex justify-center">
                    <div className="text-white max-w-2xl grid grid-cols-2 gap-x-16 gap-y-10 lg:gap-y-0 lg:mt-20">
                        {tokens.map((token) => (
                            <div>
                                <div className="sm:text-xl flex text-lg flex-row gap-3">
                                    <div className={`border-4 rounded-full p-2 sm:p-3 w-3 h-3 bg-transparent ${token.ringColor}`}></div>
                                    {token.name}
                                </div>
                                <div className="text-[#BCB2B2] mt-2 sm:text-base text-sm text-center">{token.content}</div>
                            </div>
                        ))}                        
                    </div>
                </div>
            </div>
            
            <div className="w-full flex justify-center pt-10">
                <div className="max-w-xl tracking-wide">*Subject to change before Token Generation Event</div>
            </div>

            <div className='text-white text-center p-10 gap-3 text-2xl justify-center items-center flex flex-row'>
                Supported by <img src="https://assets-global.website-files.com/637359c81e22b715cec245ad/63dc31f8817a4a509d7635a7_Logo.svg" className='w-36'></img>
            </div>
        </div>
      </div>
    )
}
