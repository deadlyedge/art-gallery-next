"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const testimonials = [
	{
		name: "NextJS",
		avatar: "N",
		title: "Base Framework",
		description:
			"Next is good, especially Typescript.  For me, I start coding from python, and then react, nextjs just like python backend + react frontend, combined with typescript, great.",
	},
	{
		name: "Discord",
		avatar: "M",
		title: "Interaction Logic",
		description:
			"Discord is a good choice for interaction logic.  I throught discord is like a mordern real time bbs.  I'm not a deep discord user, but I learnt a lot from the project: Full Stack Discord Clone by code with antonio.  I think that is a good start point for this project.",
	},
	{
		name: "File Share",
		avatar: "M",
		title: "Dependency",
		description:
			"I use uploadthing for this project, it's free for starting projects, their api are easy to use, they are good.  But not enough especially for my network condition.  So I have to make an alternative for file sharing.  With those 2 project (pyBlobServer and UI) which you could find in my github, this aganx runs better.",
	},
]

export const LandingContent = () => {
	return (
		<div className="px-10 pb-20">
			<h2 className="text-center text-4xl text-white font-extrabold mb-10">
				Testimonials
			</h2>
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
				{testimonials.map((item) => (
					<Card key={item.description}>
						<CardHeader>
							<CardTitle className="flex items-center gap-x-2">
								<div>
									<p className="text-lg">{item.name}</p>
									<p className="text-zinc-400 text-sm">{item.title}</p>
								</div>
							</CardTitle>
							<CardContent className="pt-4 px-0">
								{item.description}
							</CardContent>
						</CardHeader>
					</Card>
				))}
				<Card className="col-span-full sm:p-8">
					<CardHeader>
						<CardTitle>About</CardTitle>
					</CardHeader>
					<CardContent>
						My kid likes to paint, and I want to make a place for him to show
						his works. But when I search in github, I found so few options, so I
						made this project.
						<br />
						<br />
						This project is made for fun. And this site is just a demo or, like
						some idea test, so you could try it if you want to, but I promise
						NOTHING on consistency, your data must NOT to be private and
						important, because I may check my database or delete anything
						without send a warning.
						<br />
						<br />
						<code className="text-zinc-400">
							I hope it helps for you and your kids.
						</code>
						<br />
						<br />
						<a
							className="text-sm bg-zinc-200 rounded-full px-3 pb-0.5 text-zinc-800"
							href="https://github.com/deadlyedge/art-gallery-next">
							<code>Page on GITHUB</code>
						</a>
						<br />
						<br />
						<code className="float-right text-zinc-300 mb-4">
							- xdream an old student
						</code>
					</CardContent>
				</Card>
			</div>
		</div>
	)
}
