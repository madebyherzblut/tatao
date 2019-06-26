const createLogger = require("debug");

export function logger(namespace: string) {
  if (namespace.startsWith("tatao")) {
    throw new Error("Prefix not required");
  }
  return createLogger("tatao:" + namespace);
}
