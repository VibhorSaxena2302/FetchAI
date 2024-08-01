from flask import Flask, request, Response
from flask_cors import CORS
import time
import llm_model

app = Flask(__name__)
CORS(app)
llm = llm_model.llm()

@app.route('/llm', methods=['POST'])
def chat():
    data = request.get_json()
    prompt = data.get('query', '')

    return Response(llm.generate(prompt), content_type='text/plain')

if __name__ == '__main__':
    app.run(debug=True, port=5000)