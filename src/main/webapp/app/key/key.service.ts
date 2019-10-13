import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable()
export class KeyService {

    private keys: string;

    constructor() {}

    setKey(value: string) {
        this.keys = value;
    }

    encrypt(value): string {
        if (!this.keys || !value) {
            return value;
        }
        const key = CryptoJS.enc.Utf8.parse(this.keys);
        const iv = CryptoJS.enc.Utf8.parse(this.keys);
        const encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(value.toString()), key,
            {
                'keySize': 128 / 8,
                'iv': iv,
                'mode': CryptoJS.mode.CBC,
                'padding': CryptoJS.pad.Pkcs7
            });

        return encrypted.toString();
    }

    decrypt(value): string {
        if (!this.keys || !value) {
            return value;
        }
        const key = CryptoJS.enc.Utf8.parse(this.keys);
        const iv = CryptoJS.enc.Utf8.parse(this.keys);
        const decrypted = CryptoJS.AES.decrypt(value, key, {
            'keySize': 128 / 8,
            'iv': iv,
            'mode': CryptoJS.mode.CBC,
            'padding': CryptoJS.pad.Pkcs7
        });

        return decrypted.toString(CryptoJS.enc.Utf8);
    }

}
