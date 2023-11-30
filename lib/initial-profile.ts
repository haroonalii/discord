import { currentUser, redirectToSignIn } from "@clerk/nextjs";
import { db } from "@/lib/db";

export const initialProfile = async () => {
  const user = await currentUser(); // current usrr from Clerk


  if (!user) {
    return redirectToSignIn();
  }

    // finding profile of user 
  const profile = await db.profile.findUnique({
    where: {
      userId: user.id
    }
  });

     // if profile available or created already
  if (profile) {
    return profile;
  }

      // if prifle not available
  const newProfile = await db.profile.create({
    data: {
      userId: user.id,
      name: `${user.firstName} ${user.lastName}`,
      imageUrl: user.imageUrl,
      email: user.emailAddresses[0].emailAddress
    }
  });

  return newProfile;
};