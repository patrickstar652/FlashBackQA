import os

from dotenv import load_dotenv
from pinecone import Pinecone

load_dotenv(os.path.join(os.path.dirname(__file__), ".env"))

EMBEDDING_MODEL = os.getenv("PINECONE_EMBEDDING_MODEL", "llama-text-embed-v2")
EMBEDDING_DIMENSION = int(os.getenv("PINECONE_EMBEDDING_DIMENSION", "768"))


class PineconeHostedEmbeddings:
    def __init__(self):
        api_key = os.getenv("PINECONE_API_KEY")
        if not api_key:
            raise RuntimeError("Missing PINECONE_API_KEY in .env")
        self.pc = Pinecone(api_key=api_key)

    def _embed(self, texts, input_type):
        if not texts:
            return []

        response = self.pc.inference.embed(
            model=EMBEDDING_MODEL,
            inputs=texts,
            parameters={
                "input_type": input_type,
                "truncate": "END",
                "dimension": EMBEDDING_DIMENSION,
            },
        )

        vectors = []
        for item in response:
            values = getattr(item, "values", None)
            if values is None and isinstance(item, dict):
                values = item.get("values")
            if values is None:
                raise RuntimeError("Pinecone embedding response missing values")
            vectors.append([float(value) for value in values])
        return vectors

    def embed_query(self, text):
        return self._embed([text], "query")[0]

    def embed_documents(self, texts):
        return self._embed(texts, "passage")


def get_embeddings():
    return PineconeHostedEmbeddings()
