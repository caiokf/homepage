import { onMounted, onUnmounted } from "vue";

/**
 * Composable for injecting JSON-LD structured data into the document head.
 * Automatically cleans up scripts when the component unmounts.
 *
 * @param schemas - Record of schema ID to schema object
 *
 * @example
 * useJsonLd({
 *   "schema-person": {
 *     "@context": "https://schema.org",
 *     "@type": "Person",
 *     name: "John Doe"
 *   }
 * });
 */
export function useJsonLd(schemas: Record<string, object>) {
  const injectedIds: string[] = [];

  function injectJsonLd(schema: object, id: string) {
    const existingScript = document.getElementById(id);
    if (existingScript) existingScript.remove();

    const script = document.createElement("script");
    script.id = id;
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);
    injectedIds.push(id);
  }

  function cleanup() {
    injectedIds.forEach((id) => {
      const script = document.getElementById(id);
      if (script) script.remove();
    });
    injectedIds.length = 0;
  }

  onMounted(() => {
    Object.entries(schemas).forEach(([id, schema]) => {
      injectJsonLd(schema, id);
    });
  });

  onUnmounted(() => {
    cleanup();
  });

  return { cleanup };
}
