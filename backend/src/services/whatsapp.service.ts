import axios from 'axios';
import logger from '../utils/logger';

export const sendWhatsAppOTP = async (phone: string, otp: string) => {
    try {
        const response = await axios.post(
            'https://api.fonnte.com/send',
            {
                target: phone,
                message: `[NARAPOS] Kote OTP Anda adalah: *${otp}*. \n\nJangan berikan kode ini kepada siapapun. Kode berlaku selama 2 menit.`,
                // 
            },
            {
                headers: {
                    Authorization: process.env.FONNTE_TOKEN,
                },
            }
        );

        if(response.data.status){
            logger.info(`OTP berhasil dikirim ke ${phone} melalui Fonnte`);
        } else {
            logger.error(`Gagal mengirim pesan via Fonnte: `, response.data.reason);
        }
    } catch (error: any) {
        logger.error('WhatsApp Service Error (Fonnte):', error.response?.data || error.message);
        throw new Error('Gagal mengirim OTP via WhatsApp');
    }
}