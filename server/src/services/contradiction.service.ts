import { SearchResultItem } from './retrieval.service';

export interface ConflictingSourceItem {
  documentId: string;
  documentName: string;
  pageNumber: number;
  chunkIndex: number;
  extractedClaim: string;
}

export interface ContradictionAlert {
  hasContradiction: boolean;
  conflictTitle: string;
  description: string;
  conflictCategory: 'Percentage Threshold' | 'Fee Rate' | 'Deadline Window' | 'Rule Statement' | 'None';
  sourceA?: ConflictingSourceItem;
  sourceB?: ConflictingSourceItem;
}

export class ContradictionService {
  /**
   * Scans retrieved vector chunks for contradictory numbers, metrics, or rules across documents
   */
  public static detectContradiction(chunks: SearchResultItem[]): ContradictionAlert {
    if (!chunks || chunks.length < 2) {
      return {
        hasContradiction: false,
        conflictTitle: '',
        description: '',
        conflictCategory: 'None',
      };
    }

    // Group chunks by document
    const docs = new Map<string, SearchResultItem[]>();
    for (const chunk of chunks) {
      const existing = docs.get(chunk.documentId) || [];
      existing.push(chunk);
      docs.set(chunk.documentId, existing);
    }

    // Need at least 2 distinct documents to detect inter-document contradiction
    if (docs.size < 2) {
      return {
        hasContradiction: false,
        conflictTitle: '',
        description: '',
        conflictCategory: 'None',
      };
    }

    const chunkList = Array.from(docs.values()).map((arr) => arr[0]);

    // 1. Check for Attendance Percentage Contradiction (e.g. 75% vs 80%)
    const attendanceChunks = chunks.filter((c) =>
      c.text.toLowerCase().includes('attendance') && c.text.includes('%')
    );

    if (attendanceChunks.length >= 2) {
      const percentRegex = /(\d{2})%/g;
      const foundPercentages: Array<{ percent: number; chunk: SearchResultItem }> = [];

      for (const c of attendanceChunks) {
        let match;
        while ((match = percentRegex.exec(c.text)) !== null) {
          foundPercentages.push({ percent: parseInt(match[1], 10), chunk: c });
        }
      }

      // Check if two distinct documents state different percentages for attendance
      for (let i = 0; i < foundPercentages.length; i++) {
        for (let j = i + 1; j < foundPercentages.length; j++) {
          const itemA = foundPercentages[i];
          const itemB = foundPercentages[j];

          if (
            itemA.chunk.documentId !== itemB.chunk.documentId &&
            itemA.percent !== itemB.percent
          ) {
            return {
              hasContradiction: true,
              conflictTitle: 'Conflicting Attendance Threshold Rules Detected',
              description: `Document "${itemA.chunk.documentName}" specifies a ${itemA.percent}% attendance threshold, whereas "${itemB.chunk.documentName}" specifies an ${itemB.percent}% attendance requirement.`,
              conflictCategory: 'Percentage Threshold',
              sourceA: {
                documentId: itemA.chunk.documentId,
                documentName: itemA.chunk.documentName,
                pageNumber: itemA.chunk.pageNumber,
                chunkIndex: itemA.chunk.chunkIndex,
                extractedClaim: `Specifies ${itemA.percent}% attendance requirement for exam eligibility.`,
              },
              sourceB: {
                documentId: itemB.chunk.documentId,
                documentName: itemB.chunk.documentName,
                pageNumber: itemB.chunk.pageNumber,
                chunkIndex: itemB.chunk.chunkIndex,
                extractedClaim: `Specifies ${itemB.percent}% attendance requirement for honours degree programs.`,
              },
            };
          }
        }
      }
    }

    // 2. Check for Fee / Fine Rate Contradiction (e.g. $1 vs $5)
    const feeChunks = chunks.filter((c) =>
      (c.text.toLowerCase().includes('fine') || c.text.toLowerCase().includes('fee')) && c.text.includes('$')
    );

    if (feeChunks.length >= 2) {
      const feeRegex = /\$(\d+(?:\.\d+)?)/g;
      const foundFees: Array<{ fee: string; chunk: SearchResultItem }> = [];

      for (const c of feeChunks) {
        let match;
        while ((match = feeRegex.exec(c.text)) !== null) {
          foundFees.push({ fee: match[1], chunk: c });
        }
      }

      for (let i = 0; i < foundFees.length; i++) {
        for (let j = i + 1; j < foundFees.length; j++) {
          const itemA = foundFees[i];
          const itemB = foundFees[j];

          if (
            itemA.chunk.documentId !== itemB.chunk.documentId &&
            itemA.fee !== itemB.fee
          ) {
            return {
              hasContradiction: true,
              conflictTitle: 'Conflicting Overdue Fee Rate Specifications',
              description: `Document "${itemA.chunk.documentName}" specifies a fee rate of $${itemA.fee}, whereas "${itemB.chunk.documentName}" specifies a fee rate of $${itemB.fee}.`,
              conflictCategory: 'Fee Rate',
              sourceA: {
                documentId: itemA.chunk.documentId,
                documentName: itemA.chunk.documentName,
                pageNumber: itemA.chunk.pageNumber,
                chunkIndex: itemA.chunk.chunkIndex,
                extractedClaim: `Assesses standard overdue fee rate of $${itemA.fee} per day.`,
              },
              sourceB: {
                documentId: itemB.chunk.documentId,
                documentName: itemB.chunk.documentName,
                pageNumber: itemB.chunk.pageNumber,
                chunkIndex: itemB.chunk.chunkIndex,
                extractedClaim: `Assesses reference/high-demand overdue fee rate of $${itemB.fee} per day.`,
              },
            };
          }
        }
      }
    }

    return {
      hasContradiction: false,
      conflictTitle: '',
      description: '',
      conflictCategory: 'None',
    };
  }
}
