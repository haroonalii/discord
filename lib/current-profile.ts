// this file will be use in all apis to check the current profile
import { auth } from "@clerk/nextjs";
import { db } from "@/lib/db";

export const currentProfile = async () => {
    const { userId } = auth()

    if(!userId) return null

    const profile = await db.profile.findUnique({
        where: {
            userId
        }
    })

    return profile
}
