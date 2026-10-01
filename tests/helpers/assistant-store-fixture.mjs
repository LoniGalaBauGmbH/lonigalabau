// Mutable fake at the engine boundary. Actual SQL grants/search/leases are tested separately.
export function createStore() {
  const docs = new Map(),
    projects = new Map();
  return {
    saveDocument(d) {
      const id = d.id ?? crypto.randomUUID();
      const value = { ...d, id, source: d.source ?? "", version: (docs.get(id)?.version ?? 0) + 1 };
      docs.set(id, value);
      return structuredClone(value);
    },
    deleteDocument(id) {
      docs.delete(id);
    },
    listDocuments() {
      return structuredClone([...docs.values()]);
    },
    createProject(p) {
      const value = {
        ...p,
        id: crypto.randomUUID(),
        messages: [{ role: "user", content: p.content }],
      };
      projects.set(value.id, value);
      return structuredClone(value);
    },
    updateProject(id, change) {
      Object.assign(projects.get(id), change);
    },
    getProject(id) {
      return structuredClone(projects.get(id));
    },
    listProjects() {
      return structuredClone([...projects.values()]);
    },
    searchKnowledge() {
      return [...docs.values()]
        .filter((d) => d.approved)
        .map((d) => ({
          documentId: d.id,
          title: d.title,
          source: d.source,
          version: d.version,
          chunkId: `${d.id}:v${d.version}:0`,
          text: d.content,
          score: 1,
        }));
    },
    close() {},
  };
}
