// Validates if all required select inputs have valid non-default values
export function isSelectsFilled(selectValues: Record<string, string>): boolean {
    // Early return for null/undefined input
    if (!selectValues) return false;

    // Check all values meet validation criteria
    return Object.values(selectValues).every((value) =>
        value !== null &&
        value !== undefined &&
        value !== '' &&
        // Additional check against first key to prevent default selection
        value !== Object.keys(selectValues)[0]
    );
}