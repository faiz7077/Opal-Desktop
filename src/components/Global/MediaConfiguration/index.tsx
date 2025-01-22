import { SourceDeviceStateProps } from "@/hooks/useMediaSources";
import { useStudioSettings } from "@/hooks/useStudioSettings";
import { Loader } from "../Loader";
import { Headphones, Monitor, Settings2 } from "lucide-react";

type Props = {
  state: SourceDeviceStateProps;
  user:
    | ({
        subscription: {
          plan: "PRO" | "FREE";
        } | null;
        studio: {
          id: string;
          screen: string | null;
          camera: string | null;
          mic: string | null;
          plan: "PRO" | "FREE";
          preset: "HD" | "SD";
          userId: string;
        } | null;
      } & {
        id: string;
        email: string;
        firstName: string | null;
        lastName: string | null;
        createdAt: Date;
        clerkId: string;
      })
    | null;
};

const MediaConfiguration = ({ state, user }: Props) => {
  const activeScreen = state.displays?.find(
    (screen) => screen.id === user?.studio?.screen
  );
  const activeAudio = state.audioInput?.find(
    (audio) => audio.deviceId === user?.studio?.mic
  );
  const { isPending, register, onPresent } = useStudioSettings(
    user?.id || "",
    activeScreen?.id || state.displays?.[0]?.id || null,
    activeAudio?.deviceId || state.audioInput?.[0]?.deviceId || null,
    user?.studio?.preset || undefined,
    user?.subscription?.plan || undefined
  );
  console.log(state);
  return (
    <form className="flex h-full relative w-full flex-col gap-y-5">
      {isPending && (
        <div
          className="fixed z-50 w-full top-0
      left-0 right-0 bottom-0 rounded-2xl h-full bg-black/80 flex
      justify-center items-center"
        >
          <Loader />
        </div>
      )}
      <div className="flex gap-x-5 justify-center items-center">
        <Monitor fill="#575655" color="#57555" size={36} />
        <select
          {...register("screen")}
          className="outline-none cursor-pointer px-5 py-2 rounded-xl border-2 text-white  border-[#575655] bg-transparent w-full"
        >
          {state.displays?.map((display) => (
            <option
              selected={activeScreen && activeScreen.id === display.id}
              key={display.id}
              value={display.id}
              className="bg-[#171717] cursor-pointer"
            >
              {display.name}
            </option>
          ))}
        </select>
      </div>
      <div className="flex gap-x-5 justify-center items-center">
        <Headphones color="#575655" size={36} />
        <select
          {...register("audio")}
          className="outline-none cursor-pointer px-5 py-2 rounded-xl border-2 text-white  border-[#575655] bg-transparent w-full"
        >
          {state.audioInput?.map((audio) => (
            <option
              selected={activeAudio && activeAudio.deviceId === audio.deviceId}
              key={audio.deviceId}
              value={audio.deviceId}
              className="bg-[#171717] cursor-pointer"
            >
              {audio.label}
            </option>
          ))}
        </select>
      </div>
      <div className="flex gap-x-5 justify-center items-center">
        <Settings2 color="#575655" size={36} />
        <select
          {...register("preset")}
          className="outline-none cursor-pointer px-5 py-2 rounded-xl border-2 text-white  border-[#575655] bg-transparent w-full"
        >
          <option
            disabled={user?.subscription?.plan === "FREE"}
            selected={onPresent === "HD" || user?.studio?.preset === "HD"}
            value={"HD"}
            className="bg-[#171717] cursor-pointer"
          >
            1080p{" "}
            {user?.subscription?.plan === "FREE" && "(upgrade to PRO plan)"}
          </option>
          <option
            disabled={user?.subscription?.plan === "FREE"}
            selected={onPresent === "SD" || user?.studio?.preset === "SD"}
            value={"SD"}
            className="bg-[#171717] cursor-pointer"
          >
            720p
          </option>
        </select>
      </div>
    </form>
  );
};

export default MediaConfiguration;
