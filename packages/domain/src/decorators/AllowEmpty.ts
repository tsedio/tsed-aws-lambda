import { useDecorators } from "@tsed/core";
import { OnDeserialize, OnSerialize } from "@tsed/json-mapper";
import { Allow, Default as D } from "@tsed/schema";

/**
 * Example of a custom decorator that allows empty strings to be serialized and deserialized as empty string when the value is undefined or null.
 * @constructor
 */
export function AllowEmpty() {
  return useDecorators(
    D(""),
    Allow(""),
    OnDeserialize((o: unknown) => (o === null || o === undefined ? "" : o)),
    OnSerialize((o: unknown) => (o === null || o === undefined ? "" : o))
  );
}
