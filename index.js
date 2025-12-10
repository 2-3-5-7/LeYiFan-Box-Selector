// Box selection with rotation (6 orientations) and height cutting
// Output: top 3 candidates with box name, weight, mapping, and volumetric weight

const VOLUME_DIVISOR = 5000; // for volumetric weight (kg)

const boxes = [
    { name: '30型', l: 10, w: 10, h: 10, weight: 0.040 },
    { name: '40型', l: 15, w: 13, h: 5, weight: 0.070 },
    { name: '40型', l: 16, w: 15, h: 10, weight: 0.098 },
    { name: '40型', l: 17, w: 13, h: 11, weight: 0.098 },
    { name: '40型', l: 14.4, w: 14, h: 8, weight: 0.090 },

    { name: '50型', l: 20, w: 20, h: 9, weight: 0.130 },
    { name: '50型', l: 24, w: 19, h: 5, weight: 0.130 },
    { name: '50型', l: 25, w: 20, h: 5, weight: 0.141 },

    { name: '60型', l: 25, w: 20, h: 12, weight: 0.160 },
    { name: '60型', l: 20, w: 20, h: 17, weight: 0.184 },
    { name: '60型', l: 22, w: 22, h: 15, weight: 0.202 },
    { name: '60型', l: 27, w: 20, h: 8, weight: 0.159 },
    { name: '60型', l: 27, w: 21, h: 7, weight: 0.165 },
    { name: '60型', l: 33, w: 25, h: 3, weight: 0.148 },

    { name: '70型', l: 32, w: 25, h: 9, weight: 0.239 },
    { name: '70型', l: 33, w: 24, h: 6, weight: 0.214 },
    { name: '70型', l: 35, w: 20, h: 15, weight: 0.239 },
    // ⚠️此行无重量，暂填 0.24
    { name: '70型', l: 36, w: 28, h: 11, weight: 0.24 },
    { name: '70型', l: 26, w: 22, h: 21, weight: 0.246 },

    { name: '80型', l: 30, w: 25, h: 21, weight: 0.290 },
    { name: '80型', l: 35, w: 25, h: 20, weight: 0.310 },
    { name: '80型', l: 37, w: 27, h: 16, weight: 0.320 },
    { name: '80型', l: 35, w: 35, h: 10, weight: 0.386 },
    { name: '80型', l: 40, w: 30, h: 9.5, weight: 0.320 },

    { name: '90型', l: 65, w: 15, h: 10, weight: 0.246 },
    { name: '90型', l: 40, w: 30, h: 20, weight: 0.435 },
    { name: '90型', l: 35, w: 28, h: 20, weight: 0.392 },

    { name: '100型', l: 44, w: 33, h: 17, weight: 0.477 },
    { name: '100型(双层)', l: 40, w: 33, h: 21, weight: 0.600 },
    { name: '100型(双层)', l: 47, w: 33, h: 21, weight: 0.660 },
    { name: '110型(双层)', l: 38, w: 34, h: 36, weight: 0.780 },

    { name: '120型', l: 42, w: 37, h: 36, weight: 0.900 },
    { name: '120型', l: 59, w: 36, h: 24, weight: 0.704 },

    { name: '140型(双层)', l: 83, w: 31, h: 24, weight: 1.150 },
    { name: '140型(双层)', l: 60, w: 36, h: 40, weight: 0.970 },

    { name: '150型', l: 60, w: 50, h: 40, weight: 1.550 },
    { name: '150型', l: 58, w: 46, h: 43, weight: 1.100 },

    { name: '170型(双层)', l: 110, w: 36, h: 25, weight: 1.590 },
    { name: '180型', l: 67, w: 56, h: 52, weight: 2.100 }
];

function orientations(item) {
    const { l, w, h } = item;
    return [
        { l: l, w: w, h: h },
        { l: l, w: h, h: w },
        { l: w, w: l, h: h },
        { l: w, w: h, h: l },
        { l: h, w: l, h: w },
        { l: h, w: w, h: l }
    ];
}

function fits(itemOri, box) {
    return (
        itemOri.l <= box.l &&
        itemOri.w <= box.w &&
        itemOri.h <= box.h
    );
}

function formatMapping(box, ori) {
    return `L ${box.l} -> ${ori.l}\nW ${box.w} -> ${ori.w}\nH ${box.h} -> ${ori.h}`;
}

function findTopBoxes(item, topN = 3) {
    const candidates = [];
    const oris = orientations(item);

    for (const b of boxes) {
        for (const o of oris) {
            if (fits(o, b)) {
                const volumetricWeightCut = b.l * b.w * o.h / VOLUME_DIVISOR;
                const volumetricWeightFull = b.l * b.w * b.h / VOLUME_DIVISOR;
                const mapping = formatMapping(b, o);
                candidates.push({ name: b.name, weight: b.weight, mapping, volumetricWeightCut, volumetricWeightFull });
            }
        }
    }

    candidates.sort((a, b) => a.volumetricWeightCut - b.volumetricWeightCut);
    return candidates.slice(0, topN);
}

function test() {
    const item = {l: 20, w: 28, h: 17};
    const topCandidates = findTopBoxes(item, 3);

    for (const c of topCandidates) {
        console.log(`${c.name} ${c.weight} kg`);
        console.log(c.mapping);
        console.log(`VW ${c.volumetricWeightCut.toFixed(2)} kg (${c.volumetricWeightFull.toFixed(2)} kg)`);
        console.log('-------------------------');
    }
}
