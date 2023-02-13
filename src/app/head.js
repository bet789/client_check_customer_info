import { siteName } from "@/helpers/config";
export default function Head() {
  return (
    <>
      <title>{siteName === "789bet" ? "789BET" : "SHBET"}</title>
      <meta content="width=device-width, initial-scale=1" name="viewport" />
      <meta name="description" content="SHBET" />
      <link
        rel="icon"
        href={`${
          siteName === "789bet" ? "/favicon_789bet.ico" : "/favicon_shbet.ico"
        }`}
      />
    </>
  );
}
