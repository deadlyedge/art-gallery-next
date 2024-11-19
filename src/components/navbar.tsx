import { Button } from "@/components/ui/button"
import { CircleEllipsis, DiamondPlus } from "lucide-react"
import LogoMotion from "./logo-motion"

type NavbarProps = {}

export const Navbar = ({}: NavbarProps) => {
  return (
    <nav className='sticky top-0 z-20 bg-black/50 text-xs md:text-base flex justify-between h-12 p-2'>
      <LogoMotion componentSize="lg" />
      <div className='flex grow items-center justify-between'>
        <ul></ul>
        <ul className='flex flex-row items-center gap-1'>
          <li className='bg-slate-800/50 hover:bg-slate-500/50 rounded-full p-2'>
            <a className='font-semibold' href='/#'>
              摄影
            </a>
          </li>
          <li className='bg-slate-500/50 rounded-full p-2'>
            <a className='font-semibold' href='/#'>
              素描
            </a>
          </li>
          <li className='bg-slate-800/50 hover:bg-slate-500/50 rounded-full p-2'>
            <a className='font-semibold' href='/#'>
              杂项作品
            </a>
          </li>
        </ul>
        <ul className='flex flex-row items-center'>
          <li className='bg-orange-800 hover:bg-orange-500 rounded-full p-2'>
            <a className='' href='#'>
              添加
              <DiamondPlus className='inline mb-1' />
            </a>
          </li>
          <li className='bg-sky-800 hover:bg-sky-500 rounded-full p-2'>
            <a className='' href='#'>
              选项
              <CircleEllipsis className='inline mb-1' />
            </a>
          </li>
        </ul>
      </div>
    </nav>
  )
}
