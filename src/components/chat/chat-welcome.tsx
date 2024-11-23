import { Hash } from "lucide-react"

type ChatWelcomeProps = {
  title: string
  type: "content" | "conversation"
}

export const ChatWelcome = ({ title, type }: ChatWelcomeProps) => {
  return (
    <div className='space-y-2 px-4 mb-4'>
      {/* {type === "content" && (
        <div className='h-[75px] w-[75px] rounded-full bg-zinc-500 dark:bg-zinc-700 flex items-center justify-center'>
          <Hash className='h-12 w-12 text-white' />
        </div>
      )}
      <p className='text-xl md:text-3xl font-bold'>
        {type === "content" ? "欢迎来到 #" : ""}
        {title}
      </p> */}
      <p className='text-xs'>
        {type === "content"
          ? `starting of #${title}`
          : `starting of conversation with ${title}`}
      </p>
    </div>
  )
}
