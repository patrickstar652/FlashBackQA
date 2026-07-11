import os
import sys
import types
import unittest
from unittest.mock import patch

sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

sys.modules.setdefault("dotenv", types.SimpleNamespace(load_dotenv=lambda *args, **kwargs: None))
_fake_pinecone_module = types.ModuleType("pinecone")
_fake_pinecone_module.Pinecone = lambda *args, **kwargs: None
_fake_pinecone_module.ServerlessSpec = lambda *args, **kwargs: None
sys.modules.setdefault("pinecone", _fake_pinecone_module)

_yaml_module = types.ModuleType("yaml")
def _safe_load(text):
    data = {}
    for line in text.splitlines():
        if ":" in line:
            key, value = line.split(":", 1)
            data[key.strip()] = value.strip()
    return data
_yaml_module.safe_load = _safe_load
sys.modules.setdefault("yaml", _yaml_module)

import ingest_docs


class _FakeIndex:
    def __init__(self):
        self.deleted_filters = []
        self.upserted_vectors = []

    def delete(self, filter):
        self.deleted_filters.append(filter)
        return {}

    def upsert(self, vectors):
        self.upserted_vectors.extend(vectors)
        return {"upserted_count": len(vectors)}

    def describe_index_stats(self):
        return {"vector_count": len(self.upserted_vectors)}


class _FakeEmbeddings:
    def embed_documents(self, texts):
        return [[float(i), 0.0] for i, _ in enumerate(texts)]


class IngestDocsTests(unittest.TestCase):
    def test_ingest_replaces_existing_note_chunks_and_uses_stable_ids(self):
        blob_v1 = """---
id: note-1
title: Old title
---
第一段。第二段。第三段。
"""
        blob_v2 = """---
id: note-1
title: New title
---
更新後第一段。更新後第二段。
"""
        index_v1 = _FakeIndex()
        index_v2 = _FakeIndex()

        with patch.object(ingest_docs, "pinecone_init", side_effect=[index_v1, index_v2]), \
             patch.object(ingest_docs, "get_embeddings", return_value=_FakeEmbeddings()):
            ingest_docs.ingest_blob(blob_v1)
            ingest_docs.ingest_blob(blob_v2)

        ids_v1 = [vector["id"] for vector in index_v1.upserted_vectors]
        ids_v2 = [vector["id"] for vector in index_v2.upserted_vectors]

        self.assertEqual(index_v1.deleted_filters, [{"source_id": {"$eq": "note-1"}}])
        self.assertEqual(index_v2.deleted_filters, [{"source_id": {"$eq": "note-1"}}])
        self.assertEqual(ids_v1, ids_v2)
        self.assertNotIn("Old title", ids_v1[0])
        self.assertEqual(index_v2.upserted_vectors[0]["metadata"]["source_id"], "note-1")
        self.assertIn("note_hash", index_v2.upserted_vectors[0]["metadata"])


if __name__ == "__main__":
    unittest.main()
