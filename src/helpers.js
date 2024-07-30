// default Root for URLs
export const rootUrl = (to) => {
    // return "http://localhost/mentorprenuerBackend" + to;
    return "https://webapp.mentorpreneur.net/mentorprenuerBackend" + to;
}

// check if email is valid

export const checkEmailValidation = (email) => {
    // Regular expresion for validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

export function humanizeString(string) {
    // Replace underscores and hyphens with spaces
    let humanized = string.replace(/[_-]/g, ' ');

    // Convert camelCase to separate words with spaces
    humanized = humanized.replace(/([a-z])([A-Z])/g, '$1 $2');

    // Capitalize the first letter of each word
    humanized = humanized.replace(/\b\w/g, c => c.toUpperCase());

    return humanized;
}

/**
 * Creates a new object containing only the specified keys from the original object.
 * @param {Object} object - The original object.
 * @param {Array} keys - An array of keys to pick from the original object.
 * @returns {Object} - A new object containing only the selected keys from the original object.
 */
export function selectObjectProperties(object, keys) {
    return Object.fromEntries(
        Object.entries(object)
            .filter(([key]) => keys.includes(key))
    );
}

export function formatDate(dateString) {
    const dateObj = new Date(dateString.trim())

    if (dateObj) {
        return dateObj.toDateString()
    }
    return "Invalid date format"
}