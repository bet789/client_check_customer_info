import Admin789BET from "@/components/admin789bet";
import AdminSHBET from "@/components/adminShbet";
import { siteName } from "@/helpers/config";
export default function Home() {
  return siteName === "789bet" ? <Admin789BET /> : <AdminSHBET />;
}
