export default function Whitepaper() {
    return (
        <div className="mx-auto grid grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0ss lg:max-w-none lg:grid-cols-2">
            <div className='w-full justify-center items-center flex'>
                <img
                    src="../../img/rexexchange03.png"
                    alt="Product screenshot"
                    className="w-full max-w-none rounded-xl md:w-[32rem] md:-ml-4 lg:-ml-0"
                    width={2432}
                    height={1442}
                />
            </div>

            <div className="px-4 pt-2 lg:px-8 lg:pt-4 text-left flex justify-center">
                <div className="text-white max-w-xl">
                    <h2 className="text-base font-medium leading-7 text-[#9A6FC7]">Our Whitepaper</h2>
                    <p className="mt-2 text-2xl font-semibold tracking-wider sm:text-3xl">Read Our Whitepaper</p>
                    <p className="mt-2 text-lg leading-8">
                        Discover the functionality of REX Exchange, which employs an off-chain orderbook and matching engine, along with oracles and on-chain execution. This unique combination enables the platform to offer market and limit orders, margin trading, decentralized funding, spot asset shorting, and commission-free trades!
                    </p>
                    <a href="https://rex-protocol.gitbook.io/rex-exchange/" target="_blank"><button className='rounded-3xl bg-[#794CA9] px-12 py-3 text-base mt-8 mb-4'>Read Now</button></a>
                </div>
            </div>
        </div>
    )
}
