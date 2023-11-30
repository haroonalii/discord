"use client";

// It is use for validation of form
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { FileUpload } from "@/components/file-upload";
import axios from 'axios'

// for dialog
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// for form
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

// for Inputs
import { Input } from "@/components/ui/input";

// for Button
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

// This schema will be used by form using zodresolver
const formSchema = z.object({
  name: z.string().min(1, {
    message: "Server name is required",
  }),
  imageUrl: z.string().min(1, {
    message: "Server image is required",
  }),
});

export const InitialModal = () => {
    const [isMounted, setIsMounted] = useState(false)

    const router = useRouter()

    useEffect(()=>{
        setIsMounted(true)
    },[])

  const form = useForm({
    resolver: zodResolver(formSchema), // for validation schema is being resolved
    defaultValues: {
      name: "",
      imageUrl: "",
    },
  });

  // to let us know when the form is loading so that to disable the inputs
  const isLoading = form.formState.isSubmitting;

  // to log our values
  const onSubmit = async (values: z.infer<typeof formSchema>) => {

    // this for the creation of api
    try {
      await axios.post("/api/servers", values)

      form.reset()
      router.refresh()
      window.location.reload()
    } catch(error){
      console.log(error)
    }
  };

  if(!isMounted){
    return null
  }
  return (
    <Dialog open>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Customize your server
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Give your server a personality with a name and an image. You can
            always change it anytime
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          {" "}
          {/* which comes from useForm from Above */}
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-8 px-6">
              <div className="flex items-center justify-center text-center">
                <FormField
                control={form.control}
                name="imageUrl"
                render={({field}) => (
                  <FormItem>
                    <FormControl>
                      <FileUpload
                      endpoint="serverImage" // Importing from core.ts
                      value={field.value}
                      onChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
                />
              </div>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark: text-secondary/70">
                      Server Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                        placeholder="Enter server name"
                        {...field} // from render
                      />
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="bg-gray-100 px-6 py-4">
                <Button variant="primary" disabled={isLoading}>Create</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
