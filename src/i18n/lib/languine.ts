export function createTranslator<T extends object>(dict: T) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return <K extends keyof T>(key: K, vars?: Record<string, unknown>) =>
    dict[key];
}
