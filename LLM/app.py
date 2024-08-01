import json

from flask import Flask, request, Response
from flask_cors import CORS
import llm_model

from uagents import Model
from uagents.query import query

app = Flask(__name__)
CORS(app)
llm = llm_model.llm()

uPDF_AGENT_ADDRESS = 'agent1qgs4vrgf72qnkffkn66a36rt2h6p2zcuaaqrstqzuj0a8x2el2m52jd7zrz'

class PDFQuery(Model):
    pdf_url: str
    query: str

@app.route('/api/updf', methods=['POST'])
async def uPdf():
    try:
        data = request.get_json()
        req = PDFQuery(pdf_url=data['pdf_url'], query=data['query'])
        response = await query(destination=uPDF_AGENT_ADDRESS, message=req, timeout=15.0)
        res = json.loads(response.decode_payload())
        print(res)
        return f"successful call - agent response: {res}"
    except Exception as e:
        print(e)
        return f"unsuccessful agent call: {str(e)}" 

@app.route('/llm', methods=['POST'])
def chat():
    data = request.get_json()
    prompt = data.get('query', '')

    return Response(llm.generate(prompt), content_type='text/plain')

if __name__ == '__main__':
    app.run(debug=True, port=5003)