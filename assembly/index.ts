/**
 * `Virtual<T>` represents a segment of data
 */
export class Virtual<T> {
    private data: usize = 0;
    public end: i32 = 0;
    public length: i32 = 0;
    public offset: i32 = 0;
    private data_ptr: usize;

    constructor(data: nonnull<T>, start: i32 = 0, end: i32 = 0) {
        this.reinst(data, start, end);
    }

    /**
     * Reinstantiate Virtual<T> with new data. Does not create a new Virtual.
     * @param data data
     * @param start start
     * @param end end
     */
    reinst(data: nonnull<T>, start: i32 = 0, end: i32 = 0): void {
        this.offset = start;
        this.end = end;
        /*if (!this.exists()) {
            // Claim new data
            // @ts-ignore: __pin is defined
            __pin(changetype<usize>(data));
        } else {
            // Release old data
            // @ts-ignore: __unpin is defined
            __unpin(this.data);

            // Claim new data
            // @ts-ignore: __pin is defined
            __pin(changetype<usize>(data));
        }*/
        this.data = changetype<usize>(data);
        if (!end) {
            if (isString<nonnull<T>>()) {
                this.data_ptr = this.data + <usize>(start << 1);
                this.length = (((<string>data).length) - start) << 1;
            }
        } else {
            const align = ((alignof<T>() as i32) - 1);
            this.data_ptr = this.data + <usize>(start << align);
            this.length = (end - start) << align;
        }

        if (this.length <= 0) {
            throw new Error("Start must be larger than end!");
        }
    }

    /**
     * Test for equality between two elements.
     * Strict comparison meaning, can only compare type T to type T.
     * @param eq RHS comparison
     * @returns boolean
     */
    equals(eq: T): boolean {
        // @ts-ignore
        if (isString<T>() && this.length != (eq.length << 1)) return false;
        if (this.length == 2) {
            return load<u16>(this.data_ptr) == load<u16>(changetype<usize>(eq))
        }
        return memory.compare(this.data_ptr, changetype<usize>(eq), this.length) === 0;
    }

    /**
     * Clone data and return. Returned data is not attached to original or Virtual.
     * @returns T
     */
    copyOut(): T {
        // @ts-ignore: __new is defined
        const buffer = __new(this.length, idof<nonnull<T>>());
        memory.copy(buffer, this.data_ptr, this.length);
        return changetype<nonnull<T>>(buffer);
    }

    /**
     * Check if the parent data is attached or not.
     * @returns boolean
     */
    exists(): boolean {
        return changetype<usize>(this.data) !== 0;
    }

    /**
     * Retrieve the parent data. Virtual is still attached to parent.
     * @returns T | null
     */
    @inline parent(): T | null {
        return changetype<T | null>(this.data);
    }

    /**
     * Destroy Virtual and clean from memory.
     * If the said Virtual<T> is accessed after `destroy()` is called, it will result in a `abort: in ~lib/rt/tlsf.ts` error.
     */
    destroy(): void {
        // @ts-ignore: __new is defined
        __free(changetype<usize>(this));
    }

    /**
     * Clear the parent data. This will also destroy the Virtual.
     */
    clear(): void {
        // @ts-ignore: __pin is defined
        if (this.exists()) __free(this.data);
        this.destroy();
    }

    /**
     * Merge this Virtual with another Virtual. This does not modify the parent, but outputs a new T.
     * @param item Virtual to concatenate
     * @returns T
     */
    merge(item: Virtual<T>): nonnull<T> {
        // @ts-ignore: __new is defined
        const buffer = __new(this.length + item.length, idof<nonnull<T>>());
        memory.copy(buffer, this.data_ptr, this.length);
        memory.copy(buffer + <usize>this.length, item.data_ptr, item.length);
        return changetype<nonnull<T>>(buffer);
    }

    /**
     * Create a Virtual that is not instantiated. It will have no data.
     * @returns Virtual
     */
    static createEmpty<T>(): Virtual<nonnull<T>> {
        // @ts-ignore: __new is defined
        const virt = changetype<Virtual<nonnull<T>>>(__new(offsetof<Virtual<nonnull<T>>>(), idof<Virtual<nonnull<T>>>()));
        return virt;
    }

    /**
     * Merge multiple existing Virtuals into one instance of T.
     * May cause corruption if data is not meant to be merged this way.
     * @param items Virtual<T>[]
     * @returns T
     */
    static mergeVirts<T>(items: Virtual<T>[]): T {
        let length = 0;
        // Is there a more efficient way to do this?
        for (let i = 0; i < items.length; i++) {
            const item = unchecked(items[i]);
            length += item.length;
        }
        let offset = 0;
        // @ts-ignore: __new is defined
        const buffer = __new(length, idof<nonnull<T>>());
        for (let i = 0; i < items.length; i++) {
            const item = unchecked(items[i]);
            memory.copy(buffer + <usize>offset, item.data_ptr, item.length);
            offset += item.length
        }
        return changetype<nonnull<T>>(buffer);
    }
}