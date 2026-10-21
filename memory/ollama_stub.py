import json, sys
from http.server import BaseHTTPRequestHandler, HTTPServer

RESP = {
    "resumo": "Descrição curta e genérica; faltam dados importantes.",
    "pontosPositivos": ["Nome do produto claro"],
    "oportunidades": [
        {"problema": "Descrição muito curta", "motivo": "Leitores de tela não transmitem detalhes", "recomendacao": "Descreva material e uso", "prioridade": "ALTA"},
        {"problema": "Abreviação 'pç'", "motivo": "Pode não ser compreendida", "recomendacao": "Escreva 'peça'", "prioridade": "baixa"},
    ],
    "dadosAConfirmar": ["Material", "Cor"],
    "sugestaoDescricao": "Camiseta básica. Material: [informar material]. Peso 0,2 kg e 99 cm.",
    "sugestaoTextoAlternativo": "Foto da camiseta básica",
}

class H(BaseHTTPRequestHandler):
    def _send(self, code, obj):
        b = json.dumps(obj).encode()
        self.send_response(code); self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(b))); self.end_headers(); self.wfile.write(b)
    def do_GET(self):
        self._send(200, {"models": [{"name": "llama3.1:8b"}]})
    def do_POST(self):
        body = json.loads(self.rfile.read(int(self.headers["Content-Length"])))
        open("/tmp/ollama_last_request.json", "w").write(json.dumps(body, ensure_ascii=False, indent=1))
        self._send(200, {"message": {"role": "assistant", "content": json.dumps(RESP, ensure_ascii=False)}, "done": True})

HTTPServer(("127.0.0.1", int(sys.argv[1])), H).serve_forever()
