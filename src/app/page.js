import BET789 from "@/components/789bet";
import SHBET from "@/components/shbet";
import { siteName } from "@/helpers/config";
export default function Home() {
  return siteName === "789bet" ? <BET789 /> : <SHBET />;
}
