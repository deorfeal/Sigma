// Generates a unique numeric identifier
export const generateUniqueId = (): number => {
    // Math.random() generates a float between 0 (inclusive) and 1 (exclusive)
    // Multiplying by 1,000,000 gives range 0 - 999,999.999...
    // Math.floor() removes decimal places
    return Math.floor(Math.random() * 1000000);
};