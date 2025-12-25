declare module "virtual:devlog-index" {
  import type { EntryMetadata } from "../domain/devlog/data";
  const index: EntryMetadata[];
  export default index;
}
