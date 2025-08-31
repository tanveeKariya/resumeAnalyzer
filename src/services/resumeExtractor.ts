// Resume Text Extraction Service
export class ResumeExtractor {
  static async extractTextFromPDF(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const arrayBuffer = e.target?.result as ArrayBuffer;
          const uint8Array = new Uint8Array(arrayBuffer);
          
          // Simple PDF text extraction (for demo purposes)
          // In production, you'd use a proper PDF parsing library
          const text = new TextDecoder().decode(uint8Array);
          
          // Extract readable text from PDF (simplified)
          const extractedText = text.replace(/[^\x20-\x7E\n]/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
          
          resolve(extractedText || 'Unable to extract text from PDF');
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  }

  static async extractTextFromDOCX(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const arrayBuffer = e.target?.result as ArrayBuffer;
          // For demo purposes, return a placeholder
          // In production, you'd use mammoth.js or similar
          resolve('DOCX content extracted (demo mode)');
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  }

  static async getResumeText(file: File): Promise<string> {
    if (file.type === 'application/pdf') {
      return this.extractTextFromPDF(file);
    } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      return this.extractTextFromDOCX(file);
    } else {
      throw new Error('Unsupported file type');
    }
  }
}