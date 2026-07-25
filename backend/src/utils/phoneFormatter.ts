/**
 * Fungsi untuk menormalisasi nomor telepon ke format internasional Indonesia (+62)
 * Contoh:
 * 08123456789 -> 628123456789
 * +628123456789 -> 628123456789
 * 8123456789 -> 628123456789
 */

export const formatToID = (phone: string): string => {
    // 1. Hapus semua karakter selain angka (spasi, strip, tanda plus, dll)
    let cleaned = phone.replace(/\D/g, "");

    // 2. Jika diawali dengan '0', ganti menjadi '62'
    if(cleaned.startsWith("0")){
        cleaned = "62" + cleaned.substring(1);
    }

    // 3. Jika diawali dengan '8' (langsung ke provider), tambahkan '62' di depan
    if(cleaned.startsWith("8")){
        cleaned = "62" + cleaned;
    }

    // 4. Jika sudah diawali '62', biarkan saja

    // Opsional: Validasi panjang minimal (biasanya nomor HP Indo min 10-13 karakter)
    if(cleaned.length < 10){
        throw new Error("Format nomor telepon tidak valid");
    }

    return cleaned;
}