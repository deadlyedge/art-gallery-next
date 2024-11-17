import { Cable, Codepen } from "lucide-react"

type BottomProps = {}

export const Bottom = ({}: BottomProps) => {
  return (
    <footer className='w-full p-2 bg-slate-800/70 text-right'>
      <span className="mr-0 text-xs">© 2024 art_gallery company.</span>
      <Cable className="inline mx-1" />
      <Codepen className="inline mx-1" />
    </footer>
  )
}
