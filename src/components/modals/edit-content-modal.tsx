"use client"

import qs from "query-string"
import axios from "axios"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
// import { ContentType } from "@prisma/client"

import {
  Dialog,
  DialogContent,
  // DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useModal } from "@/hooks/use-modal-store"
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select"
import { useEffect } from "react"
import { FileUpload } from "../file-upload"
import { Textarea } from "../ui/textarea"
import { Checkbox } from "../ui/checkbox"

const formSchema = z.object({
  title: z
    .string()
    .min(1, {
      message: "Content title is required.",
    })
    .refine((title) => title !== "general", {
      message: "Content title cannot be 'general'",
    }),
  // type: z.nativeEnum(ContentType),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
  isPublic: z.boolean().default(false),
})

export const EditContentModal = () => {
  const { isOpen, onClose, type, data } = useModal()
  const router = useRouter()

  const isModalOpen = isOpen && type === "editContent"
  const { content, event } = data

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: content?.description || "",
      imageUrl: content?.imageUrl || "",
      isPublic: content?.isPublic || false,
    },
  })

  useEffect(() => {
    if (content) {
      form.setValue("title", content.title)
      form.setValue("description", content.description || "")
      form.setValue("imageUrl", content.imageUrl || "")
      form.setValue(
        "isPublic",
        (!!content.imageUrl && content.isPublic) || false
      )
    }
  }, [form, content, content?.imageUrl, isOpen])

  const isLoading = form.formState.isSubmitting

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const url = qs.stringifyUrl({
        url: `/api/contents/${content?.id}`,
        query: {
          eventId: event?.id,
        },
      })
      await axios.patch(url, values)

      form.reset()
      router.refresh()
      onClose()
    } catch (error) {
      console.log(error)
    }
  }

  const handleClose = () => {
    form.reset()
    onClose()
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className='p-0 overflow-hidden'>
        <DialogHeader className='pt-8 px-6'>
          <DialogTitle className='text-2xl text-center font-bold'>
            编辑内容
          </DialogTitle>
          {/* <DialogDescription className='text-center text-zinc-500'>
            目前只能选择文字类型的频道
          </DialogDescription> */}
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
            <div className='space-y-8 px-6'>
              <FormField
                control={form.control}
                name='title'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='uppercase text-xs font-bold text-primary/70'>
                      title
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className='border border-zinc-500 focus:bg-zinc-900/80 focus-visible:ring-0 focus-visible:ring-offset-0'
                        placeholder='输入内容标题'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='description'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='uppercase text-xs font-bold text-primary/70'>
                      Description
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        disabled={isLoading}
                        className='border border-zinc-500 focus:bg-zinc-900/80 focus-visible:ring-0 focus-visible:ring-offset-0'
                        placeholder='Enter Description'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className='flex items-center justify-center text-center'>
                <FormField
                  control={form.control}
                  name='imageUrl'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='uppercase text-xs font-bold text-primary/70'>
                        Image
                      </FormLabel>
                      <FormControl className='flex items-center justify-center'>
                        <FileUpload
                          endpoint='contentImage'
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <DialogFooter className='px-6 py-4'>
              <FormField
                control={form.control}
                name='isPublic'
                render={({ field }) => (
                  <FormItem className='rounded-md flex items-center'>
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        disabled={!form.getValues("imageUrl")}
                        onCheckedChange={field.onChange}
                        className='w-5 h-5 mr-1'
                      />
                    </FormControl>
                    <FormLabel className='pb-1.5'>
                      是否希望此内容和您的名字一起显示在首页
                    </FormLabel>
                    {/* <FormDescription>
                        You can manage your mobile notifications in the{" "}
                        <Link href='/examples/forms'>mobile settings</Link>{" "}
                        page.
                      </FormDescription> */}
                  </FormItem>
                )}
              />
              <Button variant='default' disabled={isLoading}>
                保存
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
