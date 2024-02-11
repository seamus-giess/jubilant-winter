import { browser } from "$app/environment";
import { writable } from "svelte/store";

const eggsInitialState: Eggs = {
    talkingLink: false,
};

interface Eggs {
    talkingLink: boolean;
};

export function isEggs(object: unknown): object is Eggs {
    return (
        object !== null
        && typeof object === "object"
        && (
            "talkingLink" in object &&
            typeof object.talkingLink === "boolean"
        )
    );
}

function eggsExist () {
    return browser
    && localStorage.eggs
    && JSON.parse(localStorage.eggs)
    && isEggs(JSON.parse(localStorage.eggs));
}

export const eggs = writable<Eggs>(
    eggsExist()
        ? ({
            ...eggsInitialState,
            ...JSON.parse(localStorage.eggs)
        } as Eggs)
        : (browser ? eggsInitialState : undefined)
);

if (browser) {
    eggs.subscribe(eggs => {
        if (!eggs) {
            return;
        }

        localStorage.eggs = JSON.stringify(eggs);
    });
}