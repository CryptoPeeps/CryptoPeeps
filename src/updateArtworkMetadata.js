const fs = require("fs");
const path = require("path");
const util = require("util");
const glob = require("glob");
const getBytesizedChunks = require("utf8-byte-chunks");

/** ====================================================================================
 * Inspection and logging
 *
 * @since 1.0
 */

const inspect = (
    mixed,
    opts = {
        depth: null,
        maxArrayLength: null
    }
) => {
    console.log(util.inspect(mixed, opts));
}

const inspectAbort = (
    mixed,
    opts = {
        depth: null,
        maxArrayLength: null
    }
) => {
    console.log(util.inspect(mixed, opts));
    throw new Error("Aborted.");
}

/** ====================================================================================
 * Update artwork metadata
 *
 * @since 1.0
 */

const updateArtworkMetadata = (
    species,
    variant,
    opts = {
        test: true,
        range: [1, 1],
    }
) => {

    const dir = __dirname + `/../collections/${species}/${variant}`;

    let arr = fs.readdirSync(dir)
        .filter(aN => Number.isInteger(parseInt(aN)))
        .filter(aN => parseInt(aN))
        .sort((a, b) => a - b);

    if (opts.test) {
        arr = arr.filter(aN => aN >= opts.range[0] && aN <= opts.range[1]);
    }

    arr.filter(aN => {
        if (Number.isInteger(parseInt(aN))) {
            let md = JSON.parse(fs.readFileSync(dir + `/${aN}/artwork.metadata.json`));

            // Create new properties object
            let newProps = {};

            Object.keys(md.Properties).map(key => {
                let value = md.Properties[key];
                let newValue = null;

                if (Array.isArray(value) && value.length === 1) {
                    newValue = value[0];
                } else if (Array.isArray(value) && value.length > 1) {
                    newValue = value.join(", ");
                } else {
                    newValue = value;
                }

                newProps[key] = newValue;
            });

            md.Properties = newProps;

            if (opts.test) {
                inspect(md);
                fs.writeFileSync(__dirname + `/test/final.json`, JSON.stringify({
                    "721": {
                        "15b8520fae0359f40249c3c70ba967dbde925ae375573316d5b50c20": {
                            "CryptoPeep1": md
                        },
                        "version": "1.0"
                    }
                }));
            } else {
                console.log(aN);
                fs.rmSync(dir + `/${aN}/artwork.metadata.json`);
                fs.writeFileSync(dir + `/${aN}/artwork.metadata.json`, JSON.stringify(md));
            }
        }
    });
}

const updateArtworkMetadataProperty = (
    species,
    variant,
    opts = {
        test: true,
        range: [1, 1],
    }
) => {

    const dir = __dirname + `/../collections/${species}/${variant}`;

    let arr = fs.readdirSync(dir)
        .filter(aN => Number.isInteger(parseInt(aN)))
        .filter(aN => parseInt(aN))
        .sort((a, b) => a - b);

    if (opts.test) {
        arr = arr.filter(aN => aN >= opts.range[0] && aN <= opts.range[1]);
    }

    arr.filter(aN => {
        if (Number.isInteger(parseInt(aN))) {
            md = JSON.parse(fs.readFileSync(dir + `/${aN}/artwork.metadata.json`));

            md.about.links.homepage = "https://www.cryptopeeps.io";
            md.about.links.github = "https://www.github.com/cryptopeeps";
            md.about.links.reddit = "https://www.reddit.com/r/cryptopeeps";
            md.about.links.artist = "https://www.benzega.com";

            md.files[0].preview = `https://cdn.cryptopeeps.io/nft/${aN}.svg`;

            // let obj = {
            //     preview: `https://cdn.cryptopeeps.io/nft/${aN}.svg`,
            //     proximity: "on-chain",
            //     media_type: "image/svg+xml",
            //     src: md.files[0].src,
            // }

            // md.files.splice(0, 1);
            // md.files.push(obj);

            if (opts.test) {
                inspect(md);
            } else {
                console.log(aN);
                fs.writeFileSync(dir + `/${aN}/artwork.chunked.array.final.json`, JSON.stringify(md));
            }
        }
    });
}

const createArtworkMetadata = (
    species,
    variant,
    opts = {
        title: "artwork.array.chunked.final.json",
        test: true,
        range: [1, 1],
    }
) => {

    const dir = __dirname + `/../collections/${species}/${variant}`;

    let arr = fs.readdirSync(dir)
        .filter(aN => Number.isInteger(parseInt(aN)))
        .filter(aN => parseInt(aN))
        .sort((a, b) => a - b);

    if (opts.test) {
        arr = arr.filter(aN => aN >= opts.range[0] && aN <= opts.range[1]);
    }

    arr.filter(aN => {
        if (Number.isInteger(parseInt(aN))) {

            let md = {
                base: JSON.parse(fs.readFileSync(dir + `/${aN}/artwork.chunked.final.json`))
            }

            let svg = {
                base: fs.readFileSync(dir + `/${aN}/artwork.svg`, `utf8`),
                encoded: `data:image/svg+xml;base64,` + fs.readFileSync(__dirname + `/test/test.svg`, 'base64')
            }

            let chunkArr = getBytesizedChunks(svg.encoded, 64, false)

            let json = {
                name: `CryptoPeep #${aN}`,
                artist: "Benzega",
                description: "One-of-a-kind pop art pixel peep living on the blockchain!",
                links: {
                    homepage: "https://www.cryptopeeps.io",
                    reddit: "https://www.reddit.com/r/cryptopeeps",
                    github: "https://www.github.com/cryptopeeps",
                },
                properties: md.base.about.properties,
                image: chunkArr
            }

            if (opts.test) {
                let mdFinal = {
                    "721": {
                        "15b8520fae0359f40249c3c70ba967dbde925ae375573316d5b50c20": {
                            "CryptoPeep9088": json
                        }
                    },
                    version: "1.0"
                }

                inspect(json);
                fs.writeFileSync(__dirname + `/test/final.json`, JSON.stringify(mdFinal));
            } else {
                console.log(aN);
                fs.writeFileSync(dir + `/${aN}/${opts.title}`, JSON.stringify(json));
            }
        }
    });
}



const cleanFilesOut = (
    species,
    variant,
    opts = {
        test: true,
        range: [1, 1],
    }
) => {

    const dir = __dirname + `/../collections/${species}/${variant}`;

    let arr = fs.readdirSync(dir)
        .filter(aN => Number.isInteger(parseInt(aN)))
        .filter(aN => parseInt(aN))
        .sort((a, b) => a - b);

    if (opts.test) {
        arr = arr.filter(aN => aN >= opts.range[0] && aN <= opts.range[1]);
    }

    arr.filter(aN => {
        if (Number.isInteger(parseInt(aN))) {
            if (opts.test) {
                inspect(`${aN}`)
            } else {


                if (fs.existsSync(dir + `/${aN}/tx.json`)) {
                    fs.rmSync(dir + `/${aN}/tx.json`)
                    fs.rmSync(dir + `/${aN}/metadata.json`)
                }


                console.log(aN);
                fs.renameSync(dir + `/${aN}/artwork.chunked.final.json`, dir + `/${aN}/artwork.chunked.v2.json`)
                fs.writeFileSync(dir + `/${aN}/artwork.chunked.final.json`, JSON.stringify(md["new"]));
            }
        }
    });
}

/** ====================================================================================
 * Create final JSON
 *
 * @since 1.0
 */
const createFinalArtworkMetadata = (
    species,
    variant,
    opts = {
        title: "artwork.final.json",
        test: true,
        range: [1, 1],
    }
) => {
    const dir = __dirname + `/../collections/${species}/${variant}`;

    let arr = fs.readdirSync(dir)
        .filter(aN => Number.isInteger(parseInt(aN)))
        .filter(aN => parseInt(aN))
        .sort((a, b) => a - b);

    if (opts.test) {
        arr = arr.filter(aN => aN >= opts.range[0] && aN <= opts.range[1]);
    }

    arr.filter(aN => {
        if (Number.isInteger(parseInt(aN))) {

            // Get old metadata
            let md = JSON.parse(fs.readFileSync(dir + `/${aN}/artwork.metadata.json`))

            // Define svg with both types of encoding
            let svg = {
                base: fs.readFileSync(dir + `/${aN}/artwork.svg`, `utf8`),
                encoded: fs.readFileSync(dir + `/${aN}/artwork.svg`, 'base64')
            }

            // Produce srcArr from encoded json
            let newSrc = getBytesizedChunks(svg.encoded, 64, false)
            newSrc.splice(0, 0, `data:image/svg+xml;base64,`);

            // Create new properties object
            let newProps = {};

            Object.keys(md.about.properties).map(key => {
                let value = md.about.properties[key];
                let newValue = null;

                if (Array.isArray(value) && value.length === 1) {
                    newValue = value[0];
                } else {
                    newValue = value.join(", ");
                }

                if (key === `facial_hair`) {
                    newProps[`Facial Hair`] = md.about.properties.facial_hair;
                } else {
                    newProps[key.charAt(0).toUpperCase() + key.slice(1)] = newValue;
                }
            });

            let finalJson = {
                name: `CryptoPeep #${aN}`,
                artist: "Benzega",
                description: "One-of-a-kind pop art pixel peep living on the blockchain!",
                homepage: "https://www.cryptopeeps.io",
                Properties: newProps,
                image: newSrc,
                mediaType: "image/svg+xml"
            }

            if (opts.test) {
                console.log(aN);
                inspect(finalJson);
                fs.writeFileSync(__dirname + `/test/final.json`, JSON.stringify({
                    "721": {
                        "15b8520fae0359f40249c3c70ba967dbde925ae375573316d5b50c20": {
                            "CryptoPeep1": finalJson
                        },
                        "version": "1.0"
                    }
                }));
            } else {
                console.log(aN);

                // Clean dir
                fs.rmdirSync(dir + `/${aN}`, {
                    recursive: true
                });
                fs.mkdirSync(dir + `/${aN}`, {
                    recursive: true
                });

                // Write files
                fs.writeFileSync(dir + `/${aN}/artwork.svg`, svg.base);
                fs.writeFileSync(dir + `/${aN}/${opts.title}`, JSON.stringify(finalJson));
            }
        }
    });
}


const fixTypo = (
    species,
    variant,
    opts = {
        test: true,
        range: [1, 1],
    }
) => {

    const dir = __dirname + `/../collections/${species}/${variant}`;

    let arr = fs.readdirSync(dir)
        .filter(aN => Number.isInteger(parseInt(aN)))
        .filter(aN => parseInt(aN))
        .sort((a, b) => a - b);

    if (opts.test) {
        arr = arr.filter(aN => aN >= opts.range[0] && aN <= opts.range[1]);
    }

    arr.filter(aN => {
        if (Number.isInteger(parseInt(aN))) {
            let md = JSON.parse(fs.readFileSync(dir + `/${aN}/artwork.metadata.json`));

            console.log(aN);

            fs.renameSync(dir + `/${aN}/artwork.metadata.json`, dir + `/${aN}/artwork.metadata.base64.json`)
        }
    });
}


const encodeSVG = (svgString) => {
    return svgString.replace('<svg', (~svgString.indexOf('xmlns') ? '<svg' : '<svg xmlns="http://www.w3.org/2000/svg"'))
        .replace(/"/g, '\'')
        .replace(/%/g, '%25')
        .replace(/#/g, '%23')
        .replace(/{/g, '%7B')
        .replace(/}/g, '%7D')
        .replace(/</g, '%3C')
        .replace(/>/g, '%3E')
        .replace(/\s+/g, ' ')

    /* Maybe list
    .replace(/&/g, '%26')
    .replace('|', '%7C')
    .replace('[', '%5B')
    .replace(']', '%5D')
    .replace('^', '%5E')
    .replace('`', '%60')
    .replace(';', '%3B')
    .replace('?', '%3F')
    .replace(':', '%3A')
    .replace('@', '%40')
    .replace('=', '%3D')
    */
}



const createUTF8Metadata = (
    species,
    variant,
    opts = {
        title: "artwork.metadata.utf8.json",
        test: true,
        range: [1, 1],
    }
) => {

    const dir = __dirname + `/../collections/${species}/${variant}`;

    let arr = fs.readdirSync(dir)
        .filter(aN => Number.isInteger(parseInt(aN)))
        .filter(aN => parseInt(aN))
        .sort((a, b) => a - b);

    if (opts.test) {
        arr = arr.filter(aN => aN >= opts.range[0] && aN <= opts.range[1]);
    }

    arr.filter(aN => {
        if (Number.isInteger(parseInt(aN))) {

            // SVG
            let svg = {
                utf8: fs.readFileSync(dir + `/${aN}/artwork.svg`, 'utf8'),
                base64: fs.readFileSync(dir + `/${aN}/artwork.svg`, 'base64'),
            }

            // svg.utf8 = "data:image/svg+xml;utf8," + encodeSVG(svg.utf8.replace(`xmlns="http://www.w3.org/2000/svg"`, `xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"`));

            // Metadata
            let md = {
                base: JSON.parse(fs.readFileSync(dir + `/${aN}/artwork.metadata.base64.json`, 'utf8')),
            }

            // SRC
            let src = {
                // base: md.base.files[0].src.reduce((a,c) => a += c),
                utf8: getBytesizedChunks(encodeSVG(svg.utf8.replace(`xmlns="http://www.w3.org/2000/svg"`, `xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"`)), 64, false),
                base64: getBytesizedChunks(svg.base64, 64, false)
            }

            src.utf8.splice(0, 0, "data:image/svg+xml;utf8,");

            md.final = md.base;
            delete md.final.files
            md.final.image = src.utf8;

            if (opts.test) {
                let json = {
                    "721": {
                        "5f19f28bf48e3c15b2454a0e3c14c8ba19f7ee399a978a9bc5242c46": {
                            "CryptoPeep9088": md.final
                        }
                    },
                    version: "1.0"
                }
                fs.writeFileSync(__dirname + `/test/final.json`, JSON.stringify(json));
            } else {
                console.log(aN);
                // fs.rmSync(dir + `/${aN}/undefined`);
                fs.rmSync(dir + `/${aN}/${opts.title}`);
                fs.writeFileSync(dir + `/${aN}/${opts.title}`, JSON.stringify(md.final));
            }
        }
    });
}

/** ====================================================================================
 * Execution
 *
 * @since 1.0
 */

// ! Update artwork metadata
// updateArtworkMetadata(
//     'human',
//     'normal', {
//         test: false,
//         range: [1492, 1492]
//     }
// )

// ! Update artwork metadata property
// updateArtworkMetadataProperty(
//     'human',
//     'normal',
//     {
//         test: false,
//         range: [1,1]
//     }
// )

// ! Create New artwork meta
// createArtworkMetadata(
//     'human',
//     'normal', {
//         title: "artwork.final.json",
//         test: true,
//         range: [1, 1]
//     }
// );

// ! Create Final artwork meta
// createFinalArtworkMetadata(
//     'human',
//     'normal', {
//         title: "artwork.metadata.json",
//         test: true,
//         range: [1492, 1492]
//     }
// );

// ! Fix typo
// fixTypo(
//     'human',
//     'normal', {
//         test: false,
//         range: [1, 10000]
//     }
// );

// ! Fix typo
createUTF8Metadata(
    'human',
    'normal', {
        test: false,
        range: [1, 1],
        title: 'artwork.metadata.utf8.json'
    }
);

// ! Create Final SVG encoded and rename other svg to base.64
// createFinalArtworkMetadata(
//     'human',
//     'normal', {
//         title: "artwork.metadata.json",
//         test: true,
//         range: [1492, 1492]
//     }
// );

// (() => {
//     const num = 10000;

//     let aMD = JSON.parse(fs.readFileSync(__dirname + `/../collections/human/normal/${num}/artwork.metadata.json`, 'utf8'));

//     let token = {
//         "721": {
//             "15b8520fae0359f40249c3c70ba967dbde925ae375573316d5b50c20": {
//                 ["CryptoPeep" + `${num}`]: aMD
//             },
//             version: "1.0"
//         }
//     }

//     inspect(token);
//     fs.writeFileSync(__dirname + `/test/final.json`, JSON.stringify(token));

// })();
