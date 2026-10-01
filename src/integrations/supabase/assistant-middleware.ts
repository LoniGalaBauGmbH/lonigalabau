import { createMiddleware } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { requireAdmin } from "./admin-middleware";

// requireAdmin validates this exact bearer with Auth and checks the current role first.
export const requireAssistantAdmin = createMiddleware({ type: "function" })
  .middleware([requireAdmin])
  .server(async ({ next }) => {
    const token = getRequest()
      .headers.get("authorization")
      ?.match(/^Bearer ([^\s]+)$/i)?.[1];
    let aal: unknown;
    try {
      aal = JSON.parse(Buffer.from(token!.split(".")[1], "base64url").toString("utf8")).aal;
    } catch {
      /* fail closed */
    }
    if (aal !== "aal2")
      throw new Error(
        "Bitte richten Sie im Dashboard die Zwei-Faktor-Anmeldung ein und melden Sie sich damit an.",
      );
    return next();
  });
