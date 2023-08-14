/**
 * `Virtual<T>` represents a segment of data
 */
export class Virtual<T> {
    public length: i32;
    public byteLength: i32 = 0;
    private data_ptr: usize;

    constructor(public data: T, public start: i32 = 0, public end: i32 = 0) {
        if (!end) {
            if (isString<nonnull<T>>()) {
                this.length = (<string>data).length - start;
            }
        } else {
            this.length = start - end;
        }

        if (this.length <= 0) {
            throw new Error("Start must be larger than end!");
        }

        const align = alignof<T>() - 1;
        this.data_ptr = changetype<usize>(data) + (<usize>(start << i32(align)));
        this.byteLength = this.length << i32(align);
    }

    /**
     * Test for equality between two elements.
     * Strict comparison meaning, can only compare type T to type T.
     * @param eq RHS comparison
     * @returns boolean
     */
    equals(eq: T): boolean {
        return memory.compare(this.data_ptr, changetype<usize>(eq), this.byteLength) === 0;
    }

    /**
     * Clone data and return. Returned data is not attached to original or Virtual.
     * @returns T
     */
    copyOut(): T {
        // @ts-ignore: __new is defined
        const buffer = __new(this.byteLength, idof<nonnull<T>>());
        memory.copy(changetype<usize>(buffer), this.data_ptr, this.byteLength);
        return changetype<nonnull<T>>(buffer);
    }

    /**
     * Destroy Virtual and clean from memory.
     * If the said Virtual<T> is accessed after `destroy()` is called, it will result in a `abort: in ~lib/rt/tlsf.ts` error.
     */
    destroy(): void {
        // @ts-ignore: __new is defined
        __free(changetype<usize>(this));
    }
}