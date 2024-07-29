import time
import llm_model

llm = llm_model.llm()
prompt = 'Write short note on LLMs.'

print(llm.generate(prompt, mode='None')) # Instant text generation

rate = 0.005
for response in llm.generate(prompt): # Character by character text generation
    for char in response:
        print(char, end='', flush=True) 
        time.sleep(rate)
