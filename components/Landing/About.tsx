import Link from "next/link";

export default function About() {
  return (
    <div id="about" className="overflow-hidden bg-[#24212E] py-12 sm:py-28">
      <div className="mx-auto px-6 2xl:px-20 w-full">
        <div className="mx-auto grid grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 xl:mx-0 xl:max-w-none xl:grid-cols-2">
            <div className='w-full justify-center items-center flex'>
                <img
                    src="../../img/rexexchange02.png"
                    alt="Product screenshot"
                    className="w-full max-w-none rounded-xl shadow-lg shadow-[#794CA9] ring-4 ring-[#794CA9] md:w-[40rem] md:-ml-4 xl:-ml-0"
                    width={2432}
                    height={1442}
                />
            </div>

            <div className="lg:pl-8 lg:pt-4 text-left flex justify-center">
                <div className="text-white max-w-2xl">
                    <h2 className="text-base font-medium leading-7 text-[#9A6FC7]">About Our Trading Platform</h2>
                    <p className="mt-2 text-2xl font-semibold tracking-wider sm:text-3xl">Decentralized Crypto Trading Platform</p>
                    <p className="mt-6 text-lg leading-8">
                    In the ever-evolving landscape of DeFi, REX Exchange emerges as a groundbreaking player, transcending the conventional boundaries of decentralized exchanges.
                    </p>
                    <p className="mt-6 text-lg leading-8">
                    REX Exchange is not just another decentralized trading platform; it represents a paradigm shift in the way users engage with digital assets. By combining the efficiency of a central limit orderbook with the security of blockchain technology, REX Exchange introduces a novel architecture that redefines the possibilities of decentralized trading.
                    </p>
                    <Link href="/ComingSoon/ComingsoonPage"><button className='rounded-3xl bg-[#794CA9] px-12 py-3 text-base mt-8'>Trade Now</button></Link>
                </div>
            </div>
        </div>
      </div>
    </div>
  )
}
