import { writable } from 'svelte/store';
import type { IUser, IStudySet } from './types';

export const userData = writable<IUser | null>(null);

export const studySets = writable<IStudySet[] | undefined>(undefined);
