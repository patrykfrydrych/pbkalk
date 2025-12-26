#!/usr/bin/env node
import fs from 'fs';
import readline from 'readline';
import zlib from 'zlib';

const args = process.argv.slice(2);
const sourcePath = args[0] || 'db_cluster-25-12-2025@03-28-08.backup.gz';
const outputPath = args[1] || 'calculator_data.json';

const decodeCopyValue = (value) => {
    if (value === '\\N') return null;
    let result = '';
    for (let i = 0; i < value.length; i += 1) {
        const char = value[i];
        if (char === '\\') {
            const next = value[i + 1];
            i += 1;
            switch (next) {
                case 't':
                    result += '\t';
                    break;
                case 'n':
                    result += '\n';
                    break;
                case 'r':
                    result += '\r';
                    break;
                case 'b':
                    result += '\b';
                    break;
                case 'f':
                    result += '\f';
                    break;
                case '\\':
                    result += '\\';
                    break;
                default:
                    result += next || '';
                    break;
            }
        } else {
            result += char;
        }
    }
    return result;
};

const sourceStream = fs.createReadStream(sourcePath);
const input = sourcePath.endsWith('.gz')
    ? sourceStream.pipe(zlib.createGunzip())
    : sourceStream;

const rl = readline.createInterface({
    input,
    crlfDelay: Infinity
});

const records = [];
let inCopySection = false;

const run = async () => {
    for await (const line of rl) {
        if (!inCopySection) {
            if (line.startsWith('COPY public.calculator_data')) {
                inCopySection = true;
            }
            continue;
        }

        if (line === '\\.') {
            break;
        }

        const parts = line.split('\t');
        if (parts.length < 3) {
            continue;
        }

        const key = decodeCopyValue(parts[0]);
        const dataRaw = decodeCopyValue(parts[1]);
        const lastUpdate = decodeCopyValue(parts[2]);

        if (!key) {
            continue;
        }

        let parsedData = null;
        if (dataRaw) {
            try {
                parsedData = JSON.parse(dataRaw);
            } catch (error) {
                parsedData = dataRaw;
            }
        }

        records.push({
            key,
            data: parsedData,
            last_update: lastUpdate
        });
    }

    fs.writeFileSync(outputPath, JSON.stringify(records, null, 2));
    console.log(`Exported ${records.length} records to ${outputPath}`);
};

run().catch((error) => {
    console.error('Export failed:', error);
    process.exit(1);
});
