import type { IncomingMessage, ServerResponse } from "http";
import { readBody } from 'h3';
export default async (req: IncomingMessage, res: ServerResponse) => {
    // @ts-ignore
    if (req.method !== "POST") return "Must be a post request";

    // @ts-ignore
    const { user } = await readBody(req);

    // @ts-ignore
    req.user = user;
    return { updated : true }
}