/**
 * CSV Parser utility for importing flashcards
 * Expected format: front,back,example
 */

export interface CSVCard {
  front: string;
  back: string;
  example?: string;
}

export interface ParseResult {
  success: boolean;
  cards: CSVCard[];
  errors: string[];
}

/**
 * Parse a CSV string into card objects
 */
export function parseCSV(csvText: string): ParseResult {
  const lines = csvText.split('\n').map((line) => line.trim()).filter((line) => line.length > 0);
  const cards: CSVCard[] = [];
  const errors: string[] = [];

  if (lines.length === 0) {
    return {
      success: false,
      cards: [],
      errors: ['CSV file is empty'],
    };
  }

  // Check if first line is a header
  const firstLine = lines[0].toLowerCase();
  const hasHeader =
    firstLine.includes('front') || firstLine.includes('back') || firstLine.includes('example');

  const startIndex = hasHeader ? 1 : 0;

  for (let i = startIndex; i < lines.length; i++) {
    const lineNumber = i + 1;
    const line = lines[i];

    try {
      const parsed = parseCSVLine(line);

      if (parsed.length < 2) {
        errors.push(`Line ${lineNumber}: Missing required fields (need at least front and back)`);
        continue;
      }

      const [front, back, example] = parsed;

      if (!front || !back) {
        errors.push(`Line ${lineNumber}: Front or back field is empty`);
        continue;
      }

      cards.push({
        front: front.trim(),
        back: back.trim(),
        example: example ? example.trim() : undefined,
      });
    } catch (error) {
      errors.push(`Line ${lineNumber}: ${error instanceof Error ? error.message : 'Parse error'}`);
    }
  }

  return {
    success: errors.length === 0,
    cards,
    errors,
  };
}

/**
 * Parse a single CSV line, handling quoted fields
 */
function parseCSVLine(line: string): string[] {
  const fields: string[] = [];
  let currentField = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // Escaped quote
        currentField += '"';
        i++; // Skip next quote
      } else {
        // Toggle quote mode
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      // Field separator
      fields.push(currentField);
      currentField = '';
    } else {
      currentField += char;
    }
  }

  // Add the last field
  fields.push(currentField);

  return fields;
}

/**
 * Convert cards to CSV format
 */
export function cardsToCSV(cards: CSVCard[]): string {
  const lines: string[] = ['front,back,example'];

  for (const card of cards) {
    const front = escapeCSVField(card.front);
    const back = escapeCSVField(card.back);
    const example = card.example ? escapeCSVField(card.example) : '';

    lines.push(`${front},${back},${example}`);
  }

  return lines.join('\n');
}

/**
 * Escape a field for CSV format
 */
function escapeCSVField(field: string): string {
  // If field contains comma, newline, or quote, wrap in quotes
  if (field.includes(',') || field.includes('\n') || field.includes('"')) {
    // Escape quotes by doubling them
    const escaped = field.replace(/"/g, '""');
    return `"${escaped}"`;
  }
  return field;
}

/**
 * Validate a CSV file
 */
export function validateCSV(csvText: string): { valid: boolean; error?: string } {
  if (!csvText || csvText.trim().length === 0) {
    return { valid: false, error: 'CSV file is empty' };
  }

  const lines = csvText.split('\n').filter((line) => line.trim().length > 0);

  if (lines.length === 0) {
    return { valid: false, error: 'No valid lines found in CSV' };
  }

  // Check if at least one line has commas
  const hasCommas = lines.some((line) => line.includes(','));
  if (!hasCommas) {
    return { valid: false, error: 'CSV must use commas as field separators' };
  }

  return { valid: true };
}

/**
 * Generate a sample CSV for download
 */
export function generateSampleCSV(): string {
  const sample: CSVCard[] = [
    {
      front: 'hello',
      back: 'cześć',
      example: 'Hello, how are you?',
    },
    {
      front: 'goodbye',
      back: 'do widzenia',
      example: 'Goodbye, see you tomorrow!',
    },
    {
      front: 'thank you',
      back: 'dziękuję',
      example: 'Thank you very much!',
    },
  ];

  return cardsToCSV(sample);
}
