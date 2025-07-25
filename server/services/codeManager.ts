import fs from 'fs/promises';
import path from 'path';

export class CodeManager {
  private codeFilePath: string;

  constructor() {
    this.codeFilePath = path.join(process.cwd(), 'codes.txt');
    this.ensureCodeFileExists();
  }

  private async ensureCodeFileExists(): Promise<void> {
    try {
      await fs.access(this.codeFilePath);
    } catch {
      await fs.writeFile(this.codeFilePath, '', 'utf-8');
    }
  }

  async getAllCodes(): Promise<string[]> {
    try {
      const content = await fs.readFile(this.codeFilePath, 'utf-8');
      return content
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0);
    } catch (error) {
      console.error('Error reading codes file:', error);
      return [];
    }
  }

  async addCode(code: string): Promise<boolean> {
    try {
      const codes = await this.getAllCodes();
      if (codes.includes(code)) {
        return false; // Code already exists
      }
      
      await fs.appendFile(this.codeFilePath, code + '\n', 'utf-8');
      return true;
    } catch (error) {
      console.error('Error adding code:', error);
      return false;
    }
  }

  async addBulkCodes(codes: string[]): Promise<string[]> {
    const addedCodes: string[] = [];
    const existingCodes = await this.getAllCodes();
    
    for (const code of codes) {
      const trimmedCode = code.trim();
      if (trimmedCode && !existingCodes.includes(trimmedCode)) {
        try {
          await fs.appendFile(this.codeFilePath, trimmedCode + '\n', 'utf-8');
          addedCodes.push(trimmedCode);
          existingCodes.push(trimmedCode);
        } catch (error) {
          console.error('Error adding code:', trimmedCode, error);
        }
      }
    }
    
    return addedCodes;
  }

  async getAndRemoveFirstCode(): Promise<string | null> {
    try {
      const codes = await this.getAllCodes();
      if (codes.length === 0) {
        return null;
      }
      
      const firstCode = codes[0];
      const remainingCodes = codes.slice(1);
      
      await fs.writeFile(this.codeFilePath, remainingCodes.join('\n') + (remainingCodes.length > 0 ? '\n' : ''), 'utf-8');
      
      return firstCode;
    } catch (error) {
      console.error('Error getting and removing code:', error);
      return null;
    }
  }

  async removeCode(codeToRemove: string): Promise<boolean> {
    try {
      const codes = await this.getAllCodes();
      const filteredCodes = codes.filter(code => code !== codeToRemove);
      
      if (filteredCodes.length === codes.length) {
        return false; // Code not found
      }
      
      await fs.writeFile(this.codeFilePath, filteredCodes.join('\n') + (filteredCodes.length > 0 ? '\n' : ''), 'utf-8');
      return true;
    } catch (error) {
      console.error('Error removing code:', error);
      return false;
    }
  }

  async getCodesCount(): Promise<number> {
    const codes = await this.getAllCodes();
    return codes.length;
  }
}

export const codeManager = new CodeManager();
