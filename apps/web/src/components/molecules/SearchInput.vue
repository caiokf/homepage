<template>
  <div class="search-input-wrapper">
    <input
      ref="inputRef"
      type="text"
      class="search-input"
      :value="modelValue"
      :placeholder="placeholder"
      :aria-label="ariaLabel"
      autocomplete="off"
      @input="handleInput"
      @focus="emit('focus')"
      @blur="emit('blur')"
      @keydown="emit('keydown', $event)"
    />
    <button
      v-if="clearable && modelValue"
      type="button"
      class="search-clear"
      aria-label="Clear search"
      @click="handleClear"
    >
      <span class="clear-icon">&times;</span>
    </button>
  </div>
</template>

<script setup lang="ts">
  import { ref } from "vue";

  interface Props {
    modelValue: string;
    placeholder?: string;
    ariaLabel?: string;
    clearable?: boolean;
  }

  withDefaults(defineProps<Props>(), {
    placeholder: "search...",
    ariaLabel: "Search",
    clearable: false,
  });

  const emit = defineEmits<{
    (e: "update:modelValue", value: string): void;
    (e: "focus"): void;
    (e: "blur"): void;
    (e: "clear"): void;
    (e: "keydown", event: KeyboardEvent): void;
  }>();

  const inputRef = ref<HTMLInputElement | null>(null);

  function handleInput(event: Event) {
    const target = event.target as HTMLInputElement;
    emit("update:modelValue", target.value);
  }

  function handleClear() {
    emit("update:modelValue", "");
    emit("clear");
    inputRef.value?.focus();
  }
</script>

<style scoped>
  .search-input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
  }

  .search-input {
    width: 100%;
    padding: var(--space-2) var(--space-3);
    padding-right: var(--space-8);
    font-family: var(--font-mono);
    font-size: var(--text-sm);
    color: var(--color-text-primary);
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-sm);
    outline: none;
    transition: background-color var(--transition-theme), border-color var(--transition-fast),
      color var(--transition-theme), box-shadow var(--transition-fast);
  }

  .search-input::placeholder {
    color: var(--color-text-muted);
    text-transform: lowercase;
  }

  .search-input:focus {
    border-color: var(--color-primary);
    box-shadow: 0 0 0 2px var(--color-primary-alpha);
  }

  .search-clear {
    position: absolute;
    right: var(--space-2);
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    padding: 0;
    background: transparent;
    border: none;
    border-radius: var(--radius-full);
    color: var(--color-text-muted);
    cursor: pointer;
    transition: color var(--transition-fast), background-color var(--transition-fast);
  }

  .search-clear:hover {
    color: var(--color-text-primary);
    background: var(--color-surface-hover);
  }

  .clear-icon {
    font-size: var(--text-lg);
    line-height: 1;
  }
</style>
