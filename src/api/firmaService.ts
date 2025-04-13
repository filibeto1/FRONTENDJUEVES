// src/api/firmaService.ts
import { JSEncrypt } from 'jsencrypt';
import * as CryptoJS from 'crypto-js';

const PRIVATE_KEY = `-----BEGIN PRIVATE KEY-----
MIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDkIDGSyHlYkAVS
43gz9XepkFd74TFz3Wr1XT1rhUdX5aN6+q5wceFQCuxVIDgpguSViBE9HtEvBvdv
6Aig3yS5F5VMzPfY1CZN2c4hybGdXFXHkrtQ4mdj1e72qgTXkOaffbspdX27obOn
tFkV1Shr83i3ZUNCBYdDSZlnuCP1wPK/bQqab9OfZJGsLnR35waJwfc9y3axF95h
lgxHlkAuutv1gIt44DMxQVzYXicMGWAJcEDBF7KF36sVJxWbKOdiwKJVLU58Zlk8
SfR6xLrvchdfnrFX0AsVP49wQzv7NwTmf28EYA+SDug+DT6gNxBlcZWvVQi9NhJY
wQvcmcsLAgMBAAECggEABKjjr6vd+VZ3xV8AGuTuB3il+3x4wMp1Ci4CuH+FxYsw
m60jLbN7IWIXvGVmwEem2PxpMxETah0qULmHSOybQ2ydOsRftlN0X4K4wy1A2NtZ
+omfaeI2BRle7Yrrg7u3T5VcjVbpCpFy/1SfvTfCwPG9itbMA5KOq2vaxlOXPch5
TSRCsHPM/+RMtsZznA09cK80ir8e8SIjKVlOgiv6suVHvR+cAdsqh/Ck5Rv+gdoo
NJbE6MXUgBNUMrV2efV1EpJm7dsFlfsxFvVQUfZsBbhIPI9+XzvQSJ/h829HM+MN
2C3zAI0CEN0hxwvNjrfY5CYOcQHfoxTfIshir7ZWgQKBgQD14Re3Apl6BMtl2Gd2
RA4uMUN0ySBEdNkmVUnZtd4HQVgCF8SssYkf8S1C84PFCMSEU1MyKWgQcLyA5ifN
xum/pGcQwMxrHuc/1BH+Kpn4RdOpy+Lwjwzcl79OO1g2sDNwQ8p8ckY/vtGSk78E
sZjjNUSQlqSRwPfdinrkaF7V3QKBgQDthAbTM6n19ymhCj9lwXQY/2H45zgh3jS3
5C0eA/witEZMqFANaizt8G1wgcAxd/w93REKmbZGLih3kBT7cheQR6EvnjRfmosB
iavccY4T+V6QWSO77ZJRVrZT82h5+oTHhe78CW32/TWwqLp6NwTA0otgjvCYtwvO
Xq8uEJeaBwKBgGAc1vpQ59GMoj1zdC4EuE5SL34tSJG541Basn2J2/qWDmLzC4w9
8c4spnavXejdXoQjVjgbe3RBvU3dqd2ETcb96tPfqYiOEfMfYNErsfgcw3pyGonS
QULRhpR8GiV2hwTxWut+d/tfCej0HA0npw3Zuq2SVU4sUjeldBhou/l5AoGAOwP/
HiNMK82KDnWZYxM6YauzEEGDdQbdWoPbogWjdIwOm6WGno6vMz/2MWpL8v65MjXn
shaXb8CwVWT7ka67pCHoLwjEQq0HtQ4cId4lS1k+4ecENgHFxWgiTaHBZ+2TaHAi
/YTqSeCIoqiKDSv2hmLKNufNaGSzDkgAhxWgVakCgYAVXbHWG8MEKc+iqGWp1jDE
4Lhkb8IK1owqY32ptMoF9nAdgkb/6oOf5HiCYZK9ZRKJJWwwrEo09jHGFD+Skswn
nu0/AZ5qVlYegaDy8o/aYy1xz5YwKUBKsWt77pDbpTm58rDX58iI2MtdfK3S3xUh
SZFGSlsiRlVAAN8LbGayHQ==
-----END PRIVATE KEY-----`;
export function generarFirma(data: any): string {
    try {
        // Cadena original específica para login
        const cadenaOriginal = `||${data.username}|${data.password}||`;
        console.log('Cadena original login frontend:', cadenaOriginal);
        
        const encrypt = new JSEncrypt();
        encrypt.setPrivateKey(PRIVATE_KEY);
        
        const firma = encrypt.sign(cadenaOriginal, (data) => {
            return CryptoJS.SHA256(data).toString(CryptoJS.enc.Hex);
        }, "sha256");
        
        if (!firma) throw new Error('Firma inválida');
        return firma;
    } catch (error) {
        console.error('Error en generarFirma:', error);
        throw new Error('Error al generar firma digital');
    }
}