/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable react-hooks/exhaustive-deps */
import { updateStudioSettingsSchema } from "@/schemas/studio-setting-schema";
import { useZodForm } from "./useZodForm";
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { updateStudioSettings } from "@/lib/utils";
import { toast } from "sonner";

export const useStudioSettings = (
  id: string,
  screen?: string | null,
  audio?: string | null,
  preset?: "HD" | "SD",
  plan?: "PRO" | "FREE"
) => {
  const [onPresent, setOnPresent] = useState<"HD" | "SD" | undefined>();
  const { register, watch } = useZodForm(updateStudioSettingsSchema, {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-expect-error
    screen: screen!,
    audio: audio!,
    preset: preset!,
  });

  const { mutate, isPending } = useMutation({
    mutationKey: ["update-studio"],
    mutationFn: (data: {
      screen: string;
      id: string;
      audio: string;
      preset: "HD" | "SD";
    }) => updateStudioSettings(data.id, data.screen, data.audio, data.preset),
    onSuccess: (data) => {
      toast(data.status === 200 ? "Success" : "Error", {
        description: data.Message,
      });
    },
  });

  useEffect(() => {
    if (screen && audio) {
      console.log(screen, audio);
      //@ts-ignore
      window.ipcRenderer.send("media-sources", {
        screen,
        id: id,
        audio,
        preset,
      });
    }
  }, [screen, audio]);

  useEffect(() => {
    const subscribe = watch((values) => {
      setOnPresent(values.preset);
      mutate({
        screen: values.screen!,
        audio: values.audio!,
        preset: values.preset!,
        id,
      });
      //@ts-ignore
      window.ipcRenderer.send("media-sources", {
        screen: values.screen,
        id,
        audio: values.audio,
        preset: values.preset,
        plan,
      });
    });
    //@ts-ignore
    return () => subscribe.unsubscribe();
  }, [watch]);

  return { register, onPresent, isPending };
};