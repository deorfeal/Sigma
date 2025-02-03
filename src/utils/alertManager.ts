import { ref } from 'vue';

// Reactive alert state with TypeScript interface
const alertState = ref<{
    isVisible: boolean;
    message: string;
    class: string
}>({
    isVisible: false,
    message: '',
    class: ''
});

// Timer reference for auto-hiding alerts
let alertTimeout: number | null = null;

// Displays an alert message with specified styling
export function showAlert(message: string, alertClass: string) {
    // Update alert state
    alertState.value = {
        isVisible: true,
        message,
        class: alertClass
    };

    // Clear existing timer if present
    if (alertTimeout) {
        clearTimeout(alertTimeout);
    }

    // Set new auto-hide timer (3 seconds)
    alertTimeout = setTimeout(() => {
        hideAlert();
    }, 3000);
}

// Hides the current alert and cleans up state
export function hideAlert() {
    // Reset alert state
    alertState.value = {
        isVisible: false,
        message: '',
        class: ''
    };

    // Clear timer reference
    alertTimeout = null;
}

// Provides access to the reactive alert state
export function useAlertState() {
    return alertState;
}