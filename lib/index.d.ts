import { Readable } from 'stream';

interface Hash {
    (data: string | Buffer, encoding?: string | undefined): string | Buffer;
}

interface Hmac {
    (data: string | Buffer, key: string | Buffer, encoding?: string | undefined): string | Buffer;
}

export function createHash(algorithm: string): Hash;

export function createHmac(algorithm: string): Hmac;

export function encode(str: string, encoding: string): Buffer;

export function getIPv4(): string;

export function getMac(): string;

export function getYYYYMMDD(date: Date): string;

export function loadJSONSync(filename: string): any;

export function makeHasher(algorithm: string): Hash;

export function makeNonce(): string;

export function md5(data: string | Buffer, encoding?: string | undefined): string;

export function pad2(num: number): string;

export function pad3(num: number): string;

export function random(min: number, max: number): number;

export function sha1(data: string | Buffer, key: string, encoding?: string | undefined): string | Buffer;

export function sleep(ms: number): Promise<void>;

export function readAll(readable: Readable): Promise<Buffer>;
