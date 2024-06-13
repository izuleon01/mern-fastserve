/**
 * Check if a string is a valid UUID (Universally Unique Identifier) format.
 * @param uuid - The string to be validated as a UUID.
 * @returns A boolean indicating whether the input string is a valid UUID format.
 */
export function isValidUUID(uuid: string): boolean {
    const uuidRegex =
        /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;
    return uuidRegex.test(uuid);
}
