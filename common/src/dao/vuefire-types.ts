import { DeepRequired } from 'ts-essentials'

export type VueFire<T> = { id: string } & DeepRequired<T>
