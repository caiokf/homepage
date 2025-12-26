import { onMounted, onUnmounted } from "vue";

type JsonLdSchema = Record<string, unknown>;

export function useJsonLd(schemas: Record<string, JsonLdSchema>) {
  const injectedIds: string[] = [];

  function inject(schema: JsonLdSchema, id: string) {
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
      inject(schema, id);
    });
  });

  onUnmounted(() => {
    cleanup();
  });

  return { inject, cleanup };
}
