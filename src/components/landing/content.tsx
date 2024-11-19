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
    name: "Postgres",
    avatar: "M",
    title: "Database",
    description:
      "I choose mongodb with gridFS support. By some research, I think mongo may be the best way to combine document and file save together.  And mongodb is like a self logical operating JSON.  Simple and intuitive.",
  },
  {
    name: "File Share",
    avatar: "M",
    title: "Purpose",
    description:
      "This is a learning project. I had done some search work on docker hub and github, for a simple file store and share solution, maybe I typed the wrong keyword, I found so few options, so I made this.",
  },
]

export const LandingContent = () => {
  return (
    <div className='px-10 pb-20'>
      <h2 className='text-center text-4xl text-white font-extrabold mb-10'>
        Testimonials
      </h2>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
        {testimonials.map((item) => (
          <Card
            key={item.description}
            className='bg-[#192339] border-none text-white'>
            <CardHeader>
              <CardTitle className='flex items-center gap-x-2'>
                <div>
                  <p className='text-lg'>{item.name}</p>
                  <p className='text-zinc-400 text-sm'>{item.title}</p>
                </div>
              </CardTitle>
              <CardContent className='pt-4 px-0'>
                {item.description}
              </CardContent>
            </CardHeader>
          </Card>
        ))}
        <Card className='bg-[#192339] border-none p-8 text-white col-span-full'>
          <CardHeader>
            <CardTitle>About</CardTitle>
          </CardHeader>
          <CardContent>
            This project is made for fun. And this site is just a demo or, like
            temporary or personal file save space for myself, so you could try
            it if you want to, but I promise NOTHING on consistency, your data
            must NOT to be private and important, because I may check my
            database or delete anything without send a warning.
            <br />
            <br />
            I throught it may useful when someone have a vps and want to add a
            bit more workload to it, and may make some test work easier.
            <br />
            <br />
            I try to run all my project on mongodb, because I love mongo. And I
            have had a mongodb running, and it looks less code to write.
            <br />
            <br />
            <code className='text-gray-400'>
              It could help you either, I hope.
            </code>
            <br />
            <br />
            <a
              className='text-sm bg-gray-200 rounded-full px-3 pb-0.5 text-zinc-800'
              href='https://github.com/deadlyedge/art-gallery-next'>
              <code>Page on GITHUB</code>
            </a>
            <code className='float-right text-gray-300'>
              - xdream oldlu: an old student
            </code>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
