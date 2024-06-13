
export function menuTimeIntoTime(type: string) {
    if (type === "breakfast") {
        const startTime = new Date();
        startTime.setHours(8, 0, 0, 0);
        const endTime = new Date();
        endTime.setHours(11, 59, 0, 0);
        return { startTime, endTime };
    }
    if (type === "lunch") {
        const startTime = new Date();
        startTime.setHours(12, 0, 0, 0);
        const endTime = new Date();
        endTime.setHours(16, 59, 0, 0);
        return { startTime, endTime };
    }
    if (type === "dinner") {
        const startTime = new Date();
        startTime.setHours(17, 0, 0, 0);
        const endTime = new Date();
        endTime.setHours(22, 0, 0, 0);
        return { startTime, endTime };
    }
    throw new Error("Date type is not implemented");
}
