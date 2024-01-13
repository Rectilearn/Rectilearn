import { writable } from 'svelte/store';
import type { IUser } from './types';

export const userData = writable<IUser | null>(null);
