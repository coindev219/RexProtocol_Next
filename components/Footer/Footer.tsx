import { FaDiscord, FaTelegramPlane, FaTwitter } from 'react-icons/fa';
import { HiOutlineClipboardDocumentList } from 'react-icons/hi2';

export default function Footer() {
    return (
      <div className="border-t border-[#3D3551] overflow-hidden bg-[#1C1924] text-white py-12 sm:py-16">
        <div className="mx-auto px-6 lg:px-40">
            <div className='flex flex-row gap-5 justify-center'>
                <div className='p-2 rounded-full bg-[#9A6FC7]'><a href="https://discord.gg/ENczHU9p52" target="_blank"><FaDiscord className='w-8 h-8'/></a></div>
                <div className='p-2 rounded-full bg-[#9A6FC7]'><a href="https://t.me/+JXVbIJJJemliMjY5" target="_blank"><FaTelegramPlane className='w-8 h-8'/></a></div>
                <div className='p-2 rounded-full bg-[#9A6FC7]'><a href="https://twitter.com/REXProtocol" target="_blank"><FaTwitter className='w-8 h-8'/></a></div>
                <div className='p-2 rounded-full bg-[#9A6FC7]'><a href="https://rex-protocol.gitbook.io/rex-exchange/" target="_blank"><HiOutlineClipboardDocumentList className='w-8 h-8'/></a></div>
            </div>
            <div className='mt-10 text-center text-sm'>Copyright © 2023 We Have and You Have All rights reserved</div>           
        </div>
      </div>
    )
}
