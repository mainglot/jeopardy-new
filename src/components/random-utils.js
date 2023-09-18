export function randomList(list) {
    return list.sort(() => Math.random() - 0.5);
}

export function randomListLessWhole(list, multiplier) {
    return randomList(list).slice(0, parseInt(list.length * multiplier));
}

export function randomMultipliedList(list, multiplier) {
    const newList = [];
    for (let i = 0; i < multiplier; i++) {
        newList.push(...randomList(list));
    }
    return newList;
}

export function randomListAndHalf(list) {
    return randomMultipliedList(list, 2).slice(0, parseInt(list.length * 1.5));
}

export function listWithRandomTimeoutValues(list, min, max) {
    return list.map((item) => ({
        ...item,
        timeout: Math.floor(Math.random() * (max - min + 1) + min)
    }));
}

export function listWithEaseInOutTimeoutValues(list, min, max, maxLength = 30) {
    const newList = [];
    const length = list.length > maxLength ? maxLength : list.length;
    for (let i = 0; i < length; i++) {
        newList.push({
            ...list[i],
            timeout: Math.floor(easeInOutQuad(i / length) * (max - min) + min)
        });
    }
    return newList;
}

function easeInOutQuad(t) {
    return t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}