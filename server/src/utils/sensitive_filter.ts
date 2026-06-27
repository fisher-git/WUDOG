export class SensitiveFilter {
  private words: Set<string> = new Set();

  loadWords(wordList: string[]): void {
    this.words = new Set(wordList.map(w => w.toLowerCase()));
  }

  hasSensitiveContent(text: string): boolean {
    const lowerText = text.toLowerCase();
    for (const word of this.words) {
      if (lowerText.includes(word)) return true;
    }
    return false;
  }

  filterText(text: string): { clean: string; hasSensitive: boolean } {
    let clean = text;
    let hasSensitive = false;
    for (const word of this.words) {
      const regex = new RegExp(word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
      if (regex.test(clean)) {
        hasSensitive = true;
        clean = clean.replace(regex, '***');
      }
    }
    return { clean, hasSensitive };
  }
}
