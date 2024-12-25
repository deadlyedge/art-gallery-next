import { cn } from "@/lib/utils"
import Link from "next/link"

type LogoMotionProps = {
	className?: string
	size: "sm" | "lg" | "xl" | "md"
}

const marginClasses = {
	sm: {
		textSize: "text-sm",
		a: "-ml-[0.7rem]",
		ga: "-ml-4.5",
		nx: "-ml-[1.85rem]",
	},
	md: { textSize: "text-base", a: "ml-0", ga: "-ml-6.5", nx: "-ml-[2.4rem]" },
	lg: {
		textSize: "text-lg w-[6.6rem]",
		a: "ml-[0rem]",
		ga: "-ml-[4.2rem]",
		nx: "-ml-[3.6rem]",
	},
	xl: {
		textSize: "text-4xl",
		a: "-ml-[1rem]",
		ga: "-ml-[1.7rem]",
		nx: "-ml-[4.8rem]",
	},
}

const MarginFade = ({
	text,
	hoverText,
	textSize,
	margin,
}: {
	text: string
	hoverText?: string
	textSize: string
	margin: string
}) => (
	<div
		className={cn(
			textSize,
			margin,
			"transition-all duration-300 group-hover/logo:ml-0 relative",
		)}>
		<span className={cn("text-white text")}>{text}</span>
		{hoverText && (
			<span className="text-zinc-500 invisible group-hover/logo:motion-preset-fade group-hover/logo:visible">
				{hoverText}
			</span>
		)}
	</div>
)

const LogoMotion: React.FC<LogoMotionProps> = ({ className, size }) => {
	const { ga, a, nx, textSize } = marginClasses[size]

	return (
		<Link href="/" className={cn(className, "group/logo block ml-2", textSize)}>
			<div className="flex items-center">
				<MarginFade text="a" hoverText="rt" textSize={textSize} margin={a} />
				<MarginFade
					text="ga"
					hoverText="llery"
					textSize={textSize}
					margin={ga}
				/>
				<MarginFade text="nx" textSize={textSize} margin={nx} />
			</div>
		</Link>
	)
}

export default LogoMotion
