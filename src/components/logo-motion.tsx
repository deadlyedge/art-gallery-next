import { cn } from "@/lib/utils"

type LogoMotionProps = {
  className?: string
  componentSize: "sm" | "lg" | "xl" | "md"
}

const marginClasses = {
  sm: {
    size: "text-sm",
    a: "-ml-[0.7rem]",
    ga: "-ml-4.5",
    nx: "-ml-[1.85rem]",
  },
  md: { size: "text-base", a: "ml-0", ga: "-ml-6.5", nx: "-ml-[2.4rem]" },
  lg: {
    size: "text-lg w-[7rem]",
    a: "-ml-[4.6rem]",
    ga: "-ml-6.5",
    nx: "-ml-[4rem]",
  },
  xl: { size: "text-4xl", a: "-ml-7", ga: "-ml-8.5", nx: "-ml-[4.8rem]" },
}

const MarginFade = ({
  text,
  hoverText,
  size,
  margin,
}: {
  text: string
  hoverText?: string
  size: string
  margin: string
}) => (
  <div
    className={cn(
      size,
      margin,
      "flex transition-all duration-300 group-hover:ml-0"
    )}>
    <div className={cn("text-white text")}>{text}</div>
    {hoverText && (
      <div className='text-zinc-500 invisible group-hover:motion-preset-fade group-hover:visible'>
        {hoverText}
      </div>
    )}
  </div>
)

const LogoMotion: React.FC<LogoMotionProps> = ({
  className,
  componentSize,
}) => {
  const { ga, a, nx, size } = marginClasses[componentSize]

  return (
    <a href='/' className={cn(className, "group block", size)}>
      <div className='flex items-center'>
        <MarginFade text='a' hoverText='rt' size={size} margin={ga} />
        <MarginFade text='ga' hoverText='llery' size={size} margin={a} />
        <MarginFade text='nx' size={size} margin={nx} />
      </div>
    </a>
  )
}

export default LogoMotion
