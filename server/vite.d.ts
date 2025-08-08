declare module "vite" {
  interface ServerOptions {
    allowedHosts?: boolean | "all" | string[];
  }
}