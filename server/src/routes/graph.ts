import { Router, Request, Response } from 'express';
import { inMemoryStore } from '../storage/inMemoryStore';

const router = Router();

export interface GraphNode {
  id: string;
  label: string;
  type: 'document' | 'topic' | 'rule' | 'chunk';
  category?: string;
  details?: Record<string, any>;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
}

/**
 * GET /api/graph/topology
 * Returns interactive knowledge graph nodes and edges from active knowledge base
 */
router.get('/topology', (req: Request, res: Response) => {
  const documents = inMemoryStore.getDocuments();
  const chunks = inMemoryStore.getAllChunks();

  const nodes: GraphNode[] = [];
  const edges: GraphEdge[] = [];

  // Add Static Core Topic Nodes
  const topicNodes: GraphNode[] = [
    { id: 'top-attendance', label: 'Attendance & Exam Eligibility', type: 'topic', category: 'Academic Rules' },
    { id: 'top-appeals', label: 'Grade Appeals & Re-Evaluation', type: 'topic', category: 'Examination' },
    { id: 'top-fines', label: 'Library Circulation & Fines', type: 'topic', category: 'Facilities' },
    { id: 'top-housing', label: 'Residence Hall Conduct & Parking', type: 'topic', category: 'Administration' },
  ];
  nodes.push(...topicNodes);

  // Add Static Core Rule Nodes
  const ruleNodes: GraphNode[] = [
    { id: 'rule-75-att', label: '75% Minimum Attendance Threshold', type: 'rule', category: 'Academic Rules' },
    { id: 'rule-80-honours', label: '80% Honours Attendance Requirement', type: 'rule', category: 'Academic Rules' },
    { id: 'rule-10d-appeal', label: '10-Day Grade Appeal Window ($25)', type: 'rule', category: 'Examination' },
    { id: 'rule-1d-fine', label: '$1.00/Day Textbook Overdue Fine', type: 'rule', category: 'Facilities' },
    { id: 'rule-15-parking', label: '$15 Term Student Parking Permit', type: 'rule', category: 'Administration' },
  ];
  nodes.push(...ruleNodes);

  // Connect Topics to Rules
  edges.push(
    { id: 'e-t1-r1', source: 'top-attendance', target: 'rule-75-att', label: 'Mandates' },
    { id: 'e-t1-r2', source: 'top-attendance', target: 'rule-80-honours', label: 'Amends' },
    { id: 'e-t2-r3', source: 'top-appeals', target: 'rule-10d-appeal', label: 'Governs' },
    { id: 'e-t3-r4', source: 'top-fines', target: 'rule-1d-fine', label: 'Assesses' },
    { id: 'e-t4-r5', source: 'top-housing', target: 'rule-15-parking', label: 'Requires' }
  );

  // Add Document Nodes & Edges
  documents.forEach((doc, idx) => {
    const docNodeId = `doc-node-${doc.documentId}`;
    nodes.push({
      id: docNodeId,
      label: doc.name,
      type: 'document',
      category: doc.category,
      details: {
        fileType: doc.fileType,
        chunksCount: doc.chunksCount,
        trustScore: doc.trustScore,
        size: doc.sizeBytes,
      },
    });

    // Map documents to relevant topic nodes
    if (doc.name.toLowerCase().includes('handbook')) {
      edges.push({ id: `e-d${idx}-t1`, source: docNodeId, target: 'top-attendance', label: 'Defines' });
    } else if (doc.name.toLowerCase().includes('circular')) {
      edges.push({ id: `e-d${idx}-t1`, source: docNodeId, target: 'top-attendance', label: 'Amends' });
    } else if (doc.name.toLowerCase().includes('evaluation') || doc.name.toLowerCase().includes('appeal')) {
      edges.push({ id: `e-d${idx}-t2`, source: docNodeId, target: 'top-appeals', label: 'Defines' });
    } else if (doc.name.toLowerCase().includes('library')) {
      edges.push({ id: `e-d${idx}-t3`, source: docNodeId, target: 'top-fines', label: 'Defines' });
    } else {
      edges.push({ id: `e-d${idx}-t4`, source: docNodeId, target: 'top-housing', label: 'Defines' });
    }
  });

  // Add sample chunk nodes for interactive lineage
  chunks.slice(0, 8).forEach((chunk, cIdx) => {
    const chunkNodeId = `chunk-node-${chunk.chunkId}`;
    nodes.push({
      id: chunkNodeId,
      label: `Chunk #${chunk.chunkIndex} (Page ${chunk.pageNumber})`,
      type: 'chunk',
      category: chunk.documentName,
      details: {
        text: chunk.text,
        documentName: chunk.documentName,
        pageNumber: chunk.pageNumber,
        characterCount: chunk.characterCount,
      },
    });

    edges.push({
      id: `e-c${cIdx}`,
      source: `doc-node-${chunk.documentId}`,
      target: chunkNodeId,
      label: 'Contains',
    });
  });

  res.status(200).json({
    summary: {
      totalDocuments: documents.length,
      totalTopics: topicNodes.length,
      totalRules: ruleNodes.length,
      totalChunks: chunks.length,
      totalNodes: nodes.length,
      totalEdges: edges.length,
    },
    nodes,
    edges,
  });
});

export default router;
