const peopole = [
    {
      name: 'Anthony Mclaire',
      content: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo con',
      position: 'CEO of Project',
      imageUrl: ' ',
      ringColor:
        'border-[#EFAA58]',
    },
    {
        name: 'Token Soft cap',
        content: 'TBD',
        ringColor:
          'border-[#BFEF58]',
    },
    {
        name: 'ICO Pre-sale starts in',
        content: 'Dec 15-30, 2023',
        ringColor:
          'border-[#58DDEF]',
    },
    {
        name: 'Total Supply',
        content: '1,000,000,000 Token',
        ringColor:
            'border-[#EF58CE]',
    },
    {
        name: 'Pre ICO price',
        content: 'TBD',
        ringColor:
            'border-[#5882EF]',
    },
    {
        name: 'Price in ICO',
        content: 'TBD',
        ringColor:
            'border-[#EF587C]',
    },
    {
        name: 'Profit Share',
        content: '100% of all profits distributed ',
        ringColor:
            'border-[#58EFB0]',
    },
    {
        name: 'Governance Rights',
        content: 'Govern REX Exchange',
        ringColor:
            'border-[#58EF67]',
    },
]

export default function Teams() {
    return (
      <div id="howworks" className="bg-[#1C1924] py-24 sm:py-28 text-white relative">
        <img src="../../img/rexellipse1.png" className='absolute top-0 left-0 lg:left-32'></img>
        <div className="text-center mx-auto max-w-7xl px-6 lg:px-8">
            <div className="text-3xl font-medium">Meet The Team</div>
            <div className="w-full flex justify-center">
                <div className="max-w-xl tracking-wide">Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatu</div>
            </div>
            <div className="mt-16 grid grid-cols-1 gap-x-8 gap-y-16 text-center lg:grid-cols-3">
                <div className="bg-[#3D3551] p-5 rounded-2xl">
                    <div className="flex justify-center mt-3">
                        <div className="bg-[#1C1924] p-12 rounded-full relative">
                            <img src="../../img/howwork01.png" className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"></img>
                            <div className="bg-[#9A6FC7] px-3 py-2 rounded-full absolute left-20 top-2 flex justify-center items-center font-medium">01</div>
                        </div>
                    </div>
                    <div className="font-medium text-xl mt-7">Connect Wallet via zkEVM</div>
                    <div className="text-[#A9A2BC] mt-3">Make sure you have the Polygon zkEVM network on your wallet. If you need help adding it, click here to learn how.
                    </div>
                </div>

            </div>
        </div>
      </div>
    )
}
