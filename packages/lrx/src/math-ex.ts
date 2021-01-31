type MathExCallback<T> = (el: T) => number;

export class MathEx {
    public static sum<T = number>(
        arr: T[],
        cb: MathExCallback<T> = (el) => (el as unknown) as number
    ) {
        return arr.reduce<number>((a, b) => {
            return a + cb(b);
        }, 0);
    }

    public static max<T = number>(
        arr: T[],
        cb: MathExCallback<T> = (el) => (el as unknown) as number
    ) {
        return arr.reduce<number>((a, b) => {
            return Math.max(a, cb(b));
        }, 0);
    }

    public static avg<T = number>(
        arr: T[],
        cb: MathExCallback<T> = (el) => (el as unknown) as number
    ) {
        let uniques = [];

        arr.forEach((element) => {
            let value = cb(element);

            if (!uniques.includes(value)) {
                uniques.push(value);
            }
        });

        return this.sum<T>(uniques) / uniques.length;
    }
}
