import { Hash } from "lucide-react"

type ChatWelcomeProps = {
  name: string
  type: "content" | "conversation"
}

export const ChatWelcome = ({ name, type }: ChatWelcomeProps) => {
  return (
    <div className='space-y-2 px-4 mb-4'>
      {type === "content" && (
        <div className='h-[75px] w-[75px] rounded-full bg-zinc-500 dark:bg-zinc-700 flex items-center justify-center'>
          <Hash className='h-12 w-12 text-white' />
        </div>
      )}
      <p className='text-xl md:text-3xl font-bold'>
        {type === "content" ? "欢迎来到 #" : ""}
        {name}
      </p>
      <p className='text-zinc-600 dark:text-zinc-400 text-sm'>
        {type === "content"
          ? `这是 #${name} 频道的起始`
          : `这是你和 ${name} 交谈的开始`}
      </p>
    </div>
  )
}
