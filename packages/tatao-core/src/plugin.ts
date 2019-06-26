import { Context } from "./context";

export type Plugin = (context: Context) => Promise<Context>;
