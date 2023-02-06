import { ClientJS } from "clientjs";
import { useEffect } from "react";
import md5 from "md5";

export default function ClientJsComponent({ setFingerPrint }) {
  useEffect(() => {
    const client = new ClientJS();
    const fingerprint = client.getFingerprint();
    setFingerPrint(md5(fingerprint));
  }, []);

  return null;
}
