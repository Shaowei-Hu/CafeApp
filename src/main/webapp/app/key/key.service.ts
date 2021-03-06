import { Injectable } from '@angular/core';
import { JhiAlertService } from 'ng-jhipster';
import * as CryptoJS from 'crypto-js';

@Injectable()
export class KeyService {

    private keys: string;
    private newKey: string;

    constructor(private jhiAlertService: JhiAlertService) {}

    setKey(value: string) {
        this.keys = value;
    }

    encrypt(value): string {
        if (!this.keys) {
            this.jhiAlertService.error('Key dose not exist', null, null);
            return;
        }
        if (!value) {
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

    encryptWithNewKey(value): string {
        if (!this.newKey) {
            this.jhiAlertService.error('Key dose not exist', null, null);
            return;
        }
        if (!value) {
            return value;
        }
        const key = CryptoJS.enc.Utf8.parse(this.newKey);
        const iv = CryptoJS.enc.Utf8.parse(this.newKey);
        const encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(value.toString()), key,
            {
                'keySize': 128 / 8,
                'iv': iv,
                'mode': CryptoJS.mode.CBC,
                'padding': CryptoJS.pad.Pkcs7
            });

        return encrypted.toString();
    }

    decryptWithNewKey(value): string {
        if (!this.newKey || !value) {
            return value;
        }
        const key = CryptoJS.enc.Utf8.parse(this.newKey);
        const iv = CryptoJS.enc.Utf8.parse(this.newKey);
        const decrypted = CryptoJS.AES.decrypt(value, key, {
            'keySize': 128 / 8,
            'iv': iv,
            'mode': CryptoJS.mode.CBC,
            'padding': CryptoJS.pad.Pkcs7
        });

        return decrypted.toString(CryptoJS.enc.Utf8);
    }

}
