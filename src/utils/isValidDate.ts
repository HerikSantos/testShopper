function isValidDate(dateString: string): boolean {
    const regEx = /^\d{4}-\d{2}-\d{2}$/;
    const regExHOUR = /^(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d$/;

    const [newdateString, newHourString] = dateString.split(" ");

    if (newHourString) {
        if (!newHourString.match(regExHOUR)) {
            return false;
        }
    }

    if (!newdateString.match(regEx)) {
        return false;
    }
    const d = new Date(newdateString);
    const dateMilSec = d.getTime();
    if (!dateMilSec && dateMilSec !== 0) {
        return false;
    }

    return d.toISOString().slice(0, 10) === newdateString;
}

export { isValidDate };
