import { currentProfile } from "@/lib/current-profile";
import { redirectToSignIn } from "@clerk/nextjs";
import {redirect} from "next/navigation"
import {ServerSidebar} from "@/components/server/server-sidebar"

import { db } from "@/lib/db";

const ServerIdLayout = async ({
  children,
  // every server have this property that let us know what it is in the url
  params,
}: // now give types for the children
{
  // types for the children
  children: React.ReactNode;
  // types of the params
  params: {
    serverId: string;
  };
}) => {
      // fetch the current Profile
  const profile = await currentProfile();

    if(!profile){
        return redirectToSignIn()
    }

      // find the server with this id
  const server = db.server.findUnique({
    where: {
      // serverId is in the url so that we can fetch it, as we named the folder as [serverId]
      id: params.serverId,

      // to prevent anyone knowing the serverId accessing it
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  if (!server) return redirect("/");
  return (
    <div className="h-full">
      <div className="hidden md:flex h-full w-60 z-20 flex-col fixed inset-y-0">
        {/* Servers Sidebar area*/}
        <ServerSidebar serverId={params.serverId}/>
      </div>
      <main className="h-full md:pl-60">{children}</main>
    </div>
  );
};

export default ServerIdLayout;
