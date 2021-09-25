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
                old: JSON.parse(fs.readFileSync(dir + `/${aN}/artwork.json`)),
            }

            let fileChunks = {};
            let chunks = getBytesizedChunks(md.old.artwork.file.src, 64, false);
            chunks.filter((chunk, i) => fileChunks[i] = chunk);

            md["new"] = {
                name: md.old.name,
                artist: "Benzega",
                description: "One-of-a-kind pop art pixel peep living on the blockchain!",
                attributes: md.old.artwork.attributes,
                files: [{
                    on_chain: true,
                    media_type: "image/svg+xml",
                    src: {
                        chunks: fileChunks,
                    }
                }],
                links: {
                    homepage: "cryptopeeps.io",
                    github: "github.com/cryptopeeps",
                    reddit: "reddit.com/r/cryptopeeps",
                    artist: "benzega.com"
                }
            }

            if (opts.test) {
                inspect(md["new"]);
                console.log(`Total: ${Buffer.byteLength(JSON.stringify(md["new"]))}`);
                console.log(`Description: ${Buffer.byteLength(md["new"].description)}`);
            } else {
                console.log(aN);
                fs.renameSync(dir + `/${aN}/artwork.json`, dir + `/${aN}/artwork.unchunked.v1.json`)
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
            md = JSON.parse(fs.readFileSync(dir + `/${aN}/artwork.chunked.final.json`));

            let obj = {
                proximity: "on-chain",
                media_type: "image/svg+xml",
                src: md.files[0].src,

            }

            md.files.splice(0,1);
            md.files.push(obj);

            if (opts.test) {
                inspect(md);
            } else {
                console.log(aN);
                 fs.writeFileSync(dir + `/${aN}/artwork.chunked.final.json`, JSON.stringify(md));
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
//     'normal',
//     {
//         test: true,
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
