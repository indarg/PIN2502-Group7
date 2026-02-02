import DOMPurify from 'dompurify';
import { environment } from 'src/environments/environment';
export default class UtilService {

    static parseDate(dateTime: string) {
        if (dateTime) {
            const [year, month, day] = dateTime.split("T")[0].split("-");
            return `${day}/${month}/${year}`
        }
        return '';
    }
    static resolvePublicImage(image = '') {
        return '/public' + image
    }

    static resolveFile(image?: string) {
        if (!image)
            return '';
        if (image.includes("http"))
            return image;
        if (environment.ENV === "development")
            return `${environment.API_URL}${image}`;
        return '';
    }

    static createStyleImageAsBackground(image = '', size = 'cover', repeat = 'no-repeat', position = 'center') {
        return {
            backgroundImage: `url('${image}')`,
            backgroundSize: size,
            backgroundRepeat: repeat,
            backgroundPosition: position

        }

    }

    static scrollToTop = () => {
        window.scrollTo(0, 0);
    };
    static decodeBase64(string: string) {
        try {
            if (!string) return '';

            const decodedText = atob(string);

            return DOMPurify.sanitize(decodedText);
        } catch (error) {
            return DOMPurify.sanitize('<p>' + string + '</p>');
        }
    }

    static resolveImageUrl = (image: string | null) => {
        if (!image) return '';
        return image
    };

    static getPlainText = (html: string): string => {
        const div = document.createElement("div");
        div.innerHTML = html;
        return div.textContent || div.innerText || "";
    };
    static encodeBase64Unicode = (str: string) => {
        // 1. Codifica la cadena UTF-16 de JavaScript a un Uint8Array (UTF-8 bytes)
        const utf8Bytes = new TextEncoder().encode(str);

        // 2. Convierte el Uint8Array a una "cadena binaria" de Latin-1 compatible con btoa()
        //    (Cada byte del UTF-8 se mapea a un carácter Latin-1)
        const binaryString = String.fromCharCode(...utf8Bytes);

        // 3. Aplica btoa() a la cadena binaria
        return btoa(binaryString);
    }

    // Función para decodificar una cadena Base64 Unicode
    static decodeBase64Unicode = (base64String: string) => {
        // 1. Decodifica la cadena Base64 a una cadena binaria Latin-1
        const binaryString = atob(base64String);

        // 2. Convierte la cadena binaria Latin-1 de vuelta a un Uint8Array de bytes (UTF-8)
        const utf8Bytes = Uint8Array.from(binaryString, char => char.charCodeAt(0));

        // 3. Decodifica los bytes UTF-8 a una cadena UTF-16 de JavaScript
        return new TextDecoder().decode(utf8Bytes);
    }

    static escapeJson = (str: string): string => {
        if (!str) return "";
        return str
            .replace(/\\/g, "\\\\")  // escapar backslashes
            .replace(/"/g, '\\"')    // escapar comillas dobles
            .replace(/\n/g, "\\n")   // escapar saltos de línea
            .replace(/\r/g, "\\r");  // escapar retornos de carro
    };

    static stripHtml = (html: string): string => {
        if (!html) return "";
        return html
            .replace(/<[^>]*>?/gm, "")  // remove all HTML tags
            .replace(/\s+/g, " ")       // collapse multiple spaces/newlines
            .trim();                    // remove leading/trailing spaces
    };

    static mapObjectIdToFileUrl(objects:{id:number,fileName:string | undefined}[]){
        const imagesMapped:Map<number, string> = new Map<number,string >();
        for(const obj of objects){
            if (obj.fileName && obj.fileName.includes('/uploads/images')) {
                const imageFileName = obj.fileName.substring(obj.fileName.lastIndexOf('/') + 1, obj.fileName.lastIndexOf('.'));
                imagesMapped.set(obj.id, imageFileName);
            }
        }
        return imagesMapped;
    }
    
}