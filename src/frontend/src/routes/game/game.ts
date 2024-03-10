import type { Key } from "kaboom";

function areKeysPressed(keys: Key[]) {
    for (const key of keys) {
        if (isKeyPressed(key)) return true;
    }
    return false;
}
function areKeysDown(keys: Key[]) {
    for (const key of keys) {
        if (isKeyDown(key)) return true;
    }
    return false;
}
function areKeysReleased(keys: Key[]) {
    for (const key of keys) {
        if (isKeyReleased(key)) return true;
    }
    return false;
}

export function onKeysPressed(keys: Key[], action: () => void) {
    return onUpdate(() => {
        if(areKeysPressed(keys)) action();
    });
}

export function onKeysDown(keys: Key[], action: () => void) {
    return onUpdate(() => {
        if(areKeysDown(keys)) action();
    });
}

export function onKeysReleased(keys: Key[], action: () => void) {
    return onUpdate(() => {
        if(areKeysReleased(keys)) action();
    });
}