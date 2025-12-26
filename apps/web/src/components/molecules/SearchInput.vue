<template>
  <div class="search-input">
    <BaseInput
      :model-value="modelValue"
      type="search"
      :placeholder="placeholder"
      :aria-label="ariaLabel"
      icon
      @update:model-value="emit('update:modelValue', $event)"
      @focus="emit('focus')"
      @blur="emit('blur')"
    >
      <template #icon>
        <svg
          class="search-input__icon"
          viewBox="0 0 24 24"
          width="20"
          height="20"
          aria-hidden="true"
        >
          <path
            fill="currentColor"
            d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
          />
        </svg>
      </template>
    </BaseInput>
    <button
      v-if="clearable && modelValue"
      class="search-input__clear"
      type="button"
      aria-label="Clear search"
      @click="handleClear"
    >
      &times;
    </button>
  </div>
</template>

<script setup lang="ts">
  import BaseInput from "../atoms/BaseInput.vue";

  type Props = {
    modelValue: string;
    placeholder?: string;
    ariaLabel?: string;
    clearable?: boolean;
  };

  const emit = defineEmits<{
    (e: "update:modelValue", value: string): void;
    (e: "focus"): void;
    (e: "blur"): void;
    (e: "clear"): void;
  }>();

  withDefaults(defineProps<Props>(), {
    placeholder: "search...",
    ariaLabel: "Search",
    clearable: false,
  });

  function handleClear() {
    emit("update:modelValue", "");
    emit("clear");
  }
</script>

<style scoped>
  .search-input {
    position: relative;
    width: 100%;
  }

  .search-input__icon {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
  }

  .search-input__clear {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    color: var(--color-text-muted);
    font-size: var(--text-lg);
    cursor: pointer;
    padding: 0 var(--space-1);
    line-height: 1;
    transition: color var(--transition-fast);
  }

  .search-input__clear:hover {
    color: var(--color-text-primary);
  }
</style>
