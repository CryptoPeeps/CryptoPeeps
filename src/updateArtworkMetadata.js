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
            md = {
                old: JSON.parse(fs.readFileSync(dir + `/${aN}/artwork.unchunked.v1.json`)),
            }

            let fileChunks = {};
            let chunks = getBytesizedChunks(md.old.artwork.file.src, 64, false);
            chunks.filter((chunk, i) => fileChunks[i + 1] = chunk);

            md["new"] = {
                about: {
                    name: md.old.name,
                    artist: "Benzega",
                    description: "One-of-a-kind pop art pixel peep living on the blockchain!",
                    links: {
                        homepage: "cryptopeeps.io",
                        github: "github.com/cryptopeeps",
                        reddit: "reddit.com/r/cryptopeeps",
                        artist: "benzega.com"
                    },
                    properties: md.old.artwork.attributes
                },
                files: [{
                    proximity: "on-chain",
                    media_type: "image/svg+xml",
                    src: {
                        chunks: fileChunks
                    }
                }],
            }

            if (opts.test) {
                inspect(md["new"]);
            } else {
                console.log(aN);
                fs.renameSync(dir + `/${aN}/artwork.chunked.final.json`, dir + `/${aN}/artwork.chunked.v2.json`)
                fs.writeFileSync(dir + `/${aN}/artwork.chunked.final.json`, JSON.stringify(md["new"]));
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
            md = JSON.parse(fs.readFileSync(dir + `/${aN}/artwork.chunked.array.final.json`));

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

            let md = JSON.parse(fs.readFileSync(dir + `/${aN}/artwork.chunked.final.json`));

            let chunkArr = [];

            for (const chunk in md.files[0].src.chunks) {
                chunkArr.push(md.files[0].src.chunks[chunk]);
            }

            delete md.files[0].src.chunks;
            md.files[0].src = chunkArr;

            if (opts.test) {
                inspect(md);
            } else {
                console.log(aN);
                fs.writeFileSync(dir + `/${aN}/${opts.title}`, JSON.stringify(md));
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
//         range: [1, 1]
//     }
// )

// ! Update artwork metadata property
updateArtworkMetadataProperty(
    'human',
    'normal',
    {
        test: false,
        range: [1,1]
    }
)

// ! New artwork meta
// createArtworkMetadata(
//     'human',
//     'normal', {
//         title: "artwork.chunked.array.final.json",
//         test: false,
//         range: [1, 1]
//     }
// );
