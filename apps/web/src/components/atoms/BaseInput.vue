<template>
  <div class="base-input" :class="{ 'has-icon': hasIcon }">
    <input
      :value="modelValue"
      :type="type"
      :placeholder="placeholder"
      :aria-label="ariaLabel"
      class="base-input__field"
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      @focus="emit('focus')"
      @blur="emit('blur')"
    />
    <div v-if="hasIcon" class="base-input__icon">
      <slot name="icon"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from "vue";

  type Props = {
    modelValue: string;
    type?: "text" | "email" | "password" | "number" | "search";
    placeholder?: string;
    ariaLabel?: string;
    icon?: boolean;
  };

  const emit = defineEmits<{
    (e: "update:modelValue", value: string): void;
    (e: "focus"): void;
    (e: "blur"): void;
  }>();

  const props = withDefaults(defineProps<Props>(), {
    type: "text",
    placeholder: "",
    icon: false,
  });

  const hasIcon = computed(() => props.icon);
</script>

<style scoped>
  .base-input {
    position: relative;
    width: 100%;
    display: flex;
    align-items: center;
  }

  .base-input__field {
    width: 100%;
    padding: var(--space-3) var(--space-4);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-sm);
    font-size: var(--text-sm);
    font-family: var(--font-mono);
    background: transparent;
    color: var(--color-text-primary);
    outline: none;
    transition:
      border-color var(--transition-fast),
      background-color var(--transition-theme),
      color var(--transition-theme);
  }

  .base-input__field:focus {
    border-color: var(--color-primary);
    background: var(--color-surface);
  }

  .base-input__field::placeholder {
    color: var(--color-text-muted);
    font-family: var(--font-mono);
    text-transform: lowercase;
  }

  .base-input.has-icon .base-input__field {
    padding-left: 44px;
  }

  .base-input__icon {
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
    color: var(--color-text-muted);
    transition: color var(--transition-theme);
    width: 16px;
    height: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .base-input__field:focus ~ .base-input__icon {
    color: var(--color-primary);
  }
</style>
