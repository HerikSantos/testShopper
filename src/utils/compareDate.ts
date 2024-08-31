function compareDate(dateForCompare: string): number {
    const dateNow = new Date().getTime();
    const outherDate = new Date(dateForCompare).getTime();

    return Math.floor((dateNow - outherDate) / (1000 * 60 * 60 * 24));
}

export { compareDate };
