import cohere
from keys import keys  

class llm:
    def __init__(self):
        self.api_keys = keys
        self.key_index = 0
        self.client = cohere.Client(self.api_keys[self.key_index])
        counter = 1
        found = False
        while counter <= len(self.api_keys):
            try:
                response = self.client.chat(
                    message='Say hi',
                    temperature=0.7,
                    k=0,
                    p=0.75
                )
                found = True
                break
            except:
                self.key_index = (self.key_index + 1)%len(self.api_keys)
                self.client = cohere.Client(self.api_keys[self.key_index])
                counter += 1
        if not found:
            print('All API keys exhausted.')

    def generate(self, prompt, mode='Stream', char_threshold=100):
        if mode == 'Stream':
            return self.stream_generate(prompt, char_threshold)
        else:
            return self.instant_generate(prompt)

    def instant_generate(self, prompt):
        counter = 1
        while counter <= len(self.api_keys):
            try:
                response = self.client.chat(
                    message=prompt,
                    temperature=0.7,
                    k=0,
                    p=0.75
                )
                return response.text
            except:
                self.key_index = (self.key_index + 1)%len(self.api_keys)
                self.client = cohere.Client(self.api_keys[self.key_index])
                counter += 1
        return 'All API keys exhausted.'

    def stream_generate(self, prompt, char_threshold):
        counter = 1
        while counter <= len(self.api_keys):
            try:
                response_text = ""
                for event in self.client.chat_stream(
                    message=prompt,
                    temperature=0.7,
                    k=0,
                    p=0.75
                ):
                    if event.event_type == "text-generation":
                        response_text += event.text
                        if len(response_text) >= char_threshold:
                            yield response_text
                            response_text = ""  # Reset response text after yielding
                    elif event.event_type == "stream-end":
                        if response_text:
                            yield response_text
                        return
            except:
                self.key_index = (self.key_index + 1)%len(self.api_keys)
                self.client = cohere.Client(self.api_keys[self.key_index])
                counter += 1
        yield 'All API keys exhausted.'