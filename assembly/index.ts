export class Virtual<T> {
    public length: i32;
    public byteLength: i32 = 0;
    private data_ptr: usize;
    constructor(public data: T, public start: i32 = 0, public end: i32 = 0) {
        if (!end) {
            if (isString<nonnull<T>>()) {
                this.length = (<string>this.data).length - start;
            }
        } else {
            this.length = this.start - this.end;
        }

        if (this.length <= 0) throw new Error("Start must be larger than end!");

        const align = (alignof<T>() as i32) - 1;
        this.data_ptr = changetype<usize>(this.data) + <usize>((start << align));
        this.byteLength = this.length << align;
    }
    equals(eq: T): boolean {
        return memory.compare(this.data_ptr, changetype<usize>(eq), (this.length << 1) - (this.start << 1)) === 0;
    }
    copyOut(): T {
        // @ts-ignore: __new is defined
        const buffer = __new(this.byteLength, idof<nonnull<T>>());
        memory.copy(changetype<usize>(buffer), this.data_ptr, this.byteLength);
        return changetype<nonnull<T>>(buffer);
    }
}