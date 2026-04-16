/**
 * Shared type definitions for the AI docs digest pipeline.
 */

/** A normalized, deduplicated change item from a PR or direct commit. */
export interface ChangeItem {
  /** Repository name (without org prefix). */
  repo: string;
  /** Whether this item originated from a merged PR or a direct commit. */
  sourceType: "pr" | "commit";
  /** PR number (as string) or commit SHA. */
  id: string;
  /** PR title or first line of the commit message. */
  title: string;
  /** PR body or full commit message. */
  description?: string;
  /** GitHub username of the author. */
  author?: string;
  /** ISO-8601 timestamp of merge (PR) or commit date. */
  mergedOrCommittedAt: string;
  /** Labels attached to the PR (empty for direct commits). */
  labels: string[];
  /** List of changed file paths. */
  changedFiles: string[];
  /** Lines added. */
  additions?: number;
  /** Lines deleted. */
  deletions?: number;
  /** Primary product area derived from file path mapping. */
  productArea?: string;
  /** Relevant documentation page groups derived from file path mapping. */
  docsArea?: string[];
  /** Audience visibility heuristic. */
  visibility?: "customer" | "internal" | "mixed" | "unknown";
  /** Semantic category heuristic. */
  category?: "new" | "changed" | "breaking" | "fix" | "internal";
  /** Evidence for docs impact reasoning. */
  evidence: {
    url?: string;
    refs: string[];
  };
}

/** Raw PR data as returned by the GitHub API (subset). */
export interface RawPR {
  repo: string;
  number: number;
  title: string;
  body: string | null;
  state: string;
  merged_at: string | null;
  user: { login: string } | null;
  labels: Array<{ name: string }>;
  html_url: string;
  additions: number;
  deletions: number;
  changed_files: number;
  files?: Array<{ filename: string }>;
  commits?: Array<{ sha: string }>;
}

/** Raw commit data as returned by the GitHub API (subset). */
export interface RawCommit {
  repo: string;
  sha: string;
  commit: {
    message: string;
    author: { name: string; date: string } | null;
  };
  author: { login: string } | null;
  html_url: string;
  files?: Array<{ filename: string; additions: number; deletions: number }>;
  /** SHA of the merge commit that introduced this commit (if known). */
  prMergeSha?: string;
}

/** Docs area mapping rule. */
export interface DocsAreaMappingRule {
  match: {
    paths: string[];
  };
  docs_area: string;
  confidence: "high" | "medium" | "low";
}

/** Aggregated state written to the artifacts directory between pipeline stages. */
export interface PipelineState {
  weekStart: string; // YYYY-MM-DD
  weekEnd: string; // YYYY-MM-DD
  weekLabel: string; // YYYY-MM-DD
  org: string;
  rawPRsFile: string;
  rawCommitsFile: string;
  normalizedFile: string;
  classifiedFile: string;
  promptFile: string;
  llmResponseFile: string;
  digestFile: string; // path inside repo
  digestAbsPath: string; // absolute path on disk
}
