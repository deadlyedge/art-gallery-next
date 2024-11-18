import { auth } from "@clerk/nextjs/server"

import { db } from "@/lib/db"

export const currentProfile = async () => {
  // 根据登录状况获取用户ID
  const { userId } = await auth()

  if (!userId) {
    return null
  }

  // 根据用户ID，从数据库获取用户信息
  const profile = await db.profile.findUnique({
    where: {
      userId,
    },
  })

  return profile
}
