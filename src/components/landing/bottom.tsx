import { Cable, Codepen } from "lucide-react"

export const Bottom = () => {
  return (
    <footer className='w-full p-2'>
      <span className='mr-0 text-xs'>
        © 2024 aganx. built with ❤️ by oldlu.
      </span>
      <Cable className='inline mx-1' />
      <Codepen className='inline mx-1' />
    </footer>
  )
}
