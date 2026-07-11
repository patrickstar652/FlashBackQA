import os
import sys
import types
import unittest
from unittest.mock import patch

sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

sys.modules.setdefault("dotenv", types.SimpleNamespace(load_dotenv=lambda *args, **kwargs: None))
_fake_pinecone_module = types.ModuleType("pinecone")
_fake_pinecone_module.Pinecone = lambda api_key: None
_fake_pinecone_module.ServerlessSpec = lambda *args, **kwargs: None
sys.modules.setdefault("pinecone", _fake_pinecone_module)


class _FakeInference:
    def __init__(self):
        self.calls = []

    def embed(self, model, inputs, parameters):
        self.calls.append(list(inputs))
        return [{"values": [len(text), 1]} for text in inputs]


class _FakePinecone:
    last_instance = None

    def __init__(self, api_key):
        self.api_key = api_key
        self.inference = _FakeInference()
        _FakePinecone.last_instance = self


class PineconeHostedEmbeddingsTests(unittest.TestCase):
    def test_embed_documents_batches_pinecone_requests_at_96_inputs(self):
        with patch.dict(os.environ, {"PINECONE_API_KEY": "test-key"}):
            import embedding
            with patch.object(embedding, "Pinecone", _FakePinecone):
                texts = [f"chunk {i}" for i in range(205)]
                vectors = embedding.PineconeHostedEmbeddings().embed_documents(texts)

        self.assertEqual(len(vectors), 205)
        batch_sizes = [len(call) for call in _FakePinecone.last_instance.inference.calls]
        self.assertEqual(batch_sizes, [96, 96, 13])
        self.assertTrue(all(size <= 96 for size in batch_sizes))


if __name__ == "__main__":
    unittest.main()
