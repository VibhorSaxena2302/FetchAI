import cohere
import time

# Initialize the Cohere client
co = cohere.Client('0ioIA8dB9N4B0pwUaCABEW9udSz9ruX1bt9n7zUw')  # Replace with your actual API key

def get_response(prompt, char_threshold=100):
    response_text = ""
    for event in co.chat_stream(
        message=prompt,
        temperature=0.7,
        k=0,
        p=0.75
    ):
        if event.event_type == "text-generation":
            response_text += event.text
            # Only yield if the accumulated response reaches a certain number of characters
            if len(response_text) >= char_threshold:
                yield response_text
                response_text = ""  # Reset response text after yielding
        elif event.event_type == "stream-end":
            # If there's any remaining text that hasn't been yielded yet, yield it
            if response_text:
                yield response_text
            break

prompt = 'Write a brief about llm models.'
respons = ''
for response in get_response(prompt, char_threshold=100):
    respons += response
    for char in response:
        print(char, end='', flush=True)  # Print each character without adding extra space
        time.sleep(.02)