import axios from 'axios';

// Telegram API configuration using Vite environment variables
const TELEGRAM_TOKEN = import.meta.env.VITE_TELEGRAM_TOKEN;
const CHAT_ID = import.meta.env.VITE_CHAT_ID;
const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;

// Escapes special Markdown V2 characters to prevent formatting issues
function escapeMarkdown(text: string): string {
    return text.replace(/([_*[\]()~`>#+=|{}.!-])/g, '\\$1');
}

// Submits order data to Telegram chat via Bot API
export async function submitOrder(
    orderFormStore: any,  // Consider using proper interface for type safety
    accessoriesStore: any,
    casesSelectsStore: any,
    terminalsSelectsStore: any,
    inputsSelectsStore: any,
    orientationStore: any
): Promise<boolean> {
    // Construct structured Telegram message with emoji formatting
    const message = `
📦 *Новый заказ:*  
1️⃣ *Order Form Data:* ${escapeMarkdown(JSON.stringify(orderFormStore.orderFormData))}  
2️⃣ *Accessories Value:* ${escapeMarkdown(JSON.stringify(accessoriesStore.accessoriesValue))}  
3️⃣ *Cases Select Values:* ${escapeMarkdown(JSON.stringify(casesSelectsStore.selectValues))}  
4️⃣ *Terminals Select Values:* ${escapeMarkdown(JSON.stringify(terminalsSelectsStore.selectValues))}  
5️⃣ *Inputs Select Values:* ${escapeMarkdown(JSON.stringify(inputsSelectsStore.selectsValues))}  
6️⃣ *Orientation Value:* ${escapeMarkdown(JSON.stringify(orientationStore.orientationValue))}  
    `;

    try {
        // Send formatted message to Telegram API
        const response = await axios.post(TELEGRAM_API_URL, {
            chat_id: CHAT_ID,
            text: message,
            parse_mode: 'MarkdownV2' // Using modern MarkdownV2 formatting
        });
        
        // Log success response for debugging
        console.log('Telegram API response:', response.data);
        return true;
    } catch (error: any) {
        // Handle errors and log detailed error information
        console.error('Telegram API error:', error.response?.data || error.message);
        return false;
    }
}